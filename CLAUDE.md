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
    Header.tsx      — Sticky frosted-glass nav (logo, Learn More, Login)
    Footer.tsx      — Contact email, LinkedIn, copyright
  pages/
    Home.tsx        — Hero, feature cards, Excel integration, bottom CTA
    LearnMore.tsx   — Contact page with name/email form (mailto-based)
public/
  favicon.svg       — Indigo gradient "S" icon
```

## Brand
- Color: Indigo/purple (`brand-500: #6366f1` through `brand-950: #1e1b4b`)
- Font: Inter (Google Fonts)
- Login links to: `https://app.subscriptix.com/login/?next=/`
- Contact: `info@subscriptix.com`
- LinkedIn: `https://www.linkedin.com/company/subscriptix`

## Notes
- Contact form currently uses `mailto:` — can be swapped for Formspree or similar
- No images from old Squarespace site were migrated — feature sections use icon cards and placeholder illustration areas instead

## Recent Session

**Date:** 2026-03-24

Rebuilt the Subscriptix marketing site from scratch to replace Squarespace hosting. Fetched content from the live site at subscriptix.com, then scaffolded a Vite + React + TypeScript project with Tailwind CSS v4. Created a two-page site: home (hero with gradient, 4 feature cards, Excel integration section, bottom CTA) and Learn More/contact page (design partner copy, mailto form). All copy preserved from the original Squarespace site. Builds clean, dev server confirmed working.

### Open Items / Next Steps
- Initialize git repo, push to GitHub, connect to Vercel
- Point `subscriptix.com` DNS from Squarespace to Vercel
- Replace mailto form with a real form service (Formspree, etc.) if desired
- Add actual product screenshots/mockups if available
- Cancel Squarespace subscription once DNS is migrated
