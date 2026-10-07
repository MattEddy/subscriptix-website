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
- **Features must never change size between features:** the scene is vertically centred, so any height change in the stage re-centres everything, rail included (the 2026-09-29 bug: captions of 2–4 lines jumped the scene up to 30px). Captions and screenshots therefore sit stacked as `.features__layer`s in one grid cell, unselected ones `visibility: hidden`, so each card is as tall as its tallest occupant; short captions centre vertically. A new feature or a longer caption needs no code change — but don't swap back to `hidden`/`display: none` panels.
- **The Welcome hero's first line must fit on one line** at the 42px font ceiling: the scene is `min(920px, 68vw)`, widened from 880 on 2026-09-29 because "AI-powered financial modeling and analytics" needed 777px and had 774. Re-measure if the hero wording grows.
- Login fades the scene out (`html.leaving`) before leaving for the app; a `pageshow` handler clears it so Back never restores a blank page
- **The breathing mark (shared contract with the app's sign-in page, which should match it):** `.bg-mark` is `80vw` wide, `scale(0.708)` ↔ `scale(1)`, opacity `0.2`, `20s ease-in-out infinite alternate` (a 40 s cycle), phase keyed to the clock via `animation-delay: var(--mark-delay)`, where an inline script in `index.html` sets `--mark-delay = -((Date.now()/1000) % 40)s` before first paint
- **The app's sign-in pages wear this same frame** (app repo `projection/components/auth_frame.html` + `auth_footer.html`, styles in `src/styles/_rail-and-auth.scss`, built 2026-09-28). **The menu, the footer line, the mark numbers and the card shadow therefore exist in two codebases — change one, change both.** The app fades its middle out before leaving for the site, mirroring Login's fade here. The Login button points at `app.subscriptix.com/login/?next=/`, which the app redirects to its real sign-in page.
- **Footer text is `text-gray-600`, not lighter:** the footer line is the only text that sits directly on the mark, and over the mark's purple `gray-500` measured 3.3:1 (WCAG AA needs 4.5). `gray-600` is 5.15:1 at worst (2026-10-06 accessibility audit). The app's `auth_footer` needs the same shade.
- **Features has a visually hidden `<h1>`** (`sr-only`); the visible "Features" label is `aria-hidden` because it is `display: none` on phones.
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
    Footer.tsx      — email · LinkedIn · Privacy · Terms (→ app) · © Sparrowstep LLC
  scenes/
    Welcome.tsx     — headline card, two side cards on a diagonal, purple capability terms
    Features.tsx    — rail of feature cards + one stage whose caption and screenshot cards each stack all eight layers in one grid cell (one visible)
    Pricing.tsx     — invitation-only card → Contact Us
    Contact.tsx     — contact form (→ /api/contact)
    NotFound.tsx    — friendly 404 (route `*`, pre-rendered to dist/404.html)
api/contact.ts      — Vercel function: contact form → SES
scripts/prerender.mjs — writes dist/<scene>.html with real content + head tags, and sitemap.xml
scripts/og-image.html + og-image.mjs — the share-image mock and its renderer
public/
  mark.svg          — gradient logomark (the breathing background)
  logo.png, favicon.png
  shots/            — Features screenshots (source: ~/Documents/…/Subscriptix/September 2026 Website Elements/)
  og-image.png      — 1200×630 link-preview image
  robots.txt, llms.txt
```

## SEO / AI search
- The site is a client-rendered React app, so the build (`npm run build`) runs `scripts/prerender.mjs`: each scene is rendered to real HTML, so crawlers that don't run JavaScript (most AI crawlers) see the words. Features puts all eight captions in the HTML (each once; only the selected one visible) so every description is indexable.
- Each page gets its own title, description, canonical URL (apex `https://subscriptix.com`), Open Graph + Twitter tags; the home page also carries JSON-LD (Organization + SoftwareApplication with `featureList`). Edit these in `src/seo.ts`.
- Keep search terms accurate and in sentences — never hidden keyword lists (cloaking/spammy markup penalties). The visible purple term card on Welcome is where search terms belong.
- **Share image** (`public/og-image.png`, the link preview in Slack/iMessage/LinkedIn): rendered from `scripts/og-image.html`, a mock of the Welcome headline card at 1200×630. When the hero changes, edit the mock's `<h1>` to match, run `node scripts/og-image.mjs`, and bump `?v=` on the `og:image` tag in `scripts/prerender.mjs` (previews are cached by URL). Currently `v=2` ("AI-powered", 2026-09-29).

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

**Date:** 2026-10-04 (started 2026-09-30)
**Branch:** main

A short copy session. Both changes are pushed and live.

**Features copy (`src/scenes/Features.tsx`, commit `5adc99f`):**
- **Connect a Service** is now Matt's wording: "**Easily import data directly from most major billing platforms.** Then keep your models up-to-date with ongoing, automatic syncing." The first sentence keeps the bold, as the old first sentence had, so Connect is still one of the five bolded phrases. The old "Link your account…" sentence and the "Subscriptix gathers your transaction history" clause are gone.
- **Import Files:** "mapping every column" → "**automatically** mapping every column", inside the existing bold phrase.
- The layered caption cards absorb length changes, so these edits needed no layout work (see Design → Features above).

**`.DS_Store` untracked (commit `a4aed0c`).** Matt asked what it was and whether to delete it. It's the Finder's per-folder view-settings file and Finder recreates it, so deleting it wouldn't stick. Instead the two tracked copies were removed from git (`git rm --cached`, which leaves them on disk) and `.DS_Store` was added to `.gitignore`.

Nothing changed in the app repo this session.

### Open Items / Next Steps
- **Jon deploys the app** (master → Dev → Prod). Then this site's Privacy/Terms footer links and the app's new sign-in frame go live; do one real sign-in on production afterwards (it's the first production run of the passwordless system).
- **App footer still says "© 2026 Subscriptix"** — the site says Sparrowstep LLC. One line in the app's `projection/components/auth_footer.html`, but it's a PR through Jon's ~20-minute CI; Matt hasn't said when.
- **Delete the old Google Apps Script deployment** (script.google.com) — the SES form is confirmed working.
- **Search Console:** submit `sitemap.xml` if not done; check Pages/Performance in a few days.
- **Optional:** a tighter Reports screenshot (the wide strip renders small); a larger Services grab (original is 1106 px); a Google Sheets screenshot once the add-on exists.
- **Undecided:** whether visible captions should carry more search terms (e.g. "cohort" in Retention Modeling, "churn" in Compare) — Matt didn't pick; the captions were rewritten since and still carry neither.
