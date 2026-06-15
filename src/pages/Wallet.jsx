import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ethers } from "ethers";
import {
  Wallet as WalletIcon,
  Copy,
  ExternalLink,
  Send,
  ArrowDownToLine,
  Repeat,
  Eye,
  EyeOff,
  Image as ImageIcon,
  History,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Coins,
  Shield,
  Settings
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import SwapModal from "../components/wallet/SwapModal";
import TransactionHistory from "../components/wallet/TransactionHistory";
import QuickStakeModal from "../components/staking/QuickStakeModal";
import FiatOnrampModal from "../components/wallet/FiatOnrampModal";
import NetworkSwitcher from "../components/network/NetworkSwitcher";
import MFASetup from "../components/wallet/MFASetup";
import TransactionLimits from "../components/wallet/TransactionLimits";
import TradingAssistant from "../components/ai/TradingAssistant";
import RewardsTracker from "../components/rewards/RewardsTracker";
import RewardsNotification from "../components/rewards/RewardsNotification";
import { fetchTokenPrices, formatPrice, formatChange } from "../components/wallet/priceOracle";
import UniversalAssistant from "../components/ai/UniversalAssistant";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

// Network configurations
const NETWORKS = {
  qvtx: {
    chainId: "0x4f08", // 20232 in hex
    chainName: "QVTX Chain",
    nativeCurrency: { name: "QVTX", symbol: "QVTX", decimals: 18 },
    rpcUrls: ["http://162.254.36.25:8545", "https://rpc.qvtx.io"],
    blockExplorerUrls: ["https://explorer.qvtx.io"]
  },
  qvtxdna: {
    chainId: "0xa410", // 42000 in hex
    chainName: "QVTX DNA",
    nativeCurrency: { name: "SQVTX", symbol: "SQVTX", decimals: 18 },
    rpcUrls: ["https://dna.qvtx.io:8555"],
    blockExplorerUrls: ["https://explorer.qvtx.io"]
  },
  polygon: {
    chainId: "0x89", // 137
    chainName: "Polygon",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"]
  },
  bsc: {
    chainId: "0x38", // 56
    chainName: "BSC",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"]
  },
  base: {
    chainId: "0x2105", // 8453
    chainName: "Base",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.base.org"],
    blockExplorerUrls: ["https://basescan.org"]
  }
};

// Token addresses on different chains
const TOKEN_ADDRESSES = {
  polygon: "0x43cc625d326618f23aECf39C170B1401509475E8",
  bsc: "0x9010e4c8149114b1fd2a0267a6b4138ee01af4af",
  base: "0x0d60757db0b32cbe4f536d297733635cd50f0f73"
};

// ERC20 ABI for balance checking
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

export default function Wallet() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [activeTab, setActiveTab] = useState("tokens");
  const [selectedNetwork, setSelectedNetwork] = useState("all");
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [balances, setBalances] = useState({
    qvtx: { native: "0", usd: "0" },
    polygon: { qvtx: "0", native: "0", usd: "0" },
    bsc: { qvtx: "0", native: "0", usd: "0" },
    base: { qvtx: "0", native: "0", usd: "0" }
  });
  const [totalValue, setTotalValue] = useState("0");
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showQuickStakeModal, setShowQuickStakeModal] = useState(false);
  const [showFiatOnramp, setShowFiatOnramp] = useState(false);
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [showTransactionLimits, setShowTransactionLimits] = useState(false);
  const [tokenPrices, setTokenPrices] = useState({
    qvtx: { usd: 5.33, change24h: 0 },
    matic: { usd: 0, change24h: 0 },
    bnb: { usd: 0, change24h: 0 },
    eth: { usd: 0, change24h: 0 }
  });
  const [showRewardNotification, setShowRewardNotification] = useState(false);
  const [rewardAmount, setRewardAmount] = useState("0");

  // Fetch token prices on mount and every 30 seconds
  useEffect(() => {
    const fetchPrices = async () => {
      const prices = await fetchTokenPrices(["qvtx", "matic", "bnb", "eth"]);
      setTokenPrices(prices);
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Check if wallet is already connected
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setConnected(true);
            fetchBalances(accounts[0]);
          }
        })
        .catch(console.error);
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask or another Web3 wallet");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      setAddress(accounts[0]);
      setConnected(true);
      
      // Switch to QVTX Chain
      await switchNetwork('qvtx');
      
      // Fetch balances
      await fetchBalances(accounts[0]);
      
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const switchNetwork = async (networkKey) => {
    if (!window.ethereum) return;

    const network = NETWORKS[networkKey];
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });
    } catch (switchError) {
      // Network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [network],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      }
    }
  };

  const fetchBalances = async (userAddress) => {
    try {
      setLoading(true);
      const newBalances = { ...balances };
      
      // Fetch QVTX Chain native balance
      const qvtxProvider = new ethers.JsonRpcProvider("https://rpc.qvtx.io");
      const qvtxBalance = await qvtxProvider.getBalance(userAddress);
      newBalances.qvtx.native = ethers.formatEther(qvtxBalance);
      newBalances.qvtx.usd = (parseFloat(newBalances.qvtx.native) * tokenPrices.qvtx.usd).toFixed(2);

      // Fetch QVTX token on Polygon
      try {
        const polygonProvider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
        const polygonToken = new ethers.Contract(TOKEN_ADDRESSES.polygon, ERC20_ABI, polygonProvider);
        const polygonBalance = await polygonToken.balanceOf(userAddress);
        newBalances.polygon.qvtx = ethers.formatEther(polygonBalance);
        newBalances.polygon.usd = (parseFloat(newBalances.polygon.qvtx) * tokenPrices.qvtx.usd).toFixed(2);
        
        const maticBalance = await polygonProvider.getBalance(userAddress);
        newBalances.polygon.native = ethers.formatEther(maticBalance);
      } catch (err) {
        console.error("Error fetching Polygon balance:", err);
      }

      // Fetch QVTX token on BSC
      try {
        const bscProvider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org");
        const bscToken = new ethers.Contract(TOKEN_ADDRESSES.bsc, ERC20_ABI, bscProvider);
        const bscBalance = await bscToken.balanceOf(userAddress);
        newBalances.bsc.qvtx = ethers.formatEther(bscBalance);
        newBalances.bsc.usd = (parseFloat(newBalances.bsc.qvtx) * tokenPrices.qvtx.usd).toFixed(2);
        
        const bnbBalance = await bscProvider.getBalance(userAddress);
        newBalances.bsc.native = ethers.formatEther(bnbBalance);
      } catch (err) {
        console.error("Error fetching BSC balance:", err);
      }

      // Fetch QVTX token on Base
      try {
        const baseProvider = new ethers.JsonRpcProvider("https://mainnet.base.org");
        const baseToken = new ethers.Contract(TOKEN_ADDRESSES.base, ERC20_ABI, baseProvider);
        const baseBalance = await baseToken.balanceOf(userAddress);
        newBalances.base.qvtx = ethers.formatEther(baseBalance);
        newBalances.base.usd = (parseFloat(newBalances.base.qvtx) * tokenPrices.qvtx.usd).toFixed(2);
        
        const ethBalance = await baseProvider.getBalance(userAddress);
        newBalances.base.native = ethers.formatEther(ethBalance);
      } catch (err) {
        console.error("Error fetching Base balance:", err);
      }

      setBalances(newBalances);
      
      // Calculate total value
      const total = parseFloat(newBalances.qvtx.usd) + 
                   parseFloat(newBalances.polygon.usd) + 
                   parseFloat(newBalances.bsc.usd) + 
                   parseFloat(newBalances.base.usd);
      setTotalValue(total.toFixed(2));
      
    } catch (err) {
      console.error("Error fetching balances:", err);
      setError("Failed to fetch balances");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const disconnect = () => {
    setConnected(false);
    setAddress("");
    setBalances({
      qvtx: { native: "0", usd: "0" },
      polygon: { qvtx: "0", native: "0", usd: "0" },
      bsc: { qvtx: "0", native: "0", usd: "0" },
      base: { qvtx: "0", native: "0", usd: "0" }
    });
    setTotalValue("0");
  };

  const refreshBalances = () => {
    if (address) {
      fetchBalances(address);
    }
  };

  const tokens = [
    { 
      symbol: "QVTX", 
      name: "QVTX (Native)", 
      balance: parseFloat(balances.qvtx.native).toFixed(4), 
      value: `$${balances.qvtx.usd}`,
      price: tokenPrices.qvtx.usd,
      change24h: tokenPrices.qvtx.change24h,
      network: "qvtx",
      icon: "Q"
    },
    { 
      symbol: "QVTX", 
      name: "QVTX on Polygon", 
      balance: parseFloat(balances.polygon.qvtx).toFixed(4), 
      value: `$${balances.polygon.usd}`,
      price: tokenPrices.qvtx.usd,
      change24h: tokenPrices.qvtx.change24h,
      network: "polygon",
      icon: "Q"
    },
    { 
      symbol: "MATIC", 
      name: "Polygon", 
      balance: parseFloat(balances.polygon.native).toFixed(4), 
      value: (parseFloat(balances.polygon.native) * tokenPrices.matic.usd).toFixed(2),
      price: tokenPrices.matic.usd,
      change24h: tokenPrices.matic.change24h,
      network: "polygon",
      icon: "M"
    },
    { 
      symbol: "QVTX", 
      name: "QVTX on BSC", 
      balance: parseFloat(balances.bsc.qvtx).toFixed(4), 
      value: `$${balances.bsc.usd}`,
      price: tokenPrices.qvtx.usd,
      change24h: tokenPrices.qvtx.change24h,
      network: "bsc",
      icon: "Q"
    },
    { 
      symbol: "BNB", 
      name: "BNB", 
      balance: parseFloat(balances.bsc.native).toFixed(4), 
      value: (parseFloat(balances.bsc.native) * tokenPrices.bnb.usd).toFixed(2),
      price: tokenPrices.bnb.usd,
      change24h: tokenPrices.bnb.change24h,
      network: "bsc",
      icon: "B"
    },
    { 
      symbol: "QVTX", 
      name: "QVTX on Base", 
      balance: parseFloat(balances.base.qvtx).toFixed(4), 
      value: `$${balances.base.usd}`,
      price: tokenPrices.qvtx.usd,
      change24h: tokenPrices.qvtx.change24h,
      network: "base",
      icon: "Q"
    },
    { 
      symbol: "ETH", 
      name: "Base ETH", 
      balance: parseFloat(balances.base.native).toFixed(4), 
      value: (parseFloat(balances.base.native) * tokenPrices.eth.usd).toFixed(2),
      price: tokenPrices.eth.usd,
      change24h: tokenPrices.eth.change24h,
      network: "base",
      icon: "E"
    },
  ];

  const networks = [
    { id: "all", name: "All Networks", color: "from-cyan-500 to-emerald-500" },
    { id: "qvtx", name: "QVTX Chain", color: "from-cyan-500 to-emerald-500" },
    { id: "polygon", name: "Polygon", color: "from-purple-500 to-violet-500" },
    { id: "bsc", name: "BSC", color: "from-yellow-500 to-amber-500" },
    { id: "base", name: "Base", color: "from-blue-500 to-cyan-500" },
    { id: "xrp", name: "XRP Ledger", color: "from-slate-400 to-slate-500" },
  ];

  const filteredTokens = selectedNetwork === "all" 
    ? tokens 
    : tokens.filter(t => t.network === selectedNetwork);

  if (!connected) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 flex items-center justify-center">
              <WalletIcon className="w-12 h-12 text-cyan-400" />
            </div>

            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Connect Your Wallet
            </h1>
            <p className="text-white/50 text-lg mb-10 max-w-md mx-auto">
              Connect your wallet to manage assets across QVTX Chain, Polygon, BSC, and Base.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={connectWallet}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-2xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:-translate-y-0.5 inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <WalletIcon className="w-5 h-5" />
                  Connect Wallet
                </>
              )}
            </button>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              {["MetaMask", "WalletConnect", "Coinbase Wallet", "Trust Wallet", "Rainbow", "Ledger"].map((wallet) => (
                <div
                  key={wallet}
                  className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                >
                  <span className="text-sm text-white/60">{wallet}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10 text-left">
              <h3 className="font-semibold mb-4 text-cyan-400">Supported Networks</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">QVTX Chain</span>
                  <span className="text-white font-mono">Chain ID: 20232</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Polygon</span>
                  <span className="text-white font-mono">Chain ID: 137</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">BSC</span>
                  <span className="text-white font-mono">Chain ID: 56</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Base</span>
                  <span className="text-white font-mono">Chain ID: 8453</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              My Wallet
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-white/60 text-sm">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <button onClick={handleCopy} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/40" />}
              </button>
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-medium">
                Connected
              </div>
              <button
                onClick={refreshBalances}
                disabled={loading}
                className="p-1.5 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-white/40 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={createPageUrl("XRP")}
              className="px-4 py-2 bg-slate-500/10 border border-slate-400/20 text-slate-300 rounded-xl hover:bg-slate-500/20 transition-colors text-sm font-medium flex items-center gap-2"
            >
              XRP Ledger
            </Link>
            <button
              onClick={() => setShowMFASetup(true)}
              className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              MFA
            </button>
            <button
              onClick={() => setShowTransactionLimits(true)}
              className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl hover:bg-cyan-500/20 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Limits
            </button>
            <NetworkSwitcher onNetworkChange={() => fetchBalances(address)} />
            <button
              onClick={disconnect}
              className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500/20 transition-colors text-sm font-medium"
            >
              Disconnect
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Balance Card */}
        <GlassCard className="mb-8" gradient>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-white/50 text-sm">Total Portfolio Value</span>
                <button onClick={() => setShowBalance(!showBalance)} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                  {showBalance ? <EyeOff className="w-4 h-4 text-white/40" /> : <Eye className="w-4 h-4 text-white/40" />}
                </button>
              </div>
              <h2 className="text-4xl font-bold text-cyan-400">
                {showBalance ? `$${totalValue}` : "••••••"}
              </h2>
              <p className="text-white/40 text-sm mt-1">Across 4 networks</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setShowFiatOnramp(true)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Buy with Fiat
              </button>
              <button 
                onClick={() => switchNetwork('qvtx')}
                className="px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
              <button className="px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2">
                <ArrowDownToLine className="w-4 h-4" />
                Receive
              </button>
              <button 
                onClick={() => setShowSwapModal(true)}
                className="px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Repeat className="w-4 h-4" />
                Swap
              </button>
              <button 
                onClick={() => setShowQuickStakeModal(true)}
                className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium rounded-xl hover:bg-emerald-500/20 transition-colors flex items-center gap-2"
              >
                <Coins className="w-4 h-4" />
                Quick Stake
              </button>
            </div>
          </div>

          {/* Network Selector */}
          <div className="flex gap-2 mt-6 flex-wrap">
            {networks.map((network) => (
              <button
                key={network.id}
                onClick={() => setSelectedNetwork(network.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedNetwork === network.id
                    ? `bg-gradient-to-r ${network.color} text-black`
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {network.name}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Live Token Prices */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlassCard padding="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/50 text-sm">QVTX</span>
              <div className={`flex items-center gap-1 text-xs ${tokenPrices.qvtx.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {tokenPrices.qvtx.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {formatChange(tokenPrices.qvtx.change24h)}
              </div>
            </div>
            <p className="text-xl font-bold text-cyan-400">{formatPrice(tokenPrices.qvtx.usd)}</p>
          </GlassCard>

          <GlassCard padding="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/50 text-sm">MATIC</span>
              <div className={`flex items-center gap-1 text-xs ${tokenPrices.matic.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {tokenPrices.matic.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {formatChange(tokenPrices.matic.change24h)}
              </div>
            </div>
            <p className="text-xl font-bold text-purple-400">{formatPrice(tokenPrices.matic.usd)}</p>
          </GlassCard>

          <GlassCard padding="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/50 text-sm">BNB</span>
              <div className={`flex items-center gap-1 text-xs ${tokenPrices.bnb.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {tokenPrices.bnb.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {formatChange(tokenPrices.bnb.change24h)}
              </div>
            </div>
            <p className="text-xl font-bold text-amber-400">{formatPrice(tokenPrices.bnb.usd)}</p>
          </GlassCard>

          <GlassCard padding="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/50 text-sm">ETH</span>
              <div className={`flex items-center gap-1 text-xs ${tokenPrices.eth.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {tokenPrices.eth.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {formatChange(tokenPrices.eth.change24h)}
              </div>
            </div>
            <p className="text-xl font-bold text-blue-400">{formatPrice(tokenPrices.eth.usd)}</p>
          </GlassCard>
        </div>

        {/* Rewards & AI */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <RewardsTracker 
            userAddress={address}
            onClaimSuccess={() => {
              setRewardAmount("0.5");
              setShowRewardNotification(true);
              setTimeout(() => setShowRewardNotification(false), 5000);
              fetchBalances(address);
            }}
          />
          
          <TradingAssistant 
            userAddress={address}
            userBalances={balances}
            onTrade={(action) => {
              if (action.type === "buy" || action.type === "sell") {
                setShowSwapModal(true);
              } else if (action.apy) {
                setShowQuickStakeModal(true);
              }
            }}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("tokens")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "tokens"
                ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            <WalletIcon className="w-4 h-4" />
            Tokens
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === "history"
                ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            <History className="w-4 h-4" />
            History
          </button>
        </div>

        {/* Content */}
        {activeTab === "tokens" ? (
          <div className="grid gap-4">
            {filteredTokens.map((token, index) => (
            <motion.div
              key={`${token.symbol}-${token.network}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" padding="p-5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-black font-bold text-lg ${
                    token.network === 'qvtx' ? 'bg-gradient-to-br from-cyan-500 to-emerald-500' :
                    token.network === 'polygon' ? 'bg-gradient-to-br from-purple-500 to-violet-500' :
                    token.network === 'bsc' ? 'bg-gradient-to-br from-yellow-500 to-amber-500' :
                    'bg-gradient-to-br from-blue-500 to-cyan-500'
                  }`}>
                    {token.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{token.symbol}</h3>
                    <p className="text-sm text-white/40">{token.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 ml-auto">
                  <div className="text-right">
                    <p className="font-semibold text-cyan-400">
                      {showBalance ? token.balance : "••••"}
                    </p>
                    <p className="text-sm text-white/40">
                      {showBalance ? `$${token.value}` : "••••"}
                    </p>
                    {token.price > 0 && (
                      <div className="flex items-center gap-1 justify-end mt-1">
                        <span className="text-xs text-white/30">{formatPrice(token.price)}</span>
                        <span className={`text-xs flex items-center gap-0.5 ${token.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {token.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {formatChange(token.change24h)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => switchNetwork(token.network)}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                      title="Switch to network"
                    >
                      <Repeat className="w-4 h-4 text-white/60" />
                    </button>
                    <a
                      href={
                        token.network === 'qvtx' ? `https://explorer.qvtx.io/address/${address}` :
                        token.network === 'polygon' ? `https://polygonscan.com/address/${address}` :
                        token.network === 'bsc' ? `https://bscscan.com/address/${address}` :
                        `https://basescan.org/address/${address}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-white/60" />
                    </a>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
          </div>
        ) : (
          <TransactionHistory userAddress={address} />
        )}

        {/* Modals */}
        <FiatOnrampModal
          isOpen={showFiatOnramp}
          onClose={() => setShowFiatOnramp(false)}
          userAddress={address}
        />

        <SwapModal 
          isOpen={showSwapModal}
          onClose={() => setShowSwapModal(false)}
          userAddress={address}
          userBalances={balances}
        />

        <QuickStakeModal
          isOpen={showQuickStakeModal}
          onClose={() => setShowQuickStakeModal(false)}
          userAddress={address}
          walletBalance={balances.qvtx.native}
          onSuccess={() => {
            fetchBalances(address);
            setShowQuickStakeModal(false);
          }}
        />

        <MFASetup
          isOpen={showMFASetup}
          onClose={() => setShowMFASetup(false)}
          userAddress={address}
        />

        <TransactionLimits
          isOpen={showTransactionLimits}
          onClose={() => setShowTransactionLimits(false)}
          userAddress={address}
        />

        {/* Rewards Notification */}
        <RewardsNotification
          show={showRewardNotification}
          amount={rewardAmount}
          onClose={() => setShowRewardNotification(false)}
        />

        {/* AI Assistant */}
        <UniversalAssistant
          context="wallet"
          userData={{
            address: address,
            balances: balances,
            totalValue: totalValue
          }}
        />
        </div>
        </div>
        );
        }