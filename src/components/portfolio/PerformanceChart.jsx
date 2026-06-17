import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import GlassCard from "../ui/GlassCard";
import { format, subDays } from "date-fns";
import { TrendingUp, TrendingDown } from "lucide-react";

const RANGES = [
  { label: "7D",  days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "All", days: null },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d0e16] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-white/40 mb-1">{label}</p>
      <p className="text-base font-bold text-cyan-300">${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
  );
};

export default function PerformanceChart({ history }) {
  const [range, setRange] = useState("7D");

  const filtered = useMemo(() => {
    const selected = RANGES.find(r => r.label === range);
    const cutoff = selected?.days ? subDays(new Date(), selected.days) : null;
    const source = history || [];
    const points = cutoff
      ? source.filter(p => new Date(p.date) >= cutoff)
      : source;
    return points.map(p => ({
      date: format(new Date(p.date), "MMM dd"),
      value: p.value,
    }));
  }, [history, range]);

  const first = filtered[0]?.value ?? 0;
  const last = filtered[filtered.length - 1]?.value ?? 0;
  const change = first > 0 ? ((last - first) / first) * 100 : 0;
  const isUp = change >= 0;

  const minVal = Math.min(...filtered.map(d => d.value));
  const maxVal = Math.max(...filtered.map(d => d.value));
  const padding = (maxVal - minVal) * 0.1 || 100;

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Portfolio Performance</h3>
          <p className="text-xs text-white/40 mt-0.5">Total holdings value over time</p>
        </div>
        <div className="flex items-center gap-3">
          {/* % change badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${isUp ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}>
            {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {isUp ? "+" : ""}{change.toFixed(2)}%
          </div>
          {/* Range selector */}
          <div className="flex bg-black/30 border border-white/10 rounded-xl overflow-hidden">
            {RANGES.map(r => (
              <button
                key={r.label}
                onClick={() => setRange(r.label)}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${range === r.label ? "bg-cyan-500/20 text-cyan-400" : "text-white/40 hover:text-white/70"}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary values */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-xs text-white/30">Current Value</p>
          <p className="text-lg font-bold text-white">${last.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div>
          <p className="text-xs text-white/30">Period Start</p>
          <p className="text-lg font-bold text-white/70">${first.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="hidden sm:block">
          <p className="text-xs text-white/30">Change</p>
          <p className={`text-lg font-bold ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
            {isUp ? "+" : ""}${(last - first).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Chart */}
      {filtered.length < 2 ? (
        <div className="flex items-center justify-center h-64 text-white/30 text-sm">
          Not enough data points to render chart
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={filtered} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isUp ? "#06b6d4" : "#f43f5e"} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isUp ? "#06b6d4" : "#f43f5e"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.2)"
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.2)"
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
              domain={[minVal - padding, maxVal + padding]}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={first} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isUp ? "#06b6d4" : "#f43f5e"}
              strokeWidth={2.5}
              fill="url(#perfGradient)"
              dot={false}
              activeDot={{ r: 5, fill: isUp ? "#06b6d4" : "#f43f5e", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </GlassCard>
  );
}