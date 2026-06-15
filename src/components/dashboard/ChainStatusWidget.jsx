import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Layers, Wifi, WifiOff, RefreshCw, ExternalLink } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import { Link } from "react-router-dom";

const CHAINS = [
  {
    id: 20232,
    name: "QVTX DNA Mainnet",
    symbol: "QVTX",
    rpc: "http://104.207.66.161:8545",
    color: "#00d4ff",
    hex: "0x4f08"
  },
  {
    id: 42000,
    name: "QVTX DNA Expression",
    symbol: "SQVTX",
    rpc: "http://162.0.222.112:8555",
    color: "#ffd700",
    hex: "0xa410"
  }
];

function ChainRow({ chain }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("checking");

  const fetch = async () => {
    setStatus("checking");
    try {
      const provider = new ethers.JsonRpcProvider(chain.rpc);
      const [blockNumber, network] = await Promise.all([
        Promise.race([provider.getBlockNumber(), new Promise((_, r) => setTimeout(() => r(new Error("timeout")), 6000))]),
        provider.getNetwork().catch(() => null)
      ]);
      setData({ blockNumber, chainId: network ? Number(network.chainId) : chain.id });
      setStatus("online");
    } catch {
      setStatus("offline");
    }
  };

  useEffect(() => { fetch(); const t = setInterval(fetch, 30000); return () => clearInterval(t); }, []);

  return (
    <div className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ backgroundColor: status === "online" ? "#10b981" : status === "offline" ? "#ef4444" : "#94a3b8" }} />
        <div>
          <p className="font-orbitron text-sm font-semibold" style={{ color: chain.color }}>{chain.name}</p>
          <p className="text-xs text-white/40">Chain {chain.id} · {chain.symbol}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {status === "online" && data ? (
          <div className="text-right">
            <p className="font-mono text-sm font-bold text-white">#{data.blockNumber?.toLocaleString()}</p>
            <p className="text-xs text-white/30">latest block</p>
          </div>
        ) : status === "offline" ? (
          <WifiOff className="w-4 h-4 text-rose-400" />
        ) : (
          <RefreshCw className="w-4 h-4 text-white/30 animate-spin" />
        )}
        <Link to={`/chain/${chain.id}`} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
          <ExternalLink className="w-3.5 h-3.5 text-white/30 hover:text-white/70" />
        </Link>
      </div>
    </div>
  );
}

export default function ChainStatusWidget() {
  return (
    <GlassCard padding="p-0">
      <div className="p-5 border-b border-white/5 flex items-center gap-2">
        <Layers className="w-4 h-4 text-[#00d4ff]" />
        <h2 className="font-orbitron font-bold text-sm text-[#00d4ff] uppercase tracking-wider">Chain Status</h2>
      </div>
      {CHAINS.map(c => <ChainRow key={c.id} chain={c} />)}
    </GlassCard>
  );
}