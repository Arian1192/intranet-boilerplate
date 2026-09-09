# Faena 2 · Fase G — Los tres modales de edición de Management

**Ejecutor:** pane `wA:pC`. **Coordinador:** `wA:p5`.
**Spec:** `/home/arian/dev/Boilerplate/docs/superpowers/specs/2026-09-09-conceptone-v3-design.md`
§3.2 y §5 (fila G).
**Rama:** `feature/conceptone-v3-management-modales`, salida del `main` **ya fusionado**.
**Worktree:** `~/dev/worktrees/Boilerplate/c1-management` — el mismo, ya puesto en la rama nueva por el
coordinador. Confírmalo con `git log --oneline -1`: debe partir de `e899d3f`.

## Punto de partida: tu trabajo ya está en `main`

La **PR #28 está FUSIONADA** (merge `e899d3f`): las Fases B y C y la corrección del contador de Roster
son ya la línea principal. `main` está verde en **266 ficheros / 1174 tests**. No arrastras rama:
partes de limpio.

## Alcance

Los **tres modales de edición** que abren las filas de tus propias pantallas de Management II:

| Pantalla | Modal | Fila |
|---|---|---|
| `/management/campanas` | `Editar campaña` | `button.text-left`, 11 filas |
| `/management/activaciones` | `Editar activación` | 31 activaciones |
| `/management/content` | `Editar proyecto` | 1 tarjeta |

De 8 a 10 campos cada uno. **No hay ruta nueva**: el modal se abre en la misma página, sin cambiar la
URL. Eso significa que **no necesitas tocar `router.tsx`** — y sigue congelado, igual que `nav.ts`,
`shell/` y `apx.css`.

## El dato ya está en casa

La evidencia la capturaste tú en la Fase B:
`docs/references/conceptone-v3-2026-09-09/f2-management--{campanas,activaciones,content}-detalle.{txt,main.html,png}`.
Ahí está el DOM del modal abierto sin truncar. **Empieza por ahí.** Re-captura sólo lo que te falte,
con prefijo `f2d-` y la hora anotada.

## Regla de sólo lectura, con el matiz que ya conoces

Sigue vigente el §3.2 del spec: **abrir** un modal de edición de un registro que ya existe está
permitido cuando hace falta para la evidencia; **teclear en un campo, guardar o pulsar botones de
cambio de estado, nunca**. La excepción del buscador de Roster fue puntual y no se extiende: aquélla
era una caja de filtrado en cliente que comprobaste que no emitía red, y esto son formularios de
edición sobre datos reales de la agencia. **Si dudas, pregunta antes, no después.**

## Lo que ya sabes

- **`ApxDd`** (`src/features/booking/components/ApxDd.tsx`) es tuyo y está en `main`. Si los modales
  llevan desplegables, **reutilízalo**; si no encaja, dime por qué antes de escribir otro.
- **`brand-*` tal cual**; el violeta lo pone `apx.css` dentro de `.apx`. Hardcodearlo rompe el oscuro.
- **Los literales del live mandan sobre los correctos.** Ya lo demostraste con «1 artistas del roster»:
  si el modal escribe algo mal declinado o inconsistente, se calca y se blinda con un test.
- **Una pantalla = un fichero propio, sin barrels compartidos.** Vale igual para un modal.

## Reglas

1. **Acuse primero:** `RECIBIDO` + reformulación con tus palabras.
2. **Reporta** con `herdr agent prompt wA:p5 "FAENA 2 <HITO|PREGUNTA|BLOQUEO>: <mensaje>"` al cerrar, y
   deja el pane `idle`.
3. **Nada se fusiona a `main` sin OK explícito** de Arian a través del coordinador. Pushea y avísame:
   la PR la abro yo.
4. **Verificación:** `npm test`, `npx tsc --noEmit`, `npm run lint` pegados en el reporte.
   Baseline: **266 ficheros / 1174 tests**.
