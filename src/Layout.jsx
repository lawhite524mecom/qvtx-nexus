import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import {
  Wallet,
  LayoutDashboard,
  Coins,
  Gamepad2,
  AppWindow,
  FileText,
  Code,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  Brain,
  DollarSign,
  Dna,
  Fingerprint,
  LogIn,
  LogOut,
  UserCircle,
  Cpu,
  Image,
  Zap
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import Logo from "./components/ui/Logo";

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { name: "Home", page: "Home", icon: null },
    { name: "Wallet", page: "Wallet", icon: Wallet },
    { name: "Buy QVTX", page: "BuyQVTX", icon: null },
    { name: "Portfolio", page: "Portfolio", icon: LayoutDashboard },
    { name: "Launchpad", page: "TokenLaunchpad", icon: null },
    { name: "XRP", page: "XRP", icon: null },
    { name: "Dashboard", page: "Dashboard", icon: LayoutDashboard },
    { name: "AI", page: "AI", icon: Brain },
    { name: "Staking", page: "StakingDashboard", icon: Coins },
    { name: "Gaming", page: "Gaming", icon: Gamepad2 },
    { name: "Apps", page: "Apps", icon: AppWindow },
    { name: "Storage", page: "Storage", icon: null },
    { name: "Partnerships", page: "Partnerships", icon: null },
    { name: "Partner Portal", page: "PartnerDashboard", icon: null },
    { name: "Docs", page: "Docs", icon: FileText },
    { name: "Contracts", page: "Contracts", icon: Code },
  ];

  const isAdminPage = currentPageName === "Admin";

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white overflow-x-hidden">
      {/* Subtle gradient overlay only */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/10 bg-[#0a0b14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <Logo className="group-hover:shadow-cyan-500/40 transition-shadow" />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                QVTX
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 overflow-x-auto max-w-3xl scrollbar-hide">
              <Link
                to={createPageUrl("Home")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "Home"
                    ? "bg-white/15 text-white"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
              >
                Home
              </Link>

              <Link
                to={createPageUrl("Wallet")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "Wallet"
                    ? "bg-white/15 text-white"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
              >
                <Wallet className="w-4 h-4" />
                Wallet
              </Link>

              <Link
                to={createPageUrl("BuyQVTX")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 hover:from-emerald-500/30 hover:to-cyan-500/30 ${
                  currentPageName === "BuyQVTX"
                    ? "text-emerald-400"
                    : "text-emerald-400"
                }`}
              >
                Buy QVTX
              </Link>

              <div className="w-px h-6 bg-white/20 mx-1" />

              <Link
                to={createPageUrl("Portfolio")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "Portfolio"
                    ? "bg-white/15 text-white"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Portfolio
              </Link>

              <Link
                to={createPageUrl("Dashboard")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "Dashboard"
                    ? "bg-white/15 text-white"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              <Link
                to={createPageUrl("StakingDashboard")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "StakingDashboard"
                    ? "bg-white/15 text-white"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
              >
                <Coins className="w-4 h-4" />
                Staking
              </Link>

              <Link
                to={createPageUrl("TokenLaunchpad")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "TokenLaunchpad"
                    ? "bg-white/15 text-white"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
              >
                Launchpad
              </Link>

              <Link
                to={createPageUrl("XRP")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "XRP"
                    ? "bg-white/15 text-white"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
              >
                XRP
              </Link>

              <div className="w-px h-6 bg-white/20 mx-1" />

              <Link
                to={createPageUrl("AI")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "AI"
                    ? "bg-white/15 text-white"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
              >
                <Brain className="w-4 h-4" />
                AI
              </Link>

              <Link
                to={createPageUrl("Gaming")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "Gaming"
                    ? "bg-white/15 text-white"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                Gaming
              </Link>

              <Link
                to={createPageUrl("Apps")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "Apps"
                    ? "bg-white/15 text-white"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
              >
                <AppWindow className="w-4 h-4" />
                Apps
              </Link>

              <Link
                to={createPageUrl("Storage")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "Storage"
                    ? "bg-white/15 text-white"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
              >
                Storage
              </Link>

              <div className="w-px h-6 bg-white/20 mx-1" />

              <Link
                to={createPageUrl("Partnerships")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "Partnerships"
                    ? "bg-white/15 text-white"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
              >
                Partnerships
              </Link>

              <Link
                to={createPageUrl("PartnerDashboard")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "PartnerDashboard"
                    ? "bg-white/15 text-white"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
              >
                Partner Portal
              </Link>

              <Link
                to={createPageUrl("ByteID")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "ByteID"
                    ? "bg-white/15 text-white"
                    : "hover:bg-white/10"
                }`}
                style={{ color: "#00d4ff" }}
              >
                <Fingerprint className="w-4 h-4" />
                ByteID
              </Link>

              <Link
                to={createPageUrl("DNACompress")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "DNACompress"
                    ? "bg-white/15 text-white"
                    : "hover:bg-white/10"
                }`}
                style={{ color: "#ffd700" }}
              >
                <Dna className="w-4 h-4" />
                DNA
              </Link>

              <Link
                to={createPageUrl("QVTXEMining")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "QVTXEMining"
                    ? "bg-white/15 text-white"
                    : "hover:bg-white/10"
                }`}
                style={{ color: "#10b981" }}
              >
                <Cpu className="w-4 h-4" />
                Mining
              </Link>

              <Link
                to={createPageUrl("NFTGallery")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "NFTGallery" || currentPageName === "MyNFTs" || currentPageName === "NFTDetail"
                    ? "bg-white/15 text-white"
                    : "hover:bg-white/10"
                }`}
                style={{ color: "#f472b6" }}
              >
                <Image className="w-4 h-4" />
                NFTs
              </Link>

              <Link
                to={createPageUrl("ServicesCatalog")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "ServicesCatalog"
                    ? "bg-white/15 text-white"
                    : "hover:bg-white/10"
                }`}
                style={{ color: currentPageName === "ServicesCatalog" ? "#ffd700" : "#ffd700cc" }}
              >
                <Zap className="w-4 h-4" />
                Services
              </Link>

              <Link
                to={createPageUrl("Docs")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "Docs"
                    ? "bg-white/15 text-white"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
              >
                <FileText className="w-4 h-4" />
                Docs
              </Link>

              <Link
                to={createPageUrl("Contracts")}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  currentPageName === "Contracts"
                    ? "bg-white/15 text-white"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
              >
                <Code className="w-4 h-4" />
                Contracts
              </Link>

              {!isAdminPage && (
                <>
                  <div className="w-px h-6 bg-white/20 mx-1" />
                  <Link
                    to={createPageUrl("Admin")}
                    className="px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 text-white hover:text-white hover:bg-white/10"
                  >
                    Admin
                  </Link>
                </>
              )}
            </div>

            {/* CTA / Auth Button */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm" style={{ borderColor: "rgba(255,215,0,0.2)", color: "#ffd700" }}>
                    <UserCircle className="w-4 h-4" />
                    <span className="font-medium max-w-[120px] truncate">{user?.full_name || user?.email || "Employee"}</span>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="px-4 py-2 rounded-xl border text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => base44.auth.redirectToLogin(window.location.href)}
                  className="px-6 py-2.5 font-orbitron font-bold text-black rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm"
                  style={{ background: "linear-gradient(135deg, #00d4ff, #ffd700)" }}
                >
                  <LogIn className="w-4 h-4" />
                  Login / Sign Up
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0f1019]/98 backdrop-blur-xl border-b border-white/10 z-50 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="px-4 py-6">
              {/* Primary Actions */}
              <div className="space-y-2 mb-4">
                <Link
                  to={createPageUrl("Home")}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentPageName === "Home"
                      ? "bg-white/15 text-white"
                      : "text-white hover:text-white hover:bg-white/10"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to={createPageUrl("Wallet")}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentPageName === "Wallet"
                      ? "bg-white/15 text-white"
                      : "text-white hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  Wallet
                </Link>
                <Link
                  to={createPageUrl("BuyQVTX")}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400"
                >
                  <DollarSign className="w-5 h-5" />
                  Buy QVTX
                </Link>
              </div>

              <div className="border-t border-white/10 my-4" />

              {/* Core Features */}
              <div className="mb-2">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider px-4 mb-2">Core Features</p>
                <div className="space-y-1">
                  <Link
                    to={createPageUrl("Portfolio")}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentPageName === "Portfolio"
                        ? "bg-white/15 text-white"
                        : "text-white hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Portfolio
                  </Link>
                  <Link
                    to={createPageUrl("Dashboard")}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentPageName === "Dashboard"
                        ? "bg-white/15 text-white"
                        : "text-white hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link
                    to={createPageUrl("StakingDashboard")}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentPageName === "StakingDashboard"
                        ? "bg-white/15 text-white"
                        : "text-white hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Coins className="w-5 h-5" />
                    Staking
                  </Link>
                  <Link
                    to={createPageUrl("TokenLaunchpad")}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentPageName === "TokenLaunchpad"
                        ? "bg-white/15 text-white"
                        : "text-white hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Launchpad
                  </Link>
                  <Link
                    to={createPageUrl("XRP")}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentPageName === "XRP"
                        ? "bg-white/15 text-white"
                        : "text-white hover:text-white hover:bg-white/10"
                    }`}
                  >
                    XRP
                  </Link>
                </div>
              </div>

              <div className="border-t border-white/10 my-4" />

              {/* Ecosystem */}
              <div className="mb-2">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider px-4 mb-2">Ecosystem</p>
                <div className="space-y-1">
                  <Link
                    to={createPageUrl("AI")}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentPageName === "AI"
                        ? "bg-white/15 text-white"
                        : "text-white hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Brain className="w-5 h-5" />
                    AI
                  </Link>
                  <Link
                    to={createPageUrl("Gaming")}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentPageName === "Gaming"
                        ? "bg-white/15 text-white"
                        : "text-white hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Gamepad2 className="w-5 h-5" />
                    Gaming
                  </Link>
                  <Link
                    to={createPageUrl("Apps")}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentPageName === "Apps"
                        ? "bg-white/15 text-white"
                        : "text-white hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <AppWindow className="w-5 h-5" />
                    Apps
                  </Link>
                  <Link
                    to={createPageUrl("Storage")}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentPageName === "Storage"
                        ? "bg-white/15 text-white"
                        : "text-white hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Storage
                  </Link>
                  <Link
                    to={createPageUrl("QVTXEMining")}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all`}
                    style={{ color: currentPageName === "QVTXEMining" ? "#10b981" : "#10b981cc" }}
                  >
                    <Cpu className="w-5 h-5" />
                    QVTXE Mining
                  </Link>
                  <Link
                    to={createPageUrl("NFTGallery")}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all`}
                    style={{ color: currentPageName === "NFTGallery" ? "#f472b6" : "#f472b6cc" }}
                  >
                    <Image className="w-5 h-5" />
                    NFT Gallery
                  </Link>
                  <Link
                    to={createPageUrl("MyNFTs")}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all`}
                    style={{ color: currentPageName === "MyNFTs" ? "#f472b6" : "#f472b6cc" }}
                  >
                    <Image className="w-5 h-5" />
                    My NFTs
                  </Link>
                </div>
              </div>

              <div className="border-t border-white/10 my-4" />

              {/* Resources */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider px-4 mb-2">Resources</p>
                <div className="space-y-1">
                  <Link
                    to={createPageUrl("Partnerships")}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentPageName === "Partnerships"
                        ? "bg-white/15 text-white"
                        : "text-white hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Partnerships
                  </Link>
                  <Link
                    to={createPageUrl("PartnerDashboard")}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentPageName === "PartnerDashboard"
                        ? "bg-white/15 text-white"
                        : "text-white hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Partner Portal
                  </Link>
                  <Link
                    to={createPageUrl("Docs")}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentPageName === "Docs"
                        ? "bg-white/15 text-white"
                        : "text-white hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    Docs
                  </Link>
                  <Link
                    to={createPageUrl("Contracts")}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentPageName === "Contracts"
                        ? "bg-white/15 text-white"
                        : "text-white hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Code className="w-5 h-5" />
                    Contracts
                  </Link>
                </div>
              </div>

              {/* CTA / Auth */}
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl border" style={{ borderColor: "rgba(255,215,0,0.2)", color: "#ffd700" }}>
                    <UserCircle className="w-5 h-5" />
                    <span className="font-medium">{user?.full_name || user?.email || "Employee"}</span>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { base44.auth.redirectToLogin(window.location.href); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 font-orbitron font-bold text-black rounded-xl"
                  style={{ background: "linear-gradient(135deg, #00d4ff, #ffd700)" }}
                >
                  <LogIn className="w-4 h-4" />
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20 bg-[#0a0b14]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Logo size="sm" />
                <span className="font-bold">QVTX</span>
              </div>
              <p className="text-sm text-white leading-relaxed">
                Multi-chain DeFi ecosystem for the future of decentralized finance.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-white">
                <li><Link to={createPageUrl("Wallet")} className="hover:text-white transition-colors">Wallet</Link></li>
                <li><Link to={createPageUrl("Staking")} className="hover:text-white transition-colors">Staking</Link></li>
                <li><Link to={createPageUrl("Gaming")} className="hover:text-white transition-colors">Gaming</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-4">Developers</h4>
              <ul className="space-y-2 text-sm text-white">
                <li><Link to={createPageUrl("Docs")} className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to={createPageUrl("Contracts")} className="hover:text-white transition-colors">Contracts</Link></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1">API <ExternalLink className="w-3 h-3" /></a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-white">
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Telegram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm font-orbitron font-bold" style={{ color: "#ffd700" }}>Quantvestrix Inc.</p>
              <p className="text-xs text-white/40">Louis A. White III — Founder &amp; CEO</p>
              <p className="text-xs text-white/30 mt-1">© 2026 QVTX. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-6 text-sm text-white">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}