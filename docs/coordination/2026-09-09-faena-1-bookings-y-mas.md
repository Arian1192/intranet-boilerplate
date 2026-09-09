# Faena 1 — Evidencia, Bookings nuevas y «Más»

**Ejecutor:** pane `wA:pD`. **Coordinador:** `wA:p5`.
**Spec:** `docs/superpowers/specs/2026-09-09-conceptone-v3-design.md`.
**Rama:** `feature/conceptone-v3-bookings` (Fase A) y `feature/conceptone-v3-mas` (Fase D).
**Worktree:** `~/dev/worktrees/Boilerplate/c1-bookings`.

## Bloque 1 — Evidencia (empieza ya, no espera a nadie)

La Faena 0 está construyendo la carcasa y **no puedes tocar `src/` hasta que se fusione**. Mientras
tanto, captura la evidencia fina de **tus** pantallas, que hoy solo está a nivel de inventario:

`/tours` · `/liquidaciones` · `/conceptone/pendientes` · `/management/incidentes` ·
`/management/incidentes/analitica` · `/artistas` · `/reporte` · `/conceptone/ajustes`

De cada una: PNG fullPage a `deviceScaleFactor: 2`, `innerText`, **DOM del `<main>` sin truncar**, y las
cabeceras de tabla, filtros y estados vacíos literales. Guarda en
`docs/references/conceptone-v3-2026-09-09/` con el prefijo `f1-`. **Anota la hora de captura**: el live
mueve cifras en horas y el calco se fija a la foto.

Este bloque **solo toca `docs/`**, así que no compite con nadie.

## Bloque 2 — Fase A (tras fusionarse la Faena 0)

`/tours`, `/liquidaciones`, `/conceptone/pendientes`. Detalle en el §3 del spec.
`/liquidaciones` es la grande: 3 KPI, conmutador `Por show` / `Por artista`, filtro de 5 estados y
tabla de 9 columnas.

## Bloque 3 — Fase D

`/management/incidentes` + `/management/incidentes/analitica`, `/artistas`, `/reporte`,
`/conceptone/ajustes`.

`/conceptone/ajustes` **no es una pantalla nueva**: re-expone paneles que ya tenemos en
`/configuracion/comisiones` y `/configuracion/alertas`. Reutiliza, no dupliques.

## Reglas anti-conflicto (§6 del spec, obligatorias)

1. **No toques `router.tsx`.** La Faena 0 ya registró tus 14 rutas contra stubs: tú sustituyes el cuerpo
   de tu página, nada más. Si necesitas una ruta que no está, **pídesela al coordinador**.
2. **Congelados:** `src/features/booking/shell/*` (incluido `apx.css`), `nav.ts`, `ConceptOneShell.tsx`.
3. **Una pantalla = un fichero de página + un fichero de datos propio.** Nada de ampliar `index.ts`
   compartidos: los barrels son el conflicto clásico.
4. **Worktree en `~/dev/worktrees/Boilerplate/`.** `~/orca/` está deprecado.

## Reglas generales

1. **Acuse primero:** `RECIBIDO` + reformulación con tus palabras.
2. **El live es SOLO LECTURA.**
3. **Reporta** con `herdr agent prompt wA:p5 "FAENA 1 <HITO|PREGUNTA|BLOQUEO>: <mensaje>"` al cerrar cada
   bloque, y deja el pane `idle`.
4. **Nada se fusiona a `main` sin OK explícito.**
5. **Verificación:** `npm test`, `npx tsc --noEmit`, `npm run lint` pegados en el reporte.
