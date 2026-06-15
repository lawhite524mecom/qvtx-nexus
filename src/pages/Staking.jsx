import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Coins,
  TrendingUp,
  Clock,
  Users,
  Lock,
  Unlock,
  Calculator,
  Info,
  ChevronDown,
  Gift
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import StatCard from "../components/ui/StatCard";

export default function Staking() {
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [selectedPool, setSelectedPool] = useState(null);
  const [calcAmount, setCalcAmount] = useState("1000");
  const [calcPeriod, setCalcPeriod] = useState("365");

  const userStats = {
    stakedBalance: "5,250.00",
    pendingRewards: "125.75",
    totalEarned: "1,456.32",
    nextReward: "2h 15m"
  };

  const pools = [
    { 
      id: 1, 
      name: "Flexible Staking", 
      apy: "12.5%", 
      tvl: "$45.2M", 
      lockPeriod: "None", 
      minStake: "100 QVTX",
      yourStake: "1,250 QVTX",
      rewards: "45.32 QVTX",
      icon: Unlock,
      gradient: "from-cyan-500 to-blue-500"
    },
    { 
      id: 2, 
      name: "30-Day Lock", 
      apy: "18.5%", 
      tvl: "$125.8M", 
      lockPeriod: "30 days", 
      minStake: "500 QVTX",
      yourStake: "2,500 QVTX",
      rewards: "65.43 QVTX",
      icon: Lock,
      gradient: "from-emerald-500 to-teal-500"
    },
    { 
      id: 3, 
      name: "90-Day Lock", 
      apy: "24.0%", 
      tvl: "$234.5M", 
      lockPeriod: "90 days", 
      minStake: "1,000 QVTX",
      yourStake: "1,500 QVTX",
      rewards: "15.00 QVTX",
      icon: Lock,
      gradient: "from-violet-500 to-purple-500"
    },
    { 
      id: 4, 
      name: "365-Day Lock", 
      apy: "32.0%", 
      tvl: "$89.3M", 
      lockPeriod: "365 days", 
      minStake: "2,500 QVTX",
      yourStake: "0 QVTX",
      rewards: "0 QVTX",
      icon: Lock,
      gradient: "from-amber-500 to-orange-500"
    },
  ];

  const validators = [
    { name: "QVTX Official", address: "0x742d...35Cc", commission: "5%", staked: "$12.5M", delegators: "2,450" },
    { name: "Quantum Node", address: "0x8f3e...2a1B", commission: "7%", staked: "$8.2M", delegators: "1,890" },
    { name: "ChainGuard", address: "0xc4a2...89fD", commission: "6%", staked: "$6.8M", delegators: "1,234" },
  ];

  const calculateRewards = () => {
    const amount = parseFloat(calcAmount) || 0;
    const days = parseFloat(calcPeriod) || 0;
    const apy = 0.185; // 18.5% average
    const dailyRate = apy / 365;
    const reward = amount * dailyRate * days;
    return reward.toFixed(2);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            Staking Pools
          </h1>
          <p className="text-white/50">Stake your QVTX tokens to earn rewards</p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Your Staked Balance"
            value={`${userStats.stakedBalance} QVTX`}
            icon={Coins}
            accentColor="cyan"
            gradient="from-cyan-500/10 to-cyan-500/5"
          />
          <StatCard
            title="Pending Rewards"
            value={`${userStats.pendingRewards} QVTX`}
            icon={Gift}
            accentColor="emerald"
            gradient="from-emerald-500/10 to-emerald-500/5"
          />
          <StatCard
            title="Total Earned"
            value={`${userStats.totalEarned} QVTX`}
            icon={TrendingUp}
            accentColor="violet"
            gradient="from-violet-500/10 to-violet-500/5"
          />
          <StatCard
            title="Next Reward"
            value={userStats.nextReward}
            icon={Clock}
            accentColor="amber"
            gradient="from-amber-500/10 to-amber-500/5"
          />
        </div>

        {/* Staking Pools */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Pools</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pools.map((pool, index) => (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard 
                  className={`cursor-pointer ${selectedPool?.id === pool.id ? "border-cyan-500/50" : ""}`}
                  padding="p-0"
                >
                  <div className={`p-6 bg-gradient-to-r ${pool.gradient} bg-opacity-10`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pool.gradient} flex items-center justify-center`}>
                          <pool.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{pool.name}</h3>
                          <p className="text-sm text-white/40">Lock: {pool.lockPeriod}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold bg-gradient-to-r ${pool.gradient} bg-clip-text text-transparent`}>
                          {pool.apy}
                        </p>
                        <p className="text-xs text-white/40">APY</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-white/40">TVL</p>
                        <p className="font-semibold">{pool.tvl}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Min Stake</p>
                        <p className="font-semibold">{pool.minStake}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Your Stake</p>
                        <p className="font-semibold text-cyan-400">{pool.yourStake}</p>
                      </div>
                    </div>

                    {pool.rewards !== "0 QVTX" && (
                      <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-4">
                        <span className="text-sm text-emerald-400">Claimable Rewards</span>
                        <span className="font-semibold text-emerald-400">{pool.rewards}</span>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedPool(pool)}
                      className={`w-full py-3 rounded-xl font-semibold transition-all ${
                        selectedPool?.id === pool.id
                          ? "bg-white/10 text-white"
                          : `bg-gradient-to-r ${pool.gradient} text-black hover:shadow-lg`
                      }`}
                    >
                      {selectedPool?.id === pool.id ? "Selected" : "Stake Now"}
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stake/Unstake Section */}
        {selectedPool && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-6 mb-8"
          >
            {/* Stake */}
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5 text-cyan-400" />
                Stake QVTX
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/50">Amount</span>
                    <span className="text-white/50">Balance: 10,000 QVTX</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-cyan-500/50"
                    />
                    <button
                      onClick={() => setStakeAmount("10000")}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                </div>
                <button className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all">
                  Stake QVTX
                </button>
              </div>
            </GlassCard>

            {/* Unstake */}
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Unlock className="w-5 h-5 text-rose-400" />
                Unstake QVTX
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/50">Amount</span>
                    <span className="text-white/50">Staked: {selectedPool.yourStake}</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-rose-500/50"
                    />
                    <button
                      onClick={() => setUnstakeAmount(selectedPool.yourStake.replace(/[^0-9.]/g, ""))}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                </div>
                <button className="w-full py-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold rounded-xl hover:bg-rose-500/20 transition-colors">
                  Unstake QVTX
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Rewards Calculator */}
        <GlassCard className="mb-8">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-400" />
            Rewards Calculator
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm text-white/50 mb-2 block">Stake Amount (QVTX)</label>
              <input
                type="number"
                value={calcAmount}
                onChange={(e) => setCalcAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-sm text-white/50 mb-2 block">Staking Period (Days)</label>
              <select
                value={calcPeriod}
                onChange={(e) => setCalcPeriod(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50"
              >
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
                <option value="180">180 Days</option>
                <option value="365">365 Days</option>
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <label className="text-sm text-white/50 mb-2 block">Estimated Rewards</label>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-center">
                <span className="text-2xl font-bold text-emerald-400">{calculateRewards()} QVTX</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Validators */}
        <GlassCard padding="p-0">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              Validators
            </h3>
          </div>
          <div>
            {validators.map((validator, index) => (
              <motion.div
                key={validator.address}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-6 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-black font-bold">
                    {validator.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{validator.name}</p>
                    <p className="text-sm text-white/40 font-mono">{validator.address}</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-sm text-white/40">Commission</p>
                    <p className="font-semibold">{validator.commission}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-white/40">Total Staked</p>
                    <p className="font-semibold text-cyan-400">{validator.staked}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-white/40">Delegators</p>
                    <p className="font-semibold">{validator.delegators}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold rounded-lg hover:shadow-lg transition-all">
                  Delegate
                </button>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}