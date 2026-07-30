# Ronda 2026-07-30 — Estado, reparto y reglas (documento del coordinador)

**Coordinador:** Claude, pane `wA:p5`, repo principal `/home/arian/dev/Boilerplate` (rama `main`).
El coordinador **no toca código**: escribe specs/planes, despacha, revisa y consolida.

## Estado de partida (verificado hoy)

- `main` = `4578550`, **verde**: `npm test` → **249 ficheros / 965 tests**.
- PRs #1–#20 **fusionadas o cerradas**. Única PR abierta: **#21** `feat(team): ruta /personal/usuarios`
  (rama `feature/config-usuarios`, 24 ficheros, `MERGEABLE` / `CLEAN`, **sin verificar ni fusionar**).
- Worktrees vivos (a limpiar, ver Faena B):
  - `~/orca/workspaces/Boilerplate/{creativos,cruda,euphoric}` → ramas **ya fusionadas** (#16, #15, #17).
  - `~/dev/worktrees/Boilerplate/conceptone-v2` → checkout de `feature/brand-carbon` (**fusionada**, #20).
  - `~/dev/worktrees/Boilerplate/mi-trabajo-v2` → checkout de `feature/config-usuarios` (**PR #21, viva**).
- **Último barrido del live: 2026-07-29.** Hoy es **2026-07-30** y no sabemos qué ha cambiado.
- Follow-ups documentados y **sin resolver**:
  - (a) TopNav global — el live parece usar el **nombre del módulo como dropdown** (nosotros "Intranet/Espacios"). Sin confirmar.
  - (b) Tablero de piezas **duplicado**: `src/features/euphoric/components/PieceBoard|PieceDrawer|StatusChip`
    vs `src/features/creativos/components/PiecesKanban|PieceCard|PiecesTable`. Candidato a extracción DRY.

## Reparto de esta ronda

| Faena | Pane | Ejecutor | Alcance |
|---|---|---|---|
| **A — Recon del live 2026-07-30** | `wA:pC` | Claude | Barrido read-only del live vs `main`, follow-up (a), y **specs/planes** de lo que salga |
| **B — Cierre técnico** | `wA:pD` | Claude | PR #21 verificada, limpieza de worktrees, y follow-up (b) DRY |

Briefs: `docs/coordination/2026-07-30-faena-a-recon-live.md` y `docs/coordination/2026-07-30-faena-b-cierre-tecnico.md`.

## Reglas de la ronda (obligatorias para ambos ejecutores)

1. **Acuse primero.** Antes de tocar nada, responde al coordinador con `RECIBIDO` + reformulación de tu tarea con tus palabras.
2. **Canal de vuelta:** todo reporte va al coordinador con
   `herdr agent prompt wA:p5 "<FAENA A|B> <HITO|PREGUNTA|BLOQUEO>: <mensaje>"`.
   Reporta al **cerrar cada fase**, y deja el pane `idle` para que pueda sondearte.
3. **El live es SOLO LECTURA.** `bookings.conceptoneagency.com` — `test@blackmoose.es` / `Concept1234`.
   Navega **por clic** dentro de la SPA: la URL directa rebota a Home.
4. **Nada se fusiona a `main` sin OK explícito.** Los merges los autoriza Arian a través del coordinador.
5. **Worktrees nuevos van en `~/dev/worktrees/Boilerplate/<nombre>`.** `~/orca/` está deprecado: no crees nada ahí.
6. **Verificación antes de cantar victoria.** "Hecho" exige salida real de `npm test`, `npx tsc --noEmit` y lint pegada en el reporte.
   Los planes de `docs/superpowers/plans/` llegan con los checkboxes sin marcar aunque el trabajo esté hecho: verifica
   tarea a tarea contra los commits antes de dar nada por cerrado.
7. **Si dudas de fidelidad al live, PREGUNTA.** No supongas ni inventes datos: el calco se fija a la evidencia capturada.
8. **No toques el trabajo de la otra faena.** A no escribe código de producción; B no re-audita el live.
