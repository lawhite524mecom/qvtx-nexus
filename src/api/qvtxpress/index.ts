// QvtXpress Payment Rail Module
// Quaternary-native transaction representation, derivation & provenance

export { default as ingestHandler } from "./qvtxpress_ingest";
export * from "./chain_anchor";

// Rail types supported by QvtXpress
export const RAILS = {
  WIRE: "wire",
  ACH: "ach",
  STABLECOIN: "stablecoin",
  QVTX_PAY: "qvtx_pay",
  IN_KIND: "in_kind",
} as const;

// Entity types for onboarding
export const ENTITY_TYPES = {
  FAMILY_OFFICE: "family_office",
  SOVEREIGN: "sovereign",
  ASSET_MANAGER: "asset_manager",
  FUND: "fund",
} as const;

// Eligibility basis types
export const ELIGIBILITY = {
  ACCREDITED: "accredited",
  QUALIFIED_PURCHASER: "qualified_purchaser",
  REG_S: "reg_s",
} as const;

// QvtXpress module info
export const QVTXPRESS_INFO = {
  name: "QvtXpress",
  version: "1.0.0",
  description: "Quaternary-native payment rail with provenance anchoring",
  chains: {
    provenance: 42000, // QVTX DNA Expression Chain
    mainnet: 20232,    // QVTX DNA Mainnet
  },
  endpoints: {
    rpc42000: "https://dna.qvtx.io",
    rpc20232: "https://rpc.qvtx.io",
  },
};
