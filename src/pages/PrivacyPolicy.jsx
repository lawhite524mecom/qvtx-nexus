import React from "react";
import { motion } from "framer-motion";
import { Lock, Database, Eye, Share2, Cookie, UserCheck } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

const sections = [
  {
    icon: Eye,
    title: "1. Information We Collect",
    body: "We collect the following categories of information: (a) Account information — your name, email address, and role when you register; (b) Identity verification (KYC) information — full name, country, document type and number, and document images, when required for regulated services; (c) Blockchain information — public wallet addresses you connect and on-chain transaction data; (d) Service usage data — pages you view, features you use, and interactions with the platform; (e) Device and technical data — IP address, browser type, and device identifiers."
  },
  {
    icon: Database,
    title: "2. How We Use Your Information",
    body: "We use your information to: provide, operate, and secure the Services; verify your identity and comply with KYC/AML and sanctions obligations; process transactions and record them to the blockchain; personalize and improve the platform; detect, prevent, and address fraud, abuse, and security incidents; and communicate with you about your account, service changes, and legal requirements."
  },
  {
    icon: Share2,
    title: "3. How We Share Your Information",
    body: "We do not sell your personal information. We share information only with: (a) service providers that help us operate the platform (e.g., payment and identity verification providers), bound by confidentiality obligations; (b) blockchain networks — where transaction data is public and immutable by design; (c) regulators, law enforcement, or other authorities where required by law or legal process; and (d) a successor entity in connection with a merger or acquisition, under equivalent privacy protections."
  },
  {
    icon: Lock,
    title: "4. Data Storage & Security",
    body: "We store personal information on secured infrastructure with access controls, encryption in transit, and row-level isolation of user records. Sensitive documents uploaded for verification are stored privately and are not publicly accessible. However, no system is perfectly secure, and data you record to a public blockchain is immutable and cannot be deleted by us. You are responsible for protecting your own wallet credentials and private keys, which we never collect or store."
  },
  {
    icon: Cookie,
    title: "5. Cookies & Analytics",
    body: "We use essential cookies to operate the platform and keep you signed in, and analytics tools to understand aggregate usage and improve the Services. You can control or disable non-essential cookies through your browser settings; essential cookies cannot be disabled without breaking core functionality."
  },
  {
    icon: UserCheck,
    title: "6. Your Rights & Choices",
    body: "Depending on your jurisdiction, you may have rights to access, correct, export, or delete your personal information, and to object to or restrict certain processing. To exercise these rights, contact us through the platform. Note that we cannot modify or delete data recorded on a public blockchain, and certain KYC records must be retained for legally mandated periods."
  },
  {
    icon: Cookie,
    title: "7. Data Retention",
    body: "We retain account information while your account is active. KYC and transaction records are retained as required by applicable financial regulations. Other service usage data is retained only as long as needed for the purposes described in this policy, then deleted or anonymized."
  },
  {
    icon: UserCheck,
    title: "8. Children's Privacy",
    body: "The Services are not directed at children under 18, and we do not knowingly collect personal information from children. If you believe a child has provided us information, contact us and we will delete it."
  },
  {
    icon: Eye,
    title: "9. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Material changes will be reflected by updating the \"Last updated\" date and, where appropriate, notifying registered users. Continued use of the Services after changes take effect constitutes acknowledgment of the updated policy."
  }
];

export default function PrivacyPolicy() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-medium mb-6" style={{ borderColor: "rgba(0,212,255,0.3)", color: "#00d4ff", background: "rgba(0,212,255,0.06)" }}>
            <Lock className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-4xl sm:text-5xl font-orbitron font-black text-white mb-4">
            Privacy <span style={{ color: "#00d4ff" }}>Policy</span>
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto">
            How Quantvestrix Inc. collects, uses, protects, and shares your information on the QVTX platform.
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
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(255,215,0,0.1)" }}>
                  <s.icon className="w-5 h-5" style={{ color: "#ffd700" }} />
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
          style={{ borderColor: "rgba(255,215,0,0.2)", background: "rgba(255,215,0,0.04)" }}
        >
          <p className="text-sm text-white/50">
            Privacy questions or requests? Reach out through the Partnerships page or contact Quantvestrix Inc.
          </p>
        </motion.div>
      </div>
    </div>
  );
}