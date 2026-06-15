import { ethers } from "ethers";

// Gas price oracle for different networks
const GAS_ORACLE_URLS = {
  qvtx: "https://rpc.qvtx.io",
  polygon: "https://gasstation.polygon.technology/v2",
  bsc: "https://bsc-dataseed.binance.org",
  base: "https://mainnet.base.org"
};

/**
 * Fetch current gas prices from network
 * @param {string} network - Network identifier (qvtx, polygon, bsc, base)
 * @returns {Object} Gas prices in Gwei
 */
export async function fetchGasPrice(network) {
  try {
    let provider;
    
    switch (network) {
      case "qvtx":
        provider = new ethers.JsonRpcProvider("https://rpc.qvtx.io");
        break;
      case "polygon":
        provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
        break;
      case "bsc":
        provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org");
        break;
      case "base":
        provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
        break;
      default:
        throw new Error("Unsupported network");
    }

    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice;
    
    // Convert to Gwei
    const gasPriceGwei = parseFloat(ethers.formatUnits(gasPrice, "gwei"));
    
    // Calculate different speed options
    return {
      slow: (gasPriceGwei * 0.8).toFixed(2),
      standard: gasPriceGwei.toFixed(2),
      fast: (gasPriceGwei * 1.2).toFixed(2),
      instant: (gasPriceGwei * 1.5).toFixed(2)
    };
  } catch (error) {
    console.error(`Error fetching gas price for ${network}:`, error);
    // Fallback values
    return {
      slow: "20",
      standard: "25",
      fast: "30",
      instant: "35"
    };
  }
}

/**
 * Estimate gas cost for a transaction
 * @param {string} network - Network identifier
 * @param {string} txType - Transaction type (swap, bridge, transfer)
 * @param {number} gasPrice - Gas price in Gwei
 * @returns {Object} Estimated gas cost
 */
export function estimateGasCost(network, txType, gasPrice) {
  // Estimated gas units for different transaction types
  const gasUnits = {
    swap: 200000,
    bridge: 350000,
    transfer: 21000
  };

  const units = gasUnits[txType] || 100000;
  const gasPriceWei = ethers.parseUnits(gasPrice.toString(), "gwei");
  const totalWei = gasPriceWei * BigInt(units);
  const totalEth = ethers.formatEther(totalWei);

  return {
    gasUnits: units,
    gasPrice: gasPrice,
    totalCost: parseFloat(totalEth).toFixed(6),
    totalCostUSD: (parseFloat(totalEth) * getEthPrice(network)).toFixed(2)
  };
}

/**
 * Get ETH price for different networks (mock prices for now)
 */
function getEthPrice(network) {
  const prices = {
    qvtx: 5.33, // QVTX price
    polygon: 2300, // ETH price for MATIC gas
    bsc: 2300, // ETH price for BNB gas
    base: 2300 // ETH price
  };
  return prices[network] || 2300;
}

/**
 * Calculate optimal gas price based on urgency
 * @param {Object} gasPrices - Gas prices object
 * @param {string} speed - Speed preference (slow, standard, fast, instant)
 * @returns {number} Selected gas price
 */
export function getOptimalGasPrice(gasPrices, speed = "standard") {
  return parseFloat(gasPrices[speed] || gasPrices.standard);
}