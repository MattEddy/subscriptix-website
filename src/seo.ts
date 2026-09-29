// Per-scene titles and descriptions. scripts/prerender.mjs writes these into
// each page's <head>; Layout.tsx keeps the tab title in step while navigating.
// Descriptions are what search results usually show under the link, so they
// name real capabilities in the words people search with.

export const SITE = "https://subscriptix.com";

export type Page = { path: string; title: string; description: string };

export const pages: Page[] = [
  {
    path: "/",
    title: "Subscriptix — Financial modeling and analytics for subscription businesses",
    description:
      "Cohort analysis, churn and retention modeling, and revenue and cash forecasting for subscription businesses. Connect your billing platform, generate a forecast in seconds, and work directly in Excel or Google Sheets.",
  },
  {
    path: "/features",
    title: "Features — Subscriptix",
    description:
      "Connect Stripe, Chargebee, Recurly, RevenueCat or Paddle, or import any file with AI-powered parsing. Model cohort retention and churn, detect win-backs, compare scenarios side by side, and roll models into revenue and cash forecasts.",
  },
  {
    path: "/pricing",
    title: "Pricing — Subscriptix",
    description:
      "Subscriptix is currently available by invitation. Get in touch to learn more or schedule a demo.",
  },
  {
    path: "/contact",
    title: "Contact Us — Subscriptix",
    description:
      "Questions about Subscriptix, or interested in a demo? Email info@subscriptix.com or send us a message.",
  },
];

export function pageFor(path: string): Page {
  return pages.find((p) => p.path === path) ?? pages[0];
}

// Structured data for the home page: who we are and what the product does.
// Search engines use it for richer results; AI systems read it as plain facts.
export const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Subscriptix",
    url: SITE,
    logo: `${SITE}/logo.png`,
    email: "info@subscriptix.com",
    sameAs: ["https://www.linkedin.com/company/subscriptix"],
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Subscriptix",
    url: SITE,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Financial modeling and analytics for subscription businesses: cohort-based forecasting models built from your billing or transaction data, with churn and retention modeling and revenue and cash forecasts.",
    featureList: [
      "Cohort analysis and cohort-based forecasting",
      "Churn and retention curve modeling with confidence intervals",
      "Reactivation and win-back modeling",
      "Subscription revenue and cash forecasting",
      "Side-by-side scenario comparison",
      "AI-powered parsing of CSV and spreadsheet data",
      "Live sync with Stripe, Chargebee, Recurly, RevenueCat and Paddle",
      "Two-way sync with Excel and Google Sheets",
    ],
  },
];
