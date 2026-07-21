import { chromium } from '/home/arian/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const BASE = 'https://bookings.conceptoneagency.com';
const USER = 'test@blackmoose.es';
const PASS = 'Concept1234';
const OUT = '/tmp/claude-1000/-home-arian-dev-Boilerplate/048dff11-83f9-4d7f-9a8c-df62e8023a60/scratchpad/live-scan';
fs.mkdirSync(OUT, { recursive: true });

const log = (...a) => console.log(...a);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// ---- LOGIN ----
log('== LOGIN ==');
await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
await sleep(1000);
try {
  await page.fill('input[type=email], input[name=email], input[placeholder*="mail" i]', USER);
  await page.fill('input[type=password], input[name=password]', PASS);
  await page.click('button[type=submit], button:has-text("Iniciar"), button:has-text("Entrar"), button:has-text("Log")');
  await page.waitForLoadState('networkidle');
  await sleep(2500);
} catch (e) { log('login fill error', e.message); }
log('after login url:', page.url());
await page.screenshot({ path: `${OUT}/00-home.png`, fullPage: true });

// ---- capture nav / home structure ----
async function grabNav() {
  return await page.evaluate(() => {
    const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
    const links = Array.from(document.querySelectorAll('a[href]'))
      .map(a => ({ text: clean(a.textContent), href: a.getAttribute('href') }))
      .filter(l => l.href && l.href.startsWith('/') && l.text && l.text.length < 60);
    // dedupe
    const seen = new Set();
    const uniq = links.filter(l => { const k = l.href + '|' + l.text; if (seen.has(k)) return false; seen.add(k); return true; });
    // headings that look like module groups
    const headings = Array.from(document.querySelectorAll('h1,h2,h3'))
      .map(h => clean(h.textContent)).filter(Boolean);
    return { links: uniq, headings, title: document.title };
  });
}

const home = await grabNav();
fs.writeFileSync(`${OUT}/home-nav.json`, JSON.stringify(home, null, 2));
log('HOME headings:', home.headings.slice(0, 30).join(' | '));
log('HOME links count:', home.links.length);

// discover unique top-level route roots
const roots = new Set();
for (const l of home.links) {
  const seg = l.href.split('?')[0].split('#')[0].split('/').filter(Boolean)[0];
  if (seg) roots.add('/' + seg);
}
// also add known/expected roots to force-visit
['/', '/conceptone', '/etra', '/produccion', '/euphoric', '/creativos', '/cruda',
 '/crm', '/personal', '/configuracion', '/mi-trabajo', '/mixmag', '/tagmag',
 '/incidencias', '/team'].forEach(r => roots.add(r));

log('ROOTS to visit:', [...roots].join(', '));

// ---- visit each root, capture sub-nav ----
const report = { loginUrl: page.url(), home, routes: {} };
let i = 0;
for (const root of [...roots].sort()) {
  i++;
  const url = `${BASE}${root === '/' ? '' : root}`;
  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
    await sleep(1500);
    const status = resp ? resp.status() : 0;
    const info = await page.evaluate(() => {
      const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
      const h1 = clean(document.querySelector('h1')?.textContent);
      // sub-nav: tabs/links inside header/nav areas
      const tabs = Array.from(document.querySelectorAll('nav a, [role=tablist] a, [role=tab], header a'))
        .map(a => clean(a.textContent)).filter(t => t && t.length < 40);
      const subLinks = Array.from(document.querySelectorAll('a[href]'))
        .map(a => ({ text: clean(a.textContent), href: a.getAttribute('href') }))
        .filter(l => l.href && l.href.startsWith('/') && l.text);
      const bodyText = clean(document.body.innerText).slice(0, 400);
      return { h1, tabs: [...new Set(tabs)], subLinks, bodyText, url: location.pathname };
    });
    report.routes[root] = { status, ...info };
    const slug = root.replace(/\//g, '_') || '_root';
    await page.screenshot({ path: `${OUT}/${String(i).padStart(2,'0')}${slug}.png`, fullPage: true });
    log(`[${status}] ${root} -> ${info.url} | h1="${info.h1}" | tabs: ${info.tabs.slice(0,12).join(', ')}`);
  } catch (e) {
    report.routes[root] = { error: e.message };
    log(`[ERR] ${root}: ${e.message}`);
  }
}

fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
log('== DONE. Output in', OUT);
await browser.close();
