import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Smartphone,
  Key,
  Copy,
  Check,
  AlertCircle,
  QrCode,
  X
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function MFASetup({ isOpen, onClose, userAddress }) {
  const [step, setStep] = useState(1);
  const [mfaMethod, setMfaMethod] = useState("authenticator");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [error, setError] = useState("");

  // Simulated secret key for authenticator app
  const [secretKey] = useState("JBSWY3DPEHPK3PXP");
  const otpAuthUrl = `otpauth://totp/QVTX:${userAddress}?secret=${secretKey}&issuer=QVTX`;

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  };

  const handleSetupAuthenticator = () => {
    setStep(2);
  };

  const handleVerifyCode = () => {
    if (verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    // Simulate verification
    const codes = generateBackupCodes();
    setBackupCodes(codes);
    setStep(3);
    setError("");
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleComplete = () => {
    // Save MFA settings (in real app, save to backend)
    localStorage.setItem(`mfa_enabled_${userAddress}`, "true");
    localStorage.setItem(`mfa_method_${userAddress}`, mfaMethod);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <GlassCard padding="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Enable MFA</h2>
                <p className="text-sm text-white/50">Secure your wallet</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          <div className="p-6">
            {/* Step 1: Choose Method */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Choose MFA Method</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setMfaMethod("authenticator")}
                      className={`w-full p-4 rounded-xl border transition-all text-left ${
                        mfaMethod === "authenticator"
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-emerald-400" />
                        <div>
                          <p className="font-medium">Authenticator App</p>
                          <p className="text-sm text-white/50">
                            Google Authenticator, Authy, etc.
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setMfaMethod("hardware")}
                      className={`w-full p-4 rounded-xl border transition-all text-left ${
                        mfaMethod === "hardware"
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="font-medium">Hardware Security Key</p>
                          <p className="text-sm text-white/50">
                            YubiKey, Ledger, or similar device
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex gap-2 text-sm text-cyan-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>
                    MFA adds an extra layer of security by requiring a second verification method for all transactions.
                  </p>
                </div>

                <button
                  onClick={handleSetupAuthenticator}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Setup & Verify */}
            {step === 2 && mfaMethod === "authenticator" && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Scan QR Code</h3>
                  <div className="bg-white p-4 rounded-xl flex justify-center">
                    <div className="text-center">
                      <QrCode className="w-32 h-32 mx-auto text-black mb-2" />
                      <p className="text-xs text-black">Scan with your authenticator app</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-white/50 mb-2">Or enter manually:</p>
                  <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl">
                    <code className="flex-1 font-mono text-sm text-cyan-400">
                      {secretKey}
                    </code>
                    <button
                      onClick={handleCopySecret}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {copiedCode ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-white/40" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-white/50 mb-2 block">
                    Enter 6-digit code from app
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 text-center text-2xl tracking-widest font-mono"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex gap-2 text-sm text-rose-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify & Continue
                </button>
              </div>
            )}

            {/* Step 3: Backup Codes */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Save Backup Codes</h3>
                  <p className="text-sm text-white/50 mb-4">
                    Store these codes securely. Each can be used once if you lose access to your authenticator.
                  </p>

                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {backupCodes.map((code, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-white/5 rounded-lg font-mono text-sm text-center"
                        >
                          {code}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleCopyBackupCodes}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy All Codes
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-2 text-sm text-amber-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>
                    Never share these codes. Store them in a secure location like a password manager.
                  </p>
                </div>

                <button
                  onClick={handleComplete}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  Complete Setup
                </button>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}