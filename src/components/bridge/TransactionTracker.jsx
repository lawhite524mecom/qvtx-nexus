import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  ArrowRight,
  Loader2
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function TransactionTracker({ transaction, sourceNetwork, destNetwork, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(null);

  useEffect(() => {
    if (transaction.status === "pending") {
      setCurrentStep(1);
      setProgress(25);
      simulateProgress();
    } else if (transaction.status === "confirmed") {
      setCurrentStep(2);
      setProgress(50);
      
      setTimeout(() => {
        setCurrentStep(3);
        setProgress(75);
        
        setTimeout(() => {
          setCurrentStep(4);
          setProgress(100);
        }, 30000); // Simulate bridge processing
      }, 5000); // Wait for confirmations
    } else if (transaction.status === "failed") {
      setCurrentStep(1);
      setProgress(0);
    }
  }, [transaction.status]);

  const simulateProgress = () => {
    // Calculate estimated arrival time based on protocol
    const protocolTimes = {
      stargate: 180, // 3 minutes
      layerzero: 300,
      celer: 1200,
      axelar: 420,
      wormhole: 600
    };
    
    const estimatedSeconds = protocolTimes[transaction.protocol] || 300;
    setEstimatedTime(new Date(Date.now() + estimatedSeconds * 1000));
  };

  const steps = [
    {
      number: 1,
      title: "Transaction Submitted",
      description: `Confirming on ${sourceNetwork.name}`,
      icon: Clock,
      status: currentStep >= 1 ? "complete" : "pending"
    },
    {
      number: 2,
      title: "Source Confirmed",
      description: "Bridge processing transfer",
      icon: RefreshCw,
      status: currentStep >= 2 ? "complete" : currentStep === 2 ? "active" : "pending"
    },
    {
      number: 3,
      title: "Cross-Chain Transfer",
      description: "Tokens in transit",
      icon: ArrowRight,
      status: currentStep >= 3 ? "complete" : currentStep === 3 ? "active" : "pending"
    },
    {
      number: 4,
      title: "Completed",
      description: `Arrived on ${destNetwork.name}`,
      icon: CheckCircle2,
      status: currentStep >= 4 ? "complete" : "pending"
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Bridge Transaction</h3>
              <p className="text-xs text-white/40 mt-1 font-mono">{transaction.txHash.slice(0, 10)}...{transaction.txHash.slice(-8)}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {/* Status Banner */}
          {transaction.status === "failed" ? (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-rose-400" />
                <div>
                  <p className="font-semibold text-rose-400">Transaction Failed</p>
                  <p className="text-sm text-rose-400/80 mt-1">{transaction.error}</p>
                </div>
              </div>
            </div>
          ) : currentStep === 4 ? (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <p className="font-semibold text-emerald-400">Bridge Completed!</p>
                  <p className="text-sm text-emerald-400/80 mt-1">
                    {transaction.amount} QVTX arrived on {destNetwork.name}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                <div className="flex-1">
                  <p className="font-semibold text-cyan-400">Bridge in Progress</p>
                  {estimatedTime && (
                    <p className="text-sm text-cyan-400/80 mt-1">
                      Est. arrival: {estimatedTime.toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-cyan-400">{progress}%</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Transaction Details */}
          <div className="mb-6 p-4 bg-white/5 rounded-xl space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Amount</span>
              <span className="font-medium">{transaction.amount} QVTX</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">From</span>
              <span className="font-medium">{sourceNetwork.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">To</span>
              <span className="font-medium">{destNetwork.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Protocol</span>
              <span className="font-medium capitalize">{transaction.protocol}</span>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4 mb-6">
            {steps.map((step, index) => (
              <div key={step.number} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    step.status === "complete"
                      ? "bg-emerald-500/20 border-2 border-emerald-500"
                      : step.status === "active"
                      ? "bg-cyan-500/20 border-2 border-cyan-500 animate-pulse"
                      : "bg-white/5 border-2 border-white/10"
                  }`}>
                    {step.status === "complete" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : step.status === "active" ? (
                      <step.icon className="w-5 h-5 text-cyan-400 animate-spin" />
                    ) : (
                      <step.icon className="w-5 h-5 text-white/40" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-0.5 h-12 my-1 transition-all ${
                      step.status === "complete" ? "bg-emerald-500/50" : "bg-white/10"
                    }`} />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className={`font-medium ${
                    step.status === "complete" 
                      ? "text-emerald-400" 
                      : step.status === "active"
                      ? "text-cyan-400"
                      : "text-white/60"
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-sm text-white/40 mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Explorer Links */}
          <div className="flex gap-3">
            <a
              href={`${sourceNetwork.explorer}/tx/${transaction.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <span>Source Tx</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            {currentStep >= 4 && (
              <a
                href={`${destNetwork.explorer}/address/${transaction.userAddress || ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <span>Destination</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
}