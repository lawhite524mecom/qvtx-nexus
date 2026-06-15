import React from "react";
import { Lock, LogIn } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function LoginWall({ pageName = "This page" }) {
  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.2)" }}
        >
          <Lock className="w-9 h-9" style={{ color: "#ffd700" }} />
        </div>
        <h2 className="text-2xl font-orbitron font-bold text-white mb-3">Login Required</h2>
        <p className="text-white/50 mb-2 text-sm">
          {pageName} is restricted to QVTX workers and employees.
        </p>
        <p className="text-white/30 text-xs mb-8">
          Please log in with your QVTX credentials to continue.
        </p>
        <button
          onClick={handleLogin}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-orbitron font-bold text-black hover:shadow-lg hover:-translate-y-0.5 transition-all"
          style={{ background: "linear-gradient(135deg, #00d4ff, #ffd700)" }}
        >
          <LogIn className="w-4 h-4" />
          Login to Continue
        </button>
      </div>
    </div>
  );
}