import React from "react";
import { useParams, Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Search } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import ChainOverview from "./ChainOverview";

// Known chain-id patterns that should redirect to chain overview
const CHAIN_ID_FROM_ADDR = {
  "chain-20232": 20232,
  "chain-42000": 42000
};

export default function AddressView() {
  const { addr } = useParams();

  // If this looks like a chain identifier, render chain overview
  if (addr && CHAIN_ID_FROM_ADDR[addr] !== undefined) {
    return <ChainOverview />;
  }

  // Valid EVM address check
  const isValidAddress = /^0x[0-9a-fA-F]{40}$/.test(addr ?? "");

  if (isValidAddress) {
    // Future: render actual address/account page
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <GlassCard className="p-12">
            <Search className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Address Lookup</h1>
            <p className="text-white/50 mb-2 font-mono text-sm break-all">{addr}</p>
            <p className="text-white/40 text-sm mb-6">
              On-chain address data coming soon. Visit the explorer for now.
            </p>
            <a
              href={`https://explorer.qvtx.io/address/${addr}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl"
            >
              View on Explorer
            </a>
          </GlassCard>
        </div>
      </div>
    );
  }

  // Catch-all: unrecognised / invalid address
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md mx-auto text-center">
        <GlassCard className="p-12">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Not Found</h1>
          <p className="text-white/50 mb-6 text-sm">
            <span className="font-mono text-white/70 break-all">"{addr}"</span> is not a valid address or known chain identifier.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}