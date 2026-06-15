import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Clock,
  Bell,
  Save,
  AlertCircle,
  TrendingUp,
  X
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function TransactionLimits({ isOpen, onClose, userAddress }) {
  const [limits, setLimits] = useState({
    dailyLimit: "1000",
    weeklyLimit: "5000",
    perTransactionLimit: "500",
    alertThreshold: "80"
  });

  const [alerts, setAlerts] = useState({
    emailAlerts: true,
    browserNotifications: true,
    largeTransactions: true,
    dailyDigest: false
  });

  const [saved, setSaved] = useState(false);
  const [spending, setSpending] = useState({
    today: 0,
    thisWeek: 0
  });

  useEffect(() => {
    // Load saved limits from localStorage
    const savedLimits = localStorage.getItem(`limits_${userAddress}`);
    if (savedLimits) {
      setLimits(JSON.parse(savedLimits));
    }

    const savedAlerts = localStorage.getItem(`alerts_${userAddress}`);
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }

    // Load spending data (simulated)
    const savedSpending = localStorage.getItem(`spending_${userAddress}`);
    if (savedSpending) {
      setSpending(JSON.parse(savedSpending));
    }
  }, [userAddress]);

  const handleSaveLimits = () => {
    localStorage.setItem(`limits_${userAddress}`, JSON.stringify(limits));
    localStorage.setItem(`alerts_${userAddress}`, JSON.stringify(alerts));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const dailyUsagePercent = (spending.today / parseFloat(limits.dailyLimit)) * 100;
  const weeklyUsagePercent = (spending.thisWeek / parseFloat(limits.weeklyLimit)) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <GlassCard padding="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#0a0b14]/80 backdrop-blur-sm z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Transaction Limits & Alerts</h2>
                <p className="text-sm text-white/50">Control your spending</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Current Spending */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Current Spending
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-sm text-white/50 mb-2">Today</p>
                  <p className="text-2xl font-bold text-cyan-400 mb-2">
                    ${spending.today.toFixed(2)}
                  </p>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        dailyUsagePercent > 80
                          ? "bg-rose-500"
                          : dailyUsagePercent > 50
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(dailyUsagePercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/40 mt-1">
                    {dailyUsagePercent.toFixed(0)}% of daily limit
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-sm text-white/50 mb-2">This Week</p>
                  <p className="text-2xl font-bold text-emerald-400 mb-2">
                    ${spending.thisWeek.toFixed(2)}
                  </p>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        weeklyUsagePercent > 80
                          ? "bg-rose-500"
                          : weeklyUsagePercent > 50
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(weeklyUsagePercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/40 mt-1">
                    {weeklyUsagePercent.toFixed(0)}% of weekly limit
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Limits */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Set Spending Limits
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60 mb-2 block">
                    Daily Limit (USD)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">$</span>
                    <input
                      type="number"
                      value={limits.dailyLimit}
                      onChange={(e) =>
                        setLimits({ ...limits, dailyLimit: e.target.value })
                      }
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50"
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-2 block">
                    Weekly Limit (USD)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">$</span>
                    <input
                      type="number"
                      value={limits.weeklyLimit}
                      onChange={(e) =>
                        setLimits({ ...limits, weeklyLimit: e.target.value })
                      }
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50"
                      placeholder="5000"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-2 block">
                    Per Transaction Limit (USD)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40">$</span>
                    <input
                      type="number"
                      value={limits.perTransactionLimit}
                      onChange={(e) =>
                        setLimits({ ...limits, perTransactionLimit: e.target.value })
                      }
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50"
                      placeholder="500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/60 mb-2 block">
                    Alert Threshold (% of limit)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={limits.alertThreshold}
                      onChange={(e) =>
                        setLimits({ ...limits, alertThreshold: e.target.value })
                      }
                      className="flex-1"
                    />
                    <span className="text-white/60 font-medium w-12">
                      {limits.alertThreshold}%
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-1">
                    You'll be notified when spending reaches this threshold
                  </p>
                </div>
              </div>
            </div>

            {/* Alert Settings */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4 text-violet-400" />
                Alert Preferences
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                  <div>
                    <p className="font-medium">Email Alerts</p>
                    <p className="text-sm text-white/50">
                      Receive email notifications for transactions
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={alerts.emailAlerts}
                    onChange={(e) =>
                      setAlerts({ ...alerts, emailAlerts: e.target.checked })
                    }
                    className="w-5 h-5 rounded accent-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                  <div>
                    <p className="font-medium">Browser Notifications</p>
                    <p className="text-sm text-white/50">
                      Show push notifications in your browser
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={alerts.browserNotifications}
                    onChange={(e) =>
                      setAlerts({ ...alerts, browserNotifications: e.target.checked })
                    }
                    className="w-5 h-5 rounded accent-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                  <div>
                    <p className="font-medium">Large Transaction Alerts</p>
                    <p className="text-sm text-white/50">
                      Notify for transactions over per-transaction limit
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={alerts.largeTransactions}
                    onChange={(e) =>
                      setAlerts({ ...alerts, largeTransactions: e.target.checked })
                    }
                    className="w-5 h-5 rounded accent-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                  <div>
                    <p className="font-medium">Daily Spending Digest</p>
                    <p className="text-sm text-white/50">
                      Receive a daily summary of your transactions
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={alerts.dailyDigest}
                    onChange={(e) =>
                      setAlerts({ ...alerts, dailyDigest: e.target.checked })
                    }
                    className="w-5 h-5 rounded accent-cyan-500"
                  />
                </label>
              </div>
            </div>

            {/* Info Banner */}
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex gap-2 text-sm text-cyan-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                Transaction limits help protect your wallet from unauthorized large transactions. You can adjust these anytime.
              </p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveLimits}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              {saved ? (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Settings Saved!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}