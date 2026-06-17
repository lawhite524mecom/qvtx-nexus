import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Building2,
  TrendingUp,
  CreditCard,
  Landmark,
  ShieldCheck,
  Globe,
  BarChart3,
  BadgeCheck,
  Dna,
  Fingerprint,
  Zap,
  Lock,
  Users,
  Activity,
  Layers,
  Cpu,
  Star } from
"lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };

const services = [
{
  icon: Building2,
  title: "Digital Banking",
  badge: "API Ready",
  desc: "Full-service digital banking with real-time ByteID verification on every transaction.",
  features: ["Checking & Savings", "Instant Transfers", "Multi-Currency Support"],
  color: "#00d4ff"
},
{
  icon: TrendingUp,
  title: "Investment Management",
  badge: null,
  desc: "Managed portfolios and self-directed trading with quaternary-stamped audit trails.",
  features: ["Robo-Advisory", "Custom Portfolios", "Tax-Loss Harvesting"],
  color: "#ffd700"
},
{
  icon: CreditCard,
  title: "Payment Processing",
  badge: "API Ready",
  desc: "Enterprise payment APIs with sub-second settlement and full ByteID traceability.",
  features: ["ACH & Wire", "Card Processing", "Real-Time Settlements"],
  color: "#00d4ff"
},
{
  icon: Landmark,
  title: "Commercial Lending",
  badge: null,
  desc: "Business credit facilities from lines of credit to term loans, all ByteID verified.",
  features: ["Lines of Credit", "Equipment Financing", "SBA Programs"],
  color: "#ffd700"
},
{
  icon: Star,
  title: "Wealth Planning",
  badge: null,
  desc: "Comprehensive wealth advisory with estate planning and trust administration.",
  features: ["Estate Planning", "Trust Services", "Retirement Strategy"],
  color: "#00d4ff"
},
{
  icon: BarChart3,
  title: "Treasury Management",
  badge: null,
  desc: "Corporate treasury services with liquidity optimization and cash management.",
  features: ["Cash Pooling", "FX Hedging", "Liquidity Analytics"],
  color: "#ffd700"
},
{
  icon: Globe,
  title: "International Services",
  badge: "API Ready",
  desc: "Cross-border transactions and foreign exchange with verified settlement chains.",
  features: ["FX Conversion", "Trade Finance", "Cross-Border Payments"],
  color: "#00d4ff"
},
{
  icon: ShieldCheck,
  title: "Compliance & Risk",
  badge: "API Ready",
  desc: "Regulatory compliance toolkit with automated KYC/AML powered by ByteID substrate.",
  features: ["KYC Automation", "AML Monitoring", "Regulatory Reporting"],
  color: "#ffd700"
}];


const infraItems = [
{ icon: Zap, title: "QVTXpress Pay", desc: "Sub-second payment rails with ByteID-stamped receipts on every transaction.", color: "#00d4ff" },
{ icon: CreditCard, title: "Pay My Debt", desc: "Automated debt management service — schedule, verify, and close positions on-chain.", color: "#ffd700" },
{ icon: Activity, title: "Staking & Liquidity Pools", desc: "Earn yield across multiple pools with full on-chain provenance.", color: "#00d4ff" },
{ icon: Layers, title: "ISO 20022 Messaging", desc: "Interoperable financial messaging standard natively supported for institutional flows.", color: "#ffd700" },
{ icon: Users, title: "Institutional Onboarding", desc: "Streamlined KYB, KYC, and AML — ByteID verified at every step.", color: "#00d4ff" },
{ icon: BadgeCheck, title: "Source-Verified Positions", desc: "Every position independently valued, source-verified, and ByteID-stamped from day one.", color: "#ffd700" }];


const blockchainStats = [
{ label: "Chain 20232 — DNA Mainnet", value: "GitHub Chainlist", sub: "Registered", icon: Layers, color: "#00d4ff" },
{ label: "Chain 42000 — DNA Expression", value: "464M+", sub: "Codons Executed", icon: Dna, color: "#ffd700" },
{ label: "DNA Compression", value: "40:1", sub: "Compression Ratio", icon: Cpu, color: "#00d4ff" },
{ label: "Error Rate", value: "0.00%", sub: "Verified", icon: BadgeCheck, color: "#ffd700" },
{ label: "Frequency Lock", value: "8825 Hz", sub: "Resonance", icon: Activity, color: "#00d4ff" },
{ label: "Patent Portfolio", value: "31 Patents", sub: "$12.25B Valuation", icon: Lock, color: "#ffd700" }];


export default function Home() {
  return (
    <div className="relative overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-28 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00d4ff]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#ffd700]/4 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-medium" style={{ borderColor: "rgba(0,212,255,0.3)", color: "#00d4ff", background: "rgba(0,212,255,0.06)" }}>
              <Fingerprint className="w-4 h-4" />
              Powered by Quaternary ByteID DNA Substrate
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.08 }}
            className="text-5xl sm:text-6xl md:text-7xl font-orbitron font-black leading-tight mb-6">
            
            <span className="text-white">Financial Infrastructure</span>
            <br />
            <span style={{ color: "#ffd700" }} className="dna-glow-gold">Powered by DNA</span>
            <br />
            <span style={{ color: "#00d4ff" }} className="dna-glow-cyan">Blockchain</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.14 }}
            className="text-xl sm:text-2xl font-light text-white/70 mb-4 italic">
            
            "Whatever form your assets are in, we mobilize them."
          </motion.p>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.18 }}
            className="text-base sm:text-lg text-white/50 max-w-3xl mx-auto mb-12 leading-relaxed">
            
            QVTX delivers end-to-end financial infrastructure — staking & liquidity pools, QvtXpress payment rails,
            ISO 20022 messaging, and institutional onboarding — every position independently valued, source-verified,
            and ByteID-stamped on-chain from day one.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.24 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={createPageUrl("Wallet")}
              className="group px-8 py-4 font-orbitron font-bold rounded-xl text-black flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              style={{ background: "linear-gradient(135deg, #00d4ff, #ffd700)" }}>
              
              Launch Platform
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={createPageUrl("Partnerships")}
              className="px-8 py-4 font-semibold rounded-xl border text-white flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
              style={{ borderColor: "rgba(255,215,0,0.3)" }}>
              
              Institutional Inquiry
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── LIVE METRICS BAR ─────────────────────────────────── */}
      <section className="border-y py-6 px-4 sm:px-6 lg:px-8" style={{ borderColor: "rgba(255,215,0,0.1)", background: "rgba(0,0,0,0.3)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {[
            { label: "Total TVL", value: "$1.6T" },
            { label: "24H Volume", value: "$234.5M" },
            { label: "QVTX Price", value: "$5.33" },
            { label: "Holders", value: "45,892" },
            { label: "Staking APY", value: "18.5%" },
            { label: "Chains Active", value: "6" }].
            map(({ label, value }) =>
            <div key={label}>
                <p className="font-orbitron font-bold text-xl" style={{ color: "#ffd700" }}>{value}</p>
                <p className="text-xs text-white/40 mt-1">{label}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs font-orbitron uppercase tracking-widest mb-3" style={{ color: "#ffd700" }}>Financial Services</p>
            <h2 className="text-3xl sm:text-4xl font-orbitron font-bold text-white mb-4">
              Every Service. <span style={{ color: "#00d4ff" }}>ByteID Verified.</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">A complete financial services infrastructure stack. Where every transaction is stamped with a ByteID on our Quaternary DNA blockchain — creating an immutable, source-verified audit trail.

            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((svc, i) =>
            <motion.div
              key={svc.title}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group relative rounded-2xl p-6 border cursor-default hover:-translate-y-1 transition-all duration-300"
              style={{ background: "rgba(10,11,20,0.8)", borderColor: `${svc.color}22` }}>
              
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at top left, ${svc.color}08, transparent 60%)` }} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${svc.color}15` }}>
                      <svc.icon className="w-5 h-5" style={{ color: svc.color }} />
                    </div>
                    {svc.badge &&
                  <span className="text-xs font-orbitron font-bold px-2 py-0.5 rounded-full" style={{ color: "#00d4ff", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)" }}>
                        {svc.badge}
                      </span>
                  }
                  </div>
                  <h3 className="font-orbitron font-semibold text-white mb-2">{svc.title}</h3>
                  <p className="text-xs text-white/45 mb-4 leading-relaxed">{svc.desc}</p>
                  <ul className="space-y-1.5">
                    {svc.features.map((f) =>
                  <li key={f} className="flex items-center gap-2 text-xs text-white/60">
                        <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: svc.color }} />
                        {f}
                      </li>
                  )}
                  </ul>
                  <div className="mt-4 pt-4 border-t flex items-center gap-1.5 text-xs font-medium" style={{ borderColor: `${svc.color}15`, color: svc.color }}>
                    <Fingerprint className="w-3 h-3" />
                    ByteID Verified
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ── FINANCIAL INFRASTRUCTURE ────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24" style={{ background: "linear-gradient(180deg, transparent, rgba(255,215,0,0.03), transparent)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs font-orbitron uppercase tracking-widest mb-3" style={{ color: "#00d4ff" }}>Infrastructure Layer</p>
            <h2 className="text-3xl sm:text-4xl font-orbitron font-bold text-white mb-4">
              QVTX <span style={{ color: "#ffd700" }}>Financial Rails</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              End-to-end infrastructure connecting traditional finance to blockchain-native settlement.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {infraItems.map((item, i) =>
            <motion.div
              key={item.title}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="flex gap-4 p-6 rounded-2xl border hover:border-opacity-60 transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "rgba(10,11,20,0.6)", borderColor: `${item.color}20` }}>
              
                <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: `${item.color}12` }}>
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <div>
                  <h3 className="font-orbitron font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-white/45 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* ByteID callout strip */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="mt-10 p-6 rounded-2xl border text-center"
            style={{ borderColor: "rgba(0,212,255,0.2)", background: "rgba(0,212,255,0.04)" }}>
            
            <Fingerprint className="w-8 h-8 mx-auto mb-3" style={{ color: "#00d4ff" }} />
            <p className="font-orbitron font-bold text-white mb-1">Every Position. ByteID-Stamped.</p>
            <p className="text-sm text-white/40 max-w-xl mx-auto">
              Every position is independently valued, source-verified, and ByteID-stamped on-chain from day one —
              giving institutions an unbreakable audit trail powered by quaternary DNA encoding.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── BLOCKCHAIN TECHNOLOGY ───────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 border-t" style={{ borderColor: "rgba(255,215,0,0.08)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <p className="text-xs font-orbitron uppercase tracking-widest mb-3" style={{ color: "#ffd700" }}>Blockchain Technology</p>
              <h2 className="text-3xl sm:text-4xl font-orbitron font-bold text-white mb-6">
                DNA Blockchain.<br />
                <span style={{ color: "#00d4ff" }}>Quaternary Foundation.</span>
              </h2>
              <p className="text-white/50 mb-8 leading-relaxed">
                QVTX operates two production chains with 31 patents underpinning the entire stack. Every byte of data is
                compressed 40:1 into DNA codons, content-addressed via ByteID, and locked to an 8825 Hz resonance frequency
                — creating provably unique, tamper-evident records at industrial scale.
              </p>

              {/* Chain pills */}
              <div className="space-y-3 mb-8">
                <Link to="/chain/20232" className="flex items-center justify-between p-4 rounded-xl border hover:-translate-y-0.5 transition-all" style={{ borderColor: "rgba(0,212,255,0.25)", background: "rgba(0,212,255,0.04)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-orbitron font-black text-sm text-black" style={{ background: "linear-gradient(135deg,#00d4ff,#0090aa)" }}>Q</div>
                    <div>
                      <p className="font-orbitron font-bold text-white text-sm">Chain 20232 · DNA Mainnet</p>
                      <p className="text-xs text-white/40">Registered on GitHub Chainlist</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4" style={{ color: "#00d4ff" }} />
                </Link>
                <Link to="/chain/42000" className="flex items-center justify-between p-4 rounded-xl border hover:-translate-y-0.5 transition-all" style={{ borderColor: "rgba(255,215,0,0.25)", background: "rgba(255,215,0,0.04)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-orbitron font-black text-sm text-black" style={{ background: "linear-gradient(135deg,#ffd700,#b8960a)" }}>D</div>
                    <div>
                      <p className="font-orbitron font-bold text-white text-sm">Chain 42000 · DNA Expression</p>
                      <p className="text-xs text-white/40">464M+ codons executed</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4" style={{ color: "#ffd700" }} />
                </Link>
              </div>

              <div className="flex gap-3">
                <Link to={createPageUrl("ByteID")} className="px-5 py-2.5 rounded-xl font-orbitron font-bold text-sm text-black hover:shadow-lg transition-all" style={{ background: "linear-gradient(135deg,#00d4ff,#ffd700)" }}>
                  Derive ByteID
                </Link>
                <Link to={createPageUrl("DNACompress")} className="px-5 py-2.5 rounded-xl font-semibold text-sm border hover:bg-white/5 transition-all" style={{ borderColor: "rgba(255,215,0,0.3)", color: "#ffd700" }}>
                  DNA Compression
                </Link>
              </div>
            </motion.div>

            {/* Right: stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {blockchainStats.map((stat, i) =>
              <motion.div
                key={stat.label}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl border"
                style={{ background: "rgba(10,11,20,0.8)", borderColor: `${stat.color}20` }}>
                
                  <stat.icon className="w-5 h-5 mb-3" style={{ color: stat.color }} />
                  <p className="font-orbitron font-black text-2xl mb-0.5" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs text-white/30">{stat.sub}</p>
                  <p className="text-xs text-white/20 mt-1">{stat.label}</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="relative rounded-3xl p-10 sm:p-16 text-center overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(255,215,0,0.06))", border: "1px solid rgba(255,215,0,0.2)" }}>
            
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,215,0,0.4) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
            <div className="relative z-10">
              <Dna className="w-12 h-12 mx-auto mb-6" style={{ color: "#ffd700" }} />
              <h2 className="text-3xl sm:text-4xl font-orbitron font-black text-white mb-4">
                Ready to Build on<br /><span style={{ color: "#ffd700" }}>DNA Infrastructure?</span>
              </h2>
              <p className="text-white/50 mb-10 max-w-xl mx-auto">
                Whether you're an institution, fintech, or developer — QVTX provides the rails, the compliance, and the blockchain substrate to power your next-generation financial product.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={createPageUrl("Wallet")}
                  className="group px-8 py-4 font-orbitron font-bold rounded-xl text-black flex items-center justify-center gap-2 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  style={{ background: "linear-gradient(135deg, #00d4ff, #ffd700)" }}>
                  
                  Launch Platform
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to={createPageUrl("Partnerships")}
                  className="px-8 py-4 font-semibold rounded-xl border text-white flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
                  style={{ borderColor: "rgba(0,212,255,0.3)" }}>
                  
                  Partner With Us
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOUNDER STRIP ────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl border" style={{ borderColor: "rgba(255,215,0,0.15)", background: "rgba(255,215,0,0.03)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-orbitron font-black text-black" style={{ background: "linear-gradient(135deg,#ffd700,#00d4ff)" }}>Q</div>
            <div className="text-left">
              <p className="font-orbitron font-bold text-white text-sm">Quantvestrix Inc.</p>
              <p className="text-xs text-white/40">Louis A. White III — Founder &amp; CEO</p>
            </div>
          </div>
        </div>
      </section>

    </div>);

}