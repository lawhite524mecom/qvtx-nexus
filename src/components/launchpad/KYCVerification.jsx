import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Check, X, Clock, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";
import GlassCard from "../ui/GlassCard";

export default function KYCVerification({ userAddress }) {
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
    documentType: "passport",
    documentNumber: ""
  });

  useEffect(() => {
    checkKYCStatus();
  }, [userAddress]);

  const checkKYCStatus = async () => {
    try {
      const response = await base44.functions.invoke('verifyKYC', {
        action: 'checkStatus',
        userAddress
      });
      setKycStatus(response.data);
    } catch (error) {
      console.error("Error checking KYC status:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await base44.functions.invoke('verifyKYC', {
        action: 'submit',
        userAddress,
        kycData: formData
      });

      if (response.data.success) {
        alert('KYC submitted successfully! Verification typically takes 24-48 hours.');
        checkKYCStatus();
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (kycStatus?.verified) {
    return (
      <GlassCard className="text-center" gradient>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <Check className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-emerald-400 mb-2">KYC Verified</h3>
        <p className="text-white/60 mb-4">
          Your identity has been verified and you can participate in presales.
        </p>
        <p className="text-xs text-white/40">
          Valid until: {new Date(kycStatus.expiresAt).toLocaleDateString()}
        </p>
      </GlassCard>
    );
  }

  if (kycStatus?.status === 'pending') {
    return (
      <GlassCard className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
          <Clock className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-xl font-bold text-amber-400 mb-2">Verification Pending</h3>
        <p className="text-white/60">
          Your KYC submission is being reviewed. This typically takes 24-48 hours.
        </p>
      </GlassCard>
    );
  }

  if (kycStatus?.status === 'rejected') {
    return (
      <GlassCard className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 flex items-center justify-center">
          <X className="w-8 h-8 text-rose-400" />
        </div>
        <h3 className="text-xl font-bold text-rose-400 mb-2">Verification Rejected</h3>
        <p className="text-white/60 mb-4">
          Your KYC submission was rejected. Please contact support for more information.
        </p>
        <Button variant="outline" onClick={() => setKycStatus(null)}>
          Resubmit KYC
        </Button>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold">KYC Verification</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-white/60 mb-2 block">Full Name</label>
          <Input
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            placeholder="John Doe"
            required
            className="bg-white/5 border-white/10"
          />
        </div>

        <div>
          <label className="text-sm text-white/60 mb-2 block">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="john@example.com"
            required
            className="bg-white/5 border-white/10"
          />
        </div>

        <div>
          <label className="text-sm text-white/60 mb-2 block">Country</label>
          <Input
            value={formData.country}
            onChange={(e) => setFormData({...formData, country: e.target.value})}
            placeholder="United States"
            required
            className="bg-white/5 border-white/10"
          />
        </div>

        <div>
          <label className="text-sm text-white/60 mb-2 block">Document Type</label>
          <Select
            value={formData.documentType}
            onValueChange={(value) => setFormData({...formData, documentType: value})}
          >
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="drivers_license">Driver's License</SelectItem>
              <SelectItem value="national_id">National ID</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-white/60 mb-2 block">Document Number</label>
          <Input
            value={formData.documentNumber}
            onChange={(e) => setFormData({...formData, documentNumber: e.target.value})}
            placeholder="AB123456"
            required
            className="bg-white/5 border-white/10"
          />
        </div>

        <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-sm text-white/60">
          <p className="mb-2 font-semibold text-cyan-400">Required Documents:</p>
          <ul className="space-y-1 text-xs">
            <li>• Clear photo of government-issued ID</li>
            <li>• Selfie holding your ID</li>
            <li>• Proof of address (utility bill, bank statement)</li>
          </ul>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold"
        >
          <Shield className="w-4 h-4 mr-2" />
          {loading ? "Submitting..." : "Submit KYC"}
        </Button>
      </form>
    </GlassCard>
  );
}