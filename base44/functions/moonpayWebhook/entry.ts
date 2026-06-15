import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { ethers } from 'npm:ethers@6.13.0';
import { createHmac } from 'node:crypto';

const QVTX_PRICE_USD = 5.33; // Update this or fetch from oracle
const QVTX_TOKEN_ADDRESS = "0x817F9b61ae0FC99F617Cda74B4CA56063712A54d"; // WQVTX on QVTX Chain
const QVTX_RPC = "http://162.254.36.25:8545";

Deno.serve(async (req) => {
  try {
    const signature = req.headers.get('moonpay-signature');
    const body = await req.text();
    
    // Verify webhook signature
    const expectedSignature = createHmac('sha256', Deno.env.get('MOONPAY_SECRET_KEY'))
      .update(body)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return Response.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const event = JSON.parse(body);
    
    // Only process completed transactions
    if (event.type !== 'transaction_updated' || event.data.status !== 'completed') {
      return Response.json({ message: 'Event ignored' }, { status: 200 });
    }

    const base44 = createClientFromRequest(req);
    const transaction = event.data;
    
    // Calculate QVTX amount to send
    const fiatAmount = parseFloat(transaction.baseCurrencyAmount);
    const qvtxAmount = (fiatAmount / QVTX_PRICE_USD).toFixed(6);
    
    // Send QVTX from treasury to user
    const provider = new ethers.JsonRpcProvider(QVTX_RPC);
    const treasuryWallet = new ethers.Wallet(Deno.env.get('QVTX_TREASURY_PRIVATE_KEY'), provider);
    
    const tokenAbi = [
      "function transfer(address to, uint256 amount) returns (bool)"
    ];
    const tokenContract = new ethers.Contract(QVTX_TOKEN_ADDRESS, tokenAbi, treasuryWallet);
    
    const tx = await tokenContract.transfer(
      transaction.walletAddress,
      ethers.parseEther(qvtxAmount)
    );
    
    await tx.wait();
    
    // Record transaction
    await base44.asServiceRole.entities.FiatPurchases.create({
      provider: 'moonpay',
      transactionId: transaction.id,
      userAddress: transaction.walletAddress,
      fiatAmount: fiatAmount,
      fiatCurrency: transaction.baseCurrency,
      qvtxAmount: qvtxAmount,
      txHash: tx.hash,
      status: 'completed',
      email: transaction.email
    });

    return Response.json({ 
      success: true, 
      txHash: tx.hash,
      qvtxAmount: qvtxAmount
    });
    
  } catch (error) {
    console.error('Moonpay webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});