import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { Copy, ExternalLink, Shield, Activity, TrendingUp, Zap, Check, RefreshCw } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import StatCard from "../components/ui/StatCard";
import Logo from "../components/ui/Logo";

const CHAIN42000_RPC = "http://162.0.222.112:8555";

const CHAIN42000_CONTRACTS = [
  {
    name: "QVTXSuperCore",
    type: "Core Protocol",
    chain: "qvtxdna",
    chainId: "42000",
    address: "0xF34Ec6dba9Ba2c93563FD2Bd8B4e83c05CD9EA2d",
    verified: true,
    active: true,
    category: "tokens"
  },
  {
    name: "QVTXWelcomeLite",
    type: "Welcome Contract",
    chain: "qvtxdna",
    chainId: "42000",
    address: "0xB28c5dEEfAB413F6EE54D93a870c68E384dB039F",
    verified: true,
    active: true,
    category: "all"
  },
  {
    name: "QVTXWelcome",
    type: "Welcome Contract",
    chain: "qvtxdna",
    chainId: "42000",
    address: "0x8f41a5a6a2FF6761438170dAa5c25b1c3711263d",
    verified: true,
    active: true,
    category: "all"
  }
];

const STATIC_CONTRACTS = [
  {
    name: "QVTX Token",
    type: "Native Token",
    chain: "qvtx",
    chainId: "20232",
    address: "0xAaB8EeAe9F37D1bC2a0F7C3e8548E8",
    verified: true,
    active: true,
    metrics: { supply: "1,000,000,000", holders: "45,892", marketCap: "$5.33B", volume24h: "$234.5M" },
    category: "tokens"
  },
  {
    name: "Staking Contract",
    type: "Staking Pool",
    chain: "qvtx",
    chainId: "20232",
    address: "0x8f3e2a1Bc4a289fD76540000c4a289",
    verified: true,
    active: true,
    metrics: { staked: "$523M", apy: "18.5%", stakers: "12,450", rewards: "$2.1M" },
    category: "all"
  },
  {
    name: "Multi-Chain Bridge",
    type: "Bridge Protocol",
    chain: "qvtx",
    chainId: "Multi",
    address: "0xc4a289fD76540000742d35Cc6634C05",
    verified: true,
    active: true,
    metrics: { volume24h: "$23.4M", transfers: "5,234", tvl: "$156M", chains: "5" },
    category: "bridges"
  },
  {
    name: "QVTX Token (BSC)",
    type: "BEP-20 Token",
    chain: "bsc",
    chainId: "56",
    address: "0x9010e4c8149114b1fd2a0267a6b41385",
    verified: true,
    active: true,
    metrics: { supply: "100,000,000", holders: "14,567", liquidity: "$38.7M", volume24h: "$9.8M" },
    category: "tokens"
  },
  {
    name: "QVTX Token (Polygon)",
    type: "Polygon Token",
    chain: "polygon",
    chainId: "137",
    address: "0x43cc625d326618f23aECf39C170B14015",
    verified: true,
    active: true,
    metrics: { supply: "100,000,000", holders: "9,876", liquidity: "$28.4M", volume24h: "$6.7M" },
    category: "tokens"
  }
];

export default function Contracts() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [copiedAddress, setCopiedAddress] = useState(null);
  const [chain42Block, setChain42Block] = useState(null);
  const [chain42Loading, setChain42Loading] = useState(true);

  useEffect(() => {
    const fetchBlock = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(CHAIN42000_RPC);
        const block = await Promise.race([
          provider.getBlockNumber(),
          new Promise((_, r) => setTimeout(() => r(new Error("timeout")), 6000))
        ]);
        setChain42Block(block);
      } catch {
        setChain42Block(null);
      } finally {
        setChain42Loading(false);
      }
    };
    fetchBlock();
  }, []);

  const stats = [
    { label: "Total Contracts", value: "24", change: "Across 5 chains", icon: Shield, color: "cyan" },
    { label: "Total Value Locked", value: "$1.6T", change: "+12.5% this week", icon: TrendingUp, color: "emerald" },
    { label: "24H Transactions", value: "45,892", change: "+8.3% vs yesterday", icon: Activity, color: "violet" },
    { label: "Bridge Volume", value: "$23.4M", change: "5,234 transfers", icon: Zap, color: "amber" }
  ];

  const filters = [
    { id: "all", label: "All Contracts" },
    { id: "qvtx", label: "QVTX Chain" },
    { id: "qvtxdna", label: "Chain 42000 (DNA)" },
    { id: "bsc", label: "BSC" },
    { id: "polygon", label: "Polygon" },
    { id: "bridges", label: "Bridges" },
    { id: "tokens", label: "Tokens" }
  ];

  const allContracts = [...CHAIN42000_CONTRACTS, ...STATIC_CONTRACTS];

  const chainColors = {
    qvtx: { bg: "from-cyan-400 to-emerald-400", text: "text-cyan-400", letter: "Q" },
    qvtxdna: { bg: "from-[#ffd700] to-[#00d4ff]", text: "text-[#ffd700]", letter: "D" },
    ethereum: { bg: "from-[#627eea] to-[#7e8ff1]", text: "text-[#627eea]", letter: "E" },
    bsc: { bg: "from-[#f3ba2f] to-[#ffd633]", text: "text-[#f3ba2f]", letter: "B" },
    polygon: { bg: "from-[#8247e5] to-[#9d5fff]", text: "text-[#8247e5]", letter: "P" }
  };

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const filteredContracts = allContracts.filter(contract => {
    if (activeFilter === "all") return true;
    if (activeFilter === "bridges") return contract.category === "bridges";
    if (activeFilter === "tokens") return contract.category === "tokens";
    return contract.chain === activeFilter;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-orbitron font-bold mb-4" style={{ color: "#00d4ff" }}>
            Smart Contracts
          </h1>
          <p className="text-white text-lg max-w-2xl mx-auto">
            Explore and interact with QVTX ecosystem contracts across multiple chains
          </p>
        </motion.div>

        {/* Chain 42000 Live Banner */}
        <div className="mb-8 p-4 rounded-xl border border-[#ffd700]/30 bg-gradient-to-r from-[#ffd700]/5 to-[#00d4ff]/5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-orbitron text-sm font-bold text-[#ffd700]">Chain 42000 · DNA Expression</span>
            <span className="text-xs text-white/40">RPC: {CHAIN42000_RPC}</span>
          </div>
          <div className="flex items-center gap-2">
            {chain42Loading ? (
              <RefreshCw className="w-4 h-4 text-white/30 animate-spin" />
            ) : chain42Block ? (
              <span className="font-mono text-sm text-[#00d4ff]">Block #{chain42Block.toLocaleString()}</span>
            ) : (
              <span className="text-xs text-rose-400">RPC unreachable</span>
            )}
            <Link to="/chain/42000" className="text-xs text-[#00d4ff] hover:text-[#ffd700] transition-colors flex items-center gap-1">
              View Chain <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <StatCard
                title={stat.label}
                value={stat.value}
                subtitle={stat.change}
                icon={stat.icon}
                accentColor={stat.color}
                gradient={`from-${stat.color}-500/10 to-${stat.color}-500/5`}
              />
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeFilter === filter.id
                  ? "border text-black font-bold"
                  : "bg-[#0d0e16] border border-white/30 text-white hover:text-white hover:bg-[#0f1019]"
              }`}
              style={activeFilter === filter.id ? { background: "linear-gradient(to right, #00d4ff, #ffd700)", borderColor: "transparent" } : {}}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Contracts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredContracts.map((contract, index) => (
            <motion.div key={contract.address} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <GlassCard className="group h-full" style={contract.chain === "qvtxdna" ? { borderColor: "rgba(255,215,0,0.2)" } : {}}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {contract.chain === "qvtx" ? (
                      <Logo size="lg" />
                    ) : (
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${chainColors[contract.chain]?.bg || "from-gray-500 to-gray-600"} flex items-center justify-center font-orbitron font-bold shadow-lg text-white text-lg`}>
                        {chainColors[contract.chain]?.letter || contract.chain[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-orbitron font-semibold text-lg">{contract.name}</h3>
                      <p className="text-sm text-white/60">
                        {contract.type} •{" "}
                        {["20232", "42000"].includes(contract.chainId) ? (
                          <Link to={`/chain/${contract.chainId}`} className="hover:underline" style={{ color: contract.chainId === "42000" ? "#ffd700" : "#00d4ff" }}>
                            Chain {contract.chainId}
                          </Link>
                        ) : (
                          <>Chain {contract.chainId}</>
                        )}
                      </p>
                    </div>
                  </div>
                  {contract.verified && (
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Address */}
                <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-lg px-4 py-3 mb-4 font-mono text-sm">
                  <span className={`flex-1 truncate ${chainColors[contract.chain]?.text || "text-cyan-400"}`}>
                    {contract.address}
                  </span>
                  <button onClick={() => copyAddress(contract.address)} className="p-1.5 hover:bg-white/10 rounded transition-colors">
                    {copiedAddress === contract.address ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/40" />}
                  </button>
                </div>

                {/* Metrics (static contracts only) */}
                {contract.metrics && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {Object.entries(contract.metrics).map(([key, value]) => (
                      <div key={key} className="bg-[#0a0b14] border border-white/10 rounded-lg p-3">
                        <div className="text-xs text-white/50 font-medium mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className={`font-semibold ${key.includes('apy') || key.includes('volume') ? 'text-emerald-400' : 'text-white'}`}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* DNA chain badge */}
                {contract.chain === "qvtxdna" && (
                  <div className="mb-4 px-3 py-2 rounded-lg border text-xs font-orbitron uppercase tracking-wider" style={{ borderColor: "rgba(255,215,0,0.3)", color: "#ffd700", background: "rgba(255,215,0,0.05)" }}>
                    ⬡ QVTX DNA Expression Layer · Chain 42000
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2.5 font-orbitron font-bold rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 text-black text-sm"
                    style={{ background: "linear-gradient(to right, #00d4ff, #ffd700)" }}>
                    Interact
                  </button>
                  <a
                    href={`http://162.0.222.112:8555`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-[#0d0e16] hover:bg-[#0f1019] border border-white/30 rounded-xl transition-all duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}