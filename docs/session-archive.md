# Session archive

Resolved or superseded Open Items, moved out of `CLAUDE.md` at handoff.

## 2026-09-29 — from the 2026-09-28 session's Open Items

- **Step 3 — dress the app's sign-in pages in the site's frame** (Matt: "knock out 3 when we come back"). Lives in the **app repo** (`~/Code/subscriptix`, branch `CME-dev`; worth a heads-up to Jon, who built the auth flow): the allauth layouts (`accounts/templates/allauth/layouts/`) + `src/styles/_rail-and-auth.scss`. Add the menu card (Features · Pricing · Contact Us → `https://subscriptix.com/…`, **Login** shown active), nameplate linking to `https://subscriptix.com`, the breathing mark with the **exact numbers in "Design" above** (incl. the clock-phase script), the card drift-in, and the footer line. The menu then exists in two codebases — note it in both.
  → **Done:** app PR #106, merged to master 2026-09-29 (also covers `/team-access/` and the legal pages, and adds the `/login/` redirect). Live once Jon deploys.

## 2026-09-28 — from the 2026-04-08 session's Open Items

- Section 1 still uses the generic app screenshot — could use a more specific one
  → **Superseded:** the zigzag page is gone; the site is now floating-card scenes and the Welcome scene has no screenshot (Matt's call). Features uses the September 2026 screenshots.
- Could add product demo video or animations
  → **Superseded:** the redesign added motion throughout (breathing mark, drifting cards, scene transitions). A demo video was not discussed.
- Further brand polish if desired (the brand guide has additional UI patterns not yet used)
  → **Superseded:** the redesign matched the app's own sign-in screen instead.
- Squarespace subscription already cancelled — domain still registered there as DNS host
  → **Not an open item — a fact.** It lives in `CLAUDE.md` → Deployment. (Nameservers are `ns-cloud-*.googledomains.com`, Squarespace's inherited Google Domains DNS.)
