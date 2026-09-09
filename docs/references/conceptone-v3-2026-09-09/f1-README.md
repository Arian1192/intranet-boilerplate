# Faena 1 — evidencia fina de las 8 pantallas (prefijo `f1-`)

**Capturado el 2026-09-09 entre las 10:08 y las 10:14 CEST** contra
`https://bookings.conceptoneagency.com` (usuario `test@blackmoose.es`, sesión `test · admin`).
Hora exacta de cada fichero: en la primera línea de cada `.txt` / `.main.html` y en
`f1-00-log-captura.json` · `f1-00-log-estados.json`.

> **El calco se fija a la foto.** Las cifras de aquí son las de esa franja. Se re-captura al
> implementar cada pantalla.

## Método

Playwright/Chromium headless, contexto persistente. **Viewport 1440×1000, `deviceScaleFactor: 2`**
(los PNG miden 2880 px de ancho), `screenshot` **fullPage**. De cada estado se vuelca:

| Sufijo | Contenido |
|---|---|
| `.png` | fullPage a 2× |
| `.txt` | `document.body.innerText` completo (incluye el rail, útil para verificar la carcasa) |
| `.main.html` | `outerHTML` del `<main>` **sin truncar** |

Extra: `f1-00-literales.json` — h1, bajada, KPI, **opciones completas de cada `<select>`**,
placeholders, cabeceras de tabla, número de filas, primera fila y estados vacíos, extraídos del DOM.

El live se trató como **solo lectura**: login y clics de navegación (pestañas, conmutadores, paneles).
Ni un `Guardar`, ni un formulario, ni el toggle de tema.

## Qué añade esto sobre la evidencia de las 09:20-09:40

La evidencia previa (sin prefijo) es correcta y **no está truncada**, pero solo tiene el **estado por
defecto** de cada ruta. Lo que faltaba —y es justo donde el spec §3 se queda corto— son los estados
secundarios. 27 estados capturados, 19 de ellos nuevos:

| Pantalla | Estados capturados |
|---|---|
| `/tours` | lista + **detalle de las 3 giras** (`--detalle-spain` vacía, `--detalle-latam`, `--detalle-artnologia`) |
| `/liquidaciones` | `Por show` + **`--por-artista`** |
| `/conceptone/pendientes` | inbox-zero (único estado) |
| `/management/incidentes` | tabla + **`--tablero`** + **`--timeline`** + **`--mas-filtros`** |
| `/management/incidentes/analitica` | único estado |
| `/artistas` | `Lista` + **`--roster`** |
| `/reporte` | `Resumen` + **`--comisiones-agentes`** + **`--reparto-artistas`** |
| `/conceptone/ajustes` | `Datos fiscales` + **los 9 paneles restantes** |

---

## 1. `/tours` — el spec la infravalora: es **talla L**, no M

`h1` **Tours** · bajada literal: «Agrupa shows de un artista en una gira: viabilidad económica (P&L),
gastos de tour (vuelos, hospedaje, per diems) y agenda de promo.» · CTA `+ Nuevo tour`.

Tres tarjetas, todas en estado `Planificando`, y **son botones que navegan**: llevan a
**`/tours/:tourId`** — una ruta que el inventario de 89 no recogía (verificada por URL directa el
2026-09-09 a las 10:39 CEST). UUID del live: Spain `5c5f62d8-83a3-422c-86de-733e1d8241e5`, LATAM
`c68ade2f-5f01-4686-869c-34e744cf445a`, ART NO LOGIA `db6247ed-d98e-476d-a0fb-3b0ab4675267`.
Esa pantalla **no tiene `h1`**: el nombre de la gira es un `<input>` editable en línea.

| Gira | Artista · territorio · fechas | Shows |
|---|---|---|
| Spain Sept 2026 | Milan Torne · Spain · 30 oct 2026 → 11 nov 2026 | 0 shows |
| LATAM Sept 2026 | Claudia Tejeda · Latinoamérica · 17 sept 2026 | 3 shows |
| ART NO LOGIA Sept 2026 | ART NO LOGIA · Latinoamérica | 3 shows |

**El detalle de tour** (`f1-tours--detalle-latam`) lleva:

- `← Volver a tours` · `Exportar PDF` · cabecera `N shows · <territorio> · <fechas>`
- Estado: un **`<select class="select h-9 w-auto">`** con `Planificando` · `Confirmado` · `Cerrado` ·
  `Cancelado` (lo describí como chips leyendo el `innerText`; el HTML dice que es un desplegable)
- Campos: `Zona / región`, `Desde`, `Hasta`, **`Moneda del P&L`**
- 4 KPI: `NETO DEL ARTISTA CON LA GIRA` (`3520,00 US$` / «cachés netos de 3 shows») ·
  `MARGEN DE LA AGENCIA` (`880,00 US$` / «booking fee 880,00 US$») · `GASTOS DE TOUR` (`0,00 US$` /
  «vuelos, hotel, ground…») · `TRASLADOS` (`2099 km` / «7.8 h en 2 tramos»)
- **`ITINERARIO`** con `+ Promo` y `+ Añadir show`: una fila por show con fecha en dos líneas
  (`18 sept` / `2026`), `Ciudad, País· Venue`, caché en su divisa, `✕`, y **cuatro casillas de
  logística ciclables**: `○ Vuelo` `○ Hotel` `○ Ground` `○ Visado`. Entre shows, el tramo:
  `✈️ 1055 km · 656 mi · ≈ 3.9 h · 1 día de hueco`.
  Pie literal: «Toca las casillas de logística para ciclar ○ pendiente → • reservado → ✓ confirmado.
  Moneda de cada caché en su divisa.»
- **`RUTA`** — `Abrir en Google Maps ↗` + lista numerada de paradas (`1 Pozos, Costa Rica · 18 sept`…)
- **`GASTOS DE TOUR (no cuelgan de un show)`** — total + `+ Gasto de tour`
- **`P&L DETALLADO`** — `Cachés netos (shows)` / `− Gastos de tour (artista)` / `Neto del artista`;
  bloque `AGENCIA`: `Booking fee (shows)` / `− Gastos de tour (agencia)` / `Margen agencia`
- Nota de divisa: «En USD: 1 USD = 0.8583 EUR. Cachés = caché − booking fee (el management fee y los
  gastos de cada show se ven en su liquidación).»

**Vacío literal** (`--detalle-spain`): «Itinerario vacío. Añade los shows del artista para ver fechas,
traslados y logística.» con los KPI a `0,00 €` / `0 km` / «sin ruta calculada».

## 2. `/liquidaciones` — confirmada L, y hay **dos tablas**, no una

`h1` **Liquidaciones** · bajada: «Estado de dinero de cada show: cobros del promotor, gastos, y lo
liquidado al artista.»

- Conmutador `Por show` / `Por artista` (botones, no pestañas).
- 3 KPI, **idénticos a los del spec** a las 10:09 CEST: `PENDIENTE DE COBRAR 172.489,88 €` ·
  `GASTOS POR RECUPERAR 1006,43 €` · `PENDIENTE DE LIQUIDAR 124.050,25 €`.
- Buscador: placeholder «`Buscar artista, show, código…`».
- El filtro de estados es un **`<select>` de 6 opciones** (el «Todos» + los 5 estados):
  `Todos los estados` · `Sin liquidar` · `Parcialmente liquidado` · `Pendiente liquidar` ·
  `Liquidado` · `Incidencia`.

**Tabla `Por show`** — rótulo `243 shows`, 9 columnas:
`SHOW` · `FECHA` · `COBRADO` · `PEND. COBRAR` · `A RECUPERAR` · `NETO ARTISTA` · `LIQUIDADO` ·
`PEND. LIQUIDAR` · `ESTADO`.
Primera fila: `Olivia Bass C1-2026-155 OASIS · Oasis · Maspalomas` | `24 dic 2026` | `0,00 €` |
`960,00 €` | `—` | `800,00 €` | `—` | `800,00 €` | `Sin liquidar`.
(La celda `SHOW` apila artista, código `C1-2026-155` y `evento · venue · ciudad`.)

**Tabla `Por artista`** — **no está en el spec**. Rótulo `32 artistas`, 5 columnas:
`ARTISTA` · `SHOWS` · `PEND. LIQUIDAR` · `DEUDA VIVA` · `POSICIÓN NETA`.
Primera fila: `Bizza` | `60` | `29.245,97 €` | `—` | `+29.245,97 €`. La posición neta va con signo.

## 3. `/conceptone/pendientes` — S, confirmada tal cual

`h1` **Pendientes** · bajada: «Lo que te toca en ConceptOne: alertas de shows, arte por aprobar,
liquidaciones y tus tareas.» · inbox-zero con `✓`, titular **«No te toca nada ahora mismo»** y
«Ni alertas, ni creatividades, ni aprobaciones. Está todo al día.»

Ayuda contextual propia (panel `Chat · ConceptOne`): «El panel de atención no es una lista de tareas /
Es lo que está en riesgo por fecha: cuanto más cerca el show, más arriba. Si algo no debería estar ahí,
es que le falta un dato al show.»

## 4. `/management/incidentes` — **3 vistas**, no un conmutador binario

`h1` **Incidentes** · subtítulo dinámico **`6 de 7 incidentes`** · `Analítica` (enlace a
`/management/incidentes/analitica`) · `+ Incidente`.

- **8 filtros guardados** (el spec dice 9; el noveno es el `Limpiar filtros`):
  `Todas (sin cerrar)` (activo, `bg-slate-800 text-white`) · `Mis abiertos` ·
  `Sin resolver +7 días` · `Críticos y Altos` · `Sin asignar` (**borde rosa**, `border-rose-300`) ·
  `Este mes` · `Preventables 90 días` · `Recurrentes` · + `Limpiar filtros`.
- Fila de filtros: `Estado` (`Todos` · `Abiertos (sin resolver)` · `Abierta` · `En curso` ·
  `Bloqueada` · `Resuelta` · `Cerrada`) · `Severidad` (`Todas` · `Baja` · `Media` · `Alta` ·
  `Crítica`) · `Categoría` (11 valores: `Viaje y logística`, `Técnico y producción`, `Contractual`,
  `Pago`, `Conducta del artista`, `Conducta de promotor/comprador`, `Venue y operaciones del evento`,
  `Media y PR`, `Staff e interno`, `Legal y compliance`, `Salud y seguridad`) · buscador
  «`Buscar artista…`» · `Owner` (19 personas) · «`Texto…`».
- **`+ Más filtros`** conmuta a **`− Menos filtros`** y despliega 5 más:
  `Preventable` · `Escalado` · `Confidencial` · `Con relacionados` · `Impacto económico ≥`.
- **Conmutador de vista de 3 posiciones** — el DOM lleva el texto en minúscula y lo sube el CSS
  (`capitalize`): `Tabla` · `Tablero` · `Timeline`.

**Vista `Tabla`** — 8 columnas, ordenada por severidad: `CÓDIGO` · `TÍTULO` · `DEPARTAMENTO` ·
`CATEGORÍA` · **`SEVERIDAD ↓`** · `ESTADO` · `OWNER` · `EDAD`. 6 filas.
Primera: `#5` | `La pareja de Jose Fajardo se ha peleado con la novia del promotor.` |
`ConceptOne (booking)` | `Conducta del artista` | `Alta` | `Abierta` | `Sin asignar` | `37d`.

**Vista `Tablero`** — kanban por estado con contador y **`Vacío`** en las columnas sin tarjetas:
`Abierta 6` · `En curso 0` · `Bloqueada 0` · `Resuelta 0` · `Cerrada 0`. Cada tarjeta lleva título, severidad, owner y edad.

**Vista `Timeline`** — agrupada por mes con contador, rótulo con la capitalización que deja el CSS:
`Agosto De 2026 · 4`, `Julio De 2026 · 1`. Cada entrada: fecha (`26 ago 2026`), título,
departamento y estado.

## 5. `/management/incidentes/analitica`

`h1` **Analítica de incidentes** · bajada: «Patrones, tiempos de resolución, impacto económico y
calidad del reporte.» · `← Volver al panel de incidentes`.

4 KPI: `INCIDENTES (RANGO)` · `RESOLUCIÓN MEDIA` · `% PREVENTABLES` · `IMPACTO NETO`.

Bloques (`h2`, en este orden): `IMPACTO ECONÓMICO` (con `COSTE INCURRIDO`, `INGRESO PERDIDO`,
`RECUPERADO`, `NETO`) · `INCIDENTES POR CATEGORÍA` · `INCIDENTES POR DEPARTAMENTO` ·
`INCIDENTES POR MES (FECHA DE REPORTE)` · `RESOLUCIÓN MEDIA POR SEVERIDAD` ·
`RESOLUCIÓN MEDIA POR DEPARTAMENTO` · `PREVENTABLES VS NO PREVENTABLES` ·
`COUNTERPARTIES RECURRENTES` · `ABIERTOS CON MÁS DE 14 DÍAS` ·
`LAG MEDIO DE REPORTE POR DEPARTAMENTO`.

Dos tablas `POR CATEGORÍA` y `POR DEPARTAMENTO` con cabeceras `(vacía)` · `COSTE` · `PERDIDO` ·
`RECUP.` · `NETO`, **ambas en vacío**: «`Sin impacto registrado.`».
Los gráficos de conteo sí tienen datos (`Sin categoría 3`, `Pago 2`, `Conducta del artista 1`,
`Staff e interno 1`; `Sin owner 4`).

## 6. `/artistas` — es un **master-detail**, no una lista

`h1` **Artistas** con dos contadores en la cabecera: **`B 41`** y **`M 17`** · bajada: «Ficha completa
del artista: condiciones, datos personales, contrato y documentos.»

- Conmutador `Lista` / `Roster` (activo `bg-brand-600 text-white`).
  **Corregido tras la enmienda del coordinador (spec §3.1):** aquí leí la clase y deduje el color, que
  es justo lo que prohíbe el estándar de doble medida. Medido en el live, `/artistas` está dentro de
  `.apx` y `bg-brand-600` computa a **`rgb(91, 75, 232)`** — es violeta, por las 27 reglas de remapeo.
  Dentro de ConceptOne las clases `brand-*` se escriben **tal cual** y el violeta lo pone `apx.css`;
  hardcodearlo rompe el modo oscuro.
- Columna izquierda: `+ Nuevo artista` (ancho completo), buscador `input[type=search]`
  «`Buscar artista…`», 41 artistas con badges `B` / `M` y `Sin contrato`, y al final un desplegable
  **`Archivados · 1 ▸`**.
- **Vacío literal** del panel derecho: «`Selecciona un artista o crea uno nuevo.`»
- **Vista `Roster`**: rejilla por artista con badges `B`/`M` y enlaces a `Instagram`, `Facebook`,
  `TikTok`, `Spotify`, `Resident Advisor`, `Beatport`, `SoundCloud`, `YouTube`, `Apple Music`.
- No hay índice alfabético como control: la lista va ordenada alfabéticamente y nada más.

## 7. `/reporte` — la descripción del spec corresponde a otra pestaña

`h1` **Analítica** · bajada: «Uso interno · fees, agentes y comisiones. Importes en EUR.»

Controles **solo visibles en la pestaña `Resumen`**: `Estado` (`Liquidados` (por defecto) ·
`Pendientes de liquidar` · `Todos`), `Desde` y `Hasta` (botones `dp-btn` con `dd/mm/aaaa`).

**Pestaña `Resumen`** — `DASHBOARD GENERAL`: 5 KPI (`SHOWS LIQUIDADOS 23` · `BOOKING FEES 6450,00 €` ·
`MANAGEMENT FEES 1512,83 €` · `TOTAL GASTADO 1806,98 €` · `ARTISTA MÁS RENTABLE Los Canarios`
con `BF 1300,00 €` / `MF 947,47 €`), gráfico apilado «Fees por artista (Booking + Management
apilados)» con leyenda `Booking`/`Management`, y **la tabla de 6 columnas del spec**:
`AGENTE` · `CIERRES` · `FEE BRUTO` · `FEE MEDIO` · `BOOKING FEES` · `COMISIÓN` (5 filas; la primera,
`Yenifer Bernardo` | `14` | `22.650,00 €` | `1617,86 €` | `4810,00 €` | `1227,50 €`).

**Pestaña `Comisiones de agentes`** — **no es una tabla**: 3 KPI (`DEVENGADO TOTAL 1747,50 €` ·
`ABONADO 0,00 €` · `PENDIENTE DE ABONAR 1747,50 €`) y, bajo `POR AGENTE`, **una tarjeta por agente**
con `<nombre>`, «`15 shows liquidados · 0 abonos`», tres cifras `DEVENGADO` / `ABONADO` / `PENDIENTE`
y dos botones: `Detalle` y `Registrar abono`.

**Pestaña `Reparto de artistas`** — `CARGA POR PERSONA` agrupada por rol (`Agentes 8 pers. · 41
artistas`, `Advancing 2 pers. · 41 artistas`, `Logística 4 pers. · 41 artistas`), cada persona con
«`32 bolos · 17 art.`» y una entrada `Sin asignar 1 art. · 0 bolos`. Debajo, `POR ARTISTA` con el
`<select>` «`Selecciona un artista…`» (catálogo largo, ~200 nombres) y el vacío
«`Selecciona un artista para ver su detalle.`».

## 8. `/conceptone/ajustes` — **10 paneles**, no 9

`h1` **Ajustes de ConceptOne** · bajada: «Configuración del espacio de booking: administración,
alertas, configuración y conexiones.» · indicador `ConceptOne Guardado` + botón `Guardar`.

Menú izquierdo en 4 grupos. **El spec omite `Ocultar movimientos`**:

| Grupo | Paneles |
|---|---|
| `ADMINISTRACIÓN` | `Datos fiscales` · **`Ocultar movimientos`** · `Contratos` · `Comisiones y exclusividad` |
| `ALERTAS` | `Alertas` · `Recordatorios` |
| `CONFIGURACIÓN` | `Confirmación de show` · `Formulario de ofertas` · `Extras de logística` |
| `CONEXIONES` | `Calendario Google` |

Contenido de cada panel (capturado íntegro en su `.main.html`):

- **Datos fiscales** — secciones `DATOS FISCALES` (Razón social, NIF), `DIRECCIÓN` (con
  «Buscar dirección en Google» y placeholder «Escribe la dirección y elige un resultado…»),
  `CONTACTO`, `DATOS BANCARIOS` (Banco, Titular, IBAN, SWIFT/BIC, Firmante).
- **Ocultar movimientos** — «Ocultar movimientos en Gastos». Textos a ocultar separados por comas,
  con 9 valores cargados. Nota: «No distingue mayúsculas ni acentos parciales…».
- **Contratos** — «Plantillas de contrato», `+ Nueva plantilla`, plegables
  `Penalizaciones por cancelación del promotor` y `Firma de la agencia (contrafirma)`, y fichas de
  plantilla con badge de idioma (`EN` / `ES`), `Editar` y `✕`.
- **Comisiones y exclusividad** — `PORCENTAJE GLOBAL POR DEFECTO` + `EXCLUSIVIDAD Y LOGÍSTICA DE
  AGENDA` (`Ventana (días)`, `Radio de exclusividad (km)`, `Salto logístico máx. (km)`) +
  `% DE COMISIÓN POR AGENTE` (tabla `AGENTE` / `% DE COMISIÓN`). Dos botones `Guardar` independientes.
- **Alertas** — «Alertas de shows». Banner de estado «Activo — se están mandando avisos» con
  `Volver a modo prueba` y `Evaluar y avisar ahora`; reglas agrupadas por dueño (`AGENTE`…), cada una
  con `Activa`, `Cuándo salta` (días antes / después del show / desde la oferta) y `Severidad`.
- **Recordatorios** — «Recordatorios de cobro»: interruptor, `Cadencia (días entre recordatorios)`,
  `Copia interna (CC)`, `Plantilla del email` con conmutador `ES`/`EN` y marcadores `{cliente}`,
  `{doc}`, `{pendiente}`, `{importe}`, `{shows}`.
- **Confirmación de show** — correo automático al promotor; interruptor, asunto, texto, y
  `VARIABLES DISPONIBLES (ASUNTO Y TEXTO)`: `{codigo}` `{artista}` `{evento}` `{fecha}` `{ciudad}`
  `{pais}` `{venue}`.
- **Formulario de ofertas** — interruptor `Formulario activo` (`✓ Activo`) y tabla
  `Campos del formulario`: `ETIQUETA (ES / EN)` · `VISIBLE` · `OBLIGATORIO`, con campos tipados
  (`evento_fecha · date`, `importe · number`, `moneda · select`,
  `booking_fee_on_top · radio_si_no`, `retencion_pct · number`, `lineup · tags`,
  `set_duracion_min · number`…).
- **Extras de logística** — agrupados por línea (`VIAJE`…), tabla
  `ETIQUETA (ES)` · `LABEL (EN)` · `POR DEFECTO` · `ACTIVO` · `Eliminar`.
- **Calendario Google** — `SINCRONIZACIÓN CON GOOGLE CALENDAR`, interruptor
  `Sincronización activa`, `Plantilla del título del evento` con variables `{estado}` `{show}`
  `{venue}` `{ciudad}` `{artista}`, `QUÉ MÁS INCLUIR EN LA DESCRIPCIÓN` (Line up completo, Dirección
  del venue, Doors / curfew, Su set time, Nota pública, Estado de pago (no recomendado)) y
  `VENTANA DE LECTURA DEL CALENDARIO` (`Días hacia atrás`…).

### Reutilización: qué tenemos ya en casa

El panel **Comisiones y exclusividad** del live es **casi literal** nuestro
`src/features/configuracion/pages/ComisionesBookersPage.tsx` — mismo subtítulo, mismas tres cajas de
exclusividad, misma nota al pie. **Con una diferencia: el live dice «agente» donde nosotros decimos
«booker».**

- Live: «Comisiones de agentes … Cada **agente** tiene su propio % … El **agente** oficial y el
  aprobador de arte…» · tabla `AGENTE` / `% DE COMISIÓN`.
- Nuestro: «Comisiones de **bookers** … Cada **booker** tiene su propio % …».

El término `booker` está en 10 ficheros nuestros (`ComisionesBookersPage`, `BookerCommissionRow`,
`ControlComisionesPage`, `data/comisiones.ts`, `data/sidebar.ts`, `data/notificaciones.ts` y sus
tests). **Renombrarlos toca `/configuracion`, que no es de esta faena** — lo dejo levantado para el
coordinador en vez de arreglarlo por mi cuenta.

`AlertasEventosPage.tsx` existe y es el candidato para el panel `Alertas`.

---

## 9. Correcciones al spec §3 que salen de esta evidencia

| Ruta | El spec dice | La foto dice |
|---|---|---|
| `/tours` | talla **M**, «tarjetas por gira» | **L**: además del listado, un detalle por gira con 4 KPI, itinerario con logística ciclable, tramos con km/h/hueco, RUTA, gastos de tour y P&L detallado en dos bloques |
| `/liquidaciones` | una tabla de 9 columnas | **dos** tablas; `Por artista` (5 columnas, 32 filas) no está descrita. El filtro de estados es un `<select>` de 6 opciones, no chips |
| `/management/incidentes` | «9 filtros guardados», «conmutador de vista» | **8** filtros guardados + `Limpiar filtros`; el conmutador tiene **3** posiciones (`Tabla`/`Tablero`/`Timeline`) y `+ Más filtros` añade **5** campos |
| `/artistas` | «conmutador Lista/Roster · 41 artistas · índice alfabético» | **master-detail** con vacío «Selecciona un artista o crea uno nuevo.», contadores `B 41` / `M 17`, plegable `Archivados · 1`, y la vista `Roster` con 9 enlaces sociales por artista. **No hay índice alfabético** |
| `/reporte` | 3 pestañas y la tabla `AGENTE/CIERRES/…` | esa tabla vive en **`Resumen`**. `Comisiones de agentes` son **tarjetas por agente** con `Detalle` / `Registrar abono`; `Reparto de artistas` es `CARGA POR PERSONA` por rol + `POR ARTISTA` |
| `/conceptone/ajustes` | 9 secciones | **10**: falta `Ocultar movimientos` en la lista del spec |
| `/management/incidentes/analitica` | «tabla de coste + gráficos» | 4 KPI + **10 bloques** nombrados; las dos tablas de coste están **en vacío** hoy |

## 10. Límites de esta evidencia

- **Solo tema claro.** El modo noche exige pulsar el toggle y el live es solo lectura (§6 del spec).
- **Sin estados de detalle que exijan escritura**: no se abrió `+ Nuevo tour`, `+ Incidente`,
  `+ Nuevo artista`, `Registrar abono` ni `Detalle` de agente, ni se seleccionó un artista en
  `/artistas` o en `POR ARTISTA` (son clics inertes, pero el vacío ya está capturado y era lo que
  el calco necesita).
- **Las dos tablas de coste de la analítica de incidentes están vacías en el live hoy**: el calco de
  esa pantalla se hace contra el vacío literal «Sin impacto registrado.», no contra datos inventados.
