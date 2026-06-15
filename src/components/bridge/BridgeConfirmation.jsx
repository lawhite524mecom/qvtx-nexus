import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertTriangle,
  ArrowRight,
  Clock,
  Zap,
  DollarSign,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function BridgeConfirmation({ isOpen, onClose, onConfirm, details, loading }) {
  if (!isOpen || !details) return null;

  const { sourceChain, destChain, amount, protocol, userAddress } = details;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md"
        >
          <GlassCard padding="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold">Confirm Bridge</h2>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Route Overview */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sourceChain.color} flex items-center justify-center mb-2`}>
                    <span className="text-white font-bold">{sourceChain.name.charAt(0)}</span>
                  </div>
                  <p className="text-sm font-medium">{sourceChain.name}</p>
                  <p className="text-xs text-white/40">Source</p>
                </div>

                <div className="flex items-center gap-2 px-4">
                  <div className="w-12 h-[2px] bg-gradient-to-r from-cyan-500/50 to-emerald-500/50" />
                  <ArrowRight className="w-5 h-5 text-cyan-400" />
                  <div className="w-12 h-[2px] bg-gradient-to-r from-cyan-500/50 to-emerald-500/50" />
                </div>

                <div className="flex-1 text-right">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${destChain.color} flex items-center justify-center mb-2 ml-auto`}>
                    <span className="text-white font-bold">{destChain.name.charAt(0)}</span>
                  </div>
                  <p className="text-sm font-medium">{destChain.name}</p>
                  <p className="text-xs text-white/40">Destination</p>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="space-y-3 p-4 bg-white/5 rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Amount</span>
                  <span className="font-medium">{amount} QVTX</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Bridge Protocol</span>
                  <div className="flex items-center gap-2">
                    <span>{protocol.icon}</span>
                    <span className="font-medium">{protocol.name}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2 text-white/60">
                      <DollarSign className="w-4 h-4" />
                      <span>Bridge Fee ({protocol.fee}%)</span>
                    </div>
                    <span className="text-amber-400">{protocol.feeAmount} QVTX</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2 text-white/60">
                      <Zap className="w-4 h-4" />
                      <span>Network Fee</span>
                    </div>
                    <span className="text-amber-400">{protocol.networkFee} ETH</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2 text-white/60">
                      <Clock className="w-4 h-4" />
                      <span>Estimated Time</span>
                    </div>
                    <span className="text-cyan-400">{protocol.estimatedTime}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5">
                  <div className="flex justify-between">
                    <span className="text-white/80 font-medium">You Will Receive</span>
                    <span className="text-xl font-bold text-emerald-400">{protocol.receivedAmount} QVTX</span>
                  </div>
                </div>
              </div>

              {/* Recipient Address */}
              <div className="p-3 bg-white/5 rounded-xl">
                <p className="text-xs text-white/40 mb-1">Recipient Address</p>
                <p className="font-mono text-sm text-white/80 break-all">{userAddress}</p>
              </div>

              {/* Warning */}
              <div className="flex gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-400">
                  <p className="font-medium mb-1">Important Notice</p>
                  <ul className="space-y-1 text-amber-400/80">
                    <li>• Double-check destination network and address</li>
                    <li>• Bridge transactions cannot be reversed</li>
                    <li>• Tokens arrive after network confirmations</li>
                  </ul>
                </div>
              </div>

              {/* Confirmation Steps */}
              <div className="space-y-2 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-cyan-400">1</span>
                  </div>
                  <span className="text-white/80">Approve transaction in wallet</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-cyan-400">2</span>
                  </div>
                  <span className="text-white/80">Wait for source chain confirmation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-cyan-400">3</span>
                  </div>
                  <span className="text-white/80">Bridge processes cross-chain transfer</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-cyan-400">4</span>
                  </div>
                  <span className="text-white/80">Tokens arrive on {destChain.name}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm Bridge
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