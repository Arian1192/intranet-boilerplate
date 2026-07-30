# Barrido del live 2026-07-30 — informe de deltas

**Ejecutor:** Faena A (`wA:pC`). **Base de comparación:** `main` = `4578550` (249 ficheros / 965 tests).

> **Nota posterior al barrido.** Mientras se escribía este informe se fusionó la **PR #21**
> (`feature/config-usuarios`): `main` es ahora `2e0ac9a` con **252 ficheros / 998 tests** (medido
> 2026-07-30 10:06). Las comparaciones de este informe se hicieron contra `4578550` y **se dejan tal cual**,
> porque es la base real en el momento de la captura. Los cuatro planes de §5 sí llevan el baseline nuevo,
> que es el que tiene que usar quien los ejecute.
**Live:** `bookings.conceptoneagency.com` — capturado entre **09:05 y 10:15 CEST del 2026-07-30**.
**Evidencia:** `docs/references/barrido-2026-07-30/` (96 PNG + volcados HTML/JSON sin truncar),
`docs/references/config-usuarios/` (encargo de las 11 cajas de permisos),
`docs/references/tablero-piezas-2026-07-30/` (encargo de la convergencia Creativos↔Euphoric).

> **El calco se fija a la foto.** Las cifras de este informe son las de la hora indicada arriba;
> el live mueve números en horas.

---

## 0. Dos correcciones de método, antes de nada

**a) El gotcha de «la URL directa rebota a Home» es falso, o al menos ya no es lo que parecía.**
Las 70 rutas reales del live responden por URL directa sin redirigir. Lo que ocurre es que una ruta
**inexistente** renderiza el contenido del Home (`h1` = `Hola, test 👋🏼`, bloque Novedades) **conservando
el nav y el desplegable del módulo**. Es un catch-all que pinta el dashboard, no un `redirect`.
Verificado en `/etra/ajustes`, `/crm/ajustes`, `/creativos/analitica`, `/personal/ajustes`,
`/cruda/ajustes`, `/herramientas/ajustes`. Consecuencia práctica: **se puede barrer por URL**, y
«me sale el Home» es la señal de que esa ruta NO existe, no de que la navegación esté rota.

**b) La rampa `brand` del live sigue siendo carbón y coincide con nuestro `tailwind.config.js`.**
Sondeada inyectando elementos con cada clase y leyendo `getComputedStyle`:

| Stop | Live | Nuestro config | |
|---|---|---|---|
| `brand-50` | `#F6F6F7` | `#F6F6F7` | ✅ |
| `brand-100` | `#ECECED` | `#ECECED` | ✅ |
| `brand-400` | `#84848D` | `#84848D` | ✅ |
| `brand-500` | `#5F5F68` | `#5F5F68` | ✅ |
| `brand-600` | `#44444C` | `#44444C` | ✅ |
| `brand-700` | `#37373D` | `#37373D` | ✅ |
| `brand-800` | `#2B2B30` | `#2B2B30` | ✅ |
| `brand-200` / `300` / `900` | no compilados (sin uso en el live) | interpolados | ⚠️ sin verificar |

No ha vuelto a moverse. Nuestros `200`/`300`/`900` siguen siendo interpolación razonada, no evidencia.

---

## 1. Tabla de deltas por módulo

| Módulo | Estado | Delta | Evidencia |
|---|---|---|---|
| **TopNav (transversal)** | 🔴 estructural | El desplegable usa el **nombre del módulo activo**; falta el estado activo; sobra el nombre duplicado en el nav; el logo cambia por ruta; usuario `test`/`T` vs `Test User`/`TE` | `topnav-dropdown-{conceptone,team,home}.{png,html,json}`, `logo-y-secciones.json` |
| **Panel de Ayuda (transversal)** | 🔴 estructural | Es **contextual**: 14 conjuntos distintos y 20 tarjetas de consejo. La carcasa tampoco coincide | `ayuda-{team-contextual,mixmag-campanas-3tips,generico}.{png,html,json}`, `ayuda-contextual-inventario.json` |
| **Iconos de acción del nav (transversal)** | 🔴 estructural | 14 enlaces solo-icono dentro del `<nav>` en 8 módulos; nosotros tenemos 3 en 2 módulos y en el sitio equivocado | `icon-actions.json` |
| **`/perfil`** | 🔴 pantalla nueva | Pantalla entera que no tenemos: perfil + idioma + «Mis sesiones» | `d-perfil.png` |
| **Tablero de piezas** | 🔴 estructural | `/creativos` y `/euphoric/piezas` son **la misma pantalla byte a byte**; nuestro `StatusChip` de Euphoric tiene 2 tonos mal | `tablero-piezas-2026-07-30/README.md` |
| **ConceptOne** | 🟡 menor | Faltan 4 rutas (`/artistas`, `/management/incidentes`, `/reporte`, `/conceptone/ajustes`); la fila de secciones está fuera del header sticky en el live | `c1-*.png`, `conceptone-secciones-row.html` |
| **Mixmag** | 🟡 menor | Faltan `/mixmag/analitica` y `/mixmag/ajustes` | `c-mixmag-*.png` |
| **TAGMAG** | 🟡 menor | Faltan `/tagmag/analitica` y `/tagmag/ajustes` | `c-tagmag-*.png` |
| **CRM** | 🟡 menor | Falta `/crm/kpis` | `c-crm-kpis.png` |
| **Team (`/personal`)** | 🟡 menor | Falta `/personal/analitica`. `/personal/usuarios` viene en la PR #21 | `d-personal-analitica.png`, `config-usuarios/` |
| **Producción** | 🟡 menor | Falta `/produccion/ajustes` | `b-produccion-ajustes.png` |
| **Euphoric** | 🟡 menor | Rutas y nav completos ✅; solo el delta del tablero de piezas | `b-euphoric-*.png` |
| **Home** | 🟡 menor | Solo lo que arrastra el TopNav (logo y usuario). Contenido, festivo, clima, inbox-zero y Novedades coinciden | `home-landing.png` |
| **Mi trabajo** | 🟡 menor | Solo el panel de Ayuda contextual (3 tarjetas) | `d-mi-trabajo.png` |
| **Etra** | sin cambios | `Resumen · Acciones · Seeding · Cuentas`, sin iconos, Ayuda genérica | `b-etra-*.png` |
| **CRUDA** | sin cambios | `Pedidos · Catálogo` + icono a `/cruda/analitica`, todo ya está | `c-cruda-*.png` |
| **Creativos** | sin cambios (como módulo) | Nav de una sola entrada `Creatividades`; su delta es el del tablero | `c-creativos.png` |
| **Herramientas** | sin cambios | `Herramientas · Proyecciones`, sin iconos, Ayuda genérica | `d-herramientas*.png` |
| **Configuración** | sin cambios | Los 12 ítems del lateral coinciden, incluido `Cuentas (auditoría)` → `/personal/usuarios` (PR #21) | `d-configuracion-*.png` |
| **Incidencias** | sin cambios | Sin nav de módulo, crumb en `Espacios`, Ayuda genérica | `d-incidencias.png` |

**Nada ha desaparecido del live.** Todos los deltas son cosas que el live tiene y nosotros no,
o detalles de maquetado; no hay que borrar nada.

---

## 2. Los deltas 🔴, en detalle

### 2.1 TopNav — el desplegable ES el nombre del módulo (follow-up (a) RESUELTO: **delta real**)

**Veredicto: delta real, no falsa alarma.**

En el live la etiqueta del botón del desplegable es **el nombre del módulo activo**, y solo cae a
`Espacios` en las cuatro rutas que no pertenecen a ningún módulo:

| Ruta | Etiqueta del desplegable |
|---|---|
| `/conceptone` | `ConceptOne` |
| `/personal` | `Team` |
| `/euphoric` (y subrutas) | `Euphoric Media` |
| `/cruda`, `/crm`, `/mixmag`, `/tagmag`, `/creativos`, `/etra`, `/produccion`, `/herramientas`, `/configuracion` | su propio nombre |
| `/`, `/incidencias`, `/mi-trabajo`, `/perfil` | `Espacios` |

Capturado abierto en tres sitios distintos (`/conceptone`, `/personal`, `/`) y en los tres el
**contenido de la lista es idéntico**: 12 módulos, lista plana, **sin agrupar y sin iconos**:

```
ConceptOne · Etra · Producción · Euphoric Media · Mixmag · TAGMAG · Creativos ·
CRM · CRUDA · Team · Herramientas · Configuración
```

Maquetado del panel en el live:
```html
<div class="absolute left-0 z-50 mt-1 w-52 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
  <a class="block rounded-md px-3 py-1.5 text-sm hover:bg-slate-50 text-slate-700" href="/conceptone">ConceptOne</a>
  …
  <a class="block rounded-md px-3 py-1.5 text-sm hover:bg-slate-50 font-semibold text-brand-700" href="/personal">Team</a>
</div>
```
El botón es **idéntico al nuestro** en clases
(`flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900`),
con un chevron SVG de 14×14 y `stroke-width: 2.5`.

| | Live | Nosotros (`EspaciosDropdown.tsx`) |
|---|---|---|
| Etiqueta | nombre del módulo, `Espacios` de fallback | siempre `Espacios` |
| Ancho / padding / radio | `w-52` · `p-1` · `rounded-lg` | `w-56` · `p-1.5` · `rounded-xl` |
| Ítem | `block rounded-md px-3 py-1.5 text-sm` | `flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm` |
| Iconos | **no** | sí, `MODULE_ICONS` a `h-4 w-4 text-slate-500` |
| Ítem activo | `font-semibold text-brand-700` (`#37373D`) | sin estado activo |
| `z-index` del panel | `z-50` | `z-20` |
| Nombre del módulo en el nav | **no existe** | sí, `/ {module.name}` antes de las áreas (`TopNav.tsx:59-68`) |

**Orden de `MODULES`.** El desplegable del live pone **CRM antes de CRUDA**; el nuestro al revés.
El grid del Home del live sí muestra CRUDA dentro de «Espacios de trabajo» y CRM en «Gestión interna»,
igual que el nuestro — porque el grid agrupa por categoría y el desplegable renderiza el array plano.
**Basta intercambiar las dos entradas en `MODULES` (`src/lib/constants.ts`)**: el desplegable cuadra y
el Home no se mueve. Ojo: `src/lib/constants.test.ts` fija las categorías, no el orden; comprobar.

**Logo.** El live sirve **dos logos según la ruta**, los dos `h-5 w-auto` con `alt="Black Moose Group"`:

| Ruta | `src` |
|---|---|
| `/` (Home) | `/logo_blackmoose.svg` |
| **todas** las demás | `/logo_antlers.svg` |

Nosotros pintamos siempre una caja `h-8 w-8 rounded-lg bg-slate-800` con la inicial de `APP_NAME`
más el texto `APP_NAME` al lado (`TopNav.tsx:45-52`). El live **no tiene wordmark de texto**.

**Usuario (follow-up (c) CONFIRMADO).**

| | Live | Nosotros |
|---|---|---|
| Nombre | `test` | `Test User` |
| Rol | `admin` con clase `capitalize` → se ve «Admin» | `Admin` con `capitalize` |
| Inicial | `T` (**una** letra) | `TE` (`Avatar` hace `fallback.slice(0, 2)`) |
| Tamaño del avatar | 32 px (`style="width:32px;height:32px"`), fuente 13 px | `size="md"` = 40 px (`h-10 w-10 text-sm`) |
| Fondo del avatar | `background-color: rgb(79,70,229)` **inline** (indigo-600) | `bg-slate-800` por `className` |
| Elemento | `<a href="/perfil">` | `<button>` sin destino |

El color del avatar es inline y varía por persona (los avatares del equipo son imágenes reales
servidas desde Supabase Storage, ver el informe del tablero de piezas): **no es un token de tema**,
es color por usuario. Y el bloque de usuario **enlaza a `/perfil`**, que no tenemos.

→ **Spec:** `docs/superpowers/specs/2026-07-30-topnav-modulo-activo-design.md`
→ **Plan:** `docs/superpowers/plans/2026-07-30-topnav-modulo-activo.md`

### 2.2 El panel de Ayuda es contextual (item (B) CONFIRMADO)

**14 conjuntos de contenido distintos + 1 genérico, 20 tarjetas de consejo en total**, sobre 81 rutas
inspeccionadas. El emparejamiento es **por prefijo de ruta con override por pantalla**: `/mixmag` da el
consejo de la tuerca, pero `/mixmag/contenidos` y `/mixmag/campanas` tienen los suyos propios.
Inventario completo y estructurado en `ayuda-contextual-inventario.json`; el literal de los 14 conjuntos
está en el spec.

Muestra de tres, para que se vea el tono (son textos de producto, no lorem):

- **Team** → *Los accesos se dan desde la ficha* · «Crear la persona y darle acceso son dos cosas: una persona puede estar en el directorio sin cuenta. Los permisos se editan en su ficha, no en una lista aparte.»
- **CRUDA** → *El stock se descuenta al confirmar el pedido* · «No al crearlo. Un pedido en borrador no reserva nada, así que dos comerciales pueden vender la misma última unidad: confírmalo cuanto antes.»
- **Mixmag `/campanas`** → tres tarjetas: *La campaña ES el presupuesto*, *Vendida ≠ publicada*, *Los packs se despliegan*.

Mixmag y TAGMAG tienen el **mismo título** de consejo («Tarifas y packs viven en la tuerca») con
**cuerpo distinto**: el de TAGMAG añade «Son suyos: no los comparte con Mixmag». No es un consejo
compartido parametrizado; son dos textos.

Cae al genérico *«Pregunta lo que quieras de esta pantalla, o cuenta qué está fallando.»* en 31 rutas:
Home, **todo** `/etra`, **todo** `/configuracion`, `/herramientas`, `/incidencias`, `/perfil` y las
secciones de ConceptOne que no son el dashboard ni `/shows`.

**Y la carcasa tampoco es la nuestra.** Mismo sitio y mismo ancho (`fixed bottom-4 left-4`, 352 px),
pero:

| | Live | Nuestro `HelpPanel.tsx` |
|---|---|---|
| Contenedor | `z-40 flex max-h-[70vh] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl` (sin padding) | `z-30 rounded-xl border border-slate-200 bg-white p-4 shadow-lg` |
| Estructura | 3 zonas: cabecera `border-b`, cuerpo `overflow-y-auto`, pie `border-t` | una sola caja |
| Icono | `span.flex h-4 w-4 … rounded-full bg-slate-800 text-[10px] font-bold text-white` con `?` | `<HelpCircle className="h-4 w-4 text-slate-500">` de lucide |
| Título | nombre del módulo · `text-xs font-semibold text-slate-700` | `Ayuda` · `text-sm font-semibold text-slate-800` |
| Tarjeta de consejo | `p.text-xs font-medium text-slate-700` + `p.mt-0.5 text-xs leading-relaxed text-slate-500` | no existe |
| Copy genérico | `py-1 text-xs text-slate-400` | `text-sm text-slate-500` |
| Entrada de texto | `<textarea rows="1" class="max-h-24 min-h-[34px] flex-1 resize-none rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs …">` | `<input type="text">` `px-3 py-2 text-sm` |
| Botón Enviar | `h-[34px] … px-2.5 text-xs font-medium … disabled:opacity-30`, **`disabled` de inicio** | `px-3 py-2 text-sm`, nunca deshabilitado |
| Pie | `text-[11px] text-slate-400 hover:text-slate-700` | `text-xs text-slate-400 hover:text-slate-600` |
| Cerrar | X propia en SVG, `title="Plegar (se queda plegado mientras navegas)"`, `text-slate-300` | `<X>` de lucide, `aria-label="Cerrar ayuda"`, `text-slate-400` |
| Persistencia | **el plegado sobrevive a la navegación** (verificado: plegué en `/creativos` y seguía plegado en `/euphoric/piezas`) | `useState(true)` se reinicia en cada montaje |

→ **Spec:** `docs/superpowers/specs/2026-07-30-ayuda-contextual-design.md`
→ **Plan:** `docs/superpowers/plans/2026-07-30-ayuda-contextual.md`

### 2.3 Iconos de acción dentro del nav (item (A) resuelto y generalizado)

**La «cuarta entrada» del sub-nav de Team no es una entrada con etiqueta.** Es un enlace **solo-icono**
a `/personal/analitica`. Por eso el volcado DOM anterior mostraba una etiqueta vacía. Y no es de Team:
es un patrón que el live aplica en **8 de los 12 módulos**, con los iconos **dentro del propio
`<nav>`**, alineados a su borde derecho.

| Módulo | Iconos (href · `title`/`aria-label`) |
|---|---|
| ConceptOne | `/artistas` Artistas · `/management/incidentes` Incidencias · `/reporte` Analítica · `/conceptone/ajustes` Ajustes |
| Euphoric | `/euphoric/artistas` Artistas · `/euphoric/ajustes` Ajustes |
| Mixmag | `/mixmag/analitica` Analítica · `/mixmag/ajustes` Ajustes |
| TAGMAG | `/tagmag/analitica` Analítica · `/tagmag/ajustes` Ajustes |
| Producción | `/produccion/ajustes` Ajustes |
| CRUDA | `/cruda/analitica` Analítica |
| CRM | `/crm/kpis` Analítica |
| Team | `/personal/analitica` Analítica |
| Etra · Creativos · Herramientas · Configuración | ninguno |

Envoltorio idéntico en los 14:
`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-800`,
SVG de **16×16** con `stroke-width="1.8"` y `class="shrink-0"`. **Sin estado activo**: solo hover.

Los tres iconos, por su trazado (los SVG están en `icon-actions.json`):
- **Ajustes** = engranaje de lucide `Settings`, exacto.
- **Analítica** = ejes `M3 3v18h18` + tres `<rect>` de altura creciente (no es `BarChart3` de lucide, que usa `<path>`).
- **Artistas** = `<circle cx=12 cy=8 r=4>` + `M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1` (más ancho que `User` de lucide).
- **Incidencias** = triángulo de aviso, equivalente a `AlertTriangle` de lucide.

Nosotros solo tenemos `iconActions` en `CrudaShell` (1) y `EuphoricShell` (2), **los pintamos en el grupo
derecho** de la cabecera en vez de dentro del nav, el icono va a `h-5 w-5` (20 px) y les damos estado
activo `bg-slate-100 text-slate-800` que el live no tiene (`TopNav.tsx:114-128`).

→ Cubierto por el mismo par spec/plan que el TopNav (§2.1): es la misma cabecera.

### 2.4 `/perfil` — pantalla nueva completa

No existe en nuestro router. Crumb en `Espacios`, sin nav de módulo, Ayuda genérica. Dos tarjetas:

1. **Mi perfil** — «Tu avatar y los datos de tu cuenta.» Avatar grande con la inicial, nombre, email,
   botones `Editar perfil` y `Cambiar contraseña`; bloque `IDIOMA · LANGUAGE` con dos opciones
   (`🇪🇸 Español` / `🇬🇧 English`) y la nota «Se aplica pantalla a pantalla según vamos traduciendo la
   intranet.»; botón `Cerrar sesión`.
2. **Mis sesiones** — «Dónde tienes la cuenta abierta ahora mismo.» Botón `Cerrar las demás` y una lista
   larga de sesiones `Chrome · Linux` / `Chrome · Mac` / `Chrome · Windows` / `Chrome · iPhone/iPad`
   con IP, estado `activa`, y `Cerrar` por fila; la actual marcada `Este dispositivo` y sin botón.

Es el destino del bloque de usuario del TopNav, así que va emparejada con §2.1.

→ **Spec:** `docs/superpowers/specs/2026-07-30-perfil-y-sesiones-design.md`
→ **Plan:** `docs/superpowers/plans/2026-07-30-perfil-y-sesiones.md`

### 2.5 Tablero de piezas — son la misma pantalla (follow-up (b), con dato nuevo)

Encargo resuelto aparte y con detalle en `docs/references/tablero-piezas-2026-07-30/README.md`.
Resumen: **normalizando solo el H1 y solo la bajada, los dos `main` quedan byte-idénticos**
(20 198 bytes cada uno) y los 7 recortes a `deviceScaleFactor: 4` comparten SHA-256.
La convergencia que quiere Arian está autorizada por la evidencia.

Dato accionable inmediato: `src/features/euphoric/components/StatusChip.tsx` mapea
`'En producción' → 'info'` (`bg-blue-50 text-blue-700`) cuando el live es `bg-sky-100 text-sky-700`,
y `'Cambios' → 'danger'` (`bg-red-50 text-red-700`) cuando el live es `bg-rose-100 text-rose-700`.
Los tonos correctos son los que ya usa Creativos.

→ **Plan:** `docs/superpowers/plans/2026-07-30-tablero-piezas-dry.md` — **lo escribe y ejecuta otra faena**,
no esta. Vive en su propia rama; este barrido solo le aporta la evidencia
(`docs/references/tablero-piezas-2026-07-30/`) y las dos reglas resueltas de §2.5.

---

## 3. Los deltas 🟡: 11 rutas que el live tiene y nosotros no

Todas son pantallas de **analítica o de ajustes de espacio**, colgadas de los iconos de §2.3.
Contenido observado (para dimensionar, no como spec):

| Ruta | `h1` | Qué hay dentro | Talla |
|---|---|---|---|
| `/reporte` | `Analítica` | Dashboard general · Fees por artista (Booking+Management apilados) · Por booker · Comisión generada por booker · Vista por artista | **L** |
| `/artistas` | `Artistas` | Listado de artistas de ConceptOne | M |
| `/management/incidentes` | `Incidentes` | Listado de incidentes de management | M |
| `/conceptone/ajustes` | `Ajustes de ConceptOne` | **El mismo panel que `/configuracion/comisiones`**: Comisiones de bookers, Porcentaje global por defecto, Exclusividad y logística de agenda, % de comisión por booker | **S** (reutiliza) |
| `/produccion/ajustes` | `Ajustes de Producción` | **El mismo panel que `/configuracion/alertas`**: Alertas de producción | **S** (reutiliza) |
| `/mixmag/analitica` | `Mixmag · analítica` | Mes a mes · Ritmo de publicación · Qué se publica · Mejores clientes · Qué se vende · Quién publica · Artistas más publicados | **L** |
| `/tagmag/analitica` | `TAGMAG · analítica` | Los mismos 7 bloques (módulo gemelo parametrizado) | S si sale del de Mixmag |
| `/mixmag/ajustes` | `Mixmag · ajustes` | Pestañas `Tarifas · Packs · Territorios`, tarifario por canal (Web/Redes/Revista) y tipo de pieza | **L** |
| `/tagmag/ajustes` | `TAGMAG · ajustes` | Idéntico en forma, tarifario propio | S si sale del de Mixmag |
| `/crm/kpis` | `KPIs comerciales` | 6 KPI (Ganado, Objetivo, Forecast abierto, Win rate, Ciclo de venta medio, Pipeline abierto) + Ventas ganadas por mes · Por comercial · Por origen de lead | **M** |
| `/personal/analitica` | `Analítica del equipo` | 4 KPI (coste real mes/año, personas activas, coste medio) + Por empresa del grupo · Por departamento | **M** |

Dos de ellas (`/conceptone/ajustes`, `/produccion/ajustes`) **no son pantallas nuevas**: el live
re-expone paneles de Configuración que ya tenemos. Son enrutado, no diseño.
Y `/tagmag/{analitica,ajustes}` sale casi gratis del de Mixmag: ya tenemos el módulo gemelo
parametrizado (`RedaccionShell`).

→ **Spec:** `docs/superpowers/specs/2026-07-30-rutas-analitica-ajustes-design.md`
→ **Plan:** `docs/superpowers/plans/2026-07-30-rutas-analitica-ajustes.md`

---

## 4. Arreglos sueltos (< 30 min cada uno, sin spec)

1. **`MODULES`: intercambiar CRM y CRUDA.** `src/lib/constants.ts`. El desplegable del live pone CRM
   en 8.ª posición y CRUDA en 9.ª; el grid del Home no se mueve porque agrupa por `category`.
2. **`StatusChip` de Euphoric: 2 tonos.** `'En producción' → 'sky'`, `'Cambios' → 'rose'`
   (`src/features/euphoric/components/StatusChip.tsx`). `Badge` ya tiene las dos variantes correctas.
3. ~~**Título de las 11 cajas de permisos: `brand-600` → `text-slate-400`.**~~ **✅ HECHO** — la PR #21 se
   fusionó (`ff094e6`, en `main` desde `2e0ac9a`). Verificado en el código fusionado:
   `src/features/team/usuarios/components/CajasPermisos.tsx:19` usa
   `mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400`, el grid es
   `grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` y la caja
   `rounded-lg border border-slate-200 bg-slate-50/50 p-3` — los tres exactos.
   Y el aviso se respetó: los `checkbox` **mantienen** `text-brand-600 focus:ring-brand-500` (línea 32).
   Evidencia: `docs/references/config-usuarios/2026-07-30-cajas-permisos-live.md`.
4. **La fila de secciones de ConceptOne no debe ser sticky.** En el live vive **fuera** del `<header>`,
   en `div.hidden border-b border-slate-200 bg-slate-50/70 md:block` con un interior
   `mx-auto flex w-full max-w-7xl items-center gap-1 overflow-x-auto px-4 py-1.5`; nosotros la metemos
   dentro del header con `border-t` y sin fondo, así que se queda pegada al hacer scroll
   (`TopNav.tsx:145-176`). Además la pastilla activa del live es `rounded-md px-3 py-1 bg-brand-600
   text-white` con `aria-current="page"` e inactivo `text-slate-600 hover:bg-slate-200/70`; nosotros
   usamos `rounded-lg px-3 py-1.5`, `bg-[#44444C]` **hardcodeado** en vez del token `bg-brand-600`, y
   `hover:bg-slate-100 hover:text-slate-900`. Falta también `shrink-0` en los ítems.
5. **`PieceCard`: 5 detalles** (4 de clases + 1 funcional). Falta el caso `Sin asignar` (en el live es un
   `span.shrink-0 text-[11px] text-slate-300`, no una pastilla); la fila de asignado es `gap-2` sin
   `justify-between`; la fila de badges es `mt-1.5 flex flex-wrap items-center gap-1`; el avatar del
   live es un `<img>` de 20×20, no una inicial. **Y falta el badge de aprobación de cliente**
   (`badge text-[10px] bg-amber-100 text-amber-700`, texto `Pendiente cliente`, tras el deadline):
   ahí manda Euphoric, no Creativos. Detalle de §2.5 y en
   `tablero-piezas-2026-07-30/README.md`.
7. **`PieceBoard` de Euphoric: quitar la derivación del icono.** Euphoric lo deduce de `type === 'Video'`
   y eso es falso en el live: `Flyer Claptone 02/08` es tipo `Vídeo` y **no** lleva icono, mientras
   `Video Pomo 26/07` sí. Es un campo libre por pieza, como ya lo modela Creativos. En el live va dentro
   de la fila de asignado, `span.ml-auto shrink-0 text-xs` con `title`, a la derecha de la pastilla.
6. **Badge de deadline: el ámbar es `text-amber-800`, no `700`.** El live usa cuatro tonos —
   `rose-100/rose-700`, `amber-100/**amber-800**`, `emerald-100/emerald-700`, `slate-100/slate-500` —
   con `rounded px-1.5 py-0.5 font-semibold`, a `text-[11px]` en el kanban y `text-xs` en la tabla.

**No es un problema transversal de color.** Contra la sospecha de que estuviéramos tiñendo de
`brand-600` títulos que en el live son grises: barridas las 40 combinaciones de `uppercase tracking` en
`src/`, 21 ya son `text-slate-400` y solo hay 4 excepciones, de las cuales las dos de booking
(`text-rose-700` en «Fichas a revisar», `text-violet-700` en «Posibles gigs») las he **verificado
correctas** contra el live: usa exactamente `text-sm font-semibold uppercase tracking-wide text-rose-700`
dentro de `mb-6 rounded-xl border border-rose-200 bg-rose-50/50`. El caso `brand-600` era aislado de la
PR #21. **No hace falta spec transversal de color** (queda como arreglo suelto nº 3).

---

## 5. Prioridad recomendada

| # | Trabajo | Talla | Por qué en este orden |
|---|---|---|---|
| 1 | **TopNav: módulo activo + logo + iconos de acción + usuario** (§2.1, §2.3) | **M** | Es la única cosa que se ve en **todas** las pantallas. Además desbloquea las 11 rutas de §3, que cuelgan de sus iconos: sin la cabecera, esas rutas no tendrían por dónde entrar. |
| 2 | **Arreglos sueltos 1, 2, 4, 5, 6, 7** | **S** | Seis cambios de pocas líneas con evidencia cerrada. Barato y quita ruido antes de meter pantallas nuevas. El nº 3 ya está **hecho** (PR #21 fusionada). |
| 3 | **Tablero de piezas unificado** (§2.5) | **M** | Ya hay ejecutor esperando y la evidencia es concluyente. Cuanto antes converja, menos deriva acumulan las dos copias. |
| 4 | **Panel de Ayuda contextual** (§2.2) | **L** | El más caro por volumen de copy (20 tarjetas literales), pero es mecánico y aislado: una fuente de datos + un componente. Lo pongo después de la cabecera porque no bloquea a nadie. |
| 5 | **11 rutas de analítica y ajustes** (§3) | **L** | El grueso en pantallas nuevas, pero divisible: `/conceptone/ajustes` y `/produccion/ajustes` son re-enrutado (S), `/tagmag/*` sale del gemelo de Mixmag, y los 3 grandes (`/reporte`, `/mixmag/analitica`, `/mixmag/ajustes`) admiten un agente cada uno. |
| 6 | **`/perfil` + Mis sesiones** (§2.4) | **M** | Pantalla nueva y aislada; sin dependencias más allá del enlace del TopNav (nº 1). Es lo que menos duele dejar para el final. |

**Sugerencia de reparto:** 1 y 2 en la misma rama (misma cabecera, mismos ficheros: pelearse por
`TopNav.tsx` en dos ramas es garantía de conflicto). 3 en su rama, ya asignada. 4, 5 y 6 son
independientes entre sí y admiten un agente cada una.

---

## 6. Lo que NO he hecho, y por qué

- **No he abierto ningún formulario ni guardado nada** en el live: la regla es solo-lectura. Existen y
  están documentados los flujos de escritura que aparecen (`+ Nueva creatividad`, `+ Nueva organización`,
  `+ Tarifa`, `Editar perfil`, `Cerrar sesión`, `Cerrar las demás`), pero no los he ejecutado.
- **No he comparado los detalles internos** de las 11 rutas de §3 contra un diseño nuestro, porque no
  existe: son pantallas nuevas. Lo que hay en §3 es inventario para dimensionar, y el spec pide
  re-capturar cada una en el momento de implementarla, porque el live mueve cifras a diario.
- **No he verificado `brand-200`, `brand-300` ni `brand-900`**: el live no compila esas clases porque no
  las usa, así que no hay nada que medir. Siguen siendo interpolación.
- **No he tocado `src/`.** Este barrido solo añade ficheros bajo `docs/`.
