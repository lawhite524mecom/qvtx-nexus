// qvtxpress_ingest.ts
// QvtXpress layered ingestion:
//   EDGE adapter (per protocol)  ->  CORE canonical shape  ->  DERIVATION (finite fingerprint)
//   ->  PROVENANCE (ByteID + hash, on-chain anchor; PII off-chain)  ->  off-chain store
//
// This file implements the PARTNER-XSD edge adapter. Other adapters (ISO 20022, ACH, on-chain)
// implement the same EdgeAdapter contract and feed the same core. The bank/chain/partner are
// always reached through their own protocol + auth — the core sits behind them, it does not bypass them.
//
// Wording invariant: we derive the SHAPE and its PROVENANCE — never funds. The chain holds an
// immutable provenance record ALONGSIDE the bank's ledger; it does not move or create value.
//
// Runtime: Deno (Base44 backend function). Replace the marked INTEGRATION POINTS.

import { XMLParser } from "npm:fast-xml-parser@4";

const NS = "https://api.qvtx.example/v1";
const ENUMS = {
  entityType: ["family_office", "sovereign", "asset_manager", "fund"],
  eligibility: ["accredited", "qualified_purchaser", "reg_s"],
  rail: ["wire", "ach", "stablecoin", "qvtx_pay", "in_kind"],
};

// ===== CORE: the canonical QvtXpress shape (rail-independent) =====
type CanonicalShape = {
  kind: "onboarding_handoff";
  source: { protocol: string; partnerId: string; partnerRef: string | null };
  entity: { legalName: string; type: string; jurisdiction: string; registrationNumber: string | null };
  contact: { name: string; email: string; title: string | null };
  beneficialOwners: { name: string; ownershipPct: number | null; pep: boolean }[];
  eligibilityBasis: string;
  sourceOfFunds: string | null;
  contribution: { rail: string; amount: number; currency: string | null; assetType: string | null };
  consent: { byteIdAcknowledged: boolean; timestamp: string };
  event: { capturedAt: string; nonce: string };
};

// ===== EDGE: adapter contract — every protocol implements this =====
interface EdgeAdapter {
  protocol: string;
  authenticate(req: Request): Promise<boolean>;       // counterparty's own auth, like everyone else
  parse(req: Request): Promise<unknown>;               // protocol-native -> raw object
  validate(raw: unknown): ValidationError[];           // schema rules for this protocol
  toCanonical(raw: unknown): CanonicalShape;           // raw -> canonical QvtXpress shape
}
type ValidationError = { field: string; message: string };

// ----- Partner-XSD adapter -----
const partnerXsdAdapter: EdgeAdapter = {
  protocol: "partner-xsd/v1",

  async authenticate(req) {
    const key = req.headers.get("X-API-Key");
    return !!key && (await isValidPartnerKey(key)); // INTEGRATION POINT
  },

  async parse(req) {
    const xml = await req.text();
    return new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", parseTagValue: true }).parse(xml);
  },

  validate(raw: any) {
    const e: ValidationError[] = [];
    const root = raw?.OnboardingHandoff;
    if (!root) return [{ field: "OnboardingHandoff", message: "missing root" }];
    const req = (v: any, f: string) => { if (v === undefined || v === null || v === "") e.push({ field: f, message: "required" }); };
    const inEnum = (v: any, l: string[], f: string) => { if (v !== undefined && !l.includes(String(v))) e.push({ field: f, message: `one of ${l.join(", ")}` }); };
    req(root.Partner?.["@_id"], "Partner.id");
    req(root.Entity?.LegalName, "Entity.LegalName");
    inEnum(root.Entity?.Type, ENUMS.entityType, "Entity.Type");
    req(root.Entity?.Jurisdiction, "Entity.Jurisdiction");
    req(root.AuthorizedContact?.Name, "AuthorizedContact.Name");
    req(root.AuthorizedContact?.Email, "AuthorizedContact.Email");
    inEnum(root.Eligibility?.["@_basis"], ENUMS.eligibility, "Eligibility.basis");
    inEnum(root.Contribution?.Rail, ENUMS.rail, "Contribution.Rail");
    const amt = root.Contribution?.Amount;
    const amtVal = typeof amt === "object" ? amt?.["#text"] : amt;
    if (amtVal === undefined || isNaN(Number(amtVal))) e.push({ field: "Contribution.Amount", message: "required numeric" });
    const ack = root.Consent?.["@_byteIdAcknowledged"];
    if (ack !== true && ack !== "true") e.push({ field: "Consent.byteIdAcknowledged", message: "must be true" });
    req(root.Consent?.["@_timestamp"], "Consent.timestamp");
    return e;
  },

  toCanonical(raw: any): CanonicalShape {
    const root = raw.OnboardingHandoff;
    const owners = root.BeneficialOwners?.Owner;
    const arr = owners ? (Array.isArray(owners) ? owners : [owners]) : [];
    const amt = root.Contribution.Amount;
    return {
      kind: "onboarding_handoff",
      source: { protocol: "partner-xsd/v1", partnerId: root.Partner["@_id"], partnerRef: root.Partner["@_ref"] ?? null },
      entity: { legalName: root.Entity.LegalName, type: root.Entity.Type, jurisdiction: root.Entity.Jurisdiction, registrationNumber: root.Entity.RegistrationNumber ?? null },
      contact: { name: root.AuthorizedContact.Name, email: root.AuthorizedContact.Email, title: root.AuthorizedContact.Title ?? null },
      beneficialOwners: arr.map((o: any) => ({ name: o.Name, ownershipPct: o.OwnershipPct != null ? Number(o.OwnershipPct) : null, pep: o.Pep === true || o.Pep === "true" })),
      eligibilityBasis: root.Eligibility["@_basis"],
      sourceOfFunds: root.SourceOfFunds ?? null,
      contribution: { rail: root.Contribution.Rail, amount: Number(typeof amt === "object" ? amt["#text"] : amt), currency: typeof amt === "object" ? amt["@_currency"] : null, assetType: root.Contribution.AssetType ?? null },
      consent: { byteIdAcknowledged: true, timestamp: root.Consent["@_timestamp"] },
      event: { capturedAt: new Date().toISOString(), nonce: crypto.randomUUID() },
    };
  },
};

// ===== DERIVATION: finite, non-duplicatable fingerprint =====
// Derived from the event's defining inputs + a nonce, bound to a collision-resistant hash.
// The nonce guarantees distinct fingerprints even when business properties are identical.
async function deriveFingerprint(shape: CanonicalShape): Promise<{ fingerprint: string; hash: string }> {
  const canonicalInputs = JSON.stringify({
    kind: shape.kind, partnerId: shape.source.partnerId, entity: shape.entity.legalName,
    rail: shape.contribution.rail, amount: shape.contribution.amount, currency: shape.contribution.currency,
    capturedAt: shape.event.capturedAt, nonce: shape.event.nonce,
  });
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalInputs));
  const hash = "0x" + [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
  // Finite fixed-length fingerprint projected from the hash (the QvtXpress "shape" id).
  const fingerprint = "QX-" + hash.slice(2, 26).toUpperCase();
  return { fingerprint, hash };
}

// ===== PROVENANCE: ByteID + anchor (hash only; PII off-chain) =====
function mintByteId(): string {
  const b = crypto.getRandomValues(new Uint8Array(16));
  return "BID-" + [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

// ===== XML responses =====
const esc = (s: string) => String(s).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!));
const resultXml = (o: Record<string, string>) => `<?xml version="1.0" encoding="UTF-8"?>
<OnboardingHandoffResult xmlns="${NS}">
  <ApplicationId>${esc(o.applicationId)}</ApplicationId>
  <ByteId>${esc(o.byteId)}</ByteId>
  <Fingerprint>${esc(o.fingerprint)}</Fingerprint>
  <Status>${esc(o.status)}</Status>
  <AnchorStatus>${esc(o.anchorStatus)}</AnchorStatus>
  <PartnerRef>${o.partnerRef ? esc(o.partnerRef) : ""}</PartnerRef>
  <Received>${esc(o.received)}</Received>
</OnboardingHandoffResult>`;
const errorXml = (errs: ValidationError[]) => `<?xml version="1.0" encoding="UTF-8"?>\n<ErrorResponse xmlns="${NS}" code="VALIDATION_FAILED">\n${errs.map((e) => `  <Error field="${esc(e.field)}">${esc(e.message)}</Error>`).join("\n")}\n</ErrorResponse>`;
const xmlResp = (body: string, status: number) => new Response(body, { status, headers: { "Content-Type": "application/xml" } });

// ===== HANDLER: edge -> core -> derivation -> provenance -> store =====
export default async function handler(req: Request): Promise<Response> {
  const adapter = partnerXsdAdapter;

  if (!(await adapter.authenticate(req)))
    return xmlResp(`<?xml version="1.0"?><ErrorResponse code="UNAUTHORIZED">Invalid or missing API key.</ErrorResponse>`, 401);

  let raw: unknown;
  try { raw = await adapter.parse(req); }
  catch { return xmlResp(`<?xml version="1.0"?><ErrorResponse code="MALFORMED">Could not parse payload.</ErrorResponse>`, 400); }

  const errs = adapter.validate(raw);
  if (errs.length) return xmlResp(errorXml(errs), 422);

  const shape = adapter.toCanonical(raw);                 // CORE canonical shape
  const { fingerprint, hash } = await deriveFingerprint(shape); // DERIVATION (finite, nonce-protected)
  const byteId = mintByteId();                            // PROVENANCE id

  // INTEGRATION POINT — persist off-chain (all PII stays here):
  const saved = await saveEnrollmentApplication({
    ...shape, byteId, fingerprint, recordHash: hash,
    reviewStatus: "pending_review", anchorStatus: "pending_anchor",
  });

  // INTEGRATION POINT — anchor byteId + hash ONLY (never PII), alongside the bank ledger:
  await queueAnchor({ byteId, fingerprint, hash, applicationId: saved.id });

  return xmlResp(resultXml({
    applicationId: saved.id, byteId, fingerprint, status: "pending_review",
    anchorStatus: "pending_anchor", partnerRef: shape.source.partnerRef ?? "", received: shape.event.capturedAt,
  }), 201);
}

// ===== Base44 integration stubs =====
async function isValidPartnerKey(_key: string): Promise<boolean> { return true; }
async function saveEnrollmentApplication(data: any): Promise<{ id: string }> { return { id: "APP-" + crypto.randomUUID() }; }
async function queueAnchor(_p: { byteId: string; fingerprint: string; hash: string; applicationId: string }): Promise<void> {}
