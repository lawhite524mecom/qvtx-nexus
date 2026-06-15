import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Wallet,
  ArrowLeftRight,
  Coins,
  TrendingUp,
  Shield,
  Globe
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import StatCard from "../components/ui/StatCard";
import XRPWallet from "../components/xrp/XRPWallet";
import XRPBridge from "../components/xrp/XRPBridge";
import XRPStaking from "../components/xrp/XRPStaking";

export default function XRP() {
  const [xrpAddress, setXrpAddress] = useState("rEVSCgctdEJQRpn2eC4Uuu5AEvgpAZmG51");
  const [walletData, setWalletData] = useState(null);
  const [activeTab, setActiveTab] = useState("wallet");

  const stats = [
    {
      title: "Network",
      value: "XRPL",
      icon: Globe,
      accentColor: "cyan",
      gradient: "from-cyan-500/10 to-cyan-500/5"
    },
    {
      title: "Base APY",
      value: "3.5%",
      icon: TrendingUp,
      accentColor: "emerald",
      gradient: "from-emerald-500/10 to-emerald-500/5"
    },
    {
      title: "QVTX Boost",
      value: "1.5x",
      icon: Zap,
      accentColor: "amber",
      gradient: "from-amber-500/10 to-amber-500/5"
    },
    {
      title: "Issuer",
      value: "rJqj...Z239",
      icon: Shield,
      accentColor: "violet",
      gradient: "from-violet-500/10 to-violet-500/5"
    }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">XRP</span>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-slate-400 to-cyan-400 bg-clip-text text-transparent">
              XRP Ledger Integration
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            Manage QVTX on XRP Ledger with native wallet, bridging, and staking
          </motion.p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("wallet")}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "wallet"
                ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-black"
                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <Wallet className="w-4 h-4" />
            Wallet
          </button>
          <button
            onClick={() => setActiveTab("bridge")}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "bridge"
                ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-black"
                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            Bridge
          </button>
          <button
            onClick={() => setActiveTab("staking")}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "staking"
                ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-black"
                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <Coins className="w-4 h-4" />
            Staking
          </button>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeTab === "wallet" && (
            <XRPWallet 
              xrpAddress={xrpAddress}
              onUpdate={setWalletData}
            />
          )}

          {activeTab === "bridge" && (
            <XRPBridge
              userAddress="0x..." // EVM address would come from wallet
              xrpAddress={xrpAddress}
            />
          )}

          {activeTab === "staking" && (
            <XRPStaking
              xrpAddress={xrpAddress}
              balance={walletData?.balance || "0"}
            />
          )}

          {/* Network Info */}
          <GlassCard>
            <h3 className="text-lg font-bold mb-4">Network Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-white/50 mb-1">QVTX Issuer</p>
                <p className="font-mono text-sm text-cyan-400 break-all">
                  rJqjwDAwuSVoppQkrwjJSPzXivspYxZ239
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-white/50 mb-1">Admin Account</p>
                <p className="font-mono text-sm text-cyan-400 break-all">
                  rLTN7xGB7fCsSVXDZKruhPXAvGr8SxPMgD
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-white/50 mb-1">Network</p>
                <p className="font-semibold text-white">XRP Ledger Mainnet</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-white/50 mb-1">Explorer</p>
                <a
                  href="https://livenet.xrpl.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 text-sm"
                >
                  livenet.xrpl.org →
                </a>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}