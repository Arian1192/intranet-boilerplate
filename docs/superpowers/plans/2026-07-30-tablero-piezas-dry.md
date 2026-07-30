# Tablero de piezas compartido — convergencia creativos ↔ euphoric

**Rama:** `feature/tablero-piezas-dry` · **Worktree:** `~/dev/worktrees/Boilerplate/tablero-dry`
**Estado:** EJECUTADO. La captura fresca de recon (30-jul) confirmó la premisa y resolvió R1/R2/R3.

## Premisa

En el live, `/creativos` y `/euphoric/piezas` son **la misma pantalla** — solo cambian el H1 y la
bajada. Ya estaba documentado en `docs/references/euphoric/comparativa-2026-07-29.md:49-52`.
Nuestras dos implementaciones **derivaron** al calcarse en ramas distintas desde capturas de fechas
distintas, así que la duplicación es además un bug de fidelidad.

**Regla vigente** (deroga el «ni un píxel» original, decisión de Arian 2026-07-30):

- `/creativos` **no cambia ni un píxel** — es la versión fiel y la referencia de la convergencia.
- `/euphoric/piezas` **sí cambia de aspecto**, para converger.
- Donde la captura fresca de recon contradiga a creativos, **manda la captura**.

**Confirmado (recon, 30-jul):** diff byte a byte del `main` de las dos rutas — sustituyendo solo el
H1 y solo la bajada por un marcador, los dos documentos quedan idénticos (20 198 bytes, cero hunks),
más 7 recortes a 4× con el mismo SHA-256.

**Corolario que derogó la regla original:** las dos copias nuestras estaban mal, creativos incluida
(5 deltas en la tarjeta y varios más en columna, tabla e indicadores). La regla pasó a ser **manda
el live**, con creativos como referencia por defecto salvo donde la captura diga otra cosa — que fue
el caso de la aprobación de cliente, donde tenía razón euphoric.

## Fase 0 — Red de caracterización de `/creativos` ✅ HECHA

`src/features/creativos/components/TableroCaracterizacion.test.tsx` — 14 tests que fijan lo que
los tests previos no cubrían y que es justo lo que una extracción rompe en silencio: clases de la
rejilla, orden de las 5 columnas, cabecera y tipografía del contador, hueco `—`, píldora del
responsable con su inicial, tipografías de título/meta/checklist, y marco, cabeceras y celdas de
la tabla.

**Verificada por mutación**, no solo por estar en verde: se metió la rejilla de euphoric
(`grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5`) y el `p-4` de su tarjeta en el código de
creativos, y la suite las cazó (la rejilla el test nuevo, el padding el `PieceCard.test.tsx` que ya
existía). Restaurado después: 11 ficheros / 55 tests en verde.

## Fase 1 — Mapeo de modelos

`CreativePiece` (creativos) es el **modelo destino**. `Piece` (euphoric) se migra a él.

| `Piece` (euphoric) | → `CreativePiece` (destino) | Cómo |
|---|---|---|
| `id` | `id` | directo |
| `title` | `title` | directo |
| `client` | `client` | directo |
| `version` | `version` | directo |
| `type: string` | `type: PieceType` | directo; **verificado**: el seed solo usa `'Estático'` y `'Vídeo'`, ambos en la unión |
| `owner` | `assignee` | renombre. **Verificado**: incluye `'Sin asignar'` — ver riesgo R1 |
| `deadlineLabel` | `deadline` | directo; **mismo formato** (`'17 jul 2026'`) |
| `isoDeadline` | *(se elimina)* | **derivable**: `deadlineToIso(deadline)`. Verificado en las 10 piezas del seed, round-trip exacto, incluida la de deadline vacío (`''` → `null`) |
| `status: 'en-produccion'` | `status: 'En producción'` | slug → texto de display vía `pieceStatusLabel`. El destino **no usa slugs**: guarda el texto que se pinta |
| `checklistDone` / `checklistTotal` | `checklist?: {done,total}` | dos campos planos → objeto opcional. `checklistTotal === 0` ⇒ `undefined` (así lo interpreta hoy euphoric al decidir si pinta el `☑`) |
| `clientApproval: string` (`'—'` centinela) | `clientApproval?: string` | `'—'` ⇒ `undefined`. El destino usa ausencia en vez de centinela y pinta el `—` en la tabla con `?? '—'` |
| `priority: 'media'` | `priority: 'Media'` | slug → display vía `PRIORITY_LABEL`. **Ojo**: hoy no se pinta en ningún sitio (el live no lo muestra); se conserva por paridad de datos |
| *(derivado en runtime)* | `isOverdue?: boolean` | euphoric lo calcula al vuelo: `isoDeadline !== '' && isoDeadline < todayIso && status !== 'aprobado'`. Creativos lo guarda como dato. **Se precalcula en la migración con esa misma fórmula** |
| — | `icon?: string` | euphoric no lo tiene. Hoy pinta un `🎬` fijo cuando `type === 'Vídeo'`; creativos lo trata como dato libre por pieza. Ver riesgo R2 |

### Dirección: migrar el seed, no adaptar en el borde

Se migra `src/features/euphoric/data/seed.ts` al modelo destino en vez de escribir un adaptador
en tiempo de render. Motivos:

1. `deadlineToIso` **ya existe en creativos y su docstring dice literalmente** que es «la clave con
   la que la rejilla de Euphoric identifica cada día» — el helper se escribió pensando en esto.
2. Un adaptador dejaría los dos modelos vivos y la deriva volvería a abrirse.
3. El calendario de euphoric es el único consumidor de `isoDeadline` y se resuelve con el helper.

## Fase 2 — Extracción

Precedente **Mixmag/TAGMAG**, que es el mismo caso (una pantalla, dos instancias):
`src/features/redaccion/` tiene la implementación parametrizada y `MixmagShell`/`TagmagShell` son
shells de 5 líneas que le pasan un objeto de config.

```
src/features/piezas/                 (feature nueva, parametrizada)
  TableroPiezasShell.tsx             ← recibe { titulo, bajada, piezas, asignables }
  components/  PiecesKanban · PieceCard · PiecesTable · FilterChips · DeadlineBadge
  data/        tipos + helpers (filterPieces, groupByStatus, deriveStats, deadlineToIso)
```

Los dos consumidores quedan finos: `/creativos` y `/euphoric/piezas` pasan su título, su bajada y
sus datos. **El código que se mueve es el de creativos, tal cual** — es lo que garantiza que no
cambie un píxel.

## Riesgos — RESUELTOS por la captura del 30-jul

- **R1 · `'Sin asignar'` — resuelto.** El live no pinta píldora: es un span pelado
  `shrink-0 text-[11px] text-slate-300`. Le faltaba también a creativos.
- **R2 · el icono — resuelto a favor de creativos.** Contraejemplo limpio del 30-jul: `Video Pomo
  26/07` lo lleva y `Flyer Claptone 02/08` no, con la misma bajada `SIGHT · Vídeo · v1`. Derivarlo
  del tipo es demostrablemente falso; se le quita la derivación a euphoric. **Límite declarado:**
  cuál es el campo que lo dispara no se puede saber desde esta pantalla, así que se modela como
  dato opcional por pieza y no se inventa la regla.
- **R3 · aprobación de cliente — resuelto: el live SÍ la pinta.** Era un hueco de **creativos** y
  euphoric tenía razón. Va en la fila de badges, después del deadline, y es un flag **ortogonal al
  estado** (sale en una Briefing y en una Cambios, en ninguna Aprobado). El test de caracterización
  que fijaba lo contrario cayó, como estaba previsto.

- **ABIERTO · el drawer de alta.** La prueba byte a byte cubre el `main` renderizado, **no el panel
  de alta**, que en la captura está cerrado. Al converger, `/euphoric/piezas` pasa a usar
  `NuevaPiezaDrawer` (el de creativos, referencia por defecto) y se borra el `PieceDrawer` de
  euphoric. Es lo correcto según la regla vigente, pero **no está verificado contra el live**.

## Fase 3 — Cierre

`npm test`, `npx tsc --noEmit` y lint en verde, con salida pegada. **El número de tests no puede
bajar.** PR sobre `main` con `gh pr create --base main`, título
`refactor(piezas): tablero compartido creativos ↔ euphoric`, y en el cuerpo qué quedó idéntico, qué
es parámetro y qué cambió de aspecto en euphoric y por qué. **No fusionar.**

> Recordatorio de tooling: `gh pr edit` está roto en este repo (Projects classic). El cuerpo se
> escribe con `gh api -X PATCH repos/Arian1192/intranet-boilerplate/pulls/<n> -F body=@fichero`.
