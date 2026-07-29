# Creativos — recalco al live (2026-07-27) · Design

**Rama:** `feature/recalco-creativos` (base `main`, `7659541`) · **PR:** una sola al cierre.
**Módulo:** `src/features/creativos/` + `src/features/modules/CreativosShell.tsx`.
**Evidencia:** `docs/references/creativos/live-2026-07-27-*` (recon en solo lectura del 2026-07-27, 1440px full-page). Las capturas de 2026-07-10 que ya vivían en esa carpeta quedan como histórico; **manda la del 27-jul**.

## 1. Por qué

El módulo no se toca desde el 2026-07-10. El recon del 2026-07-27 muestra que el live ha renombrado el dominio de "piezas" a "creatividades", ha añadido una vista de calendario que no tenemos, y ha reducido la tabla a 6 columnas. Además desmiente una lectura previa: los pills `+ Alba` / `+ Carlos` **no son un filtro**, son atajos de creación pre-asignada.

## 2. Alcance

Siete deltas, todos respaldados por evidencia literal:

### D1 — Sub-nav: `Piezas` → `Creatividades`
`CreativosShell.tsx:7` define `tabs = [{ label: 'Piezas', href: '/creativos' }]`. El live rotula esa única pestaña **`Creatividades`** (`live-2026-07-27-90-subnav.json`). El `href` NO cambia. `module.name` sigue siendo `Creativos`.

No existe `CreativosShell.test.tsx`: la pestaña no está cubierta por ningún test. Se crea.

### D2 — Copy del dominio: "pieza" → "creatividad"
| Sitio | Ours hoy | Live |
|---|---|---|
| Subtítulo H1 | `Tablero de piezas del equipo de diseño: …` | `Tablero de creatividades del equipo de diseño: Euphoric, clientes del CRM y empresas internas.` |
| Botón primario | `+ Nueva pieza` | `+ Nueva creatividad` |
| Stat 1 | `Piezas activas` | `Creatividades activas` |
| Cabecera tabla col. 1 | `PIEZA` | `CREATIVIDAD` |

El H1 (`Creativos`) y los otros tres stats (`Pend. aprobar`, `En correcciones`, `Atrasadas`) ya coinciden.

Los identificadores internos (`CreativePiece`, `PieceStatus`, `pieces`, `PiecesKanban`, `PiecesTable`, `NuevaPiezaDrawer`) **no se renombran**: el cambio es de copy visible, no de modelo. Renombrar tipos aquí colisionaría con `src/features/euphoric/data/types.ts`, que declara sus propios `PieceStatus`/`PiecePriority` incompatibles, y esa unificación pertenece a la fase de Euphoric.

### D3 — Tabla: 6 columnas, no 7
Live (`live-2026-07-27-21-tablero-text.txt`): `CREATIVIDAD · CLIENTE · TIPO · DEADLINE · ESTADO · CLIENTE APROB.`

`PiecesTable.tsx:9` tiene además `PRIORIDAD`. **Se elimina esa columna** (y su celda con `Badge`). `PRIORITY_VARIANT` y el campo `priority` del modelo se conservan: los usa el drawer de alta.

### D4 — Tarjetas del kanban sin badge de prioridad
Texto literal de una tarjeta del live: `AG Alba 🎬 Video Pomo 26/07 SIGHT · Vídeo · v1 23 jul 2026 ☑ 0/1`. No aparece prioridad. Estructura: avatar+nombre del responsable · (emoji `🎬` si el tipo es Vídeo) título · `CLIENTE · TIPO · vN` · deadline · `☑ hechos/total`.

**Verificar contra `live-2026-07-27-21-tablero.png` antes de tocar `PieceCard.tsx`** (Tarea 1): el volcado de texto no distingue un badge de un `<span>`, así que la ausencia de prioridad hay que confirmarla en la imagen.

Clases del live para la tarjeta: `block w-full rounded-lg border border-slate-200 bg-white p-2.5 text-left hover:border-brand-300 hover:shadow-sm`.

### D5 — "Asignar a": atajos de creación, no filtro
`CreativosPage.tsx:28-38` pinta dos `<button>` inertes. El live usa las **mismas clases** pero con `title`:

- `+ Alba` → `title="Nueva creatividad para Alba Gelabert"`
- `+ Carlos` → `title="Nueva creatividad para Carlos Pego"`

Pasan a **abrir el drawer de alta con el responsable pre-asignado**. El drawer ya existe (`NuevaPiezaDrawer`); recibe una prop opcional `assignee?: string`. El alta sigue sin persistir (mock), igual que hoy.

### D6 — Vista nueva: toggle `Tablero | Calendario`
Control segmentado a la izquierda de la fila de filtros. Clases del live: activo `rounded-md px-3 py-1 text-xs font-medium bg-white text-slate-800 shadow-sm`, inactivo `… text-slate-500 hover:text-slate-700`.

- **Tablero** (por defecto) = lo de hoy: kanban de 5 columnas **y** tabla debajo.
- **Calendario** = rejilla mensual con `←` `→` `Julio 2026` `Hoy`, cabecera `LUN MAR MIÉ JUE VIE SÁB DOM`, días de relleno del mes anterior/siguiente (`29 30` al principio, `1…9` al final), y cada creatividad pintada en el día de su deadline: `10 → Pack Sold Out · Pack Sold Out`, `22 → Flyer Claptone 02/08`, `23 → Video Pomo 26/07`.
- **En Calendario la tabla desaparece** (evidencia: `live-2026-07-27-22-calendario-text.txt` no la contiene).

Cabecera, stats, filtros y `Recursos:` se mantienen visibles en ambas vistas. Los filtros afectan también al calendario.

**Reuso obligatorio:** existe `src/features/euphoric/components/EuphoricCalendar.tsx` con rejilla mensual propia (semana Lun–Dom, `renderDay`, nav de flechas, marcador de hoy). Se **reutiliza** — no se escribe una segunda rejilla. Si su API no encaja, se extiende de forma aditiva y retrocompatible (prop nueva opcional, default = comportamiento actual), nunca se modifica su comportamiento para los consumidores de Euphoric.

### D7 — Seed al día
Las 3 creatividades del live sustituyen a las 3 del seed viejo (que incluía una `Test` inexistente):

| id | Responsable | Título | Cliente | Tipo | v | Deadline | Checklist | Estado |
|---|---|---|---|---|---|---|---|---|
| 1 | Alba (`AG`) | `Video Pomo 26/07` | SIGHT | Vídeo | v1 | 23 jul 2026 | 0/1 | Briefing |
| 2 | Carlos | `Pack Sold Out · Pack Sold Out` | SIGHT | Estático | v1 | 10 jul 2026 | 0/3 | En producción |
| 3 | Carlos | `Flyer Claptone 02/08` | SIGHT | Vídeo | v1 | 22 jul 2026 | 2/3 | Aprobado |

`CLIENTE APROB.` = `—` en las tres. Orden de la tabla en el live: 2, 1, 3 (Pack Sold Out, Video Pomo, Flyer Claptone).

Contadores resultantes — kanban `Briefing 1 · En producción 1 · Revisión 0 · Cambios 0 · Aprobado 1`; stats **`2 / 0 / 0 / 2`**.

## 3. Decisiones de diseño

**DD1 — `atrasadas` excluye `Aprobado`.** Los tres deadlines están vencidos (hoy en el live = 27 jul 2026) pero el stat marca **2**. Por tanto: `atrasadas = deadline vencido && status !== 'Aprobado'`. Hoy `deriveStats` cuenta el flag manual `isOverdue` del seed; se mantiene el flag como fuente (sembrado según esta regla) para no introducir una dependencia de la fecha del sistema en los tests. **El badge rojo de deadline en la tarjeta es otra cosa**: el recon lo vio rojo también en la tarjeta Aprobada. Confirmar ambos comportamientos contra el PNG en la Tarea 1 y, si divergen, documentar la regla de cada uno por separado.

**DD2 — el tablero compartido con Euphoric queda FUERA.** El live renderiza el mismo tablero en `/creativos` y en `/euphoric/piezas` (mismos stats, filtros, columnas, tabla y barra "Asignar a"; solo cambian H1 y subtítulo). Extraerlo como componente compartido pertenece a la fase de Euphoric, que se ejecuta en otra rama. Aquí **no se toca `src/features/euphoric/`**. Consecuencia asumida: durante un tiempo `PiezasPage` de Euphoric seguirá divergiendo. Queda anotado en la spec de Euphoric.

**DD3 — brand propio.** El botón primario del live es oscuro; el nuestro es `brand` (morado). Es BRAND del boilerplate, confirmado con Arian en su día: **no se toca**. Igual con los avatares.

**DD4 — todo mock, sin persistencia.** Alta desde el drawer, `Recursos: Editar` y el clic en tarjeta siguen sin persistir. `Recursos: — Editar` ya existe en `CreativosPage.tsx:52-54` y se deja como está.

## 4. Fuera de alcance

- Detalle de creatividad al hacer clic en tarjeta (el recon no lo abrió por no arriesgar mutaciones en producción).
- Unificar `PieceStatus`/`PiecePriority` con Euphoric.
- TopNav, panel de Ayuda y cualquier cromo global.

## 5. Verificación

- TDD estricto: test antes de implementación, un commit por tarea.
- `npx vitest run` en verde (baseline de `main`: 224 archivos / 722 tests), `npx tsc --noEmit` limpio, `npm run lint` con 0 warnings.
- **Playwright ours-vs-live a 1440px** en las dos vistas (Tablero y Calendario), capturas guardadas como `docs/references/creativos/ours-2026-07-27-{tablero,calendario}.png` y un `ours-vs-live.md` con la tabla de discrepancias y su explicación. Sin discrepancias sin explicar.
- 0 errores de consola.
