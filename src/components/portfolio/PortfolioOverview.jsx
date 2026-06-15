import React from "react";
import { TrendingUp, TrendingDown, Wallet, DollarSign } from "lucide-react";
import StatCard from "../ui/StatCard";

export default function PortfolioOverview({ portfolio, performance24h }) {
  const isPositive = performance24h >= 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Value"
        value={`$${portfolio.totalValue.toLocaleString()}`}
        icon={DollarSign}
        accentColor="cyan"
        gradient="from-cyan-500/10 to-cyan-500/5"
      />
      <StatCard
        title="24h Performance"
        value={`${isPositive ? '+' : ''}${performance24h.toFixed(2)}%`}
        change={`${isPositive ? '+' : ''}$${Math.abs(performance24h * portfolio.totalValue / 100).toFixed(2)}`}
        changeType={isPositive ? "positive" : "negative"}
        icon={isPositive ? TrendingUp : TrendingDown}
        accentColor={isPositive ? "emerald" : "rose"}
        gradient={isPositive ? "from-emerald-500/10 to-emerald-500/5" : "from-rose-500/10 to-rose-500/5"}
      />
      <StatCard
        title="Total Assets"
        value={portfolio.assets?.length || 0}
        subtitle="Across all chains"
        icon={Wallet}
        accentColor="violet"
        gradient="from-violet-500/10 to-violet-500/5"
      />
      <StatCard
        title="Categories"
        value={Object.keys(portfolio.allocation || {}).length}
        subtitle="Portfolio diversity"
        icon={TrendingUp}
        accentColor="amber"
        gradient="from-amber-500/10 to-amber-500/5"
      />
    </div>
  );
}