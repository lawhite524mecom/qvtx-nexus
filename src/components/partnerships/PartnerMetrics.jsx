import React from "react";
import { TrendingUp, Target, CheckCircle, Clock } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import StatCard from "../ui/StatCard";

export default function PartnerMetrics({ partner }) {
  const milestones = [
    {
      id: 1,
      title: "Partnership Agreement",
      status: partner.status === 'active' || partner.status === 'approved' ? "completed" : "pending",
      date: new Date(partner.created_date).toLocaleDateString(),
      description: "Initial partnership agreement signed"
    },
    {
      id: 2,
      title: "Technical Onboarding",
      status: partner.onboardingCompleted ? "completed" : "in_progress",
      date: partner.onboardingCompleted ? "Completed" : "In Progress",
      description: "API access, documentation review, and technical setup"
    },
    {
      id: 3,
      title: "Integration Testing",
      status: partner.onboardingCompleted ? "in_progress" : "pending",
      date: "Upcoming",
      description: "Test environment setup and integration validation"
    },
    {
      id: 4,
      title: "Production Launch",
      status: "pending",
      date: "TBD",
      description: "Go-live with QVTX integration"
    }
  ];

  const completedMilestones = milestones.filter(m => m.status === "completed").length;
  const progress = (completedMilestones / milestones.length) * 100;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Partnership Status"
          value={partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
          icon={TrendingUp}
          accentColor="emerald"
          gradient="from-emerald-500/10 to-emerald-500/5"
        />
        <StatCard
          title="Progress"
          value={`${Math.round(progress)}%`}
          icon={Target}
          accentColor="cyan"
          gradient="from-cyan-500/10 to-cyan-500/5"
        />
        <StatCard
          title="Milestones"
          value={`${completedMilestones}/${milestones.length}`}
          icon={CheckCircle}
          accentColor="violet"
          gradient="from-violet-500/10 to-violet-500/5"
        />
        <StatCard
          title="Days Active"
          value={Math.floor((Date.now() - new Date(partner.created_date).getTime()) / (1000 * 60 * 60 * 24))}
          icon={Clock}
          accentColor="amber"
          gradient="from-amber-500/10 to-amber-500/5"
        />
      </div>

      {/* Milestones */}
      <GlassCard>
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" />
          Partnership Milestones
        </h3>

        <div className="relative">
          {/* Progress Bar */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10" />
          <div 
            className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-emerald-500 to-cyan-500 transition-all duration-500"
            style={{ height: `${progress}%` }}
          />

          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="relative pl-16">
                <div className={`absolute left-3 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  milestone.status === 'completed' 
                    ? 'bg-emerald-500 border-emerald-500' 
                    : milestone.status === 'in_progress'
                    ? 'bg-cyan-500 border-cyan-500 animate-pulse'
                    : 'bg-white/5 border-white/20'
                }`}>
                  {milestone.status === 'completed' && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                  {milestone.status === 'in_progress' && (
                    <Clock className="w-4 h-4 text-white" />
                  )}
                </div>

                <div className={`p-4 rounded-xl border transition-all ${
                  milestone.status === 'completed'
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : milestone.status === 'in_progress'
                    ? 'bg-cyan-500/5 border-cyan-500/20'
                    : 'bg-white/5 border-white/10'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{milestone.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      milestone.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      milestone.status === 'in_progress' ? 'bg-cyan-500/20 text-cyan-400' :
                      'bg-white/10 text-white/60'
                    }`}>
                      {milestone.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-white/60 mb-2">{milestone.description}</p>
                  <p className="text-xs text-white/40">{milestone.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}