import React from "react";

export default function Logo({ size = "md", className = "" }) {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-xl",
    lg: "w-12 h-12 text-xl"
  };

  return (
    <div className={`${sizes[size]} rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center font-bold text-black shadow-lg shadow-cyan-500/20 ${className}`}>
      Q
    </div>
  );
}