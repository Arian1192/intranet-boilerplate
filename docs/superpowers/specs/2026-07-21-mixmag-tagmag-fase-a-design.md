# Mixmag/TAGMAG — Fase A (shell parametrizado + Resumen + Revistas) · Design

**Fecha:** 2026-07-21
**Rama objetivo:** `feature/mixmag-tagmag` (desde `feature/home-v2`)
**Tipo:** Calco **100% fiel** al live (pixel-perfect). Presentacional (mock), navegación real. Primera de 3 sub-fases del módulo.

---

## 1. Contexto y objetivo

El live tiene dos redacciones gemelas, **Mixmag** (`/mixmag`) y **TAGMAG** (`/tagmag`), con 4 pestañas cada una: **Resumen / Contenidos / Campañas / Revistas**. Hoy en nuestra app son stubs (`MixmagShell`/`TagmagShell` sobre `ModuleShell`, creados en Home v2).

El módulo es grande (8 páginas) y se **decompone en 3 sub-fases por pestaña** (ambas gemelas a la vez):
- **Fase A (esta):** shell parametrizado compartido + **Resumen** + **Revistas** (las 2 pestañas ligeras).
- **Fase B:** Contenidos (board por canal REDES/WEB/REVISTA).
- **Fase C:** Campañas (embudo + kanban).

Mixmag y TAGMAG **comparten estructura** (mismas páginas) pero con **datos y accent distintos** (Mixmag rosa `#E11D48`, TAGMAG sky `#0EA5E9`). Por eso la arquitectura es un **módulo "Redacción" parametrizado**: un shell + páginas genéricas que reciben un `Magazine` config vía Outlet context, y dos configs/seeds.

Referencias (Playwright, login demo, 2026-07-21) en `docs/references/mixmag/`: `live-mixmag-{resumen,contenidos,campanas,revistas}.png`, `live-tagmag-*.png`, `live-scan.json`, `live-resumen-revistas-tokens.json`.

### Criterios de éxito
- `/mixmag` y `/tagmag` renderizan el shell con las 4 pestañas (navegables); Resumen y Revistas reales, Contenidos/Campañas con placeholder "en construcción".
- **Resumen**: 3 stat cards (LO QUE LLEVAS TÚ / ATRASADOS / PENDIENTES DE APROBAR) + sección "Publicaciones" con la card de la publicación (spaceName, "N en curso", "Revista abierta: …").
- **Revistas**: header (punto accent + spaceName + "+ Edición") + grid de cards de edición (portada placeholder + footer) / empty-state para TAGMAG.
- Las mismas páginas sirven Mixmag y TAGMAG con datos distintos (parametrización real).
- Verde total (tests, lint 0, tsc). Verificación Playwright ours↔live.

---

## 2. Arquitectura

**Nueva feature `src/features/redaccion/`:**
- `RedaccionShell.tsx` — `export function RedaccionShell({ magazine }: { magazine: Magazine })`. Renderiza `<AppLayout module={…}><Outlet context={magazine} /></AppLayout>`. El `module` header: `name = magazine.name`, `href = magazine.basePath`, `tabs = [Resumen(basePath), Contenidos(basePath/contenidos), Campañas(basePath/campanas), Revistas(basePath/revistas)]`.
- `data/types.ts` — `Magazine`, `MagazineEdition` (ver §4).
- `data/seed.ts` — `MIXMAG: Magazine`, `TAGMAG: Magazine` (espejo del live).
- `pages/ResumenPage.tsx` — usa `useOutletContext<Magazine>()`.
- `pages/RevistasPage.tsx` — idem.
- `pages/EnConstruccionPage.tsx` — placeholder para Contenidos/Campañas (recibe un `title` opcional o lee la ruta; muestra "Esta sección llega en una próxima fase.").
- `components/EditionCard.tsx` — card de edición.
- `components/PublicationCard.tsx` — card de "Publicaciones" del Resumen.

**Shells finos** (`src/features/modules/`): `MixmagShell = <RedaccionShell magazine={MIXMAG} />`, `TagmagShell = <RedaccionShell magazine={TAGMAG} />` (reemplazan los stubs `ModuleShell`).

**Router** (`src/app/router.tsx`): las rutas `/mixmag` y `/tagmag` pasan de `element` planos a rutas **anidadas** con hijos que apuntan a las **mismas** páginas:
```tsx
<Route path="/mixmag" element={<MixmagShell />}>
  <Route index element={<ResumenPage />} />
  <Route path="contenidos" element={<EnConstruccionPage />} />
  <Route path="campanas" element={<EnConstruccionPage />} />
  <Route path="revistas" element={<RevistasPage />} />
</Route>
{/* idéntico para /tagmag con TagmagShell */}
```

**Paso del config a las páginas:** vía `useOutletContext<Magazine>()` (react-router). El shell hace `<Outlet context={magazine} />`; cada página lo lee. No se usa contexto global ni props threading.

---

## 3. Tokens exactos del live (pixel-perfect)

### Resumen
- **Stat cards** (reusar `StatCard`): fila `grid gap-4 sm:grid-cols-3`. Cada card `p-4`, label `text-xs text-slate-500` (uppercase ya en el texto), valor `text-2xl font-semibold text-slate-800`. Labels: "LO QUE LLEVAS TÚ", "ATRASADOS", "PENDIENTES DE APROBAR"; valores del seed (0/0/0).
- **"Publicaciones"** heading: `text-sm font-semibold text-slate-800` (medido 14px/600 #1e293b), `mt-6 mb-3`.
- **PublicationCard** (grid `sm:grid-cols-2 lg:grid-cols-3`, la card ocupa 1 col): `rounded-xl border border-slate-200 bg-white p-4`:
  - Fila título: punto `h-2 w-2 rounded-full` (color `magazine.accent`) + `spaceName` `text-base font-semibold text-slate-800` (16px/600).
  - Subtítulo: `text-sm text-slate-500` → "{region} · con revista" (p.ej. "España · con revista").
  - Nº en curso: `text-xl font-semibold text-slate-800` (20px/600) + " en curso" `text-sm text-slate-500`.
  - Revista abierta (si existe): `text-sm text-slate-500` → "Revista abierta: {revistaAbierta}".

### Revistas
- **Header**: fila `flex items-center justify-between`. Izq: punto accent + `spaceName` `text-base font-semibold text-slate-800`. Der: botón **"+ Edición"** `inline-flex items-center gap-1 rounded-lg bg-[#44444C] px-4 py-2 text-sm font-medium text-white hover:bg-[#3a3a41]` (medido: bg #44444C, radius 8px, padding 8px 16px). Inerte.
- **Grid** de ediciones: `mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3`.
- **EditionCard** (HTML exacto del live): `<button class="overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md">` (inerte), con:
  - Portada: `<div class="grid aspect-[3/4] place-items-center bg-slate-100">` — **placeholder** (no hay foto real): icono `ImageIcon` (lucide) `h-8 w-8 text-slate-300`. Delta intencional.
  - Footer `p-3`:
    - Fila título `flex items-baseline justify-between gap-2`: `<h3 class="min-w-0 truncate font-semibold text-slate-800"><span class="text-slate-400">#{number} </span>{title}</h3>` + `<span class="shrink-0 text-xs text-slate-400">{monthLabel}</span>`.
    - Estado: `mt-2` badge "En preparación" (`Badge variant="neutral"` slate-100/slate-500) + "{readyCount} de {totalCount} listos" `text-xs text-slate-400`.
    - Progreso: `ProgressBar` con `percent` + "{percent}%" `text-xs text-slate-400`.
- **Empty state** (TAGMAG, sin ediciones): `rounded-xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-400` → "Ninguna edición todavía." (el botón "+ Edición" del header sigue presente).

### En construcción (Contenidos/Campañas placeholder)
- Componente **genérico sin props**: `rounded-xl border border-dashed border-slate-200 p-12 text-center` con título `text-sm font-medium text-slate-600` "En construcción" + `text-xs text-slate-400` "Esta sección llega en una próxima fase.".

---

## 4. Modelo de datos (`data/types.ts` + `seed.ts`)

```ts
export interface MagazineEdition {
  id: string;
  number: number;        // 29
  title: string;         // 'Patrick Topping'
  monthLabel: string;    // 'Agosto 2026'
  status: string;        // 'En preparación'
  readyCount: number;    // 0
  totalCount: number;    // 1
  percent: number;       // 0
}

export interface Magazine {
  id: 'mixmag' | 'tagmag';
  name: string;          // 'Mixmag' | 'TAGMAG'
  spaceName: string;     // 'Mixmag Spain' | 'TAGMAG'
  region: string;        // 'España'
  hasMagazine: boolean;  // true
  accent: string;        // '#E11D48' | '#0EA5E9'
  basePath: string;      // '/mixmag' | '/tagmag'
  resumen: {
    llevasTu: number;    // 0
    atrasados: number;   // 0
    pendientes: number;  // 0
    enCurso: number;     // 4 (Mixmag) | 0 (TAGMAG)
    revistaAbierta?: string; // 'Patrick Topping (Agosto 2026)' | undefined
  };
  editions: MagazineEdition[];
}
```
- **MIXMAG**: spaceName 'Mixmag Spain', accent '#E11D48', enCurso 4, revistaAbierta 'Patrick Topping (Agosto 2026)', editions `[{ number:29, title:'Patrick Topping', monthLabel:'Agosto 2026', status:'En preparación', readyCount:0, totalCount:1, percent:0 }]`.
- **TAGMAG**: spaceName 'TAGMAG', accent '#0EA5E9', enCurso 0, revistaAbierta undefined, editions `[]`.

---

## 5. Archivos afectados

| Archivo | Cambio |
|---|---|
| `src/features/redaccion/data/types.ts` | **Nuevo** — `Magazine`, `MagazineEdition`. |
| `src/features/redaccion/data/seed.ts` | **Nuevo** — `MIXMAG`, `TAGMAG`. |
| `src/features/redaccion/RedaccionShell.tsx` | **Nuevo** — shell parametrizado (AppLayout + tabs + `<Outlet context>`). |
| `src/features/redaccion/pages/ResumenPage.tsx` | **Nuevo**. |
| `src/features/redaccion/pages/RevistasPage.tsx` | **Nuevo**. |
| `src/features/redaccion/pages/EnConstruccionPage.tsx` | **Nuevo** — placeholder Contenidos/Campañas. |
| `src/features/redaccion/components/PublicationCard.tsx` | **Nuevo**. |
| `src/features/redaccion/components/EditionCard.tsx` | **Nuevo**. |
| `src/features/modules/MixmagShell.tsx` | Reescribir: `<RedaccionShell magazine={MIXMAG} />`. |
| `src/features/modules/TagmagShell.tsx` | Reescribir: `<RedaccionShell magazine={TAGMAG} />`. |
| `src/app/router.tsx` | `/mixmag` y `/tagmag` → rutas anidadas (index=Resumen, contenidos/campanas=EnConstruccion, revistas=Revistas). |

---

## 6. Testing

- **`ResumenPage`** (RTL, renderizada con `<MemoryRouter>` + un wrapper que provee el Outlet context, o probando vía el árbol de rutas): muestra las 3 stat cards con sus labels y valores; "Publicaciones" con spaceName, "4 en curso" y "Revista abierta: Patrick Topping (Agosto 2026)" para Mixmag; para TAGMAG, "0 en curso" y **sin** "Revista abierta".
- **`RevistasPage`**: Mixmag renderiza 1 EditionCard con "#29", "Patrick Topping", "Agosto 2026", "En preparación", "0 de 1 listos", 0%; el botón "+ Edición" presente. TAGMAG renderiza el empty-state "Ninguna edición todavía." y el botón "+ Edición".
- **`EditionCard`**/`PublicationCard`: render de tokens/campos.
- **Routing** (opcional, un test): `/mixmag` monta el shell con las 4 pestañas y el Resumen; `/tagmag` con datos de TAGMAG.
- **Patrón de test para el Outlet context** (fijo): un helper `renderWithMagazine(ui, magazine)` que renderiza
  ```tsx
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<Outlet context={magazine} />}>
          <Route index element={ui} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
  ```
  Así `useOutletContext<Magazine>()` dentro de `ui` recibe el config. Cada test de página usa este helper con `MIXMAG` o `TAGMAG`.
- Gate: `npm test`, `npm run lint` (0), `npx tsc --noEmit` limpios.

---

## 7. Deltas intencionales / fuera de alcance

- **Portadas de revista** = placeholder `bg-slate-100` + icono (no las fotos reales) — delta intencional (como avatares por inicial).
- Controles inertes: "+ Edición", "+ Contenido", clic en cards.
- **Fuera de Fase A**: Contenidos (board por canal), Campañas (embudo+kanban), los **icon-actions del header** (analítica 📊 + tuerca de config por-espacio ⚙️) y el **dropdown "Mixmag ▾"** del header — se añaden en sus fases. En Fase A el header es `name + 4 tabs`.
- Colorimetría **100% fiel** (decisión del usuario): botones `#44444C`, accent por revista en punto/chips; sin brand violeta.
