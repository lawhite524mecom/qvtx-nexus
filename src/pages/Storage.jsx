import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Database,
  Shield,
  Zap,
  Globe
} from "lucide-react";
import StatCard from "../components/ui/StatCard";
import IPFSUploader from "../components/storage/IPFSUploader";
import NFTCreator from "../components/storage/NFTCreator";
import DNAEncoder from "../components/dna/DNAEncoder";

export default function Storage() {
  const [uploadedImageHash, setUploadedImageHash] = useState("");
  const [nftMetadata, setNftMetadata] = useState(null);

  const handleUploadSuccess = (result) => {
    setUploadedImageHash(result.hash);
  };

  const handleNFTSuccess = (result) => {
    setNftMetadata(result);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Decentralized Storage
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            Store files permanently on IPFS and create NFT metadata with quantum-secure encryption
          </motion.p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatCard
            title="Storage Network"
            value="IPFS"
            subtitle="Pinata Gateway"
            icon={Database}
            accentColor="cyan"
            gradient="from-cyan-500/10 to-cyan-500/5"
          />
          <StatCard
            title="Encryption"
            value="AES-256"
            subtitle="Quantum-Safe"
            icon={Shield}
            accentColor="emerald"
            gradient="from-emerald-500/10 to-emerald-500/5"
          />
          <StatCard
            title="Upload Speed"
            value="< 3s"
            subtitle="Average"
            icon={Zap}
            accentColor="violet"
            gradient="from-violet-500/10 to-violet-500/5"
          />
          <StatCard
            title="Global CDN"
            value="Active"
            subtitle="Worldwide"
            icon={Globe}
            accentColor="amber"
            gradient="from-amber-500/10 to-amber-500/5"
          />
        </div>

        {/* DNA Encoder Section */}
        <div className="mb-12">
          <DNAEncoder />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* IPFS Uploader */}
          <IPFSUploader onUploadSuccess={handleUploadSuccess} />

          {/* NFT Creator */}
          <NFTCreator 
            imageHash={uploadedImageHash}
            onSuccess={handleNFTSuccess}
          />
        </div>

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <Database className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="font-semibold mb-2">DNA Encoding</h3>
            <p className="text-sm text-white/60">
              Convert any data to genetic sequences (ACTG) using QVTX's proprietary DNA encoding protocol for ultra-compact storage.
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <Shield className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="font-semibold mb-2">Encrypted Data</h3>
            <p className="text-sm text-white/60">
              AES-256-GCM encryption with password-derived keys ensures your sensitive data remains secure and private.
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <Zap className="w-8 h-8 text-violet-400 mb-3" />
            <h3 className="font-semibold mb-2">NFT Metadata</h3>
            <p className="text-sm text-white/60">
              Create standard-compliant NFT metadata with custom attributes, ready for minting on any blockchain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}