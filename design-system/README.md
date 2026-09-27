# QVTX Codon — Design System v1.0

The design system for the QVTX ecosystem. Extracted from the two shipped
surfaces (`qvtx-nexus`, `qvtx-os`), reconciled against the QUANTVESTRIX brand of
record, and re-derived so that one token layer serves both.

```
design-system/
  tokens.css            Tier 1 primitives + Tier 2 semantics + shadcn bridge
  tokens.json           machine-readable source of truth (with provenance)
  components.css        Tier 3 recipes (panel, metric, status, helix, sequence)
  tailwind.preset.js    the token layer as Tailwind utilities
  README.md             this file
```

---

## 1. What the extraction found

Measured across `qvtx-nexus` (108 components, 53 shadcn primitives, 29 pages)
and `qvtx-os` (one static dashboard).

**There was no single design system. There were two, sharing nothing.**

| | qvtx-nexus | qvtx-os |
|---|---|---|
| Canvas | `#0a0b14` | `#0a0a0f` |
| Panel | `#0d0e16` | `#0d0d1a` |
| Primary text | `text-white` (957 usages) | `#00ff88` |
| Accent | cyan `#00d4ff` | purple `#8844ff` |
| Type | Orbitron + Inter | Courier New |
| Radius | `rounded-xl` (12px) | 8px |

Zero shared tokens. A component could not move between them.

### 1.1 The token layer was bypassed, and it was wired backwards

`src/index.css` defines a complete shadcn token set — light `:root` plus a
`.dark` block. Both are effectively dead:

- **`.dark` is never applied.** There is no `ThemeProvider`, no
  `classList.add('dark')`, no `next-themes` mount anywhere in `src/`. The
  dependency is installed and unused.
- **So every shadcn primitive resolves to the *light* palette** — `--card:
  0 0% 100%` (white), `--foreground: 0 0% 3.9%` (near-black) — while the app
  shell is hardcoded to `bg-[#0a0b14]`.
- That mismatch is live in the codebase today: `bg-background` (19 usages),
  `text-foreground` (19), `text-muted-foreground` (35) and `bg-card` (2) all
  render light-theme values on a dark shell.
- The workaround was to hardcode: **94 arbitrary `bg-[#hex]`/`text-[#hex]`
  bracket classes** and **957 `text-white`** usages.

`text-white` everywhere is why the app has no muted tier. `StatCard` set its
title to `text-sm text-white` and its subtitle to `text-xs text-white` — the
same colour as the value it was meant to support, so size alone carried three
levels of hierarchy.

### 1.2 The nucleotide palette contradicted itself

Two components mapped A/C/G/T to colours, and they disagreed:

| | A | C | G | T |
|---|---|---|---|---|
| `DNAEncoder.jsx` | cyan | emerald | amber | rose |
| `DNAHelix.jsx` | `#00d4ff` | `#ffd700` | `#10b981` | `#f472b6` |

Only A agreed. The same nucleotide rendered in three different colours
depending on which screen you were on.

### 1.3 The de facto palette was already the right shape

Accent usage across `src/`, counted:

```
cyan 506   emerald 461   amber 162   rose 159   violet 107   slate 48
```

Four dominant accents and a neutral — the shape of a four-base system was
already there in the usage data. It just had no name and no definition.

### 1.4 Brand conflicts

- **Purple: 139 usages** (`violet`/`purple`/`fuchsia`/`indigo`) in `qvtx-nexus`,
  plus `#8844ff` as the primary accent throughout `qvtx-os`. Purple is excluded
  from branded QVTX output.
- **Gold: two values.** The codebase used `#ffd700` (98 usages). The brand of
  record is Xpress Gold `#F5A623`.

---

## 2. The idea

> **The four bases are the palette.**

Not a metaphor applied to a palette after the fact — the accent system *is*
A/C/G/T, and the four UI states are the four bases. `qvtx-os` already encodes
`A=00 C=01 G=10 T=11` in `kernel/constants.js`; the visual layer now encodes the
same four things.

Base pairs are visual complements, which is what makes the set cohere:

```
A ── T        adenine cyan #00D4FF  ──  thymine gold  #F5A623      info / warning
C ── G        cytosine crimson      ──  guanine green #10B981      danger / success
              #E11D48
```

Two consequences worth stating plainly:

1. **Thymine and the brand primary are the same value.** Xpress Gold `#F5A623`
   *is* base T. The brand primary is a base, not an exception to the system.
2. **Cytosine is crimson because purple is excluded.** The source DNA colour
   system specified `#8B5CF6` for cytosine. Crimson is the substitute, and it is
   also the true visual complement of guanine green — so the brand constraint
   and the colour theory agree.

---

## 3. Palette

Every pair below is **measured**, not estimated. Body text clears 4.5:1; text at
24px and above clears 3:1.

### 3.1 The bases

Each base has a **fill** value and a **text** value, because a fill that looks
right is not always legible as type.

| Base | Role | Fill | Text on dark | on panel | Text on Ice | on Ice |
|---|---|---|---|---|---|---|
| **A** Adenine | info | `#00D4FF` | `#00D4FF` | 10.87 | `#0E7490` | 4.95 |
| **T** Thymine | warning / primary | `#F5A623` | `#F5A623` | 9.49 | `#B45309` | 4.64 |
| **G** Guanine | success | `#10B981` | `#10B981` | 7.58 | `#047857` | 5.06 |
| **C** Cytosine | danger | `#E11D48` | `#FB7185` | 7.15 | `#BE123C` | 5.80 |

> **The one rule you must not break:** `#E11D48` measures **4.10:1** on the dark
> panel. It fails as body text. Use it for fills, strokes and bars; use
> `#FB7185` (`--qvtx-danger`) for any crimson *type* on dark. The token layer
> already splits these into `--qvtx-danger` and `--qvtx-danger-fill`.

Likewise Xpress Gold measures **1.87:1** on Ice — it is a fill on light
surfaces, never text. Gold type on light is `#B45309`.

### 3.2 Brand core

| Token | Value | Use |
|---|---|---|
| Xpress Gold | `#F5A623` | primary, CTAs, highlights |
| Signal Gold | `#FFD700` | on-dark glow and telemetry only |
| DNA Navy | `#0A2540` | text on gold (7.67:1), light-theme headings |
| Charcoal | `#2E2E2E` | body text, light theme |
| Ice | `#F4F6F8` | primary text on dark (17.76:1), light canvas |

`#FFD700` was the codebase's most-used colour and is not discarded — it is
demoted to the luminous on-dark signal tint, where its 13.72:1 on the panel is
an asset.

### 3.3 Surfaces

Four of the five dark steps are lifted verbatim from shipped code.

| Step | Dark | Provenance | Ice |
|---|---|---|---|
| sunken | `#080910` | observed | `#E8ECF0` |
| canvas | `#0A0B14` | `src/Layout.jsx` | `#F4F6F8` |
| panel | `#0D0E16` | `GlassCard`, `StatCard` | `#FBFCFD` |
| raised | `#0F1019` | `PortalCard` | `#FFFFFF` |
| overlay | `#14151F` | derived | `#FFFFFF` |

### 3.4 Text tiers

| Tier | Dark | on panel | Ice | on Ice |
|---|---|---|---|---|
| primary | `#F4F6F8` | 17.76 | `#0A2540` | 14.34 |
| secondary | `#A8B2C1` | 8.98 | `#2E2E2E` | 12.54 |
| muted | `#7D8898` | 5.36 | `#5A6674` | 5.40 |

`#6B7687` was the first candidate for the muted tier. It measured **4.18:1** and
was rejected. It is recorded in `tokens.css` so it does not come back.

### 3.5 Colour never speaks alone

A status, a delta, a risk level or a highlighted row states its meaning in text
as well as colour (`+4.2% · over plan`, not a green number alone). The
`.codon-status` recipe pairs every dot with a worded label for this reason.

---

## 4. Type

| Role | Face | Job |
|---|---|---|
| Display | **Orbitron** 600/700/900 | headings, wordmarks, stat values |
| Text | **Inter** 400/500/600/700 | all body copy |
| Data | **JetBrains Mono** 400/500/700 | figures, sequences, addresses, code |

Orbitron and Inter already ship. The third slot is the real addition: there were
**82 `font-mono` usages with no mono face ever defined**, so they fell back to
whatever the browser chose, and `qvtx-os` set Courier New for its entire UI.
JetBrains Mono closes both gaps, and gives figures tabular digits so live values
stop reflowing as they tick.

Scale — eight steps, never more than five on one screen:

```
caption 12 · small 14 · body 16 · lead 20 · h3 24 · h2 32 · h1 44 · display 64
```

Emphasise with weight, colour or the mono face — not with a new size.

---

## 5. Spacing, radius, motion

**PHI spacing.** `PHI = 1.618034`. Fibonacci approximates PHI at whole pixels,
so the scale is PHI-true without fractional values:

```
phi-1 8 · phi-2 13 · phi-3 21 · phi-4 34 · phi-5 55 · phi-6 89 · phi-7 144
```

Use the PHI scale for **section and stack rhythm**. Keep component internals on
the 4px grid, so the scale never fights `p-4` / `gap-3`.

**Radius**, weighted by what actually shipped:

| Token | Value | Shipped usage |
|---|---|---|
| control | 8px | `rounded-lg` × 176 |
| card | 12px | `rounded-xl` × 371 — the dominant radius |
| panel | 16px | `rounded-2xl` × 50 |
| portal | 24px | `rounded-3xl` × 7 |
| pill | full | × 107 |

shadcn's `--radius` moves from `0.5rem` to `0.75rem` to match the 371-usage
reality.

**Motion**, anchored to the durations already in use, at a ~PHI ratio:

| Token | Value | For | Shipped |
|---|---|---|---|
| instant | 120ms | colour-only state | — |
| fast | 200ms | controls | × 31 |
| base | 320ms | cards | `duration-300` × 13 |
| slow | 520ms | portal reveals | `duration-500` × 6 |
| pulse | 1500ms | live indicators | `qvtx-os` live-dot |

All of it is wrapped in `prefers-reduced-motion: reduce`, which the shipped
dashboard did not honour.

---

## 6. Component recipes

Each recipe is a shape that already existed as scattered literal classes.

| Recipe | Replaces | Notes |
|---|---|---|
| `.codon-panel` | `GlassCard` | `--interactive`, `--lift` modifiers |
| `.codon-rule` | `qvtx-os .panel::before` | the shared mark — see below |
| `.codon-metric` | `StatCard` | restores the label/value/subtitle hierarchy |
| `.codon-status` | `.live-dot`, `#conn-status` | dot + worded label, always |
| `.codon-helix` | `DNAHelix` | canonical base colours |
| `.codon-sequence` | `DNAEncoder` per-base classes | mono, tracked |
| `.codon-eyebrow` | `qvtx-os .panel h2` | uppercase tracked label |
| `.codon-glow-*` | `.dna-glow-*` | same values, display type only |
| `.codon-focusable` | *nothing* | there was no consistent focus treatment |

**The codon rule** is the system's one unifying motif. `qvtx-os` drew a 2px
gradient bar across the top of every dashboard panel (`.panel::before`) — the
only piece of deliberate visual identity in that surface. It is promoted to the
shared mark across both apps, and its gradient runs A → T, cyan into gold: a
base pair.

### Rarity ramp

`RarityBadge` used `#A78BFA` (purple) for EPIC. Re-derived on the base palette
as an ascending-heat ramp whose steps differ in lightness as well as hue:

| Tier | Was | Now | Base |
|---|---|---|---|
| COMMON | `#9CA3AF` | `#94A3B8` | slate |
| RARE | `#60A5FA` | `#00D4FF` | A |
| EPIC | `#A78BFA` | `#10B981` | G |
| LEGENDARY | `#FBBF24` | `#F5A623` | T |
| MYTHIC | `#F472B6` | `#E11D48` | C |

---

## 7. Two themes, not light-and-dark

`theme-dna` (default, dark) and `theme-ice` (light — print, PDF, documents).
Both define the same Tier 2 role names, so **components need no changes to work
in either.** There is no `dark:` variant in this system: there is no light/dark
pair, there are two named themes and the token layer resolves both.

```html
<html class="theme-dna">   <!-- or theme-ice -->
```

Glow is a dark-surface effect; it resolves to `none` in the Ice theme, where it
reads as smudge.

---

## 8. Adopting it

```js
// tailwind.config.js
module.exports = {
  presets: [require('./design-system/tailwind.preset.js')],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
};
```

```css
/* src/index.css — before @tailwind base */
@import './../design-system/tokens.css';
@import './../design-system/components.css';
```

Then set `class="theme-dna"` on `<html>` in `index.html`.

The shadcn bridge in `tokens.css` means **all 53 primitives in
`src/components/ui` start resolving to Codon immediately**, with no component
edits — and, for the first time, to dark values on the dark shell.

### Migration map

| Replace | With |
|---|---|
| `bg-[#0a0b14]` | `bg-canvas` |
| `bg-[#0d0e16]` | `bg-panel` |
| `bg-[#0f1019]` | `bg-raised` |
| `text-white` (957) | `text-ink` / `text-ink-secondary` / `text-ink-muted` |
| `text-cyan-400`, `#00d4ff` | `text-info` / `text-base-a` |
| `text-emerald-400`, `#10b981` | `text-success` / `text-base-g` |
| `text-amber-400`, `#ffd700` | `text-warning` / `text-base-t` |
| `text-rose-400` | `text-danger` |
| `violet` / `purple` / `fuchsia` / `indigo` (139) | `info` or `danger` by role |
| `rounded-xl` | `rounded-card` |
| `duration-300` | `duration-base` |
| `font-mono` | resolves to JetBrains Mono — no change needed |

For `qvtx-os`, whose dashboard is one static HTML file: link `tokens.css` and
`components.css` directly, then swap `#00ff88` → `--qvtx-success`, `#8844ff` →
`--qvtx-primary`, `#ff4444` → `--qvtx-danger`, `#ffaa00` → `--qvtx-warning`,
Courier New → `--codon-font-data`, and `.panel::before` → `.codon-rule`. The
panels then match `qvtx-nexus` without a rewrite.

---

## 9. Scope of this change

This commit adds the system. **It does not migrate the 108 existing components**
— that is mechanical follow-on work, and doing it in the same change would bury
the system definition in a 5,000-line diff.

What lands here is the definition plus the bridge, which is the part that has to
be right first. Adopting the preset changes rendering immediately (shadcn
primitives go from light to dark values), so the first migration PR should be
`src/index.css` + `tailwind.config.js` + `index.html` together, then pages in
batches.

Not yet done, and worth tracking:

- Migrating the 94 arbitrary hex bracket classes and 957 `text-white` usages.
- Retiring the 139 purple usages.
- Deleting the dead `.dark` block from `src/index.css`.
- Either mounting `next-themes` against `theme-dna`/`theme-ice`, or removing the
  unused dependency.
- Adding a CI check that fails on new `#hex` literals under `src/`.
