import React, { useState, useEffect } from "react";
import GatedRoute from "../components/auth/GatedRoute";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import {
  Coins,
  TrendingUp,
  Gift,
  ArrowUpRight,
  Wallet,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import GlassCard from "../components/ui/GlassCard";
import StatCard from "../components/ui/StatCard";
import NetworkSwitcher from "../components/network/NetworkSwitcher";
import RewardsTracker from "../components/rewards/RewardsTracker";
import RewardsNotification from "../components/rewards/RewardsNotification";
import EarningCalculator from "../components/staking/EarningCalculator";
import UniversalAssistant from "../components/ai/UniversalAssistant";

const MASTERCHEF_ADDRESS = "0x7C8a52f406890AABe523774298e61AC53231005E";
const QVTX_TOKEN_ADDRESS = "0x817F9b61ae0FC99F617Cda74B4CA56063712A54d"; // WQVTX
const QVTX_CHAIN_RPC = "https://rpc.qvtx.io";
const CHAIN42000_RPC = "http://162.0.222.112:8555";

const MASTERCHEF_ABI = [
  "function userInfo(uint256 _pid, address _user) view returns (uint256 amount, uint256 rewardDebt)",
  "function pendingReward(uint256 _pid, address _user) view returns (uint256)",
  "function deposit(uint256 _pid, uint256 _amount)",
  "function withdraw(uint256 _pid, uint256 _amount)",
  "function poolInfo(uint256 _pid) view returns (address lpToken, uint256 allocPoint, uint256 lastRewardBlock, uint256 accRewardPerShare)",
  "function rewardPerBlock() view returns (uint256)"
];

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];

function StakingDashboardContent() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [walletBalance, setWalletBalance] = useState("0");
  const [stakedBalance, setStakedBalance] = useState("0");
  const [pendingRewards, setPendingRewards] = useState("0");
  const [apy, setApy] = useState("0");
  const [totalStaked, setTotalStaked] = useState("0");
  
  const [stakeAmount, setStakeAmount] = useState("");
  const [activeAction, setActiveAction] = useState("stake"); // stake or unstake
  const [showRewardNotification, setShowRewardNotification] = useState(false);
  const [rewardAmount, setRewardAmount] = useState("0");
  const [chain42Block, setChain42Block] = useState(null);
  const [chain42Status, setChain42Status] = useState("checking");
  
  // Mock chart data (in production, fetch from contract events)
  const apyHistoryData = [
    { date: "Jan 1", apy: 42.3 },
    { date: "Jan 5", apy: 43.8 },
    { date: "Jan 10", apy: 45.2 },
    { date: "Jan 15", apy: 44.6 },
    { date: "Jan 20", apy: 46.1 },
    { date: "Jan 25", apy: 45.8 },
    { date: "Today", apy: parseFloat(apy) || 45.8 }
  ];

  const rewardsHistoryData = [
    { date: "Jan 1", rewards: 0 },
    { date: "Jan 5", rewards: 12.5 },
    { date: "Jan 10", rewards: 28.3 },
    { date: "Jan 15", rewards: 45.8 },
    { date: "Jan 20", rewards: 67.4 },
    { date: "Jan 25", rewards: 92.1 },
    { date: "Today", rewards: parseFloat(pendingRewards) + 100 }
  ];

  useEffect(() => {
    checkConnection();
    fetchChain42();
    const t = setInterval(fetchChain42, 30000);
    return () => clearInterval(t);
  }, []);

  const fetchChain42 = async () => {
    setChain42Status("checking");
    try {
      const provider = new ethers.JsonRpcProvider(CHAIN42000_RPC);
      const block = await Promise.race([
        provider.getBlockNumber(),
        new Promise((_, r) => setTimeout(() => r(new Error("timeout")), 6000))
      ]);
      setChain42Block(block);
      setChain42Status("online");
    } catch {
      setChain42Status("offline");
    }
  };

  useEffect(() => {
    if (connected && address) {
      fetchData();
      const interval = setInterval(fetchData, 15000); // Refresh every 15s
      return () => clearInterval(interval);
    }
  }, [connected, address]);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setConnected(true);
        }
      } catch (err) {
        console.error("Error checking connection:", err);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0]);
      setConnected(true);
      
      // Switch to QVTX Chain
      await switchToQVTXChain();
      
    } catch (err) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  };

  const switchToQVTXChain = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4f08' }], // 20232
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x4f08',
              chainName: 'QVTX Chain',
              nativeCurrency: { name: 'QVTX', symbol: 'QVTX', decimals: 18 },
              rpcUrls: ['https://rpc.qvtx.io'],
              blockExplorerUrls: ['https://explorer.qvtx.io']
            }],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      }
    }
  };

  const fetchData = async () => {
    if (!address) return;
    
    try {
      const provider = new ethers.JsonRpcProvider(QVTX_CHAIN_RPC);
      const masterChef = new ethers.Contract(MASTERCHEF_ADDRESS, MASTERCHEF_ABI, provider);
      const qvtxToken = new ethers.Contract(QVTX_TOKEN_ADDRESS, ERC20_ABI, provider);
      
      // Fetch wallet balance
      const balance = await qvtxToken.balanceOf(address);
      setWalletBalance(ethers.formatEther(balance));
      
      // Fetch staked balance (pool 0)
      const userInfo = await masterChef.userInfo(0, address);
      setStakedBalance(ethers.formatEther(userInfo.amount));
      
      // Fetch pending rewards
      const pending = await masterChef.pendingReward(0, address);
      setPendingRewards(ethers.formatEther(pending));
      
      // Calculate APY (simplified - using reward per block)
      try {
        const rewardPerBlock = await masterChef.rewardPerBlock();
        const poolInfo = await masterChef.poolInfo(0);
        
        // Simplified APY calculation
        // Blocks per year ~= 365 * 24 * 60 * 60 / 3 (3 sec blocks) = ~10,512,000
        const blocksPerYear = 10512000;
        const yearlyRewards = parseFloat(ethers.formatEther(rewardPerBlock)) * blocksPerYear;
        const totalStakedValue = parseFloat(ethers.formatEther(userInfo.amount)) || 1;
        const calculatedApy = (yearlyRewards / totalStakedValue) * 100;
        setApy(calculatedApy.toFixed(2));
      } catch (err) {
        setApy("45.8"); // Fallback APY
      }
      
      setTotalStaked(ethers.formatEther(userInfo.amount));
      
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setTxLoading(true);
      setError("");
      setSuccess("");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const qvtxToken = new ethers.Contract(QVTX_TOKEN_ADDRESS, ERC20_ABI, signer);
      const masterChef = new ethers.Contract(MASTERCHEF_ADDRESS, MASTERCHEF_ABI, signer);
      
      const amount = ethers.parseEther(stakeAmount);
      
      // Check allowance
      const allowance = await qvtxToken.allowance(address, MASTERCHEF_ADDRESS);
      
      if (allowance < amount) {
        setSuccess("Approving QVTX...");
        const approveTx = await qvtxToken.approve(MASTERCHEF_ADDRESS, ethers.MaxUint256);
        await approveTx.wait();
      }
      
      setSuccess("Staking QVTX...");
      const stakeTx = await masterChef.deposit(0, amount);
      await stakeTx.wait();
      
      setSuccess("Successfully staked QVTX!");
      setStakeAmount("");
      await fetchData();
      
      setTimeout(() => setSuccess(""), 5000);
      
    } catch (err) {
      console.error("Stake error:", err);
      setError(err.reason || err.message || "Failed to stake");
    } finally {
      setTxLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setTxLoading(true);
      setError("");
      setSuccess("");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const masterChef = new ethers.Contract(MASTERCHEF_ADDRESS, MASTERCHEF_ABI, signer);
      
      const amount = ethers.parseEther(stakeAmount);
      
      setSuccess("Unstaking QVTX...");
      const unstakeTx = await masterChef.withdraw(0, amount);
      await unstakeTx.wait();
      
      setSuccess("Successfully unstaked QVTX!");
      setStakeAmount("");
      await fetchData();
      
      setTimeout(() => setSuccess(""), 5000);
      
    } catch (err) {
      console.error("Unstake error:", err);
      setError(err.reason || err.message || "Failed to unstake");
    } finally {
      setTxLoading(false);
    }
  };

  const handleClaim = async () => {
    if (parseFloat(pendingRewards) <= 0) {
      setError("No rewards to claim");
      return;
    }

    try {
      setTxLoading(true);
      setError("");
      setSuccess("");
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const masterChef = new ethers.Contract(MASTERCHEF_ADDRESS, MASTERCHEF_ABI, signer);
      
      setSuccess("Claiming rewards...");
      // Withdraw 0 to claim rewards without unstaking
      const claimTx = await masterChef.withdraw(0, 0);
      await claimTx.wait();
      
      setSuccess("Successfully claimed rewards!");
      await fetchData();
      
      setTimeout(() => setSuccess(""), 5000);
      
    } catch (err) {
      console.error("Claim error:", err);
      setError(err.reason || err.message || "Failed to claim rewards");
    } finally {
      setTxLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center">
              <Coins className="w-12 h-12 text-emerald-400" />
            </div>

            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Staking Dashboard
            </h1>
            <p className="text-white/50 text-lg mb-10 max-w-md mx-auto">
              Connect your wallet to stake QVTX and earn rewards on the MasterChef contract
            </p>

            <button
              onClick={connectWallet}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-2xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 inline-flex items-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-orbitron font-bold mb-2 dna-glow-cyan" style={{ color: "#00d4ff" }}>
              Staking Dashboard
            </h1>
            <p className="text-white/50">Stake QVTX and earn rewards through MasterChef</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Chain 42000 live indicator */}
            <div className="flex items-center gap-2 px-3 py-2 bg-black/30 border border-[#ffd700]/20 rounded-xl">
              <div className={`w-2 h-2 rounded-full animate-pulse ${chain42Status === "online" ? "bg-emerald-400" : chain42Status === "offline" ? "bg-rose-400" : "bg-slate-400"}`} />
              <span className="font-orbitron text-xs font-bold text-[#ffd700]">Chain 42000</span>
              {chain42Status === "online" && chain42Block && (
                <span className="font-mono text-xs text-white/40">#{chain42Block.toLocaleString()}</span>
              )}
            </div>
            <NetworkSwitcher onNetworkChange={() => fetchData()} />
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{success}</p>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Staked Balance"
            value={parseFloat(stakedBalance).toFixed(4)}
            subtitle="QVTX"
            icon={Coins}
            accentColor="emerald"
            gradient="from-emerald-500/10 to-emerald-500/5"
          />
          <StatCard
            title="Pending Rewards"
            value={parseFloat(pendingRewards).toFixed(4)}
            subtitle="QVTX"
            icon={Gift}
            accentColor="cyan"
            gradient="from-cyan-500/10 to-cyan-500/5"
          />
          <StatCard
            title="Current APY"
            value={`${apy}%`}
            icon={TrendingUp}
            accentColor="violet"
            gradient="from-violet-500/10 to-violet-500/5"
          />
          <StatCard
            title="Wallet Balance"
            value={parseFloat(walletBalance).toFixed(4)}
            subtitle="QVTX"
            icon={Wallet}
            accentColor="amber"
            gradient="from-amber-500/10 to-amber-500/5"
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* APY History Chart */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-400" />
              APY History
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={apyHistoryData}>
                  <defs>
                    <linearGradient id="apyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#ffffff40"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#ffffff40"
                    style={{ fontSize: '12px' }}
                    domain={[40, 50]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 16, 25, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                    formatter={(value) => [`${value.toFixed(2)}%`, 'APY']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="apy" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    fill="url(#apyGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-white/40 mt-4 text-center">
              Track how APY changes over time based on pool conditions
            </p>
          </GlassCard>

          {/* Rewards Accumulation Chart */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Gift className="w-5 h-5 text-emerald-400" />
              Rewards Accumulation
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rewardsHistoryData}>
                  <defs>
                    <linearGradient id="rewardsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#ffffff40"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#ffffff40"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 16, 25, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                    formatter={(value) => [`${value.toFixed(2)} QVTX`, 'Rewards']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rewards" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fill="url(#rewardsGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-white/40 mt-4 text-center">
              Visualize your total earned rewards over time
            </p>
          </GlassCard>
        </div>

        {/* Rewards Tracker */}
        <div className="mb-8">
          <RewardsTracker 
            userAddress={address}
            onClaimSuccess={() => {
              setRewardAmount(pendingRewards);
              setShowRewardNotification(true);
              setTimeout(() => setShowRewardNotification(false), 5000);
              fetchData();
            }}
          />
        </div>

        {/* Advanced Calculator */}
        <div className="mb-8">
          <EarningCalculator 
            currentApy={apy}
            tokenPrice="5.33"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Stake/Unstake Card */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-6">Manage Stake</h2>

            {/* Action Tabs */}
            <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
              <button
                onClick={() => setActiveAction("stake")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeAction === "stake"
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Stake
              </button>
              <button
                onClick={() => setActiveAction("unstake")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeAction === "unstake"
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Unstake
              </button>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="text-sm text-white/60 mb-2 block">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
                <button
                  onClick={() => setStakeAmount(activeAction === "stake" ? walletBalance : stakedBalance)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg hover:bg-emerald-500/30 transition-colors"
                >
                  MAX
                </button>
              </div>
              <div className="flex justify-between mt-2 text-xs text-white/40">
                <span>Available: {activeAction === "stake" ? parseFloat(walletBalance).toFixed(4) : parseFloat(stakedBalance).toFixed(4)} QVTX</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={activeAction === "stake" ? handleStake : handleUnstake}
              disabled={txLoading || !stakeAmount || parseFloat(stakeAmount) <= 0}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {txLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-5 h-5" />
                  {activeAction === "stake" ? "Stake QVTX" : "Unstake QVTX"}
                </>
              )}
            </button>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-white/60">
                  {activeAction === "stake" ? (
                    <>
                      Staking QVTX will lock your tokens in the MasterChef contract and start earning rewards immediately.
                    </>
                  ) : (
                    <>
                      Unstaking will return your QVTX to your wallet. Any pending rewards will be automatically claimed.
                    </>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Rewards Card */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-6">Claim Rewards</h2>

            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 rounded-xl border border-emerald-500/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 text-sm">Pending Rewards</span>
                  <button
                    onClick={fetchData}
                    className="p-1 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-white/40" />
                  </button>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-emerald-400">
                    {parseFloat(pendingRewards).toFixed(4)}
                  </span>
                  <span className="text-white/40">QVTX</span>
                </div>
                <p className="text-sm text-white/40 mt-2">
                  ≈ ${(parseFloat(pendingRewards) * 5.33).toFixed(2)} USD
                </p>
              </div>

              <button
                onClick={handleClaim}
                disabled={txLoading || parseFloat(pendingRewards) <= 0}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {txLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Claiming...
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    Claim Rewards
                  </>
                )}
              </button>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/60 text-sm">Your APY</span>
                  <span className="text-emerald-400 font-semibold">{apy}%</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/60 text-sm">Total Staked</span>
                  <span className="text-white font-semibold">{parseFloat(stakedBalance).toFixed(2)} QVTX</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/60 text-sm">Contract</span>
                  <a
                    href={`https://explorer.qvtx.io/address/${MASTERCHEF_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-mono flex items-center gap-1"
                  >
                    {MASTERCHEF_ADDRESS.slice(0, 6)}...{MASTERCHEF_ADDRESS.slice(-4)}
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Info Banner */}
        <div className="mt-8">
          <GlassCard className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border-emerald-500/20">
            <div className="flex gap-4">
              <Info className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-emerald-400 mb-2">How Staking Works</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Your staked QVTX is deposited into the MasterChef smart contract and begins earning rewards immediately. 
                  Rewards are calculated per block and can be claimed at any time without unstaking. 
                  When you unstake, your tokens are returned to your wallet along with any pending rewards.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Info Banner */}
        <div className="mt-8">
          <GlassCard className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border-emerald-500/20">
            <div className="flex gap-4">
              <Info className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-emerald-400 mb-2">How Staking Works</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Your staked QVTX is deposited into the MasterChef smart contract and begins earning rewards immediately. 
                  Rewards are calculated per block and can be claimed at any time without unstaking. 
                  When you unstake, your tokens are returned to your wallet along with any pending rewards.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Rewards Notification */}
        <RewardsNotification
          show={showRewardNotification}
          amount={rewardAmount}
          onClose={() => setShowRewardNotification(false)}
        />

        {/* AI Assistant */}
        <UniversalAssistant
          context="staking"
          userData={{
            stakedBalance: stakedBalance,
            pendingRewards: pendingRewards,
            apy: apy,
            walletBalance: walletBalance
          }}
        />
      </div>
    </div>
  );
}

export default function StakingDashboard() {
  return <GatedRoute pageName="Staking Dashboard"><StakingDashboardContent /></GatedRoute>;
}