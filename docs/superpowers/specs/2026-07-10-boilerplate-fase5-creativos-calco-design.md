# Fase 5 — Creativos (calco pixel-perfect) · 2026-07-10

## Contexto

La sección `/creativos` de la intranet de referencia (`https://bookings.conceptoneagency.com/creativos`,
"Black Moose Group") es un **tablero de piezas del equipo de diseño**. Hoy en nuestra
app es solo un stub (`CreativosShell` = `ModuleShell` con tabs vacías). Esta fase
construye la vista real **calcándola pixel-perfect** contra el live.

Referencia capturada el 2026-07-10 (login demo `test@blackmoose.es`, sin crear/editar/
borrar nada en el original) en `docs/references/creativos/`:
- `live-creativos-full.png` — página completa.
- `live-header-stats-filters-kanban.png` — header + stats + filtros + kanban.
- `live-kanban-column.png` — una columna del kanban con su tarjeta.
- `live-table.png` — la tabla inferior.
- `live-computed-1.json` / `live-computed-2.json` — estilos computados (Playwright/CDP).

Restricción del proyecto: **todo presentacional, sin persistencia** — mock estático,
nada crea/edita/borra.

## Decisiones (confirmadas)

- **Alcance:** vista completa landing (header+acciones, 4 stat cards, fila de filtros,
  Kanban de 5 columnas, tabla). Sin modales (`+ Nueva pieza`/detalle de tarjeta) —
  esos controles quedan **inertes**.
- **Interactividad:** los **filtros funcionan** (filtran las piezas mock en cliente);
  el resto de controles (`+ Nueva pieza`, chips `Asignar a`, tarjetas, `Recursos: Editar`)
  son inertes.
- **Rama:** `feature/fase5-creativos` (creada desde `feature/home-2col-refresh`); el PR
  se abrirá sobre `feature/home-2col-refresh`.
- **Marca:** el "brand" del live es gris oscuro (`#44444C`); mantenemos el **brand
  violeta de nuestra app** (igual que en fases previas) para el botón `+ Nueva pieza` y
  la pill de filtro activa (`bg-brand-600`). El resto son tokens neutros/semánticos exactos.

### Nota de primitivos (exactitud para el plan)

Nuestra app **no** tiene utilidades CSS `.card` ni `.btn-primary` (el live sí). Mapear:
- El live `card` = blanco + `border-slate-200` + `rounded-xl` + `shadow-sm`. Nuestro
  componente `Card` es igual **pero con `border-slate-100`**. Para calcar exacto, usar
  `Card` con override `className="border-slate-200 ..."` (o clases explícitas) donde el
  live usa `card` (stat cards y contenedor de tabla).
- El live `btn-primary` = `bg-[#44444C] text-white rounded-lg`. Usar nuestro
  `<Button variant="primary">` (renderiza `bg-brand-600` violeta) — delta de marca
  intencional. El botón es inerte en esta fase.
- Pills de estado/prioridad: no hay clase `.badge` en nuestro CSS; usar clases Tailwind
  explícitas `inline-flex items-center rounded-full px-2 py-0.5 font-medium` + los
  colores medidos, o extender el componente `Badge` existente si encaja.

## Estructura de la página (una sola vista, ruta `/creativos`)

`main` = `mx-auto w-full max-w-7xl px-4 py-6` (ya lo aporta el shell). Contenido:

1. **Header** (`flex items-start justify-between`):
   - Izquierda: `h1` "Creativos" (`text-2xl font-semibold text-slate-800`) + `p`
     subtítulo "Tablero de piezas del equipo de diseño: Euphoric, clientes del CRM y
     empresas internas." (`text-sm text-slate-500`).
   - Derecha (`flex items-center gap-2`): "Asignar a:" (`text-sm text-slate-400`) +
     chips `+ Alba` / `+ Carlos` (`rounded-full border border-slate-300 px-2.5 py-1
     text-xs font-medium text-slate-600 hover:border-brand-400 hover:text-brand-600`) +
     botón `+ Nueva pieza` (`btn-primary text-sm`, inerte).
2. **Stat cards** — fila `mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4`.
3. **Barra de filtros** (`flex flex-wrap items-center` con las pills a la izquierda y
   "Recursos: — Editar" a la derecha).
4. **Kanban** — `grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5`.
5. **Tabla** — `<table>` dentro de una card blanca.

---

## Componentes y tokens

### 1. Stat card (valor arriba, label abajo)

Nuestro `StatCard` existente pone label→valor; el live es **valor→label**. Se crea un
componente local `CreativosStatCard` (o se ajusta con una variante) — NO reutilizar el
`StatCard` global tal cual.

```tsx
<div className="card px-4 py-3">
  <p className={cn('text-2xl font-semibold', valueClassName)}>{value}</p>
  <p className="text-xs text-slate-500">{label}</p>
</div>
```

- `card` = blanco, `border border-slate-200`, `rounded-xl`, `shadow-sm` (utilidad del
  proyecto; equivale a nuestro primitivo `Card`).
- Valores y colores (medidos):
  - Piezas activas → `text-slate-800`
  - Pend. aprobar → `text-amber-600` (`rgb(217,119,6)`)
  - En correcciones → `text-rose-600` (`rgb(225,29,72)`)
  - Atrasadas → `text-rose-600`

### 2. Barra de filtros

Pills (`FilterChip`): activa vs inactiva.

```tsx
// activa
className="rounded-full px-3 py-1 text-xs font-medium bg-brand-600 text-white"
// inactiva
className="rounded-full px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200"
```

Filtros (en orden): **Todas · Mías · Diseño · Vídeo · Pend. aprobar · Correcciones ·
Atrasadas**. Contenedor de pills `flex flex-wrap gap-1.5`. A la derecha, texto
"Recursos: — Editar" (`text-xs`, "Editar" en link brand, inerte).

Semántica del filtrado (cliente, sobre las piezas mock):
- **Todas** → todas las piezas.
- **Mías** → piezas cuyo `assignee` es el usuario actual (mock: "Carlos").
- **Diseño** → `type` ∈ {Estático, …no vídeo}. **Vídeo** → `type === 'Vídeo'`.
- **Pend. aprobar** → `status === 'Revisión'` (equivale al stat "Pend. aprobar").
- **Correcciones** → `status === 'Cambios'`.
- **Atrasadas** → `deadline < hoy` y no aprobada (`isOverdue`).

El filtro activo se refleja **tanto en el Kanban como en la tabla** (misma lista
filtrada alimenta ambos).

### 3. Kanban

Columnas (orden y color de la pill de cabecera = `badge`, medido):

| Columna | Pill (badge) |
|---|---|
| Briefing | `bg-slate-100 text-slate-600` |
| En producción | `bg-sky-100 text-sky-700` |
| Revisión | `bg-amber-100 text-amber-700` |
| Cambios | `bg-rose-100 text-rose-700` |
| Aprobado | `bg-emerald-100 text-emerald-700` |

Cabecera de columna: `mb-2 flex items-center justify-between px-1` → a la izquierda la
pill de color con el nombre, a la derecha el **contador** (`text-xs font-medium
text-slate-400`). Debajo, stack de tarjetas (`space-y-2` o `space-y-3`). Columna vacía
muestra `—` (`text-slate-300`, centrado).

> El `KanbanBoard` global (columnas con `border-t-4`) **no** aplica aquí. Se construye
> un tablero específico ligero (header-pill) para Creativos.

**Tarjeta de pieza** (`PieceCard`):

```tsx
<button className="block w-full rounded-lg border bg-white p-2.5 text-left hover:shadow-sm
  [+ si atrasada:] border-red-300 ring-1 ring-red-100">   // normal: border-slate-200
  <div className="flex items-center gap-1.5">
    <img className="h-4 w-4 shrink-0 rounded-full object-cover" />  {/* avatar; fallback inicial */}
    <span className="text-[11px] font-medium text-slate-600">{assignee}</span>
  </div>
  <p className="mt-1 truncate text-sm font-medium text-slate-800">{title}</p>
  <p className="mt-0.5 truncate text-xs text-slate-400">{client} · {type} · {version}</p>
  <div className="mt-2 flex items-center gap-2">
    <span className="badge text-[10px] {priorityColor}">{priority}</span>
    <span className="text-[10px] text-slate-500">📅 {deadline}</span>
    {checklist && <span className="text-[10px] text-slate-500">☑ {done}/{total}</span>}
  </div>
</button>
```

- Prioridad (`badge text-[10px]`): **Media** → `bg-amber-100 text-amber-700`; **Alta**
  → `bg-rose-100 text-rose-700`; (Baja → `bg-slate-100 text-slate-600`).
- Botón inerte (no abre modal en esta fase); `type="button"`.
- **Atrasada** (`isOverdue`): borde `border-red-300 ring-1 ring-red-100` y el deadline
  en `text-rose-600 font-semibold` (medido en la tarjeta "Test").
- Avatar: como no hay fotos, usar inicial en círculo `h-4 w-4` (delta intencional, como
  en el home). Emojis 📅/☑ tal cual el live (o iconos lucide `Calendar`/`CheckSquare`
  a `h-3 w-3` como equivalente — decidir en el plan; el live usa emoji).

### 4. Tabla (`<table>`)

Contenedor: card blanca (`overflow-hidden rounded-xl border border-slate-200 bg-white
shadow-sm`). `thead > tr`:
`border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400`,
celdas `<th className="px-4 py-2">`.

Columnas: **PIEZA · CLIENTE · TIPO · PRIORIDAD · DEADLINE · ESTADO · CLIENTE APROB.**

Filas (`tbody > tr`, `border-b border-slate-100 last:border-0 hover:bg-slate-50`),
celdas `px-4 py-3 text-sm`:
- PIEZA: `text-slate-800` + versión `vN` en `text-slate-400` (más pequeña).
- CLIENTE / TIPO / DEADLINE: `text-slate-600`/`text-slate-500`.
- PRIORIDAD: pill `badge` (mismos colores que el kanban).
- ESTADO: pill `badge` con el color de la columna correspondiente (Briefing slate, En
  producción sky, Revisión amber, Cambios rose, Aprobado emerald).
- CLIENTE APROB.: `—` (`text-slate-300`) cuando no hay.

Reutilizar el patrón de tabla div/`<table>` ya presente en cruda como guía de estilo
(`ProductsTable`), pero aquí es `<table>` semántica.

---

## Datos (mock, en el repositorio)

Añadir al `MockRepository` (y tipos) una entrada de Creativos con piezas. Tipo `Piece`:

```ts
interface CreativePiece {
  id: string;
  assignee: string;              // "Carlos"
  title: string;                 // "Pack Sold Out · Pack Sold Out" | "Test"
  client: string;                // "SIGHT"
  type: 'Estático' | 'Vídeo' | 'Animado';
  version: string;               // "v1"
  priority: 'Alta' | 'Media' | 'Baja';
  deadline: string;              // "10 jul 2026"
  status: 'Briefing' | 'En producción' | 'Revisión' | 'Cambios' | 'Aprobado';
  checklist?: { done: number; total: number };
  clientApproval?: string;       // undefined → "—"
  isOverdue?: boolean;           // derivado o marcado en el seed
}
```

Seed inicial reproduciendo el live (3 piezas activas):
- `Pack Sold Out · Pack Sold Out` — SIGHT · Vídeo · v1 · Media · 10 jul 2026 · **Briefing** · ☑2/3.
- `Pack Sold Out · Pack Sold Out` — SIGHT · Estático · v1 · Media · 10 jul 2026 · **En producción** · ☑0/3.
- `Test` — SIGHT · Estático · v1 · Alta · 09 jul 2026 · **Revisión** · atrasada.

Stats derivados del seed: Piezas activas = nº no aprobadas (3); Pend. aprobar = nº en
Revisión (1); En correcciones = nº en Cambios (0); Atrasadas = nº `isOverdue` (1).

## Unidades y límites

- `CreativosPage` — compone header, stats, filtros, kanban y tabla; mantiene el estado
  del filtro activo y deriva la lista filtrada.
- `CreativosStatCard` — card valor→label con color.
- `FilterChip` — pill activa/inactiva.
- `PieceCard` — tarjeta de pieza (presentacional).
- `PiecesKanban` — tablero header-pill de 5 columnas que agrupa piezas por `status`.
- `PiecesTable` — `<table>` de piezas.
- `useCreativos` (hook) — carga las piezas del repositorio (patrón `useDashboard`).
- Router: `/creativos` deja de renderizar el stub `CreativosShell` y pasa a
  `CreativosPage` (dentro del `AppLayout`/shell real, con el breadcrumb "Creativos /
  Piezas").

## Testing

- `CreativosStatCard`, `FilterChip`, `PieceCard`, `PiecesTable`: render + tokens clave
  (colores de estado/prioridad, `—` en vacíos, resaltado atrasada).
- `PiecesKanban`: agrupa por estado, muestra contador y `—` en columnas vacías.
- `CreativosPage`: el filtro cambia la lista (p. ej. "Vídeo" deja solo la pieza vídeo;
  "Atrasadas" deja solo la atrasada) reflejándose en kanban y tabla.
- `MockRepository`: `getCreativos()` devuelve el seed esperado.
- `npm run lint` (`--max-warnings 0`), `npx tsc --noEmit`, `npm test` en verde.

## Verificación (pixel-perfect)

Capturar `/creativos` en `npm run dev` (1440×900, dSF 2, login mock) y contrastar contra
`docs/references/creativos/`: header/acciones, 4 stat cards con colores, pills de filtro,
kanban 5 columnas con colores de cabecera, tarjeta (avatar+meta+prioridad+📅+☑, atrasada
resaltada) y tabla con pills de estado.

## Riesgos / deltas intencionales

- Avatares por inicial (sin fotos) — como en el home.
- `btn-primary` y filtro activo en violeta (nuestro brand) vs gris del live — decisión
  consistente con fases anteriores.
- Modales (`+ Nueva pieza`, detalle de tarjeta) fuera de alcance: controles inertes.
