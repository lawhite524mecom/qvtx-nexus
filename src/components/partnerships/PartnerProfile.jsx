import React from "react";
import { Building2, User, Mail, Phone, Globe, Calendar, Award } from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function PartnerProfile({ partner }) {
  const infoItems = [
    { icon: User, label: "Contact Name", value: partner.contactName },
    { icon: Mail, label: "Email", value: partner.email },
    { icon: Phone, label: "Phone", value: partner.phone || "Not provided" },
    { icon: Globe, label: "Website", value: partner.website || "Not provided" },
    { icon: Calendar, label: "Joined", value: new Date(partner.created_date).toLocaleDateString() },
    { icon: Award, label: "Tier", value: partner.tier ? partner.tier.charAt(0).toUpperCase() + partner.tier.slice(1) : "Standard" }
  ];

  return (
    <GlassCard>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-amber-400" />
        Partnership Profile
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {infoItems.map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/40 mb-1">{item.label}</p>
              <p className="font-medium truncate">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {partner.description && (
        <div className="mt-6 pt-6 border-t border-white/5">
          <p className="text-sm text-white/40 mb-2">Partnership Description</p>
          <p className="text-white/80 leading-relaxed">{partner.description}</p>
        </div>
      )}

      {partner.investmentAmount && (
        <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <p className="text-sm text-emerald-400 font-medium mb-1">Investment Amount</p>
          <p className="text-2xl font-bold text-emerald-400">{partner.investmentAmount}</p>
        </div>
      )}
    </GlassCard>
  );
}