# Faena 0 — Carcasa `apx` de ConceptOne v3

**Ejecutor:** pane `wA:pC`. **Coordinador:** `wA:p5`.
**Spec:** `docs/superpowers/specs/2026-09-09-conceptone-v3-design.md` — léelo entero antes de tocar nada.
**Evidencia:** `docs/references/conceptone-v3-2026-09-09/` (`apx.css`, `apx-computed.json`, `foot.html`,
`conceptone.png`, `conceptone.main.html`).
**Rama:** `feature/conceptone-v3-carcasa`. **Worktree:** `~/dev/worktrees/Boilerplate/c1-carcasa`.

## Por qué esta faena va sola y primero

Es **bloqueante**: hasta que no exista el rail y las 14 rutas registradas, las otras fases no tienen
dónde colgar sus pantallas. Y es la única que toca ficheros compartidos. Cuanto antes se fusione, antes
arrancan las demás en paralelo.

## Alcance

Todo lo que dice el **§2 del spec** (D1 a D5), más el registro de rutas:

1. `src/features/booking/shell/apx.css` — **el fichero entero** de
   `docs/references/conceptone-v3-2026-09-09/apx.css`: las **208 reglas**, no solo las 83 primeras.
   Además de los tokens y el bloque oscuro, las líneas 84-208 traen los componentes (`.btn-*`, `.input`,
   `.card`, `.badge`, las pastillas…) y **27 reglas que remapean `brand-*` de carbón a violeta dentro de
   `.apx`**: sin ellas el módulo queda con acentos carbón en una carcasa violeta. No las reescribas
   «mejor»: es un calco.
2. `ApxShell.tsx` — wrapper `.apx`, estado del tema, persistencia en `localStorage['apx-tema']`
   (`light` | `dark`). **En claro el atributo `data-theme` no se pone**: el claro es su ausencia.
3. `ApxRail.tsx` — logo `/logo_antlers.svg` + `brandtxt`, CTA `Añadir show`, los 3 grupos del §2 D3 y
   el pie de 6 elementos. **Sin `title` ni `aria-label`** en los ítems: el live no los tiene.
4. `nav.ts` — `RAIL_GROUPS` y `RAIL_FOOT`. Borra `CONCEPTONE_AREAS`, `BOOKINGS_SECTIONS`, `activeArea`,
   `activeSection` y `showsSectionBar` de `src/features/booking/data/nav.ts` **y sus tests**, pero antes
   comprueba con `grep` que no los usa nadie fuera de ConceptOne.
5. `ConceptOneShell.tsx` — deja de usar `AppLayout`; pasa a `ApxShell` + `ApxRail` + `.apx-shift`.
6. `router.tsx` — registra **las 14 rutas nuevas del §3 apuntando a stubs**. El stub es un componente
   mínimo con el `h1` y la bajada literales del spec; nada más. **Esta es la parte que desbloquea a las
   demás faenas: no la dejes fuera.**

7. `public/logo_antlers.svg` y `public/logo_blackmoose.svg` — no existen en el repo. Descárgalos del
   live con `curl` (son estáticos públicos, responden `200`) y commitéalos. Bájate los dos aunque solo
   uses `antlers`: `blackmoose` lo necesita el plan del TopNav del 30-jul.

## Trampas conocidas

- **El ítem activo del rail no lleva pastilla de fondo.** Es `background: none`, solo `color: var(--accent)`
  y `font-weight: 600`. Es el fallo más fácil de cometer.
- **Hay dos ítems rotulados «Roster»** (`/management/roster` y `/artistas`). Es correcto, no lo corrijas.
- **El modo oscuro no está capturado en imagen**: el live es solo lectura y activarlo exigía pulsar.
  Cálcalo desde las reglas CSS, que sí están completas, y **dilo en tu PR**.
- **`AppLayout`/`TopNav` no se tocan.** Los usan los otros 11 módulos.

## Reglas

1. **Acuse primero:** responde `RECIBIDO` + reformulación con tus palabras antes de tocar nada.
2. **El live es SOLO LECTURA.** Login, navegar y capturar. Ni formularios, ni guardados, ni el toggle.
3. **Reporta al coordinador** con `herdr agent prompt wA:p5 "FAENA 0 <HITO|PREGUNTA|BLOQUEO>: <mensaje>"`
   al cerrar cada bloque, y deja el pane `idle`.
4. **Nada se fusiona a `main` sin OK explícito** de Arian a través del coordinador.
5. **Verificación antes de cantar victoria:** salida real de `npm test`, `npx tsc --noEmit` y
   `npm run lint` pegada en el reporte. Baseline: 252 ficheros / 1019 tests.
