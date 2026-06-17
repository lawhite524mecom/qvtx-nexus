import React from "react";

const RARITY_CONFIG = {
  COMMON:    { color: "#9ca3af", bg: "rgba(156,163,175,0.12)", label: "Common",    stars: 1 },
  RARE:      { color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  label: "Rare",      stars: 2 },
  EPIC:      { color: "#a78bfa", bg: "rgba(167,139,250,0.12)", label: "Epic",      stars: 3 },
  LEGENDARY: { color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  label: "Legendary", stars: 4 },
  MYTHIC:    { color: "#f472b6", bg: "rgba(244,114,182,0.12)", label: "Mythic",    stars: 5 },
};

export const RARITIES = Object.keys(RARITY_CONFIG);
export const getRarityConfig = (rarity) => RARITY_CONFIG[rarity] || RARITY_CONFIG.COMMON;

export default function RarityBadge({ rarity, size = "sm" }) {
  const cfg = getRarityConfig(rarity);
  const stars = "★".repeat(cfg.stars) + "☆".repeat(5 - cfg.stars);
  const padding = size === "lg" ? "px-4 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold tracking-wide ${padding}`}
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}33` }}
    >
      <span className="text-[10px] tracking-tighter opacity-80">{stars}</span>
      {cfg.label}
    </span>
  );
}