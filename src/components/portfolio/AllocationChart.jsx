import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import GlassCard from "../ui/GlassCard";

export default function AllocationChart({ allocation }) {
  const categoryColors = {
    AI: "#06b6d4",
    Gaming: "#ec4899",
    Staking: "#f59e0b",
    DeFi: "#8b5cf6",
    Other: "#64748b"
  };

  const data = Object.entries(allocation || {})
    .filter(([, percentage]) => percentage != null && !isNaN(percentage))
    .map(([category, percentage]) => ({
      name: category,
      value: Number(percentage),
      color: categoryColors[category] || "#64748b"
    }));

  return (
    <GlassCard>
      <h3 className="text-xl font-bold mb-6 text-cyan-400">Portfolio Allocation</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value != null ? value.toFixed(1) : 0}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0d0e16', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="grid grid-cols-2 gap-3 mt-6">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-white/60">{item.name}</span>
            <span className="text-sm font-semibold ml-auto">{item.value != null ? item.value.toFixed(1) : 0}%</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}