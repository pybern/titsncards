import puppeteer from "puppeteer-core";
const BASE="http://localhost:3000";
let pass=0,fail=0; const ok=(n,c)=>{c?(pass++,console.log("  ✓",n)):(fail++,console.error("  ✗",n));};
const b=await puppeteer.launch({executablePath:"/usr/bin/google-chrome-stable",headless:"new",args:["--no-sandbox","--disable-gpu","--disable-dev-shm-usage"]});
const page=await b.newPage(); await page.setViewport({width:1280,height:1000});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const text=()=>page.evaluate(()=>document.body.innerText);
async function clickText(t,l){const h=await page.evaluateHandle((t,l)=>[...document.querySelectorAll(t)].find(e=>e.innerText.trim().includes(l)),t,l);const el=h.asElement();if(!el)throw new Error("no "+t+" "+l);await el.click();}
try{
  console.log("\n[market index]");
  await page.goto(`${BASE}/market`,{waitUntil:"networkidle2"});await sleep(700);
  ok("has Top Gainers", /Top Gainers/.test(await text()));
  ok("has The Index table", /The Index/.test(await text()));
  const svgCount=await page.$$eval("svg",e=>e.length); ok("sparklines render (svg present)", svgCount>5);
  // sort by clicking a header
  await clickText("button","Last"); await sleep(300);
  ok("still renders after sort", /Last/.test(await text()));

  console.log("\n[market detail]");
  await page.goto(`${BASE}/market/shanks-op01-120`,{waitUntil:"networkidle2"});await sleep(800);
  ok("price chart present (polyline)", (await page.$$("polyline")).length>0);
  ok("StatGrid renders (Highest Bid/52w)", /Highest Bid/i.test(await text()) && /52w High/i.test(await text()));
  ok("Recent Sales table", /Recent Sales/.test(await text()));
  // range toggle 1Y
  await clickText("button","1Y"); await sleep(400);
  ok("1Y range toggled (polyline still there)", (await page.$$("polyline")).length>0);
  // hover over chart center
  const svg=await page.$("svg"); const box=await svg.boundingBox();
  await page.mouse.move(box.x+box.width*0.5, box.y+box.height*0.5); await sleep(300);
  // place a bid
  await clickText("button","Place Bid"); await sleep(500);
  ok("bid toast shown", /Bid placed \(simulated\)/.test(await text()));
}catch(e){fail++;console.error("  ✗ EXC:",e.message);}
console.log(`\n${fail===0?"ALL MARKET E2E PASSED ✓":fail+" FAILED ✗"} (${pass} passed)\n`);
await b.close(); process.exit(fail===0?0:1);
