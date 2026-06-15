import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Disclosures() {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    // Save acceptance on user record and redirect to wallet/dashboard
    try {
      await base44.auth.updateMe({ disclosures_accepted: true, disclosures_accepted_at: new Date().toISOString() });
    } catch (e) {
      // non-blocking
    }
    window.location.href = "/Wallet";
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.25)" }}>
              <FileText className="w-8 h-8" style={{ color: "#ffd700" }} />
            </div>
            <h1 className="text-3xl font-orbitron font-bold text-white mb-3">Important Disclosures</h1>
            <p className="text-white/50 text-sm">Please read and acknowledge the following before using QVTX platform services.</p>
          </div>

          {/* Disclosure sections */}
          <div className="space-y-5">
            {[
              {
                icon: AlertTriangle,
                title: "Investment Risk Disclosure",
                color: "#ffd700",
                body: "Digital assets and blockchain-based financial products involve substantial risk of loss. Past performance is not indicative of future results. The value of cryptocurrencies and tokenized assets can be highly volatile. You may lose some or all of your invested capital. QVTX does not guarantee returns on any investment product."
              },
              {
                icon: ShieldCheck,
                title: "Regulatory Compliance",
                color: "#00d4ff",
                body: "QVTX operates in compliance with applicable federal and state regulations. KYC (Know Your Customer) and AML (Anti-Money Laundering) verification is required for full platform access. By registering, you consent to identity verification procedures. QVTX reserves the right to restrict services to jurisdictions where regulations prohibit such activities."
              },
              {
                icon: FileText,
                title: "ByteID & Data Usage",
                color: "#ffd700",
                body: "By using QVTX services, your transaction data will be encoded and permanently recorded on the QVTX DNA blockchain using ByteID technology. This creates an immutable, publicly verifiable audit trail. ByteID-stamped records cannot be deleted or modified. Your wallet address and transaction metadata will be stored on-chain."
              },
              {
                icon: ShieldCheck,
                title: "ISO 20022 & Institutional Services",
                color: "#00d4ff",
                body: "QVTX's ISO 20022 messaging services are designed for institutional use. Financial messages transmitted through our infrastructure are subject to financial regulatory oversight. Institutional onboarding requires additional KYB (Know Your Business) verification and may be subject to enhanced due diligence."
              },
              {
                icon: AlertTriangle,
                title: "No Financial Advice",
                color: "#ffd700",
                body: "Nothing on the QVTX platform constitutes financial, investment, legal, or tax advice. Robo-advisory and wealth planning tools are provided for informational purposes only. You should consult with a qualified financial advisor before making investment decisions. QVTX is not a registered investment advisor under applicable law."
              },
              {
                icon: FileText,
                title: "Terms of Service & Privacy",
                color: "#00d4ff",
                body: "Your use of QVTX is governed by our Terms of Service and Privacy Policy. We collect and process data as described in our Privacy Policy. By proceeding, you agree to our Terms of Service, Privacy Policy, and these Disclosures. Quantvestrix Inc. reserves the right to modify these terms with reasonable notice."
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="p-5 rounded-2xl border"
                style={{ background: "rgba(10,11,20,0.7)", borderColor: `${item.color}20` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: `${item.color}12` }}>
                    <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div>
                    <h3 className="font-orbitron font-semibold text-white text-sm mb-2">{item.title}</h3>
                    <p className="text-xs text-white/45 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Acceptance */}
          <div className="mt-8 p-6 rounded-2xl border" style={{ borderColor: "rgba(255,215,0,0.2)", background: "rgba(255,215,0,0.04)" }}>
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={() => setAccepted(!accepted)}
                className="w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center border-2 transition-all cursor-pointer"
                style={{ borderColor: accepted ? "#ffd700" : "rgba(255,255,255,0.3)", background: accepted ? "#ffd700" : "transparent" }}
              >
                {accepted && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
              </div>
              <span className="text-sm text-white/70 leading-relaxed">
                I have read and understood all disclosures above. I acknowledge the risks associated with digital assets
                and agree to the Terms of Service, Privacy Policy, and QVTX platform disclosures.
                I confirm I am of legal age to use financial services in my jurisdiction.
              </span>
            </label>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleAccept}
              disabled={!accepted || loading}
              className="flex-1 py-4 rounded-xl font-orbitron font-bold text-black transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
              style={{ background: accepted ? "linear-gradient(135deg, #00d4ff, #ffd700)" : "rgba(255,255,255,0.1)" }}
            >
              {loading ? "Processing..." : "Accept & Continue"}
            </button>
          </div>

          <p className="text-center text-xs text-white/25 mt-4">Quantvestrix Inc. · Louis A. White III, Founder &amp; CEO</p>
        </motion.div>
      </div>
    </div>
  );
}