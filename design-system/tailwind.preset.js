/**
 * QVTX CODON — Tailwind preset
 *
 * Exposes the Codon token layer as Tailwind utilities so components stop
 * reaching for literal hex values. Import design-system/tokens.css once (it
 * defines the custom properties this preset points at), then:
 *
 *   // tailwind.config.js
 *   module.exports = {
 *     presets: [require('./design-system/tailwind.preset.js')],
 *     content: ['./index.html', './src/**\/*.{ts,tsx,js,jsx}'],
 *   }
 *
 * The shadcn/Radix semantic names (background, card, primary, muted, ...) are
 * kept so all 53 primitives in src/components/ui keep working unchanged — they
 * now resolve through the bridge block in tokens.css instead of shadcn's light
 * defaults.
 *
 * Theme switching is a class on <html>: `theme-dna` (default) or `theme-ice`.
 * There is no `dark:` variant in this system, because there is no light/dark
 * pair — there are two named themes, and the token layer resolves both.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '.theme-dna'],
  theme: {
    extend: {
      colors: {
        /* --- Codon semantic roles ------------------------------------- */
        canvas: 'var(--qvtx-canvas)',
        sunken: 'var(--qvtx-sunken)',
        panel: 'var(--qvtx-panel)',
        raised: 'var(--qvtx-raised)',
        overlay: 'var(--qvtx-overlay)',

        ink: {
          DEFAULT: 'var(--qvtx-text)',
          secondary: 'var(--qvtx-text-secondary)',
          muted: 'var(--qvtx-text-muted)',
        },

        /* --- The four bases. Use `base-a` .. `base-t` when the meaning is
         * genetic (a codon view, a helix, a sequence). Use the status names
         * below when the meaning is state. Same values, different intent. */
        base: {
          a: 'var(--codon-adenine)',
          c: 'var(--codon-cytosine)',
          g: 'var(--codon-guanine)',
          t: 'var(--codon-thymine)',
        },

        info: 'var(--qvtx-info)',
        success: 'var(--qvtx-success)',
        warning: 'var(--qvtx-warning)',
        danger: {
          DEFAULT: 'var(--qvtx-danger)' /* text-safe tint */,
          fill: 'var(--qvtx-danger-fill)' /* fills and strokes only */,
        },
        neutral: 'var(--qvtx-neutral)',

        gold: {
          DEFAULT: 'var(--codon-gold-500)',
          signal: 'var(--codon-gold-300)',
          deep: 'var(--codon-gold-700)',
        },
        navy: 'var(--codon-navy-900)',
        ice: 'var(--codon-ice-50)',

        /* --- shadcn/Radix bridge (do not remove: 53 primitives depend on it) */
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },

      borderColor: {
        subtle: 'var(--qvtx-border-subtle)',
        strong: 'var(--qvtx-border)',
        accent: 'var(--qvtx-border-accent)',
      },

      borderRadius: {
        control: 'var(--codon-radius-control)',
        card: 'var(--codon-radius-card)',
        panel: 'var(--codon-radius-panel)',
        portal: 'var(--codon-radius-portal)',
        /* shadcn expects these three */
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      fontFamily: {
        display: 'var(--codon-font-display)',
        sans: 'var(--codon-font-text)',
        mono: 'var(--codon-font-data)',
        /* kept so the 74 existing .font-orbitron usages keep resolving */
        orbitron: 'var(--codon-font-display)',
      },

      fontSize: {
        caption: ['var(--codon-size-caption)', { lineHeight: '1.4' }],
        small: ['var(--codon-size-small)', { lineHeight: '1.45' }],
        body: ['var(--codon-size-body)', { lineHeight: '1.6' }],
        lead: ['var(--codon-size-lead)', { lineHeight: '1.5' }],
        h3: ['var(--codon-size-h3)', { lineHeight: '1.25' }],
        h2: ['var(--codon-size-h2)', { lineHeight: '1.2' }],
        h1: ['var(--codon-size-h1)', { lineHeight: '1.12' }],
        display: ['var(--codon-size-display)', { lineHeight: '1.05' }],
      },

      letterSpacing: {
        display: 'var(--codon-tracking-display)',
        eyebrow: 'var(--codon-tracking-eyebrow)',
      },

      /* PHI rhythm. Available as p-phi-4, gap-phi-3, mt-phi-5, ... */
      spacing: {
        'phi-1': 'var(--codon-phi-1)',
        'phi-2': 'var(--codon-phi-2)',
        'phi-3': 'var(--codon-phi-3)',
        'phi-4': 'var(--codon-phi-4)',
        'phi-5': 'var(--codon-phi-5)',
        'phi-6': 'var(--codon-phi-6)',
        'phi-7': 'var(--codon-phi-7)',
      },

      boxShadow: {
        card: 'var(--qvtx-shadow-card)',
        lift: 'var(--qvtx-shadow-lift)',
        'glow-a': 'var(--qvtx-glow-adenine)',
        'glow-t': 'var(--qvtx-glow-thymine)',
        'glow-signal': 'var(--qvtx-glow-signal)',
      },

      transitionDuration: {
        instant: 'var(--codon-dur-instant)',
        fast: 'var(--codon-dur-fast)',
        base: 'var(--codon-dur-base)',
        slow: 'var(--codon-dur-slow)',
      },

      transitionTimingFunction: {
        'codon-out': 'var(--codon-ease-out)',
        'codon-lift': 'var(--codon-ease-lift)',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        /* The live indicator, carried over from the qvtx-os dashboard. */
        'codon-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        /* Base-pair shimmer for helix strips. */
        'codon-transcribe': {
          '0%': { opacity: '0.35' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.35' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down var(--codon-dur-fast) var(--codon-ease-out)',
        'accordion-up': 'accordion-up var(--codon-dur-fast) var(--codon-ease-out)',
        'codon-pulse': 'codon-pulse var(--codon-dur-pulse) ease-in-out infinite',
        'codon-transcribe': 'codon-transcribe 2400ms ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
