import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, AlertCircle } from "lucide-react";

export default function TokenCreationForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    tokenName: "",
    symbol: "",
    totalSupply: "",
    decimals: "18",
    network: "qvtx"
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.tokenName) newErrors.tokenName = "Token name is required";
    if (!formData.symbol) newErrors.symbol = "Symbol is required";
    if (!formData.totalSupply || parseFloat(formData.totalSupply) <= 0) {
      newErrors.totalSupply = "Valid total supply is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-white/60 mb-2 block">Token Name</label>
        <Input
          value={formData.tokenName}
          onChange={(e) => setFormData({...formData, tokenName: e.target.value})}
          placeholder="My Awesome Token"
          className="bg-white/5 border-white/10"
        />
        {errors.tokenName && (
          <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.tokenName}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-white/60 mb-2 block">Symbol</label>
        <Input
          value={formData.symbol}
          onChange={(e) => setFormData({...formData, symbol: e.target.value.toUpperCase()})}
          placeholder="MAT"
          maxLength={10}
          className="bg-white/5 border-white/10"
        />
        {errors.symbol && (
          <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.symbol}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-white/60 mb-2 block">Total Supply</label>
        <Input
          type="number"
          value={formData.totalSupply}
          onChange={(e) => setFormData({...formData, totalSupply: e.target.value})}
          placeholder="1000000"
          className="bg-white/5 border-white/10"
        />
        {errors.totalSupply && (
          <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.totalSupply}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-white/60 mb-2 block">Decimals</label>
        <Select value={formData.decimals} onValueChange={(value) => setFormData({...formData, decimals: value})}>
          <SelectTrigger className="bg-white/5 border-white/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6">6</SelectItem>
            <SelectItem value="8">8</SelectItem>
            <SelectItem value="18">18</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm text-white/60 mb-2 block">Network</label>
        <Select value={formData.network} onValueChange={(value) => setFormData({...formData, network: value})}>
          <SelectTrigger className="bg-white/5 border-white/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="qvtx">QVTX Chain</SelectItem>
            <SelectItem value="polygon">Polygon</SelectItem>
            <SelectItem value="bsc">BSC</SelectItem>
            <SelectItem value="base">Base</SelectItem>
            <SelectItem value="xrp">XRP Ledger</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold hover:shadow-lg hover:shadow-cyan-500/25"
      >
        <Coins className="w-4 h-4 mr-2" />
        {loading ? "Creating Token..." : "Create Token"}
      </Button>
    </form>
  );
}