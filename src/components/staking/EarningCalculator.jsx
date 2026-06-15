import React, { useState, useEffect } from "react";
import { Calculator, TrendingUp, DollarSign, Clock, Coins } from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function EarningCalculator({ currentApy, tokenPrice }) {
  const [stakingAmount, setStakingAmount] = useState("");
  const [targetEarnings, setTargetEarnings] = useState("");
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (stakingAmount && targetEarnings && currentApy && tokenPrice) {
      calculatePeriod();
    }
  }, [stakingAmount, targetEarnings, currentApy, tokenPrice]);

  const calculatePeriod = () => {
    const principal = parseFloat(stakingAmount);
    const targetUSD = parseFloat(targetEarnings);
    const apy = parseFloat(currentApy) / 100;
    const price = parseFloat(tokenPrice);

    if (principal <= 0 || targetUSD <= 0 || apy <= 0 || price <= 0) return;

    // Convert target USD to QVTX
    const targetQVTX = targetUSD / price;

    // Calculate daily rate (compound interest)
    const dailyRate = Math.pow(1 + apy, 1/365) - 1;

    // Calculate days needed: targetQVTX = principal * ((1 + dailyRate)^days - 1)
    // Solving for days: days = ln(targetQVTX/principal + 1) / ln(1 + dailyRate)
    const days = Math.log(targetQVTX / principal + 1) / Math.log(1 + dailyRate);

    // Calculate actual earnings at different time periods
    const periods = [
      { label: "1 Week", days: 7 },
      { label: "1 Month", days: 30 },
      { label: "3 Months", days: 90 },
      { label: "6 Months", days: 180 },
      { label: "1 Year", days: 365 }
    ];

    const projections = periods.map(period => {
      const earnedQVTX = principal * (Math.pow(1 + dailyRate, period.days) - 1);
      const earnedUSD = earnedQVTX * price;
      return {
        ...period,
        earnedQVTX: earnedQVTX.toFixed(2),
        earnedUSD: earnedUSD.toFixed(2)
      };
    });

    setResults({
      daysNeeded: Math.ceil(days),
      weeksNeeded: (days / 7).toFixed(1),
      monthsNeeded: (days / 30).toFixed(1),
      yearsNeeded: (days / 365).toFixed(2),
      projections,
      targetQVTX: targetQVTX.toFixed(2),
      dailyEarningQVTX: (principal * dailyRate).toFixed(4),
      dailyEarningUSD: (principal * dailyRate * price).toFixed(2)
    });
  };

  const formatTime = (days) => {
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''}`;
    if (days < 30) return `${Math.ceil(days / 7)} week${Math.ceil(days / 7) !== 1 ? 's' : ''}`;
    if (days < 365) return `${Math.ceil(days / 30)} month${Math.ceil(days / 30) !== 1 ? 's' : ''}`;
    return `${(days / 365).toFixed(1)} year${(days / 365) >= 2 ? 's' : ''}`;
  };

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-cyan-400" />
        <h2 className="text-xl font-semibold">Advanced Earning Calculator</h2>
      </div>

      {/* Input Section */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm text-white/60 mb-2 block flex items-center gap-2">
            <Coins className="w-4 h-4" />
            Staking Amount (QVTX)
          </label>
          <input
            type="number"
            value={stakingAmount}
            onChange={(e) => setStakingAmount(e.target.value)}
            placeholder="1000"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="text-sm text-white/60 mb-2 block flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Target Earnings (USD)
          </label>
          <input
            type="number"
            value={targetEarnings}
            onChange={(e) => setTargetEarnings(e.target.value)}
            placeholder="1000"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-white/5 rounded-xl">
        <div>
          <p className="text-xs text-white/40 mb-1">Current APY</p>
          <p className="text-lg font-semibold text-emerald-400">{currentApy}%</p>
        </div>
        <div>
          <p className="text-xs text-white/40 mb-1">QVTX Price</p>
          <p className="text-lg font-semibold text-cyan-400">${tokenPrice}</p>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Time to Goal */}
          <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h3 className="font-semibold">Time to Reach Goal</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-bold text-cyan-400">{formatTime(results.daysNeeded)}</p>
                <p className="text-sm text-white/40 mt-1">To earn ${targetEarnings}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/60">Target: {results.targetQVTX} QVTX</p>
                <p className="text-sm text-white/60">≈ ${targetEarnings}</p>
              </div>
            </div>
          </div>

          {/* Daily Earnings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-xs text-white/40 mb-1">Daily Earnings</p>
              <p className="text-lg font-semibold text-emerald-400">{results.dailyEarningQVTX} QVTX</p>
              <p className="text-xs text-white/40">${results.dailyEarningUSD}/day</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-xs text-white/40 mb-1">Days Needed</p>
              <p className="text-lg font-semibold">{results.daysNeeded} days</p>
              <p className="text-xs text-white/40">{results.monthsNeeded} months</p>
            </div>
          </div>

          {/* Earnings Projections */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              <h3 className="font-semibold">Earnings Projections</h3>
            </div>
            <div className="space-y-2">
              {results.projections.map((projection, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm text-white/60">{projection.label}</span>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-400">
                      {projection.earnedQVTX} QVTX
                    </p>
                    <p className="text-xs text-white/40">${projection.earnedUSD}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-xs text-blue-300">
              💡 <strong>Note:</strong> Calculations are based on compound interest with the current APY of {currentApy}%. 
              Actual earnings may vary due to APY fluctuations, market conditions, and reward distribution mechanisms.
            </p>
          </div>
        </div>
      )}

      {!results && stakingAmount && targetEarnings && (
        <div className="text-center py-8 text-white/40">
          <Calculator className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>Enter values to see projections</p>
        </div>
      )}
    </GlassCard>
  );
}