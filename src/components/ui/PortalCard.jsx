import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { ArrowUpRight } from "lucide-react";

export default function PortalCard({
  title,
  description,
  icon: Icon,
  page,
  stats = [],
  gradient = "from-cyan-500 to-emerald-500",
  bgGradient = "from-cyan-500/10 to-cyan-500/5"
}) {
  return (
    <Link
      to={createPageUrl(page)}
      className="group relative bg-[#0f1019] border border-white/10 rounded-3xl p-8 hover:border-cyan-500/40 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
      
      {/* Icon */}
      <div className={`relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} p-0.5 mb-6`}>
        <div className="w-full h-full rounded-2xl bg-[#0f1019] flex items-center justify-center">
          <Icon className={`w-6 h-6 bg-gradient-to-r ${gradient} bg-clip-text text-white`} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-white group-hover:text-white transition-colors">
            {title}
          </h3>
          <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
        
        <p className="text-white text-sm leading-relaxed mb-6">
          {description}
        </p>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="flex gap-6">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className={`text-lg font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
                <p className="text-xs text-white">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Corner Decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full blur-2xl transform translate-x-16 -translate-y-16 group-hover:opacity-10 transition-opacity -z-10`} />
    </Link>
  );
}