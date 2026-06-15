import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ 
  title, 
  value, 
  change, 
  changeType = "positive", 
  icon: Icon,
  subtitle,
  gradient = "from-cyan-500/10 to-cyan-500/5",
  accentColor = "cyan"
}) {
  const accentClasses = {
    cyan: "text-cyan-400 border-cyan-500/20 shadow-cyan-500/5",
    emerald: "text-emerald-400 border-emerald-500/20 shadow-emerald-500/5",
    violet: "text-violet-400 border-violet-500/20 shadow-violet-500/5",
    amber: "text-amber-400 border-amber-500/20 shadow-amber-500/5",
    rose: "text-rose-400 border-rose-500/20 shadow-rose-500/5",
  };

  const currentAccent = accentClasses[accentColor] || accentClasses.cyan;
  const textColor = currentAccent.split(' ')[0];

  return (
    <div className={`relative bg-[#0d0e16] border border-white/20 rounded-2xl p-6 hover:border-cyan-500/40 transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 cursor-pointer ${currentAccent}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-white font-semibold mb-1">{title}</p>
          <h3 className={`text-3xl font-bold ${textColor}`}>
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-white mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${textColor}`} />
          </div>
        )}
      </div>
      
      {change && (
        <div className={`flex items-center gap-1 text-sm ${
          changeType === "positive" ? "text-emerald-400" : "text-rose-400"
        }`}>
          {changeType === "positive" ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{change}</span>
        </div>
      )}

      {/* Decorative glow */}
      <div className={`absolute -inset-px rounded-2xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl`} />
    </div>
  );
}