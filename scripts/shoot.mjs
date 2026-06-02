import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:3000";
const OUT = process.env.OUT || "/opt/cursor/artifacts/assets";
mkdirSync(OUT, { recursive: true });

// shots: [name, path, fullPage, width, height, waitMs]
const shots = JSON.parse(process.env.SHOTS || "[]");

const exe =
  "/usr/bin/google-chrome-stable";

const browser = await puppeteer.launch({
  executablePath: exe,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});

for (const s of shots) {
  const { name, path, full = true, w = 1440, h = 900, wait = 700, mobile = false } = s;
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: mobile ? 2 : 1 });
  const url = BASE + path;
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    await new Promise((r) => setTimeout(r, wait));
    const file = `${OUT}/${name}.png`;
    await page.screenshot({ path: file, fullPage: full });
    console.log("OK  ", file);
  } catch (e) {
    console.error("FAIL", url, e.message);
  }
  await page.close();
}

await browser.close();
