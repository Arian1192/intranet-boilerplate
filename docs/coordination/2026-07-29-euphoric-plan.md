# Plan por fases — Euphoric (redactado por el coordinador tras tu Fase 0)

Basado en tu recon `docs/references/euphoric/live-2026-07-29-recon.md`. Rama `feature/euphoric-recalco`, **una PR única al cierre** (patrón ConceptOne). TDD, tests verdes + `tsc` + lint limpios antes de CADA hito. Re-captura/consulta la evidencia del live por fase para fidelidad. Reporta cada cierre de fase al coordinador: `herdr agent prompt wA:p5 "HITO euphoric: <fase> cerrada — <resumen>"` y deja el pane idle para sondeo.

## Regla de frontera con otras ramas (IMPORTANTE)
- **NO toques `/creativos` ni `src/features/creativos`**: esa superficie la lleva la rama `feature/recalco-creativos` (otro ejecutor). En Fase 3 harás fiel `/euphoric/piezas` REUSANDO componentes existentes, pero **sin modificar `/creativos`**. La extracción DRY del "tablero compartido" queda como follow-up POST-merge de creativos (anótalo, no lo hagas ahora).
- En la Fase 6 harás `git merge main` (o rebase) para absorber lo que se haya integrado y resolver conflictos de `router.tsx`/shell antes de la PR.

## Fase 1 — Shell, sub-nav, rutas y Resumen
1. `EuphoricShell.tsx`: sub-nav EXACTA `Cuentas · Campañas · Publicaciones · Creatividades · Eventos · Agenda · Negocio` + 2 icon-actions a la derecha `Artistas` (persona) y `Ajustes` (engranaje). **Quita** el tab `Resumen` y el tab `Contenido` y el icon-action `Analítica`.
2. Etiquetas (sin renombrar paths): `/euphoric/calendario`→"Publicaciones", `/euphoric/piezas`→"Creatividades". La raíz `/euphoric` es el Resumen y NINGÚN tab queda marcado como activo en ella.
3. `router.tsx`: añade rutas `agenda`, `negocio` (con index=Dirección + `pipeline`, `presupuestos`, `analitica`, `tiempos`), `ajustes`. Quita ruta/tab `analitica` de nivel Euphoric (la analítica vive en `negocio/analitica`).
4. `ResumenPage` (`/euphoric`) fiel al recon §3.1: H1 `Euphoric Media`, bajada exacta, 3 stat cards (`CUENTAS ACTIVAS 2 de 3` con link, `CAMPAÑAS EN CURSO 0`, `PUBLICACIONES (7 DÍAS) 1`), bloques `CAMPAÑAS EN CURSO` (vacío) y `PRÓXIMAS PUBLICACIONES` (1 fila del recon).
5. Tests: sub-nav render/orden, rutas resuelven, ausencia de Resumen/Analítica.

## Fase 2 — Cuentas + ficha de cuenta (7 pestañas)
1. `CuentasPage` master-detail (§3.2): botón `+ Nueva cuenta`, lista `Mogli Marbella` (Cliente·Pausada), `Opium Bcn` (Cliente·Paid media·Activa), `SIGHT` (Cliente·Redes/Paid/Contenido·Activa), estado vacío exacto.
2. Ficha con **7 pestañas**: `General · Servicios · Rentabilidad · Solicitudes · Branding · BDD · Automatizaciones` (cabecera con chip salud `Sana` + `Eliminar`). Contenido de cada pestaña según §3.2 (campos de General, Rentabilidad con imputación de horas, Branding kit, BDD CSV, Automatizaciones con plantillas de publicación/creatividad). Formularios inertes/mock salvo estado local.
3. Seed espejo de las 3 cuentas con los números del live (retainers 2000/800/—, servicios, etc.).
4. Tests: 7 pestañas presentes y navegables, seed correcto.

## Fase 3 — Recalco de pestañas existentes a fidelidad live
1. **Campañas** (§3.3): 3 vistas `Tablero · Cronograma · Gestión`. Tablero = kanban por estado `Planificada·En curso·Pausada·Finalizada·Cancelada` (0/0/0/1/0) + tabla `CAMPAÑA·CUENTA·TIPO·FECHAS·ESTADO`. Cronograma = Gantt 3 semanas con selector `1/2/3/4 sem`. Gestión = master-detail con filtro de estado.
2. **Publicaciones** (`/euphoric/calendario`, §3.4): filtros cuenta `Todas·Opium Bcn·SIGHT`, toggles `Eventos`/`Canal`, calendario mensual con publicaciones (título/cuenta/formato/estado) y eventos 📍 de fondo.
3. **Creatividades** (`/euphoric/piezas`, §3.5): barra `Asignar a: +Alba/+Carlos/+Maf` + `+ Nueva creatividad`, 4 stats (7/0/1/4), vistas `Tablero·Calendario`, filtros, kanban `Briefing 5·En producción 1·Revisión 0·Cambios 1·Aprobado 3` + tabla de 6 columnas. **Reusa componentes existentes; NO toques `/creativos`.** Solo H1="Creatividades" + bajada del recon.
4. **Eventos** (§3.6): `+ Nuevo evento`, filtros `Todas·SIGHT`, calendario con tarjetas (título, cuenta·ciudad, chip Marketing/Producción).
5. Tests por vista.

## Fase 4 — Agenda + Ajustes (vistas nuevas)
1. **Agenda** (§3.7): H1 `Agenda · Euphoric`, `+ Entrada`, capas conmutables `Agenda·Publicaciones·Creatividades·Eventos`, filtros cuenta, calendario mensual, leyenda al pie exacta, entrada seed `29 · 11:00 Board Meeting`.
2. **Ajustes** (§3.10): H1 `Ajustes · Euphoric Media`, bloque `COLORES DEL DEADLINE…` (umbrales amarillo/rojo en días), bloque `RENTABILIDAD` (coste interno €/h), `Guardar ajustes` (inerte).
3. Tests.

## Fase 5 — Negocio (submódulo, 5 sub-vistas)
Sub-nav secundaria `Dirección · Pipeline · Presupuestos · Analítica · Tiempos` (§3.8):
1. **Dirección** (`/euphoric/negocio`): 9 KPIs con los valores exactos del recon (MRR 2800,00 €, etc.) + `Carga del equipo`, `Coste por departamento`, `SALUD DE LA CARTERA` (2/0/0), `ALERTAS` (1, Opium Bcn).
2. **Pipeline** (`/negocio/pipeline`): KPIs (1 / 1150,00 € / 115,00 €), 3 columnas `Frío·Templado·Caliente`, tarjeta Mogli Marbella con acciones `Editar`/`→ Convertir a Activo`.
3. **Presupuestos** (`/negocio/presupuestos`): **3 sub-vistas** `Presupuestos` (vacío + botón) · `Catálogo` (tabla 6 cols con fila "Pack 10 Diseños") · `Plantillas` (vacío + botón).
4. **Analítica** (`/negocio/analitica`): KPIs (MRR 2800 / 2 de 3 / 600 / 0), barras retainer por cuenta, tabla POR CUENTA, CONTENIDO POR ESTADO y POR CANAL.
5. **Tiempos** (`/negocio/tiempos`): filtros `Todo·Creatividad·Publicación·Petición`, `TIEMPO MEDIO POR FASE` y `PARADO AHORA`.
6. Seed espejo de Negocio con los números del live. Tests por sub-vista.

## Fase 6 — Artistas + cierre
1. **Artistas** (§3.9): lista ~97 (incluye `Test Artist`), chips `Agencia`/`Externo`, ficha con acciones `Refrescar·Cambiar·Desvincular·Eliminar·Guardar`, estado vacío exacto. (Base compartida con ConceptOne: reusa si procede, sin romper ConceptOne.)
2. `git merge main` para absorber lo integrado; resuelve conflictos de `router.tsx`/shell. Anota como follow-up la extracción DRY del tablero compartido `piezas`↔`creativos` (POST-merge de recalco-creativos).
3. Barrido final: `npm test` (todo verde), `tsc`, lint. Comparativa ours-vs-live (capturas `ours-*`) de las superficies nuevas.
4. Abre **PR única** sobre `main` y reporta el nº al coordinador. **NO merges sin OK del coordinador.**

## Reporte
Tras CADA fase: `herdr agent prompt wA:p5 "HITO euphoric: Fase N cerrada — <resumen + nº tests>"`. Si dudas de fidelidad o hay conflicto de frontera, PREGUNTA al coordinador; no supongas.
