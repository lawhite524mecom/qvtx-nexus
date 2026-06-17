import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  CreditCard, 
  Building2, 
  Smartphone, 
  ArrowRight,
  ExternalLink,
  Zap,
  Shield,
  Clock,
  CheckCircle
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import { Button } from "@/components/ui/button";

const PROVIDERS = [
  {
    id: "transak",
    name: "Transak",
    logo: "T",
    url: "https://global.transak.com",
    minAmount: 30,
    maxAmount: 10000,
    fee: "0.99%",
    time: "Instant",
    methods: ["Card", "Bank Transfer", "Cash App", "Apple Pay"],
    recommended: true
  },
  {
    id: "moonpay",
    name: "Moonpay",
    logo: "M",
    url: "https://buy.moonpay.com",
    minAmount: 20,
    maxAmount: 20000,
    fee: "3.5%",
    time: "Instant",
    methods: ["Card", "Bank Transfer", "Cash App", "Google Pay"]
  },
  {
    id: "cashapp",
    name: "Cash App Direct",
    logo: "$",
    url: "https://cash.app",
    minAmount: 10,
    maxAmount: 5000,
    fee: "2.5%",
    time: "Instant",
    methods: ["Cash App Balance", "Linked Bank"],
    featured: true
  },
  {
    id: "ramp",
    name: "Ramp Network",
    logo: "R",
    url: "https://buy.ramp.network",
    minAmount: 50,
    maxAmount: 15000,
    fee: "2.9%",
    time: "5-10 min",
    methods: ["Card", "Bank Transfer", "Open Banking"]
  }
];

const FEATURES = [
  { icon: Zap, title: "Instant Delivery", description: "Receive QVTX tokens within minutes" },
  { icon: Shield, title: "Secure & Regulated", description: "KYC verified, fully compliant providers" },
  { icon: Clock, title: "24/7 Available", description: "Buy anytime with multiple payment options" }
];

export default function BuyQVTX() {
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("100");
  const [selectedProvider, setSelectedProvider] = useState("transak");

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (err) {
        console.error('Failed to check wallet:', err);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to continue');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  const handleBuy = () => {
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }
    if (!amount || parseFloat(amount) < 10) {
      alert('Minimum purchase is $10');
      return;
    }

    const provider = PROVIDERS.find(p => p.id === selectedProvider);
    const appUrl = window.location.origin;
    let onrampUrl = "";

    if (selectedProvider === "transak") {
      const params = new URLSearchParams({
        apiKey: "your_transak_api_key",
        cryptoCurrencyCode: "QVTX",
        walletAddress: walletAddress,
        fiatAmount: amount,
        fiatCurrency: "USD",
        redirectURL: appUrl + "/wallet",
        networks: "qvtx",
        paymentMethod: "cash_app"
      });
      onrampUrl = `https://global.transak.com?${params.toString()}`;
    } else if (selectedProvider === "moonpay") {
      const params = new URLSearchParams({
        apiKey: "pk_test_your_moonpay_key",
        currencyCode: "qvtx",
        walletAddress: walletAddress,
        baseCurrencyAmount: amount,
        baseCurrencyCode: "usd",
        redirectURL: appUrl + "/wallet",
        paymentMethod: "cash_app"
      });
      onrampUrl = `https://buy.moonpay.com?${params.toString()}`;
    } else if (selectedProvider === "cashapp") {
      // Direct Cash App integration
      const params = new URLSearchParams({
        recipient: walletAddress,
        amount: amount,
        token: "QVTX",
        note: `Buy ${((parseFloat(amount) * 0.975) / 5.33).toFixed(2)} QVTX tokens`
      });
      onrampUrl = `https://cash.app/pay?${params.toString()}`;
    } else {
      onrampUrl = `https://buy.ramp.network/?hostApiKey=your_ramp_key&swapAsset=QVTX&userAddress=${walletAddress}&fiatValue=${amount}&fiatCurrency=USD`;
    }

    window.open(onrampUrl, "_blank", "width=500,height=700");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 mb-6">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Fiat On-Ramp</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Buy QVTX with Fiat
            </span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Purchase QVTX tokens instantly using your credit card, bank transfer, or mobile payment methods
          </p>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="text-center h-full">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Main Purchase Area */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Buy Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <h2 className="text-2xl font-bold mb-6 text-cyan-400">Purchase Details</h2>

              {/* Wallet Connection */}
              <div className="mb-6">
                <label className="text-sm text-white/60 mb-2 block">Wallet Address</label>
                {walletAddress ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="font-mono text-sm">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </span>
                    </div>
                    <span className="text-xs text-emerald-400">Connected</span>
                  </div>
                ) : (
                  <Button
                    onClick={connectWallet}
                    className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold"
                  >
                    Connect Wallet
                  </Button>
                )}
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="text-sm text-white/60 mb-2 block">Amount (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500/50 transition-colors text-xl"
                    min="20"
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-white/40">
                  <span>Minimum: $10 (Cash App)</span>
                  <span>Maximum: $20,000</span>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[50, 100, 250, 500].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      amount === preset.toString()
                        ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black"
                        : "bg-white/5 border border-white/10 hover:border-emerald-500/30"
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>

              {/* Estimate */}
              {amount && parseFloat(amount) >= 10 && (
                <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-white/60 text-sm">You pay</span>
                    <span className="font-semibold">${parseFloat(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/60 text-sm">QVTX price</span>
                    <span className="font-semibold text-white/50">—</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/60 text-sm">Est. fee (3%)</span>
                    <span className="text-amber-400">-${(parseFloat(amount) * 0.03).toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex justify-between">
                    <span className="text-white/80">You receive</span>
                    <span className="text-xl font-bold text-emerald-400">—</span>
                  </div>
                </div>
              )}

              {/* Buy Button */}
              <Button
                onClick={handleBuy}
                disabled={!walletAddress || !amount || parseFloat(amount) < 10}
                className="w-full py-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-lg disabled:opacity-50"
              >
                {selectedProvider === "cashapp" ? "Pay with Cash App" : "Buy QVTX Now"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-xs text-white/40 text-center mt-4">
                {selectedProvider === "cashapp" 
                  ? "Instant delivery via Cash App" 
                  : "Tokens will be sent to your wallet within 5-10 minutes"}
              </p>
            </GlassCard>
          </motion.div>

          {/* Right: Provider Selection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard>
              <h2 className="text-2xl font-bold mb-6 text-cyan-400">Payment Providers</h2>
              <div className="space-y-4">
                {PROVIDERS.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`w-full p-5 rounded-xl transition-all text-left ${
                      selectedProvider === provider.id
                        ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 border-2 border-emerald-500/50"
                        : "bg-white/5 border border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-black font-bold text-xl ${
                          provider.id === "cashapp" 
                            ? "bg-gradient-to-br from-green-400 to-green-600"
                            : "bg-gradient-to-br from-emerald-500 to-cyan-500"
                        }`}>
                          {provider.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold">{provider.name}</h3>
                            {provider.recommended && (
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                                Recommended
                              </span>
                            )}
                            {provider.featured && (
                              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                                Instant
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/50 mt-0.5">
                            ${provider.minAmount} - ${provider.maxAmount.toLocaleString()} limit
                          </p>
                        </div>
                      </div>
                      {selectedProvider === provider.id && (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>

                    <div className="flex gap-4 text-sm mb-3">
                      <div>
                        <span className="text-white/40">Fee: </span>
                        <span className="text-emerald-400 font-semibold">{provider.fee}</span>
                      </div>
                      <div>
                        <span className="text-white/40">Time: </span>
                        <span className="text-white/80">{provider.time}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {provider.methods.map((method) => (
                        <span
                          key={method}
                          className="px-2 py-1 bg-white/5 rounded text-xs text-white/60"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Secure Payment Processing
                </h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  All providers are KYC/AML compliant and regulated. Your payment information is processed securely by trusted third-party services. QVTX is not responsible for provider fees or processing times.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}