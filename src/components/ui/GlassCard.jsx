import React from "react";

export default function GlassCard({ 
  children, 
  className = "", 
  hover = true,
  gradient = false,
  padding = "p-6"
}) {
  return (
    <div 
      className={`
        relative bg-[#0d0e16] border border-white/20 rounded-2xl ${padding}
        ${hover ? "hover:border-cyan-500/40 hover:bg-[#0f1019] transition-all duration-300" : ""}
        ${gradient ? "bg-gradient-to-br from-white/[0.05] to-transparent" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}