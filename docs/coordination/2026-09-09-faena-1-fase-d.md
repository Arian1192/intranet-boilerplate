# Faena 1 · Fase D — Management III y «Más»

**Ejecutor:** pane `wA:pD`. **Coordinador:** `wA:p5`.
**Spec:** `/home/arian/dev/Boilerplate/docs/superpowers/specs/2026-09-09-conceptone-v3-design.md` §3
— léelo **desde esa ruta absoluta**, que es la copia viva.
**Rama:** `feature/conceptone-v3-mas` (nueva, sale de `main`).
**Worktree:** `~/dev/worktrees/Boilerplate/c1-mas` — **es nuevo y ya está listo**, con `node_modules`
enlazado y la ruta de humo verde. No es el `c1-bookings` de la Fase A.

## Lo primero: lee esto antes de tocar nada

Se cerró la terminal a las 11:01 y te fuiste con ella. **Tu Fase A está a salvo y cerrada.** Mientras
no estabas, el coordinador ha hecho cuatro cosas por ti:

1. **La PR #24 (carcasa) está FUSIONADA en `main`.**
2. **Commiteó el `router.tsx` que dejaste sin commitear**: la ruta `/tours/:tourId` que faltaba, con su
   test de registro montando el `AppRouter` de verdad. Sin eso, `TourDetallePage` era inalcanzable.
3. **Rebasó `feature/conceptone-v3-bookings` sobre `main`** y la re-verificó:
   258 ficheros / **1116 tests verdes**, `tsc` y `lint` limpios.
4. **Abrió la PR #26** con la Fase A. Si Arian pide cambios, te aviso y vuelves a `c1-bookings`.

## Alcance de la Fase D

`/management/incidentes` · `/management/incidentes/analitica` · `/artistas` · `/reporte` ·
`/conceptone/ajustes`

Las cinco rutas **ya existen en el router apuntando a stubs**: sustituyes el cuerpo de cada página.

## El dato ya está en casa

Tú mismo capturaste las cinco en el Bloque 1: `docs/references/conceptone-v3-2026-09-09/` con prefijo
`f1-`, más tu informe `f1-README.md`. Y tu §9 ya avisó de dos cosas que el spec no recogía:

- **la tabla que el spec atribuye a `/reporte` vive en su pestaña `Resumen`**, no en la raíz;
- **`/conceptone/ajustes` tiene 10 paneles**, no los 9 del spec: falta `Ocultar movimientos`.

Re-captura sólo lo que te falte, con prefijo `f1-` y anotando la hora. El calco se fija a la foto.

## `/conceptone/ajustes` no es una pantalla nueva

Re-expone paneles que **ya tenemos** en `/configuracion/comisiones` y `/configuracion/alertas`.
**Reutiliza, no dupliques.**

Y ojo con la pregunta que dejaste abierta: el panel «Comisiones y exclusividad» del live dice
**«agente»** donde nosotros decimos **«booker»** (10 ficheros de `/configuracion`).
**Decisión del coordinador: NO renombres nada.** Calca el texto del live *en tu pantalla* y deja
`/configuracion` como está; el renombrado global es otra ronda. Si te choca, dímelo, no lo arregles.

## Lo que ya sabes y no debes volver a descubrir

- **Las clases `brand-*` se escriben tal cual.** El violeta lo pone `apx.css` dentro de `.apx`.
  Hardcodearlo rompe el modo oscuro.
- **Los importes de estas pantallas llevan espacio duro (U+00A0)**; `formatImporte` de `cobros.ts` mete
  uno normal. Ya te mordió en la Fase A.
- **`apx.css`, `router.tsx`, `nav.ts` y `shell/` siguen congelados.** Si necesitas una ruta que no está,
  **pídemela** y va en commit aparte, como la 15 y la 16.
- **Una pantalla = un fichero de página + un fichero de datos propio.** Sin barrels compartidos.

## Reglas

1. **Acuse primero:** `RECIBIDO` + reformulación con tus palabras.
2. **El live es SOLO LECTURA.** Login, navegación y captura. Ni formularios, ni guardados, ni el toggle
   de tema.
3. **Reporta** con `herdr agent prompt wA:p5 "FAENA 1 <HITO|PREGUNTA|BLOQUEO>: <mensaje>"` al cerrar la
   fase, y deja el pane `idle`.
4. **Nada se fusiona a `main` sin OK explícito** de Arian a través del coordinador. Al cerrar, pushea y
   **avísame**: la PR la abro yo.
5. **Verificación:** `npm test`, `npx tsc --noEmit`, `npm run lint` pegados en el reporte.
   Baseline de `main` tras la carcasa: **251 ficheros / 1051 tests**.
