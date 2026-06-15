import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Target,
  RefreshCw,
  ChevronRight,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Info,
  Clock,
  DollarSign,
  Percent,
  BarChart3
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function TradingAssistant({ userAddress, userBalances, onTrade }) {
  const [signals, setSignals] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [rebalancing, setRebalancing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (userAddress) {
      analyzeMarket();
      const interval = setInterval(analyzeMarket, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [userAddress, userBalances]);

  const analyzeMarket = async () => {
    setLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setSignals([
        {
          id: 1,
          type: "buy",
          token: "QVTX",
          confidence: 87,
          reason: "Strong upward momentum detected. RSI indicates oversold conditions.",
          price: 5.33,
          target: 6.25,
          stopLoss: 4.95,
          timeframe: "4h",
          timestamp: new Date(),
          metrics: {
            volume: "+45%",
            momentum: "Bullish",
            sentiment: "82% Positive"
          }
        },
        {
          id: 2,
          type: "hold",
          token: "MATIC",
          confidence: 72,
          reason: "Consolidation phase. Wait for breakout confirmation above $0.95.",
          price: 0.89,
          target: 0.98,
          stopLoss: 0.82,
          timeframe: "1d",
          timestamp: new Date(Date.now() - 300000),
          metrics: {
            volume: "+12%",
            momentum: "Neutral",
            sentiment: "65% Positive"
          }
        },
        {
          id: 3,
          type: "sell",
          token: "BNB",
          confidence: 64,
          reason: "Resistance at $625. Consider taking partial profits.",
          price: 618.50,
          target: 590,
          stopLoss: 635,
          timeframe: "1h",
          timestamp: new Date(Date.now() - 600000),
          metrics: {
            volume: "-8%",
            momentum: "Bearish",
            sentiment: "48% Positive"
          }
        }
      ]);

      setOpportunities([
        {
          id: 1,
          type: "staking",
          title: "High APY Staking Pool Available",
          description: "New 90-day QVTX pool offering 45% APY",
          apy: 45,
          tvl: "$2.3M",
          risk: "Low",
          action: "Stake Now",
          potential: "+$450 yearly per 1000 QVTX"
        },
        {
          id: 2,
          type: "launch",
          title: "New Token Launch on QVTX Chain",
          description: "QVAI token launching in 2 hours - AI gaming project",
          presale: "Live",
          allocation: "500 QVTX min",
          risk: "High",
          action: "View Details",
          potential: "Early bird bonus: +20%"
        },
        {
          id: 3,
          type: "liquidity",
          title: "LP Rewards Increased",
          description: "QVTX-USDC pool rewards boosted to 65% APY",
          apy: 65,
          tvl: "$5.8M",
          risk: "Medium",
          action: "Add Liquidity",
          potential: "+$650 yearly per $1000"
        }
      ]);

      // Portfolio rebalancing analysis
      const totalValue = parseFloat(userBalances?.qvtx?.usd || 0) + 
                        parseFloat(userBalances?.polygon?.usd || 0) + 
                        parseFloat(userBalances?.bsc?.usd || 0) + 
                        parseFloat(userBalances?.base?.usd || 0);

      if (totalValue > 0) {
        setRebalancing({
          currentAllocation: [
            { token: "QVTX", percent: 65, value: totalValue * 0.65 },
            { token: "MATIC", percent: 20, value: totalValue * 0.20 },
            { token: "BNB", percent: 10, value: totalValue * 0.10 },
            { token: "ETH", percent: 5, value: totalValue * 0.05 }
          ],
          recommendedAllocation: [
            { token: "QVTX", percent: 70, value: totalValue * 0.70, change: +5 },
            { token: "MATIC", percent: 15, value: totalValue * 0.15, change: -5 },
            { token: "BNB", percent: 8, value: totalValue * 0.08, change: -2 },
            { token: "ETH", percent: 7, value: totalValue * 0.07, change: +2 }
          ],
          reason: "Increase QVTX exposure based on strong fundamentals. Reduce MATIC position due to market consolidation.",
          risk: "Low",
          expectedGain: "+8.5% over 30 days"
        });
      }

      setLastUpdate(new Date());
      setLoading(false);
    }, 1500);
  };

  const getSignalIcon = (type) => {
    switch (type) {
      case "buy": return <ArrowUpRight className="w-5 h-5" />;
      case "sell": return <ArrowDownRight className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getSignalColor = (type) => {
    switch (type) {
      case "buy": return "from-emerald-500 to-teal-500";
      case "sell": return "from-rose-500 to-red-500";
      default: return "from-amber-500 to-orange-500";
    }
  };

  const getSignalTextColor = (type) => {
    switch (type) {
      case "buy": return "text-emerald-400";
      case "sell": return "text-rose-400";
      default: return "text-amber-400";
    }
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case "low": return "text-emerald-400 bg-emerald-500/10";
      case "medium": return "text-amber-400 bg-amber-500/10";
      case "high": return "text-rose-400 bg-rose-500/10";
      default: return "text-white/60 bg-white/5";
    }
  };

  if (!expanded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <button
          onClick={() => setExpanded(true)}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-2xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          AI Trading Assistant
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <GlassCard padding="p-0" gradient>
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                AI Trading Assistant
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                  Active
                </span>
              </h3>
              <p className="text-xs text-white/40 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Updated {Math.floor((Date.now() - lastUpdate) / 1000)}s ago
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={analyzeMarket}
              disabled={loading}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              title="Refresh analysis"
            >
              <RefreshCw className={`w-4 h-4 text-white/60 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setExpanded(false)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Trading Signals */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Active Trading Signals
            </h4>
            <div className="space-y-3">
              {signals.map((signal) => (
                <motion.div
                  key={signal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getSignalColor(signal.type)} flex items-center justify-center text-black`}>
                        {getSignalIcon(signal.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{signal.token}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${getSignalTextColor(signal.type)}`}>
                            {signal.type}
                          </span>
                        </div>
                        <p className="text-xs text-white/40">{signal.timeframe} timeframe</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-semibold text-cyan-400">
                        <TrendingUp className="w-4 h-4" />
                        {signal.confidence}%
                      </div>
                      <p className="text-xs text-white/40">Confidence</p>
                    </div>
                  </div>

                  <p className="text-sm text-white/60 mb-3">{signal.reason}</p>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <p className="text-xs text-white/40 mb-1">Current</p>
                      <p className="text-sm font-semibold">${signal.price.toFixed(2)}</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg">
                      <p className="text-xs text-white/40 mb-1">Target</p>
                      <p className="text-sm font-semibold text-emerald-400">${signal.target.toFixed(2)}</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg">
                      <p className="text-xs text-white/40 mb-1">Stop Loss</p>
                      <p className="text-sm font-semibold text-rose-400">${signal.stopLoss.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-white/40">Volume: <span className="text-white">{signal.metrics.volume}</span></span>
                    <span className="text-white/40">Momentum: <span className="text-white">{signal.metrics.momentum}</span></span>
                    <span className="text-white/40">Sentiment: <span className="text-white">{signal.metrics.sentiment}</span></span>
                  </div>

                  {signal.type !== "hold" && (
                    <button
                      onClick={() => onTrade && onTrade(signal)}
                      className={`w-full mt-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                        signal.type === "buy"
                          ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                          : "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                      }`}
                    >
                      Execute {signal.type.toUpperCase()}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              QVTX Opportunities
            </h4>
            <div className="space-y-3">
              {opportunities.map((opp) => (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-semibold mb-1">{opp.title}</h5>
                      <p className="text-sm text-white/60 mb-3">{opp.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(opp.risk)}`}>
                      {opp.risk} Risk
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {opp.apy && (
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="text-xs text-white/40">APY</p>
                          <p className="font-semibold text-emerald-400">{opp.apy}%</p>
                        </div>
                      </div>
                    )}
                    {opp.tvl && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-cyan-400" />
                        <div>
                          <p className="text-xs text-white/40">TVL</p>
                          <p className="font-semibold">{opp.tvl}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2 bg-emerald-500/10 rounded-lg mb-3">
                    <span className="text-xs text-emerald-400">{opp.potential}</span>
                  </div>

                  <button
                    onClick={() => onTrade && onTrade(opp)}
                    className="w-full py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all text-sm"
                  >
                    {opp.action}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Portfolio Rebalancing */}
          {rebalancing && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-violet-400" />
                Portfolio Rebalancing
              </h4>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-start gap-3 mb-4">
                  <Info className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-white/80 mb-1">{rebalancing.reason}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={`px-2 py-1 rounded-full ${getRiskColor(rebalancing.risk)}`}>
                        {rebalancing.risk} Risk
                      </span>
                      <span className="text-emerald-400">Expected: {rebalancing.expectedGain}</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-white/40 mb-2">Current Allocation</p>
                    <div className="space-y-2">
                      {rebalancing.currentAllocation.map((item) => (
                        <div key={item.token} className="flex items-center justify-between">
                          <span className="text-sm">{item.token}</span>
                          <span className="text-sm text-white/60">{item.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-white/40 mb-2">Recommended Allocation</p>
                    <div className="space-y-2">
                      {rebalancing.recommendedAllocation.map((item) => (
                        <div key={item.token} className="flex items-center justify-between">
                          <span className="text-sm">{item.token}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{item.percent}%</span>
                            <span className={`text-xs ${item.change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              ({item.change > 0 ? '+' : ''}{item.change}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onTrade && onTrade(rebalancing)}
                  className="w-full py-2 bg-violet-500/20 text-violet-400 font-medium rounded-lg hover:bg-violet-500/30 transition-colors text-sm"
                >
                  Apply Rebalancing Strategy
                </button>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-amber-400/80">
              AI-generated insights are for informational purposes only. Always do your own research and consider your risk tolerance before trading.
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}