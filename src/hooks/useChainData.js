import { useState, useEffect } from "react";
import { getBlockNumber, CHAINS } from "@/lib/chainConfig";

// Hook that fetches live block numbers from both QVTX chains
export function useChainData() {
  const [mainnetBlock, setMainnetBlock] = useState(null);
  const [dnaBlock, setDnaBlock] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const [m, d] = await Promise.all([
      getBlockNumber(CHAINS.QVTX_MAINNET.rpc),
      getBlockNumber(CHAINS.DNA_EXPRESSION.rpc),
    ]);
    setMainnetBlock(m);
    setDnaBlock(d);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  return { mainnetBlock, dnaBlock, loading, refresh: fetch };
}