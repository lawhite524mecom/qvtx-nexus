import React, { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import { Badge } from "../ui/badge";

export default function AssetList({ assets }) {
  const [filter, setFilter] = useState("all");

  const filteredAssets = filter === "all" 
    ? assets 
    : assets.filter(a => a.category === filter);

  const categories = ["all", "AI", "Gaming", "Staking", "DeFi", "Other"];

  const categoryColors = {
    AI: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    Gaming: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    Staking: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    DeFi: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    Other: "bg-slate-500/20 text-slate-400 border-slate-500/30"
  };

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-cyan-400">Assets</h3>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === cat
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredAssets.map((asset, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 flex items-center justify-center">
                <span className="text-sm font-bold text-cyan-400">
                  {asset.symbol.substring(0, 2)}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-white">{asset.name}</h4>
                <p className="text-xs text-white/40">{asset.balance} {asset.symbol}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge className={categoryColors[asset.category] || categoryColors.Other}>
                {asset.category}
              </Badge>
              
              <div className="text-right">
                <p className="font-semibold text-white">${asset.valueUSD.toLocaleString()}</p>
                <div className={`flex items-center gap-1 text-xs ${
                  asset.priceChange24h >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {asset.priceChange24h >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(asset.priceChange24h).toFixed(2)}%</span>
                </div>
              </div>

              <div className="text-xs text-white/40">
                {asset.chain}
              </div>
            </div>
          </div>
        ))}

        {filteredAssets.length === 0 && (
          <div className="text-center py-8 text-white/50">
            No assets found in this category
          </div>
        )}
      </div>
    </GlassCard>
  );
}