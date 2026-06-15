import React, { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  Dna,
  ArrowRight,
  Copy,
  CheckCircle,
  Loader2,
  AlertCircle,
  BarChart3
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function DNAEncoder() {
  const [mode, setMode] = useState("encode");
  const [inputType, setInputType] = useState("string");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleProcess = async () => {
    if (!input.trim()) {
      setError("Please enter some data");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      let operation, payload;

      if (mode === "encode") {
        operation = inputType === "string" ? "encode_string" : "encode_json";
        payload = {
          operation,
          data: inputType === "json" ? JSON.parse(input) : input
        };
      } else {
        operation = inputType === "string" ? "decode_string" : "decode_json";
        payload = {
          operation,
          dna: input
        };
      }

      const response = await base44.functions.invoke("dnaEncode", payload);
      setResult(response.data.result);

    } catch (err) {
      console.error("DNA operation error:", err);
      setError(err.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError("Please enter a DNA sequence");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await base44.functions.invoke("dnaEncode", {
        operation: "analyze",
        dna: input
      });

      setResult(response.data.result);

    } catch (err) {
      console.error("DNA analysis error:", err);
      setError(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderNucleotides = (dna) => {
    const colors = {
      A: "text-cyan-400",
      C: "text-emerald-400",
      G: "text-amber-400",
      T: "text-rose-400"
    };

    return dna.split('').map((nucleotide, i) => (
      <span key={i} className={colors[nucleotide] || "text-white/40"}>
        {nucleotide}
      </span>
    ));
  };

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Dna className="w-5 h-5 text-cyan-400" />
          QVTX DNA Encoder
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "encode"
                ? "bg-cyan-500 text-black"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "decode"
                ? "bg-emerald-500 text-black"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Decode
          </button>
        </div>
      </div>

      {mode === "encode" && (
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setInputType("string")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              inputType === "string"
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Text/String
          </button>
          <button
            onClick={() => setInputType("json")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              inputType === "json"
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            JSON Object
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm text-white/60 mb-2 block">
            {mode === "encode" ? "Input Data" : "DNA Sequence"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? inputType === "json"
                  ? '{"name": "QVTX", "value": 42}'
                  : "Enter text to encode..."
                : "ATGCGATCGATCG..."
            }
            rows={6}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 resize-none font-mono text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleProcess}
            disabled={loading || !input.trim()}
            className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <ArrowRight className="w-5 h-5" />
                {mode === "encode" ? "Encode to DNA" : "Decode from DNA"}
              </>
            )}
          </button>

          {mode === "decode" && (
            <button
              onClick={handleAnalyze}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-violet-500/20 text-violet-400 border border-violet-500/30 rounded-xl hover:bg-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              Analyze
            </button>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {result.dna && (
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/60">DNA Sequence</span>
                  <button
                    onClick={() => handleCopy(result.dna)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-white/40" />
                    )}
                  </button>
                </div>
                <div className="p-3 bg-black/30 rounded-lg font-mono text-xs break-all max-h-40 overflow-auto">
                  {renderNucleotides(result.dna)}
                </div>
              </div>
            )}

            {result.text && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Decoded Text</span>
                </div>
                <p className="text-white/80">{result.text}</p>
              </div>
            )}

            {result.data && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Decoded JSON</span>
                </div>
                <pre className="text-xs text-white/80 bg-black/30 p-3 rounded-lg overflow-auto max-h-40">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}

            {(result.gcContent || result.frequency) && (
              <div className="grid grid-cols-2 gap-4">
                {result.gcContent && (
                  <div className="p-4 bg-white/5 rounded-xl">
                    <span className="text-sm text-white/60">GC Content</span>
                    <p className="text-2xl font-bold text-amber-400 mt-1">
                      {result.gcContent}%
                    </p>
                  </div>
                )}

                {result.length && (
                  <div className="p-4 bg-white/5 rounded-xl">
                    <span className="text-sm text-white/60">Length</span>
                    <p className="text-2xl font-bold text-cyan-400 mt-1">
                      {result.length} bp
                    </p>
                  </div>
                )}
              </div>
            )}

            {result.frequency && (
              <div className="p-4 bg-white/5 rounded-xl">
                <span className="text-sm text-white/60 mb-3 block">
                  Nucleotide Frequency
                </span>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(result.frequency).map(([base, freq]) => (
                    <div key={base} className="text-center">
                      <div
                        className={`w-full h-24 rounded-lg flex items-end justify-center mb-2 ${
                          base === "A"
                            ? "bg-cyan-500/20"
                            : base === "C"
                            ? "bg-emerald-500/20"
                            : base === "G"
                            ? "bg-amber-500/20"
                            : "bg-rose-500/20"
                        }`}
                      >
                        <div
                          className={`w-full rounded-t-lg ${
                            base === "A"
                              ? "bg-cyan-500"
                              : base === "C"
                              ? "bg-emerald-500"
                              : base === "G"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ height: `${freq}%` }}
                        />
                      </div>
                      <div className="font-mono text-lg font-bold">{base}</div>
                      <div className="text-xs text-white/60">{freq}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </GlassCard>
  );
}