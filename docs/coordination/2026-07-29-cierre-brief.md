# Faena 2 — Cierre de recalcos + barrido read-only del live

**Coordinador:** Claude (pane `wA:p5`). **Tú:** ejecutor.
**Reportas a:** `herdr agent prompt wA:p5 "HITO cierre: <resumen 1 línea>"`.
**Regla de oro del live:** SOLO LECTURA. `bookings.conceptoneagency.com`, `test@blackmoose.es` / `Concept1234`.
Gotcha: navegar por clic dentro de la SPA (la URL directa rebota a Home).

## Objetivo
Cerrar el trabajo ya hecho y confirmar que no ha aparecido nada nuevo en el live estos 2 días.

## Plan

### Fase A — Acuse
Responde "RECIBIDO" + reformula la tarea antes de tocar nada.

### Fase B — Barrido read-only del live (reporta hallazgos al coordinador)
Recorre por CLIC los módulos NO-Euphoric del live y compáralos con nuestro `main`: Home, ConceptOne, CRUDA,
Creativos, CRM, Mixmag/TAGMAG, Incidencias, Herramientas, Team, Configuración, Documentos/Mi-trabajo.
Objetivo: detectar cualquier cambio nuevo del live (sub-navs, copy, números, vistas nuevas) desde el 2026-07-27.
Reporta al coordinador una lista de deltas encontrados (o "sin cambios") con evidencia en `docs/references/barrido-2026-07-29/`.
(Euphoric lo lleva la Faena 1 — NO lo toques.)

### Fase C — Cerrar recalco-creativos
Worktree: `~/orca/workspaces/Boilerplate/creativos` (rama `feature/recalco-creativos`, 10 commits, plan completo, sin PR).
1. Verifica en worktree limpio: `npm test`, `tsc`, lint. Confirma que el plan `docs/superpowers/...creativos-recalco...` está 100% marcado.
2. Compara ours-vs-live de Creativos (Kanban columnas incluidas) — captura y documenta si hace falta.
3. Abre PR sobre `main` (`gh pr create --base main`). Reporta el nº de PR al coordinador. **NO merges sin OK del coordinador.**

### Fase D — Cerrar recalco-cruda (PR #15 ya abierta)
Worktree: `~/orca/workspaces/Boilerplate/cruda` (rama `feature/recalco-cruda`).
1. Verifica tests/tsc/lint en worktree limpio. Revisa que la PR #15 está MERGEABLE/CLEAN (`gh pr view 15`).
2. Confirma fidelidad del delta (seed `CR00104`, dinero acumulado por fase, `eur()` NO se toca a propósito).
3. Reporta estado al coordinador. **NO merges sin OK del coordinador.**

## Reglas de trabajo
- No merges nada sin OK explícito del coordinador (los merges a `main` los autoriza Arian).
- Reporta CADA cierre de fase al coordinador y deja el pane idle para sondeo.
- Si dudas de fidelidad, PREGUNTA; no supongas.
