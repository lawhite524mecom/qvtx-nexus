import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  Sparkles,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function NFTCreator({ imageHash, onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [newAttribute, setNewAttribute] = useState({ trait: "", value: "" });
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const addAttribute = () => {
    if (newAttribute.trait && newAttribute.value) {
      setAttributes([...attributes, newAttribute]);
      setNewAttribute({ trait: "", value: "" });
    }
  };

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!name || !description || !imageHash) {
      setError("Name, description, and image are required");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setResult(null);

      const response = await base44.functions.invoke('createNFTMetadata', {
        name,
        description,
        imageHash,
        attributes
      });

      setResult(response.data);
      if (onSuccess) onSuccess(response.data);

    } catch (err) {
      console.error("NFT creation error:", err);
      setError(err.message || "Failed to create NFT metadata");
    } finally {
      setCreating(false);
    }
  };

  return (
    <GlassCard>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-violet-400" />
        Create NFT Metadata
      </h3>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-sm text-white/60 mb-2 block">NFT Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Awesome NFT"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-white/60 mb-2 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your NFT..."
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500/50 resize-none"
          />
        </div>

        {/* Image Hash */}
        <div>
          <label className="text-sm text-white/60 mb-2 block">Image IPFS Hash</label>
          <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-sm text-white/80">
              {imageHash || "Upload an image first"}
            </span>
          </div>
        </div>

        {/* Attributes */}
        <div>
          <label className="text-sm text-white/60 mb-2 block">Attributes (Optional)</label>
          
          {attributes.length > 0 && (
            <div className="mb-3 space-y-2">
              {attributes.map((attr, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div>
                    <span className="text-sm text-white/60">{attr.trait}:</span>
                    <span className="ml-2 font-medium">{attr.value}</span>
                  </div>
                  <button
                    onClick={() => removeAttribute(index)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newAttribute.trait}
              onChange={(e) => setNewAttribute({ ...newAttribute, trait: e.target.value })}
              placeholder="Trait (e.g., Rarity)"
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500/50 text-sm"
            />
            <input
              type="text"
              value={newAttribute.value}
              onChange={(e) => setNewAttribute({ ...newAttribute, value: e.target.value })}
              placeholder="Value (e.g., Legendary)"
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500/50 text-sm"
            />
            <button
              onClick={addAttribute}
              disabled={!newAttribute.trait || !newAttribute.value}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Success Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">NFT Metadata Created!</span>
            </div>
            <p className="text-sm text-white/60 mb-2">
              Metadata URI: <span className="font-mono text-xs">{result.metadataUri}</span>
            </p>
            <a
              href={result.metadataUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              View on IPFS →
            </a>
          </motion.div>
        )}

        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={!name || !description || !imageHash || creating}
          className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {creating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Metadata...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Create NFT Metadata
            </>
          )}
        </button>
      </div>
    </GlassCard>
  );
}