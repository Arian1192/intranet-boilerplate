# Panel de Ayuda contextual · Design

**Rama sugerida:** `feature/ayuda-contextual` (base `main`, `4578550`) · **PR:** una sola al cierre.
**Ficheros:** `src/components/layout/HelpPanel.tsx`, `src/components/layout/AppLayout.tsx`,
y un módulo de datos nuevo `src/components/layout/help-tips.ts`.
**Evidencia:** `docs/references/barrido-2026-07-30/` —
`ayuda-contextual-inventario.json` (los 81 conjuntos ruta→contenido),
`ayuda-{team-contextual,mixmag-campanas-3tips,generico}.{png,html,json}`.
**Informe de origen:** `docs/coordination/2026-07-30-barrido-informe.md` §2.2.

## 1. Por qué

Nuestro `HelpPanel` pinta **siempre** el mismo texto genérico. El del live es **contextual**: cambia de
contenido según la pantalla, con **14 conjuntos distintos y 20 tarjetas de consejo** sobre 81 rutas
inspeccionadas. Es un delta transversal: se ve en todas las pantallas y hoy estamos enseñando un
placeholder donde el live enseña documentación de producto.

Confirmado por **dos evidencias independientes**: el barrido directo de los 81 conjuntos, y —de rebote—
que al comparar `/creativos` con `/euphoric/piezas` el único recorte que salía distinto era el que tenía
el panel de Ayuda encima.

## 2. Alcance

### D1 — El emparejamiento: prefijo de ruta, con override por pantalla

El live resuelve el contenido **por prefijo de ruta**, y admite **override exacto** para pantallas
concretas. Ejemplo comprobado: `/mixmag` da el consejo de la tuerca, pero `/mixmag/contenidos` y
`/mixmag/campanas` tienen los suyos propios; `/mixmag/revistas`, `/mixmag/analitica` y `/mixmag/ajustes`
heredan el del prefijo.

Regla de resolución: **la coincidencia exacta gana; si no hay, el prefijo más largo; si no hay, el
genérico.**

Comprobado también que el contenido **sobrevive al catch-all**: en `/personal/ajustes` (ruta inexistente,
que renderiza el Home) el panel sigue mostrando el consejo de Team. Es decir: se resuelve por `pathname`,
no por el componente montado. Esto **simplifica** la implementación: no hace falta que cada página declare
su ayuda, basta una tabla ruta→contenido leída con `useLocation()`.

### D2 — Los 14 conjuntos, literales

**Cabecera del panel = el nombre del módulo** (o `Ayuda` en el genérico).

| # | Cabecera | Rutas | Tarjetas |
|---|---|---|---|
| 1 | `ConceptOne` | `/conceptone` (prefijo) | **El panel de atención no es una lista de tareas** — «Es lo que está en riesgo por fecha: cuanto más cerca el show, más arriba. Si algo no debería estar ahí, es que le falta un dato al show.» |
| 2 | `ConceptOne` | `/shows` (exacta) | **El fee va en la moneda del deal** — «Si el acuerdo es en dólares, se guarda en dólares y se convierte con el tipo de cambio del show. Meter el equivalente en euros a mano hace que la liquidación no cuadre.»<br>**Cerrar gastos es lo que congela la liquidación** — «Mientras no cierres gastos, la cifra sigue moviéndose. Ciérralos cuando el show haya pasado y tengas todas las facturas.» |
| 3 | `Producción` | `/produccion` (prefijo) | **Los módulos se activan por evento** — «Un evento no tiene por qué tener catering, ni backline, ni patrocinios. Activa solo lo que aplique: los módulos apagados no te piden datos ni te generan alertas.» |
| 4 | `Euphoric Media` | `/euphoric` (prefijo) | **El arte se pide a Creativos** — «Desde la pieza, «Pedir arte» crea el encargo en el tablero de Creativos. Pedirlo por mensaje privado hace que el diseñador no lo tenga en su cola.» |
| 5 | `Mixmag` | `/mixmag` (prefijo) | **Tarifas y packs viven en la tuerca** — «El tarifario, los productos y los packs de Mixmag están en la Configuración de este espacio (icono de tuerca), no en la configuración general.» |
| 6 | `Mixmag` | `/mixmag/contenidos` (exacta) | **Panel para leer, kanban para arrastrar** — «El panel separa Redes, Web y Revista —tres equipos distintos— y las cajas de estado filtran al pulsarlas. El kanban es para mover piezas de fase.»<br>**Web y revista se escriben a folio completo** — «Al abrir un artículo entras en el editor a página completa. Los posts de redes abren en un cajón lateral, que es lo que necesita un copy de dos líneas.» |
| 7 | `Mixmag` | `/mixmag/campanas` (exacta) | **La campaña ES el presupuesto** — «Añade líneas de tarifa y el importe se calcula solo. Luego pulsa «Generar contenidos» y las piezas pactadas nacen ya enlazadas: no las crees a mano.»<br>**Vendida ≠ publicada** — ««Sale desde» es cuándo se publica. La analítica cuenta la venta el día que aceptas la campaña, que es cuando de verdad ocurrió.»<br>**Los packs se despliegan** — «Un pack entra como sus líneas, con el descuento repartido. La suma cuadra al céntimo con el precio del pack: si no cuadra, es un fallo, repórtalo.» |
| 8 | `TAGMAG` | `/tagmag` (prefijo) | **Tarifas y packs viven en la tuerca** — «El tarifario y los packs de TAGMAG están en la Configuración de este espacio. Son suyos: no los comparte con Mixmag.» |
| 9 | `TAGMAG` | `/tagmag/contenidos` (exacta) | **«Pendiente de revisión» es del robot** — «Ahí caen las noticias que trae la ingesta, con su puntuación. Lo primero que se decide no es cómo escribirla, sino si merece la pena: por eso «Aprobado» va antes que «Borrador».» |
| 10 | `Creativos` | `/creativos` (prefijo) | **Tu cola son los encargos, no los mensajes** — «Todo lo que hay aquí viene de una pieza o una campaña de algún espacio. Si te piden algo por otro canal, pide que lo abran aquí: si no, no existe.» |
| 11 | `CRUDA` | `/cruda` (prefijo) | **El stock se descuenta al confirmar el pedido** — «No al crearlo. Un pedido en borrador no reserva nada, así que dos comerciales pueden vender la misma última unidad: confírmalo cuanto antes.» |
| 12 | `CRM` | `/crm` (prefijo) | **Una empresa, una ficha** — «Si el mismo cliente compra en CRUDA y en Euphoric, es la misma organización con dos oportunidades. Duplicar la ficha es cómo se pierde el histórico.» |
| 13 | `Team` | `/personal` (prefijo) | **Los accesos se dan desde la ficha** — «Crear la persona y darle acceso son dos cosas: una persona puede estar en el directorio sin cuenta. Los permisos se editan en su ficha, no en una lista aparte.» |
| 14 | `Mi trabajo` | `/mi-trabajo` (prefijo) | **Páginas dentro de páginas** — «No hay carpetas: un documento puede contener otros. Pulsa el «+» sobre un documento de la lista para crear uno dentro.»<br>**Enlazar otro documento** — «Escribe «@» dentro del texto y busca por título. Enlaza al documento, no a una URL que mañana no exista.»<br>**El asistente lee lo que selecciones** — «Selecciona un trozo de texto y aparece el botón del asistente en la barra flotante: trabaja sobre esa selección, no sobre todo el documento.» |
| — | `Ayuda` | **el resto** | genérico: «Pregunta lo que quieras de esta pantalla, o cuenta qué está fallando.» |

**El genérico cubre 31 rutas**, y hay que respetarlo tal cual: Home (`/`), **todo** `/etra`, **todo**
`/configuracion`, `/herramientas`, `/incidencias`, `/perfil`, y las secciones de ConceptOne que **no** son
el dashboard ni `/shows` (`/ofertas`, `/cobros`, `/gastos`, `/disponibilidad`, `/calendario-c1`,
`/contactos`, `/artistas`, `/management/estrategias`, `/management/incidentes`, `/reporte`).

⚠️ **Ojo con ConceptOne:** su prefijo de ayuda es `/conceptone`, **no** «el módulo ConceptOne». Las
secciones de Bookings viven en rutas planas (`/shows`, `/ofertas`…) que **no** empiezan por `/conceptone`,
así que caen al genérico — excepto `/shows`, que tiene override propio. No «arreglar» esto: es lo que hace
el live.

⚠️ **Mixmag y TAGMAG no comparten el consejo de la tuerca.** Mismo título, **cuerpo distinto** (el de
TAGMAG añade «Son suyos: no los comparte con Mixmag»). Son dos entradas, no una parametrizada.

⚠️ **Y la asimetría entre los gemelos va más allá:** `/mixmag/campanas` tiene consejo propio (3 tarjetas)
pero `/tagmag/campanas` **no** — hereda el prefijo. `/mixmag/contenidos` y `/tagmag/contenidos` **sí**
tienen los dos el suyo, y distintos entre ellos. Mixmag y TAGMAG son gemelos en código
(`RedaccionShell`) pero **no** en ayuda. No simetrizar: es lo que hace el live.

**Entradas con `exact: true`: cuatro, y solo cuatro** — `/shows`, `/mixmag/contenidos`,
`/mixmag/campanas`, `/tagmag/contenidos`. Las otras diez son prefijos.

### D3 — La carcasa del panel

Marcado literal del live (de `ayuda-team-contextual.html`):

```html
<div class="fixed bottom-4 left-4 z-40 flex max-h-[70vh] w-[22rem] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
  <div class="flex shrink-0 items-center justify-between border-b border-slate-100 px-3 py-2">
    <div class="flex items-center gap-2">
      <span class="flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white">?</span>
      <span class="text-xs font-semibold text-slate-700">Team</span>
    </div>
    <div class="flex items-center gap-1">
      <button class="rounded p-1 text-slate-300 transition hover:bg-slate-100 hover:text-slate-600" title="Plegar (se queda plegado mientras navegas)">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path>
        </svg>
      </button>
    </div>
  </div>
  <div class="min-h-0 flex-1 overflow-y-auto px-3 py-2.5">
    <div class="space-y-2.5">
      <div>
        <p class="text-xs font-medium text-slate-700">Los accesos se dan desde la ficha</p>
        <p class="mt-0.5 text-xs leading-relaxed text-slate-500">Crear la persona y darle acceso…</p>
      </div>
      <!-- una <div> por tarjeta -->
    </div>
  </div>
  <div class="shrink-0 border-t border-slate-100 p-2">
    <div class="flex items-end gap-1.5">
      <textarea rows="1" placeholder="Pregunta o cuenta qué falla…" class="max-h-24 min-h-[34px] flex-1 resize-none rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs outline-none transition focus:border-slate-400"></textarea>
      <button disabled class="h-[34px] shrink-0 rounded-lg bg-slate-800 px-2.5 text-xs font-medium text-white transition hover:bg-slate-900 disabled:opacity-30">Enviar</button>
    </div>
    <div class="mt-1.5 flex items-center justify-between px-0.5">
      <button class="text-[11px] text-slate-400 transition hover:text-slate-700">Reportar con captura</button>
      <a class="text-[11px] text-slate-400 transition hover:text-slate-700" href="/incidencias">Mis avisos</a>
    </div>
  </div>
</div>
```

En el **genérico**, el cuerpo cambia: en vez de las tarjetas hay un solo párrafo
`<p class="py-1 text-xs text-slate-400">Pregunta lo que quieras de esta pantalla, o cuenta qué está fallando.</p>`.

Diferencias contra `HelpPanel.tsx`:

| | Live | Nosotros |
|---|---|---|
| Contenedor | `z-40 flex max-h-[70vh] flex-col overflow-hidden … shadow-xl`, **sin padding** | `z-30 p-4 shadow-lg`, sin `max-h` ni `flex-col` |
| Estructura | 3 zonas (`border-b` / scroll / `border-t`) | una caja |
| Icono | `span` de 4×4, `rounded-full bg-slate-800 text-[10px] font-bold text-white`, con `?` | `<HelpCircle className="h-4 w-4 text-slate-500">` |
| Título | módulo · `text-xs font-semibold text-slate-700` | `Ayuda` · `text-sm font-semibold text-slate-800` |
| Copy genérico | `py-1 text-xs text-slate-400` | `text-sm text-slate-500` |
| Entrada | `<textarea rows="1">` autoexpandible hasta `max-h-24` | `<input type="text">`, `px-3 py-2 text-sm` |
| Enviar | `h-[34px] px-2.5 text-xs`, **`disabled` de inicio** | `px-3 py-2 text-sm`, nunca deshabilitado |
| Pie | `text-[11px] … hover:text-slate-700`, en un bloque `border-t p-2` | `text-xs … hover:text-slate-600`, `mt-3` |
| Cerrar | X en SVG propio, `text-slate-300`, `title="Plegar (se queda plegado mientras navegas)"` | `<X>` de lucide, `text-slate-400`, `aria-label="Cerrar ayuda"` |
| Persistencia del plegado | **sobrevive a la navegación** | `useState(true)` se reinicia al montar |

Se adoptan **todos** los valores del live. Dos notas:

- El **icono `?`** se hace con un `<span>`, no con lucide: el live no usa `HelpCircle` y el círculo
  relleno oscuro es visualmente distinto. Se pierde una dependencia de lucide en este componente.
- El **botón de cerrar** conserva un `aria-label` accesible además del `title` (el live solo pone `title`;
  añadir `aria-label="Plegar ayuda"` es una mejora de accesibilidad que no altera nada visible).

### D4 — El plegado persiste entre pantallas

Verificado: plegué el panel en `/creativos` y al navegar a `/euphoric/piezas` **seguía plegado**. El
`title` del botón lo dice explícitamente: «se queda plegado mientras navegas».

Nuestro `useState(true)` se reinicia en cada montaje. Como `HelpPanel` vive en `AppLayout`, que se remonta
al cambiar de shell, hoy el panel **se reabre solo**.

Se implementa con `sessionStorage` (clave `help-panel-collapsed`), no con `localStorage`: «mientras
navegas» describe la sesión, no para siempre. Estado inicial: **desplegado**.

### D5 — El botón Enviar arranca deshabilitado

En el live el `<button>Enviar` tiene el atributo `disabled` con el `textarea` vacío, y la clase
`disabled:opacity-30`. Se implementa: `disabled={!texto.trim()}`.

## 3. Qué NO entra

- **El envío real.** El panel sigue siendo inerte, como hoy: `Enviar` no manda nada. El flujo de
  `ReportDialog` («Reportar con captura») **ya existe y no se toca**.
- **El asistente de IA.** El live insinúa un asistente detrás del textarea; no hay evidencia de su
  comportamiento y no se implementa.
- **Tocar `TopNav.tsx`.** Esta rama no lo necesita. Si se cruza, es un error de alcance.
- **Añadir ayuda a rutas que no existen todavía** (`/reporte`, `/crm/kpis`, `/personal/analitica`…). Las
  que caen bajo un prefijo ya cubierto (`/crm/kpis` → `/crm`, `/personal/analitica` → `/personal`) la
  heredan **gratis**; las de rutas planas de ConceptOne caen al genérico, que es lo que hace el live.
- **Traducir ni reescribir el copy.** Los 20 textos van **literales**, con sus comillas angulares `«»`,
  su `≠` y sus tildes. Son la evidencia.

## 4. Decisiones de diseño

- **DD1 — Tabla ruta→contenido, no prop por página.** El live resuelve por `pathname` (probado: funciona
  incluso en rutas inexistentes). Una tabla en `help-tips.ts` + `useLocation()` es más simple que hacer
  que 40 páginas declaren su ayuda, y no obliga a tocar ni una página.
- **DD2 — La resolución es «exacta > prefijo más largo > genérico».** Cubre los tres overrides observados
  (`/shows`, `/mixmag/contenidos`, `/mixmag/campanas`) sin casos especiales.
- **DD3 — `sessionStorage`, no `localStorage`.** «Mientras navegas» = la sesión.
- **DD4 — El copy es datos, no JSX.** Los 14 conjuntos van en `help-tips.ts` como estructura de datos,
  para que el test pueda recorrerlos y para que añadir un consejo no toque el componente.
- **DD5 — Mixmag y TAGMAG son dos entradas.** Aunque comparten el título del consejo, el cuerpo difiere.
  No parametrizar.

## 5. Riesgos

- **Volumen de copy.** Son 20 textos largos con puntuación tipográfica. El riesgo real es una errata
  silenciosa. Mitigación: el test recorre `help-tips.ts` y compara **longitudes y textos exactos** contra
  los del spec, y `ayuda-contextual-inventario.json` es la fuente de verdad si hay duda.
- **`AppLayout` se remonta al cambiar de shell.** Si el estado de plegado se pusiera en `useState` sin
  persistencia, el bug de D4 seguiría ahí y el test podría no detectarlo (dentro de un mismo test el
  componente no se remonta). El test de D4 debe **desmontar y volver a montar** explícitamente.
- **Los prefijos se solapan.** `/personal` y `/personal/usuarios`; `/mixmag` y `/mixmag/contenidos`. La
  regla del prefijo más largo lo resuelve, pero hay que **testear los solapes**, no solo los casos
  felices.
