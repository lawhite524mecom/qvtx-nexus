import React, { useState } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coins, ArrowUpRight, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import GlassCard from "../ui/GlassCard";

const MASTERCHEF_ADDRESS = "0x7C8a52f406890AABe523774298e61AC53231005E";
const QVTX_TOKEN_ADDRESS = "0x817F9b61ae0FC99F617Cda74B4CA56063712A54d";

const MASTERCHEF_ABI = [
  "function deposit(uint256 _pid, uint256 _amount)",
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];

export default function QuickStakeModal({ isOpen, onClose, userAddress, walletBalance, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) > parseFloat(walletBalance)) {
      setError("Insufficient balance");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const qvtxToken = new ethers.Contract(QVTX_TOKEN_ADDRESS, ERC20_ABI, signer);
      const masterChef = new ethers.Contract(MASTERCHEF_ADDRESS, MASTERCHEF_ABI, signer);
      
      const amountWei = ethers.parseEther(amount);
      
      // Check allowance
      const allowance = await qvtxToken.allowance(userAddress, MASTERCHEF_ADDRESS);
      
      if (allowance < amountWei) {
        setSuccess("Approving QVTX...");
        const approveTx = await qvtxToken.approve(MASTERCHEF_ADDRESS, ethers.MaxUint256);
        await approveTx.wait();
      }
      
      setSuccess("Staking QVTX...");
      const stakeTx = await masterChef.deposit(0, amountWei);
      await stakeTx.wait();
      
      setSuccess("Successfully staked!");
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error("Stake error:", err);
      setError(err.reason || err.message || "Failed to stake");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-md"
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Coins className="w-6 h-6 text-emerald-400" />
                Quick Stake
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm">{success}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-2 block">Amount to Stake</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500/50 transition-colors pr-20"
                  />
                  <button
                    onClick={() => setAmount(walletBalance)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
                  >
                    MAX
                  </button>
                </div>
                <div className="flex justify-between mt-2 text-xs text-white/40">
                  <span>Available: {parseFloat(walletBalance).toFixed(4)} QVTX</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Estimated APY</span>
                    <span className="text-emerald-400 font-semibold">~45.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Lock Period</span>
                    <span className="text-white">None (Flexible)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Contract</span>
                    <span className="text-cyan-400 font-mono text-xs">MasterChef</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStake}
                disabled={loading || !amount || parseFloat(amount) <= 0}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-5 h-5" />
                    Stake Now
                  </>
                )}
              </button>

              <p className="text-xs text-white/40 text-center">
                Staking will lock your QVTX in the MasterChef contract and start earning rewards immediately
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}