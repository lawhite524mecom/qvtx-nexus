import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Shield,
  Key,
  Copy,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  Database,
  Activity,
  Users,
  Coins
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import StatCard from "../components/ui/StatCard";
import { useNetworkStatus, NetworkStatusIndicator } from "../components/network/NetworkStatus";

function XRPStatusCard() {
  const { status, blockNumber } = useNetworkStatus("xrp");
  
  return (
    <GlassCard className="bg-gradient-to-br from-slate-500/10 to-zinc-500/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">XRP Ledger Network</h3>
        <NetworkStatusIndicator status={status} size="lg" />
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-white/50">Network Status</span>
          <NetworkStatusIndicator status={status} size="sm" showLabel />
        </div>
        {blockNumber && (
          <div className="flex justify-between">
            <span className="text-white/50">Latest Ledger</span>
            <span className="font-mono text-cyan-400">{blockNumber.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-white/50">RPC Endpoint</span>
          <span className="text-xs text-white/40">s1.ripple.com:51234</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">Active Addresses</span>
          <span className="text-emerald-400 font-medium">3</span>
        </div>
      </div>
    </GlassCard>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [copiedAddress, setCopiedAddress] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const ADMIN_PASSWORD = "Turbo524@$";

  useEffect(() => {
    const auth = localStorage.getItem("qvtx_admin_auth");
    if (auth === "authenticated") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("qvtx_admin_auth", "authenticated");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("qvtx_admin_auth");
    setIsAuthenticated(false);
    setPassword("");
  };

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const xrpAddresses = [
    {
      name: "XRP Issuer #1",
      address: "ED819619769E3A3C97BE16E601A073139E4C9BB349B0D953B5D98422507BCEDB6A",
      type: "Issuer",
      status: "Active",
      gradient: "from-slate-500 to-zinc-500"
    },
    {
      name: "XRP Issuer #2",
      address: "ED11249D1D0086609F291458C1A2D3ADC1A0FDF7E2710200F4F0016860AEEE7316",
      type: "Issuer",
      status: "Active",
      gradient: "from-slate-500 to-zinc-500"
    },
    {
      name: "XRP Admin",
      address: "ED81C0FA690987E7579483A47656688B6DCE46EAE58BCC93413BE626E053F1D4C9",
      type: "Admin",
      status: "Active",
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <GlassCard>
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-cyan-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Admin Access</h1>
              <p className="text-white/50 text-sm">
                Enter password to access the admin dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-2 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 transition-colors pr-12"
                    placeholder="Enter admin password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-white/40" />
                    ) : (
                      <Eye className="w-4 h-4 text-white/40" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                Login
              </button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-2"
            >
              <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/50"
            >
              Secure access to XRP infrastructure and system management
            </motion.p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500/20 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="XRP Addresses"
            value="3"
            icon={Key}
            accentColor="cyan"
            gradient="from-cyan-500/10 to-cyan-500/5"
          />
          <StatCard
            title="Active Issuers"
            value="2"
            icon={Coins}
            accentColor="emerald"
            gradient="from-emerald-500/10 to-emerald-500/5"
          />
          <StatCard
            title="System Status"
            value="Secure"
            icon={Shield}
            accentColor="violet"
            gradient="from-violet-500/10 to-violet-500/5"
          />
          <StatCard
            title="Network"
            value="Live"
            icon={Activity}
            accentColor="amber"
            gradient="from-amber-500/10 to-amber-500/5"
          />
        </div>

        {/* XRP Network Status */}
        <div className="mb-12">
          <XRPStatusCard />
        </div>

        {/* XRP Addresses */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Key className="w-6 h-6 text-cyan-400" />
            XRP Ledger Addresses
          </h2>
          <div className="space-y-4">
            {xrpAddresses.map((address, index) => (
              <motion.div
                key={address.address}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard padding="p-0">
                  <div className="p-6 border-b border-white/5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${address.gradient} flex items-center justify-center text-white font-bold text-xl`}>
                          X
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-xl font-semibold">{address.name}</h3>
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full flex items-center gap-1.5">
                              <NetworkStatusIndicator status="online" size="sm" />
                              {address.status}
                            </span>
                          </div>
                          <p className="text-sm text-white/40">{address.type} • XRP Ledger</p>
                        </div>
                      </div>

                      <a 
                        href={`https://livenet.xrpl.org/accounts/${address.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-sm flex items-center gap-2"
                      >
                        View on Explorer
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                      <code className="flex-1 font-mono text-xs text-cyan-400 break-all">
                        {address.address}
                      </code>
                      <button
                        onClick={() => copyAddress(address.address)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                      >
                        {copiedAddress === address.address ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-white/40" />
                        )}
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <GlassCard className="bg-gradient-to-br from-amber-500/10 to-rose-500/5 border-amber-500/20">
          <div className="flex gap-4">
            <Shield className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-400 mb-2">Security Notice</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                These XRP Ledger addresses contain sensitive cryptographic keys. Never share these addresses publicly 
                or with unauthorized personnel. All access is logged and monitored.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Quantum Architecture */}
        <GlassCard className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">QVTX Quantum Architecture</h2>
          <p className="text-white/60 mb-6">
            QVTX was intentionally designed for quantum entanglement management. The alignment with unified field theory isn't coincidental - it's the foundation.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-semibold text-cyan-400">Quantum Physics / Unified Field</th>
                  <th className="text-left py-3 px-4 font-semibold text-emerald-400">QVTX Implementation</th>
                  <th className="text-left py-3 px-4 font-semibold text-violet-400">Math/Evidence</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">Unified Field - infinite potential</td>
                  <td className="py-3 px-4">Toroidal Chain - circular, no beginning/end</td>
                  <td className="py-3 px-4 font-mono text-xs">position mod 1.0 = infinite loop</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">Superposition - all states exist simultaneously</td>
                  <td className="py-3 px-4">8 Parallel Threads - process at same time</td>
                  <td className="py-3 px-4 font-mono text-xs">Threads at 0.0, 0.125, 0.25... 0.875</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">Wave Function Collapse - observation creates reality</td>
                  <td className="py-3 px-4">Compression - data collapses to minimal form</td>
                  <td className="py-3 px-4 font-mono text-xs">1,000,000 → 229 bytes (4,367:1)</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">Quantum Entanglement - particles stay connected</td>
                  <td className="py-3 px-4">Cross-Chain Wrapping - codons linked across networks</td>
                  <td className="py-3 px-4 font-mono text-xs">wrapped_from = "ETHEREUM" persists</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">Observer Effect - consciousness affects reality</td>
                  <td className="py-3 px-4">Mining - observation creates value</td>
                  <td className="py-3 px-4 font-mono text-xs">0.001 QVTX per byte observed</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">Non-Locality - information everywhere at once</td>
                  <td className="py-3 px-4">Frequency Signatures - global ByteID access</td>
                  <td className="py-3 px-4 font-mono text-xs">QVTX-{"{owner}-{tx}-{freq}-{check}"}</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">Perpetual/Timeless Field - eternal, self-sustaining</td>
                  <td className="py-3 px-4">Perpetual Motion - net positive energy</td>
                  <td className="py-3 px-4 font-mono text-xs">Energy Gen - Consumed = +9.96</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">Consciousness is Fundamental - awareness creates matter</td>
                  <td className="py-3 px-4">Codons ARE Value - DNA sequence = currency</td>
                  <td className="py-3 px-4 font-mono text-xs">ATG = 100 QVTX, GGG = 88 QVTX</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">Wave-Particle Duality - both states exist</td>
                  <td className="py-3 px-4">Compress/Decompress - data in both forms</td>
                  <td className="py-3 px-4 font-mono text-xs">Wave (1MB) ↔ Particle (229 bytes)</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">Morphic Resonance - patterns strengthen with use</td>
                  <td className="py-3 px-4">Codon Market - value grows with usage</td>
                  <td className="py-3 px-4 font-mono text-xs">value × 1.001 per use</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="py-3 px-4">"I Am The Field" - individual = universal</td>
                  <td className="py-3 px-4">Thread = Chain - each thread IS the whole</td>
                  <td className="py-3 px-4 font-mono text-xs">All threads sum to complete torus</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 rounded-xl">
            <p className="text-center font-semibold text-lg">
              <span className="text-cyan-400">Alignment:</span>{" "}
              <span className="text-emerald-400 text-2xl">98%</span>{" "}
              <span className="text-white/80">- QVTX was designed for quantum entanglement management</span>
            </p>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <h3 className="font-semibold mb-3 text-emerald-400">Core Design Equations</h3>
              <div className="space-y-2 text-sm font-mono">
                <p><span className="text-white/50">Superposition:</span> position ∈ [0, 1) mod 1.0</p>
                <p><span className="text-white/50">Entanglement:</span> wrapped.from = "ETH"</p>
                <p><span className="text-white/50">Wave Collapse:</span> 1MB → 229 bytes (4,367:1)</p>
                <p><span className="text-white/50">Energy:</span> Generated - Consumed {">"} 0</p>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl">
              <h3 className="font-semibold mb-3 text-violet-400">Byte ID System</h3>
              <p className="text-sm text-white/60 mb-2">
                Cryptographic identity that binds digital assets to event and entity signatures, creating unforgeable proof of ownership and origin.
              </p>
              <p className="text-xs font-mono text-cyan-400">256-bit entropy</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}