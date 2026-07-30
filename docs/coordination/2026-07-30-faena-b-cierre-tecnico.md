# Faena B — Cierre técnico: PR #21 + limpieza de worktrees + DRY del tablero de piezas

**Ejecutor:** Claude en pane `wA:pD`. **Coordinador:** `wA:p5`.
**Reportas con:** `herdr agent prompt wA:p5 "FAENA B HITO: <mensaje>"`.
**Regla de oro:** el live es **SOLO LECTURA**. `bookings.conceptoneagency.com` — `test@blackmoose.es` / `Concept1234`.
Navega **por clic** dentro de la SPA (la URL directa rebota a Home).

## Por qué existe esta faena

`main` está verde y con todo fusionado, pero la ronda anterior dejó tres cabos sueltos: una PR viva sin verificar,
seis worktrees zombis (tres en la ruta `~/orca` ya deprecada) y una duplicación de código conocida.

**Trabajas en las tres fases en orden. Reporta al cerrar cada una.**

## Fase B0 — Acuse
Responde `RECIBIDO` + reformula la faena con tus palabras antes de tocar nada.

---

## Fase B1 — Verificar y dejar lista la PR #21 (prioridad máxima)

**PR #21** `feat(team): ruta /personal/usuarios — permisos y cuentas de la intranet`,
rama `feature/config-usuarios`, base `main`, 24 ficheros, `MERGEABLE`/`CLEAN`. **Nadie la ha verificado.**

Contexto: en la barra de Configuración (sección SISTEMA) el enlace **"Cuentas (auditoría)"** apunta en el live a
`/personal/usuarios`; nosotros apuntábamos a `/personal`. La PR crea esa ruta y corrige el enlace.

El worktree `~/dev/worktrees/Boilerplate/mi-trabajo-v2` **ya tiene esa rama** checkouteada (nombre engañoso, es
herencia de la ronda anterior). Úsalo o crea uno limpio en `~/dev/worktrees/Boilerplate/config-usuarios`, como prefieras.

1. Rebase/merge de `origin/main` si hace falta y verifica en verde: `npm test`, `npx tsc --noEmit`, lint.
   **Pega la salida real en el reporte** — el baseline de `main` es 249 ficheros / 965 tests, así que el total debe subir.
2. **Fidelidad**: abre el live por clic (Configuración → SISTEMA → "Cuentas (auditoría)") y compara contra lo nuestro.
   Verifica columnas, copy, permisos/roles y cifras. Deja capturas del live y de lo nuestro en
   `docs/references/config-usuarios/` si faltan.
3. Comprueba que el enlace de Configuración apunta a la ruta nueva y que **no quedan enlaces huérfanos a `/personal`**
   que en el live vayan a otro sitio.
4. Reporta al coordinador: veredicto (listo / qué falta), salida de tests, y discrepancias encontradas.
   **NO fusiones** — el merge lo autoriza Arian.

---

## Fase B2 — Limpieza de worktrees (mecánica, pero hazla con cuidado)

Convención acordada: **todo worktree vive en `~/dev/worktrees/Boilerplate/<nombre>`**. `~/orca/` queda **deprecado**.

Estado actual (`git worktree list` desde `/home/arian/dev/Boilerplate`):

| Worktree | Rama | Situación |
|---|---|---|
| `~/orca/workspaces/Boilerplate/creativos` | `feature/recalco-creativos` | fusionada (#16) |
| `~/orca/workspaces/Boilerplate/cruda` | `feature/recalco-cruda` | fusionada (#15) |
| `~/orca/workspaces/Boilerplate/euphoric` | `feature/euphoric-recalco` | fusionada (#17) |
| `~/dev/worktrees/Boilerplate/conceptone-v2` | `feature/brand-carbon` | fusionada (#20) |
| `~/dev/worktrees/Boilerplate/mi-trabajo-v2` | `feature/config-usuarios` | **VIVA — PR #21, no la toques hasta cerrar B1** |

**Antes de borrar nada**, en CADA worktree:
1. `git status --porcelain` → si hay cambios sin commitear, **NO borres**: rescátalos
   (`git stash`/parche a `~/dev/worktrees/Boilerplate/evidence/rescate-2026-07-30/`) y reporta qué encontraste.
2. `git log origin/main..HEAD --oneline` → si hay commits **no** contenidos en `main`, **NO borres**: reporta y espera OK.
3. Comprueba que ningún pane de herdr está usando ese directorio (`herdr pane list --workspace wA`).

Solo cuando los tres checks salgan limpios: `git worktree remove <ruta>` y borra la rama local ya fusionada
(`git branch -d`, nunca `-D` sin preguntar). Deja `~/orca/workspaces/Boilerplate/` **vacío** y, si queda,
`git worktree prune`.

Reporta: tabla de qué se borró, qué se rescató y qué quedó vivo y por qué.

---

## Fase B3 — Follow-up (b): extraer el tablero de piezas compartido (DRY)

Duplicación real y verificada en `main`:

- `src/features/creativos/components/` → `PiecesKanban.tsx` (36 l.), `PieceCard.tsx` (45 l.), `PiecesTable.tsx` (47 l.)
- `src/features/euphoric/components/` → `PieceBoard.tsx`, `PieceDrawer.tsx`, `StatusChip.tsx`
  (consumidos por `src/features/euphoric/pages/PiezasPage.tsx`, 273 l.)

Objetivo: **un solo tablero parametrizado** (patrón ya usado con éxito en Mixmag/TAGMAG) que sirva a
`/creativos` y a `/euphoric/piezas` sin cambiar **ni un píxel** de ninguna de las dos vistas.

**Restricción dura: es un refactor, no un rediseño.** Si las dos vistas difieren de verdad en el live, la diferencia
se modela como **parámetro**, jamás unificando hacia una de las dos. Si al ver el código concluyes que la extracción
no compensa (más props que código compartido), **para y repórtalo** — abandonar con argumentos es un resultado válido.

1. Rama nueva `feature/tablero-piezas-dry` desde `origin/main`, en worktree `~/dev/worktrees/Boilerplate/tablero-dry`.
2. **Antes de tocar nada**: caracteriza el comportamiento actual. Los tests existentes
   (`PiecesKanban.test.tsx`, `PieceCard.test.tsx`, `PiecesTable.test.tsx`, `PiezasPage.test.tsx`) son tu red de
   seguridad — si cubren poco, **añade tests primero** (TDD: rojo → verde → refactor).
3. Extrae a `src/features/modules/` (o donde viva hoy el código compartido — mira cómo lo hizo Mixmag/TAGMAG antes
   de inventar una ubicación) y reconecta ambos consumidores.
4. Verde obligatorio al terminar: `npm test`, `npx tsc --noEmit`, lint. **El número de tests no puede bajar.**
5. PR sobre `main`: `gh pr create --base main` con título `refactor(piezas): tablero compartido creativos ↔ euphoric`.
   En el cuerpo, di explícitamente qué es idéntico, qué quedó como parámetro y por qué.
   Reporta el nº de PR. **NO fusiones.**

---

## Reglas
- Reporta al cerrar **cada fase** y quédate `idle` para que el coordinador pueda sondearte.
- **Nada se fusiona a `main` sin OK explícito** del coordinador (lo autoriza Arian).
- Si el live pide una acción que **escribe** (guardar, borrar, enviar), **no la hagas**.
- "Hecho" exige salida real de comandos pegada en el reporte, no impresiones.
- Si te bloqueas > 15 min, reporta `FAENA B BLOQUEO:` en vez de insistir.
