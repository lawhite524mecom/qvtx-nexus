import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ethers } from "ethers";
import {
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  ExternalLink,
  Zap
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import BridgeConfirmation from "./BridgeConfirmation";
import TransactionTracker from "./TransactionTracker";

// Bridge Protocols
const BRIDGE_PROTOCOLS = {
  layerzero: { name: "LayerZero", fee: 0.1, time: "2-5 min", icon: "🔷" },
  axelar: { name: "Axelar", fee: 0.15, time: "3-7 min", icon: "🔶" },
  wormhole: { name: "Wormhole", fee: 0.12, time: "5-10 min", icon: "🌀" },
  celer: { name: "Celer cBridge", fee: 0.08, time: "10-20 min", icon: "⚡" },
  stargate: { name: "Stargate", fee: 0.06, time: "1-3 min", icon: "⭐" }
};

const NETWORKS = {
  qvtx: { 
    name: "QVTX Chain", 
    chainId: 20232, 
    rpc: "https://rpc.qvtx.io",
    explorer: "https://explorer.qvtx.io",
    color: "from-cyan-500 to-emerald-500" 
  },
  qvtxdna: { 
    name: "QVTX DNA", 
    chainId: 42000, 
    rpc: "https://dna.qvtx.io:8555",
    explorer: "https://explorer.qvtx.io",
    color: "from-violet-500 to-fuchsia-500" 
  },
  polygon: { 
    name: "Polygon", 
    chainId: 137, 
    rpc: "https://polygon-rpc.com",
    explorer: "https://polygonscan.com",
    color: "from-purple-500 to-violet-500" 
  },
  bsc: { 
    name: "BSC", 
    chainId: 56, 
    rpc: "https://bsc-dataseed.binance.org",
    explorer: "https://bscscan.com",
    color: "from-yellow-500 to-amber-500" 
  },
  base: { 
    name: "Base", 
    chainId: 8453, 
    rpc: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    color: "from-blue-500 to-cyan-500" 
  },
  arbitrum: {
    name: "Arbitrum",
    chainId: 42161,
    rpc: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io",
    color: "from-blue-400 to-blue-600"
  },
  optimism: {
    name: "Optimism",
    chainId: 10,
    rpc: "https://mainnet.optimism.io",
    explorer: "https://optimistic.etherscan.io",
    color: "from-red-400 to-red-600"
  }
};

export default function CrossChainBridge({ userAddress, onSuccess }) {
  const [sourceChain, setSourceChain] = useState("qvtx");
  const [destChain, setDestChain] = useState("polygon");
  const [amount, setAmount] = useState("");
  const [selectedProtocol, setSelectedProtocol] = useState("stargate");
  const [loading, setLoading] = useState(false);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bridgeDetails, setBridgeDetails] = useState(null);
  const [activeBridgeTx, setActiveBridgeTx] = useState(null);
  const [balance, setBalance] = useState("0");
  const [error, setError] = useState("");

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      fetchBridgeQuotes();
    } else {
      setQuotes([]);
    }
  }, [sourceChain, destChain, amount]);

  useEffect(() => {
    fetchBalance();
  }, [sourceChain, userAddress]);

  const fetchBalance = async () => {
    if (!userAddress) return;
    try {
      const provider = new ethers.JsonRpcProvider(NETWORKS[sourceChain].rpc);
      const bal = await provider.getBalance(userAddress);
      setBalance(ethers.formatEther(bal));
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const fetchBridgeQuotes = async () => {
    setLoadingQuotes(true);
    try {
      // Simulate fetching quotes from different protocols
      const protocolQuotes = Object.entries(BRIDGE_PROTOCOLS).map(([key, protocol]) => {
        const amt = parseFloat(amount);
        const feeAmount = amt * (protocol.fee / 100);
        const receivedAmount = amt - feeAmount;
        const networkFee = 0.002; // Simulated
        
        return {
          protocol: key,
          name: protocol.name,
          icon: protocol.icon,
          fee: protocol.fee,
          feeAmount: feeAmount.toFixed(6),
          receivedAmount: receivedAmount.toFixed(6),
          networkFee: networkFee.toFixed(6),
          estimatedTime: protocol.time,
          totalCost: (feeAmount + networkFee).toFixed(6)
        };
      });

      // Sort by best received amount (lowest fees)
      protocolQuotes.sort((a, b) => parseFloat(b.receivedAmount) - parseFloat(a.receivedAmount));
      setQuotes(protocolQuotes);
      setSelectedProtocol(protocolQuotes[0].protocol);
    } catch (err) {
      console.error("Error fetching quotes:", err);
    } finally {
      setLoadingQuotes(false);
    }
  };

  const handleReviewBridge = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) > parseFloat(balance)) {
      setError("Insufficient balance");
      return;
    }

    if (sourceChain === destChain) {
      setError("Source and destination chains must be different");
      return;
    }

    const selectedQuote = quotes.find(q => q.protocol === selectedProtocol);
    
    setBridgeDetails({
      sourceChain: NETWORKS[sourceChain],
      destChain: NETWORKS[destChain],
      amount: amount,
      protocol: selectedQuote,
      userAddress: userAddress,
      timestamp: Date.now()
    });
    
    setError("");
    setShowConfirmation(true);
  };

  const executeBridge = async () => {
    try {
      setLoading(true);
      setError("");

      if (!window.ethereum) {
        throw new Error("Please connect your wallet");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Switch to source chain
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${NETWORKS[sourceChain].chainId.toString(16)}` }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          throw new Error(`Please add ${NETWORKS[sourceChain].name} to your wallet`);
        }
        throw switchError;
      }

      // Mock bridge transaction (in production, integrate with actual bridge contracts)
      const tx = await signer.sendTransaction({
        to: "0x1234567890123456789012345678901234567890", // Bridge contract
        value: ethers.parseEther(amount),
        data: "0x" // Bridge call data
      });

      // Start tracking
      const bridgeTx = {
        txHash: tx.hash,
        sourceChain: sourceChain,
        destChain: destChain,
        amount: amount,
        protocol: selectedProtocol,
        status: "pending",
        timestamp: Date.now()
      };

      setActiveBridgeTx(bridgeTx);
      setShowConfirmation(false);
      
      // Wait for confirmation
      await tx.wait();
      
      // Update status
      setActiveBridgeTx({...bridgeTx, status: "confirmed"});
      
      // Reset form
      setTimeout(() => {
        setAmount("");
        setActiveBridgeTx(null);
        onSuccess?.();
      }, 3000);

    } catch (err) {
      console.error("Bridge error:", err);
      setError(err.message || "Bridge failed. Please try again.");
      if (activeBridgeTx) {
        setActiveBridgeTx({...activeBridgeTx, status: "failed", error: err.message});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          Cross-Chain Bridge
        </h3>

        <div className="space-y-4">
          {/* Source Chain */}
          <div>
            <label className="text-sm text-white/60 mb-2 block">From Network</label>
            <select
              value={sourceChain}
              onChange={(e) => setSourceChain(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 text-white"
            >
              {Object.entries(NETWORKS).map(([key, network]) => (
                <option key={key} value={key}>{network.name}</option>
              ))}
            </select>
            <div className="mt-2 text-xs text-white/40">
              Balance: {parseFloat(balance).toFixed(4)} QVTX
            </div>
          </div>

          {/* Bridge Arrow */}
          <div className="flex justify-center py-2">
            <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-xl">
              <ArrowRight className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          {/* Destination Chain */}
          <div>
            <label className="text-sm text-white/60 mb-2 block">To Network</label>
            <select
              value={destChain}
              onChange={(e) => setDestChain(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 text-white"
            >
              {Object.entries(NETWORKS).map(([key, network]) => (
                <option key={key} value={key}>{network.name}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm text-white/60 mb-2 block">Amount (QVTX)</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 text-white"
                step="0.000001"
              />
              <button
                onClick={() => setAmount(balance)}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-medium hover:bg-cyan-500/30 transition-colors"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Protocol Quotes */}
          {quotes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Bridge Protocol</span>
                {loadingQuotes && (
                  <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                )}
              </div>
              
              {quotes.slice(0, 3).map((quote, index) => (
                <button
                  key={quote.protocol}
                  onClick={() => setSelectedProtocol(quote.protocol)}
                  className={`w-full p-4 rounded-xl border transition-all text-left ${
                    selectedProtocol === quote.protocol
                      ? "bg-cyan-500/10 border-cyan-500/30"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{quote.icon}</span>
                      <div>
                        <span className="font-medium">{quote.name}</span>
                        {index === 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                            Best Rate
                          </span>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-xs text-white/40">
                          <Clock className="w-3 h-3" />
                          <span>{quote.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-400">{quote.receivedAmount} QVTX</p>
                      <p className="text-xs text-white/40">Fee: {quote.fee}%</p>
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {/* Info Banner */}
          {sourceChain !== destChain && (
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex gap-3">
              <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-cyan-400">
                <p className="font-medium mb-1">Cross-chain transfer</p>
                <p className="text-cyan-400/80">
                  Your tokens will be bridged to {NETWORKS[destChain].name}. 
                  Transaction status can be tracked in real-time.
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex gap-2 text-sm text-rose-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Bridge Button */}
          <button
            onClick={handleReviewBridge}
            disabled={loading || !amount || parseFloat(amount) <= 0 || sourceChain === destChain}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Review Bridge Transaction
          </button>
        </div>
      </GlassCard>

      {/* Active Transaction Tracker */}
      {activeBridgeTx && (
        <TransactionTracker
          transaction={activeBridgeTx}
          sourceNetwork={NETWORKS[activeBridgeTx.sourceChain]}
          destNetwork={NETWORKS[activeBridgeTx.destChain]}
          onClose={() => setActiveBridgeTx(null)}
        />
      )}

      {/* Confirmation Modal */}
      <BridgeConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={executeBridge}
        details={bridgeDetails}
        loading={loading}
      />
    </div>
  );
}