import React from "react";
import { motion } from "framer-motion";
import { FileText, ShieldCheck, AlertTriangle, Scale } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

const sections = [
  {
    icon: Scale,
    title: "1. Acceptance of Terms",
    body: "These Terms of Service (\"Terms\") govern your access to and use of the QVTX platform, website, APIs, and related services (the \"Services\") operated by Quantvestrix Inc. (\"QVTX\", \"we\", \"us\", \"our\"). By accessing or using the Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must not access or use the Services."
  },
  {
    icon: FileText,
    title: "2. Description of Services",
    body: "QVTX supplies blockchain-based financial infrastructure solutions for enterprise, government, and institutional clients, including staking and liquidity pools, payment rails, token launchpad services, blockchain monitoring tools, and related APIs. The Services are provided on the QVTX blockchain (Chain 20232) and the DNA Expression chain (Chain 42000)."
  },
  {
    icon: ShieldCheck,
    title: "3. Eligibility & KYC",
    body: "You must be at least 18 years old and legally capable of entering into binding contracts. Depending on the Services you use, you may be required to complete identity verification (KYC) and provide accurate, current information. You represent that your use of the Services complies with all applicable laws, including sanctions, anti-money laundering, and counter-terrorism financing regulations in your jurisdiction."
  },
  {
    icon: AlertTriangle,
    title: "4. Blockchain Transactions & Risk Disclosure",
    body: "Transactions recorded on a blockchain are irreversible. You are solely responsible for the accuracy of wallet addresses you submit and for the safekeeping of your private keys and credentials. Digital assets are highly volatile, and blockchain-based services carry inherent technical and operational risks. Nothing on the platform constitutes an offer to sell or a solicitation to buy any security. QVTX does not provide financial, investment, legal, or tax advice."
  },
  {
    icon: ShieldCheck,
    title: "5. Acceptable Use",
    body: "You agree not to: (a) use the Services for any unlawful purpose; (b) interfere with or disrupt the integrity or performance of the platform; (c) attempt to gain unauthorized access to any portion of the Services or other users' data; (d) scrape, reverse engineer, or resell the Services without written authorization; or (e) transmit malware or malicious code."
  },
  {
    icon: Scale,
    title: "6. Fees & Payment",
    body: "Certain Services may carry fees, including transaction fees, staking fees, and network fees, which will be disclosed before you complete a transaction. Third-party payment providers (such as fiat on-ramp providers) apply their own fees and terms. Fees paid for completed blockchain transactions are non-refundable."
  },
  {
    icon: ShieldCheck,
    title: "7. Intellectual Property",
    body: "All content, software, trademarks, patents, and materials on the platform — including the ByteID and Quaternary DNA technologies — are the property of Quantvestrix Inc. or its licensors. You receive no rights in the Services except the limited right to use them in accordance with these Terms."
  },
  {
    icon: Scale,
    title: "8. Disclaimer of Warranties",
    body: "THE SERVICES ARE PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, OR THAT BLOCKCHAIN NETWORKS MAINTAINED BY THIRD PARTIES WILL REMAIN OPERATIONAL."
  },
  {
    icon: AlertTriangle,
    title: "9. Limitation of Liability",
    body: "To the maximum extent permitted by law, Quantvestrix Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, digital assets, data, or business opportunities arising from your use of the Services. Our aggregate liability shall not exceed the greater of (a) the fees you paid to us in the twelve (12) months preceding the claim, or (b) one hundred U.S. dollars (USD $100)."
  },
  {
    icon: Scale,
    title: "10. Indemnification",
    body: "You agree to indemnify and hold harmless Quantvestrix Inc., its affiliates, and their respective officers, directors, and employees from any claims, liabilities, damages, and expenses arising out of your use of the Services, your violation of these Terms, or your violation of any applicable law or third-party right."
  },
  {
    icon: Scale,
    title: "11. Governing Law & Disputes",
    body: "These Terms are governed by the laws of the jurisdiction in which Quantvestrix Inc. is organized, without regard to conflict-of-law principles. Any dispute arising out of these Terms shall first be addressed through good-faith negotiation, and if unresolved, shall be resolved by binding arbitration or in the courts of that jurisdiction, as permitted by law."
  },
  {
    icon: FileText,
    title: "12. Changes to These Terms",
    body: "We may update these Terms from time to time. Material changes will be reflected by updating the \"Last updated\" date and, where appropriate, notifying registered users. Continued use of the Services after changes take effect constitutes acceptance of the updated Terms."
  }
];

export default function TermsOfService() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-medium mb-6" style={{ borderColor: "rgba(255,215,0,0.3)", color: "#ffd700", background: "rgba(255,215,0,0.06)" }}>
            <Scale className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-4xl sm:text-5xl font-orbitron font-black text-white mb-4">
            Terms of <span style={{ color: "#ffd700" }}>Service</span>
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto">
            The agreement governing your use of the QVTX platform and services, operated by Quantvestrix Inc.
          </p>
          <p className="text-xs text-white/30 mt-4">Last updated: September 28, 2026</p>
        </motion.div>

        <div className="space-y-5">
          {sections.map((s, i) => (
            <motion.section
              key={s.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="p-6 rounded-2xl border"
              style={{ background: "rgba(10,11,20,0.8)", borderColor: "rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(0,212,255,0.1)" }}>
                  <s.icon className="w-5 h-5" style={{ color: "#00d4ff" }} />
                </div>
                <div>
                  <h2 className="font-orbitron font-semibold text-white mb-2">{s.title}</h2>
                  <p className="text-sm text-white/55 leading-relaxed">{s.body}</p>
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-10 p-6 rounded-2xl border text-center"
          style={{ borderColor: "rgba(0,212,255,0.2)", background: "rgba(0,212,255,0.04)" }}
        >
          <p className="text-sm text-white/50">
            Questions about these Terms? Reach out through the Partnerships page or contact Quantvestrix Inc.
          </p>
        </motion.div>
      </div>
    </div>
  );
}