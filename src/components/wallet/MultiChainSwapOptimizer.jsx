import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Zap,
  ArrowRight,
  Info,
  DollarSign
} from "lucide-react";

export default function MultiChainSwapOptimizer({ 
  fromNetwork, 
  toNetwork, 
  fromToken, 
  toToken, 
  amount,
  onSelectRoute 
}) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    if (amount && parseFloat(amount) > 0 && fromNetwork !== toNetwork) {
      analyzeRoutes();
    }
  }, [amount, fromNetwork, toNetwork, fromToken, toToken]);

  const analyzeRoutes = () => {
    setLoading(true);
    
    // Simulate AI route analysis
    setTimeout(() => {
      const routeOptions = [
        {
          id: 1,
          name: "Direct Bridge",
          description: `Bridge ${fromToken.symbol} directly from ${fromNetwork} to ${toNetwork}`,
          steps: [
            { action: "Bridge", from: fromNetwork, to: toNetwork, token: fromToken.symbol }
          ],
          estimatedTime: "5-10 min",
          fees: {
            bridge: "0.1%",
            gas: "$2.50",
            total: "$2.60"
          },
          outputAmount: (parseFloat(amount) * 0.999).toFixed(4),
          confidence: 95,
          recommended: true,
          pros: ["Fastest route", "Lowest fees", "Highest security"],
          cons: ["Single bridge dependency"]
        },
        {
          id: 2,
          name: "Optimized DEX Route",
          description: `Swap to stablecoin, bridge, then swap to ${toToken.symbol}`,
          steps: [
            { action: "Swap", from: fromNetwork, token: fromToken.symbol, to: "USDC" },
            { action: "Bridge", from: fromNetwork, to: toNetwork, token: "USDC" },
            { action: "Swap", from: toNetwork, token: "USDC", to: toToken.symbol }
          ],
          estimatedTime: "8-15 min",
          fees: {
            swap: "0.3%",
            bridge: "0.1%",
            gas: "$4.20",
            total: "$4.60"
          },
          outputAmount: (parseFloat(amount) * 0.996).toFixed(4),
          confidence: 88,
          recommended: false,
          pros: ["Better liquidity", "More stable pricing", "Alternative path"],
          cons: ["Higher fees", "More steps", "Longer time"]
        },
        {
          id: 3,
          name: "Multi-Hop Bridge",
          description: `Bridge via intermediate chain for better rates`,
          steps: [
            { action: "Bridge", from: fromNetwork, to: "polygon", token: fromToken.symbol },
            { action: "Bridge", from: "polygon", to: toNetwork, token: fromToken.symbol }
          ],
          estimatedTime: "12-20 min",
          fees: {
            bridge: "0.15%",
            gas: "$3.80",
            total: "$4.10"
          },
          outputAmount: (parseFloat(amount) * 0.9985).toFixed(4),
          confidence: 82,
          recommended: false,
          pros: ["Alternative routing", "Potentially better rates during congestion"],
          cons: ["Longer time", "Multiple bridge steps", "Higher risk"]
        }
      ];

      setRoutes(routeOptions);
      setSelectedRoute(routeOptions[0]);
      if (onSelectRoute) onSelectRoute(routeOptions[0]);
      setLoading(false);
    }, 1200);
  };

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    if (onSelectRoute) onSelectRoute(route);
  };

  if (fromNetwork === toNetwork || !amount || parseFloat(amount) <= 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <h4 className="text-sm font-semibold">AI Route Optimization</h4>
        {loading && <span className="text-xs text-white/40">Analyzing...</span>}
      </div>

      {loading ? (
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center animate-pulse">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="h-4 bg-white/10 rounded animate-pulse mb-2" />
              <div className="h-3 bg-white/5 rounded animate-pulse w-2/3" />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {routes.map((route) => (
            <motion.button
              key={route.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => handleSelectRoute(route)}
              className={`w-full p-4 rounded-xl border transition-all text-left ${
                selectedRoute?.id === route.id
                  ? "bg-cyan-500/10 border-cyan-500/30"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{route.name}</span>
                    {route.recommended && (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/60 mb-2">{route.description}</p>
                </div>
                <div className="text-right ml-3">
                  <p className="text-sm font-semibold text-cyan-400">{route.outputAmount}</p>
                  <p className="text-xs text-white/40">{toToken.symbol}</p>
                </div>
              </div>

              {/* Route Steps */}
              <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2">
                {route.steps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg whitespace-nowrap">
                      <span className="text-xs font-medium">{step.action}</span>
                      <span className="text-xs text-white/60">{step.token || step.to}</span>
                    </div>
                    {idx < route.steps.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-white/40 flex-shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-white/5 rounded">
                  <p className="text-xs text-white/40">Fee</p>
                  <p className="text-xs font-semibold">{route.fees.total}</p>
                </div>
                <div className="text-center p-2 bg-white/5 rounded">
                  <p className="text-xs text-white/40">Time</p>
                  <p className="text-xs font-semibold">{route.estimatedTime}</p>
                </div>
                <div className="text-center p-2 bg-white/5 rounded">
                  <p className="text-xs text-white/40">Confidence</p>
                  <p className="text-xs font-semibold text-emerald-400">{route.confidence}%</p>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-emerald-400 font-medium mb-1">Pros:</p>
                  <ul className="space-y-0.5">
                    {route.pros.slice(0, 2).map((pro, idx) => (
                      <li key={idx} className="flex gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/60">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-amber-400 font-medium mb-1">Cons:</p>
                  <ul className="space-y-0.5">
                    {route.cons.slice(0, 2).map((con, idx) => (
                      <li key={idx} className="flex gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/60">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {selectedRoute && (
        <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-2 text-xs">
          <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-emerald-400">
            <p className="font-medium mb-1">AI Recommendation</p>
            <p className="text-emerald-400/80">
              Selected route optimizes for {selectedRoute.recommended ? "speed and cost" : "your preferences"}. 
              Total savings: ${(parseFloat(routes[0]?.fees.total.replace('$', '')) - parseFloat(selectedRoute.fees.total.replace('$', ''))).toFixed(2)} compared to alternatives.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}