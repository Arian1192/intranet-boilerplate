# Faena 2 — Management I y II (Fases B y C)

**Ejecutor:** pane `wA:pC` (el mismo que cerró la Faena 0). **Coordinador:** `wA:p5`.
**Spec:** `/home/arian/dev/Boilerplate/docs/superpowers/specs/2026-09-09-conceptone-v3-design.md`
— **léelo desde esa ruta**, que es la copia viva (rama `docs/conceptone-v3-spec`, commit `a554bc1`).
Tu worktree no la tiene: el spec ha cambiado desde que empezaste.
**Base:** `feature/conceptone-v3-carcasa` (`04e95e3`), **no `main`**. La carcasa está cerrada y
verificada por el coordinador (251 ficheros / 1051 tests) pero **la PR #24 aún no está fusionada**:
si la revisión de Arian la mueve, rebasas. Es el precio de no estar parado.
**Rama:** `feature/conceptone-v3-management`. **Worktree:** `~/dev/worktrees/Boilerplate/c1-management`.

## Alcance

**Fase B** — `/management/roster` y `/management/insights`.
**Fase C** — `/management/contratos`, `/management/activaciones`, `/management/campanas`,
`/management/content`.

Las seis rutas **ya existen en el router apuntando a stubs**: tú sustituyes el cuerpo de cada página.
Detalle de cada una en el **§3 del spec**.

## Lo que ya sabes y no debes volver a descubrir

- **Las clases `brand-*` se escriben tal cual.** Dentro de `.apx` el violeta lo pone `apx.css` con sus
  27 reglas de remapeo. Medido en el live: `bg-brand-600` → `rgb(91, 75, 232)`.
  **Nunca hardcodees el violeta**: si lo haces, la pantalla se rompe en modo oscuro.
- **`apx.css`, `router.tsx`, `nav.ts` y el `shell/` están congelados.** Si necesitas tocarlos, me lo
  pides.
- **Una pantalla = un fichero de página + un fichero de datos propio.** Sin barrels compartidos.

## Captura antes de escribir

El barrido de las 09:20-09:40 (`docs/references/conceptone-v3-2026-09-09/management--*.txt|.main.html|.png`)
cubre tus seis rutas **sin truncar**: empieza por ahí, el dato ya está en casa. Re-captura solo los
**estados secundarios** que te falten (detalles, segundas vistas, formularios vacíos) y guárdalos con
prefijo `f2-`, anotando la hora. El calco se fija a la foto.

`/management/insights` y `/management/campanas` traen cifras que el live mueve a diario: fija las de tu
captura y dilo en la PR.

## Reglas

1. **El live es SOLO LECTURA.**
2. **Reporta** con `herdr agent prompt wA:p5 "FAENA 2 <HITO|PREGUNTA|BLOQUEO>: <mensaje>"` al cerrar cada
   fase, y deja el pane `idle`.
3. **Nada se fusiona a `main` sin OK explícito** de Arian a través del coordinador.
4. **Verificación:** `npm test`, `npx tsc --noEmit`, `npm run lint` pegados en el reporte.
   Baseline tras la carcasa: **251 ficheros / 1051 tests**.
