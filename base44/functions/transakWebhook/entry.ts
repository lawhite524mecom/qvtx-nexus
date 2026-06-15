import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { ethers } from 'npm:ethers@6.13.0';
import { createHmac } from 'node:crypto';

const QVTX_PRICE_USD = 5.33;
const QVTX_TOKEN_ADDRESS = "0x817F9b61ae0FC99F617Cda74B4CA56063712A54d";
const QVTX_RPC = "http://162.254.36.25:8545";

Deno.serve(async (req) => {
  try {
    const signature = req.headers.get('x-webhook-signature');
    const body = await req.text();
    
    // Verify Transak webhook signature
    const expectedSignature = createHmac('sha256', Deno.env.get('TRANSAK_SECRET'))
      .update(body)
      .digest('base64');
    
    if (signature !== expectedSignature) {
      return Response.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const event = JSON.parse(body);
    
    // Only process completed orders
    if (event.eventName !== 'ORDER_COMPLETED') {
      return Response.json({ message: 'Event ignored' }, { status: 200 });
    }

    const base44 = createClientFromRequest(req);
    const order = event.data;
    
    // Calculate QVTX amount
    const fiatAmount = parseFloat(order.fiatAmount);
    const qvtxAmount = (fiatAmount / QVTX_PRICE_USD).toFixed(6);
    
    // Send QVTX tokens
    const provider = new ethers.JsonRpcProvider(QVTX_RPC);
    const treasuryWallet = new ethers.Wallet(Deno.env.get('QVTX_TREASURY_PRIVATE_KEY'), provider);
    
    const tokenAbi = [
      "function transfer(address to, uint256 amount) returns (bool)"
    ];
    const tokenContract = new ethers.Contract(QVTX_TOKEN_ADDRESS, tokenAbi, treasuryWallet);
    
    const tx = await tokenContract.transfer(
      order.walletAddress,
      ethers.parseEther(qvtxAmount)
    );
    
    await tx.wait();
    
    // Record transaction
    await base44.asServiceRole.entities.FiatPurchases.create({
      provider: 'transak',
      transactionId: order.id,
      userAddress: order.walletAddress,
      fiatAmount: fiatAmount,
      fiatCurrency: order.fiatCurrency,
      qvtxAmount: qvtxAmount,
      txHash: tx.hash,
      status: 'completed',
      email: order.email
    });

    return Response.json({ 
      success: true, 
      txHash: tx.hash,
      qvtxAmount: qvtxAmount
    });
    
  } catch (error) {
    console.error('Transak webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});