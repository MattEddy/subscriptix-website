# Subscriptix Website

Marketing splash site for Subscriptix (subscription cohort projection tool). Replaces the old Squarespace site.

## Stack
- Vite + React + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin), plus hand-written component CSS in `src/index.css`
- React Router DOM v7: scenes at `/`, `/features`, `/pricing`, `/contact`
- Pre-rendered at build time (see SEO below), then hydrated in the browser
- Deployed to Vercel (`vercel.json`: `cleanUrls`, `trailingSlash: false` so `/features/` redirects to `/features`, `www` → apex redirect; no SPA rewrite — every scene is a real file, and anything else gets `404.html` with a 404 status)

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
- **One address per page:** `www`, `http://`, `.html` and trailing-slash variants all 308 to the clean apex address, and each page's canonical tag points to itself. Before 2026-09-28 `www` and the apex both served the page with no redirect and no canonical tag, so Google's index started out preferring `www`.
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

**Date:** 2026-10-07
**Branch:** main

A short Search Console session. One config change, pushed and live.

**How it started.** Matt got a Google Search Console email, "New reason preventing your pages from being indexed: Duplicate, Google chose different canonical than user", and asked whether it was worth fixing. The Page indexing report showed 8 indexed, 9 not indexed across 5 reasons, for a site with four real pages.

**What it turned out to be.** The one affected URL was the home page, `https://subscriptix.com/`. URL Inspection showed user-declared canonical `https://subscriptix.com/` and Google-selected canonical `https://www.subscriptix.com/`, last crawl Sep 29. Cause: until commit `c1321f7` (2026-09-28) `www` and the apex both served the page with no redirect and no canonical tag, and Google had settled on `www`; it crawled the apex hours after the redirect went in and has not revisited. Nothing is wrong on the site: canonicals, the `www`/`http`/`.html` redirects, the 404 and the sitemap all checked out live. It heals when Google re-crawls `www` and hits the 308. Matt was told to click Request Indexing and Validate Fix; expect days to a couple of weeks. Most of the other "not indexed" rows are probably old Squarespace addresses and URL variants (inferred from the counts, not seen).

**The one change (commit `02fdace`):** `vercel.json` gained `"trailingSlash": false`. `/features/` had been serving the page instead of redirecting; it and `/pricing/` now 308 to the clean address (verified live).

**Sitemap.** Matt submitted `https://subscriptix.com/sitemap.xml` in Search Console. It showed "Couldn't fetch" with a blank "Last read", which is Search Console's usual placeholder before the first fetch. The file returns 200 as `application/xml` to a Googlebot user agent from this Mac (not proof of what the real Googlebot gets).

**Also noticed:** the old Squarespace site is still live at `https://manatee-turtle-j8xn.squarespace.com/` (Google lists it as the home page's referring page). Its canonical tag points to `subscriptix.com`, so it is harmless to indexing, but it is a public stale copy.

### Open Items / Next Steps
- **Check Search Console in a day or two.** Sitemaps: if "Last read" has a date and the status is still "Couldn't fetch", that is a real failure; run URL Inspection → Test Live URL on the sitemap address and read what the real Googlebot got. Page indexing: the home page should move to indexed under the apex address within a couple of weeks; if Google-selected canonical is still `www` after that, look again.
- **Old Squarespace site still public** at `manatee-turtle-j8xn.squarespace.com`. The subscription was cancelled long ago, so it may only need unpublishing or may lapse by itself. Take down the website only: the domain registration and DNS live in that Squarespace account.
- **Re-scan the five sites that were behind the Vercel checkpoint** (Subscriptix, Buckethead, Survival Box, Bossword, matteddy.com): `node ~/.claude/skills/visual-verify/a11y-audit.mjs`, once. Expect one remaining contrast flag, the Bossword tagline, left at `#777` on purpose because it matches the wordmark's gray. (This site answered plain requests normally on 2026-10-07, so the checkpoint has cleared here.)
- **The app's sign-in footer needs two one-line changes** in the app repo (`projection/components/auth_footer.html` and its styles), both through Jon's ~20-minute CI: the darker footer shade to match this site, and "© 2026 Subscriptix" → Sparrowstep LLC. Matt hasn't said when.
- **Jon deploys the app** (master → Dev → Prod), if he hasn't yet. Then this site's Privacy/Terms footer links and the app's new sign-in frame go live; do one real sign-in on production afterwards (first production run of the passwordless system).
- **Bossword website:** another session's uncommitted work is still in that repo (`friend/`, `vercel.json`, the app-site-association file). Its new `friend/` page needs a `<main>` and an `<h1>` like the other pages. The site's ink-on-green buttons now differ from the app's white-on-green ones.
- **Not covered by the accessibility audit (2026-10-06):** a real screen-reader pass, captions on the four videos at `matteddy.com/marketing`, form-error states, and Sparrowstep's slight sideways scroll on a phone (421px of content in a 390px screen).
- **Delete the old Google Apps Script deployment** (script.google.com) — the SES form is confirmed working.
- **Optional:** a tighter Reports screenshot; a larger Services grab (original is 1106 px); a Google Sheets screenshot once the add-on exists.
- **Undecided:** whether visible captions should carry more search terms (e.g. "cohort" in Retention Modeling, "churn" in Compare).
