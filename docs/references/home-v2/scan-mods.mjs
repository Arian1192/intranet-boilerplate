import { chromium } from '/home/arian/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const BASE='https://bookings.conceptoneagency.com';
const OUT='/tmp/claude-1000/-home-arian-dev-Boilerplate/048dff11-83f9-4d7f-9a8c-df62e8023a60/scratchpad/live-scan';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1440,height:900}});const page=await ctx.newPage();
await page.goto(`${BASE}/login`,{waitUntil:'networkidle'});await sleep(700);
await page.fill('input[type=email]','test@blackmoose.es');await page.fill('input[type=password]','Concept1234');
await page.click('button[type=submit]');await page.waitForLoadState('networkidle');await sleep(2800);
await page.goto(`${BASE}/`,{waitUntil:'networkidle'});await sleep(2500);
const data=await page.evaluate(()=>{
  const clean=(s)=>(s||'').replace(/\s+/g,' ').trim();
  const pills=Array.from(document.querySelectorAll('a[href]')).filter(a=>{const r=a.getBoundingClientRect();return r.height>20&&r.height<70&&r.width>70&&r.width<280&&clean(a.textContent).length<20&&a.querySelector('svg');});
  const modules=pills.map(a=>{const badge=a.querySelector('span[style]');const svg=a.querySelector('svg');return{name:clean(a.textContent),href:a.getAttribute('href'),accentStyle:badge?.getAttribute('style'),svgPaths:Array.from(svg?.querySelectorAll('path,circle,rect,line,polyline,polygon,ellipse')||[]).map(p=>p.tagName.toLowerCase()+':'+(p.getAttribute('d')||p.getAttribute('points')||`${p.getAttribute('cx')||''},${p.getAttribute('cy')||''}`).slice(0,60))};});
  // group labels: find spans/divs with these exact texts
  const labels={};
  for(const t of ['ESPACIOS DE TRABAJO','GESTIÓN INTERNA','HERRAMIENTAS Y AJUSTES']){
    const el=Array.from(document.querySelectorAll('body *')).filter(e=>clean(e.textContent)===t).pop();
    if(el){const s=getComputedStyle(el);labels[t]={fontSize:s.fontSize,fontWeight:s.fontWeight,letterSpacing:s.letterSpacing,color:s.color,textTransform:s.textTransform,marginBottom:s.marginBottom,cls:el.className?.toString().slice(0,80)};}
  }
  return {modules,labels};
});
fs.writeFileSync(`${OUT}/home-modules.json`,JSON.stringify(data,null,2));
console.log('MODULES ('+data.modules.length+'):');
for(const m of data.modules)console.log('  '+m.name.padEnd(16)+m.href.padEnd(15)+(m.accentStyle||'no-accent'));
console.log('\nGROUP LABELS:');
for(const [k,v] of Object.entries(data.labels))console.log('  '+k+':',v.fontSize,v.fontWeight,'tracking',v.letterSpacing,v.color,v.textTransform,'| cls:',v.cls);
await b.close();
