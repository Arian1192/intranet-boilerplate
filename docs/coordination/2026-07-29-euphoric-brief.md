# Faena 1 — Euphoric: módulo entero (recon + recalco)

**Coordinador:** Claude (pane `wA:p5`). **Tú:** ejecutor en worktree `feature/euphoric-recalco`.
**Reportas a:** el pane del coordinador con `herdr agent prompt wA:p5 "HITO euphoric: <resumen 1 línea>"`.
**Regla de oro del live:** SOLO LECTURA. Nada de crear/editar/borrar/guardar en `bookings.conceptoneagency.com`.
Credenciales: `test@blackmoose.es` / `Concept1234`. Gotcha: navegar por URL directa rebota a Home → navegar por clic dentro de la SPA.

## Objetivo
Euphoric ha crecido de un recalco a **módulo entero** (más grande que ConceptOne). Estado actual del boilerplate
(`src/features/euphoric`): tabs `Resumen · Campañas · Contenido · Piezas · Eventos · Cuentas · Analítica · Artistas`.
El live ya NO es eso. Hay que dejarlo fiel al live pixel-perfect, patrón ConceptOne (una PR única al cierre).

## Estructura objetivo del live (según recon 2026-07-27, A CONFIRMAR por ti en Fase 0)
- Sub-nav: `Cuentas · Campañas · Publicaciones · Creatividades · Eventos · Agenda · Negocio` + iconos solo-icono `Artistas` y `Ajustes`.
- **No hay pestaña "Resumen"**: la raíz `/euphoric` ES el resumen (sin tab).
- Rutas viejas se mantienen: `/euphoric/calendario` sirve la pestaña "Publicaciones"; `/euphoric/piezas` sirve "Creatividades". **NO renombrar paths**, solo etiquetas.
- **Negocio** (`/euphoric/negocio`): submódulo con 5 sub-vistas — Dirección / Pipeline / Presupuestos / Analítica / Tiempos (MRR, forecast ponderado, cycle-time). La analítica de Euphoric se MOVIÓ aquí.
- **Agenda** (`/euphoric/agenda`): calendario unificado con capas.
- **Ajustes** (`/euphoric/ajustes`): config local del espacio.
- **Ficha de cuenta**: 6 pestañas — General / Rentabilidad / Solicitudes / Branding / BDD / Automatizaciones.
- `Artistas` sigue vivo (~65 artistas), degradado a link solo-icono.
- `/euphoric/piezas` y `/creativos` renderizan el MISMO tablero → considerar componente compartido.

## Plan

### Fase 0 — Recon read-only (HAZLO Y PÁRATE; reporta al coordinador)
1. Acusa recibo: responde "RECIBIDO" + reformula la tarea en tus palabras antes de tocar nada.
2. Login solo-lectura en el live. Recorre por CLIC: sub-nav de Euphoric, cada sub-vista de Negocio, Agenda, Ajustes, la ficha de una cuenta (6 pestañas), Artistas.
3. Captura evidencia (screenshots + notas de estructura/copy/orden/números) en `docs/references/euphoric/live-2026-07-29-*`.
4. Reporta al coordinador un resumen de la estructura real confirmada y CUALQUIER divergencia respecto a lo de arriba.
5. **NO implementes todavía.** El coordinador escribirá el plan por fases a partir de tu recon.

### Fases 1..N — (las define el coordinador tras tu recon)
Esbozo previsible: (1) shell + sub-nav + rename etiquetas + quitar tab Resumen; (2) ficha de cuenta 6 pestañas;
(3) Negocio 5 sub-vistas; (4) Agenda; (5) Ajustes; + seed espejo y tests por fase. Una PR única al cierre desde `main`.

## Reglas de trabajo
- TDD y tests verdes por fase (`npm test`), `tsc` y lint limpios antes de cada HITO.
- Re-captura evidencia del live por fase para fidelidad (patrón establecido).
- Reporta CADA cierre de fase al coordinador (`herdr agent prompt wA:p5 ...`) Y deja el pane en idle para que se te sondee.
- Si te bloqueas o dudas de fidelidad, PREGUNTA al coordinador; no supongas.
