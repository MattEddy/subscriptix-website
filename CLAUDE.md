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
- **The app's sign-in pages wear this same frame** (app repo `projection/components/auth_frame.html` + `auth_footer.html`, styles in `src/styles/_rail-and-auth.scss`, built 2026-09-28). **The menu, the footer line, the mark numbers and the card shadow therefore exist in two codebases — change one, change both.** The app fades its middle out before leaving for the site, mirroring Login's fade here. The Login button points at `app.subscriptix.com/login/?next=/`, which the app redirects to its real sign-in page.
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

**Date:** 2026-09-28
**Branch:** main

Rebuilt the whole site in one long session, from "can we find the old login-page animation?" to a pre-rendered, SEO-ready site with its own email backend. All pushed and live.

**The lost animation.** Matt remembered a pulsing, growing faded logomark on the app's login page and thought Jon's working-login rewrite had dropped it. Git history plus the 2026-05-01 handoff log showed otherwise: a slow-zoom animation was workshopped that day and Matt vetoed it ("Nope. Too much."), so it never reached git; the transcript holding it had been pruned (Claude Code keeps ~30 days). Rebuilt it from the description for the marketing site instead, then tuned: first a bold 14 s zoom-and-fade, then a back-and-forth pulse, finally **~57%↔80% of screen width, 20 s each way** (Matt: 35 s was "a little slow", 28 s too; 20 s landed).

**The redesign — "match the login screen".** Matt: *"change the overall formatting of the page to match the login screen. IE, hovering cards. Subscriptix nameplate in the upper left, menu card in the upper right, and a set of content cards in the middle of the screen, forming a 'scene'."* Goals he set: each scene fits one laptop screen, and a *"centered, zen flow"* feel in design and transitions. Built as a fixed frame + scenes with View Transitions (old scene fades, new cards drift in one by one).
- **Welcome** (was "About"): started as a centered screenshot with text cards hovering over it; Matt cut the screenshot, then asked for no overlapping cards, bigger hero, deeper shadows (+50%), a two-line hero with bold phrases, and a diagonal of side cards (Connect/Generate/In seconds upper right; "Create supercharged models…" lower left with a solid-blue Learn More → Features). Added a purple capability-terms card lower right (14 px, 380 px wide) — doubles as visible search terms.
- **Features**: Matt was unsure how to present eight features; I argued against a carousel and proposed borrowing the app's rail + stage layout. Iterated to: FEATURES label card + one bold card-button per feature (selected = solid blue), caption card above the screenshot (20 px), no titles or step arrows in the caption. Copy drafted from the app repo's actual code/docs (connector registry, Claude-based comprehension engine, Excel mirror docs) with Matt's edits; added "Split & classify" from an unlisted screenshot.
- **Pricing**: invitation-only card → Contact Us. **Contact Us**: form in a card, new Message field, intro hidden after sending.
- **Menu**: About removed — Matt: *"this isn't really 'about' so much as 'Welcome'… maybe the nameplate is enough?"* The nameplate is the way home.
- **404**: friendly "Nothing to see here." scene, real 404 status.

**Contact form → Subscriptix SES.** The Apps Script backend used `no-cors`, so it could never report a failure. Replaced with `api/contact.ts` (Vercel function → SES on the Subscriptix AWS account, the identity the app already verified). Walked Matt through a new send-only IAM user (`subscriptix-website-contact`, inline policy `send-as-noreply-only`) and four Vercel env vars; `CONTACT_TO` takes a comma-separated list. Tested every path locally with fake creds (fake key → 502, never a false "thank you"); Matt sent a real message — delivered.

**Softening the jump to the app's login.** Clicking Login fades the scene before navigating; Back never restores a blank page (`pageshow`); the mark's phase is keyed to the clock so it can match across sites. A true cross-document transition is impossible (different origin).

**SEO / AI search.** Found every URL served an empty `<div id="root">` (AI crawlers see nothing), no robots/sitemap, no preview tags, and `www` + apex both serving the full site. Now: build-time pre-render of every scene (`scripts/prerender.mjs`), per-scene titles/descriptions/canonicals/OG + share image, JSON-LD, `robots.txt`, `sitemap.xml`, `llms.txt`, `www` → apex 308. Matt asked to hide search terms; advised against hidden keyword lists (ignored/penalized) and put accurate terms in structured data + meta descriptions, and he chose the visible purple term card. Walked him through Google Search Console DNS verification (he'd pasted the token into Squarespace's *Name* field; it belongs in *Text* with Name `@`); verified live via `dig`.

**Files:** everything under `src/` (new `App.tsx`, `entry-server.tsx`, `seo.ts`, `scenes/*`), `api/contact.ts`, `scripts/prerender.mjs`, `index.html`, `vercel.json`, `public/` (`mark.svg`, `shots/`, `og-image.png`, `robots.txt`, `llms.txt`; old screenshots/icons deleted), `CLAUDE.md` rewritten.

### Open Items / Next Steps
- **Step 3 — dress the app's sign-in pages in the site's frame** (Matt: "knock out 3 when we come back"). Lives in the **app repo** (`~/Code/subscriptix`, branch `CME-dev`; worth a heads-up to Jon, who built the auth flow): the allauth layouts (`accounts/templates/allauth/layouts/`) + `src/styles/_rail-and-auth.scss`. Add the menu card (Features · Pricing · Contact Us → `https://subscriptix.com/…`, **Login** shown active), nameplate linking to `https://subscriptix.com`, the breathing mark with the **exact numbers in "Design" above** (incl. the clock-phase script), the card drift-in, and the footer line. The menu then exists in two codebases — note it in both.
- **Delete the old Google Apps Script deployment** (script.google.com) — the SES form is confirmed working.
- **Search Console:** submit `sitemap.xml` if not done; check Pages/Performance in a few days.
- **Optional:** a tighter Reports screenshot (the wide strip renders small); a larger Services grab (original is 1106 px); a Google Sheets screenshot once the add-on exists.
- **Undecided:** whether visible captions should carry more search terms (e.g. "cohort" in Retention modeling, "churn" in Compare) — Matt didn't pick.
- **Unanswered:** untrack `.DS_Store` and add it to `.gitignore`?
