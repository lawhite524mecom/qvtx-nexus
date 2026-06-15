import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import {
  Gift,
  TrendingUp,
  Clock,
  Zap,
  CheckCircle,
  RefreshCw,
  Sparkles
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

const REWARDS_CONTRACT = "0x7C8a52f406890AABe523774298e61AC53231005E";
const REWARDS_ABI = [
  "function stakes(address) view returns (uint256)",
  "function earned(address) view returns (uint256)",
  "function totalStaked() view returns (uint256)",
  "function rewardRate() view returns (uint256)",
  "function claimReward() external",
  "function stake(uint256) external",
  "function withdraw(uint256) external"
];

export default function RewardsTracker({ userAddress, onClaimSuccess }) {
  const [rewards, setRewards] = useState({
    earned: "0",
    staked: "0",
    rewardRate: "0",
    totalStaked: "0"
  });
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userAddress) {
      fetchRewards();
      const interval = setInterval(fetchRewards, 15000); // Update every 15 seconds
      return () => clearInterval(interval);
    }
  }, [userAddress]);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const provider = new ethers.JsonRpcProvider("https://rpc.qvtx.io");
      const contract = new ethers.Contract(REWARDS_CONTRACT, REWARDS_ABI, provider);

      const [earned, staked, rewardRate, totalStaked] = await Promise.all([
        contract.earned(userAddress),
        contract.stakes(userAddress),
        contract.rewardRate(),
        contract.totalStaked()
      ]);

      setRewards({
        earned: ethers.formatEther(earned),
        staked: ethers.formatEther(staked),
        rewardRate: ethers.formatEther(rewardRate),
        totalStaked: ethers.formatEther(totalStaked)
      });
    } catch (err) {
      console.error("Error fetching rewards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (parseFloat(rewards.earned) === 0) {
      setError("No rewards to claim");
      return;
    }

    try {
      setClaiming(true);
      setError("");

      if (!window.ethereum) {
        setError("Please connect your wallet");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(REWARDS_CONTRACT, REWARDS_ABI, signer);

      const tx = await contract.claimReward();
      await tx.wait();

      await fetchRewards();
      if (onClaimSuccess) onClaimSuccess();
      
    } catch (err) {
      console.error("Claim error:", err);
      setError(err.message || "Failed to claim rewards");
    } finally {
      setClaiming(false);
    }
  };

  const calculateDailyRewards = () => {
    if (parseFloat(rewards.staked) === 0) return "0";
    const dailyRate = parseFloat(rewards.rewardRate) * 86400; // seconds in a day
    return (dailyRate).toFixed(4);
  };

  return (
    <GlassCard gradient className="relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">QVTX Rewards</h3>
              <p className="text-sm text-white/50">Earn by staking & trading</p>
            </div>
          </div>
          <button
            onClick={fetchRewards}
            disabled={loading}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-white/60 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-white/50">Available Rewards</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">
              {parseFloat(rewards.earned).toFixed(4)} QVTX
            </p>
            <p className="text-xs text-white/40 mt-1">
              ≈ ${(parseFloat(rewards.earned) * 5.33).toFixed(2)} USD
            </p>
          </div>

          <div className="p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-white/50">Your Stake</span>
            </div>
            <p className="text-2xl font-bold text-cyan-400">
              {parseFloat(rewards.staked).toFixed(4)} QVTX
            </p>
            <p className="text-xs text-white/40 mt-1">
              {((parseFloat(rewards.staked) / parseFloat(rewards.totalStaked)) * 100).toFixed(2)}% of pool
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3 h-3 text-white/40" />
              <span className="text-xs text-white/50">Daily Rewards</span>
            </div>
            <p className="font-semibold text-emerald-400">{calculateDailyRewards()} QVTX</p>
          </div>

          <div className="p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3 h-3 text-white/40" />
              <span className="text-xs text-white/50">Reward Rate</span>
            </div>
            <p className="font-semibold text-cyan-400">
              {(parseFloat(rewards.rewardRate) * 100).toFixed(3)}%/sec
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm text-rose-400">
            {error}
          </div>
        )}

        <button
          onClick={handleClaim}
          disabled={claiming || parseFloat(rewards.earned) === 0}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {claiming ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Claiming...
            </>
          ) : parseFloat(rewards.earned) > 0 ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Claim {parseFloat(rewards.earned).toFixed(4)} QVTX
            </>
          ) : (
            <>
              <Gift className="w-5 h-5" />
              No Rewards Yet
            </>
          )}
        </button>

        {parseFloat(rewards.staked) === 0 && (
          <p className="text-xs text-center text-white/40 mt-3">
            Start staking to earn rewards automatically
          </p>
        )}
      </div>
    </GlassCard>
  );
}