# Spec + Plan — Config: ruta /personal/usuarios (Cuentas · auditoría)

**Coordinador:** Claude (pane `wA:p5`). **Tú:** ejecutor (agente reutilizado). **Rama:** crea `feature/config-usuarios` desde main actualizado.
**Reportas a:** `herdr agent prompt wA:p5 "HITO config: <fase> — <resumen>"`.
**Live SOLO LECTURA** (`bookings.conceptoneagency.com`, `test@blackmoose.es` / `Concept1234`, navegación por CLIC).
TDD, tests+tsc+lint verdes antes de cada hito. **PR única al cierre.** NO merges sin mi OK. Encadena fases sin esperar OK (para solo ante duda de fidelidad, conflicto de frontera, o el gate de PR).

## Arranque
En tu worktree (ya tiene node_modules de la faena anterior): `git fetch origin && git checkout -b feature/config-usuarios origin/main` (rama nueva desde main; si hay algo sin commitear, descártalo — la faena de Mi-trabajo v2 ya está en su PR #19).

## Contexto (delta 🟡 del barrido)
En la barra lateral de **Configuración**, sección `SISTEMA`, hay un enlace **`Cuentas (auditoría)`** que en el live apunta a **`/personal/usuarios`**. En nuestro código ese enlace apunta a `/personal` (o la ruta no resuelve). El barrido **NO capturó** la vista `/personal/usuarios` en sí (una vista de auditoría de cuentas/accesos de usuario). Hay que reconearla y calcarla.

Nuestra sub-nav de Team hoy: `Equipo · Calendario · Fichas` (rutas bajo `/personal`). Nota del live (panel de ayuda): "Los accesos se dan desde la ficha… los permisos se editan en su ficha, no en una lista aparte" → `/personal/usuarios` es una vista de **auditoría/lectura** de cuentas, no un editor de permisos.

## Plan

### Fase 1 — Recon read-only + build
1. Acusa recibo (RECIBIDO + reformula).
2. **Recon read-only** en el live: entra a Configuración, localiza `Cuentas (auditoría)` en `SISTEMA`, haz clic y captura `/personal/usuarios` (screenshot + estructura + copy + columnas/estados). Guarda en `docs/references/config-usuarios/live-2026-07-29-*`. Si la vista no fuera accesible con este usuario, repórtamelo antes de suponer.
3. Implementa:
   - Ruta `/personal/usuarios` en `router.tsx` sirviendo la vista de auditoría de cuentas, calcada de lo que veas (probablemente una pestaña/vista `Usuarios` o `Cuentas` dentro del área Team, o una vista de auditoría enlazada). Respeta la sub-nav real del live.
   - Corrige el enlace `Cuentas (auditoría)` de la barra de Configuración para que apunte a `/personal/usuarios`.
   - Seed espejo con lo que muestre el live (usuarios/cuentas con su estado de acceso; usa la base de personas que ya existe en Team si encaja).
4. Tests de la ruta nueva, del enlace corregido y de la vista.

### Fase 2 — Cierre
1. `git merge main` (resuelve conflictos si los hay; ojo `router.tsx`).
2. `npm test` verde, `tsc`, lint. Capturas `ours-*` para el diff.
3. Abre **PR única** sobre `main` (`gh pr create --base main`), reporta el nº. **NO merges sin OK.**

## Reporte
Cierre de fase → `herdr agent prompt wA:p5 "HITO config: ..."`. Duda de fidelidad o acceso al live → PREGUNTA, no supongas.
