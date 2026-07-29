# Recon read-only del live — Euphoric (2026-07-29)

Fase 0 del brief `docs/coordination/2026-07-29-euphoric-brief.md`. Navegación **por clic** dentro de la SPA
(el acceso por URL directa rebota a Home), viewport 1440×1200, capturas full-page.
**No se creó, editó ni borró nada en el live.** Solo clics de navegación/pestañas.

Evidencia: `live-2026-07-29-<slug>.png` (screenshot) + `live-2026-07-29-<slug>.json`
(url, headings, botones/pestañas, links y volcado de texto de `<main>`).

> Nota de captura: el panel de Ayuda global aparece abierto abajo-izquierda en todas las capturas
> (es global de la intranet, no parte del módulo).

## 1. Sub-nav de Euphoric — CONFIRMADA tal cual el brief

`Cuentas · Campañas · Publicaciones · Creatividades · Eventos · Agenda · Negocio`
\+ dos acciones **solo-icono** a la derecha: `Artistas` (icono persona) y `Ajustes` (icono engranaje).

| Etiqueta live | Ruta (NO renombrar) |
|---|---|
| Cuentas | `/euphoric/cuentas` |
| Campañas | `/euphoric/campanas` |
| Publicaciones | `/euphoric/calendario` |
| Creatividades | `/euphoric/piezas` |
| Eventos | `/euphoric/eventos` |
| Agenda | `/euphoric/agenda` |
| Negocio | `/euphoric/negocio` |
| Artistas (icono) | `/euphoric/artistas` |
| Ajustes (icono) | `/euphoric/ajustes` |

- **No hay pestaña "Resumen"**: confirmado. La raíz `/euphoric` es el resumen y ninguna pestaña queda marcada.
- **No hay pestaña "Analítica"** en la sub-nav: se movió a `/euphoric/negocio/analitica`.
- Marca del módulo en la TopNav: `Euphoric Media` (dropdown de Espacios).

### Estado actual nuestro (para el diff)
`src/features/euphoric/EuphoricShell.tsx`: tabs `Resumen · Campañas · Contenido · Piezas · Eventos · Cuentas`
\+ icon-actions `Artistas` y `Analítica`. Rutas en `src/app/router.tsx:89-97`
(`index`, `campanas`, `calendario`, `piezas`, `eventos`, `cuentas`, `artistas`, `analitica`).
Faltan: `agenda`, `negocio` (+4 sub-rutas), `ajustes`; sobra el tab `Resumen` y el icon-action `Analítica`.

## 2. Divergencias respecto al brief

1. **La ficha de cuenta tiene 7 pestañas, no 6.** Falta "Servicios" en el brief:
   `General · Servicios · Rentabilidad · Solicitudes · Branding · BDD · Automatizaciones`.
2. **Artistas: ~97 artistas**, no ~65 (la lista incluye `Test Artist`). Sigue vivo y con ficha editable a la derecha.
3. **Presupuestos tiene a su vez 3 sub-vistas** dentro de `/euphoric/negocio/presupuestos`:
   `Presupuestos · Catálogo · Plantillas` (el brief solo mencionaba Presupuestos como una de las 5 de Negocio).
4. **Campañas tiene 3 vistas** (`Tablero · Cronograma · Gestión`) y **Creatividades 2** (`Tablero · Calendario`),
   detalle que el brief no recogía.
5. `/euphoric/piezas` y `/creativos` son **el mismo tablero** confirmado al pixel: mismos stats, filtros,
   columnas y tarjetas. Solo cambian H1 y bajada:
   - `/euphoric/piezas` → "Creatividades" · "Content creation: seguimiento de artes por estado de producción."
   - `/creativos` → "Creativos" · "Tablero de creatividades del equipo de diseño: Euphoric, clientes del CRM y empresas internas."

## 3. Estructura confirmada, vista por vista

### 3.1 Resumen (`/euphoric`)
H1 `Euphoric Media` · bajada "Marketing del grupo: cuentas, campañas y calendario de contenido."
3 stat cards: `CUENTAS ACTIVAS 2 de 3` (link a cuentas) · `CAMPAÑAS EN CURSO 0` · `PUBLICACIONES (7 DÍAS) 1`.
Dos bloques: `CAMPAÑAS EN CURSO` (vacío: "No hay campañas en curso.") y `PRÓXIMAS PUBLICACIONES`
(1 fila: "Set Times SIGHT: Claptone…" · `01 ago 2026 · Instagram · SIGHT` · chip `Idea`).

### 3.2 Cuentas (`/euphoric/cuentas`)
Master-detail. Bajada: "Clientes y marcas que gestiona Euphoric. Los clientes externos se enlazan al CRM del grupo."
Botón `+ Nueva cuenta`. Lista: `Mogli Marbella` (Cliente · Pausada), `Opium Bcn` (Cliente · Paid media · Activa),
`SIGHT` (Cliente · Redes sociales, Paid media, Contenido · Activa). Vacío: "Selecciona una cuenta o crea una nueva."

**Ficha (7 pestañas)** — cabecera `SIGHT` + chip de salud `Sana` + botón `Eliminar`:
- **General**: Nombre*, check "Cuenta interna del grupo (no es cliente externo)", Cliente en el CRM,
  Estado comercial (Lead/Activo/Finalizado), Tier (— / Tier 1 · Gran cuenta / Tier 2 · Estándar),
  Sector (— / Hotel / Restaurante / Ocio nocturno / Festival / Retail / Inmobiliaria / Otro),
  Estado (Activa/Pausada/Baja), Retainer mensual (€), Fecha de inicio, Horas mensuales contratadas,
  Contrato firmado, Estado de pago (Al corriente/Pendiente/Retraso) + nota "Manual por ahora; se automatizará al integrar Holded.",
  Servicios (Redes sociales/Paid media/Contenido), Responsable, Resp. de aprobar, Contactos, Notas,
  `ENLACE DE APROBACIÓN DEL CLIENTE` (+Copiar), `PORTAL DE CLIENTE` (+Invitar), `Guardar`.
- **Servicios**: "Servicios contratados — Packs, recurrentes y proyectos de esta cuenta. Los packs muestran el consumo del periodo."
  `+ Contratar servicio`; vacío "Sin servicios contratados."
- **Rentabilidad**: `RENTABILIDAD` (Facturación aprox. 0 € · Coste (horas) 0 € · Beneficio 0 € · Margen 0%,
  pie "Total imputado: 0m · coste/hora 25 €"), `IMPUTAR HORAS` (Fecha/Horas/Descripción/Persona + Imputar),
  `IMPUTACIONES RECIENTES` ("Sin horas imputadas todavía.").
- **Solicitudes**: `PETICIONES E INCIDENCIAS` + `+ Nueva`; vacío "Sin solicitudes."
- **Branding**: `BRANDING · KIT DE MARCA` — Tono de voz, Valores / do's & don'ts, Logos, Paleta de colores,
  Tipografías (Titulares/Cuerpo), Recursos, Enlace a la guía de marca, Contactos, Notas, `Guardar branding`.
- **BDD**: `BASES DE DATOS (CSV/EXCEL)` — selector de evento + `Subir y limpiar`; filas con
  "Fourvenues Tickets — · <evento> · 258 contactos limpios (de 408) · Listo" y acciones
  `Descargar limpio · Original · Volver a limpiar · Eliminar`.
- **Automatizaciones**: "Al crear un evento de esta cuenta se generan solas las publicaciones y creatividades de abajo…"
  (offset en días D-n, variables `{evento}`, `{ciudad}`, `{fecha}`). `Plantillas de publicación`
  (Título/Offset/Hora/Canal[Instagram…Otro]/Formato[Reel/Post/Story/Carrusel/Vídeo/Otro]) y `Plantillas de creatividad`.

### 3.3 Campañas (`/euphoric/campanas`)
Bajada "Campañas y proyectos de marketing: RRSS, paid media, contenido y lanzamientos." · `+ Nueva campaña`.
Vistas `Tablero · Cronograma · Gestión`:
- **Tablero**: kanban por estado `Planificada · En curso · Pausada · Finalizada · Cancelada` (0/0/0/1/0)
  \+ tabla `CAMPAÑA · CUENTA · TIPO · FECHAS · ESTADO`.
- **Cronograma**: "Campañas activas · próximas 3 semanas", selector `1/2/3/4 sem`, barras Gantt por semana
  (29 jul / 05 ago / 12 ago), pie "Las barras van de la fecha de inicio a la de fin de cada campaña. Clic para abrir."
- **Gestión**: master-detail con filtro de estado (`Todos los estados` + los 5) y `+ Nueva campaña`.

### 3.4 Publicaciones (`/euphoric/calendario`)
"Community management: planifica y controla el estado de las publicaciones."
Filtros de cuenta `Todas · Opium Bcn · SIGHT`, toggles `Eventos` y `Canal`, navegación `← → Hoy` con mes `Julio 2026`.
Rejilla mensual LUN…DOM; cada publicación muestra título, cuenta, formato (Reel/Post) y estado (Idea/En producción/Publicado);
los eventos aparecen con 📍 como capa de fondo.

### 3.5 Creatividades (`/euphoric/piezas`)
"Content creation: seguimiento de artes por estado de producción."
Barra `Asignar a: + Alba / + Carlos / + Maf` y `+ Nueva creatividad`.
4 stats: `7 Creatividades activas · 0 Pend. aprobar · 1 En correcciones · 4 Atrasadas`.
Vistas `Tablero · Calendario`; filtros `Todas · Mías · Diseño · Vídeo · Pend. aprobar · Correcciones · Atrasadas`;
`Recursos: — Editar`.
Kanban por estado: `Briefing 5 · En producción 1 · Revisión 0 · Cambios 1 · Aprobado 3` + tabla
`CREATIVIDAD · CLIENTE · TIPO · DEADLINE · ESTADO · CLIENTE APROB.`.
Vista Calendario: mes con `← → Hoy` y contador "1 sin deadline".

### 3.6 Eventos (`/euphoric/eventos`)
"Base de eventos del grupo (compartida). Crea aquí los eventos de marketing; solo aparecen en Producción si marcas
que los produce Black Moose." · `+ Nuevo evento` · filtros `Todas · SIGHT` · calendario mensual `← → Hoy`.
Tarjetas: título, `cuenta · ciudad`, chip `Marketing`/`Producción`.

### 3.7 Agenda (`/euphoric/agenda`)
H1 `Agenda · Euphoric` — "Todo en un solo calendario: reuniones, publicaciones, deadlines y eventos."
`+ Entrada`; capas conmutables `Agenda · Publicaciones · Creatividades · Eventos`;
filtros de cuenta `Todas · Opium Bcn · SIGHT`; calendario mensual.
Leyenda al pie: `Agenda: Reunión · Lanzamiento · Grabación · Entrega · Renovación · Otro` y
`Capas: Publicaciones · Creatividades · Eventos`. Entrada propia vista: `29 · 11:00 Board Meeting`.

### 3.8 Negocio (`/euphoric/negocio`) — 5 sub-vistas confirmadas
Sub-nav secundaria: `Dirección · Pipeline · Presupuestos · Analítica · Tiempos`.

- **Dirección** (`/euphoric/negocio`) — H1 `Dirección · Euphoric`, "Estado del negocio de un vistazo: ingresos,
  cartera, salud de clientes y alertas del día." 9 KPIs: `FACTURACIÓN MENSUAL (MRR) 2800,00 €` ·
  `BENEFICIO ESTIMADO 2800,00 € (Coste horas 0,00 €)` · `CLIENTES ACTIVOS 2 de 3 cuentas` ·
  `LEADS EN PIPELINE 1 (Forecast 115,00 €)` · `HORAS DEL MES 0.0 h` · `CAMPAÑAS ACTIVAS 0` ·
  `CAMPAÑAS PENDIENTES 0` · `COBROS PENDIENTES 0 (pendiente / retraso)` · `INCIDENCIAS ABIERTAS 0`.
  Luego `Carga del equipo — dedicación asignada` (Alba G · 2 h/mes · 25,00 €; referencia 160 h/mes),
  `Coste por departamento — estimado mensual` (Marketing · 2 h/mes · 25,00 €),
  `SALUD DE LA CARTERA` (2/0/0 · "Toda la cartera está sana.") y
  `ALERTAS` (1 · Opium Bcn · "Sin publicaciones en los próximos 7 días" · chip `Contenido faltante`).
- **Pipeline** (`/euphoric/negocio/pipeline`) — "Oportunidades comerciales en curso. Arrastra un lead a Activo cuando cierres."
  `+ Nuevo lead`; KPIs `LEADS EN PIPELINE 1 · VALOR TOTAL 1150,00 € · FORECAST PONDERADO 115,00 € (Σ valor × probabilidad)`.
  Columnas `Frío · <30%` (1 · Valor 1150,00 € · Forecast 115,00 €), `Templado · 30–70%` (0, "Sin leads"),
  `Caliente · >70%` (0). Tarjeta: `Mogli Marbella · 10% · 1150,00 € · ≈ 115,00 € · FV Fran · 01 mar 2027`
  \+ acciones `Editar` y `→ Convertir a Activo`.
- **Presupuestos** (`/euphoric/negocio/presupuestos`) — "Propuestas comerciales, catálogo de servicios y biblioteca
  de plantillas." Sub-vistas `Presupuestos` (vacío + `+ Nuevo presupuesto`), `Catálogo`
  (tabla `SERVICIO · UNIDAD · TARIFA EST. · MÍNIMA · COSTE · MARGEN`, fila
  "Pack 10 Diseños · Diseño / 10 creativ./mes · extra 75,00 € / mes / 1000,00 € / 0,00 € / 0,00 € / 1000,00 € · 100%")
  y `Plantillas` (vacío + `+ Nueva plantilla`).
- **Analítica** (`/euphoric/negocio/analitica`) — "Cartera de cuentas, ingresos recurrentes (retainers), inversión
  en campañas y contenido." KPIs `MRR (RETAINERS ACTIVOS) 2800,00 € · CUENTAS ACTIVAS 2 de 3 ·
  PRESUPUESTO CAMPAÑAS 600,00 € · INVERSIÓN CAMPAÑAS 0,00 € (0% del presupuesto)`.
  `RETAINER MENSUAL POR CUENTA` (barras Opium Bcn / SIGHT, eje 0–2000 €),
  `POR CUENTA` (tabla `CUENTA · ESTADO · RETAINER · CAMPAÑAS · INVERSIÓN · PUBLICACIONES`:
  Opium Bcn Activa 2000,00 € 0 — 0 / SIGHT Activa 800,00 € 1 — 9 / Mogli Marbella Pausada — 0 — 0),
  `CONTENIDO POR ESTADO` (Idea 7 · En producción 1 · Revisión 0 · Aprobado 0 · Programado 0 · Publicado 1),
  `CONTENIDO POR CANAL` (Instagram 9).
- **Tiempos** (`/euphoric/negocio/tiempos`) — "Cuánto tarda cada cosa en cada fase, y qué está parado ahora.
  (Tiempo de reloj entre estados, no horas trabajadas.)" Filtros `Todo · Creatividad · Publicación · Petición`.
  `TIEMPO MEDIO POR FASE` (Creatividad: Briefing 2.0 d · 3 veces / Aprobado 9.3 h · 2 veces / Cambios 0 min · 1 vez)
  y `PARADO AHORA (MÁS TIEMPO EN SU FASE)` (lista `título · tipo · estado · cuenta · antigüedad`).

### 3.9 Artistas (`/euphoric/artistas`)
"Base compartida con ConceptOne. Crea aquí los artistas externos para tus line-ups y flyers."
`+ Nuevo artista`, lista alfabética de ~97 artistas con chip `Agencia`/`Externo` y avatar/iniciales.
Vacío: "Elige un artista o crea uno nuevo." Ficha del artista: `Foto y perfil del artista`
con acciones `Refrescar · Cambiar · Desvincular · Eliminar artista · Guardar`.

### 3.10 Ajustes (`/euphoric/ajustes`)
H1 `Ajustes · Euphoric Media` — "Parámetros de funcionamiento del espacio de Euphoric."
- `COLORES DEL DEADLINE DE LAS CREATIVIDADES`: explicación 🟢/🟡/🔴 + campos
  "Amarillo cuando faltan (días) ≤" y "Rojo cuando faltan (días) ≤" (con sus ayudas).
- `RENTABILIDAD`: "Coste interno por hora (€)" + nota sobre costes reales por persona.
- Botón `Guardar ajustes`.

## 4. Inventario de evidencia

| slug | qué es |
|---|---|
| `resumen` | raíz `/euphoric` |
| `cuentas` | listado de cuentas |
| `cuenta-sight-{general,servicios,rentabilidad,solicitudes,branding,bdd,automatizaciones}` | las 7 pestañas de la ficha |
| `campanas`, `campanas-cronograma`, `campanas-gestion` | las 3 vistas de Campañas |
| `publicaciones` | `/euphoric/calendario` |
| `creatividades`, `creatividades-calendario` | `/euphoric/piezas`, vistas Tablero y Calendario |
| `creativos-comparacion` | `/creativos` para el diff del tablero compartido |
| `eventos` | calendario de eventos |
| `agenda` | agenda unificada |
| `negocio-{direccion,pipeline,presupuestos,analitica,tiempos}` | las 5 sub-vistas de Negocio |
| `presupuestos-catalogo`, `presupuestos-plantillas` | sub-vistas de Presupuestos |
| `artistas`, `artista-claptone` | listado y ficha |
| `ajustes` | ajustes del espacio |
