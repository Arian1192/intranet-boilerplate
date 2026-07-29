# Comparativa ours ↔ live — Euphoric (2026-07-29)

Todas las capturas son full-page a 1440×1200. Las `live-*` salen del recon read-only del live
(`live-2026-07-29-recon.md`); las `ours-*` salen de este worktree servido con `npm run dev`.

> En las capturas del live sale abierto el panel de Ayuda global (abajo-izquierda). Es global de la
> intranet, no del módulo, y en las nuestras aparece igual.

| Vista | live | ours |
|---|---|---|
| Resumen (`/euphoric`) | `live-2026-07-29-resumen.png` | `ours-2026-07-29-resumen.png` |
| Cuentas | `live-2026-07-29-cuentas.png` | `ours-2026-07-29-cuentas.png` |
| Ficha · General | `live-2026-07-29-cuenta-sight-general.png` | `ours-2026-07-29-cuenta-sight-general.png` |
| Ficha · Servicios | `live-2026-07-29-cuenta-sight-servicios.png` | `ours-2026-07-29-cuenta-sight-servicios.png` |
| Ficha · Rentabilidad | `live-2026-07-29-cuenta-sight-rentabilidad.png` | `ours-2026-07-29-cuenta-sight-rentabilidad.png` |
| Ficha · Solicitudes | `live-2026-07-29-cuenta-sight-solicitudes.png` | `ours-2026-07-29-cuenta-sight-solicitudes.png` |
| Ficha · Branding | `live-2026-07-29-cuenta-sight-branding.png` | `ours-2026-07-29-cuenta-sight-branding.png` |
| Ficha · BDD | `live-2026-07-29-cuenta-sight-bdd.png` | `ours-2026-07-29-cuenta-sight-bdd.png` |
| Ficha · Automatizaciones | `live-2026-07-29-cuenta-sight-automatizaciones.png` | `ours-2026-07-29-cuenta-sight-automatizaciones.png` |
| Campañas · Tablero | `live-2026-07-29-campanas.png` | `ours-2026-07-29-campanas.png` |
| Campañas · Cronograma | `live-2026-07-29-campanas-cronograma.png` | `ours-2026-07-29-campanas-cronograma.png` |
| Campañas · Gestión | `live-2026-07-29-campanas-gestion.png` | `ours-2026-07-29-campanas-gestion.png` |
| Publicaciones · Calendario | `live-2026-07-29-publicaciones.png` | `ours-2026-07-29-publicaciones.png` |
| Publicaciones · Lista | `live-2026-07-29-publicaciones-lista.png` | `ours-2026-07-29-publicaciones-lista.png` |
| Publicaciones · Kanban | `live-2026-07-29-publicaciones-kanban.png` | `ours-2026-07-29-publicaciones-kanban.png` |
| Creatividades · Tablero | `live-2026-07-29-creatividades.png` | `ours-2026-07-29-creatividades.png` |
| Creatividades · Calendario | `live-2026-07-29-creatividades-calendario.png` | `ours-2026-07-29-creatividades-calendario.png` |
| Eventos | `live-2026-07-29-eventos.png` | `ours-2026-07-29-eventos.png` |
| Agenda | `live-2026-07-29-agenda.png` | `ours-2026-07-29-agenda.png` |
| Negocio · Dirección | `live-2026-07-29-negocio-direccion.png` | `ours-2026-07-29-negocio-direccion.png` |
| Negocio · Pipeline | `live-2026-07-29-negocio-pipeline.png` | `ours-2026-07-29-negocio-pipeline.png` |
| Negocio · Presupuestos | `live-2026-07-29-negocio-presupuestos.png` | `ours-2026-07-29-negocio-presupuestos.png` |
| Negocio · Analítica | `live-2026-07-29-negocio-analitica.png` | `ours-2026-07-29-negocio-analitica.png` |
| Negocio · Tiempos | `live-2026-07-29-negocio-tiempos.png` | `ours-2026-07-29-negocio-tiempos.png` |
| Artistas | `live-2026-07-29-artistas.png` | `ours-2026-07-29-artistas.png` |
| Ficha de artista | `live-2026-07-29-artista-claptone.png` | `ours-2026-07-29-artista-claptone.png` |
| Ajustes | `live-2026-07-29-ajustes.png` | `ours-2026-07-29-ajustes.png` |

## Divergencias conocidas que NO se han tocado

Son globales del boilerplate (afectan a todos los módulos), así que quedan fuera del alcance de este recalco:

1. **TopNav**: el live usa el nombre del módulo como dropdown (`Euphoric Media ⌄`); nosotros mostramos
   `Intranet / Espacios ⌄ / Euphoric Media`. Lo lleva Arian aparte.
2. **Color de los botones primarios**: morado de marca en el boilerplate, gris oscuro en el live.

## Follow-up pendiente (POST-merge de `feature/recalco-creativos`)

`/euphoric/piezas` y `/creativos` renderizan el MISMO tablero en el live (mismos stats, filtros, columnas
y tarjetas; solo cambian el H1 y la bajada). En esta rama se ha recalcado **solo** `/euphoric/piezas`,
respetando la frontera con la rama de Creativos. Cuando esa rama esté integrada, toca extraer el tablero
compartido a un componente único parametrizado por título/bajada.
