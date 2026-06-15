import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dna, Zap, Copy, Check, AlertCircle, RefreshCw, BarChart3 } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";

const DNA_API = "http://66.29.143.215:5002";

export default function DNACompress() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(null);

  const compress = async () => {
    if (!input.trim()) { setError("Enter some text to compress"); return; }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${DNA_API}/api/fold`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: input.trim() })
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();
      setResult({ ...data, _inputLen: input.trim().length });
    } catch (err) {
      setError(`Compression failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copy = (value, key) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const ratio = result
    ? ((result.dna_length ?? result.dnaLength ?? result.length ?? 0) / result._inputLen).toFixed(3)
    : null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#ffd700]/20 to-[#00d4ff]/10 flex items-center justify-center border border-[#ffd700]/30">
            <Dna className="w-10 h-10 text-[#ffd700]" />
          </div>
          <h1 className="text-4xl font-orbitron font-bold mb-3 dna-glow-gold" style={{ color: "#ffd700" }}>
            DNA Compression
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Fold any text into QVTX DNA sequences using the biological compression engine.
          </p>
        </motion.div>

        {/* Input */}
        <GlassCard className="mb-8">
          <label className="block text-sm font-medium text-white/60 mb-3">Text to Compress</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder="Paste any text here to fold it into DNA..."
            className="w-full px-4 py-3 bg-black/40 border border-[#ffd700]/20 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-[#ffd700]/60 transition-colors resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-white/30">{input.length} chars</span>
            <button
              onClick={compress}
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-[#ffd700] to-[#00d4ff] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#ffd700]/25 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {loading ? "Folding..." : "Fold into DNA"}
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "DNA Length", value: result.dna_length ?? result.dnaLength ?? result.length ?? "—", color: "#ffd700" },
                { label: "Compression Ratio", value: ratio ? `${ratio}x` : "—", color: "#00d4ff" },
                { label: "ByteID", value: result.byteid ?? result.byteId ?? result.byte_id ?? "—", color: "#a78bfa" },
              ].map(({ label, value, color }) => (
                <GlassCard key={label} padding="p-5" className="border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4" style={{ color }} />
                    <span className="text-xs font-orbitron uppercase tracking-widest" style={{ color: `${color}80` }}>{label}</span>
                  </div>
                  <p className="font-orbitron font-bold text-xl truncate" style={{ color }}>{String(value)}</p>
                </GlassCard>
              ))}
            </div>

            {/* DNA Sequence */}
            {(result.dna ?? result.sequence ?? result.folded) && (
              <GlassCard className="border border-[#ffd700]/20 bg-gradient-to-br from-[#ffd700]/5 to-transparent">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Dna className="w-4 h-4 text-[#ffd700]" />
                    <span className="font-orbitron text-sm font-bold text-[#ffd700]">DNA Sequence</span>
                  </div>
                  <button onClick={() => copy(result.dna ?? result.sequence ?? result.folded, "dna")} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                    {copied === "dna" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/40" />}
                  </button>
                </div>
                <div className="bg-black/50 rounded-xl p-4 max-h-40 overflow-auto">
                  <p className="font-mono text-xs text-[#ffd700]/80 break-all leading-relaxed">
                    {result.dna ?? result.sequence ?? result.folded}
                  </p>
                </div>
              </GlassCard>
            )}

            {/* Remaining fields */}
            {Object.entries(result)
              .filter(([k]) => !["dna","sequence","folded","dna_length","dnaLength","length","byteid","byteId","byte_id","_inputLen"].includes(k))
              .map(([k, v]) => (
                <GlassCard key={k} padding="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 font-orbitron uppercase tracking-wider">{k}</span>
                    <span className="font-mono text-sm text-[#00d4ff]">{String(v)}</span>
                  </div>
                </GlassCard>
              ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}