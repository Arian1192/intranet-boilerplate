import { chromium } from '/home/arian/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const BASE='https://bookings.conceptoneagency.com';
const OUT='/tmp/claude-1000/-home-arian-dev-Boilerplate/048dff11-83f9-4d7f-9a8c-df62e8023a60/scratchpad/live-scan';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2});const page=await ctx.newPage();
await page.goto(`${BASE}/login`,{waitUntil:'networkidle'});await sleep(700);
await page.fill('input[type=email]','test@blackmoose.es');await page.fill('input[type=password]','Concept1234');
await page.click('button[type=submit]');await page.waitForLoadState('networkidle');await sleep(2800);
await page.goto(`${BASE}/`,{waitUntil:'networkidle'});await sleep(2500);

const data=await page.evaluate(()=>{
  const props=['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','backgroundColor','backgroundImage','borderRadius','borderTopWidth','borderBottomWidth','borderColor','padding','margin','marginBottom','gap','display','flexWrap','alignItems','justifyContent','width','maxWidth','textTransform','boxShadow','textAlign','backdropFilter','position'];
  const cs=(el)=>{if(!el)return null;const s=getComputedStyle(el);const o={};for(const p of props)o[p]=s[p];const r=el.getBoundingClientRect();o._rect={x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};o._tag=el.tagName.toLowerCase();o._class=el.className?.toString?.().slice(0,140);return o;};
  const clean=(s)=>(s||'').replace(/\s+/g,' ').trim();
  // deepest element whose OWN textContent (trimmed) === txt or startsWith
  const deepest=(txt,exact=false)=>{const all=Array.from(document.querySelectorAll('body *'));let best=null,bestDepth=-1;for(const e of all){const t=clean(e.textContent);const ok=exact?t===txt:t.includes(txt);if(!ok)continue;let d=0,p=e;while(p){d++;p=p.parentElement;}if(d>bestDepth){bestDepth=d;best=e;}}return best;};
  const out={};
  // group label
  out.groupLabel=cs(deepest('ESPACIOS DE TRABAJO',true));
  // all module pills: accent + icon
  const pills=Array.from(document.querySelectorAll('a[href]')).filter(a=>{const t=clean(a.textContent);const r=a.getBoundingClientRect();return r.h>20&&r.h<70&&r.w>70&&r.w<280&&t.length<20&&a.querySelector('svg');});
  out.modules=pills.map(a=>{const badge=a.querySelector('span[style]');const svg=a.querySelector('svg');return{name:clean(a.textContent),href:a.getAttribute('href'),accent:badge?getComputedStyle(badge).backgroundColor:null,accentStyle:badge?.getAttribute('style'),svgClass:svg?.getAttribute('class'),svgHTML:svg?.outerHTML.slice(0,300)};});
  // inbox-zero card
  const inboxTitle=deepest('No te toca nada ahora mismo',true);out.inboxTitle=cs(inboxTitle);
  let card=inboxTitle;for(let i=0;i<6&&card;i++){const r=card.getBoundingClientRect();if(r.width>700){out.inboxCard=cs(card);break;}card=card.parentElement;}
  out.inboxSub=cs(deepest('Ni alertas, ni creatividades',false));
  // novedades label + card + confirm btn
  out.novedadesLabel=cs(deepest('NOVEDADES',true));
  const summer=deepest('Black Moose Summer Lunch',false);out.novedadesTitle=cs(summer);
  let nc=summer;for(let i=0;i<6&&nc;i++){const r=nc.getBoundingClientRect();if(r.width>400&&r.height>70){out.novedadesCard=cs(nc);break;}nc=nc.parentElement;}
  const confirm=Array.from(document.querySelectorAll('button')).find(x=>clean(x.textContent).includes('Confirmar Asistencia'));out.confirmBtn=cs(confirm);out.confirmBtnHTML=confirm?.outerHTML.slice(0,300);
  // topnav
  const nav=document.querySelector('header');out.topnav=cs(nav);out.topnavHTML=nav?.outerHTML.replace(/<svg[\s\S]*?<\/svg>/g,'<svg/>').slice(0,1400);
  const bell=deepest('9+',true);out.bellBadge=cs(bell);
  // ayuda panel
  const aTitle=deepest('Ayuda',true);out.ayudaTitle=cs(aTitle);
  let ap=aTitle;for(let i=0;i<8&&ap;i++){const r=ap.getBoundingClientRect();if(r.width>250&&r.height>150){out.ayudaPanel=cs(ap);break;}ap=ap.parentElement;}
  const sendBtn=Array.from(document.querySelectorAll('button')).find(x=>clean(x.textContent)==='Enviar');out.ayudaSendBtn=cs(sendBtn);
  return out;
});
fs.writeFileSync(`${OUT}/home-computed2.json`,JSON.stringify(data,null,2));
console.log('MODULES:');for(const m of data.modules)console.log(' ',m.name.padEnd(16),m.href.padEnd(14),m.accent,'|',m.svgClass?.slice(0,40));
console.log('GROUP LABEL:',data.groupLabel?.fontSize,data.groupLabel?.fontWeight,data.groupLabel?.letterSpacing,data.groupLabel?.color,data.groupLabel?.textTransform,'mb',data.groupLabel?.marginBottom);
console.log('INBOX CARD:',data.inboxCard?.backgroundColor,'border',data.inboxCard?.borderColor,data.inboxCard?.borderRadius,'pad',data.inboxCard?.padding,'shadow',data.inboxCard?.boxShadow?.slice(0,30),'rect',JSON.stringify(data.inboxCard?._rect));
console.log('INBOX title:',data.inboxTitle?.fontSize,data.inboxTitle?.fontWeight,data.inboxTitle?.color,'| sub:',data.inboxSub?.fontSize,data.inboxSub?.color);
console.log('NOVEDADES label:',data.novedadesLabel?.fontSize,data.novedadesLabel?.fontWeight,data.novedadesLabel?.letterSpacing,data.novedadesLabel?.color);
console.log('NOVEDADES card:',data.novedadesCard?.backgroundColor,'border',data.novedadesCard?.borderColor,data.novedadesCard?.borderRadius,'pad',data.novedadesCard?.padding,'rect',JSON.stringify(data.novedadesCard?._rect));
console.log('CONFIRM btn:',data.confirmBtn?.backgroundColor,data.confirmBtn?.color,data.confirmBtn?.borderRadius,data.confirmBtn?.fontSize,data.confirmBtn?.padding);
console.log('TOPNAV:',data.topnav?.backgroundColor,'h',data.topnav?._rect?.h,'border-b',data.topnav?.borderBottomWidth,data.topnav?.borderColor,'backdrop',data.topnav?.backdropFilter,'pos',data.topnav?.position);
console.log('BELL badge:',data.bellBadge?.backgroundColor,data.bellBadge?.color,data.bellBadge?.fontSize,data.bellBadge?.borderRadius);
console.log('AYUDA panel:',data.ayudaPanel?.backgroundColor,'border',data.ayudaPanel?.borderColor,data.ayudaPanel?.borderRadius,'shadow',data.ayudaPanel?.boxShadow?.slice(0,40),'rect',JSON.stringify(data.ayudaPanel?._rect));
console.log('AYUDA send btn:',data.ayudaSendBtn?.backgroundColor,data.ayudaSendBtn?.color);
console.log('--- TOPNAV HTML ---');console.log(data.topnavHTML);
console.log('--- CONFIRM HTML ---');console.log(data.confirmBtnHTML);
await b.close();
