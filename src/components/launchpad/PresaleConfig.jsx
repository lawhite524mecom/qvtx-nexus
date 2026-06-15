import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DollarSign, AlertCircle, Target } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function PresaleConfig({ tokenId, tokenSymbol, onSuccess }) {
  const [formData, setFormData] = useState({
    pricePerToken: "",
    hardCap: "",
    softCap: "",
    startTime: "",
    endTime: "",
    minContribution: "",
    maxContribution: "",
    kycRequired: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.pricePerToken || parseFloat(formData.pricePerToken) <= 0) {
      newErrors.pricePerToken = "Valid price is required";
    }
    if (!formData.hardCap || parseFloat(formData.hardCap) <= 0) {
      newErrors.hardCap = "Valid hard cap is required";
    }
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      newErrors.endTime = "End time must be after start time";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await base44.entities.Presales.create({
        tokenId,
        tokenSymbol,
        pricePerToken: parseFloat(formData.pricePerToken),
        hardCap: formData.hardCap,
        softCap: formData.softCap || "0",
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        minContribution: parseFloat(formData.minContribution) || 0,
        maxContribution: parseFloat(formData.maxContribution) || 0,
        kycRequired: formData.kycRequired,
        status: 'upcoming'
      });

      onSuccess?.();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-semibold">Presale Configuration</h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-white/60 mb-2 block">Price per Token (USD)</label>
          <Input
            type="number"
            step="0.000001"
            value={formData.pricePerToken}
            onChange={(e) => setFormData({...formData, pricePerToken: e.target.value})}
            placeholder="0.10"
            className="bg-white/5 border-white/10"
          />
          {errors.pricePerToken && (
            <p className="text-xs text-rose-400 mt-1">{errors.pricePerToken}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-white/60 mb-2 block">Hard Cap (USD)</label>
          <Input
            type="number"
            value={formData.hardCap}
            onChange={(e) => setFormData({...formData, hardCap: e.target.value})}
            placeholder="1000000"
            className="bg-white/5 border-white/10"
          />
          {errors.hardCap && (
            <p className="text-xs text-rose-400 mt-1">{errors.hardCap}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-white/60 mb-2 block">Soft Cap (USD)</label>
          <Input
            type="number"
            value={formData.softCap}
            onChange={(e) => setFormData({...formData, softCap: e.target.value})}
            placeholder="500000 (Optional)"
            className="bg-white/5 border-white/10"
          />
        </div>

        <div>
          <label className="text-sm text-white/60 mb-2 block">Min Contribution</label>
          <Input
            type="number"
            value={formData.minContribution}
            onChange={(e) => setFormData({...formData, minContribution: e.target.value})}
            placeholder="100"
            className="bg-white/5 border-white/10"
          />
        </div>

        <div>
          <label className="text-sm text-white/60 mb-2 block">Max Contribution</label>
          <Input
            type="number"
            value={formData.maxContribution}
            onChange={(e) => setFormData({...formData, maxContribution: e.target.value})}
            placeholder="10000"
            className="bg-white/5 border-white/10"
          />
        </div>

        <div>
          <label className="text-sm text-white/60 mb-2 block">Start Time</label>
          <Input
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
            className="bg-white/5 border-white/10"
          />
          {errors.startTime && (
            <p className="text-xs text-rose-400 mt-1">{errors.startTime}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-white/60 mb-2 block">End Time</label>
          <Input
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => setFormData({...formData, endTime: e.target.value})}
            className="bg-white/5 border-white/10"
          />
          {errors.endTime && (
            <p className="text-xs text-rose-400 mt-1">{errors.endTime}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="kycRequired"
          checked={formData.kycRequired}
          onChange={(e) => setFormData({...formData, kycRequired: e.target.checked})}
          className="w-4 h-4"
        />
        <label htmlFor="kycRequired" className="text-sm text-white/60">
          Require KYC verification for participants
        </label>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-semibold"
      >
        <DollarSign className="w-4 h-4 mr-2" />
        {loading ? "Creating Presale..." : "Create Presale"}
      </Button>
    </form>
  );
}