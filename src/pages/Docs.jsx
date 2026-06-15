import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Book,
  Code,
  Zap,
  Settings,
  Coins,
  Wallet,
  Repeat,
  Shield,
  Globe,
  Search,
  ChevronRight,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";

export default function Docs() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [copiedCode, setCopiedCode] = useState(null);

  const sections = [
    { id: "getting-started", label: "Getting Started", icon: Zap, items: ["introduction", "quickstart", "installation", "configuration"] },
    { id: "core-concepts", label: "Core Concepts", icon: Book, items: ["tokens", "wallets", "bridging", "staking"] },
    { id: "smart-contracts", label: "Smart Contracts", icon: Code, items: ["contracts-overview", "token-contract", "bridge-contracts", "staking-contracts"] },
    { id: "api-reference", label: "API Reference", icon: Settings, items: ["authentication", "rate-limits", "endpoints", "webhooks"] },
  ];

  const quickLinks = [
    { title: "Quick Start Guide", description: "Get up and running with QVTX in minutes", icon: Zap },
    { title: "API Documentation", description: "Complete API reference with examples", icon: Code },
    { title: "Smart Contracts", description: "Explore verified contract addresses", icon: Shield },
    { title: "Token Economics", description: "Learn about QVTX tokenomics", icon: Coins },
  ];

  const codeExamples = {
    installation: `npm install @qvtx/sdk
# or
yarn add @qvtx/sdk`,
    
    initialization: `import { QVTX } from '@qvtx/sdk';

const qvtx = new QVTX({
  network: 'mainnet',
  apiKey: 'your-api-key'
});

// Connect wallet
await qvtx.wallet.connect();`,

    transfer: `// Transfer QVTX tokens
const tx = await qvtx.transfer({
  to: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fDEa',
  amount: '1000',
  token: 'QVTX'
});

console.log('Transaction hash:', tx.hash);`,

    staking: `// Stake tokens
const stake = await qvtx.staking.stake({
  amount: '5000',
  pool: 'flexible',
  lockPeriod: 30
});

// Check staking rewards
const rewards = await qvtx.staking.getRewards();`
  };

  const copyCode = (key) => {
    navigator.clipboard.writeText(codeExamples[key]);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const contractAddresses = [
    { name: "QVTX Token", network: "Ethereum", address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8fDEa" },
    { name: "Staking Contract", network: "Ethereum", address: "0x8f3e2a1Bc4a289fD76540000c4a289fD76540000" },
    { name: "Bridge Contract", network: "Multi-chain", address: "0xc4a289fD76540000742d35Cc6634C0532925a3b8" },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="sticky top-8">
              <GlassCard>
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-cyan-400 mb-1">QVTX Docs</h2>
                  <p className="text-sm text-white/40">v2.0.0</p>
                </div>

                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search docs..."
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <nav className="space-y-4">
                  {sections.map((section) => (
                    <div key={section.id}>
                      <div className="flex items-center gap-2 text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                        <section.icon className="w-4 h-4" />
                        {section.label}
                      </div>
                      <ul className="space-y-1 ml-6">
                        {section.items.map((item) => (
                          <li key={item}>
                            <button
                              onClick={() => setActiveSection(item)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                activeSection === item
                                  ? "bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400"
                                  : "text-white/50 hover:text-white hover:bg-white/5"
                              }`}
                            >
                              {item.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </nav>
              </GlassCard>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="flex items-center gap-2 text-sm text-white/40 mb-4">
                <span>Docs</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">Introduction</span>
              </div>

              <h1 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  QVTX Documentation
                </span>
              </h1>
              <p className="text-lg text-white/50 max-w-3xl">
                Welcome to the QVTX documentation. Here you'll find comprehensive guides, 
                API references, and examples to help you integrate with the QVTX ecosystem.
              </p>
            </motion.div>

            {/* Quick Links */}
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="group cursor-pointer h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <link.icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 group-hover:text-cyan-400 transition-colors">
                          {link.title}
                        </h3>
                        <p className="text-sm text-white/50">{link.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* Installation */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Installation</h2>
              <p className="text-white/60 mb-4">
                Install the QVTX SDK using npm or yarn:
              </p>
              <div className="relative">
                <pre className="bg-[#0d1117] border border-white/10 rounded-xl p-4 overflow-x-auto">
                  <code className="text-sm text-white/80">{codeExamples.installation}</code>
                </pre>
                <button
                  onClick={() => copyCode('installation')}
                  className="absolute top-3 right-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {copiedCode === 'installation' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/40" />
                  )}
                </button>
              </div>
            </section>

            {/* Quick Start */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Quick Start</h2>
              <p className="text-white/60 mb-4">
                Initialize the SDK and connect your wallet:
              </p>
              <div className="relative">
                <pre className="bg-[#0d1117] border border-white/10 rounded-xl p-4 overflow-x-auto">
                  <code className="text-sm text-white/80">{codeExamples.initialization}</code>
                </pre>
                <button
                  onClick={() => copyCode('initialization')}
                  className="absolute top-3 right-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {copiedCode === 'initialization' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/40" />
                  )}
                </button>
              </div>
            </section>

            {/* Transfer Example */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Transfer Tokens</h2>
              <p className="text-white/60 mb-4">
                Send QVTX tokens to another address:
              </p>
              <div className="relative">
                <pre className="bg-[#0d1117] border border-white/10 rounded-xl p-4 overflow-x-auto">
                  <code className="text-sm text-white/80">{codeExamples.transfer}</code>
                </pre>
                <button
                  onClick={() => copyCode('transfer')}
                  className="absolute top-3 right-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {copiedCode === 'transfer' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/40" />
                  )}
                </button>
              </div>
            </section>

            {/* Contract Addresses */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Contract Addresses</h2>
              <GlassCard padding="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left p-4 text-sm font-medium text-white/40">Contract</th>
                      <th className="text-left p-4 text-sm font-medium text-white/40">Network</th>
                      <th className="text-left p-4 text-sm font-medium text-white/40">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractAddresses.map((contract) => (
                      <tr key={contract.name} className="border-b border-white/5 last:border-0">
                        <td className="p-4 font-medium">{contract.name}</td>
                        <td className="p-4 text-white/60">{contract.network}</td>
                        <td className="p-4">
                          <code className="text-sm text-cyan-400 font-mono">{contract.address}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassCard>
            </section>

            {/* Info Box */}
            <GlassCard className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-cyan-400 mb-2">Pro Tip</h4>
                  <p className="text-sm text-white/60">
                    For the best development experience, we recommend using TypeScript with the QVTX SDK. 
                    Full type definitions are included in the package.
                  </p>
                </div>
              </div>
            </GlassCard>
          </main>
        </div>
      </div>
    </div>
  );
}