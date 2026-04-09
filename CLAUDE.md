# Subscriptix Website

Marketing splash site for Subscriptix (subscription cohort projection tool). Replaces the old Squarespace site.

## Stack
- Vite + React + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- React Router DOM v7 (two routes: `/` and `/contact`)
- Deployed to Vercel (`vercel.json` handles SPA rewrites)

## Structure
```
src/
  main.tsx          — Router setup, two routes
  index.css         — Tailwind import + brand color theme
  components/
    Layout.tsx      — Shell: Header + Outlet + Footer
    Header.tsx      — Sticky frosted-glass nav (brand logo image, Learn More, Login)
    Footer.tsx      — Contact email, LinkedIn, copyright
  pages/
    Home.tsx        — Three text+screenshot sections, bottom CTA
    LearnMore.tsx   — Contact page with name/email form (Google Apps Script)
public/
  logo.png                  — Brand logo (logomark + wordmark, dark, from brand kit)
  favicon.png               — Logomark (gradient S, from brand kit)
  screenshot-app.png        — Main app screenshot (retention curves view)
  screenshot-parameters.png — Parameters panel screenshot
  screenshot-aggregation.png — Model aggregation dialog screenshot
  screenshot-excel.png      — Excel add-in screenshot
  icons/                    — Brand SVG icons (line-chart, duplicate, model, parameters)
```

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
- Uses Google Apps Script (Matt's Google Workspace account) as backend
- POSTs JSON `{ name, email }` to the Apps Script deployment URL
- Script sends email notification to configured recipient
- To change recipient email: script.google.com > edit project > change email > Manage deployments > Edit > bump version > Deploy (URL stays the same)
- Uses `mode: "no-cors"` since Apps Script doesn't return proper CORS headers

## Deployment
- GitHub: `MattEddy/subscriptix-website`
- Vercel: auto-deploys from `main` branch
- Custom domain: `subscriptix.com` (A record → `76.76.21.21`) and `www` (CNAME → `cname.vercel-dns.com`)
- DNS managed in Squarespace (domain registrar) — also has Google Workspace email records (SPF, DKIM) and AWS NS records for `app`/`dev` subdomains

## Notes
- Brand icons from `~/Documents/03 Active Professional/Software/Subscriptix/Design - General/Icons/` — currently only 4 copied to public/icons, but full set available there
- Screenshots from `~/Documents/03 Active Professional/Software/Subscriptix/Website/Website Refresh 2025-04-15/`

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
