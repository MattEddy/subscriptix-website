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

**Date:** 2026-10-06
**Branch:** main

An accessibility session that started here and covered all seven of Matt's websites. Everything is pushed and live.

**How it started.** Staci sent Matt an Instagram post about California businesses being sued over websites that aren't ADA-compliant. Verdict given: the suits are real (about 5,100 nationwide in 2025; California's Unruh Act pays $4,000 per violation plus fees), but roughly 69% target e-commerce, and *Martinez v. Cot'n Wash* (Cal. Ct. App. 2022) gives online-only businesses a strong California defence. Exposure is low for every site; Buckethead is the most consumer-facing. Matt: "Better to be safe than sorry" — audit, then "Let's do it all", then "push everything live".

**The audit.** axe-core (WCAG 2.1 A/AA) on 30 live pages at desktop and phone widths, a keyboard Tab walk, and a reduced-motion check. No site had a lockout-type failure (unlabelled form, unreachable control, missing alt text); nearly everything was low-contrast text plus missing `<main>` landmarks and headings. The harness now lives in the `visual-verify` skill (`a11y-audit.mjs` for live sites, `a11y-local.mjs` for working trees).

**This repo (commit `a2fd600`):**
- `src/components/Footer.tsx`: `text-gray-500` → `text-gray-600`. The scanner could not judge this one (text over an image); measured by hand it was 3.3–3.7:1 over the mark, now 5.15:1 at worst.
- `src/scenes/Features.tsx`: a visually hidden `<h1>` and `aria-hidden` on the visible label.
- Both are recorded under Design above.

**The other six sites**, each with its own commit on `main`: Survival Box (landmark, underlined legal links, focusable table; no wording changed), Bossword (ink text on green and red fills, darker green/red/gray text, landmarks, headings), Vivi (darker cuts of the brand blue and magenta, gradient words now deep blue, landmarks), matteddy.com (footer gray, distinct video titles, the Claude guide — edited in its `thinkings` master and copied over), Buckethead (hero location line, landmark), Sparrowstep (lighter highlight cyan, landmark, heading). Matt reviewed the edited sites locally in Chrome before saying push.

**Two things worth knowing:**
- **Sparrowstep is not connected to GitHub auto-deploy.** The push did nothing; it went live with `vercel --prod`.
- **My polling for "is it live yet?" tripped Vercel's bot protection**, which then served this machine a 403 checkpoint on five sites. Their deployments are confirmed by GitHub's Vercel status, and the same commits scanned clean locally, but only Vivi and Sparrowstep were re-scanned live. Lesson is in the `web-gotchas` skill.

### Open Items / Next Steps
- **Re-scan the five sites that were behind the checkpoint** (Subscriptix, Buckethead, Survival Box, Bossword, matteddy.com): `node ~/.claude/skills/visual-verify/a11y-audit.mjs`, once. Expect one remaining contrast flag, the Bossword tagline, left at `#777` on purpose because it matches the wordmark's gray.
- **The app's sign-in footer needs two one-line changes** in the app repo (`projection/components/auth_footer.html` and its styles), both through Jon's ~20-minute CI: the darker footer shade to match this site, and "© 2026 Subscriptix" → Sparrowstep LLC. Matt hasn't said when.
- **Jon deploys the app** (master → Dev → Prod), if he hasn't yet. Then this site's Privacy/Terms footer links and the app's new sign-in frame go live; do one real sign-in on production afterwards (first production run of the passwordless system).
- **Bossword website:** another session's uncommitted work is still in that repo (`friend/`, `vercel.json`, the app-site-association file). Its new `friend/` page needs a `<main>` and an `<h1>` like the other pages. The site's ink-on-green buttons now differ from the app's white-on-green ones.
- **Not covered by the audit:** a real screen-reader pass, captions on the four videos at `matteddy.com/marketing`, form-error states, and Sparrowstep's slight sideways scroll on a phone (421px of content in a 390px screen).
- **Delete the old Google Apps Script deployment** (script.google.com) — the SES form is confirmed working.
- **Search Console:** submit `sitemap.xml` if not done; check Pages/Performance.
- **Optional:** a tighter Reports screenshot; a larger Services grab (original is 1106 px); a Google Sheets screenshot once the add-on exists.
- **Undecided:** whether visible captions should carry more search terms (e.g. "cohort" in Retention Modeling, "churn" in Compare).
