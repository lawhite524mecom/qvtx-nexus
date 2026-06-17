import React, { useState, useEffect } from "react";
import GatedRoute from "../components/auth/GatedRoute";
import { motion } from "framer-motion";
import { Wallet, RefreshCw, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import GlassCard from "../components/ui/GlassCard";
import PortfolioOverview from "../components/portfolio/PortfolioOverview";
import AllocationChart from "../components/portfolio/AllocationChart";
import PerformanceChart from "../components/portfolio/PerformanceChart";
import AIInsights from "../components/portfolio/AIInsights";
import UniversalAssistant from "../components/ai/UniversalAssistant";
import AssetList from "../components/portfolio/AssetList";

function PortfolioContent() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          await loadPortfolio(accounts[0]);
        }
      } catch (err) {
        console.error('Failed to check wallet connection:', err);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask to connect your wallet');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      await loadPortfolio(accounts[0]);
    } catch (err) {
      setError('Failed to connect wallet');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPortfolio = async (address) => {
    setLoading(true);
    try {
      const portfolios = await base44.entities.Portfolio.filter({ walletAddress: address });
      
      if (portfolios.length > 0) {
        setPortfolio(portfolios[0]);
      } else {
        // Create mock portfolio data
        const mockPortfolio = await createMockPortfolio(address);
        setPortfolio(mockPortfolio);
      }
    } catch (err) {
      console.error('Failed to load portfolio:', err);
      setError('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const createMockPortfolio = async (address) => {
    const mockData = {
      walletAddress: address,
      totalValue: 125430.50,
      assets: [
        { symbol: "QVTX", name: "QVTX Token", balance: "50000", valueUSD: 45250, category: "DeFi", chain: "QVTX Chain", priceChange24h: 5.2 },
        { symbol: "AGIX", name: "SingularityNET", balance: "5000", valueUSD: 22500, category: "AI", chain: "Ethereum", priceChange24h: -2.1 },
        { symbol: "GALA", name: "Gala Games", balance: "15000", valueUSD: 18750, category: "Gaming", chain: "Ethereum", priceChange24h: 8.5 },
        { symbol: "FET", name: "Fetch.ai", balance: "3500", valueUSD: 15680, category: "AI", chain: "Ethereum", priceChange24h: 3.7 },
        { symbol: "SAND", name: "The Sandbox", balance: "8000", valueUSD: 12800, category: "Gaming", chain: "Ethereum", priceChange24h: -1.2 },
        { symbol: "stQVTX", name: "Staked QVTX", balance: "10000", valueUSD: 10450, category: "Staking", chain: "QVTX Chain", priceChange24h: 5.2 }
      ],
      allocation: {
        DeFi: 36.1,
        AI: 30.5,
        Gaming: 25.1,
        Staking: 8.3
      },
      performanceHistory: [
        { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), value: 118200 },
        { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), value: 119500 },
        { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), value: 121800 },
        { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), value: 120200 },
        { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), value: 123400 },
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), value: 124100 },
        { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), value: 125430.50 }
      ],
      lastUpdated: new Date().toISOString()
    };

    const created = await base44.entities.Portfolio.create(mockData);
    return created;
  };

  const refreshPortfolio = async () => {
    if (walletAddress) {
      await loadPortfolio(walletAddress);
    }
  };

  const handleInsightsUpdate = async (insights) => {
    if (portfolio) {
      await base44.entities.Portfolio.update(portfolio.id, {
        aiInsights: insights
      });
    }
  };

  if (!walletAddress) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <GlassCard className="p-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 flex items-center justify-center">
                <Wallet className="w-10 h-10 text-cyan-400" />
              </div>
              <h1 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Connect Your Wallet
                </span>
              </h1>
              <p className="text-white/60 mb-8">
                Connect your wallet to view your portfolio analytics, track performance, and get AI-powered insights
              </p>
              
              {error && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button
                onClick={connectWallet}
                disabled={loading}
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold px-8 py-6 text-lg"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    );
  }

  if (loading && !portfolio) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin" />
            <p className="text-white/60">Loading portfolio data...</p>
          </div>
        </div>
      </div>
    );
  }

  const performance24h = 4.3; // Calculate from history

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Portfolio Analytics
              </span>
            </h1>
            <p className="text-white/60">
              {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
            </p>
          </div>
          <Button
            onClick={refreshPortfolio}
            disabled={loading}
            variant="outline"
            className="border-white/20"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <PortfolioOverview portfolio={portfolio} performance24h={performance24h} />
        </motion.div>

        {/* Performance Chart — full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <PerformanceChart history={portfolio.performanceHistory} />
        </motion.div>

        {/* Allocation Chart */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AllocationChart allocation={portfolio.allocation} />
          </motion.div>
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <AIInsights portfolio={portfolio} onInsightsUpdate={handleInsightsUpdate} />
        </motion.div>

        {/* Asset List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AssetList assets={portfolio.assets} />
        </motion.div>

        {/* AI Assistant */}
        <UniversalAssistant
          context="portfolio"
          userData={{
            assets: portfolio?.assets || [],
            totalValue: portfolio?.totalValue || "0",
            allocation: portfolio?.allocation || {}
          }}
        />
      </div>
    </div>
  );
}

export default function Portfolio() {
  return <GatedRoute pageName="Portfolio"><PortfolioContent /></GatedRoute>;
}