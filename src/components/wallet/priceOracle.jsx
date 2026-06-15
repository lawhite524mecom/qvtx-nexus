import { ethers } from "ethers";

// CoinGecko API endpoint (free tier, no API key needed)
const COINGECKO_API = "https://api.coingecko.com/api/v3";

// Token ID mapping for CoinGecko
const TOKEN_IDS = {
  qvtx: "qvtx-token", // Placeholder - replace with actual CoinGecko ID
  matic: "matic-network",
  bnb: "binancecoin",
  eth: "ethereum"
};

/**
 * Fetch current prices for multiple tokens from CoinGecko
 * @param {Array<string>} tokens - Array of token symbols (qvtx, matic, bnb, eth)
 * @returns {Object} Price data for each token
 */
export async function fetchTokenPrices(tokens = ["qvtx", "matic", "bnb", "eth"]) {
  try {
    const tokenIds = tokens.map(t => TOKEN_IDS[t.toLowerCase()]).filter(Boolean).join(",");
    
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${tokenIds}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch prices");
    }
    
    const data = await response.json();
    
    // Transform data to a more usable format
    const prices = {};
    tokens.forEach(token => {
      const tokenId = TOKEN_IDS[token.toLowerCase()];
      if (data[tokenId]) {
        prices[token.toLowerCase()] = {
          usd: data[tokenId].usd || 0,
          change24h: data[tokenId].usd_24h_change || 0,
          marketCap: data[tokenId].usd_market_cap || 0,
          volume24h: data[tokenId].usd_24h_vol || 0
        };
      } else {
        // Fallback for tokens not found
        prices[token.toLowerCase()] = {
          usd: token === "qvtx" ? 5.33 : 0,
          change24h: 0,
          marketCap: 0,
          volume24h: 0
        };
      }
    });
    
    return prices;
  } catch (error) {
    console.error("Error fetching token prices:", error);
    
    // Return fallback prices
    return {
      qvtx: { usd: 5.33, change24h: 0, marketCap: 0, volume24h: 0 },
      matic: { usd: 0, change24h: 0, marketCap: 0, volume24h: 0 },
      bnb: { usd: 0, change24h: 0, marketCap: 0, volume24h: 0 },
      eth: { usd: 0, change24h: 0, marketCap: 0, volume24h: 0 }
    };
  }
}

/**
 * Get a single token price
 * @param {string} token - Token symbol
 * @returns {Object} Price data for the token
 */
export async function getTokenPrice(token) {
  const prices = await fetchTokenPrices([token]);
  return prices[token.toLowerCase()];
}

/**
 * Format price for display
 * @param {number} price - Price value
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
  if (price >= 1000) {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (price >= 1) {
    return `$${price.toFixed(2)}`;
  } else if (price >= 0.01) {
    return `$${price.toFixed(4)}`;
  } else {
    return `$${price.toFixed(6)}`;
  }
}

/**
 * Format percentage change
 * @param {number} change - Percentage change
 * @returns {string} Formatted change string
 */
export function formatChange(change) {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}