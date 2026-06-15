import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import {
  Rocket,
  Coins,
  Calendar,
  Shield,
  TrendingUp,
  ExternalLink,
  CheckCircle
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import StatCard from "../components/ui/StatCard";
import TokenCreationForm from "../components/launchpad/TokenCreationForm";
import VestingScheduleBuilder from "../components/launchpad/VestingScheduleBuilder";
import PresaleConfig from "../components/launchpad/PresaleConfig";
import KYCVerification from "../components/launchpad/KYCVerification";

export default function TokenLaunchpad() {
  const [activeTab, setActiveTab] = useState("create");
  const [vestingSchedule, setVestingSchedule] = useState([]);
  const [tokenCreating, setTokenCreating] = useState(false);
  const [createdToken, setCreatedToken] = useState(null);
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    // Get user's wallet address
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) setUserAddress(accounts[0]);
        });
    }
  }, []);

  const { data: tokens = [] } = useQuery({
    queryKey: ['launchpadTokens'],
    queryFn: () => base44.entities.LaunchpadTokens.list(),
    initialData: []
  });

  const { data: presales = [] } = useQuery({
    queryKey: ['presales'],
    queryFn: () => base44.entities.Presales.list(),
    initialData: []
  });

  const handleTokenCreate = async (formData) => {
    setTokenCreating(true);
    try {
      const response = await base44.functions.invoke('deployToken', {
        ...formData,
        vestingSchedule
      });

      if (response.data.success) {
        setCreatedToken(response.data);
        alert(`Token ${formData.symbol} deployed successfully!`);
        setActiveTab("presale");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setTokenCreating(false);
    }
  };

  const stats = [
    {
      title: "Total Tokens Launched",
      value: tokens.length.toString(),
      icon: Coins,
      accentColor: "cyan",
      gradient: "from-cyan-500/10 to-cyan-500/5"
    },
    {
      title: "Active Presales",
      value: presales.filter(p => p.status === 'active').length.toString(),
      icon: TrendingUp,
      accentColor: "emerald",
      gradient: "from-emerald-500/10 to-emerald-500/5"
    },
    {
      title: "Total Raised",
      value: "$" + presales.reduce((sum, p) => sum + parseFloat(p.totalRaised || 0), 0).toFixed(0),
      icon: TrendingUp,
      accentColor: "violet",
      gradient: "from-violet-500/10 to-violet-500/5"
    },
    {
      title: "KYC Verified Users",
      value: "234",
      icon: Shield,
      accentColor: "amber",
      gradient: "from-amber-500/10 to-amber-500/5"
    }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
              <Rocket className="w-8 h-8 text-black" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Token Launchpad
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            Create, configure, and launch your own tokens with advanced features
          </motion.p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: "create", label: "Create Token", icon: Coins },
            { id: "vesting", label: "Vesting Schedule", icon: Calendar },
            { id: "presale", label: "Presale Config", icon: TrendingUp },
            { id: "kyc", label: "KYC Verification", icon: Shield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-black"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GlassCard>
              {activeTab === "create" && (
                <TokenCreationForm
                  onSubmit={handleTokenCreate}
                  loading={tokenCreating}
                />
              )}

              {activeTab === "vesting" && (
                <VestingScheduleBuilder
                  schedule={vestingSchedule}
                  onScheduleChange={setVestingSchedule}
                />
              )}

              {activeTab === "presale" && (
                <>
                  {createdToken ? (
                    <PresaleConfig
                      tokenId={createdToken.token.id}
                      tokenSymbol={createdToken.token.symbol}
                      onSuccess={() => alert('Presale created successfully!')}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <Coins className="w-16 h-16 mx-auto mb-4 text-white/20" />
                      <p className="text-white/60">Create a token first to configure presale</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === "kyc" && (
                <KYCVerification userAddress={userAddress} />
              )}
            </GlassCard>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {createdToken && (
              <GlassCard gradient>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold">Recently Created</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-white/60">Token: <span className="text-white font-semibold">{createdToken.token.symbol}</span></p>
                  <p className="text-white/60">Network: <span className="text-white">{createdToken.token.network.toUpperCase()}</span></p>
                  <p className="text-white/60 flex items-start gap-2">
                    <span className="flex-shrink-0">Contract:</span>
                    <span className="text-white font-mono text-xs break-all">{createdToken.contractAddress}</span>
                  </p>
                  <a
                    href={createdToken.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mt-2"
                  >
                    View on Explorer
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </GlassCard>
            )}

            <GlassCard>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-3 text-sm text-white/60">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Multi-chain deployment support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Customizable vesting schedules</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Built-in presale management</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>KYC/AML compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Automated token distribution</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard>
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-white/60 mb-4">
                Check our documentation for detailed guides on token creation and presale setup.
              </p>
              <Link
                to={createPageUrl("Docs")}
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                View Documentation →
              </Link>
            </GlassCard>
          </div>
        </div>

        {/* Recent Tokens */}
        {tokens.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Recently Launched Tokens</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tokens.slice(0, 6).map((token) => (
                <GlassCard key={token.id} padding="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{token.symbol}</h3>
                      <p className="text-sm text-white/60">{token.tokenName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      token.status === 'deployed' ? 'bg-emerald-500/20 text-emerald-400' :
                      token.status === 'active' ? 'bg-cyan-500/20 text-cyan-400' :
                      'bg-white/10 text-white/60'
                    }`}>
                      {token.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-white/60">
                    <p>Supply: {parseFloat(token.totalSupply).toLocaleString()}</p>
                    <p>Network: {token.network.toUpperCase()}</p>
                    <p>Decimals: {token.decimals}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}