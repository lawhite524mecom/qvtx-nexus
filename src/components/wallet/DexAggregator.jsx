// DEX Aggregator for finding best swap rates across multiple DEXes

const DEX_SOURCES = {
  qvtx: [
    { name: "QVTX Swap", router: "0xa12cF0ae4afC64a8c975ADf652Ea72d4Be9ab92b", fee: 0.3 },
    { name: "UniswapV2", router: "0xC677736d5B3f34Bf460F502443c287E69E31FfF4", fee: 0.3 }
  ],
  polygon: [
    { name: "QuickSwap", router: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff", fee: 0.3 },
    { name: "SushiSwap", router: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506", fee: 0.3 }
  ],
  bsc: [
    { name: "PancakeSwap", router: "0x10ED43C718714eb63d5aA57B78B54704E256024E", fee: 0.25 },
    { name: "BiSwap", router: "0x3a6d8cA21D1CF76F653A67577FA0D27453350dD8", fee: 0.2 }
  ],
  base: [
    { name: "BaseSwap", router: "0x327Df1E6de05895d2ab08513aaDD9313Fe505d86", fee: 0.3 },
    { name: "Aerodrome", router: "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43", fee: 0.25 }
  ]
};

export async function findBestRate(fromNetwork, fromToken, toToken, amount) {
  const sources = DEX_SOURCES[fromNetwork] || [];
  
  const quotes = await Promise.all(
    sources.map(async (dex) => {
      try {
        // Simulate rate calculation (in production, query actual DEX contracts)
        const baseRate = 0.98;
        const feeMultiplier = 1 - (dex.fee / 100);
        const priceImpact = calculatePriceImpact(amount);
        const outputAmount = parseFloat(amount) * baseRate * feeMultiplier * (1 - priceImpact);
        
        return {
          dex: dex.name,
          router: dex.router,
          outputAmount: outputAmount.toFixed(6),
          rate: (outputAmount / parseFloat(amount)).toFixed(6),
          fee: dex.fee,
          priceImpact: (priceImpact * 100).toFixed(2),
          gasEstimate: estimateGasForDex(dex.name)
        };
      } catch (error) {
        return null;
      }
    })
  );

  const validQuotes = quotes.filter(q => q !== null);
  
  // Sort by best output amount
  validQuotes.sort((a, b) => parseFloat(b.outputAmount) - parseFloat(a.outputAmount));
  
  return validQuotes;
}

function calculatePriceImpact(amount) {
  // Simplified price impact calculation
  const amt = parseFloat(amount);
  if (amt < 100) return 0.001;
  if (amt < 1000) return 0.005;
  if (amt < 10000) return 0.01;
  return 0.02;
}

function estimateGasForDex(dexName) {
  const gasEstimates = {
    "QVTX Swap": "0.002",
    "UniswapV2": "0.0025",
    "QuickSwap": "0.001",
    "SushiSwap": "0.0012",
    "PancakeSwap": "0.0008",
    "BiSwap": "0.0007",
    "BaseSwap": "0.0015",
    "Aerodrome": "0.0013"
  };
  return gasEstimates[dexName] || "0.002";
}

export function calculateSavings(bestQuote, secondBestQuote) {
  if (!bestQuote || !secondBestQuote) return null;
  
  const diff = parseFloat(bestQuote.outputAmount) - parseFloat(secondBestQuote.outputAmount);
  const percentage = (diff / parseFloat(secondBestQuote.outputAmount)) * 100;
  
  return {
    amount: diff.toFixed(6),
    percentage: percentage.toFixed(2)
  };
}