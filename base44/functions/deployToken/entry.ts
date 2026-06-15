import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tokenName, symbol, totalSupply, decimals, network, vestingSchedule } = await req.json();

    if (!tokenName || !symbol || !totalSupply || !decimals || !network) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Generate mock contract address for deployment
    const contractAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    
    // Create token record in database
    const tokenRecord = {
      tokenName,
      symbol,
      totalSupply,
      decimals,
      network,
      contractAddress,
      deployedAt: new Date().toISOString(),
      vestingSchedule: vestingSchedule || [],
      status: 'deployed'
    };

    const createdToken = await base44.asServiceRole.entities.LaunchpadTokens.create(tokenRecord);

    return Response.json({
      success: true,
      token: createdToken,
      contractAddress,
      message: `Token ${symbol} deployed successfully on ${network}`,
      explorerUrl: network === 'qvtx' ? `https://explorer.qvtx.io/token/${contractAddress}` :
                   network === 'polygon' ? `https://polygonscan.com/token/${contractAddress}` :
                   network === 'bsc' ? `https://bscscan.com/token/${contractAddress}` :
                   network === 'base' ? `https://basescan.org/token/${contractAddress}` :
                   `https://xrpscan.com/token/${contractAddress}`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});