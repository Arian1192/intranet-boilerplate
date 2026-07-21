import { chromium } from '/home/arian/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const BASE = 'https://bookings.conceptoneagency.com';
const USER = 'test@blackmoose.es';
const PASS = 'Concept1234';
const OUT = '/tmp/claude-1000/-home-arian-dev-Boilerplate/048dff11-83f9-4d7f-9a8c-df62e8023a60/scratchpad/live-scan';
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const log = (...a) => console.log(...a);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
await sleep(800);
await page.fill('input[type=email], input[name=email]', USER);
await page.fill('input[type=password], input[name=password]', PASS);
await page.click('button[type=submit], button:has-text("Iniciar"), button:has-text("Entrar")');
await page.waitForLoadState('networkidle');
await sleep(2500);

async function dump(path, waitMs = 2200) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 25000 });
  await sleep(waitMs);
  const data = await page.evaluate(() => {
    const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
    // all button labels (SPA nav)
    const buttons = [...new Set(Array.from(document.querySelectorAll('button')).map(b => clean(b.textContent)).filter(t => t && t.length < 40))];
    // stat/card headings
    const cards = Array.from(document.querySelectorAll('h1,h2,h3,h4')).map(h => clean(h.textContent)).filter(Boolean);
    return { path: location.pathname, title: document.title, cards: [...new Set(cards)], buttons, text: clean(document.body.innerText).slice(0, 1500) };
  });
  const slug = path.replace(/\//g, '_') || '_root';
  await page.screenshot({ path: `${OUT}/deep${slug}.png`, fullPage: true });
  fs.writeFileSync(`${OUT}/deep${slug}.json`, JSON.stringify(data, null, 2));
  log(`\n===== ${path} (${data.path}) =====`);
  log('CARDS:', data.cards.slice(0, 25).join(' | '));
  log('BODY:', data.text.slice(0, 900));
  return data;
}

for (const p of ['/', '/mixmag', '/tagmag', '/incidencias', '/conceptone', '/euphoric', '/cruda', '/configuracion', '/personal', '/creativos']) {
  try { await dump(p); } catch (e) { log(`ERR ${p}: ${e.message}`); }
}

log('\n== DONE ==');
await browser.close();
