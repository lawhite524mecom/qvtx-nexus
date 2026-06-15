import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  ArrowLeftRight,
  Send,
  RefreshCw,
  Check,
  AlertCircle,
  Info
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function XRPBridge({ userAddress, xrpAddress }) {
  const [sourceChain, setSourceChain] = useState("qvtx");
  const [destChain, setDestChain] = useState("xrp");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const chains = [
    { id: "qvtx", name: "QVTX Chain", icon: "Q" },
    { id: "polygon", name: "Polygon", icon: "P" },
    { id: "bsc", name: "BSC", icon: "B" },
    { id: "base", name: "Base", icon: "E" },
    { id: "xrp", name: "XRP Ledger", icon: "X" }
  ];

  const handleBridge = async () => {
    if (!amount || !sourceChain || !destChain) return;

    setLoading(true);
    try {
      const response = await base44.functions.invoke('xrplBridge', {
        sourceChain,
        destChain,
        amount: parseFloat(amount),
        userAddress: destChain === "xrp" ? xrpAddress : userAddress
      });

      setResult(response.data);
      setAmount("");
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const swapChains = () => {
    const temp = sourceChain;
    setSourceChain(destChain);
    setDestChain(temp);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-cyan-400" />
          Cross-Chain Bridge
        </h3>

        <div className="space-y-4">
          {/* Source Chain */}
          <div>
            <label className="text-sm text-white/60 mb-2 block">From</label>
            <select
              value={sourceChain}
              onChange={(e) => setSourceChain(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 text-white"
            >
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapChains}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4 text-cyan-400 rotate-90" />
            </button>
          </div>

          {/* Destination Chain */}
          <div>
            <label className="text-sm text-white/60 mb-2 block">To</label>
            <select
              value={destChain}
              onChange={(e) => setDestChain(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 text-white"
            >
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm text-white/60 mb-2 block">Amount (QVTX)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 text-white"
              disabled={loading}
            />
          </div>

          {/* Fee Info */}
          <div className="p-3 bg-white/5 rounded-lg flex items-start gap-3">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-white/60">
              <p className="mb-1">Bridge Fee: 0.1% of transaction</p>
              <p>Estimated time: 5-30 minutes</p>
            </div>
          </div>

          {/* Bridge Button */}
          <button
            onClick={handleBridge}
            disabled={loading || !amount || sourceChain === destChain}
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Bridging...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Bridge QVTX
              </>
            )}
          </button>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4"
            >
              {result.error ? (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{result.error}</p>
                </div>
              ) : (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <p className="font-semibold text-emerald-400">Bridge Initiated</p>
                  </div>
                  <p className="text-sm text-white/60 mb-2">{result.message}</p>
                  <p className="text-xs text-white/50">ID: {result.bridgeRecord?.bridgeId}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}