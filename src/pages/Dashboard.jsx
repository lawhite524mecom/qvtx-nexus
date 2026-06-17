import React, { useState, useEffect } from "react";
import GatedRoute from "../components/auth/GatedRoute";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Activity,
  Users,
  Coins,
  Globe,
  ExternalLink,
  ArrowUpRight,
  RefreshCw,
  Layers
} from "lucide-react";
import StatCard from "../components/ui/StatCard";
import GlassCard from "../components/ui/GlassCard";
import RewardsTracker from "../components/rewards/RewardsTracker";
import ChainStatusWidget from "../components/dashboard/ChainStatusWidget";
import FPGAStatusWidget from "../components/dashboard/FPGAStatusWidget";
import ByteIDWidget from "../components/dashboard/ByteIDWidget";
import { useChainData } from "@/hooks/useChainData";
import { CHAINS, CONTRACTS } from "@/lib/chainConfig";

function DashboardContent() {
  const [timeRange, setTimeRange] = useState("7D");
  const [userAddress, setUserAddress] = useState("");
  const { mainnetBlock, dnaBlock, loading: chainLoading, refresh } = useChainData();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => { if (accounts.length > 0) setUserAddress(accounts[0]); })
        .catch(() => {});
    }
  }, []);

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

        {/* Live Chain Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlassCard padding="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40">Chain 20232 Block</span>
              <Layers className="w-4 h-4" style={{ color: "#00d4ff" }} />
            </div>
            <p className="text-2xl font-bold font-orbitron" style={{ color: "#00d4ff" }}>
              {chainLoading ? "—" : mainnetBlock !== null ? mainnetBlock.toLocaleString() : "Offline"}
            </p>
            <p className="text-xs text-white/30 mt-1">QVTX DNA Mainnet</p>
          </GlassCard>
          <GlassCard padding="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40">Chain 42000 Block</span>
              <Activity className="w-4 h-4" style={{ color: "#ffd700" }} />
            </div>
            <p className="text-2xl font-bold font-orbitron" style={{ color: "#ffd700" }}>
              {chainLoading ? "—" : dnaBlock !== null ? dnaBlock.toLocaleString() : "Offline"}
            </p>
            <p className="text-xs text-white/30 mt-1">DNA Expression Chain</p>
          </GlassCard>
          <GlassCard padding="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40">NFT Contract</span>
              <TrendingUp className="w-4 h-4" style={{ color: "#f472b6" }} />
            </div>
            <p className="text-xs font-mono text-white/70 break-all mt-1">
              {CONTRACTS.QVTX_DNA_NFT.slice(0, 10)}...{CONTRACTS.QVTX_DNA_NFT.slice(-6)}
            </p>
            <p className="text-xs text-white/30 mt-1">Chain 42000</p>
          </GlassCard>
          <GlassCard padding="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40">Staking Contract</span>
              <Coins className="w-4 h-4" style={{ color: "#10b981" }} />
            </div>
            <p className="text-xs font-mono text-white/70 break-all mt-1">
              {CONTRACTS.QVTXNFTStaking.slice(0, 10)}...{CONTRACTS.QVTXNFTStaking.slice(-6)}
            </p>
            <p className="text-xs text-white/30 mt-1">Chain 42000</p>
          </GlassCard>
        </div>

        {/* Contract Directory */}
        <GlassCard className="mb-8" padding="p-0">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Deployed Contracts — Chain 42000</h2>
            <button onClick={refresh} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <RefreshCw className={`w-4 h-4 text-white/40 ${chainLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-xs font-medium text-white/40">Contract</th>
                  <th className="text-left p-4 text-xs font-medium text-white/40">Address</th>
                  <th className="text-left p-4 text-xs font-medium text-white/40 hidden md:table-cell">Chain</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "QVTX DNA NFT", addr: CONTRACTS.QVTX_DNA_NFT, chain: 42000 },
                  { name: "NFT Whitelist", addr: CONTRACTS.QVTXNFTWhitelist, chain: 42000 },
                  { name: "Reward Distributor", addr: CONTRACTS.QVTXRewardDistributor, chain: 42000 },
                  { name: "NFT Staking", addr: CONTRACTS.QVTXNFTStaking, chain: 42000 },
                  { name: "LP NFT", addr: CONTRACTS.QVTX_LP_NFT, chain: 42000 },
                  { name: "Pool Factory", addr: CONTRACTS.QVTXPoolFactory, chain: 42000 },
                  { name: "Value Oracle", addr: CONTRACTS.QVTXValueOracle, chain: 42000 },
                  { name: "Token (BSC)", addr: CONTRACTS.TOKEN_BSC, chain: 56 },
                  { name: "Token (Polygon)", addr: CONTRACTS.TOKEN_POLYGON, chain: 137 },
                ].map((c) => (
                  <tr key={c.addr} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-medium text-white">{c.name}</td>
                    <td className="p-4 font-mono text-cyan-400 text-xs">{c.addr}</td>
                    <td className="p-4 text-white/40 hidden md:table-cell">{c.chain}</td>
                  </tr>
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