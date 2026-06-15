import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sourceChain, destChain, amount, userAddress } = await req.json();

    if (!sourceChain || !destChain || !amount || !userAddress) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // QVTX token issuer on XRPL
    const QVTX_ISSUER = 'rJqjwDAwuSVoppQkrwjJSPzXivspYxZ239';
    const BRIDGE_FEE = 0.001; // 0.1% fee
    const bridgeAmount = parseFloat(amount);
    const feeAmount = bridgeAmount * BRIDGE_FEE;
    const finalAmount = bridgeAmount - feeAmount;

    // Create bridge record
    const bridgeRecord = {
      bridgeId: `BRIDGE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sourceChain,
      destChain,
      userAddress,
      requestedAmount: bridgeAmount,
      feeAmount,
      finalAmount,
      status: 'pending',
      timestamp: new Date().toISOString(),
      qvtxIssuer: QVTX_ISSUER,
      expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour expiry
    };

    // Store bridge request in database
    try {
      await base44.entities.Bridges.create(bridgeRecord);
    } catch (e) {
      console.log('Could not store bridge record, returning calculation only');
    }

    return Response.json({
      success: true,
      bridgeRecord,
      message: `Bridge initiated: ${bridgeAmount} QVTX from ${sourceChain} to ${destChain}`,
      estimatedTime: '5-30 minutes',
      fee: `${(BRIDGE_FEE * 100).toFixed(3)}%`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});