# Spec + Plan — ConceptOne v2 (reestructura nav + 3 pantallas nuevas + Management)

**Coordinador:** Claude (pane `wA:p5`). **Tú:** ejecutor en worktree `feature/conceptone-v2` (ruta nueva `~/dev/worktrees/Boilerplate/conceptone-v2`, YA no en orca).
**Reportas a:** `herdr agent prompt wA:p5 "HITO conceptone: <fase> — <resumen + nº tests>"`.
**Regla de oro del live:** SOLO LECTURA (`bookings.conceptoneagency.com`, `test@blackmoose.es` / `Concept1234`, navegación por CLIC).
**Evidencia del live ya capturada** (barrido 29-jul): `~/dev/worktrees/Boilerplate/evidence/barrido-2026-07-29/` → `10-conceptone.*`, `11-c1_ofertas.*`, `11-c1_cobros.*`, `11-c1_gastos.*`, `11-c1_management_estrategias.*` (png+txt+json). Consúltala por fase; re-captura del live solo si necesitas un detalle que no esté.
**Antes de nada:** `npm ci` en el worktree (no trae node_modules). TDD, tests+tsc+lint verdes antes de CADA hito. **PR única al cierre** (patrón ConceptOne/Euphoric). NO esperes mi OK entre fases: encadena; para solo ante duda de fidelidad, conflicto de frontera, o el gate final de PR.

## Contexto
El live reestructuró ConceptOne a **dos niveles de navegación** y añadió pantallas. Nuestro `main` tiene la versión "v1" de la PR #14 (rutas planas: Dashboard, Shows, Calendario, Disponibilidad, Contactos). Hay que llevarlo a v2 SIN perder lo bueno de v1.

**Frontera:** este módulo es tuyo entero (`src/features/conceptone` o equivalente + rutas en `router.tsx`). NO toques otros módulos. Cuidado con `router.tsx` (compartido) — solo tus rutas. La rama `feature/euphoric-recalco` corre en paralelo y también toca `router.tsx`: si al hacer `git merge main` (Fase 6) hay conflicto, resuélvelo conservando ambas.

## Estructura objetivo del live (confirmada por el barrido)

### Navegación de 2 niveles
- **Nivel 1 — áreas del módulo:** `Bookings · Management · Calendario · Contactos` + botón `+ Añadir show` a la derecha.
- **Nivel 2 — secciones (solo dentro de Bookings):** `Dashboard · Shows · Ofertas · Cobros · Gastos · Disponibilidad`.
- `Calendario` y `Contactos` **suben** a nivel 1 (ya no son secciones de Bookings). `Management` es un área nueva cuya única sub-vista hoy es `Estrategias` (`/management/estrategias`).

## Plan por fases

### Fase 1 — Reestructura de navegación (shell 2 niveles) + rutas
1. Refactor del shell de ConceptOne a 2 niveles: barra de áreas `Bookings · Management · Calendario · Contactos` + `+ Añadir show`; y sub-nav de secciones que aparece cuando el área activa es Bookings (`Dashboard · Shows · Ofertas · Cobros · Gastos · Disponibilidad`).
2. Rutas: mantener Dashboard/Shows/Disponibilidad; mover Calendario y Contactos a nivel de área; **añadir** `ofertas`, `cobros`, `gastos` (secciones de Bookings) y `management/estrategias`. Reusa las páginas existentes de v1 donde apliquen.
3. Páginas nuevas con cabecera/bajada fieles y cuerpo placeholder (el cuerpo llega en sus fases). Tests de nav/rutas (áreas, secciones, activo correcto).

### Fase 2 — Ofertas (`.../ofertas`)
Master-detail. H1 `Ofertas entrantes` · bajada "Propuestas recibidas desde el formulario público de la web."
Filtros: `Todas (0) · Nuevas (0) · Revisadas (0) · Convertidas (0) · Descartadas (0)`. Vacío: "No hay ofertas aquí." + panel derecho "Selecciona una oferta". Seed vacío. Tests.

### Fase 3 — Cobros (`.../cobros`)
H1 `Cobros` · bajada "Lo que deben los promotores. Total y vencimientos salen del plan de pagos; lo cobrado, de las facturas conciliadas en Holded." Botón `Facturar el mes…`.
4 KPIs: `SHOWS POR COBRAR 7` · `PENDIENTE TOTAL 9631,60 €` · `FUERA DE PLAZO 6727,60 € · 5 show(s)` · `VENCE ESTA SEMANA 0,00 € · 0 show(s)`.
Toggle `Por show 7 · Por factura 1` y filtros `Todos 7 · Vencidos 5`.
Tabla `SHOW · ARTISTA · TOTAL · PAGADO · Pendiente · Vencimiento · CLIENTE` con las **7 filas** del barrido (`11-c1_cobros.txt`): The Next / Pau Guilera / 1016,40 € … Summer Opening Festival / Florentia / 1452,00 €. Seed espejo con esos números exactos y estados de vencimiento (Vencido · importe). Tests.

### Fase 4 — Gastos (`.../gastos`)
H1 `Gastos` · bajada "Salidas de las cuentas de Holded (banco, PayPal, Stripe). Concilia cada movimiento con un show: gasto de la agencia o liquidación al artista. Últimos 120 días."
KPIs: `GASTO SIN ASIGNAR 0,00 € · 0 movimiento(s)` · `MOVIMIENTOS (TOTAL) 0` · `CUENTAS 0`. Estado de carga/vacío fiel: "Cargando movimientos de Holded…" (inerte, mock). Tests.

### Fase 5 — Management · Estrategias (`/management/estrategias`)
Master-detail. H1 `Estrategias · Management` · bajada "Estrategia de crecimiento por artista: shows, música, patrocinios y conexiones."
Lista de artistas del barrido (`11-c1_management_estrategias.txt`): Aaron Martin, Abdon, ACA, ART NO LOGIA, Bizza, Claudia Tejeda, DH Moon, Fran Hernandez, Freddy Bello, Gaston Zani, Janse, Londonground, Los Canarios, Marcel BS, MI, Milan Rivellino, Sebastian Ledher, SO, SOVA, Test Artist, Tony Guerra, Vidaloca. Vacío: "Selecciona un artista para ver su estrategia." (Base de artistas compartida — reusa si procede sin romper la de Euphoric/ConceptOne.) Tests.

### Fase 6 — Dashboard v2 + cierre
1. Reconcilia el **Dashboard de Bookings** con el live (`10-conceptone.txt`): 6 KPIs (`TENTATIVE 11.433,78 €/12` · `CONFIRMADO 11.100,00 €/9` · `CONTRATO 0,00 €/0` · `PENDIENTE COBRO 800,00 €/1` · `PENDIENTE LIQUIDAR 6150,00 €/6` · `LIQUIDADO 1000,00 €/1`) y el **panel de atención por fecha**: `FICHAS A REVISAR` (40 artistas · 111 datos · 50 documentos · 33 bios), `POSIBLES GIGS EN CALENDARIO` (5, con `Upgrade a Show`/`Ignorar`), `ADVANCING` (5, D-n), `LOGÍSTICA` (5), `PRÓXIMOS SHOWS` (lista) y `NOTAS URGENTES` (vacío). Implementa lo que falte respecto a v1; si v1 ya lo tenía, solo ajusta a los números del live.
2. `git merge main` (absorbe lo integrado; resuelve conflictos de `router.tsx` conservando Euphoric + ConceptOne).
3. Barrido final: `npm test` verde, `tsc`, lint. Capturas `ours-*` de las pantallas nuevas para el diff.
4. Abre **PR única** sobre `main`, reporta el nº al coordinador. **NO merges sin OK del coordinador.**

## Reporte
Cierre de cada fase → `herdr agent prompt wA:p5 "HITO conceptone: Fase N — <resumen>"`. Duda de fidelidad o conflicto → PREGUNTA, no supongas.
