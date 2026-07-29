# Spec + Plan — Mi-trabajo v2 (conmutador de 4 pestañas)

**Coordinador:** Claude (pane `wA:p5`). **Tú:** ejecutor en worktree `feature/mi-trabajo-v2` (`~/dev/worktrees/Boilerplate/mi-trabajo-v2`, ruta nueva, NO orca).
**Reportas a:** `herdr agent prompt wA:p5 "HITO mitrabajo: <fase> — <resumen + nº tests>"`.
**Live SOLO LECTURA** (`bookings.conceptoneagency.com`, `test@blackmoose.es` / `Concept1234`, navegación por CLIC).
**Evidencia ya capturada:** `~/dev/worktrees/Boilerplate/evidence/barrido-2026-07-29/` → `20-mi-trabajo.*`, `21-mi-trabajo--pendientes.*`, `21-mi-trabajo--documentos.*`, `21-mi-trabajo--mis-creatividades.*`.
**Antes de nada:** `npm ci`. TDD, tests+tsc+lint verdes antes de CADA hito. **PR única al cierre.** NO esperes mi OK entre fases (encadena; para solo ante duda de fidelidad, conflicto de frontera o el gate de PR). NO merges sin mi OK.

## Contexto
El live rediseñó `/mi-trabajo`: **ya NO aterriza en el editor**. Ahora es un **conmutador de 4 pestañas** con landing en `Pendientes` (inbox-zero). Nuestro contenido actual (editor Notion + árbol de documentos + panel Tareas de la Fase 7) **se conserva intacto**, pero pasa a vivir DENTRO de la pestaña `Documentos`.

**Frontera:** este módulo es tuyo (`src/features/mi-trabajo` + tus rutas en `router.tsx`). NO toques otros módulos.

## Estructura objetivo del live (confirmada por el barrido)
Saludo de cabecera `Buenos días, test`. Conmutador de 4 pestañas + botón `+ Nueva tarea`:
`Pendientes · Documentos · Mis creatividades · Novedades` (Novedades con **punto verde** indicador).

- **Pendientes** (landing por defecto): estado inbox-zero literal — `✓ No te toca nada ahora mismo` / "Ni alertas, ni creatividades, ni aprobaciones. Está todo al día." Botón `+ Nueva tarea` (alta de tarea; inerte/mock salvo estado local).
- **Documentos**: EXACTAMENTE lo que ya tenemos de la Fase 7 (editor + árbol de documentos a la izquierda, panel `Tareas` a la derecha, secciones `PRIVADOS / COMPARTIDOS / TODO EL EQUIPO`, onboarding "📘 Bienvenido a Documentos / 📄 Una página en blanco"). Reusar el componente existente sin tocar su comportamiento; solo montarlo bajo la pestaña.
- **Mis creatividades**: "Tus creatividades por fecha de entrega. El color marca lo cerca que está el deadline." Estado vacío: "No tienes creatividades asignadas ahora mismo."
- **Novedades**: **el barrido NO capturó su contenido** (solo el punto verde). En la Fase 1, haz una **captura read-only** del clic en `Novedades` en el live y calca lo que veas. Si no fuera accesible, deja un placeholder fiel y repórtamelo.

## Plan por fases

### Fase 1 — Conmutador de 4 pestañas + Pendientes + Mis creatividades + Novedades
1. Reestructura `/mi-trabajo` a shell con cabecera (`Buenos días, <user>`), 4 pestañas y `+ Nueva tarea`. Routing: la raíz `/mi-trabajo` aterriza en **Pendientes** (no en el editor).
2. `Pendientes`: inbox-zero literal + alta `+ Nueva tarea` (estado local).
3. `Mis creatividades`: cabecera + estado vacío exacto.
4. `Novedades`: **re-captura read-only del live** y calca; punto verde en la pestaña.
5. Tests de nav/tabs/landing.

### Fase 2 — Documentos como pestaña (reusa Fase 7 intacta)
Monta el módulo de Documentos existente (editor + árbol + panel Tareas) bajo la pestaña `Documentos` SIN cambiar su comportamiento. Verifica que sigue funcionando igual (sus tests siguen verdes). Tests del montaje.

### Fase 3 — Cierre
1. `git merge main` (resuelve conflictos conservando todo; ojo a `router.tsx`).
2. `npm test` verde, `tsc`, lint. Capturas `ours-*` de las 4 pestañas para el diff.
3. Abre **PR única** sobre `main`, reporta el nº al coordinador. **NO merges sin OK.**

## Reporte
Cierre de cada fase → `herdr agent prompt wA:p5 "HITO mitrabajo: Fase N — <resumen>"`. Duda de fidelidad (sobre todo Novedades) o conflicto → PREGUNTA.
