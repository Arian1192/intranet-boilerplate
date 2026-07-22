# Fase B — Mixmag/TAGMAG · Contenidos (calco pixel-perfect)

**Fecha:** 2026-07-22
**Rama:** `feature/mixmag-tagmag-contenidos` (sobre `feature/mixmag-tagmag`)
**Requisito clave (usuario):** 100% fiel al live, porque cuando tengamos acceso a Supabase debemos adaptarnos a las tablas → el modelo de datos espeja tablas reales. Pixel-perfect.

## Objetivo

Reemplazar el placeholder "En construcción" de la pestaña **Contenidos** de los módulos gemelos **Mixmag** y **TAGMAG** (`/mixmag/contenidos`, `/tagmag/contenidos`) por un calco fiel y funcional del tablero de contenidos del live. Una única página parametrizada sirve a ambas revistas leyendo `useOutletContext<Magazine>`.

Fuera de alcance (fases posteriores): **Campañas** (Fase C), arrastrar/mover piezas en Kanban, editor de pieza, "+ Contenido" real.

## Contexto del live (fuente de verdad)

Referencias capturadas en `docs/references/mixmag/`:
- `live-mixmag-contenidos-panel.png`, `live-mixmag-contenidos-kanban.png`
- `live-tagmag-contenidos-panel.png`, `live-tagmag-contenidos-kanban.png`
- `live-scan.json` (texto completo de ambas revistas), `live-contenidos-tokens.json` (botón `+ Contenido`)

Texto de ayuda del live (comportamiento canónico):
> "Panel para leer, kanban para arrastrar. El panel separa Redes, Web y Revista —tres equipos distintos— y las cajas de estado filtran al pulsarlas. El kanban es para mover piezas de fase."
> TAGMAG: "«Pendiente de revisión» es del robot. Ahí caen las noticias que trae la ingesta… «Aprobado» va antes que «Borrador»."

## Arquitectura

- **Ruta:** `/mixmag/contenidos` y `/tagmag/contenidos` → `<ContenidosPage />` (reemplaza `EnConstruccionPage`). Ambas dentro de sus shells (`RedaccionShell`), que ya inyectan `Outlet context={magazine}`.
- **Página parametrizada:** `ContenidosPage` lee `magazine = useOutletContext<Magazine>()`, obtiene sus estados y piezas vía helpers de `contenidos.ts` (keyed por `magazine.id`). Cero hardcoding de revista en la página (mismo principio que Resumen/Revistas de Fase A).
- **Datos separados:** `src/features/redaccion/data/contenidos.ts` (patrón espejo de `crm/data/pipeline.ts`). No se toca `data/seed.ts` (Magazine) ni `types.ts` salvo para exportar nuevos tipos desde `contenidos.ts`.

## Modelo de datos (espejo Supabase)

```ts
export type ContentTeam = 'redes' | 'web' | 'revista';
export type MagazineId = 'mixmag' | 'tagmag';

// tabla content_statuses — workflow de estados por revista
export interface ContentStatus {
  id: string;               // p.ej. 'mix-idea', 'tag-pend-rev'
  magazine: MagazineId;     // FK
  label: string;            // 'IDEA', 'BORRADOR', 'PENDIENTE DE REVISIÓN', ...
  order: number;            // orden en panel/kanban
  teamsOnly?: ContentTeam[]; // si se define, solo estos equipos muestran esta columna (MAQUETACIÓN → ['revista'])
  tone: 'plain' | 'slate' | 'amber'; // estilo del chip cuando la pieza está en ese estado
}

// tabla content_pieces
export interface ContentPiece {
  id: string;
  magazine: MagazineId;     // FK
  team: ContentTeam;
  statusId: string;         // FK → ContentStatus.id
  title: string;
  type: string;             // 'Stories' | 'Post (IG/FB)' | 'Artículo' | 'Noticia'
  campaignId?: string;      // FK; undefined = orgánico
  campaignName?: string;    // denormalizado (para mostrar sin join)
  dueLabel: string;         // snapshot del live: '29 jul 2026' | 'hoy'
  ownerInitials?: string;   // avatar (solo algunas piezas)
  ownerColor?: string;
  mine: boolean;            // para el filtro "Solo lo mío"
}
```

**Nota de denormalización:** `campaignName` se guarda denormalizado (como `orgName`/`company` en `Opportunity`); documentado para que al conectar Supabase se resuelva por join. `dueLabel` es un snapshot textual: el live calcula fechas relativas ('hoy'/'mañana') en tiempo real; nosotros congelamos el texto observado para tener tests deterministas (documentado).

### Estados sembrados

**Mixmag** (`order` 1..9):
1. IDEA — `plain`
2. BORRADOR — `slate`
3. EN CURSO — `amber`
4. CORRECCIONES — `slate`
5. MAQUETACIÓN — `slate`, `teamsOnly: ['revista']`
6. PENDIENTE DE APROBACIÓN — `slate`
7. APROBADO — `slate`
8. PROGRAMADO — `slate`
9. PUBLICADO — `slate`

**TAGMAG** (`order` 1..6, flujo del robot):
1. PENDIENTE DE REVISIÓN — `slate`
2. APROBADO (A ESCRIBIR) — `slate`
3. BORRADOR — `slate`
4. CORRECCIONES — `slate`
5. PROGRAMADO — `slate`
6. PUBLICADO — `slate`

(Los `tone` exactos se ajustan contra el live en verificación; por defecto `slate`, IDEA `plain`, EN CURSO `amber`.)

### Piezas sembradas — Mixmag (6, exactas del live)

| team | statusId | title | type | campaña | dueLabel | avatar |
|------|----------|-------|------|---------|----------|--------|
| redes | IDEA | Campaña Test 1 · Story | Stories | Campaña Test 1 | 29 jul 2026 | — |
| redes | BORRADOR | Campaña Test 1 · Post en redes | Post (IG/FB) | Campaña Test 1 | 29 jul 2026 | — |
| web | IDEA | Campaña Test 1 · Artículo patrocinado | Artículo | Campaña Test 1 | 29 jul 2026 | — |
| web | EN CURSO | Campaña Test 1 · Artículo patrocinado | Noticia | Campaña Test 1 | 29 jul 2026 | — |
| revista | BORRADOR | Artículo Soho Farmhouse Ibiza | Artículo | — (orgánico) | hoy | sí |
| revista | BORRADOR | Campaña Test 1 · Publirreportaje | Artículo | Campaña Test 1 | 29 jul 2026 | — |

Recuentos derivados: REDES 2, WEB 2, REVISTA 2 (total 6). Por estado: IDEA 2, BORRADOR 3, EN CURSO 1.

### Piezas sembradas — TAGMAG

Vacío (`[]`). Todos los equipos muestran empty-state.

## Helpers (`contenidos.ts`)

```ts
statusesFor(magazine: MagazineId): ContentStatus[]           // ordenados por order
statusesForTeam(magazine, team): ContentStatus[]             // aplica teamsOnly
piecesFor(magazine: MagazineId): ContentPiece[]
filterPieces(pieces, f: { query?; mine?; scope?: 'todo'|'campana'|'organico'; team?; statusId? }): ContentPiece[]
groupByTeam(pieces): Record<ContentTeam, ContentPiece[]>     // orden redes, web, revista
countByStatus(pieces, statuses): Record<statusId, number>
teamCounts(pieces): { todos; redes; web; revista }
TEAMS: { id: ContentTeam; label: string; accent: ... }[]     // Redes(violeta)/Web(rosa)/Revista(verde)
```

- `filterPieces` compone: texto en `title` (case-insensitive), `mine`, `scope` (campana = tiene `campaignId`; organico = no lo tiene), `team`, `statusId`. Todos opcionales y encadenables; inmutable.

## Componentes (unidades pequeñas y aisladas)

1. **`ContenidosToolbar`** — header: dot+nombre de espacio (`magazine.spaceName`, color `magazine.accent`) · input búsqueda "Buscar por título o texto…" · toggle "Solo lo mío" · segmented "Todo/De campaña/Orgánico" · (derecha) toggle "Panel/Kanban" · botón `+ Contenido` (`#44444C`, inerte). Emite cambios vía props/callbacks; sin estado propio.
2. **`StatusBox`** — caja de estado: label (uppercase, `text-slate-400` inactiva / color por `tone` activa) + número. `button` clicable; `aria-pressed` para el filtro. Deshabilitada visualmente cuando count 0 (gris tenue) pero clicable si aplica.
3. **`TeamGroup`** (Panel) — cabecera: chevron + chip de equipo (violeta/rosa/verde) + contador; fila de `StatusBox` (los estados del equipo vía `statusesForTeam`); lista de `ContentRow` o empty-state "Nada pendiente en este canal.".
4. **`ContentRow`** (Panel) — `estado(chip) | título(font-medium) | tipo | campaña | fecha | avatar?`.
5. **`TeamTabs`** (Kanban) — tabs `Todos N / Redes N / Web N / Revista N`; activo con fondo oscuro; contador tenue. `aria-pressed`.
6. **`KanbanColumn`** — normal: header (label chip por `tone` + contador) + lista de `KanbanCard`. Colapsada (sin tarjetas): ~40px ancho, label vertical rotado (`writing-mode: vertical-rl` o rotación), gris tenue.
7. **`KanbanCard`** — `rounded border bg-white`; título `font-medium`; chip de equipo + chip de tipo (gris); pie: fecha (izq) + avatar (dcha, si `ownerInitials`).
8. **`ContenidosPage`** — orquesta: `magazine` de outlet; estado local (`view: 'panel'|'kanban'`, `query`, `mine`, `scope`, `teamTab`, `statusFilter`); aplica `filterPieces`; render condicional Panel (grupos) / Kanban (tabs + columnas).

## Interactividad (funcional in-memory; nunca muta el live ni persiste)

- Búsqueda por título → filtra en vivo.
- "Solo lo mío" → filtra `mine`.
- "Todo/De campaña/Orgánico" → filtra por `campaignId`.
- Panel: `StatusBox` clicable → filtra la lista de ese equipo al estado (toggle; segunda pulsación limpia).
- Kanban: `TeamTabs` → filtra por equipo.
- Toggle Panel/Kanban → cambia vista.
- `+ Contenido` → stub inerte (`type="button"`, sin acción).
- **Arrastrar/mover piezas** → **diferido** (documentado). El live usa drag; no inventamos botones de mover para no romper el pixel-perfect. Incremento posterior.

## Deltas intencionales vs live

- Botón `+ Contenido`: fondo `#44444C`, texto blanco, `rounded-lg`, `text-sm`, `font-medium`, `px-4 py-2` (token medido del live). Se conserva.
- No se filtra marca violeta `brand-*` en los grises/negros del live (misma política que Fase A / home-v2).
- Chips de equipo: Redes violeta, Web rosa, Revista verde (tints Tailwind; hex exacto ajustado en verificación contra screenshots).

## Testing

- **TDD por componente** (RED→GREEN): `StatusBox` (activo/inactivo/count 0/aria-pressed), `ContentRow` (campos + avatar condicional), `KanbanCard` (chips + avatar condicional), `KanbanColumn` (normal vs colapsada), `TeamTabs` (activo + contadores), `TeamGroup` (lista vs empty-state), `ContenidosToolbar` (toggles + callbacks + `+ Contenido` inerte).
- **Datos:** `contenidos.test.ts` — estados exactos por revista (Mixmag 9 incl. MAQUETACIÓN revista-only; TAGMAG 6), recuentos por equipo/estado, `filterPieces` (cada rama: query/mine/scope/team/status), TAGMAG vacío.
- **Integración `ContenidosPage`:** toggle Panel↔Kanban; parametrización (Mixmag con datos vs TAGMAG empty-states en ambas vistas); MAQUETACIÓN solo aparece en grupo/columnas de revista; filtro de status-box reduce filas; sin `brand-*` en el árbol (grep/DOM).
- **Verificación final:** Playwright ours↔live ambas revistas y ambas vistas; 0 errores de consola.

## Criterios de aceptación

1. `/mixmag/contenidos` y `/tagmag/contenidos` renderizan `ContenidosPage` (no placeholder).
2. Mixmag Panel: 3 grupos con recuentos 2/2/2, cajas de estado con números correctos, 6 filas con sus datos exactos, MAQUETACIÓN presente solo en REVISTA.
3. Mixmag Kanban: tabs Todos6/Redes2/Web2/Revista2, columnas por estado, IDEA 2 / BORRADOR 3 / EN CURSO 1 con tarjetas correctas, columnas restantes colapsadas verticales.
4. TAGMAG ambas vistas: estados del flujo robot (6), empty-states en los 3 equipos / columnas vacías.
5. Filtros y toggle de vista funcionan; `+ Contenido` inerte.
6. Suite verde, lint 0, tsc limpio, sin `brand-*` filtrado en grises.
