import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Handshake,
  Building2,
  Globe,
  DollarSign,
  Users,
  Zap,
  Shield,
  Award,
  ExternalLink
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import StatCard from "../components/ui/StatCard";
import PartnerSignupModal from "../components/partnerships/PartnerSignupModal";

export default function Partnerships() {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSignupSuccess = (partner, conversation) => {
    setSignupSuccess(true);
    setTimeout(() => {
      setShowSignupModal(false);
      setSignupSuccess(false);
      // Could redirect to a partner dashboard or show confirmation
    }, 3000);
  };

  const partnerships = [
    {
      name: "Cherokee Nation",
      type: "Strategic Investment",
      amount: "$10M",
      status: "Active",
      description: "Major investment partnership focused on expanding QVTX infrastructure and community development.",
      date: "2024",
      icon: Building2,
      gradient: "from-amber-500 to-orange-500"
    },
    {
      name: "Connected Nation",
      type: "Deployment Partnership",
      amount: "$8M",
      status: "Active",
      description: "Network deployment and expansion partnership bringing QVTX technology to underserved communities.",
      date: "2024",
      icon: Globe,
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      name: "Maven Group",
      type: "Enterprise Integration",
      amount: "Phase 1",
      status: "In Progress",
      description: "LOC (Letter of Credit) enterprise integration for large-scale business adoption.",
      date: "2024-2025",
      icon: Building2,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      name: "Cachengo Technology",
      type: "Technology Partnership",
      amount: "$3M",
      status: "Active",
      description: "Advanced caching and edge computing integration for enhanced network performance.",
      date: "2024",
      icon: Zap,
      gradient: "from-violet-500 to-purple-500"
    },
    {
      name: "Quantum Mesh Consortium",
      type: "Technology Alliance",
      amount: "Strategic",
      status: "Active",
      description: "Collaboration on quantum mesh networking standards and DNA blockchain technology.",
      date: "2024-2025",
      icon: Shield,
      gradient: "from-cyan-500 to-blue-500"
    }
  ];

  const integrations = [
    {
      name: "Airtable",
      type: "Database Management",
      description: "Real-time blockchain data synchronization and asset management.",
      icon: "A",
      color: "from-rose-500 to-pink-500"
    },
    {
      name: "GitHub",
      type: "Development Platform",
      description: "Automated deployment and version control integration.",
      icon: "G",
      color: "from-slate-500 to-gray-500"
    },
    {
      name: "Claude AI",
      type: "AI Platform",
      description: "Advanced AI-powered system management and automation.",
      icon: "C",
      color: "from-amber-500 to-orange-500"
    },
    {
      name: "WHM/cPanel",
      type: "Server Management",
      description: "Comprehensive server and domain management integration.",
      icon: "W",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  const totalInvestment = "$29M+";

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-6"
          >
            <Handshake className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-400 font-medium">Strategic Partnerships</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              QVTX Partnerships
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            Building the future of blockchain infrastructure through strategic collaborations
          </motion.p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatCard
            title="Total Investment"
            value={totalInvestment}
            icon={DollarSign}
            accentColor="emerald"
            gradient="from-emerald-500/10 to-emerald-500/5"
          />
          <StatCard
            title="Active Partnerships"
            value="5"
            icon={Handshake}
            accentColor="amber"
            gradient="from-amber-500/10 to-amber-500/5"
          />
          <StatCard
            title="Enterprise Clients"
            value="3"
            icon={Building2}
            accentColor="blue"
            gradient="from-blue-500/10 to-blue-500/5"
          />
          <StatCard
            title="Tech Integrations"
            value="4"
            icon={Zap}
            accentColor="violet"
            gradient="from-violet-500/10 to-violet-500/5"
          />
        </div>

        {/* Major Partnerships */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Major Strategic Partnerships</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {partnerships.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${partner.gradient} flex items-center justify-center`}>
                      <partner.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        partner.status === "Active" 
                          ? "bg-emerald-500/20 text-emerald-400" 
                          : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {partner.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-white/40">{partner.type}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-sm font-semibold text-emerald-400">{partner.amount}</span>
                  </div>

                  <p className="text-sm text-white/60 mb-4">{partner.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-white/40">{partner.date}</span>
                    <a
                      href={
                        partner.name === "Cherokee Nation" ? "https://www.cherokee.org/" :
                        partner.name === "Connected Nation" ? "https://connectednation.org/" :
                        partner.name === "Maven Group" ? "https://mavengroup.com/" :
                        partner.name === "Cachengo Technology" ? "https://cachengo.com/" :
                        "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      Learn More
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technology Integrations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Technology Integrations</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="text-center h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${integration.color} flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4`}>
                    {integration.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{integration.name}</h3>
                  <p className="text-xs text-white/40 mb-3">{integration.type}</p>
                  <p className="text-sm text-white/60">{integration.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Partnership Benefits */}
        <GlassCard className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20">
          <div className="text-center max-w-3xl mx-auto">
            <Award className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Partnership Opportunities</h2>
            <p className="text-white/60 mb-6">
              QVTX is actively seeking strategic partnerships to expand our ecosystem and bring blockchain 
              technology to new markets. Join us in building the future of decentralized finance.
            </p>
            <button
              onClick={() => setShowSignupModal(true)}
              className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all"
            >
              Become a Partner
            </button>
          </div>
        </GlassCard>

        {/* Partner Signup Modal */}
        <PartnerSignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          onSuccess={handleSignupSuccess}
        />
      </div>
    </div>
  );
}