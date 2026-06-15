import React, { useState, useEffect } from "react";
import { ChevronDown, Check, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NETWORKS = {
  qvtx: {
    chainId: "0x4f08",
    chainIdNum: 20232,
    chainName: "QVTX Chain",
    nativeCurrency: { name: "QVTX", symbol: "QVTX", decimals: 18 },
    rpcUrls: ["https://rpc.qvtx.io"],
    blockExplorerUrls: ["https://explorer.qvtx.io"],
    color: "from-cyan-500 to-emerald-500",
    icon: "Q"
  },
  polygon: {
    chainId: "0x89",
    chainIdNum: 137,
    chainName: "Polygon",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"],
    color: "from-purple-500 to-violet-500",
    icon: "P"
  },
  bsc: {
    chainId: "0x38",
    chainIdNum: 56,
    chainName: "BSC",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"],
    color: "from-yellow-500 to-amber-500",
    icon: "B"
  },
  base: {
    chainId: "0x2105",
    chainIdNum: 8453,
    chainName: "Base",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.base.org"],
    blockExplorerUrls: ["https://basescan.org"],
    color: "from-blue-500 to-cyan-500",
    icon: "E"
  }
};

export default function NetworkSwitcher({ onNetworkChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    detectNetwork();
    
    if (window.ethereum) {
      window.ethereum.on('chainChanged', detectNetwork);
      return () => {
        window.ethereum.removeListener('chainChanged', detectNetwork);
      };
    }
  }, []);

  const detectNetwork = async () => {
    if (!window.ethereum) return;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const network = Object.entries(NETWORKS).find(
        ([_, net]) => net.chainId === chainId
      );
      
      if (network) {
        setCurrentNetwork(network[0]);
      }
    } catch (error) {
      console.error("Error detecting network:", error);
    }
  };

  const switchNetwork = async (networkKey) => {
    if (!window.ethereum) {
      alert("Please install MetaMask or another Web3 wallet");
      return;
    }

    const network = NETWORKS[networkKey];
    setSwitching(true);
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });
      
      setCurrentNetwork(networkKey);
      onNetworkChange?.(networkKey);
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: network.chainId,
              chainName: network.chainName,
              nativeCurrency: network.nativeCurrency,
              rpcUrls: network.rpcUrls,
              blockExplorerUrls: network.blockExplorerUrls
            }],
          });
          
          setCurrentNetwork(networkKey);
          onNetworkChange?.(networkKey);
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      } else {
        console.error('Failed to switch network:', switchError);
      }
    } finally {
      setSwitching(false);
      setIsOpen(false);
    }
  };

  const current = currentNetwork ? NETWORKS[currentNetwork] : null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
      >
        {current ? (
          <>
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${current.color} flex items-center justify-center text-black font-bold text-sm`}>
              {current.icon}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">{current.chainName}</p>
              <p className="text-xs text-white/40">Chain ID: {current.chainIdNum}</p>
            </div>
          </>
        ) : (
          <>
            <Globe className="w-5 h-5 text-white/40" />
            <span className="text-sm text-white/60">Select Network</span>
          </>
        )}
        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 right-0 w-64 bg-[#0f1019] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20"
            >
              {Object.entries(NETWORKS).map(([key, network]) => (
                <button
                  key={key}
                  onClick={() => switchNetwork(key)}
                  disabled={switching}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${
                    currentNetwork === key ? 'bg-white/5' : ''
                  } disabled:opacity-50`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${network.color} flex items-center justify-center text-black font-bold text-sm`}>
                      {network.icon}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">{network.chainName}</p>
                      <p className="text-xs text-white/40">{network.nativeCurrency.symbol}</p>
                    </div>
                  </div>
                  {currentNetwork === key && (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}