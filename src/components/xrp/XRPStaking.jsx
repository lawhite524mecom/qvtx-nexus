import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  Coins,
  TrendingUp,
  RefreshCw,
  Check,
  AlertCircle,
  Lock,
  Info
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function XRPStaking({ xrpAddress, balance }) {
  const [stakingInfo, setStakingInfo] = useState(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [lockDays, setLockDays] = useState("30");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    fetchStakingInfo();
  }, []);

  const fetchStakingInfo = async () => {
    try {
      const response = await base44.functions.invoke('xrplStaking', {
        action: 'getStakingInfo'
      });
      setStakingInfo(response.data);
    } catch (error) {
      console.error("Error fetching staking info:", error);
    }
  };

  const handleStake = async () => {
    if (!stakeAmount || !xrpAddress) return;

    setLoading(true);
    try {
      const response = await base44.functions.invoke('xrplStaking', {
        action: 'stake',
        xrpAddress,
        amount: parseFloat(stakeAmount),
        lockPeriod: parseInt(lockDays)
      });

      setResult(response.data);
      setStakeAmount("");
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const estimatedRewards = stakeAmount && stakingInfo 
    ? (parseFloat(stakeAmount) * stakingInfo.finalAPY * parseInt(lockDays) / 365).toFixed(2)
    : "0.00";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Coins className="w-5 h-5 text-emerald-400" />
          XRP Ledger Staking
        </h3>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "info"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-black"
                : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            Pool Info
          </button>
          <button
            onClick={() => setActiveTab("stake")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "stake"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-black"
                : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            Stake Now
          </button>
        </div>

        {/* Pool Info */}
        {activeTab === "info" && stakingInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-white/50 mb-1">APY</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {stakingInfo.finalAPY}%
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-white/50 mb-1">Total Staked</p>
                <p className="text-lg font-bold text-white">
                  {stakingInfo.totalStaked}
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-white/50 mb-1">Stakers</p>
                <p className="text-lg font-bold text-white">
                  {stakingInfo.stakersCount}
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-white/50 mb-1">Min Stake</p>
                <p className="text-lg font-bold text-white">
                  {stakingInfo.minStake} QVTX
                </p>
              </div>
            </div>

            <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-white/60">
                <p className="font-semibold text-cyan-400 mb-1">QVTX Boost Active</p>
                <p>Get {stakingInfo.qvtxBoost}x the base XRPL APY when staking QVTX tokens</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stake Form */}
        {activeTab === "stake" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm text-white/60 mb-2 block">
                Stake Amount (QVTX)
              </label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="100"
                max={balance}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500/50 text-white"
                disabled={loading}
              />
              <p className="text-xs text-white/40 mt-1">
                Available: {balance} XRP
              </p>
            </div>

            <div>
              <label className="text-sm text-white/60 mb-2 block">
                Lock Period (Days)
              </label>
              <select
                value={lockDays}
                onChange={(e) => setLockDays(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500/50 text-white"
                disabled={loading}
              >
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
                <option value="180">180 Days</option>
                <option value="365">365 Days</option>
              </select>
            </div>

            {stakeAmount && stakingInfo && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-sm text-white/60 mb-2">Estimated Rewards</p>
                <p className="text-2xl font-bold text-emerald-400">
                  +{estimatedRewards} QVTX
                </p>
                <p className="text-xs text-white/40 mt-1">
                  at {stakingInfo.finalAPY}% APY for {lockDays} days
                </p>
              </div>
            )}

            <button
              onClick={handleStake}
              disabled={loading || !stakeAmount || !xrpAddress}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Staking...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Stake QVTX
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4"
            >
              {result.error ? (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{result.error}</p>
                </div>
              ) : (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <p className="font-semibold text-emerald-400">Stake Created</p>
                  </div>
                  <p className="text-sm text-white/60">{result.message}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}