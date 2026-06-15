import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { ethers } from 'npm:ethers@6.13.0';

const REWARDS_CONTRACT = "0x7C8a52f406890AABe523774298e61AC53231005E";
const RPC_URL = "https://rpc.qvtx.io";

const REWARDS_ABI = [
  "function stakes(address) view returns (uint256)",
  "function earned(address) view returns (uint256)",
  "function totalStaked() view returns (uint256)",
  "function rewardRate() view returns (uint256)"
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userAddress } = await req.json();

    if (!userAddress) {
      return Response.json({ error: 'User address required' }, { status: 400 });
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(REWARDS_CONTRACT, REWARDS_ABI, provider);

    const [earned, staked, rewardRate, totalStaked] = await Promise.all([
      contract.earned(userAddress),
      contract.stakes(userAddress),
      contract.rewardRate(),
      contract.totalStaked()
    ]);

    return Response.json({
      earned: ethers.formatEther(earned),
      staked: ethers.formatEther(staked),
      rewardRate: ethers.formatEther(rewardRate),
      totalStaked: ethers.formatEther(totalStaked),
      dailyRewards: (parseFloat(ethers.formatEther(rewardRate)) * 86400).toFixed(4),
      shareOfPool: ((parseFloat(ethers.formatEther(staked)) / parseFloat(ethers.formatEther(totalStaked))) * 100).toFixed(2)
    });

  } catch (error) {
    console.error('Get rewards error:', error);
    return Response.json({ 
      error: error.message || 'Failed to fetch rewards' 
    }, { status: 500 });
  }
});