import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ethers } from "ethers";
import {
  X,
  ArrowDownUp,
  ChevronDown,
  Settings,
  AlertCircle,
  Zap,
  RefreshCw,
  ArrowRight,
  Info
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import TransactionConfirmModal from "./TransactionConfirmModal";
import MultiChainSwapOptimizer from "./MultiChainSwapOptimizer";
import { fetchGasPrice, estimateGasCost, getOptimalGasPrice } from "./gasOracle";
import { findBestRate, calculateSavings } from "./DexAggregator";
import CrossChainBridge from "../bridge/CrossChainBridge";

const NETWORKS = {
  qvtx: { name: "QVTX Chain", chainId: 20232, color: "from-cyan-500 to-emerald-500" },
  qvtxdna: { name: "QVTX DNA", chainId: 42000, color: "from-violet-500 to-fuchsia-500" },
  polygon: { name: "Polygon", chainId: 137, color: "from-purple-500 to-violet-500" },
  bsc: { name: "BSC", chainId: 56, color: "from-yellow-500 to-amber-500" },
  base: { name: "Base", chainId: 8453, color: "from-blue-500 to-cyan-500" }
};

const TOKENS = {
  qvtx: [
    { symbol: "QVTX", name: "QVTX Native", address: "native", decimals: 18 },
    { symbol: "WQVTX", name: "Wrapped QVTX", address: "0x817F9b61ae0FC99F617Cda74B4CA56063712A54d", decimals: 18 }
  ],
  qvtxdna: [
    { symbol: "SQVTX", name: "Super QVTX", address: "native", decimals: 18 },
    { symbol: "QVTX", name: "QVTX Token", address: "0xDNA1234567890123456789012345678901234567", decimals: 18 }
  ],
  polygon: [
    { symbol: "MATIC", name: "Polygon", address: "native", decimals: 18 },
    { symbol: "QVTX", name: "QVTX Token", address: "0x43cc625d326618f23aECf39C170B1401509475E8", decimals: 18 }
  ],
  bsc: [
    { symbol: "BNB", name: "BNB", address: "native", decimals: 18 },
    { symbol: "QVTX", name: "QVTX Token", address: "0x9010e4c8149114b1fd2a0267a6b4138ee01af4af", decimals: 18 }
  ],
  base: [
    { symbol: "ETH", name: "Ethereum", address: "native", decimals: 18 },
    { symbol: "QVTX", name: "QVTX Token", address: "0x0d60757db0b32cbe4f536d297733635cd50f0f73", decimals: 18 }
  ]
};

const SWAP_ROUTER = "0xa12cF0ae4afC64a8c975ADf652Ea72d4Be9ab92b";
const BRIDGE_CONTRACT = "0x4418B55a0D897126Db48b572668Db6e4f2e27a74";

export default function SwapModal({ isOpen, onClose, userAddress, userBalances }) {
  const [fromNetwork, setFromNetwork] = useState("qvtx");
  const [toNetwork, setToNetwork] = useState("polygon");
  const [fromToken, setFromToken] = useState(TOKENS.qvtx[0]);
  const [toToken, setToToken] = useState(TOKENS.polygon[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exchangeRate, setExchangeRate] = useState(0.98);
  const [estimatedGas, setEstimatedGas] = useState("0.003");
  const [bridgeFee, setBridgeFee] = useState("0.1");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [gasPrices, setGasPrices] = useState({ slow: "20", standard: "25", fast: "30", instant: "35" });
  const [selectedGasSpeed, setSelectedGasSpeed] = useState("standard");
  const [gasCostDetails, setGasCostDetails] = useState(null);
  const [dexQuotes, setDexQuotes] = useState([]);
  const [selectedDex, setSelectedDex] = useState(null);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showBridgeMode, setShowBridgeMode] = useState(false);

  const isCrossChain = fromNetwork !== toNetwork;
  const isSameToken = fromToken.symbol === "QVTX" && toToken.symbol === "QVTX";

  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0 && !isCrossChain) {
      fetchDexQuotes();
    } else if (fromAmount && parseFloat(fromAmount) > 0) {
      calculateToAmount();
    } else {
      setToAmount("");
      setDexQuotes([]);
    }
  }, [fromAmount, fromToken, toToken, fromNetwork, toNetwork, slippage]);

  useEffect(() => {
    // Fetch gas prices when network changes
    updateGasPrices();
  }, [fromNetwork]);

  useEffect(() => {
    // Update gas cost estimation when relevant params change
    if (fromAmount && parseFloat(fromAmount) > 0) {
      updateGasCost();
    }
  }, [fromNetwork, isCrossChain, selectedGasSpeed, gasPrices]);

  const updateGasPrices = async () => {
    try {
      const prices = await fetchGasPrice(fromNetwork);
      setGasPrices(prices);
    } catch (error) {
      console.error("Error fetching gas prices:", error);
    }
  };

  const updateGasCost = () => {
    const txType = isCrossChain ? "bridge" : "swap";
    const gasPrice = getOptimalGasPrice(gasPrices, selectedGasSpeed);
    const cost = estimateGasCost(fromNetwork, txType, gasPrice);
    setGasCostDetails(cost);
    setEstimatedGas(cost.totalCost);
  };

  const fetchDexQuotes = async () => {
    if (fromNetwork === toNetwork && fromToken.symbol !== toToken.symbol) {
      setLoadingQuotes(true);
      try {
        const quotes = await findBestRate(fromNetwork, fromToken, toToken, fromAmount);
        setDexQuotes(quotes);
        
        if (quotes.length > 0) {
          setSelectedDex(quotes[0]);
          setToAmount(quotes[0].outputAmount);
          setExchangeRate(parseFloat(quotes[0].rate));
        }
      } catch (error) {
        console.error("Error fetching DEX quotes:", error);
        calculateToAmount(); // Fallback to simple calculation
      } finally {
        setLoadingQuotes(false);
      }
    } else {
      setDexQuotes([]);
      setSelectedDex(null);
    }
  };

  const calculateToAmount = () => {
    const amount = parseFloat(fromAmount);
    if (!amount) return;

    // Simulate exchange rate calculation
    let rate = 1.0;
    let fee = 0;

    if (isCrossChain) {
      // Bridge fee
      fee = parseFloat(bridgeFee);
      rate = 0.995; // 0.5% bridge fee
    } else if (fromToken.address === "native" || toToken.address === "native") {
      // Swap native <-> token
      rate = fromToken.address === "native" ? 0.98 : 1.02;
    }

    const slippageMultiplier = 1 - (slippage / 100);
    const result = (amount - fee) * rate * slippageMultiplier;
    setToAmount(result.toFixed(6));
    setExchangeRate(rate);
  };

  const handleSwapNetworks = () => {
    const tempNetwork = fromNetwork;
    const tempToken = fromToken;
    setFromNetwork(toNetwork);
    setToNetwork(tempNetwork);
    setFromToken(toToken);
    setToToken(tempToken);
  };

  const handleMaxAmount = () => {
    const balance = getTokenBalance(fromNetwork, fromToken.symbol);
    setFromAmount(balance);
  };

  const getTokenBalance = (network, symbol) => {
    if (symbol === "QVTX") {
      if (network === "qvtx") return parseFloat(userBalances.qvtx.native).toFixed(4);
      if (network === "polygon") return parseFloat(userBalances.polygon.qvtx).toFixed(4);
      if (network === "bsc") return parseFloat(userBalances.bsc.qvtx).toFixed(4);
      if (network === "base") return parseFloat(userBalances.base.qvtx).toFixed(4);
    }
    if (symbol === "MATIC") return parseFloat(userBalances.polygon.native).toFixed(4);
    if (symbol === "BNB") return parseFloat(userBalances.bsc.native).toFixed(4);
    if (symbol === "ETH") return parseFloat(userBalances.base.native).toFixed(4);
    return "0";
  };

  const handleSwapClick = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setError("Please enter an amount");
      return;
    }

    const balance = parseFloat(getTokenBalance(fromNetwork, fromToken.symbol));
    if (parseFloat(fromAmount) > balance) {
      setError("Insufficient balance");
      return;
    }

    setError("");
    setShowConfirmModal(true);
  };

  const executeSwap = async () => {
    try {
      setLoading(true);
      setError("");

      if (!window.ethereum) {
        setError("Please connect your wallet");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      if (isCrossChain) {
        // Cross-chain bridge swap
        const bridgeContract = new ethers.Contract(
          BRIDGE_CONTRACT,
          ["function bridge(uint256 targetChain, uint256 amount, address recipient) external payable"],
          signer
        );

        const targetChainId = NETWORKS[toNetwork].chainId;
        const amount = ethers.parseEther(fromAmount);
        const bridgeFeeWei = ethers.parseEther(bridgeFee);

        const tx = await bridgeContract.bridge(targetChainId, amount, userAddress, {
          value: bridgeFeeWei
        });

        await tx.wait();
        alert("Bridge transaction successful! Tokens will arrive in 5-10 minutes.");
      } else {
        // Same-chain swap via DEX
        const routerContract = new ethers.Contract(
          SWAP_ROUTER,
          [
            "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) external returns (uint256[] amounts)"
          ],
          signer
        );

        const amount = ethers.parseEther(fromAmount);
        const minAmount = ethers.parseEther((parseFloat(toAmount) * 0.99).toString());
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

        const tx = await routerContract.swapExactTokensForTokens(
          amount,
          minAmount,
          [fromToken.address, toToken.address],
          userAddress,
          deadline
        );

        await tx.wait();
        alert("Swap successful!");
      }

      setFromAmount("");
      setToAmount("");
      setShowConfirmModal(false);
      onClose();

    } catch (err) {
      console.error("Swap error:", err);
      setError(err.message || "Swap failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const transactionDetails = fromAmount && parseFloat(fromAmount) > 0 ? {
    type: isCrossChain ? "bridge" : "swap",
    fromToken: fromToken.symbol,
    toToken: toToken.symbol,
    fromAmount: fromAmount,
    toAmount: toAmount,
    fromNetwork: NETWORKS[fromNetwork].name,
    toNetwork: NETWORKS[toNetwork].name,
    exchangeRate: exchangeRate.toFixed(4),
    slippage: slippage,
    gasFee: estimatedGas,
    gasPrice: `${gasPrices[selectedGasSpeed]} Gwei`,
    bridgeFee: isCrossChain ? `${bridgeFee}` : null,
    estimatedTime: isCrossChain ? "5-10 minutes" : "~30 seconds",
    totalCost: (parseFloat(estimatedGas) + (isCrossChain ? parseFloat(bridgeFee) * 0.0001 : 0)).toFixed(6),
    dexRoute: selectedDex?.dex || "Direct",
    priceImpact: selectedDex?.priceImpact || "0.00"
  } : null;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg"
        >
          <GlassCard padding="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">
                  {isCrossChain && showBridgeMode ? "Cross-Chain Bridge" : "Swap Tokens"}
                </h2>
                {isCrossChain && (
                  <button
                    onClick={() => setShowBridgeMode(!showBridgeMode)}
                    className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-medium hover:bg-cyan-500/30 transition-colors"
                  >
                    {showBridgeMode ? "Simple Mode" : "Advanced Bridge"}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-white/60" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Advanced Bridge Mode */}
              {isCrossChain && showBridgeMode && (
                <CrossChainBridge
                  userAddress={userAddress}
                  onSuccess={() => {
                    setFromAmount("");
                    setToAmount("");
                    onClose();
                  }}
                />
              )}

              {/* Standard Swap Interface */}
              {(!isCrossChain || !showBridgeMode) && (
                <>
              {/* AI Route Optimizer for Cross-Chain */}
              {isCrossChain && fromAmount && parseFloat(fromAmount) > 0 && (
                <MultiChainSwapOptimizer
                  fromNetwork={fromNetwork}
                  toNetwork={toNetwork}
                  fromToken={fromToken}
                  toToken={toToken}
                  amount={fromAmount}
                  onSelectRoute={(route) => {
                    setSelectedRoute(route);
                    if (route && route.outputAmount) {
                      setToAmount(route.outputAmount);
                    }
                  }}
                />
              )}

              {/* Settings Panel */}
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-white/5 rounded-xl space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">Slippage Tolerance</span>
                      <div className="flex gap-2">
                        {[0.1, 0.5, 1.0].map((val) => (
                          <button
                            key={val}
                            onClick={() => setSlippage(val)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                              slippage === val
                                ? "bg-cyan-500 text-black"
                                : "bg-white/5 text-white/60 hover:bg-white/10"
                            }`}
                          >
                            {val}%
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="number"
                      value={slippage}
                      onChange={(e) => setSlippage(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
                      step="0.1"
                      min="0.1"
                      max="50"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/60">Gas Speed</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {["slow", "standard", "fast", "instant"].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => setSelectedGasSpeed(speed)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            selectedGasSpeed === speed
                              ? "bg-emerald-500 text-black"
                              : "bg-white/5 text-white/60 hover:bg-white/10"
                          }`}
                        >
                          <div className="capitalize">{speed}</div>
                          <div className="text-[10px] opacity-70">{gasPrices[speed]} Gwei</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* From Section */}
              <div className="mb-2">
                <label className="text-sm text-white/50 mb-2 block">From</label>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex justify-between items-start mb-3">
                    <select
                      value={fromNetwork}
                      onChange={(e) => {
                        setFromNetwork(e.target.value);
                        setFromToken(TOKENS[e.target.value][0]);
                      }}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
                    >
                      {Object.entries(NETWORKS).map(([key, net]) => (
                        <option key={key} value={key}>{net.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleMaxAmount}
                      className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-medium hover:bg-cyan-500/30 transition-colors"
                    >
                      MAX
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <select
                      value={fromToken.symbol}
                      onChange={(e) => {
                        const token = TOKENS[fromNetwork].find(t => t.symbol === e.target.value);
                        setFromToken(token);
                      }}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50 flex-1"
                    >
                      {TOKENS[fromNetwork].map((token) => (
                        <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="0.0"
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500/50 text-right"
                      step="0.000001"
                    />
                  </div>

                  <div className="flex justify-between mt-2 text-xs text-white/40">
                    <span>Balance: {getTokenBalance(fromNetwork, fromToken.symbol)}</span>
                  </div>
                </div>
              </div>

              {/* Swap Direction Button */}
              <div className="flex justify-center -my-2 relative z-10">
                <button
                  onClick={handleSwapNetworks}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all hover:rotate-180 duration-300"
                >
                  <ArrowDownUp className="w-5 h-5 text-cyan-400" />
                </button>
              </div>

              {/* To Section */}
              <div className="mb-4">
                <label className="text-sm text-white/50 mb-2 block">To</label>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="mb-3">
                    <select
                      value={toNetwork}
                      onChange={(e) => {
                        setToNetwork(e.target.value);
                        setToToken(TOKENS[e.target.value][0]);
                      }}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
                    >
                      {Object.entries(NETWORKS).map(([key, net]) => (
                        <option key={key} value={key}>{net.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <select
                      value={toToken.symbol}
                      onChange={(e) => {
                        const token = TOKENS[toNetwork].find(t => t.symbol === e.target.value);
                        setToToken(token);
                      }}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50 flex-1"
                    >
                      {TOKENS[toNetwork].map((token) => (
                        <option key={token.symbol} value={token.symbol}>{token.symbol}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      value={toAmount}
                      readOnly
                      placeholder="0.0"
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-right text-white/60"
                    />
                  </div>
                </div>
              </div>

              {/* DEX Quote Comparison */}
              {!isCrossChain && dexQuotes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-white/60">Compare Rates</span>
                    {loadingQuotes && (
                      <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                    )}
                  </div>
                  <div className="space-y-2">
                    {dexQuotes.slice(0, 3).map((quote, index) => {
                      const savings = index === 0 && dexQuotes.length > 1 
                        ? calculateSavings(dexQuotes[0], dexQuotes[1])
                        : null;
                      
                      return (
                        <button
                          key={quote.dex}
                          onClick={() => {
                            setSelectedDex(quote);
                            setToAmount(quote.outputAmount);
                            setExchangeRate(parseFloat(quote.rate));
                          }}
                          className={`w-full p-3 rounded-xl border transition-all text-left ${
                            selectedDex?.dex === quote.dex
                              ? "bg-cyan-500/10 border-cyan-500/30"
                              : "bg-white/5 border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{quote.dex}</span>
                              {index === 0 && (
                                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                                  Best Rate
                                </span>
                              )}
                            </div>
                            <span className="font-semibold text-emerald-400">{quote.outputAmount}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-white/40">
                            <span>Fee: {quote.fee}% • Impact: {quote.priceImpact}%</span>
                            {savings && index === 0 && (
                              <span className="text-emerald-400">
                                +{savings.amount} ({savings.percentage}% better)
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Swap Details */}
              {fromAmount && parseFloat(fromAmount) > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10 space-y-2 text-sm"
                >
                  <div className="flex justify-between">
                    <span className="text-white/50">Exchange Rate</span>
                    <span>1 {fromToken.symbol} = {exchangeRate.toFixed(4)} {toToken.symbol}</span>
                  </div>
                  {!isCrossChain && selectedDex && (
                    <div className="flex justify-between">
                      <span className="text-white/50">Route</span>
                      <span className="text-cyan-400">{selectedDex.dex}</span>
                    </div>
                  )}
                  {!isCrossChain && selectedDex && (
                    <div className="flex justify-between">
                      <span className="text-white/50">Price Impact</span>
                      <span className={parseFloat(selectedDex.priceImpact) > 1 ? "text-amber-400" : "text-emerald-400"}>
                        {selectedDex.priceImpact}%
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-white/50">Slippage Tolerance</span>
                    <span>{slippage}%</span>
                  </div>
                  {isCrossChain && (
                    <div className="flex justify-between">
                      <span className="text-white/50">Bridge Fee</span>
                      <span className="text-amber-400">{bridgeFee} {fromToken.symbol}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span className="text-white/50">Network Fee</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-emerald-400">{estimatedGas} ETH</p>
                      {gasCostDetails && (
                        <p className="text-xs text-white/40">${gasCostDetails.totalCostUSD}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/5 font-medium">
                    <span className="text-white/50">You will receive</span>
                    <span className="text-emerald-400">{toAmount} {toToken.symbol}</span>
                  </div>
                </motion.div>
              )}

              {/* Info Banner */}
              {isCrossChain && (
                <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex gap-3">
                  <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-cyan-400">
                    <p className="font-medium mb-1">Cross-chain bridge</p>
                    <p className="text-cyan-400/80">
                      Tokens will arrive in your {NETWORKS[toNetwork].name} wallet in 5-10 minutes after confirmation.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex gap-2 text-sm text-rose-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Swap Button */}
              <button
                onClick={handleSwapClick}
                disabled={loading || !fromAmount || parseFloat(fromAmount) <= 0}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCrossChain ? (
                  <>
                    <Zap className="w-5 h-5" />
                    Review Bridge
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    Review Swap
                    </>
                    )}
                    </button>
                    </>
                    )}
                    </div>
                    </GlassCard>
        </motion.div>

        {/* Confirmation Modal */}
        <TransactionConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={executeSwap}
          transactionDetails={transactionDetails}
          loading={loading}
        />
      </div>
    </AnimatePresence>
  );
}