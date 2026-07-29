# Creativos — recalco al live · Plan de implementación

> **Para agentes de trabajo:** SUB-SKILL REQUERIDO: usa `superpowers:subagent-driven-development` o `superpowers:executing-plans` para ejecutar este plan tarea a tarea. Los pasos usan checkbox (`- [ ]`).

**Spec:** `docs/superpowers/specs/2026-07-27-creativos-recalco-design.md` — léela entera antes de la Tarea 1.
**Rama:** `feature/recalco-creativos` (ya creada, base `main` `7659541`).
**Evidencia:** `docs/references/creativos/live-2026-07-27-*`.

## Restricciones globales

- **TDD estricto**: un test que falla antes de cada implementación. Un commit por tarea, mensaje en es-ES.
- **Fidelidad al live por evidencia**, no por inferencia. Si algo no está en las capturas ni en los volcados, no se inventa: se anota como hueco.
- No tocar `src/features/euphoric/` (ver DD2 de la spec). No tocar TopNav, panel de Ayuda ni cromo global.
- Los identificadores internos (`CreativePiece`, `PieceStatus`, `pieces`, `PiecesKanban`, `PiecesTable`, `NuevaPiezaDrawer`) **no se renombran**. El cambio es de copy visible.
- El botón primario sigue usando `variant="primary"` (brand morado del boilerplate). No se pasa a oscuro.
- es-ES. Target ES2020: nada de `Array.prototype.at()`. Lint `--max-warnings 0`, `tsc` limpio.
- Baseline de `main` que hay que mantener en verde: **224 archivos / 722 tests**.

---

## Tarea 1 — Diff dirigido contra las capturas (sin código)

- [x] Abrir `docs/references/creativos/live-2026-07-27-21-tablero.png` y `…-22-calendario.png` y compararlas con `src/features/creativos/` en la mano.
- [x] Responder por escrito, con la imagen delante, a estas tres preguntas (el volcado de texto no las resuelve):
  1. ¿La tarjeta del kanban muestra badge de **prioridad**? (la spec asume que NO — D4)
  2. El badge de deadline sale rojo en las 3 tarjetas, incluida la `Aprobado`. ¿Confirmado? Si sí, la regla del badge (vencido) y la del stat `Atrasadas` (vencido y no aprobado) son distintas — DD1.
  3. ¿El avatar de Carlos es foto o iniciales? ¿Y el de Alba (`AG`)?
- [x] Anotar las respuestas en `docs/references/creativos/ours-vs-live.md` bajo un epígrafe `## Hallazgos del diff dirigido (Tarea 1)`.
- [x] Si alguna respuesta contradice la spec, **parar y decirlo** en el informe final antes de seguir: la spec se corrige, no se ignora.
- [x] Commit: `docs(creativos): hallazgos del diff dirigido contra el live del 27-jul`.

## Tarea 2 — Sub-nav: la pestaña pasa a `Creatividades`

- [x] Crear `src/features/creativos/CreativosShell.test.tsx` (hoy no existe ninguno): renderiza `CreativosShell` dentro de un `MemoryRouter` y asserta que existe un enlace con nombre accesible `Creatividades` apuntando a `/creativos`. Debe fallar.
- [x] `src/features/modules/CreativosShell.tsx:7` — `label: 'Piezas'` → `'Creatividades'`. `href` intacto.
- [x] Verde. Commit: `feat(creativos): la pestaña del módulo pasa a Creatividades`.

## Tarea 3 — Copy del dominio en la página

- [x] Test en `src/features/creativos/pages/CreativosPage.test.tsx`: el subtítulo es `Tablero de creatividades del equipo de diseño: Euphoric, clientes del CRM y empresas internas.`, el botón primario dice `+ Nueva creatividad` y el primer stat se rotula `Creatividades activas`.
- [x] Implementar en `CreativosPage.tsx` (líneas 22-24, 39, 46).
- [x] Verde. Commit: `feat(creativos): copy del dominio (creatividades) en cabecera, botón y stats`.

## Tarea 4 — Tabla de 6 columnas

- [x] Test en `components/PiecesTable.test.tsx`: las cabeceras son exactamente `CREATIVIDAD · CLIENTE · TIPO · DEADLINE · ESTADO · CLIENTE APROB.` (6, en ese orden) y **no** existe `PRIORIDAD`.
- [x] `components/PiecesTable.tsx:9` — renombrar `PIEZA`→`CREATIVIDAD` y quitar `PRIORIDAD` de `HEADERS` y su `<td>` con el `Badge`. `PRIORITY_VARIANT` se queda (lo usa el drawer).
- [x] Verde. Commit: `feat(creativos): la tabla pasa a las 6 columnas del live`.

## Tarea 5 — Tarjeta del kanban según el hallazgo de la Tarea 1

- [x] Solo si la Tarea 1 confirmó que la tarjeta no lleva prioridad: test en `components/PieceCard.test.tsx` que asserta que no se pinta el badge de prioridad y que sí salen responsable, título, `CLIENTE · TIPO · vN`, deadline y `☑ hechos/total`.
- [x] Implementar en `components/PieceCard.tsx`.
- [x] Si el tipo es `Vídeo`, el título va precedido de `🎬` (evidencia: `AG Alba 🎬 Video Pomo 26/07`). Verificar en la imagen si aplica también a `Estático`/`Animado` — la evidencia solo muestra el caso Vídeo; si no hay evidencia para los otros, no se pone.
- [x] Verde. Commit: `feat(creativos): tarjeta del kanban fiel al live`.

## Tarea 6 — Seed al día y regla de `atrasadas`

- [x] Actualizar `data/creativos.test.ts` y `pages/CreativosPage.test.tsx` a los valores nuevos **antes** de tocar el seed: kanban `Briefing 1 · En producción 1 · Revisión 0 · Cambios 0 · Aprobado 1`, stats `2 / 0 / 0 / 2`.
- [x] Sustituir las 3 piezas de `data/seed.ts` por las 3 del live (tabla D7 de la spec), con `clientApproval` sin definir (`—`) en las tres y el orden de tabla `Pack Sold Out`, `Video Pomo 26/07`, `Flyer Claptone 02/08`.
- [x] Sembrar `isOverdue: true` solo en las dos NO aprobadas, con un comentario en el código que explique la regla de DD1 (`vencido && status !== 'Aprobado'`) y por qué se siembra en vez de calcularse (no atar los tests a la fecha del sistema).
- [x] Verde. Commit: `feat(creativos): seed de las 3 creatividades del live + regla de atrasadas`.

## Tarea 7 — "Asignar a" abre el alta pre-asignada

- [x] Test en `pages/CreativosPage.test.tsx`: los dos botones tienen `title="Nueva creatividad para Alba Gelabert"` y `title="Nueva creatividad para Carlos Pego"`; al pulsar `+ Alba` se abre el drawer y aparece `Alba` como responsable.
- [x] `NuevaPiezaDrawer` recibe una prop opcional `assignee?: string` (default = comportamiento actual, sin responsable preseleccionado). Extensión aditiva y retrocompatible.
- [x] Cablear los dos botones en `CreativosPage.tsx:28-38`. Clases intactas (ya coinciden con el live).
- [x] Verde. Commit: `feat(creativos): + Alba / + Carlos abren el alta con responsable pre-asignado`.

## Tarea 8 — Toggle `Tablero | Calendario`

- [x] Test en `pages/CreativosPage.test.tsx`: existe un grupo con `Tablero` (activo por defecto) y `Calendario`; al pulsar `Calendario` **desaparece la tabla** y aparece la rejilla; al volver a `Tablero` reaparecen kanban y tabla.
- [x] Implementar el control segmentado a la izquierda de la fila de filtros, con las clases del live (activo `bg-white text-slate-800 shadow-sm`, inactivo `text-slate-500 hover:text-slate-700`).
- [x] Cabecera, stats, filtros y `Recursos:` permanecen visibles en ambas vistas.
- [x] Verde. Commit: `feat(creativos): toggle Tablero | Calendario`.

## Tarea 9 — Vista Calendario

- [x] Test: en la vista Calendario aparece `Julio 2026`, la cabecera `LUN MAR MIÉ JUE VIE SÁB DOM`, los controles `←` `→` `Hoy`, y cada creatividad cae en el día de su deadline (`10` → `Pack Sold Out · Pack Sold Out`, `22` → `Flyer Claptone 02/08`, `23` → `Video Pomo 26/07`). Los filtros también afectan al calendario.
- [x] **Reutilizar `src/features/euphoric/components/EuphoricCalendar.tsx`** (importarlo, no copiarlo). Si su API no encaja, extenderla de forma aditiva y retrocompatible; jamás cambiar su comportamiento por defecto — tiene consumidores en Euphoric y sus tests deben seguir verdes sin tocarlos.
- [x] Días de relleno del mes anterior/siguiente visibles (`29 30` al inicio, `1…9` al final), como en la evidencia.
- [x] Verde. Commit: `feat(creativos): vista Calendario reutilizando la rejilla de Euphoric`.

## Tarea 10 — Verificación ours-vs-live y cierre

- [x] `npx vitest run`, `npx tsc --noEmit`, `npm run lint` — los tres limpios. Pegar las cifras reales en el informe, no "todo verde".
- [x] Playwright a **1440px** sobre nuestra app: capturar Tablero y Calendario en `docs/references/creativos/ours-2026-07-27-{tablero,calendario}.png`.
- [x] Completar `docs/references/creativos/ours-vs-live.md`: tabla `Vista | ours | live | RMS | px cambiados` + una sección de **discrepancias explicadas**. Ninguna discrepancia puede quedar sin explicación; las de entorno (logo, usuario, panel de Ayuda) se nombran como tales.
- [x] Verificar 0 errores de consola.
- [x] Commit final + **abrir UNA sola PR** con base `main` titulada `Creativos — recalco al live (2026-07-27)`, describiendo los 7 deltas, la decisión DD2 (tablero compartido fuera de alcance) y los deltas conscientes.

---

## Cierre (2026-07-29)

Las 10 tareas quedan marcadas tras verificarlas una a una contra los commits de la rama.
Añadido fuera del plan original: **Tarea 11 — `+ Maf`**, el tercer atajo de "Asignar a:" que el
live incorporó entre el 27 y el 29 de julio (detectado en el barrido read-only del 29-jul).

- [x] Test rojo → `+ Maf` con `title="Nueva creatividad para Maf"` y drawer pre-asignado. Verde.
- [x] Commit: `feat(creativos): tercer atajo de alta "+ Maf" (barrido del 29-jul)`.

Verificación final: **226 archivos / 742 tests** verdes (baseline de `main`: 224 / 722),
`tsc --noEmit` limpio, `eslint --max-warnings 0` limpio, **0 errores de consola** en Tablero y
Calendario.
