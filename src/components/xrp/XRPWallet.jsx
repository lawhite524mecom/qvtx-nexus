import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  Copy,
  ExternalLink,
  RefreshCw,
  Check,
  AlertCircle,
  Zap,
  Eye,
  EyeOff
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function XRPWallet({ xrpAddress, onUpdate }) {
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [error, setError] = useState("");

  const fetchBalance = async () => {
    if (!xrpAddress) return;
    
    setLoading(true);
    setError("");
    try {
      const response = await base44.functions.invoke('xrplBalance', {
        xrpAddress
      });
      
      if (response.data.accountExists) {
        setBalance(response.data.balance);
        onUpdate?.(response.data);
      } else {
        setError("XRP account not found on XRPL");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch balance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [xrpAddress]);

  const copyAddress = () => {
    navigator.clipboard.writeText(xrpAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard gradient>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-white/50 text-sm">XRP Ledger Balance</span>
              <button 
                onClick={() => setShowBalance(!showBalance)} 
                className="p-1 hover:bg-white/5 rounded-lg transition-colors"
              >
                {showBalance ? (
                  <EyeOff className="w-4 h-4 text-white/40" />
                ) : (
                  <Eye className="w-4 h-4 text-white/40" />
                )}
              </button>
            </div>
            <h2 className="text-4xl font-bold text-cyan-400 mb-2">
              {showBalance ? `${balance} XRP` : "••••••"}
            </h2>
            <div className="flex items-center gap-2 text-white/60">
              <span className="font-mono text-sm truncate">{xrpAddress}</span>
              <button
                onClick={copyAddress}
                className="p-1 hover:bg-white/5 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-white/40" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={fetchBalance}
            disabled={loading}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 text-amber-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="mt-4 flex gap-2 flex-wrap">
          <a
            href={`https://livenet.xrpl.org/accounts/${xrpAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            View on Explorer
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href={`https://xrpscan.com/account/${xrpAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            XRPScan
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </GlassCard>
    </motion.div>
  );
}