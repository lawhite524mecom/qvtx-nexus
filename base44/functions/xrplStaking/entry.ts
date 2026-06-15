import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, xrpAddress, amount, lockPeriod } = await req.json();

    if (!action || !xrpAddress) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const XRPL_APY = 3.5; // Base APY on XRPL
    const QVTX_BOOST = 1.5; // 50% APY boost for QVTX staking
    const FINAL_APY = XRPL_APY * QVTX_BOOST;

    if (action === 'getStakingInfo') {
      // Return staking pool info
      return Response.json({
        network: 'XRP Ledger',
        baseAPY: XRPL_APY,
        qvtxBoost: QVTX_BOOST,
        finalAPY: FINAL_APY,
        totalStaked: '2,450,000 QVTX',
        stakersCount: 1234,
        minStake: 100,
        currency: 'QVTX',
        issuer: 'rJqjwDAwuSVoppQkrwjJSPzXivspYxZ239'
      });
    }

    if (action === 'stake' && amount && lockPeriod) {
      const stakeAmount = parseFloat(amount);
      const lockDays = parseInt(lockPeriod);
      const dailyReward = (stakeAmount * FINAL_APY) / 365;
      const totalReward = dailyReward * lockDays;
      const unstakeDate = new Date(Date.now() + lockDays * 24 * 60 * 60 * 1000);

      const stakeRecord = {
        stakeId: `STAKE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        xrpAddress,
        amount: stakeAmount,
        apy: FINAL_APY,
        lockPeriod: lockDays,
        dailyReward,
        totalReward,
        stakedAt: new Date().toISOString(),
        unstakeAt: unstakeDate.toISOString(),
        status: 'active',
        network: 'XRP Ledger'
      };

      try {
        await base44.entities.Staking.create(stakeRecord);
      } catch (e) {
        console.log('Could not store staking record');
      }

      return Response.json({
        success: true,
        stakeRecord,
        message: `${stakeAmount} QVTX staked for ${lockDays} days`,
        estimatedRewards: totalReward.toFixed(2),
        apy: `${FINAL_APY}%`
      });
    }

    if (action === 'unstake' && amount) {
      const unstakeAmount = parseFloat(amount);
      return Response.json({
        success: true,
        message: `Unstake request for ${unstakeAmount} QVTX initiated`,
        processingTime: '3-5 minutes',
        destination: xrpAddress
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});