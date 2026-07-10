# Creativos — Drawer "Nueva pieza" (calco pixel-perfect) · 2026-07-10

## Contexto

En la Fase 5 el botón **"+ Nueva pieza"** de `/creativos` quedó inerte. Esta microfase
lo cablea a un **drawer lateral derecho** calcado pixel-perfect del live
(`bookings.conceptoneagency.com/creativos` → abrir "Nueva pieza"). El HTML exacto del
`aside` fue proporcionado por el usuario y capturado (read-only, sin enviar nada) en
`docs/references/creativos/live-nueva-pieza-drawer.png`.

Restricción del proyecto: **todo presentacional, sin persistencia**. El drawer abre/cierra
de verdad y los grupos segmentados tienen selección local; el resto de campos son
tecleables pero no guardan nada; "Guardar" solo cierra.

## Decisiones (confirmadas)

- **Rama:** `feature/creativos-nueva-pieza-drawer` (desde `feature/fase5-creativos`); PR
  sobre `feature/fase5-creativos`.
- **Interactividad:** abrir/cerrar (botón abre; ✕ / Cerrar / Guardar / overlay cierran).
  Grupos segmentados con **estado local**: Prioridad (single, "Media" por defecto),
  Tamaños/ratios (multi-toggle), Aprobación del cliente (single, "Sin enviar" por defecto,
  y el badge del encabezado refleja la selección). Inputs/selects/date/textarea/contenteditable
  tecleables pero sin persistencia. Inertes: chips "Asignar", "＋ Añadir adaptación",
  "＋ Añadir tarea", "＋ Adjuntar", toolbar del Brief.
- **Marca:** mantener brand violeta (Guardar = `Button variant="primary"`; estados
  seleccionados usan `border-brand-500 bg-brand-50 text-brand-700`). El live usa gris.

## Tokens base (medidos en el live)

Se añaden 3 utilidades a `src/styles/index.css` (`@layer components`) reproduciendo las
clases que usa el HTML del live (así el calco mapea 1:1):

```css
@layer components {
  .label { @apply mb-1 block text-sm font-medium text-slate-600; }
  .input { @apply w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none; }
  .select { @apply input pr-8; } /* select reutiliza input + hueco para el chevron nativo */
}
```

Medidas verificadas: `.label` 14px/500 `#475569`; `.input` alto ~38px, borde `#CBD5E1`
(slate-300), radio 8px, `px-12 py-8`, texto 14px `#1E293B`. Footer `.btn-primary` (live
gris `#44444C`) → nuestro `Button variant="primary"` (violeta); `.btn-secondary` →
`Button variant="secondary"`.

## Arquitectura

Panel lateral (no usar `Modal`, que es centrado). Estructura de ficheros bajo
`src/features/creativos/`:

- `components/NuevaPiezaDrawer.tsx` — shell del drawer: overlay + `aside` + header +
  cuerpo scrollable + footer; **owns** el estado local (priority, ratios, approval);
  compone las secciones. Prop: `{ open: boolean; onClose: () => void }`.
- `components/drawer/SegmentedButtons.tsx` — grupo de botones segmentados reutilizable
  (single o multi) con el estilo seleccionado/no seleccionado del live.
- `components/drawer/BriefEditor.tsx` — editor rich-text presentacional (toolbar inerte +
  `contenteditable`).
- Las cajas menores (Responsable/Aprueba, Adaptaciones, ¿Para quién?, Aprobación cliente,
  Checklist) se componen dentro de `NuevaPiezaDrawer` como sub-bloques (JSX) — no
  necesitan fichero propio salvo que crezcan.
- `pages/CreativosPage.tsx` — añade estado `drawerOpen` y cablea el botón "+ Nueva pieza"
  (`onClick`) + renderiza `<NuevaPiezaDrawer open={drawerOpen} onClose={…} />`.

## Drawer shell (calco del `aside`)

```tsx
{open && (
  <>
    <div className="fixed inset-0 z-40 bg-slate-900/20" onClick={onClose} aria-hidden />
    <aside className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-slate-200 bg-white shadow-2xl sm:inset-y-4 sm:right-4 sm:w-[32rem] sm:overflow-hidden sm:rounded-2xl sm:border lg:w-[32rem]">
      {/* header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <h3 className="text-lg font-semibold text-slate-800">Nueva pieza</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700" aria-label="Cerrar">✕</button>
      </div>
      {/* body */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="grid gap-4 sm:grid-cols-2"> … campos … </div>
      </div>
      {/* footer */}
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-5 py-3">
        <span />
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose}>Cerrar</Button>
          <Button variant="primary" onClick={onClose}>Guardar</Button>
        </div>
      </div>
    </aside>
  </>
)}
```

El overlay (`bg-slate-900/20`) es un añadido de UX para cerrar al hacer clic fuera; el HTML
proporcionado era solo el `aside`.

## Campos (orden y clases exactas del HTML)

Dentro del `grid gap-4 sm:grid-cols-2`:

1. **Nombre \*** — `col-span-2`: `<label class="label">Nombre *</label><input class="input" placeholder="Ej: Reel lanzamiento v2">`.
2. **Responsable / Aprueba** — `col-span-2 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg bg-slate-50 px-3 py-2`. Dos bloques, cada uno: `<div class="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Responsable|Aprueba</div>` + chip inerte `<button type="button" class="inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm text-slate-400 hover:bg-slate-200"><span class="grid shrink-0 place-items-center rounded-full border border-dashed border-slate-300 text-slate-400" style="width:28px;height:28px">＋</span><span>Asignar</span></button>`.
3. **Tipo / Departamento** — `grid grid-cols-2 gap-3`: `Tipo` select (Estático/Animado/Vídeo), `Departamento` select (Diseño/Vídeo/Otro).
4. **Estado / Versión** — `grid grid-cols-2 gap-3`: `Estado` select (Briefing/En producción/Revisión/Cambios/Aprobado), `Versión` `<input type="number" min="1" class="input" defaultValue={1}>`.
5. **Prioridad** — `SegmentedButtons` single, opciones [Baja, Media, Alta], default "Media". Botón: `flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium`; sel `border-brand-500 bg-brand-50 text-brand-700`, no-sel `border-slate-300 text-slate-600`.
6. **Deadline** — `<label class="label">Deadline</label>` + `<div class="input relative flex items-center gap-2"><span class="truncate text-slate-400">dd/mm/aaaa</span><CalendarIcon class="ml-auto h-4 w-4 shrink-0 text-slate-400"/><input type="date" class="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label="Fecha"/></div>`. (Icono: SVG calendario del HTML o `Calendar` de lucide.)
7. **Tamaños / ratios** — `col-span-2`. `SegmentedButtons` multi, opciones [1:1, 4:5, 9:16, 16:9]. Botón `rounded-lg border px-3 py-1.5 text-sm font-medium`; no-sel `border-slate-300 text-slate-600 hover:bg-slate-50`, sel brand.
8. **Adaptaciones / versiones** — `col-span-2 rounded-lg border border-dashed border-brand-200 bg-brand-50/40 p-3`: título `text-xs font-semibold uppercase tracking-wide text-brand-700`, descripción `text-[11px] text-slate-500` (texto literal del HTML), y `<button class="text-xs font-medium text-brand-600 hover:underline">＋ Añadir adaptación</button>` (inerte).
9. **¿Para quién?** — `col-span-2 rounded-lg border border-slate-200 p-3`. Cabecera `text-xs font-semibold uppercase tracking-wide text-slate-500` "¿Para quién?" + `<span class="font-normal normal-case text-slate-400">· elige solo uno</span>`. `grid gap-3 sm:grid-cols-3`: **Cuenta Euphoric** select (—, SIGHT), **Cliente (CRM)** input placeholder "Cliente…", **Empresa interna** select (—, ConceptOne, CRUDA, Etra Agency, Euphoric Media, Mixmag Spain, TAGMAG). (Los `value` uuid del live se sustituyen por valores planos.)
10. **Evento** — `col-span-2`: input placeholder "Buscar o crear evento…".
11. **Campaña / Publicación** — dos celdas: `Campaña` select (Sin campaña, Genérico Julio), `Publicación` select (Sin publicación, Set Times · 2026-07-10).
12. **Brief** — `col-span-2`. `BriefEditor`: contenedor `overflow-hidden rounded-lg border border-slate-300 focus-within:border-brand-400`; toolbar `flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-1.5 py-1` con botones inertes **B / i / U / S**, divisor (`mx-1 h-5 w-px bg-slate-200`), tres tamaños **A** (text-[11px]/text-sm/text-base), divisor, **✕** (quitar formato); cuerpo `contenteditable` `min-h-[90px] px-3 py-2 text-sm leading-snug outline-none` con `data-placeholder` (usa `[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-slate-400`).
13. **Enlace al asset** — `col-span-2`: input placeholder "Drive / Frame.io / Dropbox…".
14. **Adjuntos** — `col-span-2`: `<label class="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-dashed border-slate-300 px-2 py-1.5 text-xs text-slate-500 hover:border-brand-400 hover:text-brand-600">＋ Adjuntar<input type="file" class="hidden"/></label>` (inerte).
15. **Aprobación del cliente** — `col-span-2 rounded-lg border border-slate-200 p-3`. Cabecera: título `text-xs font-semibold uppercase tracking-wide text-slate-500` + `<Badge variant="neutral">{sel}</Badge>` (refleja el estado seleccionado). `SegmentedButtons` single, opciones [Sin enviar, Pendiente cliente, Aprobado cliente, Cambios cliente], default "Sin enviar", botón `rounded-lg border px-2.5 py-1 text-xs font-medium`.
16. **Checklist** — `col-span-2 rounded-lg border border-slate-200 p-3`: título + `<button class="text-xs text-brand-600 hover:underline">＋ Añadir tarea</button>` (inerte).
17. **Notas** — `col-span-2`: `<textarea class="input min-h-[60px]">`.

## `SegmentedButtons` (componente)

```tsx
interface SegmentedButtonsProps {
  options: string[];
  value: string | string[];       // string (single) | string[] (multi)
  onChange: (v: string) => void;  // el padre decide toggle vs replace
  multiple?: boolean;
  buttonClassName?: string;       // clases base por variante de tamaño
  className?: string;             // contenedor (p. ej. "flex gap-1.5" o "flex flex-wrap gap-2")
}
```

Selección: aplica `border-brand-500 bg-brand-50 text-brand-700` si activo, si no
`border-slate-300 text-slate-600` (+ hover del caller). `disabled:opacity-60` como el live.

## Wiring en `CreativosPage`

```tsx
const [drawerOpen, setDrawerOpen] = useState(false);
// … botón: <Button variant="primary" size="sm" onClick={() => setDrawerOpen(true)}>+ Nueva pieza</Button>
// … al final del JSX: <NuevaPiezaDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
```

## Testing

- `SegmentedButtons`: single (click cambia selección, marca activo) y multi (toggle
  añade/quita, permite varios).
- `BriefEditor`: renderiza toolbar (8 botones) + `contenteditable` con placeholder; toolbar
  inerte (sin handlers que muten estado de la app).
- `NuevaPiezaDrawer`: no renderiza nada si `open=false`; con `open=true` muestra "Nueva
  pieza" y los campos clave (Nombre, Prioridad con "Media" activo, Tamaños/ratios, Aprobación
  del cliente); ✕ / Cerrar / Guardar / overlay llaman `onClose`; Prioridad cambia de "Media"
  a "Alta" al click; un ratio se togglea.
- `CreativosPage`: el drawer no está montado hasta pulsar "+ Nueva pieza"; al pulsar aparece
  "Nueva pieza"; al cerrar desaparece.
- `npm run lint` (max-warnings 0), `npx tsc --noEmit`, `npm test` en verde.

## Verificación (pixel-perfect)

Abrir `/creativos` en `npm run dev`, pulsar "+ Nueva pieza", capturar el `aside` con
Playwright (1440×1000, dSF 2) y contrastar contra
`docs/references/creativos/live-nueva-pieza-drawer.png`: header, todos los campos en orden,
Prioridad "Media" activa, ratios, cajas con borde/dashed, Brief con toolbar, footer
Cerrar/Guardar. Probar selección de Prioridad/ratios/Aprobación y cierre por overlay.

## Riesgos / deltas intencionales

- Guardar/estados seleccionados en **violeta** (nuestro brand) vs gris del live.
- Overlay backdrop añadido para cerrar al clicar fuera (no estaba en el HTML del `aside`).
- `contenteditable` + toolbar del Brief: presentacional; la toolbar no aplica formato real
  (los `execCommand` están deprecados) — botones inertes, el cuerpo es tecleable.
- Los `value` uuid de los `<option>` del live se sustituyen por valores planos.
