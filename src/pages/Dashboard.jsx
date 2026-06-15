import React, { useState, useEffect } from "react";
import GatedRoute from "../components/auth/GatedRoute";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Coins,
  Globe,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import StatCard from "../components/ui/StatCard";
import GlassCard from "../components/ui/GlassCard";
import RewardsTracker from "../components/rewards/RewardsTracker";
import VolumeChart from "../components/charts/VolumeChart";
import ChainStatusWidget from "../components/dashboard/ChainStatusWidget";
import FPGAStatusWidget from "../components/dashboard/FPGAStatusWidget";
import ByteIDWidget from "../components/dashboard/ByteIDWidget";

function DashboardContent() {
  const [timeRange, setTimeRange] = useState("7D");
  const [userAddress, setUserAddress] = React.useState("");

  React.useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setUserAddress(accounts[0]);
          }
        })
        .catch(console.error);
    }
  }, []);

  const chartData = [
    { name: "Jan 1", value: 145000 },
    { name: "Jan 2", value: 178000 },
    { name: "Jan 3", value: 156000 },
    { name: "Jan 4", value: 198000 },
    { name: "Jan 5", value: 234500 },
    { name: "Jan 6", value: 212000 },
    { name: "Jan 7", value: 267000 },
  ];

  const chains = [
    { name: "Ethereum", icon: "E", tvl: "$890.5B", percent: "55.6%", color: "from-blue-500 to-indigo-500" },
    { name: "Polygon", icon: "P", tvl: "$320.2B", percent: "20.0%", color: "from-purple-500 to-violet-500" },
    { name: "BSC", icon: "B", tvl: "$198.4B", percent: "12.4%", color: "from-yellow-500 to-amber-500" },
    { name: "Solana", icon: "S", tvl: "$145.8B", percent: "9.1%", color: "from-emerald-500 to-teal-500" },
    { name: "XRP Ledger", icon: "X", tvl: "$46.1B", percent: "2.9%", color: "from-slate-400 to-slate-500" },
  ];

  const transactions = [
    { hash: "0x1a2b...3c4d", type: "transfer", from: "0xAb...12", to: "0xCd...34", amount: "+1,250 QVTX", time: "2 min ago" },
    { hash: "0x5e6f...7g8h", type: "bridge", from: "Ethereum", to: "Polygon", amount: "500 QVTX", time: "5 min ago" },
    { hash: "0x9i0j...1k2l", type: "stake", from: "0xEf...56", to: "Pool #1", amount: "2,000 QVTX", time: "12 min ago" },
    { hash: "0x3m4n...5o6p", type: "transfer", from: "0xGh...78", to: "0xIj...90", amount: "+750 QVTX", time: "18 min ago" },
    { hash: "0x7q8r...9s0t", type: "bridge", from: "BSC", to: "Ethereum", amount: "1,800 QVTX", time: "25 min ago" },
  ];

  const topHolders = [
    { rank: 1, address: "0x742d...35Cc", balance: "125,450,000 QVTX", percent: "12.5%" },
    { rank: 2, address: "0x8f3e...2a1B", balance: "98,230,000 QVTX", percent: "9.8%" },
    { rank: 3, address: "0xc4a2...89fD", balance: "76,540,000 QVTX", percent: "7.6%" },
    { rank: 4, address: "0x1b7c...4e2A", balance: "54,320,000 QVTX", percent: "5.4%" },
    { rank: 5, address: "0x9d8f...6c3B", balance: "43,210,000 QVTX", percent: "4.3%" },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-orbitron font-bold dna-glow-cyan" style={{ color: "#00d4ff" }}>
              Analytics Dashboard
            </h1>
            <p className="text-white/50 mt-1">Real-time QVTX ecosystem metrics</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm text-emerald-400 font-medium">Live</span>
            </div>

            <div className="flex bg-white/5 rounded-xl p-1">
              {["24H", "7D", "30D", "ALL"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === range
                      ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-black"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* QVTX DNA Infrastructure */}
        <div className="grid lg:grid-cols-3 gap-4 mb-8">
          <ChainStatusWidget />
          <FPGAStatusWidget />
          <ByteIDWidget walletAddress={userAddress || undefined} />
        </div>

        {/* Rewards Tracker */}
        {userAddress && (
          <div className="mb-8">
            <RewardsTracker 
              userAddress={userAddress}
              onClaimSuccess={() => {
                // Refresh dashboard or show notification
              }}
            />
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <StatCard
            title="Total Value Locked"
            value="$1.6T"
            change="+12.5%"
            changeType="positive"
            icon={TrendingUp}
            accentColor="cyan"
            gradient="from-cyan-500/10 to-cyan-500/5"
          />
          <StatCard
            title="24H Volume"
            value="$234.5M"
            change="+8.3%"
            changeType="positive"
            icon={Activity}
            accentColor="emerald"
            gradient="from-emerald-500/10 to-emerald-500/5"
          />
          <StatCard
            title="QVTX Price"
            value="$5.33"
            change="+2.45%"
            changeType="positive"
            icon={TrendingUp}
            accentColor="violet"
            gradient="from-violet-500/10 to-violet-500/5"
          />
          <StatCard
            title="Total Holders"
            value="45,892"
            change="+1,234"
            changeType="positive"
            icon={Users}
            accentColor="amber"
            gradient="from-amber-500/10 to-amber-500/5"
          />
          <StatCard
            title="Staking APY"
            value="18.5%"
            subtitle="Avg. pools"
            icon={Coins}
            accentColor="rose"
            gradient="from-rose-500/10 to-rose-500/5"
          />
          <StatCard
            title="Bridge Volume"
            value="$23.4M"
            subtitle="5,234 txns"
            icon={Globe}
            accentColor="cyan"
            gradient="from-cyan-500/10 to-cyan-500/5"
          />
        </div>

        {/* Chart Section */}
        <GlassCard className="mb-8" padding="p-0">
          <div className="p-6 border-b border-white/5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Trading Volume</h2>
              <select className="bg-white/5 border border-white/10 text-white text-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                <option>All Chains</option>
                <option>Ethereum</option>
                <option>Polygon</option>
                <option>BSC</option>
              </select>
            </div>
          </div>
          <div className="p-6">
            <VolumeChart data={chartData} height={350} />
          </div>
        </GlassCard>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* TVL by Chain */}
          <GlassCard padding="p-0">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-lg font-semibold">TVL by Chain</h2>
            </div>
            <div className="p-4">
              {chains.map((chain, index) => (
                <motion.div
                  key={chain.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 hover:bg-white/[0.02] rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${chain.color} flex items-center justify-center text-white font-bold`}>
                      {chain.icon}
                    </div>
                    <div>
                      <p className="font-medium">{chain.name}</p>
                      <p className="text-sm text-white/40">Mainnet</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-cyan-400">{chain.tvl}</p>
                    <p className="text-sm text-white/40">{chain.percent}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Top Holders */}
          <GlassCard padding="p-0">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-lg font-semibold">Top Holders</h2>
            </div>
            <div className="p-4">
              {topHolders.map((holder, index) => (
                <motion.div
                  key={holder.rank}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 hover:bg-white/[0.02] rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      holder.rank === 1 ? "bg-amber-500/20 text-amber-400" :
                      holder.rank === 2 ? "bg-slate-400/20 text-slate-300" :
                      holder.rank === 3 ? "bg-orange-500/20 text-orange-400" :
                      "bg-white/5 text-white/40"
                    }`}>
                      {holder.rank}
                    </span>
                    <span className="font-mono text-sm text-white/70">{holder.address}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-emerald-400 text-sm">{holder.balance}</p>
                    <p className="text-xs text-white/40">{holder.percent}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Recent Transactions */}
        <GlassCard padding="p-0">
          <div className="p-6 border-b border-white/5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                View All <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-sm font-medium text-white/40">Tx Hash</th>
                  <th className="text-left p-4 text-sm font-medium text-white/40">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-white/40">From</th>
                  <th className="text-left p-4 text-sm font-medium text-white/40">To</th>
                  <th className="text-left p-4 text-sm font-medium text-white/40">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-white/40">Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <motion.tr
                    key={tx.hash}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4">
                      <a href="#" className="font-mono text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                        {tx.hash}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tx.type === "transfer" ? "bg-emerald-500/20 text-emerald-400" :
                        tx.type === "bridge" ? "bg-cyan-500/20 text-cyan-400" :
                        "bg-amber-500/20 text-amber-400"
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-sm text-white/60">{tx.from}</td>
                    <td className="p-4 font-mono text-sm text-white/60">{tx.to}</td>
                    <td className="p-4">
                      <span className={`flex items-center gap-1 font-medium ${
                        tx.amount.startsWith("+") ? "text-emerald-400" : "text-white"
                      }`}>
                        {tx.amount.startsWith("+") && <ArrowUpRight className="w-4 h-4" />}
                        {tx.amount}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-white/40">{tx.time}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return <GatedRoute pageName="Dashboard"><DashboardContent /></GatedRoute>;
}