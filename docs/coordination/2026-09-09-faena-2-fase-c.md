# Faena 2 · Fase C — Management II

**Ejecutor:** pane `wA:pC`. **Coordinador:** `wA:p5`.
**Spec:** `/home/arian/dev/Boilerplate/docs/superpowers/specs/2026-09-09-conceptone-v3-design.md` §3
— léelo **desde esa ruta absoluta**, que es la copia viva.
**Rama:** `feature/conceptone-v3-management` (la misma de la Fase B, ya pusheada).
**Worktree:** `~/dev/worktrees/Boilerplate/c1-management`.

## Lo primero: lee esto antes de tocar nada

Se cerró la terminal a las 11:01 y te fuiste con ella. **Tu Fase B está a salvo** (commit `b5b56d8`).
Mientras no estabas, el coordinador ha hecho tres cosas por ti:

1. **La PR #24 (carcasa) está FUSIONADA en `main`.** Ya no eres una rama huérfana.
2. **Tu rama está rebasada sobre `main`** y re-verificada: 254 ficheros / **1069 tests verdes**,
   `tsc` y `lint` limpios. Los hashes cambiaron (`4b27b22` → `b5b56d8`).
3. **Está pusheada** a `origin/feature/conceptone-v3-management`.

**No rebases otra vez y no hagas `git pull` a ciegas**: tu worktree ya está donde tiene que estar.
Arranca con `git log --oneline -5` y confírmalo tú mismo.

## Alcance de la Fase C

`/management/contratos` · `/management/activaciones` · `/management/campanas` · `/management/content`

Las cuatro rutas **ya existen en el router apuntando a stubs**: sustituyes el cuerpo de cada página,
nada más. Detalle de cada una en el §3 del spec.

## El dato ya está en casa

El barrido de las 09:20-09:40 cubre tus cuatro rutas **sin truncar**:
`docs/references/conceptone-v3-2026-09-09/management--{contratos,activaciones,campanas,content}.{txt,main.html,png}`.
Y tú mismo capturaste los detalles con prefijo `f2-`. Empieza por ahí; re-captura sólo los estados
secundarios que te falten, con prefijo `f2-` y anotando la hora.

`/management/campanas` trae cifras que el live mueve a diario: fija las de tu captura y dilo en la PR.

## Lo que ya sabes y no debes volver a descubrir

- **Las clases `brand-*` se escriben tal cual.** Dentro de `.apx` el violeta lo pone `apx.css`.
  Nunca lo hardcodees: rompe el modo oscuro.
- **Los componentes base `.btn`, `.btn-primary`, `.card` y `.badge` ya están** en `src/styles/index.css`;
  los añadiste tú en la Fase B. No los redefinas.
- **`apx.css`, `router.tsx`, `nav.ts` y `shell/` siguen congelados.** La excepción de la ruta 15 se
  aprobó y se commiteó aparte; si necesitas otra, **pídemela**, no la tomes.
- **Una pantalla = un fichero de página + un fichero de datos propio.** Sin barrels compartidos.

## Reglas

1. **Acuse primero:** `RECIBIDO` + reformulación con tus palabras.
2. **El live es SOLO LECTURA.** Login, navegación y captura. Ni formularios, ni guardados, ni el toggle
   de tema.
3. **Reporta** con `herdr agent prompt wA:p5 "FAENA 2 <HITO|PREGUNTA|BLOQUEO>: <mensaje>"` al cerrar la
   fase, y deja el pane `idle`.
4. **Nada se fusiona a `main` sin OK explícito** de Arian a través del coordinador. Al cerrar la Fase C,
   pushea y **avísame**: la PR la abro yo.
5. **Verificación:** `npm test`, `npx tsc --noEmit`, `npm run lint` pegados en el reporte.
   Baseline actual de tu rama: **254 ficheros / 1069 tests**.

## Después de esto

La Fase G (los 3 modales de edición de Management) depende de la C y es tuya por continuidad, pero
**no la empieces sin que yo te la mande**.
