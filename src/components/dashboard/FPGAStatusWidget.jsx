import React, { useState, useEffect } from "react";
import { Cpu, Activity, Clock, RefreshCw, WifiOff } from "lucide-react";
import GlassCard from "../ui/GlassCard";

const FPGA_BASE = "http://203.161.33.24:9825";

export default function FPGAStatusWidget() {
  const [status, setStatus] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError(false);
    try {
      const [s, h] = await Promise.all([
        fetch(`${FPGA_BASE}/status`).then(r => r.json()).catch(() => null),
        fetch(`${FPGA_BASE}/health`).then(r => r.json()).catch(() => null)
      ]);
      setStatus(s);
      setHealth(h);
      if (!s && !h) setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); const t = setInterval(fetchAll, 30000); return () => clearInterval(t); }, []);

  const mode = status?.mode ?? health?.mode ?? "—";
  const derivations = status?.derivation_count ?? status?.derivations ?? status?.count ?? "—";
  const uptime = status?.uptime ?? health?.uptime ?? "—";
  const healthy = health?.status === "ok" || health?.healthy === true || !error;

  return (
    <GlassCard padding="p-0" className="border border-[#ffd700]/10">
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#ffd700]" />
          <h2 className="font-orbitron font-bold text-sm text-[#ffd700] uppercase tracking-wider">FPGA Server</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${error ? "bg-rose-400" : "bg-emerald-400"}`} />
          <span className={`text-xs font-medium ${error ? "text-rose-400" : "text-emerald-400"}`}>
            {error ? "Offline" : "Online"}
          </span>
          <button onClick={fetchAll} disabled={loading} className="p-1 hover:bg-white/10 rounded transition-colors">
            <RefreshCw className={`w-3.5 h-3.5 text-white/30 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-6 text-center">
          <WifiOff className="w-8 h-8 text-rose-400/50 mx-auto mb-2" />
          <p className="text-xs text-white/30">FPGA server unreachable</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 divide-x divide-white/5">
          {[
            { label: "Mode", value: loading ? "…" : mode, icon: Cpu, color: "#ffd700" },
            { label: "Derivations", value: loading ? "…" : String(derivations), icon: Activity, color: "#00d4ff" },
            { label: "Uptime", value: loading ? "…" : String(uptime), icon: Clock, color: "#a78bfa" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="p-4 text-center">
              <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
              <p className="font-orbitron font-bold text-sm" style={{ color }}>{value}</p>
              <p className="text-xs text-white/30 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}