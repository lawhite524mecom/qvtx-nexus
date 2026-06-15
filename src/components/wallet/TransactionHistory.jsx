import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Repeat, 
  ArrowLeftRight,
  ExternalLink,
  Filter,
  RefreshCw,
  Clock
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

const RPC_ENDPOINTS = {
  qvtx: "https://rpc.qvtx.io",
  polygon: "https://polygon-rpc.com",
  bsc: "https://bsc-dataseed.binance.org",
  base: "https://mainnet.base.org"
};

const TOKEN_ADDRESSES = {
  polygon: "0x43cc625d326618f23aECf39C170B1401509475E8",
  bsc: "0x9010e4c8149114b1fd2a0267a6b4138ee01af4af",
  base: "0x0d60757db0b32cbe4f536d297733635cd50f0f73"
};

const ERC20_TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

const EXPLORERS = {
  qvtx: "https://explorer.qvtx.io",
  polygon: "https://polygonscan.com",
  bsc: "https://bscscan.com",
  base: "https://basescan.org"
};

async function fetchTransactionHistory(userAddress, network) {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_ENDPOINTS[network]);
    const transactions = [];
    
    // Get latest block
    const latestBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, latestBlock - 10000); // Last ~10k blocks
    
    // Fetch native token transactions
    const nativeSymbol = network === "qvtx" ? "QVTX" : 
                        network === "polygon" ? "MATIC" : 
                        network === "bsc" ? "BNB" : "ETH";
    
    // Get recent blocks and check for transactions involving user
    const blockPromises = [];
    const sampleSize = 50; // Check last 50 blocks for demo
    for (let i = 0; i < sampleSize; i++) {
      blockPromises.push(
        provider.getBlock(latestBlock - i, true).catch(() => null)
      );
    }
    
    const blocks = await Promise.all(blockPromises);
    
    blocks.forEach(block => {
      if (!block?.transactions) return;
      
      block.transactions.forEach(tx => {
        if (!tx.from || !tx.to) return;
        
        const isFromUser = tx.from.toLowerCase() === userAddress.toLowerCase();
        const isToUser = tx.to?.toLowerCase() === userAddress.toLowerCase();
        
        if (isFromUser || isToUser) {
          transactions.push({
            hash: tx.hash,
            type: isFromUser ? "send" : "receive",
            token: nativeSymbol,
            amount: ethers.formatEther(tx.value || 0),
            from: tx.from,
            to: tx.to,
            timestamp: block.timestamp,
            network,
            blockNumber: block.number
          });
        }
      });
    });
    
    // Fetch ERC20 token transfers for networks with QVTX token
    if (TOKEN_ADDRESSES[network]) {
      try {
        const logs = await provider.getLogs({
          address: TOKEN_ADDRESSES[network],
          topics: [
            ERC20_TRANSFER_TOPIC,
            null,
            null
          ],
          fromBlock: fromBlock,
          toBlock: latestBlock
        });
        
        for (const log of logs.slice(-20)) { // Last 20 token transfers
          const from = ethers.getAddress("0x" + log.topics[1].slice(26));
          const to = ethers.getAddress("0x" + log.topics[2].slice(26));
          
          const isFromUser = from.toLowerCase() === userAddress.toLowerCase();
          const isToUser = to.toLowerCase() === userAddress.toLowerCase();
          
          if (isFromUser || isToUser) {
            const block = await provider.getBlock(log.blockNumber);
            transactions.push({
              hash: log.transactionHash,
              type: isFromUser ? "send" : "receive",
              token: "QVTX",
              amount: ethers.formatEther(log.data),
              from,
              to,
              timestamp: block.timestamp,
              network,
              blockNumber: log.blockNumber
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching token transfers for ${network}:`, error);
      }
    }
    
    return transactions;
  } catch (error) {
    console.error(`Error fetching transactions for ${network}:`, error);
    return [];
  }
}

export default function TransactionHistory({ userAddress }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterNetwork, setFilterNetwork] = useState("all");
  const [sortBy, setSortBy] = useState("timestamp");

  useEffect(() => {
    if (!userAddress) return;
    
    const fetchAll = async () => {
      setLoading(true);
      const networks = ["qvtx", "polygon", "bsc", "base"];
      const results = await Promise.all(
        networks.map(net => fetchTransactionHistory(userAddress, net))
      );
      
      const allTxs = results.flat();
      setTransactions(allTxs);
      setLoading(false);
    };
    
    fetchAll();
  }, [userAddress]);

  const filteredTxs = transactions
    .filter(tx => filterType === "all" || tx.type === filterType)
    .filter(tx => filterNetwork === "all" || tx.network === filterNetwork)
    .sort((a, b) => {
      if (sortBy === "timestamp") return b.timestamp - a.timestamp;
      if (sortBy === "amount") return parseFloat(b.amount) - parseFloat(a.amount);
      return 0;
    });

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case "send": return <ArrowUpRight className="w-4 h-4" />;
      case "receive": return <ArrowDownRight className="w-4 h-4" />;
      case "swap": return <Repeat className="w-4 h-4" />;
      case "bridge": return <ArrowLeftRight className="w-4 h-4" />;
      default: return <ArrowUpRight className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case "send": return "text-rose-400 bg-rose-500/10";
      case "receive": return "text-emerald-400 bg-emerald-500/10";
      case "swap": return "text-cyan-400 bg-cyan-500/10";
      case "bridge": return "text-violet-400 bg-violet-500/10";
      default: return "text-white/60 bg-white/5";
    }
  };

  const getNetworkColor = (network) => {
    switch(network) {
      case "qvtx": return "from-cyan-500 to-emerald-500";
      case "polygon": return "from-purple-500 to-violet-500";
      case "bsc": return "from-yellow-500 to-amber-500";
      case "base": return "from-blue-500 to-cyan-500";
      default: return "from-slate-500 to-gray-500";
    }
  };

  if (loading) {
    return (
      <GlassCard>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
          <span className="ml-3 text-white/60">Loading transaction history...</span>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
          >
            <option value="all">All Types</option>
            <option value="send">Send</option>
            <option value="receive">Receive</option>
            <option value="swap">Swap</option>
            <option value="bridge">Bridge</option>
          </select>

          <select
            value={filterNetwork}
            onChange={(e) => setFilterNetwork(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
          >
            <option value="all">All Networks</option>
            <option value="qvtx">QVTX Chain</option>
            <option value="polygon">Polygon</option>
            <option value="bsc">BSC</option>
            <option value="base">Base</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
          >
            <option value="timestamp">Sort by Time</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>

        <div className="text-sm text-white/40">
          {filteredTxs.length} transaction{filteredTxs.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Transaction List */}
      {filteredTxs.length === 0 ? (
        <GlassCard>
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No transactions found</p>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filteredTxs.map((tx, index) => (
            <motion.div
              key={`${tx.hash}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <GlassCard padding="p-4" hover>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl ${getTypeColor(tx.type)} flex items-center justify-center flex-shrink-0`}>
                      {getTypeIcon(tx.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold capitalize">{tx.type}</span>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium bg-gradient-to-r ${getNetworkColor(tx.network)} text-black`}>
                          {tx.network.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <span className="truncate">
                          {tx.type === "send" ? `To: ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}` : `From: ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`}
                        </span>
                        <span>•</span>
                        <span>{formatTime(tx.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className={`font-semibold ${tx.type === "send" ? "text-rose-400" : "text-emerald-400"}`}>
                      {tx.type === "send" ? "-" : "+"}{parseFloat(tx.amount).toFixed(4)} {tx.token}
                    </p>
                    <a
                      href={`${EXPLORERS[tx.network]}/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 justify-end mt-1"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}