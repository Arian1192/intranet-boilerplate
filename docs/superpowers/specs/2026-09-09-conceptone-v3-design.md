# ConceptOne v3 — carcasa `apx`, área Management y recalco del módulo · Design

**Rama base:** `main` (`990dd7e`, 252 ficheros / 1019 tests verdes, verificado 2026-09-09).
**Ramas:** una por fase — `feature/conceptone-v3-carcasa`, `-bookings`, `-management`, `-mas`, `-recalco`.
Una PR por rama.
**Evidencia:** `docs/references/conceptone-v3-2026-09-09/` — 23 rutas capturadas el **2026-09-09 entre
09:20 y 09:40 CEST** (`.png` fullPage a `deviceScaleFactor: 2`, `.txt` de `innerText`, `.main.html`
**sin truncar**), más `apx.css` (las 208 reglas de la carcasa), `apx-computed.json` (estilos calculados
del rail) y `foot.html` (el pie del rail). Inventario de rutas del live en
`00-rutas-live-2026-09-09.json`.

> **El calco se fija a la foto.** Las cifras de este spec son las de esa franja horaria. El live mueve
> números en horas: cada fase **re-captura su pantalla** en el momento de implementarla y fija sus
> propias cifras.

---

## 1. Por qué

Entre el barrido del **2026-07-30** y hoy, ConceptOne ha dejado de ser un módulo dentro de nuestra
cabecera compartida y se ha convertido en **una aplicación con carcasa propia**. No es una deriva de
estilos: es otro contenedor, otro sistema de tokens, otra navegación y 14 rutas que no existían.

De las 89 rutas estructurales que hoy tiene el live, nos faltan 26. **Catorce de ellas son de
ConceptOne** y son nuevas desde el 30-jul. Ninguna ruta nuestra ha desaparecido del live: todo el delta
es material nuevo.

Además, las pantallas de ConceptOne que **ya teníamos** han derivado por dentro (Dashboard, Contactos,
Cobros, Ofertas, Gastos), así que dejarlas debajo de una carcasa nueva sin tocarlas produciría un módulo
incoherente: rail nuevo, contenido viejo.

---

## 2. La carcasa `apx`

### D1 — Es un sistema de tokens propio, no una variante del nuestro

ConceptOne se envuelve en un elemento con clase `.apx` que declara **sus propias custom properties**.
No es la rampa `brand` carbón del resto del boilerplate: el acento es **violeta** y el lienzo es lila
frío. Literal del live (`apx.css:1`):

```css
.apx {
  --ink: #0C0C16; --ink-2: #1A1A2A; --muted: #6B6B80;
  --line: #EAEAF2; --surface: #FFFFFF; --canvas: #F5F5FA; --canvas-2: #EEEEF6;
  --accent: #5B4BE8; --accent-2: #8B7BFF; --accent-soft: #EEEBFF;
  --accent-grad: linear-gradient(135deg,#5B4BE8,#8B7BFF);
  --mint: #16C79A;  --mint-soft: #E1F8F1;  --mint-fg: #0E8F6E;
  --amber: #F5A524; --amber-soft: #FDF1DC; --amber-fg: #9A6206;
  --rose: #F2547B;  --rose-soft: #FDE7ED;  --rose-fg: #C22A50;
  --pill: 999px;
  --ease: cubic-bezier(.22,1,.36,1);
  --shadow: 0 1px 2px rgba(12,12,22,.04), 0 8px 22px rgba(12,12,22,.06);
  --shadow-lg: 0 2px 8px rgba(12,12,22,.06), 0 22px 44px rgba(12,12,22,.14);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  background: var(--canvas);
}
```

**Decisión tomada (Arian, 2026-09-09): calco literal.** Se copia esta hoja tal cual a
`src/features/booking/shell/apx.css`, **scoped bajo `.apx`**, sin tocar `tailwind.config.js` ni exponer
estos tokens al resto del boilerplate. Convivirán dos lenguajes visuales, que es exactamente lo que
pasa en el live.

Son **11 clases de carcasa**: `apx-side`, `apx-side-logo`, `apx-cta`, `apx-side-scroll`, `apx-nav-cap`,
`apx-nav-item`, `apx-nav-lab`, `apx-nav-sep`, `apx-side-foot`, `apx-prof`, `apx-shift`. El interior de
las páginas sigue siendo Tailwind.

> **Corrección del 2026-09-09 (Faena 0).** La hoja **no acaba en la línea 83**. Las líneas 84-208
> contienen los componentes (`.btn-primary`, `.btn-cta`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`,
> `.input`, `.select`, `.label`, `.card`, `.badge`, las pastillas `.p-accent|.p-amber|.p-mint|.p-rose`,
> y `.fbar`, `.dd`, `.dp`, `.tpk`, `.alert`) y, sobre todo, **27 reglas que remapean nuestras utilidades
> `brand-*` de carbón a violeta dentro de `.apx`** (`bg-brand-600` → `rgb(91,75,232)`, `text-brand-600`,
> `ring-brand-500`, los gradientes…). Sin ellas, las páginas de ConceptOne quedarían con acentos carbón
> dentro de una carcasa violeta. **Se copia el fichero entero, las 208 reglas.** Todo va scoped bajo
> `.apx`, así que los otros 11 módulos no se ven afectados.

### D2 — El rail: 58 px que se expanden a 224 px al hover

```css
.apx .apx-side {
  position: fixed; top: 0; left: 0; bottom: 0; width: 58px; z-index: 40; overflow: hidden;
  background: var(--surface); border-right: 1px solid var(--line);
  display: flex; flex-direction: column; padding: 12px 9px 10px;
  transition: width .22s var(--ease), box-shadow .22s var(--ease);
}
.apx .apx-side:hover { width: 224px; box-shadow: var(--shadow-lg); }
.apx-shift { margin-left: 58px; }
```

El contenido no se re-maqueta al expandirse: el rail **flota por encima** (`position: fixed`) y
`.apx-shift` mantiene el margen fijo de 58 px.

Las etiquetas viven en `span.apx-nav-lab { opacity: 0 }` y pasan a `opacity: 1` cuando el rail está en
hover, con `text-overflow: ellipsis`. El logotipo hace lo mismo (`.brandtxt`).

Ítems del rail, valores calculados verificados (`apx-computed.json`):

| | Live | Nota |
|---|---|---|
| Alto del ítem | 32,25 px | `padding: 6px 9px`, `gap: 11px`, `border-radius: 9px` |
| Tipografía | 13,5 px | `font-weight: 500` inactivo · **600** activo |
| Color inactivo | `#6B6B80` (`--muted`) | |
| Color activo | `#5B4BE8` (`--accent`) | **sin fondo**: `background: none` |
| Hover | `background: var(--canvas)`, `color: var(--ink)` | también sobre el activo |
| Icono | SVG 20×20, `stroke-width: 1.6` | |
| Rótulo de grupo | `#6B6B80`, 9,5 px, peso 600, `letter-spacing: .76px`, `uppercase` | `padding: 9px 9px 2px` |

**El activo no lleva pastilla de fondo** — solo color y peso. Es la diferencia más fácil de fallar.
**No hay tooltips**: los ítems del rail no tienen `title` ni `aria-label` (verificado). Con el rail
plegado, el único indicio es el icono.

El CTA de cabecera es un botón con degradado:
```css
.apx .apx-cta {
  background: var(--accent-grad); color: #fff; border-radius: 10px; padding: 9px;
  font-size: 14px; font-weight: 600; box-shadow: 0 3px 10px rgba(91,75,232,.24);
}
.apx .apx-cta:hover { filter: brightness(1.03); transform: translateY(-1px); }
```

### D3 — La navegación: tres grupos y un pie

El logo es `/logo_antlers.svg` (20×20) + `span.brandtxt` con el texto `ConceptOne`, enlazando a
`/conceptone`. Debajo, el CTA **`Añadir show`**. Y luego los tres grupos, con los rótulos en el DOM
como `Bookings` / `Management` / `Más` (el `uppercase` lo pone el CSS):

| Grupo | Ítems (rótulo → ruta) |
|---|---|
| **Bookings** (10) | Dashboard → `/conceptone` · Shows → `/shows` · **Tours → `/tours`** · Ofertas → `/ofertas` · Cobros → `/cobros` · Gastos → `/gastos` · **Liquidaciones → `/liquidaciones`** · Disponibilidad → `/disponibilidad` · Calendario → `/calendario-c1` · Contactos → `/contactos` |
| **Management** (8) | **Roster → `/management/roster`** · **Insights → `/management/insights`** · Estrategias → `/management/estrategias` · **Contratos → `/management/contratos`** · **Activaciones → `/management/activaciones`** · **Campañas → `/management/campanas`** · **Content → `/management/content`** · Incidencias → `/management/incidentes` |
| **Más** (3) | Roster → `/artistas` · Análisis → `/reporte` · Ajustes → `/conceptone/ajustes` |

> Ojo al homónimo: hay **dos ítems rotulados «Roster»**, uno en Management (`/management/roster`,
> selección de artistas para Songstats) y otro en Más (`/artistas`, el roster de la agencia). Es así en
> el live; no se corrige.

Pie (`.apx-side-foot`, separado por `border-top: 1px solid var(--line)`), en orden:

1. **Black Moose** → `/` (icono casa) — la salida del módulo hacia la intranet.
2. **Pendientes** → `/conceptone/pendientes` (icono portapapeles con check).
3. **Modo noche** — `<button type="button" class="apx-nav-item">`, icono luna.
4. **Ayuda** — `<button>`, icono interrogación en círculo; abre el panel de Ayuda.
5. **Notificaciones** — un `div.apx-nav-item` con `cursor: default` que envuelve el botón de campana
   existente (badge `9+`, `bg-red-500`), más el rótulo `Notificaciones`.
6. **Perfil** — `<a class="apx-prof" href="/perfil">` con el avatar (28 px, color de fondo inline),
   nombre `test` y rol `admin`.

`.apx-prof { display:flex; align-items:center; gap:7px; padding:7px 5px; border-radius:10px; color: var(--ink) }`
y `:hover { background: var(--canvas) }`.

### D4 — El modo noche

**Decisión tomada (Arian): calco literal del retrofit.** El live no usa las variantes `dark:` de
Tailwind: redefine los tokens en `.apx[data-theme="dark"]` y luego **pisa 49 utilidades Tailwind con
`!important`**, porque las páginas están escritas en claro y no se han reanotado.

```css
.apx[data-theme="dark"] {
  --ink: #ECECF6; --ink-2: #FFFFFF; --muted: #9494AD;
  --line: #26263A; --surface: #16161F; --canvas: #0C0C12; --canvas-2: #1F1F2C;
  --accent: #8B7BFF; --accent-2: #A99CFF; --accent-soft: #231E4A;
  --mint-soft: #0E2C25;  --mint-fg: #4FD8B4;
  --amber-soft: #33270F; --amber-fg: #F0B44F;
  --rose-soft: #361420;  --rose-fg: #FF7B9C;
  --shadow: 0 1px 2px rgba(0,0,0,.4), 0 8px 22px rgba(0,0,0,.4);
  --shadow-lg: 0 2px 8px rgba(0,0,0,.5), 0 22px 44px rgba(0,0,0,.6);
  background: var(--canvas); color: var(--ink);
}
.apx[data-theme="dark"] .bg-white,
.apx[data-theme="dark"] .bg-white\/90, … { background-color: rgb(22,22,31) !important; }
.apx[data-theme="dark"] .bg-slate-50, …  { background-color: rgb(19,19,27) !important; }
.apx[data-theme="dark"] .bg-slate-100, … { background-color: rgb(31,31,44) !important; }
.apx[data-theme="dark"] .bg-slate-200, … { background-color: rgb(38,38,58) !important; }
.apx[data-theme="dark"] .bg-brand-50     { background-color: rgb(33,28,70) !important; }
.apx[data-theme="dark"] .bg-brand-100    { background-color: rgb(42,36,87) !important; }
…
```

Las 49 reglas se copian **literales** desde `docs/references/conceptone-v3-2026-09-09/apx.css`
(líneas 35-83). Cubren fondos sólidos, fondos con alpha (`/50`, `/60`, `/70`, `/80`, `/90`, `/95`),
`hover:` y las tres posiciones de gradiente (`from-`, `via-`, `to-`).

**Persistencia verificada:** `localStorage['apx-tema']`, valores `light` | `dark`. En claro el atributo
`data-theme` **no está presente** (no es `data-theme="light"`): el tema claro es la ausencia del
atributo. El toggle escribe la clave y pone o quita el atributo sobre el elemento `.apx`.

> El estado en oscuro **no se ha capturado**: activarlo exigía pulsar el botón y el live es solo
> lectura. El calco se hace desde las reglas CSS, que sí están capturadas íntegras. Quien implemente la
> Fase 0 documenta esta limitación en su PR.

### D5 — Ficheros de la carcasa

```
src/features/booking/shell/
  apx.css          ← el fichero entero de la evidencia: 208 reglas (tokens light + dark + 49
                     overrides de utilidades + 27 remapeos de brand-* + componentes + las 11 clases)
  ApxShell.tsx     ← wrapper .apx, estado del tema, localStorage['apx-tema']
  ApxRail.tsx      ← rail: logo, CTA, 3 grupos, pie
  nav.ts           ← RAIL_GROUPS y RAIL_FOOT (sustituye a CONCEPTONE_AREAS/BOOKINGS_SECTIONS)
```

**Assets.** El rail sirve `/logo_antlers.svg` (20×20) y el TopNav del Home sirve
`/logo_blackmoose.svg`. **Ninguno de los dos está en el repo** (no existe `public/`). Los dos son
estáticos públicos del live y responden `200` (1.133 y 12.106 bytes): se descargan y se commitean en
`public/`. Descargar un estático es una lectura y no rompe la regla de solo-lectura.

`ConceptOneShell.tsx` deja de usar `AppLayout` y pasa a `<ApxShell><ApxRail /><div class="apx-shift"><Outlet/></div></ApxShell>`.

`src/features/booking/data/nav.ts` queda **obsoleto para ConceptOne**: `CONCEPTONE_AREAS`,
`BOOKINGS_SECTIONS`, `activeArea`, `activeSection` y `showsSectionBar` se borran junto con sus tests.
Comprobar con `grep` que no los consume nadie más antes de borrar.

**El `AppLayout`/`TopNav` compartido no se toca**: lo siguen usando los otros 11 módulos, y su propio
plan del 30-jul (`docs/superpowers/plans/2026-07-30-topnav-modulo-activo.md`) sigue vigente e
independiente de este spec.

---

## 3. Las rutas nuevas (14 en el inventario inicial, 16 tras el sondeo)

Talla estimada a partir del contenido observado. **Cada fase re-captura su pantalla antes de escribirla.**

| Ruta | `h1` | Bajada / contenido | Talla |
|---|---|---|---|
| `/tours` | Tours | «Agrupa shows de un artista en una gira: viabilidad económica (P&L), gastos de tour (vuelos, hospedaje, per diems) y agenda de promo.» · CTA `+ Nuevo tour` · tarjetas por gira **que son botones y abren un detalle** (ver §3.1) | **L** |
| `/liquidaciones` | Liquidaciones | «Estado de dinero de cada show: cobros del promotor, gastos, y lo liquidado al artista.» · 3 KPI (`PENDIENTE DE COBRAR 172.489,88 €`, `GASTOS POR RECUPERAR 1006,43 €`, `PENDIENTE DE LIQUIDAR 124.050,25 €`) · **dos tablas distintas** y un `<select>` de 6 opciones (ver §3.1) | **L** |
| `/conceptone/pendientes` | Pendientes | «Lo que te toca en ConceptOne: alertas de shows, arte por aprobar, liquidaciones y tus tareas.» · inbox-zero idéntico al de Mi trabajo · Ayuda contextual propia | S |
| `/management/roster` | Roster de Management | «Elige con qué artistas trabajáis management y de cuáles traer datos de Songstats (se paga por uso).» · 2 KPI · tabla `ARTISTA / EN MANAGEMENT / SONGSTATS (API)` con toggles, 41 artistas | M |
| `/management/insights` | Insights | «Estado de cada artista en streaming y redes (Songstats). Todo se calcula del histórico — nada se introduce a mano.» · botón `Sincronizar Songstats` · 4 KPI · 5 chips de estado · tabla de 9 columnas | **L** |
| `/management/contratos` | Contratos | «Ciclo de vida del contrato de cada artista: término, preaviso, alcance y comisión.» · `+ Nuevo contrato` · 3 KPI · tabla de 6 columnas · **estado vacío**: «Sin contratos. Crea el primero.» | S |
| `/management/activaciones` | Activaciones | «Calendario de activaciones del roster: prensa, releases, posts, rodajes, entregas…» · 3 filtros · agrupación por mes con día/día-de-semana · estados `Programada/En curso/Hecha/Perdida` · 31 activaciones | M |
| `/management/campanas` | Campañas | «Inversión en marketing por canal. La del artista es la que cuenta para el retorno.» · 3 KPI · 3 filtros · tabla `CAMPAÑA/CANAL/ESTADO/PAGA/GASTO / PRESUPUESTO`, 11 campañas | M |
| `/management/content` | Content | «Pipeline de proyectos creativos del roster: del brief a la entrega.» · kanban de 5 columnas (`Idea`, `Briefado`, `Producción`, `Revisión`, +) con contador y `—` en las vacías | M |
| `/management/incidentes` | Incidentes | **8** filtros guardados + `Limpiar filtros` + `+ Más filtros` (despliega 5 campos) · tabla de 8 columnas ordenada por severidad · conmutador de **tres** vistas (ver §3.1) | M |
| `/management/incidentes/analitica` | Analítica de incidentes | 4 KPI + 10 bloques nombrados. **Las dos tablas de coste están hoy vacías en el live** (`Sin impacto registrado.`): el calco va contra el vacío (ver §3.1) | M |
| `/artistas` | Artistas | **master-detail**, no una lista · conmutador `Lista` / `Roster` · `+ Nuevo artista` · contadores `B 41` / `M 17` · plegable `Archivados · 1` (ver §3.1) | M |
| `/reporte` | Analítica | «Uso interno · fees, agentes y comisiones. Importes en EUR.» · rango de fechas · 3 pestañas con **tres formas distintas**, no tres tablas (ver §3.1) | **L** |
| `/conceptone/ajustes` | Ajustes de ConceptOne | «Configuración del espacio de booking: administración, alertas, configuración y conexiones.» · **10 paneles en 4 grupos** (ver §3.1) · botón `Guardar` | S — **re-expone paneles que ya tenemos en `/configuracion/comisiones` y `/configuracion/alertas`** |

### 3.1 Correcciones de la Faena 1 (evidencia `f1-`, capturada 10:08-10:14 CEST)

La Faena 1 capturó **19 estados secundarios** que el barrido de las 09:20-09:40 no cubría (detalles,
segundas pestañas, vistas alternativas y paneles). Evidencia con prefijo `f1-` en el mismo directorio,
más `f1-00-literales.json` y `f1-README.md`. Siete correcciones a la tabla de arriba:

1. **`/tours` es talla L, no M.** Las tarjetas **navegan** a un **detalle de gira** (ruta 16, §3.2):
   4 KPI, `ITINERARIO` con logística ciclable por show (Vuelo / Hotel / Ground / Visado),
   tramos con km, millas, horas y días de hueco, bloque `RUTA` con enlace a Google Maps, gastos de tour
   y **P&L detallado en dos bloques** (artista y agencia) con nota de tipo de cambio. **Replantear la
   talla de la Fase A.**
   *Corrección de la propia Faena 1, verificada por el coordinador:* el estado de la gira **no son
   chips**, es un `<select class="select h-9 w-auto">` con cuatro opciones — `Planificando`,
   `Confirmado`, `Cerrado`, `Cancelado`.
2. **`/liquidaciones` tiene dos tablas.** La de 9 columnas es `Por show` (243 shows). `Por artista` es
   **otra distinta, de 5 columnas** (`ARTISTA` / `SHOWS` / `PEND. LIQUIDAR` / `DEUDA VIVA` /
   `POSICIÓN NETA`, 32 artistas). El filtro de estados es un **`<select>` de 6 opciones**, no chips.
   Los 3 KPI coinciden al céntimo con los de la tabla de §3.
3. **`/management/incidentes`:** son **8** filtros guardados (el noveno que contaba el spec era el
   propio `Limpiar filtros`). El conmutador de vista tiene **tres** posiciones —`Tabla`, `Tablero`,
   `Timeline`—, que en el DOM van en minúscula y las sube el `capitalize` del CSS. `+ Más filtros`
   despliega 5 campos adicionales.
4. **`/artistas` es un master-detail**, no una lista. Vacío literal: «Selecciona un artista o crea uno
   nuevo.». Contadores `B 41` / `M 17` en cabecera, plegable `Archivados · 1`, y la vista `Roster` trae
   9 enlaces sociales por artista. **No hay índice alfabético** (era una inferencia del spec, y era
   falsa).
5. **`/reporte`:** la tabla `AGENTE / CIERRES / FEE BRUTO / FEE MEDIO / BOOKING FEES / COMISIÓN` vive
   **dentro de la pestaña `Resumen`**, no es la pantalla. `Comisiones de agentes` **no es una tabla**:
   son tarjetas por agente con `DEVENGADO` / `ABONADO` / `PENDIENTE` y botones `Detalle` y
   `Registrar abono`. `Reparto de artistas` es `CARGA POR PERSONA` agrupada por rol
   (`Agentes` / `Advancing` / `Logística`) más un bloque `POR ARTISTA`.
6. **`/conceptone/ajustes` tiene 10 paneles, no 9**, agrupados en cuatro secciones. Al spec le faltaba
   **`Ocultar movimientos`**:

   | Grupo | Paneles |
   |---|---|
   | `ADMINISTRACIÓN` | Datos fiscales · **Ocultar movimientos** · Contratos · Comisiones y exclusividad |
   | `ALERTAS` | Alertas · Recordatorios |
   | `CONFIGURACIÓN` | Confirmación de show · Formulario de ofertas · Extras de logística |
   | `CONEXIONES` | Calendario Google |

7. **`/management/incidentes/analitica`:** 4 KPI y 10 bloques nombrados. Las **dos tablas de coste
   están hoy vacías** en el live (`Sin impacto registrado.`). El calco va **contra ese vacío**, no
   contra datos inventados.

> **Enmienda del coordinador a la corrección 4.** La Faena 1 apuntó que `/artistas` «usa la rampa brand
> carbón (`bg-brand-600`), no el violeta apx». **Eso es leer la clase, no el color.** Medido en el live
> el 2026-09-09: `/artistas` está dentro de `.apx` y `bg-brand-600` computa a **`rgb(91, 75, 232)`**,
> `bg-brand-100` a `rgb(228, 224, 255)` y `text-brand-700` a `rgb(91, 75, 232)`. Es el efecto de las 27
> reglas de remapeo de §2 D1.
>
> **Regla general para las fases A-E:** dentro de ConceptOne se escriben las clases `brand-*` **tal
> cual**, exactamente como hace el live. El violeta lo pone `apx.css`. **Nunca hardcodear el violeta**:
> si lo haces, la pantalla deja de responder al tema y se rompe en modo oscuro.


### 3.2 La ruta 15 y un límite del inventario (Faena 2, 2026-09-09)

**`/management/insights/:artistaId` existe y el spec no la tenía.** Las filas de `/management/insights`
son clicables y el pie de la tabla lo dice literal: «Pulsa un artista para su ficha completa». El clic
**no abre un modal: navega**. Verificado por el coordinador en
`/management/insights/d371328b-a849-40ce-9320-dee3af5c017c` — renderiza una pantalla completa, no el
catch-all.

Contenido: cabecera con flecha de volver, nombre, chip de estado, `Songstats · actualizado 2/9/2026` y
botón `Sincronizar`; **12 pestañas** (`Overview`, `Audiencia`, `Spotify`, `Beatport`, `Shazam`,
`YouTube`, `TikTok`, `Instagram`, `SoundCloud`, `Deezer`, `Tidal`, `Traxsource`); **9 KPI**; y un bloque
`TOP TRACKS` con tres ordenaciones (`Streams`, `Popularidad`, `Playlist reach`).

**Decisión del coordinador:** se registra **ahora** la ruta apuntando a un stub (h1 + volver), para que
las filas naveguen de verdad y el pie no prometa algo que no hace. **La ficha completa es la Fase F**,
talla **L**, y se escribe en su propia rama. Excepción puntual al congelado de `router.tsx`: la añade la
Faena 2, **una línea y su fichero de stub, en un commit aparte**.

#### Ruta 16 — `/tours/:tourId` (Faena 1, verificada por el coordinador)

Las tarjetas de `/tours` **navegan**, no despliegan en sitio, y la ruta es **deep-linkable**: cargando
`/tours/c68ade2f-5f01-4686-869c-34e744cf445a` a pelo renderiza el detalle entero. Se registra contra un
stub, igual que la 15.

**Ojo al maquetarla: esta pantalla no tiene `h1`.** El nombre de la gira es un **input editable en
línea**, medido en el live:

```html
<input class="w-full border-0 bg-transparent p-0 text-2xl font-semibold text-slate-800
              focus:outline-none focus:ring-0" value="LATAM Sept 2026">
```

El patrón «h1 + bajada» del resto de páginas **no aplica aquí**, y por tanto el stub de esta ruta
tampoco lo lleva.

#### Sondeo de filas clicables (Faena 1, 2026-09-09)

| Pantalla | Al pulsar una fila | Consecuencia |
|---|---|---|
| `/tours` | navega a `/tours/:tourId` | **ruta 16**, se registra |
| `/liquidaciones` (`Por show`) | navega a `/shows/:id` | ruta **ya existente**: las 243 filas son enlaces al detalle del show. No hay nada que registrar |
| `/artistas` | no cambia la URL, no hay modal | master-detail **en sitio**, confirmado |
| `/management/incidentes` | no cambia la URL, **abre un modal** (`[role=dialog]`) | se captura a fondo en la Fase D |

#### Sondeo de filas clicables (Faena 2, 2026-09-09)

| Pantalla | Al pulsar una fila | Consecuencia |
|---|---|---|
| `/management/roster`, `/management/contratos` | nada clicable | sin ruta que registrar |
| `/management/campanas` (11 filas), `/management/activaciones` (31), `/management/content` (1 tarjeta) | la fila es un `button.text-left`; **no navega**: abre un **modal de edición** en la misma página (`Editar campaña`, `Editar activación`, `Editar proyecto`) | sin ruta nueva. Los tres modales son la **Fase G** |

`/management/insights/:artistaId` (ruta 15) sigue siendo la única ruta nueva de Management.

Pendiente de sondear: `/management/incidentes/analitica` y las tarjetas por agente de `/reporte`
(`Detalle`, `Registrar abono`). Van con la Fase D.

#### Precisión de la regla de solo-lectura

El sondeo obliga a afinar la regla, porque «pulsa una fila» puede acabar abriendo un formulario:

1. **Sonda pasiva primero.** Antes de pulsar nada, `getComputedStyle` sobre lo que cuelga de `main`
   para localizar el elemento clicable exacto. Así se elige el objetivo en vez de tantear.
2. **Abrir un modal de edición de un registro que ya existe: permitido** cuando hace falta para la
   evidencia. No escribe nada y es estado de cliente: se va al recargar.
3. **Abrir un formulario de alta (`+ Nuevo…`): NO.** Riesgo real de que el servidor cree un borrador o
   reserve un identificador al abrirlo. Si hace falta esa evidencia, se pide al coordinador.
4. **Nunca:** teclear en un campo, guardar, pulsar botones de cambio de estado
   (`Programada`/`En curso`/`Hecha`/`Perdida`) ni aspas de borrado.

La Faena 2 abrió los tres modales de edición siguiendo 1, 2 y 4, lo declaró por su cuenta y no escribió
nada. Queda como el procedimiento correcto.

#### Límite conocido del inventario de rutas

**El inventario de 89 rutas es un suelo, no un techo.** Se construyó rastreando enlaces `<a href>`, y
buena parte de las listas del live **no usan anclas**: navegan por código desde filas o tarjetas con
`cursor: pointer`. Sondeadas 17 listas, solo `/cobros` y `/personal/fichas` tienen anclas; el resto
—`/shows`, `/liquidaciones`, `/gastos`, `/contactos`, `/artistas`, `/tours`, `/management/*`, `/cruda`,
`/euphoric/cuentas`— llevan filas clicables que el rastreo **no ve**. `/shows/:id` entró en el
inventario solo porque allí sí había anclas.

**Regla permanente para todas las fases:** si tu pantalla tiene filas o tarjetas clicables, **pulsa una**
(es navegación, no escritura: está permitido) y comprueba si cambia la URL. Si cambia, **avisa al
coordinador** con la ruta observada para que se registre. No inventes la ruta ni la des por inexistente.


---

## 4. Recalco de las pantallas existentes

**Decisión tomada (Arian): entran en esta ronda.** Deltas confirmados hoy:

| Pantalla | Live 2026-09-09 | Nosotros hoy |
|---|---|---|
| **Dashboard** (`/conceptone`) | Tira de **6 KPI de pipeline** (`TENTATIVE 70.479,07 € · 100`, `CONFIRMADO 14.100,56 € · 16`, `CONTRATO 30.905,46 € · 28`, `PENDIENTE COBRO 32.473,28 € · 27`, `PENDIENTE LIQUIDAR 24.250,00 € · 19`, `CERRADO 31.350,00 € · 23`) + enlace `Ir a todos los shows →` + feed **NOVEDADES** («Lo que hacen los promotores con sus correos y contratos») con eventos de firma fechados y referencia `C1-2026-158` | Ninguno de esos elementos existe |
| **Contactos** | 4 pestañas: `Venues` · `Eventos / Promotoras` · `Empresas` · `Personas` + `+ Nuevo venue` | 2 pestañas: `Venues` · `Empresas y contactos` |
| **Cobros** | Bajada ampliada («…Total y vencimientos salen del plan de pagos; **lo cobrado, de las facturas conciliadas en Holded**.») + botón `Facturar el mes…` + KPI `SHOWS POR COBRAR 155` / `PENDIENTE TOTAL 172.489,88 €` | Bajada corta, sin botón ni ese KPI |
| **Ofertas** | 5 chips con contador (`Todas` · `Nuevas` · `Revisadas` · `Convertidas` · `Descartadas`) + master-detail con vacío «Selecciona una oferta» | Revisar contra la captura |
| **Gastos** | Bajada con «**Últimos 120 días**» + 3 KPI (`GASTO SIN ASIGNAR 194.004,76 €` / `356 movimiento(s)`, `MOVIMIENTOS (TOTAL) 393`) | Revisar contra la captura |
| **Shows** | Toolbar `87 shows` · `Solo futuros` · rango `Última semana → Todo el futuro` · `Filtros` · leyenda de estado | Revisar contra la captura |

Las tres últimas van marcadas «revisar»: el delta se confirma con el diff `ours/` ↔ live en el momento
de ejecutar la fase, no se da por hecho aquí.

---

## 5. Fases, dependencias y reparto

| # | Fase | Rama | Depende de | Talla |
|---|---|---|---|---|
| **0** | **Carcasa `apx`** — `apx.css`, `ApxShell`, `ApxRail`, `nav.ts`, tema, y **`router.tsx` con las 14 rutas nuevas apuntando a stubs** | `feature/conceptone-v3-carcasa` | — | M |
| **A** | Bookings nuevas: `/tours`, `/liquidaciones`, `/conceptone/pendientes` | `feature/conceptone-v3-bookings` | 0 | M |
| **B** | Management I: `/management/roster`, `/management/insights` | `feature/conceptone-v3-management` | 0 | M |
| **C** | Management II: `/management/{contratos,activaciones,campanas,content}` | `feature/conceptone-v3-management` (continúa la de B) | 0 | M |
| **D** | Management III + «Más»: `/management/incidentes` + `/incidentes/analitica`, `/artistas`, `/reporte`, `/conceptone/ajustes` | `feature/conceptone-v3-mas` | 0 | M |
| **E** | Recalco: Dashboard, Contactos, Cobros, Ofertas, Gastos, Shows | `feature/conceptone-v3-recalco` | 0 | M/L |
| **F** | **Ficha de artista de Insights** (`/management/insights/:artistaId`): 12 pestañas, 9 KPI y `TOP TRACKS` (ver §3.2) | `feature/conceptone-v3-insights-ficha` | 0, B | **L** |
| **G** | **Los 3 modales de edición de Management** (`Editar campaña`, `Editar activación`, `Editar proyecto`): 8-10 campos cada uno. Evidencia ya capturada por la Faena 2 (`f2-management--*-detalle.*`) | `feature/conceptone-v3-management-modales` | C | M |

**Reparto en tres rondas**, dos ejecutores más el coordinador:

1. Ejecutor 1 → **Fase 0**. Ejecutor 2 → captura de evidencia complementaria del live a `docs/`
   (independiente, no toca `src/`, arranca a la vez).
2. Fusionada la 0: Ejecutor 1 → **B + C**. Ejecutor 2 → **A + D**.
3. **E** repartida entre los dos.

El coordinador no escribe código de producción: escribe specs y planes, revisa e integra.

---

## 6. Reglas anti-conflicto

Esto es lo que hace el trabajo paralelizable. Son obligatorias:

1. **La Fase 0 registra las 14 rutas de golpe** apuntando a componentes stub. A partir de ahí
   **nadie más toca `router.tsx`**: cada fase sustituye el cuerpo de su propia página.
2. **Congelados tras la Fase 0:** `router.tsx`, `src/features/booking/shell/*` (incluido `apx.css`),
   `nav.ts`, `ConceptOneShell.tsx`. Si una fase necesita cambiarlos, **pide al coordinador**, no lo hace
   por su cuenta.
3. **Una pantalla = un fichero de página + un fichero de datos propio.** Nada de meter varias pantallas
   en un fichero ni de ampliar `index.ts` compartidos: los barrels son el punto de conflicto clásico.
   Las páginas nuevas se importan por ruta directa.
4. **Worktrees en `~/dev/worktrees/Boilerplate/<nombre>`.** `~/orca/` está deprecado.
5. **Nada se fusiona a `main` sin OK explícito** de Arian a través del coordinador.
6. **El live es SOLO LECTURA.** Login, navegación y captura. Ni formularios, ni guardados, ni el toggle
   de tema.

---

## 7. Datos y fidelidad

Todo el módulo sigue siendo **seed local**: las pantallas nuevas llevan sus datos en
`src/features/booking/data/<dominio>.ts`, calcados de la captura de su fase. No se toca el
`Repository`/`SupabaseAdapter`.

Regla de calco vigente en el proyecto y que aplica aquí igual:

- **Doble medida para los colores.** Un color del live se fija con dos medidas independientes que
  coincidan al valor exacto (regla CSS capturada + `getComputedStyle`, o muestreo del PNG con PIL).
  Nunca a ojo.
- **Nunca truncar un volcado DOM.** Los `.main.html` de la evidencia están completos por eso.
- **El dato ya está en casa:** antes de encargar una captura nueva, buscar en `src/` y en
  `docs/references/`.

---

## 8. Verificación

Cada fase cierra con la salida real pegada en su reporte:

```
npm test          # 252+ ficheros, 1019+ tests — ninguno rojo
npx tsc --noEmit
npm run lint
```

Más, por pantalla: captura de la nuestra en la misma ruta y viewport (1440×1000) y comparación contra
el PNG del live de su fase. «Hecho» sin esa salida no cuenta.

---

## 9. Fuera de alcance

- **`/perfil`.** El pie del rail enlaza ahí y la pantalla no existe en nuestro router — hoy caería en el
  catch-all que pinta el Home. Tiene spec propio del 30-jul
  (`2026-07-30-perfil-y-sesiones-design.md`); se deja el enlace puesto y se implementa en su ronda.
- **El TopNav compartido** y su plan del 30-jul: siguen vigentes para los otros 11 módulos.
- **La Ayuda contextual** (`2026-07-30-ayuda-contextual-design.md`): el botón `Ayuda` del pie del rail
  abre el panel que ya tenemos. La versión contextual llega con su propio spec.
- **Las otras 12 rutas** que nos faltan fuera de ConceptOne (`/cruda/costes`,
  `/euphoric/negocio/{partes,rendimiento,facturacion}`, `/crm/kpis`, `/personal/analitica`,
  `/mixmag/{analitica,ajustes}`, `/tagmag/{analitica,ajustes}`, `/produccion/ajustes`): otras rondas.
