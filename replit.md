# Admiz Agency

A premium multi-page marketing website for Admiz Agency — a Meta & Google Agency Ad Accounts provider. Dark luxury SaaS aesthetic with electric blue accents, glassmorphism, particle effects, and Framer Motion animations throughout.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/razr-agency run dev` — run the website (reads PORT from env)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, Framer Motion, recharts v3 (React 19 compatible)
- Routing: Wouter
- Icons: lucide-react, react-icons/si
- API: Express 5 (api-server artifact, minimal — site is frontend-only)

## Where things live

- `artifacts/razr-agency/src/pages/` — pages: Home, Features, Solutions, AgencyAccounts, HowItWorks, About, Faq, Contact, Terms, Privacy, Refund
- `artifacts/razr-agency/src/components/layout/` — Navbar, Footer, PageWrapper
- `artifacts/razr-agency/src/components/LoadingScreen.tsx` — Animated loading screen
- `artifacts/razr-agency/src/lib/whatsapp.ts` — Contact URL lib (buildWaLink returns Telegram URL)
- `artifacts/razr-agency/src/index.css` — Dark theme CSS variables + Space Grotesk/Inter fonts

## Architecture decisions

- Frontend-only site (no DB, no backend routes needed — all content is static)
- Always-dark mode: `dark` class forced on `<html>` via useEffect in App.tsx
- CSS variables use space-separated HSL values (no `hsl()` wrapper) per Tailwind v4 conventions
- Google Fonts imported at the very top of index.css (before @import "tailwindcss") to avoid PostCSS failure
- Particle background uses HTML Canvas API with requestAnimationFrame — no external library needed
- `buildWaLink()` in `src/lib/whatsapp.ts` always returns `https://t.me/AdmizAgency` — all CTA links go to Telegram

## Product

Multi-page premium agency website for **Admiz Agency**:
1. **Home** — Hero with particle background, stats counters, problem/solution, ROI simulator, case study, FAQ preview, book-call section
2. **Features** — Feature cards, spend specs, comparison table, founder pull-quote, final CTA
3. **Solutions** — Problem cards, pillars, result timeline, before/after comparison
4. **Agency Accounts** — Meta + Google account detail sections
5. **How It Works** — Animated alternating timeline with 5 steps
6. **About** — Company story, mission/vision, animated counters, values grid
7. **FAQ** — Full accordion with categories
8. **Contact** — Premium glass form + Telegram + Email contact channels

## User preferences

- Company name: **Admiz Agency** (not RAZR)
- Domain/email: admiz.agency / scale@admiz.agency
- Telegram: https://t.me/AdmizAgency — only contact channel (no WhatsApp number anywhere)
- No pricing on site — users contact via Telegram to discuss
- Site copy in English only; user communicates in Hindi/Hinglish

## Gotchas

- Google Fonts `@import url(...)` MUST be first line of index.css — PostCSS fails silently otherwise
- Loading screen auto-dismisses after 400ms
- Recharts must be v3+ for React 19 (v2 throws "Cannot read properties of null (reading 'useRef')")
- The shadcn `ui/chart.tsx` wrapper is NOT compatible with recharts v3 — do not reintroduce it
- Global effects (CursorGlow, NoiseTexture, AmbientLights) mount once in App.tsx inside TooltipProvider
- The site has no backend API calls — do not add react-query hooks unless adding a real backend endpoint
- JSX string literals with embedded HTML (`<span className="...">`) — use plain `"` NOT `\"` in JSX text nodes
- `buildWaLink` accepts WaIntent + extras for API compat but ignores them — always returns Telegram URL

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
