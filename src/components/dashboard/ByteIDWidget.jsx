import React, { useState, useEffect } from "react";
import { Fingerprint, Search, RefreshCw, ExternalLink } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import { Link } from "react-router-dom";

const BYTEID_API = "http://203.161.33.24:9825";

export default function ByteIDWidget({ walletAddress }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState(walletAddress ?? "");

  const derive = async (addr) => {
    const target = addr ?? input;
    if (!target) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BYTEID_API}/derive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: target.trim() })
      });
      if (!res.ok) throw new Error(res.status);
      setResult(await res.json());
    } catch (e) {
      setError("ByteID server unreachable");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { if (walletAddress) { setInput(walletAddress); derive(walletAddress); } }, [walletAddress]);

  const byteId = result?.byteid ?? result?.byteId ?? result?.byte_id;

  return (
    <GlassCard padding="p-0" className="border border-[#00d4ff]/20">
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-[#00d4ff]" />
          <h2 className="font-orbitron font-bold text-sm text-[#00d4ff] uppercase tracking-wider">ByteID</h2>
        </div>
        <Link to="/ByteID" className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
          <ExternalLink className="w-3.5 h-3.5 text-white/30 hover:text-[#00d4ff]" />
        </Link>
      </div>

      <div className="p-5">
        {!walletAddress && (
          <div className="flex gap-2 mb-4">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="0x..."
              className="flex-1 px-3 py-2 bg-black/40 border border-[#00d4ff]/20 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#00d4ff]/50"
            />
            <button onClick={() => derive()} disabled={loading} className="px-3 py-2 bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-[#00d4ff] rounded-lg hover:bg-[#00d4ff]/20 transition-colors disabled:opacity-50">
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {error && <p className="text-xs text-rose-400 mb-3">{error}</p>}

        {loading && !result && (
          <div className="flex items-center gap-2 text-white/30 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" /> Deriving...
          </div>
        )}

        {byteId && (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-white/30 mb-1 font-orbitron uppercase tracking-widest">ByteID</p>
              <p className="font-mono text-[#ffd700] font-bold text-sm break-all dna-glow-gold">{byteId}</p>
            </div>
            {result?.fold !== undefined && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-white/30 mb-1 font-orbitron uppercase">Fold</p>
                  <p className="font-mono text-[#00d4ff] text-sm">{result.fold}</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-white/30 mb-1 font-orbitron uppercase">Shadow</p>
                  <p className="font-mono text-[#a78bfa] text-sm">{result.shadow}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
}