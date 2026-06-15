import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { Link, useParams } from "react-router-dom";
import {
  Activity,
  Cpu,
  Layers,
  Clock,
  Hash,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";

const CHAIN_CONFIGS = {
  20232: {
    name: "QVTX Mainnet",
    symbol: "QVTX",
    rpc: "https://rpc.qvtx.io",
    explorer: "https://explorer.qvtx.io",
    consensus: "Clique PoA",
    color: "from-cyan-500 to-emerald-500",
    description: "The primary QVTX blockchain network running Clique Proof-of-Authority consensus."
  },
  42000: {
    name: "QVTX DNA",
    symbol: "SQVTX",
    rpc: "https://dna.qvtx.io:8555",
    explorer: "https://explorer.qvtx.io",
    consensus: "Clique PoA",
    color: "from-violet-500 to-fuchsia-500",
    description: "The QVTX DNA superposition layer — Chain ID 42000 running SQVTX as the native token."
  }
};

function truncateHash(hash, start = 10, end = 8) {
  if (!hash) return "—";
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}

function timeAgo(timestampSecs) {
  const diff = Math.floor(Date.now() / 1000) - timestampSecs;
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function ChainOverview() {
  const params = useParams();
  // Support both /chain/:chainId and /address/chain-:chainId
  const chainId = params.chainId
    ? parseInt(params.chainId)
    : params.addr?.startsWith("chain-")
    ? parseInt(params.addr.replace("chain-", ""))
    : null;

  const config = CHAIN_CONFIGS[chainId];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chainInfo, setChainInfo] = useState(null);
  const [recentBlocks, setRecentBlocks] = useState([]);
  const [recentTxs, setRecentTxs] = useState([]);

  const fetchChainData = async () => {
    if (!config) return;
    setLoading(true);
    setError(null);
    try {
      const provider = new ethers.JsonRpcProvider(config.rpc);

      const [blockNumber, network] = await Promise.all([
        provider.getBlockNumber(),
        provider.getNetwork()
      ]);

      // Fetch last 5 blocks
      const blockNums = Array.from({ length: 5 }, (_, i) => blockNumber - i);
      const blocks = await Promise.all(
        blockNums.map(n => provider.getBlock(n))
      );

      const validBlocks = blocks.filter(Boolean);

      // Collect up to 10 recent transactions from those blocks
      const txHashes = [];
      for (const block of validBlocks) {
        if (block?.transactions) {
          for (const tx of block.transactions.slice(0, 3)) {
            txHashes.push({ hash: tx, blockNumber: block.number, timestamp: block.timestamp });
            if (txHashes.length >= 10) break;
          }
        }
        if (txHashes.length >= 10) break;
      }

      setChainInfo({
        chainId: Number(network.chainId),
        headBlock: blockNumber,
        symbol: config.symbol,
        consensus: config.consensus,
      });

      setRecentBlocks(
        validBlocks.map(b => ({
          number: b.number,
          hash: b.hash,
          timestamp: b.timestamp,
          txCount: b.transactions?.length ?? 0,
          miner: b.miner
        }))
      );

      setRecentTxs(txHashes);
    } catch (err) {
      setError("Unable to connect to chain RPC. The node may be temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChainData();
  }, [chainId]);

  // Unknown chain
  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <GlassCard className="max-w-md w-full text-center p-12">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Unknown Chain</h1>
          <p className="text-white/50 mb-6">
            Chain ID <span className="font-mono text-white/80">{chainId ?? "unknown"}</span> is not a recognised QVTX network.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl">
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white/70">Chain {chainId}</span>
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center text-black font-bold text-xl shadow-lg`}>
                Q
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  {config.name}
                </h1>
                <p className="text-white/50 mt-1">{config.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={config.explorer}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                Explorer <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={fetchChainData}
                disabled={loading}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Chain ID",
              value: chainId,
              icon: Hash,
              color: "cyan"
            },
            {
              label: "Head Block",
              value: loading ? "—" : chainInfo?.headBlock?.toLocaleString() ?? "—",
              icon: Layers,
              color: "emerald"
            },
            {
              label: "Consensus",
              value: config.consensus,
              icon: Cpu,
              color: "violet"
            },
            {
              label: "Native Token",
              value: config.symbol,
              icon: Activity,
              color: "amber"
            }
          ].map(({ label, value, icon: Icon, color }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard padding="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg bg-${color}-500/10 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${color}-400`} />
                  </div>
                  <span className="text-white/50 text-sm">{label}</span>
                </div>
                <p className={`text-2xl font-bold text-${color}-400`}>{value}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Two column: Recent Blocks + Recent Txs */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Blocks */}
          <GlassCard padding="p-0">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Recent Blocks
              </h2>
              {loading && <RefreshCw className="w-4 h-4 text-white/30 animate-spin" />}
            </div>
            <div className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
                    <div className="w-12 h-10 bg-white/5 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/5 rounded w-32" />
                      <div className="h-3 bg-white/5 rounded w-48" />
                    </div>
                  </div>
                ))
              ) : recentBlocks.length === 0 ? (
                <div className="p-8 text-center text-white/30 text-sm">No block data available</div>
              ) : (
                recentBlocks.map((block, i) => (
                  <motion.div
                    key={block.number}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="w-12 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Layers className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-cyan-400">#{block.number.toLocaleString()}</span>
                        <span className="text-xs text-white/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo(block.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 font-mono truncate mt-0.5">{truncateHash(block.hash)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium">{block.txCount} txs</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </GlassCard>

          {/* Recent Transactions */}
          <GlassCard padding="p-0">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Recent Transactions
              </h2>
              {loading && <RefreshCw className="w-4 h-4 text-white/30 animate-spin" />}
            </div>
            <div className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
                    <div className="w-12 h-10 bg-white/5 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/5 rounded w-40" />
                      <div className="h-3 bg-white/5 rounded w-24" />
                    </div>
                  </div>
                ))
              ) : recentTxs.length === 0 ? (
                <div className="p-8 text-center text-white/30 text-sm">No transactions in recent blocks</div>
              ) : (
                recentTxs.map((tx, i) => (
                  <motion.div
                    key={tx.hash}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="w-12 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-emerald-400 truncate">{truncateHash(tx.hash, 12, 10)}</p>
                      <p className="text-xs text-white/40 mt-0.5">Block #{tx.blockNumber?.toLocaleString()}</p>
                    </div>
                    <a
                      href={`${config.explorer}/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-white/30 hover:text-white/70" />
                    </a>
                  </motion.div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}