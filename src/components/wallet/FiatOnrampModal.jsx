import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Gift,
  DollarSign,
  ArrowRight,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

const PAYMENT_METHODS = [
  { 
    id: "card", 
    name: "Credit/Debit Card", 
    icon: CreditCard, 
    providers: ["Moonpay", "Transak", "Ramp"],
    fees: "3.5-4.5%",
    time: "Instant"
  },
  { 
    id: "bank", 
    name: "Bank Transfer (ACH)", 
    icon: Building2, 
    providers: ["Plaid", "Transak"],
    fees: "0.5-1.5%",
    time: "1-3 days"
  },
  { 
    id: "mobile", 
    name: "Cash App / Venmo / Zelle", 
    icon: Smartphone, 
    providers: ["Moonpay", "Transak"],
    fees: "2-3%",
    time: "5-30 min"
  },
  { 
    id: "giftcard", 
    name: "Gift Cards", 
    icon: Gift, 
    providers: ["Coinsbee", "Bitrefill"],
    fees: "5-10%",
    time: "Instant"
  }
];

const PROVIDERS = {
  moonpay: {
    name: "Moonpay",
    logo: "M",
    url: "https://buy.moonpay.com",
    methods: ["card", "bank", "mobile"],
    minAmount: 20,
    maxAmount: 20000
  },
  transak: {
    name: "Transak",
    logo: "T",
    url: "https://global.transak.com",
    methods: ["card", "bank", "mobile"],
    minAmount: 30,
    maxAmount: 10000
  },
  ramp: {
    name: "Ramp Network",
    logo: "R",
    url: "https://buy.ramp.network",
    methods: ["card", "bank"],
    minAmount: 50,
    maxAmount: 15000
  }
};

export default function FiatOnrampModal({ isOpen, onClose, userAddress }) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(1); // 1: method, 2: provider, 3: amount, 4: redirect

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setStep(2);
  };

  const handleProviderSelect = (providerId) => {
    setSelectedProvider(providerId);
    setStep(3);
  };

  const handlePurchase = () => {
    if (!amount || parseFloat(amount) < 20) {
      alert("Minimum purchase is $20");
      return;
    }

    const provider = PROVIDERS[selectedProvider];
    const appUrl = window.location.origin;
    
    // Build provider-specific URLs with webhook endpoints
    let onrampUrl = "";
    
    if (selectedProvider === "moonpay") {
      const params = new URLSearchParams({
        apiKey: "pk_test_your_moonpay_key", // Replace with actual key from dashboard
        currencyCode: "qvtx",
        walletAddress: userAddress,
        baseCurrencyAmount: amount,
        baseCurrencyCode: "usd",
        redirectURL: appUrl + "/wallet",
        webhookUrl: appUrl + "/api/functions/moonpayWebhook"
      });
      onrampUrl = `https://buy.moonpay.com?${params.toString()}`;
    } else if (selectedProvider === "transak") {
      const params = new URLSearchParams({
        apiKey: "your_transak_api_key", // Replace with actual key
        cryptoCurrencyCode: "QVTX",
        walletAddress: userAddress,
        fiatAmount: amount,
        fiatCurrency: "USD",
        redirectURL: appUrl + "/wallet",
        webhookUrl: appUrl + "/api/functions/transakWebhook",
        networks: "qvtx"
      });
      onrampUrl = `https://global.transak.com?${params.toString()}`;
    } else {
      // Ramp Network
      onrampUrl = `https://buy.ramp.network/?hostApiKey=your_ramp_key&swapAsset=QVTX&userAddress=${userAddress}&fiatValue=${amount}&fiatCurrency=USD`;
    }
    
    // Open provider in new window
    window.open(onrampUrl, "_blank", "width=500,height=700");
    
    setStep(4);
  };

  const resetModal = () => {
    setStep(1);
    setSelectedMethod(null);
    setSelectedProvider(null);
    setAmount("");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl"
        >
          <GlassCard padding="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                  Buy QVTX with Fiat
                </h2>
                <p className="text-sm text-white/50 mt-1">Multiple payment methods supported</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <div className="p-6">
              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      step >= num 
                        ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black"
                        : "bg-white/5 text-white/40"
                    }`}>
                      {num}
                    </div>
                    {num < 3 && (
                      <div className={`w-12 h-0.5 mx-2 transition-all ${
                        step > num ? "bg-gradient-to-r from-emerald-500 to-cyan-500" : "bg-white/10"
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Payment Method */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {PAYMENT_METHODS.map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          onClick={() => handleMethodSelect(method)}
                          className="p-5 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500/30 hover:bg-white/10 transition-all text-left group"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 flex items-center justify-center">
                              <Icon className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">{method.name}</h4>
                              <div className="flex gap-2 text-xs">
                                <span className="text-emerald-400">Fee: {method.fees}</span>
                                <span className="text-white/40">• {method.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            {method.providers.map((p) => (
                              <span key={p} className="px-2 py-1 bg-white/5 rounded text-xs text-white/60">
                                {p}
                              </span>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Provider */}
              {step === 2 && selectedMethod && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-cyan-400 hover:text-cyan-300 mb-4"
                  >
                    ← Back to payment methods
                  </button>
                  <h3 className="text-lg font-semibold mb-4">Choose Provider</h3>
                  <div className="space-y-3">
                    {Object.entries(PROVIDERS)
                      .filter(([_, provider]) => provider.methods.includes(selectedMethod.id))
                      .map(([id, provider]) => (
                        <button
                          key={id}
                          onClick={() => handleProviderSelect(id)}
                          className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500/30 hover:bg-white/10 transition-all text-left flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-black font-bold text-xl">
                              {provider.logo}
                            </div>
                            <div>
                              <h4 className="font-semibold">{provider.name}</h4>
                              <p className="text-sm text-white/50">
                                ${provider.minAmount} - ${provider.maxAmount.toLocaleString()} limit
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-white/40" />
                        </button>
                      ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Amount */}
              {step === 3 && selectedProvider && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <button
                    onClick={() => setStep(2)}
                    className="text-sm text-cyan-400 hover:text-cyan-300 mb-4"
                  >
                    ← Back to providers
                  </button>
                  <h3 className="text-lg font-semibold mb-4">Enter Amount</h3>
                  
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
                        min={PROVIDERS[selectedProvider].minAmount}
                        max={PROVIDERS[selectedProvider].maxAmount}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-white/40">
                      <span>Min: ${PROVIDERS[selectedProvider].minAmount}</span>
                      <span>Max: ${PROVIDERS[selectedProvider].maxAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {[50, 100, 250, 500].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setAmount(preset.toString())}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-emerald-500/30 hover:bg-white/10 transition-all text-sm font-medium"
                      >
                        ${preset}
                      </button>
                    ))}
                  </div>

                  {amount && parseFloat(amount) >= 20 && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-white/60">You pay</span>
                        <span className="font-semibold">${parseFloat(amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white/60">Est. QVTX price</span>
                        <span className="font-semibold">$5.33</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white/60">Processing fee (~3%)</span>
                        <span className="text-amber-400">-${(parseFloat(amount) * 0.03).toFixed(2)}</span>
                      </div>
                      <div className="pt-2 border-t border-white/10 flex justify-between">
                        <span className="text-white/60">You receive</span>
                        <span className="text-xl font-bold text-emerald-400">
                          ~{((parseFloat(amount) * 0.97) / 5.33).toFixed(2)} QVTX
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handlePurchase}
                    disabled={!amount || parseFloat(amount) < 20}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continue to {PROVIDERS[selectedProvider].name}
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Payment Window Opened</h3>
                  <p className="text-white/60 mb-6">
                    Complete your payment in the provider window. QVTX tokens will be automatically sent to your wallet address <span className="font-mono text-cyan-400">{userAddress.slice(0,6)}...{userAddress.slice(-4)}</span> within 5-10 minutes after payment confirmation.
                  </p>
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-left text-sm mb-6">
                    <p className="text-white/80 mb-2">✓ Your wallet address has been sent to the provider</p>
                    <p className="text-white/80 mb-2">✓ QVTX will be transferred automatically after payment</p>
                    <p className="text-white/80">✓ Check your transaction history for confirmation</p>
                  </div>
                  <button
                    onClick={() => {
                      resetModal();
                      onClose();
                    }}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </div>

            {/* Info Footer */}
            {step < 4 && (
              <div className="p-4 bg-blue-500/5 border-t border-blue-500/10">
                <p className="text-xs text-blue-300/80 text-center">
                  🔒 Secure payment processing through trusted third-party providers. 
                  QVTX tokens will be sent to your connected wallet address after payment confirmation.
                </p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}