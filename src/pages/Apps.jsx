import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import {
  AppWindow,
  Repeat,
  Wallet,
  BarChart3,
  Vote,
  Shield,
  Star,
  ExternalLink,
  Search,
  Verified
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";

export default function Apps() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "All Apps" },
    { id: "defi", label: "DeFi" },
    { id: "wallets", label: "Wallets" },
    { id: "gaming", label: "Gaming" },
    { id: "analytics", label: "Analytics" },
    { id: "tools", label: "Tools" }
  ];

  const featuredApp = {
    name: "QVTX Swap",
    description: "The official decentralized exchange for QVTX tokens. Swap between QVTX and other tokens across multiple chains with the best rates and lowest fees.",
    category: "DeFi",
    features: ["Multi-chain swaps", "Lowest fees", "Best rates", "Instant execution"],
    users: "125K+",
    volume: "$45.2M",
    gradient: "from-cyan-500 to-emerald-500"
  };

  const apps = [
    {
      name: "QVTX Bridge",
      description: "Transfer tokens seamlessly across Ethereum, Polygon, BSC, Solana, and XRP Ledger.",
      category: "defi",
      icon: Repeat,
      users: "45K",
      rating: 4.8,
      verified: true,
      gradient: "from-violet-500 to-purple-500"
    },
    {
      name: "Multi-Chain Wallet",
      description: "Secure wallet supporting all QVTX-compatible blockchains with hardware key support.",
      category: "wallets",
      icon: Wallet,
      users: "89K",
      rating: 4.9,
      verified: true,
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      name: "QVTX Analytics",
      description: "Comprehensive analytics dashboard for tracking QVTX metrics across all chains.",
      category: "analytics",
      icon: BarChart3,
      users: "32K",
      rating: 4.7,
      verified: true,
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      name: "Governance Portal",
      description: "Participate in QVTX governance by voting on proposals and submitting ideas.",
      category: "tools",
      icon: Vote,
      users: "18K",
      rating: 4.6,
      verified: true,
      gradient: "from-amber-500 to-orange-500"
    },
    {
      name: "Security Vault",
      description: "Advanced security features including multi-sig and time-locked transactions.",
      category: "tools",
      icon: Shield,
      users: "12K",
      rating: 4.8,
      verified: true,
      gradient: "from-rose-500 to-pink-500"
    },
    {
      name: "NFT Marketplace",
      description: "Buy, sell, and trade QVTX ecosystem NFTs across multiple blockchains.",
      category: "gaming",
      icon: Star,
      users: "67K",
      rating: 4.7,
      verified: true,
      gradient: "from-indigo-500 to-violet-500"
    }
  ];

  const integrations = [
    { name: "QVTX Chain", type: "Native Network" },
    { name: "Polygon", type: "Network" },
    { name: "BSC", type: "Network" },
    { name: "Base", type: "Network" },
    { name: "XRP Ledger", type: "Network" },
    { name: "MetaMask", type: "Wallet" },
    { name: "WalletConnect", type: "Wallet" },
    { name: "Ledger", type: "Hardware" },
    { name: "Airtable", type: "Database" },
    { name: "GitHub", type: "Integration" },
    { name: "Claude AI", type: "AI Platform" },
    { name: "WHM/cPanel", type: "Management" }
  ];

  const filteredApps = apps.filter(app => {
    const matchesCategory = activeCategory === "all" || app.category === activeCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 mb-6"
          >
            <AppWindow className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">QVTX Ecosystem</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              QVTX Apps
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            Discover and use applications built on the QVTX ecosystem
          </motion.p>
        </div>

        {/* Search & Categories */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-black"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured App */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">Featured</h2>
          <GlassCard className="overflow-hidden" padding="p-0">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-8 lg:p-12">
                <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-full mb-4">
                  {featuredApp.category}
                </span>
                <h3 className="text-3xl font-bold mb-4">{featuredApp.name}</h3>
                <p className="text-white/50 mb-6 text-lg">{featuredApp.description}</p>

                <ul className="space-y-3 mb-8">
                  {featuredApp.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-white/70">
                      <Verified className="w-4 h-4 text-emerald-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-6 mb-8">
                  <div>
                    <p className="text-2xl font-bold text-cyan-400">{featuredApp.users}</p>
                    <p className="text-sm text-white/40">Active Users</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-400">{featuredApp.volume}</p>
                    <p className="text-sm text-white/40">24h Volume</p>
                  </div>
                </div>

                <a
                  href="https://swap.qvtx.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2"
                >
                  Launch App
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className={`bg-gradient-to-br ${featuredApp.gradient} h-64 lg:h-auto flex items-center justify-center`}>
                <Repeat className="w-32 h-32 text-white/30" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Apps Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6">All Apps</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="h-full flex flex-col group" padding="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center`}>
                      <app.icon className="w-7 h-7 text-white" />
                    </div>
                    {app.verified && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <Verified className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs text-emerald-400">Verified</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{app.name}</h3>
                  <p className="text-sm text-white/50 mb-4 flex-1">{app.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-white/40">{app.users} users</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="text-sm text-white/60">{app.rating}</span>
                      </div>
                    </div>
                    <a
                      href={
                        app.name === "QVTX Bridge" ? "https://bridge.qvtx.io" :
                        app.name === "Multi-Chain Wallet" ? createPageUrl("Wallet") :
                        app.name === "QVTX Analytics" ? createPageUrl("Dashboard") :
                        app.name === "NFT Marketplace" ? createPageUrl("Gaming") :
                        "#"
                      }
                      target={app.name === "Multi-Chain Wallet" || app.name === "QVTX Analytics" || app.name === "NFT Marketplace" ? "_self" : "_blank"}
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-emerald-500"
                    >
                      <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-black" />
                    </a>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <GlassCard>
          <h2 className="text-xl font-semibold mb-6 text-center">Supported Integrations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 flex items-center justify-center mx-auto mb-2 text-cyan-400 font-bold">
                  {integration.name[0]}
                </div>
                <p className="font-medium text-sm">{integration.name}</p>
                <p className="text-xs text-white/40">{integration.type}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Coming Soon CTA */}
        <div className="mt-12">
          <GlassCard className="text-center bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20">
            <h3 className="text-2xl font-bold mb-2 text-amber-400">More Apps Coming Soon</h3>
            <p className="text-white/50 mb-6 max-w-md mx-auto">
              We're constantly building new applications for the QVTX ecosystem. Stay tuned!
            </p>
            <div className="flex gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-amber-500/50 w-64"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold rounded-xl hover:shadow-lg transition-all">
                Notify Me
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}