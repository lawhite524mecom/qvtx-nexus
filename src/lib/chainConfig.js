// Real QVTX Chain Configuration & Contract Addresses

export const CHAINS = {
  QVTX_MAINNET: {
    chainId: 20232,
    chainIdHex: "0x4f08",
    name: "QVTX DNA Mainnet",
    rpc: "https://rpc.qvtx.io",
    symbol: "QVTX",
    explorer: "https://explorer.qvtx.io",
  },
  DNA_EXPRESSION: {
    chainId: 42000,
    chainIdHex: "0xa410",
    name: "DNA Expression",
    rpc: "http://203.161.33.24:8555",
    symbol: "QVTX",
    explorer: "",
  },
};

export const CONTRACTS = {
  // Chain 42000 — DNA Expression
  QVTX_DNA_NFT:           "0x355F546836506E866F3313b8ac1B827a9f6AC560",
  QVTXNFTWhitelist:        "0x2ed0950abb54d593254632f76737dFC7f1b9F3F4",
  QVTXRewardDistributor:   "0x0cB0069388780316509a45130EEe6e55e7629D64",
  QVTXNFTStaking:          "0xd54DeED5196f04170B20C133262fd2aec31D8c94",
  QVTX_LP_NFT:             "0x61A2FF5F9721318A9FB40e64223F0d05Ee496ED9",
  QVTXPoolFactory:         "0x03F1888d106993Ce50461B899e66e1E4daE43599",
  QVTXValueOracle:         "0x424C3494400d7D4FD87efDD1fc1a173464212F2A",
  DNAEncoder:              "0x6fB2a4F40236d86D4c194219586cdff765e44D0F",
  ByteIDGenerator:         "0x5b5711218dDAAf393BfFC302f1724f859BaB7a6F",
  // Token contracts on other chains
  TOKEN_BSC:               "0x5ad163056FC308C5ab88bf9295EAA2C16F3db400",
  TOKEN_POLYGON:           "0x43cc625d326618f23aECf39C170B1401509475E8",
};

// Generic JSON-RPC call via fetch — no external dependencies
export async function rpcCall(rpcUrl, method, params = []) {
  try {
    const res = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
    });
    const json = await res.json();
    if (json.error) throw new Error(json.error.message);
    return json.result;
  } catch {
    return null;
  }
}

// Parse hex block number to integer
export function hexToNumber(hex) {
  if (!hex) return null;
  return parseInt(hex, 16);
}

// Get latest block number from a chain
export async function getBlockNumber(rpcUrl) {
  const result = await rpcCall(rpcUrl, "eth_blockNumber");
  return hexToNumber(result);
}

// Get native balance of an address
export async function getNativeBalance(rpcUrl, address) {
  const result = await rpcCall(rpcUrl, "eth_getBalance", [address, "latest"]);
  if (!result) return "0";
  // Convert hex wei to QVTX (18 decimals)
  const wei = BigInt(result);
  const whole = wei / BigInt("1000000000000000000");
  const frac = (wei % BigInt("1000000000000000000")) / BigInt("100000000000000");
  return `${whole}.${frac.toString().padStart(4, "0")}`;
}

// Add QVTX chain to MetaMask
export async function addChainToMetaMask(chainKey) {
  const chain = CHAINS[chainKey];
  if (!window.ethereum || !chain) return false;
  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: chain.chainIdHex,
        chainName: chain.name,
        nativeCurrency: { name: chain.symbol, symbol: chain.symbol, decimals: 18 },
        rpcUrls: [chain.rpc],
        blockExplorerUrls: chain.explorer ? [chain.explorer] : [],
      }],
    });
    return true;
  } catch {
    return false;
  }
}