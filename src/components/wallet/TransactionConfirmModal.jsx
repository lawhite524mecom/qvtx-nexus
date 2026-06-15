import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Shield,
  Clock,
  Zap,
  Info,
  X,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function TransactionConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  transactionDetails,
  loading 
}) {
  if (!isOpen || !transactionDetails) return null;

  const {
    type, // "swap" or "bridge"
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    fromNetwork,
    toNetwork,
    exchangeRate,
    slippage,
    gasFee,
    gasPrice,
    bridgeFee,
    estimatedTime,
    totalCost
  } = transactionDetails;

  const isCrossChain = type === "bridge";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md"
        >
          <GlassCard padding="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-xl font-bold">Confirm Transaction</h2>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <div className="p-6">
              {/* Warning Banner */}
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-amber-400 font-medium mb-1">Review Carefully</p>
                  <p className="text-amber-400/80">
                    Please review all transaction details. Once confirmed, this action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Transaction Flow */}
              <div className="mb-6 p-4 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-black font-bold">
                      {fromToken[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{fromAmount} {fromToken}</p>
                      <p className="text-xs text-white/40">{fromNetwork}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-cyan-400" />
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-right">{toAmount} {toToken}</p>
                      <p className="text-xs text-white/40 text-right">{toNetwork}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {toToken[0]}
                    </div>
                  </div>
                </div>

                {isCrossChain && (
                  <div className="flex items-center gap-2 text-xs text-cyan-400 bg-cyan-500/10 px-3 py-2 rounded-lg">
                    <Zap className="w-3 h-3" />
                    <span>Cross-chain bridge transaction</span>
                  </div>
                )}
              </div>

              {/* Transaction Details */}
              <div className="space-y-3 mb-6">
                <div className="p-4 bg-white/5 rounded-xl space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Exchange Rate</span>
                    <span className="font-medium">1 {fromToken} = {exchangeRate} {toToken}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white/50">Slippage Tolerance</span>
                    <span className="font-medium">{slippage}%</span>
                  </div>

                  {isCrossChain && bridgeFee && (
                    <div className="flex justify-between">
                      <span className="text-white/50">Bridge Fee</span>
                      <span className="font-medium text-amber-400">{bridgeFee} {fromToken}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span className="text-white/50">Network Fee (Gas)</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-emerald-400">{gasFee} ETH</p>
                      <p className="text-xs text-white/40">{gasPrice} Gwei</p>
                    </div>
                  </div>

                  {isCrossChain && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span className="text-white/50">Estimated Time</span>
                      </div>
                      <span className="font-medium">{estimatedTime}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-3 border-t border-white/5 font-semibold">
                    <span className="text-white">Total Cost</span>
                    <span className="text-rose-400">{totalCost} ETH</span>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="mb-6 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex gap-3">
                <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-cyan-400">
                  {isCrossChain ? (
                    <p>
                      Your tokens will be locked on {fromNetwork} and minted on {toNetwork}. 
                      This process typically takes {estimatedTime} to complete.
                    </p>
                  ) : (
                    <p>
                      This transaction will be executed on {fromNetwork} via the QVTX DEX router. 
                      The minimum amount you'll receive is {(parseFloat(toAmount) * 0.99).toFixed(6)} {toToken}.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Confirm
                    </>
                  )}
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}