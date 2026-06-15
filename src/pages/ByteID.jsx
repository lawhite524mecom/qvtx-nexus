import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Copy, Check, AlertCircle, Dna, Fingerprint, RefreshCw } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";

const BYTEID_API = "http://203.161.33.24:9825";

export default function ByteID() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(null);

  const derive = async () => {
    if (!address.trim()) { setError("Enter a wallet address"); return; }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${BYTEID_API}/derive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: address.trim() })
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(`Failed to derive ByteID: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copy = (value, key) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleKey = (e) => { if (e.key === "Enter") derive(); };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#00d4ff]/20 to-[#ffd700]/10 flex items-center justify-center border border-[#00d4ff]/30">
            <Fingerprint className="w-10 h-10 text-[#00d4ff]" />
          </div>
          <h1 className="text-4xl font-orbitron font-bold mb-3 dna-glow-cyan" style={{ color: "#00d4ff" }}>
            ByteID Derivation
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Derive your unique QVTX DNA identity from any wallet address using the FPGA ByteID server.
          </p>
        </motion.div>

        {/* Input Card */}
        <GlassCard className="mb-8">
          <label className="block text-sm font-medium text-white/60 mb-3">Wallet Address</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={handleKey}
              placeholder="0x..."
              className="flex-1 px-4 py-3 bg-black/40 border border-[#00d4ff]/20 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-[#00d4ff]/60 transition-colors"
            />
            <button
              onClick={derive}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-[#00d4ff] to-[#ffd700] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#00d4ff]/25 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "Deriving..." : "Derive"}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </GlassCard>

        {/* Result */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* ByteID Hero */}
            <GlassCard className="mb-6 border border-[#00d4ff]/30 bg-gradient-to-br from-[#00d4ff]/5 to-[#ffd700]/5">
              <div className="flex items-center gap-3 mb-4">
                <Dna className="w-6 h-6 text-[#00d4ff]" />
                <h2 className="font-orbitron font-bold text-[#00d4ff]">ByteID</h2>
              </div>
              <div className="flex items-center gap-3 bg-black/40 rounded-xl px-5 py-4 border border-[#ffd700]/20">
                <span className="flex-1 font-mono text-[#ffd700] text-lg break-all font-bold dna-glow-gold">
                  {result.byteid ?? result.byteId ?? result.byte_id ?? JSON.stringify(result)}
                </span>
                <button onClick={() => copy(result.byteid ?? result.byteId ?? result.byte_id, "byteid")} className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
                  {copied === "byteid" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/40" />}
                </button>
              </div>
            </GlassCard>

            {/* Fields Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: "Fold", key: "fold", color: "#00d4ff" },
                { label: "Shadow", key: "shadow", color: "#ffd700" },
                { label: "Mode", key: "mode", color: "#a78bfa" },
              ].map(({ label, key, color }) =>
                result[key] !== undefined ? (
                  <GlassCard key={key} padding="p-5">
                    <p className="text-xs font-orbitron font-medium mb-2 uppercase tracking-widest" style={{ color: `${color}80` }}>{label}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm break-all" style={{ color }}>{String(result[key])}</span>
                      <button onClick={() => copy(String(result[key]), key)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
                        {copied === key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/30" />}
                      </button>
                    </div>
                  </GlassCard>
                ) : null
              )}
            </div>

            {/* All raw fields fallback */}
            {Object.keys(result).filter(k => !["byteid","byteId","byte_id","fold","shadow","mode"].includes(k)).length > 0 && (
              <GlassCard className="mt-4">
                <p className="text-xs text-white/40 mb-3 uppercase tracking-widest font-orbitron">Additional Fields</p>
                <div className="space-y-2">
                  {Object.entries(result)
                    .filter(([k]) => !["byteid","byteId","byte_id","fold","shadow","mode"].includes(k))
                    .map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                        <span className="text-xs text-white/40 font-orbitron uppercase">{k}</span>
                        <span className="font-mono text-sm text-[#00d4ff]">{String(v)}</span>
                      </div>
                    ))}
                </div>
              </GlassCard>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}