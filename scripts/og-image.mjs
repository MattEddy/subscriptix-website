// Renders scripts/og-image.html to public/og-image.png (the link-preview image).
// Uses system Chrome through the visual-verify skill's puppeteer-core, so it
// runs on Matt's Mac without adding a dependency here.
import { createRequire } from "module";
import { fileURLToPath } from "url";
const require = createRequire(process.env.HOME + "/.claude/skills/visual-verify/package.json");
const puppeteer = require("puppeteer-core");

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const b = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  args: ["--allow-file-access-from-files"],
});
const p = await b.newPage();
await p.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await p.goto("file://" + here("./og-image.html"), { waitUntil: "networkidle0" });
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: here("../public/og-image.png") });
await b.close();
