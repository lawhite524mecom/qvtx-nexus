import React, { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  Upload,
  File,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink,
  Image as ImageIcon
} from "lucide-react";
import GlassCard from "../ui/GlassCard";

export default function IPFSUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError("");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setResult(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);

      const response = await base44.functions.invoke('uploadToIPFS', formData);

      setResult(response.data);
      if (onUploadSuccess) onUploadSuccess(response.data);

    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const isImage = file && file.type.startsWith('image/');

  return (
    <GlassCard>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5 text-cyan-400" />
        IPFS File Upload
      </h3>

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
          dragActive
            ? "border-cyan-500 bg-cyan-500/10"
            : "border-white/20 hover:border-white/40"
        }`}
      >
        <input
          type="file"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center">
          {file ? (
            <div className="flex flex-col items-center gap-3">
              {isImage ? (
                <ImageIcon className="w-12 h-12 text-cyan-400" />
              ) : (
                <File className="w-12 h-12 text-cyan-400" />
              )}
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-white/40">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="text-sm text-rose-400 hover:text-rose-300"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-white/40 mx-auto mb-3" />
              <p className="text-white/60 mb-2">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-xs text-white/40">
                Supports images, documents, and any file type
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-sm"
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
          className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-3 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Upload Successful!</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
              <span className="text-white/60">IPFS Hash:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs">{result.hash.slice(0, 12)}...</span>
                <button
                  onClick={() => copyToClipboard(result.hash)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
              <span className="text-white/60">Gateway URL:</span>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
              >
                <span className="text-xs">View</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
              <span className="text-white/60">Size:</span>
              <span>{(result.size / 1024).toFixed(2)} KB</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Uploading to IPFS...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            Upload to IPFS
          </>
        )}
      </button>
    </GlassCard>
  );
}