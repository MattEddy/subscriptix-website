# Subscriptix Website

Marketing splash site for Subscriptix (subscription cohort projection tool). Replaces the old Squarespace site.

## Stack
- Vite + React + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin), plus hand-written component CSS in `src/index.css`
- React Router DOM v7: scenes at `/`, `/features`, `/pricing`, `/contact`
- Pre-rendered at build time (see SEO below), then hydrated in the browser
- Deployed to Vercel (`vercel.json`: `cleanUrls`, `www` → apex redirect; no SPA rewrite — every scene is a real file, and anything else gets `404.html` with a 404 status)

## Design: floating-card scenes
Matches the app's sign-in screen. A fixed **frame** (nameplate card upper left → home; menu card upper right: Features · Pricing · Contact Us · Login; small footer line) over a giant faded **breathing logomark**, with a **scene** of floating cards in the middle. No "About"/"Home" menu item — the nameplate is the way home.
- Scene change: `NavLink`/`Link` with `viewTransition` → the old scene fades (`::view-transition-old(scene)`), new cards drift in one after another (`.scene-card` + `--i` stagger)
- Features swaps panels the same way, fading only the stage (`stage-swap` class keeps the scene still)
- Login fades the scene out (`html.leaving`) before leaving for the app; a `pageshow` handler clears it so Back never restores a blank page
- **The breathing mark (shared contract with the app's sign-in page, which should match it):** `.bg-mark` is `80vw` wide, `scale(0.708)` ↔ `scale(1)`, opacity `0.2`, `20s ease-in-out infinite alternate` (a 40 s cycle), phase keyed to the clock via `animation-delay: var(--mark-delay)`, where an inline script in `index.html` sets `--mark-delay = -((Date.now()/1000) % 40)s` before first paint
- Card shadow: `0 1px 2px / 0 8px 20px / 0 20px 40px` in `rgba(10,11,15, .09/.105/.105)`; solid button `.button-solid` (`#055cda`)

## Structure
```
index.html          — head template: <!--seo--> and <!--app--> markers, mark-phase script
src/
  main.tsx          — BrowserRouter; hydrates pre-rendered HTML, else renders
  App.tsx           — the routes (shared by browser and build-time render)
  entry-server.tsx  — renderToString per route, for the prerender step
  seo.ts            — per-scene title + description, structured data (single source)
  index.css         — Tailwind, brand theme, frame, scenes, animations
  components/
    Layout.tsx      — mark + Header + scene <main> + Footer; syncs document.title
    Header.tsx      — nameplate card + menu card; Login fade-out
    Footer.tsx      — email · LinkedIn · ©
  scenes/
    Welcome.tsx     — headline card, two side cards on a diagonal, purple capability terms
    Features.tsx    — rail of feature cards + a panel per feature (all in the DOM, one shown)
    Pricing.tsx     — invitation-only card → Contact Us
    Contact.tsx     — contact form (→ /api/contact)
    NotFound.tsx    — friendly 404 (route `*`, pre-rendered to dist/404.html)
api/contact.ts      — Vercel function: contact form → SES
scripts/prerender.mjs — writes dist/<scene>.html with real content + head tags, and sitemap.xml
public/
  mark.svg          — gradient logomark (the breathing background)
  logo.png, favicon.png
  shots/            — Features screenshots (source: ~/Documents/…/Subscriptix/September 2026 Website Elements/)
  og-image.png      — 1200×630 link-preview image
  robots.txt, llms.txt
```

## SEO / AI search
- The site is a client-rendered React app, so the build (`npm run build`) runs `scripts/prerender.mjs`: each scene is rendered to real HTML, so crawlers that don't run JavaScript (most AI crawlers) see the words. Features puts all eight panels in the HTML (hidden except the selected one) so every description is indexable.
- Each page gets its own title, description, canonical URL (apex `https://subscriptix.com`), Open Graph + Twitter tags; the home page also carries JSON-LD (Organization + SoftwareApplication with `featureList`). Edit these in `src/seo.ts`.
- Keep search terms accurate and in sentences — never hidden keyword lists (cloaking/spammy markup penalties). The visible purple term card on Welcome is where search terms belong.
- To regenerate the share image, it was rendered from an HTML mock of the Welcome headline card at 1200×630 (Chrome screenshot).

## Brand
- Brand guide PDF: `~/Documents/03 Active Professional/Software/Subscriptix/Design - General/Brand Elements/subcriptix/Subscriptix ❖ Brand Kit + UI.pdf`
- Brand assets folder: same directory (logo-main-dark.png, logomark-main.png, etc.)
- Primary Blue: `#066FFC`, Secondary Purple: `#6D09BC`, gradient between them
- Brand Black: `#0A0B0F`, Brand Grey: `#888FAA`, Brand White: `#F9F9FB`
- Font: Assistant (Google Fonts) — Bold/Extra-Bold for headlines, Regular for body
- Login links to: `https://app.subscriptix.com/login/?next=/`
- Contact: `info@subscriptix.com`
- LinkedIn: `https://www.linkedin.com/company/subscriptix`

## Contact Form
- `src/scenes/Contact.tsx` POSTs JSON `{ name, email, message, website }` to `/api/contact`
- `api/contact.ts` is a Vercel serverless function that validates and sends through **AWS SES on the Subscriptix AWS account** (`us-west-2`) — the same verified `subscriptix.com` identity the app uses. From `Subscriptix <noreply@subscriptix.com>`, Reply-To = the visitor, plain text.
- `website` is a honeypot (hidden field): if filled, the function returns success and sends nothing
- The function returns real status codes, so the form shows an error when a send actually fails
- **Env vars (Vercel only, never committed):** `SES_ACCESS_KEY_ID`, `SES_SECRET_ACCESS_KEY` (IAM user `subscriptix-website-contact`, send-as-noreply-only policy — same JSON as the app's `docs/ses_setup.md`), `SES_REGION=us-west-2`, `CONTACT_TO` (recipient, or several comma-separated). Custom names because Vercel reserves `AWS_*`. Env changes need a redeploy.
- Local: `npm run dev` does not serve `/api`; use `vercel dev` (with env pulled) to exercise the function
- Replaced the old Google Apps Script backend (2026-09-28)

## Deployment
- GitHub: `MattEddy/subscriptix-website`
- Vercel: auto-deploys from `main` branch
- Custom domain: `subscriptix.com` (A record → `76.76.21.21`) and `www` (CNAME → `cname.vercel-dns.com`)
- DNS managed in Squarespace (domain registrar) — also has Google Workspace email records (SPF, DKIM) and AWS NS records for `app`/`dev` subdomains

## Notes
- Brand icon set: `~/Documents/03 Active Professional/Software/Subscriptix/Design - General/Icons/` (none currently used)
- Current screenshots: `~/Documents/03 Active Professional/Software/Subscriptix/September 2026 Website Elements/` (copied into `public/shots/`, resized to ≤2000 px wide — never upscale the smaller ones)

## Recent Session

**Date:** 2026-04-08
**Branch:** main

Reworked Section 2 ("Comprehensive data control") image layout into a montage.

**Image montage (Section 2):**
- Added two new screenshots to public/: reactivations, upload data
- Replaced the previous two-image spread (parameters left, aggregation below text) with a 4-image montage on the left side
- Reactivations screenshot is the main/background image; parameters, aggregation, and upload are overlaid as smaller cards
- Iterated positioning across several rounds: moved montage to left column, shifted overlay images outward (~2/3 off the main image), adjusted aggregation +25px right and upload +60px right, right-justified the text
- Two commits pushed to main, Vercel auto-deployed

**Previous session (2026-04-07):**
Polished the site for launch and deployed it live.

**Design overhaul to match brand guide:**
- Reviewed the Subscriptix Brand Kit PDF and updated everything to conform: swapped font from Inter to Assistant, updated color palette from indigo to brand blue (#066FFC) with purple (#6D09BC), replaced the CSS placeholder logo with the real brand logomark+wordmark PNG (`logo-main-dark.png`), swapped favicon to the gradient S logomark (`logomark-main.png`).
- Replaced all inline SVG icons with brand icons from the Subscriptix icon set.
- Made all sections dark-on-light (removed the dark gradient hero and CTA backgrounds).

**Page restructure:**
- Replaced the hero + feature cards + Excel section layout with three clean text+screenshot sections that alternate sides (zigzag pattern). Matt provided specific copy for each section.
- Section 1: "Financial modeling and analytics..." + main app screenshot (text left, image right)
- Section 2: "Comprehensive data control..." + image montage (left) with right-justified text (right). Montage: reactivations screenshot as main background, with parameters/aggregation/upload screenshots overlaid as a collage — individually positioned so ~2/3 hangs off the main image. Iterated on exact positioning across multiple rounds.
- Section 3: "Full Excel integration..." + Excel add-in screenshot (text left, image right)
- Reduced section padding by half across the board.
- Bottom CTA section retained.

**Contact form:**
- Replaced the `mailto:` hack with a Google Apps Script backend. Matt created the script in his Google Workspace account, deployed it as a web app. Form POSTs JSON to the Apps Script URL, which sends an email notification. Matt later changed the recipient email in the script.

**Deployment:**
- Initialized git repo, pushed to `MattEddy/subscriptix-website` on GitHub.
- Deployed to Vercel via CLI (`vercel --prod --yes`), auto-connected to GitHub for future deploys.
- Added custom domain `subscriptix.com` — walked through Squarespace DNS cleanup (removed old Squarespace A/CNAME records, kept Google Workspace email records and AWS NS records for app/dev subdomains). Added Vercel A record (`76.76.21.21`) and www CNAME (`cname.vercel-dns.com`). DNS propagated immediately, SSL provisioned, site live.

### Open Items / Next Steps
- Section 1 still uses the generic app screenshot — could use a more specific one
- Could add product demo video or animations
- Further brand polish if desired (the brand guide has additional UI patterns not yet used)
- Squarespace subscription already cancelled — domain still registered there as DNS host
