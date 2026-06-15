import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const RPC_ENDPOINTS = {
  qvtx: "https://rpc.qvtx.io",
  polygon: "https://polygon-rpc.com",
  bsc: "https://bsc-dataseed.binance.org",
  base: "https://mainnet.base.org",
  xrp: "https://s1.ripple.com:51234"
};

export function useNetworkStatus(network) {
  const [status, setStatus] = useState("checking");
  const [blockNumber, setBlockNumber] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        if (network === "xrp") {
          // Check XRP Ledger
          const response = await fetch(RPC_ENDPOINTS.xrp, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              method: "server_info",
              params: [{}]
            }),
            signal: AbortSignal.timeout(5000)
          });
          
          if (response.ok) {
            const data = await response.json();
            setStatus(data.result?.info?.server_state === "full" ? "online" : "degraded");
            setBlockNumber(data.result?.info?.validated_ledger?.seq || null);
          } else {
            setStatus("degraded");
          }
        } else {
          // Check EVM networks
          const provider = new ethers.JsonRpcProvider(RPC_ENDPOINTS[network]);
          const blockNum = await Promise.race([
            provider.getBlockNumber(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error("Timeout")), 5000)
            )
          ]);
          
          setBlockNumber(blockNum);
          
          // Check if blocks are recent (within last 30 seconds)
          const latestBlock = await provider.getBlock(blockNum);
          const now = Math.floor(Date.now() / 1000);
          const blockAge = now - latestBlock.timestamp;
          
          if (blockAge > 60) {
            setStatus("degraded");
          } else {
            setStatus("online");
          }
        }
      } catch (error) {
        console.error(`Network ${network} check failed:`, error);
        setStatus("offline");
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [network]);

  return { status, blockNumber };
}

export function NetworkStatusIndicator({ status, size = "md", showLabel = false }) {
  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  const colors = {
    online: "bg-emerald-400 shadow-emerald-400/50",
    degraded: "bg-amber-400 shadow-amber-400/50",
    offline: "bg-rose-400 shadow-rose-400/50",
    checking: "bg-slate-400 shadow-slate-400/50"
  };

  const labels = {
    online: "Online",
    degraded: "Degraded",
    offline: "Offline",
    checking: "Checking..."
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizes[size]} ${colors[status]} rounded-full shadow-lg animate-pulse`} />
      {showLabel && (
        <span className={`text-xs font-medium ${
          status === "online" ? "text-emerald-400" :
          status === "degraded" ? "text-amber-400" :
          status === "offline" ? "text-rose-400" :
          "text-slate-400"
        }`}>
          {labels[status]}
        </span>
      )}
    </div>
  );
}