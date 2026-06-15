import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  Building2,
  MessageSquare,
  Code,
  Calendar,
  TrendingUp,
  Shield,
  Loader
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import PartnerProfile from "../components/partnerships/PartnerProfile";
import PartnerMetrics from "../components/partnerships/PartnerMetrics";
import PartnerBotChat from "../components/partnerships/PartnerBotChat";
import PartnerAPIGuide from "../components/partnerships/PartnerAPIGuide";

export default function PartnerDashboard() {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadPartnerData();
  }, []);

  const loadPartnerData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      // Find partner record for this user's email
      const partners = await base44.entities.Partners.filter({
        email: currentUser.email
      });

      if (partners.length > 0) {
        setPartner(partners[0]);
      }
    } catch (error) {
      console.error("Error loading partner data:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "bot", label: "AI Assistant", icon: MessageSquare },
    { id: "api", label: "API Docs", icon: Code },
    { id: "meetings", label: "Schedule Meeting", icon: Calendar }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-amber-400" />
          <h1 className="text-2xl font-bold mb-4">No Partner Profile Found</h1>
          <p className="text-white/60 mb-6">
            You don't have access to the partner dashboard. Please contact partnerships@qvtx.io for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                {partner.companyName}
              </h1>
              <p className="text-white/50">Partner Dashboard</p>
            </div>
          </div>
        </motion.div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 mb-8">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            partner.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
            partner.status === 'approved' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
            partner.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
            'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}>
            {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)} Partnership
          </span>
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-violet-500/20 text-violet-400 border border-violet-500/30">
            {partner.partnershipType.charAt(0).toUpperCase() + partner.partnershipType.slice(1)}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <PartnerProfile partner={partner} onUpdate={loadPartnerData} />
              <PartnerMetrics partner={partner} />
            </motion.div>
          )}

          {activeTab === "bot" && partner.assignedBotId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PartnerBotChat conversationId={partner.assignedBotId} partnerName={partner.companyName} />
            </motion.div>
          )}

          {activeTab === "api" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PartnerAPIGuide partner={partner} />
            </motion.div>
          )}

          {activeTab === "meetings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard>
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                  <h3 className="text-2xl font-bold mb-4">Schedule a Meeting</h3>
                  <p className="text-white/60 mb-6 max-w-md mx-auto">
                    Book time with your dedicated QVTX account manager to discuss your partnership goals and integration progress.
                  </p>
                  <a
                    href="https://calendly.com/qvtx-partnerships"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                  >
                    Open Calendar
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}