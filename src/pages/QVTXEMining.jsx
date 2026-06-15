import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import {
  Cpu,
  RefreshCw,
  ArrowRight,
  Droplets,
  Gift,
  Activity,
  Layers,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Copy,
  CheckCheck,
  Zap
} from "lucide-react";

const GENESIS_SUPPLY = 486232000;

function StatusDot({ status }) {
  const colors = {
    syncing: "bg-cyan-400",
    idle: "bg-yellow-400",
    error: "bg-rose-500",
    offline: "bg-rose-500",
    active: "bg-emerald-400",
    paused: "bg-yellow-400",
    depleted: "bg-rose-500"
  };
  return (
    <span className="relative flex h-3 w-3">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors[status] || "bg-slate-400"}`} />
      <span className={`relative inline-flex rounded-full h-3 w-3 ${colors[status] || "bg-slate-400"}`} />
    </span>
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  if (!text) return null;
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="ml-1 text-white/30 hover:text-cyan-400 transition-colors"
    >
      {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function ChainCard({ sync, loading }) {
  const isMain = sync?.chainId === 20232;
  const accent = isMain ? "cyan" : "emerald";
  const accentHex = isMain ? "#00d4ff" : "#10b981";

  const rows = [
    { label: "Current Block", value: sync?.currentBlock?.toLocaleString() ?? "—" },
    { label: "Last Synced Block", value: sync?.lastSyncedBlock?.toLocaleString() ?? "—" },
    { label: "Pending Blocks", value: sync?.pendingBlocks?.toLocaleString() ?? "—" },
    { label: "Total QVTXE Minted", value: sync?.totalMinted ?? "0", highlight: true },
    { label: "Sync Count", value: sync?.syncCount?.toLocaleString() ?? "—" },
    { label: "Reward / Block", value: sync?.rewardPerBlock ?? "2 QVTXE" },
    { label: "RPC Endpoint", value: sync?.rpcEndpoint ?? "—", mono: true, truncate: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0d0e16] border border-white/10 rounded-2xl p-6 flex-1 min-w-0"
      style={{ borderColor: `${accentHex}22` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StatusDot status={sync?.status || "idle"} />
            <span className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color: accentHex }}>
              Chain {sync?.chainId}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">{sync?.chainName ?? "—"}</h3>
        </div>
        <span
          className="px-2.5 py-1 text-xs font-semibold rounded-lg capitalize"
          style={{ background: `${accentHex}18`, color: accentHex }}
        >
          {sync?.status ?? "idle"}
        </span>
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {rows.map(({ label, value, highlight, mono, truncate }) => (
          <div key={label} className="flex items-center justify-between gap-2">
            <span className="text-xs text-white/40">{label}</span>
            <span
              className={`text-sm font-semibold ${highlight ? "" : "text-white"} ${mono ? "font-mono" : ""} ${truncate ? "truncate max-w-[140px]" : ""}`}
              style={highlight ? { color: accentHex } : undefined}
              title={truncate ? value : undefined}
            >
              {loading ? <span className="opacity-30">—</span> : value}
            </span>
          </div>
        ))}
      </div>

      {/* Last sync */}
      {sync?.lastSyncTimestamp && (
        <p className="mt-4 text-xs text-white/25 border-t border-white/5 pt-3">
          Last sync: {new Date(sync.lastSyncTimestamp).toLocaleString()}
        </p>
      )}
    </motion.div>
  );
}

function PoolCard({ pool, loading }) {
  const isReward = pool?.poolType === "reward";
  const accent = isReward ? "#ffd700" : "#8b5cf6";

  const rows = isReward ? [
    { label: "Balance", value: `${pool?.balance ?? "0"} QVTXE`, highlight: true },
    { label: "Total Deposited", value: `${pool?.totalDeposited ?? "0"} QVTXE` },
    { label: "Total Withdrawn", value: `${pool?.totalWithdrawn ?? "0"} QVTXE` },
    { label: "Split", value: `${pool?.splitPercent ?? 50}%` },
    { label: "Status", value: pool?.status ?? "active" },
  ] : [
    { label: "Balance", value: `${pool?.balance ?? "0"} QVTXE`, highlight: true },
    { label: "Auto-LP Threshold", value: pool?.liquidityThreshold ? `${pool.liquidityThreshold} QVTXE` : "1000 QVTXE" },
    { label: "Total LP Added", value: `${pool?.totalLpAdded ?? "0"} QVTXE` },
    { label: "LP Tokens", value: pool?.totalLpTokens ?? "0" },
    { label: "Split", value: `${pool?.splitPercent ?? 50}%` },
    { label: "Status", value: pool?.status ?? "active" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-[#0d0e16] border rounded-2xl p-6 flex-1 min-w-0"
      style={{ borderColor: `${accent}22` }}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}18` }}>
            {isReward ? <Gift className="w-5 h-5" style={{ color: accent }} /> : <Droplets className="w-5 h-5" style={{ color: accent }} />}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{isReward ? "Reward Pool" : "Liquidity Pool"}</h3>
            <p className="text-xs text-white/40">{isReward ? "50% of mined QVTXE" : "QVTXE / WETH on Uniswap"}</p>
          </div>
        </div>
        <StatusDot status={pool?.status || "active"} />
      </div>

      <div className="space-y-3">
        {rows.map(({ label, value, highlight }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-xs text-white/40">{label}</span>
            <span className="text-sm font-semibold" style={highlight ? { color: accent } : { color: "white" }}>
              {loading ? <span className="opacity-30">—</span> : value}
            </span>
          </div>
        ))}
      </div>

      {/* Extra address fields for LP pool */}
      {!isReward && (
        <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
          {pool?.pairAddress && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Pair Address</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono text-white/60 truncate max-w-[120px]">{pool.pairAddress}</span>
                <CopyBtn text={pool.pairAddress} />
              </div>
            </div>
          )}
          {pool?.lpRecipient && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">LP Recipient</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono text-white/60 truncate max-w-[120px]">{pool.lpRecipient}</span>
                <CopyBtn text={pool.lpRecipient} />
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function FlowDiagram() {
  const nodes = [
    { label: "Chain 20232", sub: "QVTX DNA Mainnet", color: "#00d4ff", icon: <Layers className="w-5 h-5" /> },
    { label: "Chain 42000", sub: "DNA Expression Chain", color: "#10b981", icon: <Layers className="w-5 h-5" /> },
    { label: "Syncer", sub: "Block Mirror", color: "#8b5cf6", icon: <RefreshCw className="w-5 h-5" /> },
    { label: "QVTXE Contract", sub: "Mint on Sync", color: "#ffd700", icon: <Zap className="w-5 h-5" /> },
    { label: "Reward Pool", sub: "50% Split", color: "#ffd700", icon: <Gift className="w-5 h-5" /> },
    { label: "Uniswap LP", sub: "QVTXE/WETH", color: "#8b5cf6", icon: <Droplets className="w-5 h-5" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-[#0d0e16] border border-white/10 rounded-2xl p-6"
    >
      <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-cyan-400" />
        Mining Flow
      </h2>

      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-2 min-w-[640px]">
          {/* Chain sources */}
          <div className="flex flex-col gap-3 flex-shrink-0">
            {[nodes[0], nodes[1]].map(n => (
              <div key={n.label} className="flex items-center gap-2 px-3 py-2.5 rounded-xl border" style={{ borderColor: `${n.color}33`, background: `${n.color}0f` }}>
                <span style={{ color: n.color }}>{n.icon}</span>
                <div>
                  <p className="text-xs font-bold text-white">{n.label}</p>
                  <p className="text-xs text-white/40">{n.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <ArrowRight className="w-5 h-5 text-white/30" />
            <ArrowRight className="w-5 h-5 text-white/30" />
          </div>

          {/* Syncer */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl border flex-shrink-0" style={{ borderColor: `${nodes[2].color}33`, background: `${nodes[2].color}0f` }}>
            <span style={{ color: nodes[2].color }}>{nodes[2].icon}</span>
            <div>
              <p className="text-xs font-bold text-white">{nodes[2].label}</p>
              <p className="text-xs text-white/40">{nodes[2].sub}</p>
            </div>
          </div>

          <ArrowRight className="w-5 h-5 text-white/30 flex-shrink-0" />

          {/* QVTXE Contract */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl border flex-shrink-0" style={{ borderColor: `${nodes[3].color}33`, background: `${nodes[3].color}0f` }}>
            <span style={{ color: nodes[3].color }}>{nodes[3].icon}</span>
            <div>
              <p className="text-xs font-bold text-white">{nodes[3].label}</p>
              <p className="text-xs text-white/40">{nodes[3].sub}</p>
            </div>
          </div>

          {/* Split arrow */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <ArrowRight className="w-5 h-5 text-white/30" />
            <ArrowRight className="w-5 h-5 text-white/30" />
          </div>

          {/* Output pools */}
          <div className="flex flex-col gap-3 flex-shrink-0">
            {[nodes[4], nodes[5]].map(n => (
              <div key={n.label} className="flex items-center gap-2 px-3 py-2.5 rounded-xl border" style={{ borderColor: `${n.color}33`, background: `${n.color}0f` }}>
                <span style={{ color: n.color }}>{n.icon}</span>
                <div>
                  <p className="text-xs font-bold text-white">{n.label}</p>
                  <p className="text-xs text-white/40">{n.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/40 border-t border-white/5 pt-4">
        <span>• Block sync triggers QVTXE mint (2 QVTXE per block)</span>
        <span>• 50% → Reward Pool for stakers</span>
        <span>• 50% → Auto-LP added to Uniswap QVTXE/WETH when threshold reached</span>
      </div>
    </motion.div>
  );
}

export default function QVTXEMining() {
  const [syncs, setSyncs] = useState([]);
  const [pools, setPools] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [copied, setCopied] = useState(null);

  const load = async () => {
    setLoading(true);
    const [s, p, c] = await Promise.all([
      base44.entities.MiningSyncs.list(),
      base44.entities.RewardPool.list(),
      base44.entities.Contracts.filter({ type: "QVTXE" })
    ]);
    setSyncs(s);
    setPools(p);
    setContracts(c);
    setLastRefresh(new Date());
    setLoading(false);
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const chain20232 = syncs.find(s => s.chainId === 20232);
  const chain42000 = syncs.find(s => s.chainId === 42000);
  const rewardPool = pools.find(p => p.poolType === "reward");
  const liquidityPool = pools.find(p => p.poolType === "liquidity");

  const totalMinted =
    (parseFloat(chain20232?.totalMinted || 0) + parseFloat(chain42000?.totalMinted || 0)).toLocaleString();

  const mintedPct = ((parseFloat(chain20232?.totalMinted || 0) + parseFloat(chain42000?.totalMinted || 0)) / GENESIS_SUPPLY * 100).toFixed(4);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
              <h1 className="text-3xl font-orbitron font-bold text-white" style={{ textShadow: "0 0 20px rgba(0,212,255,0.4)" }}>
                QVTXE Mining
              </h1>
            </div>
            <p className="text-white/40 text-sm ml-[52px]">2-Chain DNA Mining Mirror System — real-time sync dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            {lastRefresh && (
              <span className="text-xs text-white/30">
                Updated {lastRefresh.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-white/70 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Overview stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Genesis Supply",
              value: GENESIS_SUPPLY.toLocaleString() + " QVTXE",
              sub: "Fixed forever",
              color: "#ffd700",
              icon: <Layers className="w-5 h-5" />
            },
            {
              label: "Total Mining Minted",
              value: totalMinted + " QVTXE",
              sub: `${mintedPct}% of genesis`,
              color: "#00d4ff",
              icon: <Cpu className="w-5 h-5" />
            },
            {
              label: "Reward per Block",
              value: "2 QVTXE",
              sub: "Per chain, per block",
              color: "#10b981",
              icon: <Zap className="w-5 h-5" />
            }
          ].map(s => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0d0e16] rounded-2xl border border-white/10 p-5 flex items-center gap-4"
              style={{ borderColor: `${s.color}22` }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}18` }}>
                <span style={{ color: s.color }}>{s.icon}</span>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-0.5">{s.label}</p>
                <p className="text-lg font-bold font-orbitron" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-white/30">{s.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chain Cards */}
        <div>
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Chain Sync Status</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <ChainCard sync={chain20232} loading={loading} />
            <ChainCard sync={chain42000} loading={loading} />
          </div>
        </div>

        {/* Pool Cards */}
        <div>
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Reward & Liquidity Pools</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <PoolCard pool={rewardPool} loading={loading} />
            <PoolCard pool={liquidityPool} loading={loading} />
          </div>
        </div>

        {/* Flow Diagram */}
        <FlowDiagram />

        {/* Contracts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0d0e16] border border-white/10 rounded-2xl p-6"
        >
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            QVTXE Smart Contracts
          </h2>
          {loading ? (
            <p className="text-white/30 text-sm">Loading contracts...</p>
          ) : contracts.length === 0 ? (
            <p className="text-white/30 text-sm">No QVTXE contracts found. Add them via the Contracts entity.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Name", "Address", "Network", "Chain ID", "Type", "Verified"].map(h => (
                      <th key={h} className="text-left text-xs text-white/30 font-semibold pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {contracts.map(c => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4 font-semibold text-white">{c.name}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1 font-mono text-xs text-white/60">
                          <span>{c.address ? `${c.address.slice(0, 10)}...${c.address.slice(-6)}` : "—"}</span>
                          <CopyBtn text={c.address} />
                          {c.address && (
                            <a
                              href={`https://explorer.qvtx.io/address/${c.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/30 hover:text-cyan-400 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-white/60">{c.network ?? "—"}</td>
                      <td className="py-3 pr-4 font-mono text-white/60">{c.chainId ?? "—"}</td>
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 rounded-md text-xs bg-cyan-500/10 text-cyan-400">{c.type ?? "—"}</span>
                      </td>
                      <td className="py-3 pr-4">
                        {c.verified
                          ? <span className="flex items-center gap-1 text-emerald-400 text-xs"><CheckCircle className="w-3.5 h-3.5" /> Verified</span>
                          : <span className="flex items-center gap-1 text-white/30 text-xs"><AlertCircle className="w-3.5 h-3.5" /> Unverified</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}