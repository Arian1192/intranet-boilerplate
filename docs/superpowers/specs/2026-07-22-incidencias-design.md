# Incidencias (calco pixel-perfect)

**Fecha:** 2026-07-22
**Rama:** `feature/incidencias`
**Requisito clave (usuario):** 100% fiel al live (pixel-perfect); el modelo de datos espeja tablas Supabase.

## Objetivo

Calcar el módulo **Incidencias** (`/incidencias`) del live: la bandeja de reportes que el equipo envía desde el panel global de Ayuda (`HelpPanel`/`ReportDialog`, ya existentes en `src/components/layout/`). Es una única pantalla: título + subtítulo, 5 tarjetas-stat que actúan como filtro exclusivo por estado, y una lista de 8 filas con badge de estado, chip de tipo, texto, adjunto, ruta de origen y avatar del reportante.

## Fuera de alcance

- Abrir el detalle/drawer al pulsar una fila (el live probablemente lo tiene pero no se exploró por la regla de "no pulsar botones que puedan mutar/navegar a algo desconocido"; en el calco el `<button>` de fila queda inerte, `onClick` no-op documentado).
- Cualquier acción de responder, cambiar de estado, asignar, adjuntar, exportar o paginar: no existen en el live.
- Sub-filtro "solo mis reportes" tras el enlace "Mis avisos" del panel Ayuda: en el live ese enlace apunta literalmente a `/incidencias` (mismo módulo) sin evidencia de un filtro adicional activo; en el calco se deja como navegación simple a la ruta, sin lógica de autoría.
- Edición del `HelpPanel`/`ReportDialog` global: ya existen (`src/components/layout/HelpPanel.tsx`, `ReportDialog.tsx`); esta fase solo los reutiliza sin cambios, salvo el delta puntual de enlazar "Mis avisos" a `/incidencias` (ver Deltas).

## Contexto del live (fuente de verdad)

Recon en `docs/references/incidencias/`: `live-incidencias.png` (vista sin filtro), `live-incidencias-nuevas.png`, `live-incidencias-auto.png`, `live-incidencias-en-curso.png` (vacío), `live-incidencias-resueltas.png`, `live-incidencias-descartadas.png`, más `live-incidencias-report.json` y `live-incidencias-tokens.json`.

Texto observado:

> Incidencias
> Lo que el equipo reporta desde el panel de ayuda. Responder es lo que hace que sigan reportando.

Stat-cards y conteos: NUEVAS 1 · AUTO 1 · EN CURSO 0 · RESUELTAS 2 · DESCARTADAS 4 (suman las 8 filas semilla).

Lista sin filtro (orden tal cual llega, 8 filas — ver tabla de seeds en Modelo de datos). Cada fila: badge de estado (w-24, texto centrado) → chip opcional violeta "Idea" → texto truncado a 1 línea → icono 📎 opcional → ruta de origen (gris, oculta en breakpoints pequeños) → columna "—" (placeholder siempre vacío) → avatar circular 18px (iniciales blancas sobre color determinístico por usuario, o silueta gris genérica sin identidad).

Comportamiento de filtro confirmado por inspección de clases antes/después de click: toggle exclusivo. Click en una stat-card → esa card pasa a `border-slate-800 bg-white shadow-sm` y la lista se filtra a ese estado; click de nuevo → deselecciona y vuelve a las 8 filas. Solo 0 o 1 filtro activo. La card "EN CURSO" (count 0) tiene un estilo atenuado incluso sin selección: `border-slate-100 bg-slate-50/60` en vez de `border-slate-200 bg-white`, y su badge interno usa `text-slate-300 bg-transparent` en vez del color de acento.

Estado vacío (visto en EN CURSO): texto centrado gris "Nada en este estado." sin icono ni CTA.

No hay buscador, paginación, orden de columnas, ni botones de acción (crear/eliminar/exportar). No hay sub-navegación tipo pestañas de texto — el filtrado vive enteramente en las 5 stat-cards.

Header global y panel Ayuda: idénticos al resto de la intranet (`TopNav` + `HelpPanel`, ya implementados) — el enlace "Mis avisos" dentro de `HelpPanel` tiene `href="/incidencias"` en el live (apunta a este propio módulo).

## Arquitectura

- **Ruta:** `/incidencias` → `<IncidenciasShell>` (nuevo, sigue el patrón de `MiTrabajoShell`: `AppLayout` sin prop `module` — no hay tabs de sub-navegación) → `<IncidenciasPage />`.
- **Registro de ruta:** añadir en `src/app/router.tsx`:
  ```tsx
  import { IncidenciasShell } from '@/features/modules/IncidenciasShell';
  // ...
  <Route path="/incidencias" element={<IncidenciasShell />} />
  ```
  (Igual que `/mi-trabajo`, sin rutas hijas.)
- **Feature folder:** `src/features/incidencias/` con `data/incidencias.ts`, `components/`, `pages/IncidenciasPage.tsx`.
- **Reutilización de primitivos:**
  - `Badge` de `@/components/ui` para el chip violeta "Idea" (no existe variante violeta → añadir `'violet'` a `BadgeProps['variant']` en `Badge.tsx`, reutilizando el mismo componente en vez de duplicar estilos).
  - `StatCard` **no** se reutiliza tal cual: las stat-cards de Incidencias son `<button>` toggle con badge de color + número, forma distinta a `StatCard` (que es una `Card` no interactiva con label/value/caption). Se documenta como delta de forma, ver Componentes (`IncidenciaStatFilter` es un componente nuevo y pequeño).
  - Avatar: `Avatar` de `@/components/ui` fuerza `bg-brand-600` fijo y no soporta "silueta gris genérica sin iniciales" ni color determinístico por usuario → se crea `IncidenciaAvatar` nuevo y pequeño (18px, color por hash de nombre o gris genérico), documentado como no-reuso intencional.
  - `HelpPanel`/`ReportDialog` (`src/components/layout/`) ya existen y se reutilizan sin tocar su lógica, salvo el delta de enlazar "Mis avisos".

## Modelo de datos (espejo Supabase)

```ts
// tabla incidencias (creada desde el widget de Ayuda de cualquier pantalla de la intranet)
export type IncidenciaEstado = 'nueva' | 'auto' | 'en_curso' | 'resuelta' | 'descartada';
export type IncidenciaTipo = 'idea'; // único valor visto en el seed; el enum admite más a futuro (p.ej. 'bug', 'duda') sin confirmar en el live

export interface Incidencia {
  id: string;
  estado: IncidenciaEstado;
  tipo?: IncidenciaTipo;       // undefined = sin chip (algunas filas no muestran "Idea")
  texto: string;               // reporte completo, puede ser multilínea; se trunca a 1 línea en UI
  hasAttachment: boolean;      // icono 📎 (adjuntó captura vía ReportDialog)
  routePath: string;           // ruta de la app donde se originó el reporte (snapshot, no FK real a una tabla)
  reporterName?: string;       // nombre completo para aria-label del avatar; undefined = reportante anónimo/desconocido
  reporterInitials?: string;   // p.ej. 'FV', 'AG', 'JC'; undefined = avatar gris genérico
  reporterColor?: string;      // color determinístico por usuario (hex), p.ej. FV=#EA580C, AG=#16A34A, JC=azul; undefined = gris genérico
  // Columna "—" del live: siempre vacía en los datos actuales, reservada a futuro
  // (posible nota de respuesta del equipo o assignee) — no modelada como campo hasta confirmar su propósito.
}
```

**Denormalización/snapshot documentada:** `routePath` es la URL donde el usuario pulsó "Ayuda" → no es FK a una tabla, es snapshot de contexto. `reporterName`/`reporterInitials`/`reporterColor` son denormalizados desde una futura tabla `users` (FK conceptual `reporterId`, no confirmable sin datos adicionales del live); se guardan ya resueltos porque varias filas semilla no tienen identidad de usuario.

### Seeds exactos (orden tal cual llega en el live, sin filtrar)

| # | estado | tipo | texto (íntegro donde se conoce) | adjunto | routePath | reporter | iniciales/color |
|---|--------|------|-----------------------------------|---------|-----------|----------|------------------|
| 1 | descartada | idea | "viendo como crear un cliente y pone una dirección de correo. Puede haber más de un contacto, si es Marketing, Dirección o administración?" | no | `/` | FV | naranja `#EA580C` |
| 2 | resuelta | — (sin tag) | "Me gustaría hacer la solicitud de 2 cosas: 1. Que se pudiera crear un nuevo evento haciendo clic en el calendario, 2. opción de catalán, 3. arreglar generación de copys por IA" (truncado en UI) | sí | `/euphoric/calendario` | AG | verde `#16A34A` |
| 3 | descartada | idea | variante parcial del texto anterior (2 de las 3 peticiones) | no | `/` | AG | verde `#16A34A` |
| 4 | descartada | — (sin tag) | "Esto debería estar enlazado con no..." (truncado) | sí | `/euphoric/campanas` | — anónimo | gris genérico |
| 5 | nueva | idea | "En el apartat de contactes del Signer/Buyer molaria afegir la opcio de posar TEL" | no | `/shows/nuevo` | JC | azul |
| 6 | descartada | idea | "Esto podrías darle color por favor, en cada pestaña igual." | sí | `/shows/95a152d1-d546-400b-904d-195f84400c66` | — anónimo | gris genérico |
| 7 | resuelta | idea | petición larga sobre logística de traslados/habitaciones/vuelos por defecto según miembros del artista (truncada) | sí | `/shows/08ea3304-af17-4722-84d5-d3b63347fe74` | — anónimo | gris genérico |
| 8 | auto | idea | "¿por qué no puedo seleccionar ida y vuelta en la estimación de vuelo?" | no | `/shows/08ea3304-af17-4722-84d5-d3b63347fe74` | — anónimo | gris genérico |

Conteos derivados (fuente de verdad para el header): nueva=1, auto=1, en_curso=0, resuelta=2, descartada=4 → suman 8.

## Helpers (`incidencias.ts`)

```ts
export const INCIDENCIA_ESTADOS: { id: IncidenciaEstado; label: string }[]; // orden fijo: nueva, auto, en_curso, resuelta, descartada

listIncidencias(): Incidencia[];                                  // seed completo, orden de llegada
countByEstado(list: Incidencia[]): Record<IncidenciaEstado, number>;
filterByEstado(list: Incidencia[], estado: IncidenciaEstado | null): Incidencia[]; // null = sin filtro (las 8)
```

Sin `sumBy*`/`groupBy*` — el módulo no muestra importes ni agrupación visual más allá del filtro plano.

## Componentes (unidades pequeñas y aisladas)

1. **`IncidenciaStatFilter`** — una de las 5 tarjetas-stat. Props: `estado`, `label` (uppercase), `count`, `selected: boolean`, `onToggle: () => void`. Variantes de estilo: normal (`border-slate-200 bg-white hover:border-slate-300`), seleccionada (`border-slate-800 bg-white shadow-sm`), atenuada cuando `count === 0` y no seleccionada (`border-slate-100 bg-slate-50/60`, badge `text-slate-300 bg-transparent`). El badge de color por estado usa `Badge` (`rose`=nueva, `sky`=auto, `neutral`/atenuado=en_curso, `emerald`=resuelta, `neutral`=descartada).
2. **`IncidenciaAvatar`** — círculo 18px, iniciales blancas 8px sobre `reporterColor`, o silueta gris genérica si no hay `reporterInitials`. `aria-label={reporterName ?? 'Reportante desconocido'}`.
3. **`IncidenciaRow`** — fila completa: `<button type="button">` (inerte, `onClick` no-op documentado) `flex w-full items-center gap-3 px-4 py-2.5 hover:bg-slate-50`; contiene badge de estado (`w-24`, variante `text-center`), chip `Badge variant="violet"` "Idea" si `tipo === 'idea'`, texto truncado (`min-w-0 flex-1 truncate text-sm text-slate-800`), 📎 si `hasAttachment`, `routePath` (`hidden lg:block w-40 truncate text-[11px] text-slate-400`), guion `—` fijo (`w-20 text-right text-[11px] text-slate-400`), `IncidenciaAvatar`.
4. **`IncidenciaList`** — contenedor `overflow-hidden rounded-xl border border-slate-200 bg-white` + `divide-y divide-slate-50` de `IncidenciaRow`; si la lista filtrada está vacía, renderiza el estado vacío centrado "Nada en este estado." (gris, sin icono).
5. **`IncidenciasPage`** — orquesta: estado local `estadoFilter: IncidenciaEstado | null`; `filterByEstado(seed, estadoFilter)`; header H2 + subtítulo; fila de 5 `IncidenciaStatFilter` (toggle exclusivo: click en la ya seleccionada limpia el filtro); `IncidenciaList`.

## Interactividad (funcional in-memory; nunca muta el live ni persiste)

- Click en una `IncidenciaStatFilter` → filtra la lista a ese estado (funcional). Click de nuevo sobre la misma → limpia el filtro (funcional, toggle exclusivo — nunca multi-select).
- Filtro por estado 100% en memoria sobre el seed fijo; no hay red ni Supabase real.
- Fila (`IncidenciaRow`) → `onClick` no-op documentado (el live probablemente abre detalle/drawer, no explorado por la regla de no-navegación a lo desconocido; se deja inerte y así se anota).
- `HelpPanel` reutilizado sin cambios de comportamiento (colapsar/expandir, `ReportDialog`), salvo enlazar "Mis avisos" a `/incidencias` con `<Link>` de `react-router` (delta mínimo, ver abajo) — no añade lógica de "solo mis reportes".

## Deltas intencionales vs live

- `Badge` gana la variante `'violet'` (reutilizado en vez de duplicar el chip "Idea" a mano).
- `IncidenciaStatFilter` y `IncidenciaAvatar` son componentes nuevos (no se fuerza el reuso de `StatCard`/`Avatar` existentes porque su forma visual e interactiva no coincide — documentado arriba en Arquitectura).
- "Mis avisos" en `HelpPanel` pasa de `<button>` inerte a `<Link to="/incidencias">` (mismo destino que en el live); no se implementa ningún filtro de autoría porque el live no lo evidenció.
- Sin `brand-*` en grises/negros del árbol (regla del proyecto); paleta de estado limitada a `rose`/`sky`/`slate`/`emerald` tal cual el live.

## Testing

- **Datos (`incidencias.test.ts`):** seed de 8 filas en el orden exacto; `countByEstado` (1/1/0/2/4); `filterByEstado` por cada estado + `null` (8 filas); inmutabilidad (no muta el array original).
- **`IncidenciaStatFilter.test.tsx`:** label/count; estilo normal vs seleccionado vs atenuado (count 0); `onToggle` se dispara al click; `aria-pressed` refleja `selected`.
- **`IncidenciaAvatar.test.tsx`:** iniciales + color cuando hay reporter; fallback gris genérico + `aria-label` "Reportante desconocido" cuando no hay identidad.
- **`IncidenciaRow.test.tsx`:** badge de estado, chip "Idea" condicional, texto truncado, 📎 condicional, `routePath` condicional (oculto si no aplica breakpoint no se testea en jsdom, se testea presencia en DOM), guion fijo, avatar.
- **`IncidenciaList.test.tsx`:** renderiza filas cuando hay datos; estado vacío "Nada en este estado." cuando la lista filtrada está vacía.
- **Integración `IncidenciasPage.test.tsx`:** sin filtro muestra 8 filas y stats 1/1/0/2/4; click en cada stat-card filtra a su subconjunto exacto (NUEVAS→1 fila JC, AUTO→1 fila, EN CURSO→vacío con mensaje, RESUELTAS→2 filas, DESCARTADAS→4 filas); segundo click en la misma card limpia el filtro (vuelve a 8); solo un filtro activo a la vez; sin clases `brand-*` en el árbol.
- **Verificación final:** Playwright ours↔live en las 6 vistas (sin filtro + 5 filtros), 0 errores de consola.

## Criterios de aceptación

1. `/incidencias` renderiza `IncidenciasPage` dentro de `IncidenciasShell` (patrón `AppLayout` sin tabs, igual que `/mi-trabajo`).
2. H2 "Incidencias" + subtítulo exacto del live.
3. 5 `IncidenciaStatFilter` con conteos 1/1/0/2/4; "EN CURSO" (count 0) con estilo atenuado incluso sin selección.
4. Sin filtro: 8 filas en el orden exacto del seed, con badge/chip/texto/adjunto/ruta/avatar correctos según la tabla de seeds.
5. Cada stat-card filtra correctamente al subconjunto exacto observado en el live (capturas `-nuevas`, `-auto`, `-en-curso`, `-resueltas`, `-descartadas`); toggle exclusivo (0 o 1 filtro activo); segundo click limpia.
6. Filtro "EN CURSO" muestra el estado vacío "Nada en este estado." centrado, sin icono.
7. Fila de lista inerte al click (no navega, no abre nada) — documentado como diferido, no inventado.
8. `HelpPanel` global sigue funcionando igual; "Mis avisos" enlaza a `/incidencias`.
9. Suite verde, lint 0 (`--max-warnings 0`), `tsc` limpio, sin clases `brand-*` en los grises/negros; `Badge` gana variante `'violet'` reutilizada (no duplicada).
