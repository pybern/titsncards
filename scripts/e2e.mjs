import puppeteer from "puppeteer-core";

const BASE = process.env.BASE || "http://localhost:3000";
const exe = "/usr/bin/google-chrome-stable";
let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log("  ✓", n)) : (fail++, console.error("  ✗", n)); };

const browser = await puppeteer.launch({
  executablePath: exe,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
const text = () => page.evaluate(() => document.body.innerText);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function clickText(tag, label) {
  const handle = await page.evaluateHandle(
    (t, l) => [...document.querySelectorAll(t)].find((e) => e.innerText.trim().includes(l)),
    tag, label,
  );
  const el = handle.asElement();
  if (!el) throw new Error(`no ${tag} with text "${label}"`);
  await el.click();
}
async function fill(ph, val) {
  const sel = `input[placeholder="${ph}"]`;
  await page.click(sel, { clickCount: 3 });
  await page.type(sel, val, { delay: 8 });
}
async function fillCheckout(cardNumber) {
  await page.goto(`${BASE}/checkout`, { waitUntil: "networkidle2" });
  await sleep(500);
  await fill("Monkey D. Luffy", "Test Captain");
  await fill("captain@grandline.sea", "test@example.com");
  await fill("1 Thousand Sunny Way", "1 Sunny Way");
  await fill("Foosha", "Foosha");
  await fill("East Blue", "East Blue");
  await fill("00001", "00001");
  await fill("M. D. LUFFY", "TEST CAPTAIN");
  await fill("4242 4242 4242 4242", cardNumber);
  await fill("12/28", "12/28");
  await fill("123", "123");
}

try {
  console.log("\n[1] Add to cart");
  await page.goto(`${BASE}/product/shanks-op01-120`, { waitUntil: "networkidle2" });
  await sleep(600);
  await clickText("button", "Add to hold");
  await sleep(500);
  const store = await page.evaluate(() => JSON.parse(localStorage.getItem("tnc-store") || "{}"));
  ok("cart has 1 item after add", store?.state?.cart?.length === 1);

  console.log("\n[2] Checkout — invalid card is rejected");
  await fillCheckout("1234567890123456"); // fails Luhn
  await clickText("button", "Pay ");
  await sleep(600);
  ok("invalid card shows error", /Invalid card number/.test(await text()));
  ok("stayed on checkout", page.url().includes("/checkout") && !page.url().includes("success"));

  console.log("\n[3] Checkout — valid card succeeds");
  await fillCheckout("4242424242424242");
  await clickText("button", "Pay ");
  await page.waitForFunction(() => location.pathname.includes("/checkout/success/"), { timeout: 30000 });
  await sleep(400);
  const t3 = await text();
  ok("order confirmed page reached", /Order confirmed/.test(t3));
  ok("shows order id TNC-", /TNC-/.test(t3));
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem("tnc-store") || "{}"));
  ok("cart cleared after order", (after?.state?.cart?.length ?? 0) === 0);
  ok("order saved to store", (after?.state?.orders?.length ?? 0) >= 1);

  console.log("\n[4] Orders page lists the order");
  await page.goto(`${BASE}/orders`, { waitUntil: "networkidle2" });
  await sleep(500);
  ok("orders page shows order id", /TNC-/.test(await text()));

  console.log("\n[5] Sell flow creates a listing");
  await page.goto(`${BASE}/sell`, { waitUntil: "networkidle2" });
  await sleep(500);
  const chip = await page.evaluate(
    () => [...document.querySelectorAll("button")].find((b) => b.className.includes("rounded-full"))?.innerText.trim() || "",
  );
  await clickText("button", chip);
  await sleep(400);
  await page.click('input[placeholder="0.00"]', { clickCount: 3 });
  await page.type('input[placeholder="0.00"]', "99.99", { delay: 10 });
  await clickText("button", "List for sale");
  await sleep(500);
  ok("listing confirmation shown", /is live|LIST-/.test(await text()));
  const sell = await page.evaluate(() => JSON.parse(localStorage.getItem("tnc-store") || "{}"));
  ok("listing saved to store", (sell?.state?.listings?.length ?? 0) >= 1);
} catch (e) {
  fail++;
  console.error("  ✗ EXCEPTION:", e.message);
}

console.log(`\n${fail === 0 ? "ALL E2E PASSED ✓" : fail + " E2E FAILED ✗"}  (${pass} passed)\n`);
await browser.close();
process.exit(fail === 0 ? 0 : 1);
