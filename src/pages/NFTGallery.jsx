import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Grid, SlidersHorizontal, RefreshCw, Plus, Search } from "lucide-react";
import NFTCard from "@/components/nft/NFTCard";
import { RARITIES } from "@/components/nft/RarityBadge";

const SORT_OPTIONS = [
  { value: "-created_date", label: "Newest" },
  { value: "price", label: "Price: Low → High" },
  { value: "-price", label: "Price: High → Low" },
];

const RARITY_ORDER = { MYTHIC: 5, LEGENDARY: 4, EPIC: 3, RARE: 2, COMMON: 1 };

export default function NFTGallery() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRarity, setFilterRarity] = useState("ALL");
  const [sort, setSort] = useState("-created_date");
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.NFTs.list();
    setNfts(data);
    setLoading(false);
  };

  const filtered = nfts
    .filter(n => filterRarity === "ALL" || n.rarity === filterRarity)
    .filter(n => !search || n.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "-created_date") return new Date(b.created_date) - new Date(a.created_date);
      if (sort === "price") return (a.price || 0) - (b.price || 0);
      if (sort === "-price") return (b.price || 0) - (a.price || 0);
      return 0;
    });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-white" style={{ textShadow: "0 0 20px rgba(0,212,255,0.35)" }}>
              NFT Gallery
            </h1>
            <p className="text-white/40 text-sm mt-1">{nfts.length} NFTs minted on QVTX</p>
          </div>
          <Link
            to="/MyNFTs"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-black text-sm"
            style={{ background: "linear-gradient(135deg, #00d4ff, #ffd700)" }}
          >
            <Plus className="w-4 h-4" />
            My NFTs
          </Link>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search NFTs..."
              className="w-full bg-black/30 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/40"
            />
          </div>

          {/* Rarity filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {["ALL", ...RARITIES].map(r => (
              <button
                key={r}
                onClick={() => setFilterRarity(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterRarity === r
                    ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-300"
                    : "bg-white/5 border border-white/10 text-white/40 hover:text-white/70"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <button onClick={load} className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <RefreshCw className={`w-4 h-4 text-white/40 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Grid className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-lg">No NFTs found</p>
            <p className="text-white/20 text-sm mt-1">Be the first to mint one</p>
            <Link
              to="/MyNFTs"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl font-bold text-black text-sm"
              style={{ background: "linear-gradient(135deg, #00d4ff, #ffd700)" }}
            >
              <Plus className="w-4 h-4" />
              Create NFT
            </Link>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filtered.map((nft, i) => (
              <motion.div key={nft.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <NFTCard nft={nft} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}