import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Users,
  Trophy,
  Coins,
  Image as ImageIcon,
  Play,
  Star,
  TrendingUp,
  Clock
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import StatCard from "../components/ui/StatCard";

export default function Gaming() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", "action", "strategy", "card", "racing"];

  const games = [
    {
      id: 1,
      name: "QVTX Battleground",
      description: "Battle royale game where last player standing wins QVTX tokens.",
      category: "action",
      players: "12,450",
      rewards: "$2,500/day",
      rating: 4.8,
      status: "Live",
      gradient: "from-rose-500 to-pink-500"
    },
    {
      id: 2,
      name: "Quantum Chess",
      description: "Strategic chess variant with NFT pieces and token rewards.",
      category: "strategy",
      players: "8,230",
      rewards: "$1,200/day",
      rating: 4.6,
      status: "Live",
      gradient: "from-violet-500 to-purple-500"
    },
    {
      id: 3,
      name: "Crypto Cards",
      description: "Trading card game with rare NFT cards and tournament prizes.",
      category: "card",
      players: "15,670",
      rewards: "$3,400/day",
      rating: 4.9,
      status: "Live",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      id: 4,
      name: "Space Racers",
      description: "High-speed racing game with customizable NFT vehicles.",
      category: "racing",
      players: "6,890",
      rewards: "$890/day",
      rating: 4.5,
      status: "Coming Soon",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      id: 5,
      name: "DeFi Tycoon",
      description: "Build and manage your own DeFi empire to earn real tokens.",
      category: "strategy",
      players: "9,450",
      rewards: "$1,800/day",
      rating: 4.7,
      status: "Live",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      id: 6,
      name: "Arena Champions",
      description: "1v1 fighting game with ranked matches and prize pools.",
      category: "action",
      players: "7,120",
      rewards: "$1,100/day",
      rating: 4.4,
      status: "Live",
      gradient: "from-red-500 to-rose-500"
    }
  ];

  const nfts = [
    { name: "Legendary Sword", collection: "QVTX Weapons", price: "2.5 ETH", rarity: "Legendary" },
    { name: "Epic Shield", collection: "QVTX Armor", price: "1.8 ETH", rarity: "Epic" },
    { name: "Rare Mount", collection: "QVTX Mounts", price: "0.9 ETH", rarity: "Rare" },
    { name: "Common Helm", collection: "QVTX Armor", price: "0.2 ETH", rarity: "Common" }
  ];

  const leaderboard = [
    { rank: 1, name: "CryptoKing", avatar: "👑", score: "1,245,600", earnings: "$12,450" },
    { rank: 2, name: "QuantumPlayer", avatar: "⚡", score: "1,189,300", earnings: "$9,870" },
    { rank: 3, name: "BlockchainBeast", avatar: "🔥", score: "1,056,200", earnings: "$7,650" },
    { rank: 4, name: "DeFiMaster", avatar: "💎", score: "987,400", earnings: "$5,430" },
    { rank: 5, name: "TokenWarrior", avatar: "⚔️", score: "876,100", earnings: "$4,120" }
  ];

  const filteredGames = activeCategory === "all" 
    ? games 
    : games.filter(g => g.category === activeCategory);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 mb-6"
          >
            <Gamepad2 className="w-4 h-4 text-rose-400" />
            <span className="text-sm text-rose-400 font-medium">Play-to-Earn Gaming</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
              Gaming & NFT Hub
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            Play games, earn QVTX tokens, collect NFTs, and compete in tournaments
          </motion.p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatCard
            title="Live Games"
            value="12"
            icon={Gamepad2}
            accentColor="rose"
            gradient="from-rose-500/10 to-rose-500/5"
          />
          <StatCard
            title="Active Players"
            value="45K+"
            icon={Users}
            accentColor="violet"
            gradient="from-violet-500/10 to-violet-500/5"
          />
          <StatCard
            title="Daily Rewards"
            value="$2.4M"
            icon={Coins}
            accentColor="amber"
            gradient="from-amber-500/10 to-amber-500/5"
          />
          <StatCard
            title="NFTs Traded"
            value="125K"
            icon={ImageIcon}
            accentColor="cyan"
            gradient="from-cyan-500/10 to-cyan-500/5"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                activeCategory === category
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="group overflow-hidden" padding="p-0">
                {/* Game Image */}
                <div className={`h-48 bg-gradient-to-br ${game.gradient} relative flex items-center justify-center`}>
                  <Gamepad2 className="w-20 h-20 text-white/30" />
                  {game.status === "Live" ? (
                    <span className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
                      Live
                    </span>
                  ) : (
                    <span className="absolute top-4 right-4 px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Soon
                    </span>
                  )}
                  <button className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </button>
                </div>

                {/* Game Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{game.name}</h3>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{game.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/50 mb-4 line-clamp-2">{game.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-white/5 rounded-xl text-center">
                      <p className="text-xs text-white/40">Players</p>
                      <p className="font-semibold text-cyan-400">{game.players}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl text-center">
                      <p className="text-xs text-white/40">Rewards</p>
                      <p className="font-semibold text-emerald-400">{game.rewards}</p>
                    </div>
                  </div>

                  <button className={`w-full py-3 rounded-xl font-semibold transition-all bg-gradient-to-r ${game.gradient} text-white hover:shadow-lg`}>
                    {game.status === "Live" ? "Play Now" : "Notify Me"}
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* NFT Marketplace Preview */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-cyan-400" />
              Trending NFTs
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {nfts.map((nft, index) => (
                <motion.div
                  key={nft.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="overflow-hidden" padding="p-0">
                    <div className="aspect-square bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center relative">
                      <ImageIcon className="w-12 h-12 text-white/20" />
                      <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                        nft.rarity === "Legendary" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black" :
                        nft.rarity === "Epic" ? "bg-violet-500 text-white" :
                        nft.rarity === "Rare" ? "bg-blue-500 text-white" :
                        "bg-white/20 text-white"
                      }`}>
                        {nft.rarity}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-cyan-400">{nft.collection}</p>
                      <p className="font-medium text-sm truncate">{nft.name}</p>
                      <p className="text-emerald-400 font-semibold text-sm mt-1">{nft.price}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Top Players
            </h2>
            <GlassCard padding="p-0">
              {leaderboard.map((player, index) => (
                <motion.div
                  key={player.rank}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      player.rank === 1 ? "bg-amber-500/20 text-amber-400" :
                      player.rank === 2 ? "bg-slate-400/20 text-slate-300" :
                      player.rank === 3 ? "bg-orange-500/20 text-orange-400" :
                      "bg-white/5 text-white/40"
                    }`}>
                      {player.rank}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-xl">
                      {player.avatar}
                    </div>
                    <div>
                      <p className="font-medium">{player.name}</p>
                      <p className="text-sm text-white/40">{player.score} pts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-400">{player.earnings}</p>
                    <p className="text-xs text-white/40">Earnings</p>
                  </div>
                </motion.div>
              ))}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}