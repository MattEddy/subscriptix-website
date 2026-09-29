// Runs after `vite build` (see the build script in package.json). Renders each
// scene to real HTML so search engines and AI crawlers that don't run
// JavaScript still see the words, and gives each page its own <head>.
// Writes dist/index.html, dist/features.html, … (vercel.json's cleanUrls
// serves them at /features etc.), dist/404.html (Vercel serves it for any
// missing address) and dist/sitemap.xml.
import { readFile, writeFile, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const dist = resolve("dist");
const { render, pages, notFound, structuredData, SITE } = await import(
  pathToFileURL(resolve("dist-server/entry-server.js")).href
);
const template = await readFile(resolve(dist, "index.html"), "utf8");

const esc = (s) =>
  s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

for (const page of [...pages, notFound]) {
  const missing = page === notFound;
  const url = page.path === "/" ? `${SITE}/` : `${SITE}${page.path}`;
  const tags = missing ? [`<meta name="robots" content="noindex" />`] : [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Subscriptix" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE}/og-image.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    ...(page.path === "/"
      ? [`<script type="application/ld+json">${JSON.stringify(structuredData).replaceAll("<", "\\u003c")}</script>`]
      : []),
  ];
  const head = tags.join("\n    ");

  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(page.description)}" />`)
    .replace("<!--seo-->", head)
    .replace("<!--app-->", render(page.path));

  for (const marker of ["<!--seo-->", "<!--app-->"]) {
    if (html.includes(marker)) throw new Error(`prerender: ${marker} left in ${page.path}`);
  }
  const file = missing ? "404.html" : page.path === "/" ? "index.html" : `${page.path.slice(1)}.html`;
  await writeFile(resolve(dist, file), html);
  console.log(`prerendered ${page.path} -> dist/${file}`);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${p.path === "/" ? `${SITE}/` : `${SITE}${p.path}`}</loc></url>`).join("\n")}
</urlset>
`;
await writeFile(resolve(dist, "sitemap.xml"), sitemap);
await rm(resolve("dist-server"), { recursive: true, force: true });
console.log("wrote dist/sitemap.xml");
