import React from "react";

// A pure-CSS animated DNA helix strip used on NFT cards
export default function DNAHelix({ dnaSequence, color1 = "#00d4ff", color2 = "#f472b6", height = 32 }) {
  const bases = (dnaSequence || "ATCGATCGATCGATCG").slice(0, 16).split("");
  const baseColors = { A: color1, T: color2, C: "#ffd700", G: "#10b981" };

  return (
    <div className="flex items-center gap-[3px] overflow-hidden" style={{ height }}>
      {bases.map((base, i) => {
        const yOffset = Math.sin((i / bases.length) * Math.PI * 2) * (height * 0.35);
        return (
          <div
            key={i}
            className="flex flex-col items-center gap-[2px] flex-shrink-0"
            style={{ transform: `translateY(${yOffset}px)` }}
          >
            <div
              className="w-[6px] rounded-full"
              style={{
                height: `${height * 0.28}px`,
                background: baseColors[base] || color1,
                opacity: 0.85,
                boxShadow: `0 0 6px ${baseColors[base] || color1}88`
              }}
            />
            <div className="w-[1px] bg-white/10" style={{ height: `${height * 0.1}px` }} />
          </div>
        );
      })}
    </div>
  );
}