import React, { useState } from "react";
import { Code, Copy, Check, Book, Zap, Shield, Link as LinkIcon } from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function PartnerAPIGuide({ partner }) {
  const [copiedCode, setCopiedCode] = useState(null);

  const copyCode = (key, code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getPersonalizedExamples = () => {
    const examples = {
      installation: `npm install @qvtx/sdk
# or
yarn add @qvtx/sdk`,

      initialization: `import { QVTX } from '@qvtx/sdk';

// Initialize for ${partner.companyName}
const qvtx = new QVTX({
  network: 'mainnet', // or 'testnet' for development
  apiKey: 'your-api-key'
});

// Connect wallet
await qvtx.wallet.connect();`,

      transfer: `// ${partner.partnershipType === 'technology' ? 'API integration' : 'Token transfer'} for ${partner.industry || 'your use case'}
const tx = await qvtx.transfer({
  to: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fDEa',
  amount: '1000',
  token: 'QVTX'
});

console.log('Transaction hash:', tx.hash);
console.log('Explore:', \`https://explorer.qvtx.io/tx/\${tx.hash}\`);`,

      multichain: `// Multi-chain bridge for ${partner.companyName}
// Bridge QVTX tokens between networks
await qvtx.bridge.transfer({
  from: 'polygon',
  to: 'bsc',
  amount: '5000',
  token: 'QVTX'
});

// Check bridge status
const status = await qvtx.bridge.getStatus(transactionHash);`,

      staking: partner.partnershipType === 'strategic' ? `// Staking for investment partners
const stake = await qvtx.staking.stake({
  amount: '10000',
  pool: '365-day', // Long-term staking
  lockPeriod: 365
});

// Track rewards
const rewards = await qvtx.staking.getRewards();
console.log('Earned rewards:', rewards.earned);` : null,

      enterprise: partner.partnershipType === 'enterprise' ? `// Enterprise API access for ${partner.companyName}
// Batch operations
const results = await qvtx.batch([
  { method: 'transfer', params: { to: '0x...', amount: '100' } },
  { method: 'transfer', params: { to: '0x...', amount: '200' } }
]);

// Webhook setup for transaction notifications
await qvtx.webhooks.create({
  url: 'https://your-company.com/webhooks/qvtx',
  events: ['transaction.completed', 'transfer.received']
});` : null
    };

    return Object.entries(examples).filter(([_, code]) => code !== null);
  };

  const contractAddresses = [
    { network: "QVTX Chain", address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8fDEa", explorer: "https://explorer.qvtx.io" },
    { network: "Polygon", address: "0x43cc625d326618f23aECf39C170B1401509475E8", explorer: "https://polygonscan.com" },
    { network: "BSC", address: "0x9010e4c8149114b1fd2a0267a6b4138ee01af4af", explorer: "https://bscscan.com" },
    { network: "Base", address: "0x0d60757db0b32cbe4f536d297733635cd50f0f73", explorer: "https://basescan.org" }
  ];

  const resources = [
    {
      title: "Full API Documentation",
      description: "Complete reference for all QVTX SDK methods",
      icon: Book,
      link: "/Docs"
    },
    {
      title: "Smart Contracts",
      description: "Verified contract addresses and ABIs",
      icon: Shield,
      link: "/Contracts"
    },
    {
      title: "Integration Guide",
      description: `${partner.partnershipType} partnership integration best practices`,
      icon: Zap,
      link: "#"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Start */}
      <GlassCard>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Code className="w-5 h-5 text-cyan-400" />
          API Quick Start for {partner.companyName}
        </h2>

        <div className="space-y-6">
          {getPersonalizedExamples().map(([key, code]) => (
            <div key={key}>
              <h3 className="text-sm font-semibold text-amber-400 mb-3 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <div className="relative">
                <pre className="bg-[#0d1117] border border-white/10 rounded-xl p-4 overflow-x-auto text-sm">
                  <code className="text-white/80">{code}</code>
                </pre>
                <button
                  onClick={() => copyCode(key, code)}
                  className="absolute top-3 right-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {copiedCode === key ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/40" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Contract Addresses */}
      <GlassCard>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-violet-400" />
          Contract Addresses
        </h3>
        <div className="space-y-3">
          {contractAddresses.map((contract) => (
            <div key={contract.network} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div>
                <p className="font-semibold mb-1">{contract.network}</p>
                <code className="text-sm text-cyan-400 font-mono">{contract.address}</code>
              </div>
              <a
                href={`${contract.explorer}/address/${contract.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-lg hover:bg-violet-500/20 transition-colors text-sm font-medium"
              >
                View
              </a>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Resources */}
      <div className="grid md:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <a
            key={resource.title}
            href={resource.link}
            className="block"
          >
            <GlassCard className="h-full hover:border-amber-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center mb-4">
                <resource.icon className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="font-semibold mb-2">{resource.title}</h4>
              <p className="text-sm text-white/60">{resource.description}</p>
            </GlassCard>
          </a>
        ))}
      </div>
    </div>
  );
}