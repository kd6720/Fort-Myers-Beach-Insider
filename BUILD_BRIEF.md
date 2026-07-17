# Build Brief — Fort Myers Beach Insider
### Instructions for Claude Code (claude-fable-5) · Prepared by Carter Dewey · July 2026

You are building a public marketing website that promotes Fort Myers Beach and the surrounding Fort Myers area as an incredible real estate investment opportunity — specifically **beach property as a dual-use asset: use it when you want, run it as a short-term rental when you're not there.**

Everything you need is in this kit. Do not invent statistics — every number you publish must come from `content.json` or `docs/FMB_Research_Appendix_July2026.md`.

---

## 1. Goal & audience

**Goal:** Position Fort Myers Beach as the smartest beach-property buy on the Gulf Coast in 2026, and capture leads (email signups / contact requests) from prospective buyers and investors.

**Audience:** Beach-property buyers and STR investors in Southwest Florida and feeder markets (Midwest, Northeast, East Coast Florida); second-home and 1031 buyers; agents and referral partners.

**Core message (use this framing everywhere):**
> A beach house here isn't either/or. Block the weeks you want. Rent the rest. Weekly rentals are legal by right in the Gulf-side zone, and large new homes gross $80K–$166K a year — on an island where prices are down 9–18%, hotel supply is 41% below pre-Ian levels, and $1.7B of airport capacity is being built 25 minutes away.

## 2. Tone rules (non-negotiable)

- Write like an experienced operator, not a marketing intern. Confident, specific, no hype.
- No buzzwords, no fake urgency, no exaggerated claims. Never claim amenities or venues that aren't open yet.
- Every stat visible on the site must trace to `content.json`. Cite "Data as of July 2026" near data blocks.
- Include this disclaimer in the footer and on the investment pages: *"Informational only — not financial, legal, or tax advice. Data as of July 2026 from public sources; verify independently before transacting."*
- Accuracy guardrails: RSW's Concourse E (14 gates) completes end of 2027 — the Phase 1 checkpoint finishes 2029; don't say the whole expansion is "done." The Seagate/Red Coconut condo project is approved but its site was listed for sale May 2026 — don't cite it as certain. Present the -10.2% 2026 metro forecast honestly as the buyer's-market entry argument.

## 3. Site structure (single-page-first; sections can become routes later)

1. **Hero** — full-bleed beach image (`assets/prospectus-pages/page-11.png` bottom image aesthetic, or page-01 hero). Headline: "Own the beach. Use it when you want. Rent it when you don't." Sub: one-sentence thesis + CTA button ("Get the 2026 Prospectus").
2. **The Opportunity** — the four thesis pillars from `content.json > core_thesis.pillars` as stat cards.
3. **Dual-Use Math** — the lifestyle + income pitch: STR ADR $370–$425, average listing grosses $33K–$46K/yr, large 5-6BR homes $80K–$166K/yr, weekly rentals legal Gulf-side. Simple visual: "Your weeks" vs "Rental weeks" calendar graphic.
4. **The Island Is Back** — rebuild proof: $23M beach complete, Margaritaville, new $17.7M pier (2027–28), Times Square rebuild, 40+ restaurants, parks program, events calendar. Use `island_rebuild` from content.json.
5. **Market Snapshot** — housing table (median $546K–$575K, SF $1.23M, condo $579K, lots $745K median, 95% of sales below list, 11–13 months supply). Frame as the 2026 entry window.
6. **The Regional Engine** — three cards: RSW ($1.7B expansion, record 11.15M passengers), Lee County growth (+15.1%, Babcock Ranch, $820M hospital), Downtown Fort Myers ($6B redevelopment, River District). Use `regional_engine`.
7. **Ways In** — the investment ladder table from `investment_ladder` (older condo → condo-hotel → legacy SF → lot + build → new elevated 5-6BR sweet spot). Be honest about condo SIRS/assessment risk.
8. **The Prospectus** — embed/preview the 11 page images (`assets/prospectus-pages/page-01.png` … `page-11.png`) as a flip-through gallery; button downloads the full PDF from Supabase Storage.
9. **Risks, stated plainly** — short section: insurance volatility, pier timing, storm exposure, project uncertainty. This builds credibility; keep it.
10. **Lead capture + footer** — email capture ("Get the prospectus + market updates"), contact link, disclaimer, "Data sources" list from `content.json > sources`.

## 4. Tech stack & deployment

- **Repo:** `https://github.com/kd6720/Fort-Myers-Beach-Insider` (owner: kd6720). Commit the site here.
- **Stack:** Static site — plain HTML/CSS/JS or Astro/Vite (your choice; keep the build simple and fast). Fully responsive, mobile-first. Lighthouse 90+ on performance and SEO.
- **Hosting:** GitHub Pages. Add a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and publishes to Pages on push to `main`. Enable Pages via the workflow (`actions/deploy-pages`).
- **Design language:** match the prospectus — white/soft sand backgrounds, deep navy headlines, ocean teal accents, generous whitespace, thin wave-line motifs. Fonts: a clean geometric sans (e.g., Inter/Archivo). No dark corporate templates.
- **Images:** use the 11 exported prospectus pages in `assets/prospectus-pages/` (794×1123 PNG) for the gallery; crop page hero imagery for section backgrounds where useful. Optimize (WebP conversions welcome) and lazy-load.

### Supabase (file storage + optional leads)

- Create a Supabase project; create a **public storage bucket** named `fmb-insider`.
- Upload: `docs/Fort Myers Beach - 2026 Investment Prospectus.pdf`, `docs/FMB_Research_Appendix_July2026.md`, and the page PNGs. Use the public URLs for the site's "Download the Prospectus" button and gallery (or serve PNGs locally from the repo and keep only the PDF on Supabase — your call, but the PDF download must come from Supabase Storage per the owner's request).
- Store the Supabase URL + anon key in the site via environment/config constants; **never commit the service-role key**.
- Optional but preferred: a `leads` table (email text, created_at timestamptz, source text) with Row Level Security enabled and an insert-only policy for anon; wire the email-capture form to it via `@supabase/supabase-js`. If you skip this, use a mailto/Formspree fallback — but leave the Supabase wiring stubbed and documented.

## 5. SEO

- Title: "Fort Myers Beach Real Estate Investment — Own the Beach, Rent It When You're Away | Fort Myers Beach Insider"
- Meta description (~155 chars): "Fort Myers Beach 2026: prices down, hotel supply 41% below pre-Ian, weekly rentals legal Gulf-side. The dual-use beach investment, explained with data."
- Target queries: "Fort Myers Beach real estate investment", "Fort Myers Beach vacation rental investment", "beach house investment Florida", "Fort Myers Beach new construction homes".
- Add OpenGraph/Twitter cards (use page-01.png as OG image), JSON-LD (WebSite + Article), sitemap.xml, robots.txt, canonical URL.

## 6. Files in this kit

| Path | What it is |
|---|---|
| `BUILD_BRIEF.md` | This brief — your instructions |
| `content.json` | ALL site copy data: thesis, market stats, rebuild status, regional engine, investment ladder, risks, sources |
| `docs/Fort Myers Beach - 2026 Investment Prospectus.pdf` | The 11-page designed prospectus (the downloadable asset) |
| `docs/FMB_Research_Appendix_July2026.md` | Full research detail + source list (use for deeper copy; publish as a "Data Room" page if desired) |
| `assets/prospectus-pages/page-01.png … page-11.png` | Page images of the prospectus (794×1123) for gallery/section art |

Page map: 01 cover · 02 exec summary · 03 infrastructure · 04 development pipeline · 05 parks & dining (photo collage — good for lifestyle sections) · 06 housing market table · 07 hotels & rentals table · 08 RSW · 09 regional growth · 10 downtown Fort Myers · 11 bottom line (beach photo — good hero candidate).

## 7. Definition of done

- Site builds clean, deploys to GitHub Pages from `main` via Actions, renders correctly on mobile and desktop.
- Prospectus PDF downloads from Supabase Storage; gallery shows all 11 pages.
- Every published number matches `content.json`; disclaimer and risks section present; sources listed.
- Lead capture works (Supabase table or documented fallback).
- README.md documents: local dev, deploy, Supabase setup (bucket + keys + leads table SQL), and how to update `content.json` for future data refreshes.
