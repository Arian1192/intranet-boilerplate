# `/creativos` vs `/euphoric/piezas` en el live — 2026-07-30

**Capturado:** 2026-07-30, ~09:5x CEST · viewport 1440×1100 · Playwright/Chromium
**Encargo:** decidir si hoy siguen siendo la misma pantalla, para autorizar (o tumbar) la convergencia.

## RESPUESTA: SÍ. Son la misma pantalla, y el H1 + la bajada son lo ÚNICO que difiere.

Tres medidas independientes, todas concluyentes:

### 1. Diff byte a byte del `main` completo

| | bytes |
|---|---|
| `/creativos` → `live-creativos-main.html` | 20 289 |
| `/euphoric/piezas` → `live-euphoric-piezas-main.html` | 20 263 |
| diferencia | **−26** |

Sustituyendo **solo** el H1 y **solo** la bajada por un marcador en cada fichero, los dos
documentos quedan **byte-idénticos**: 20 198 bytes cada uno, cero hunks de diferencia.
No hay un solo atributo, clase, orden de nodo ni dato distinto más allá de esas dos cadenas.
(Los −26 bytes son exactamente la diferencia de longitud de esos dos textos.)

### 2. Comparación estructurada por ejes (`comparacion-resultado.json`)

| Eje | Resultado |
|---|---|
| H1 (texto) | **DISTINTO** |
| H1 (clase) | IGUAL — `text-2xl font-semibold text-slate-800` |
| Bajada (texto) | **DISTINTO** |
| Bajada (clase) | IGUAL — `text-sm text-slate-500` |
| Botones de acción | IGUAL |
| 4 stats (texto y clases) | IGUAL |
| 14 chips (texto y clases) | IGUAL |
| Pastillas de estado (texto y clases) | IGUAL |
| Cabeceras de tabla (texto y clases) | IGUAL |
| 5 columnas del kanban | IGUAL |
| Texto plano completo, normalizando H1/bajada | **IDÉNTICO** |

Los dos textos que difieren:

| | `/creativos` | `/euphoric/piezas` |
|---|---|---|
| H1 | `Creativos` | `Creatividades` |
| Bajada | `Tablero de creatividades del equipo de diseño: Euphoric, clientes del CRM y empresas internas.` | `Content creation: seguimiento de artes por estado de producción.` |

### 3. Recortes a `deviceScaleFactor: 4`, comparados por SHA-256

Siete recortes de los mismos elementos en las dos rutas, **todos byte-idénticos**:

| Recorte | SHA-256 (16) | ¿Igual? |
|---|---|---|
| `tabla-cabeceras-4x` | `94b6d9eba32bef1d` | IDÉNTICO |
| `tabla-fila1-4x` | `95dedbf65a745ef8` | IDÉNTICO |
| `badge-briefing-4x` | `ff45a848cd9ff050` | IDÉNTICO |
| `badge-revision-4x` | `103b466cdf74ad71` | IDÉNTICO |
| `badge-en-produccion-4x` | `66243f0a1314123c` | IDÉNTICO |
| `chips-4x` | `cabfaaf524990550` | IDÉNTICO |
| `kanban-card-4x` | `34bea8830fb88d1b` | IDÉNTICO |

> **Nota de método:** el primer intento de `tabla-cabeceras-4x` salió DISTINTO. No era la tabla:
> el panel de Ayuda (`fixed bottom-4 left-4`) se colaba en el recorte, y ese panel **sí** difiere
> porque es contextual por módulo (ver el informe del barrido). Repetido con el panel plegado,
> el recorte es idéntico. Se deja anotado para que nadie reabra el caso con el PNG viejo.

---

## Los 3 ejes pedidos — valores buenos del live

### Eje 1 · Chips de filtro

Dos familias distintas, no una:

**a) Chips de filtro de estado** (`Todas`, `Mías`, `Diseño`, `Vídeo`, `Pend. aprobar`, `Correcciones`, `Atrasadas`):

| Estado | Clase | Computado |
|---|---|---|
| **Activo** | `rounded-full px-3 py-1 text-xs font-medium bg-brand-600 text-white` | color `rgb(255,255,255)` · bg `rgb(68,68,76)` = `#44444C` · radio `9999px` · 12 px / 500 |
| **Inactivo** | `rounded-full px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200` | color `rgb(71,85,105)` = `#475569` · bg `rgb(241,245,249)` = `#F1F5F9` |

Sin borde en ninguno de los dos (`border-width: 0`). El activo en la captura es `Todas`.

**b) Chips de «Asignar a»** (`+ Alba`, `+ Carlos`, `+ Maf`) — otra cosa, con borde y sin relleno:

```
rounded-full border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600
hover:border-brand-400 hover:text-brand-600
```
color `rgb(71,85,105)` · bg transparente · borde `1px rgb(203,213,225)` = `slate-300`.

**c) Conmutador Tablero/Calendario** — tercera familia, `rounded-md` no `rounded-full`:

| | Clase |
|---|---|
| Activo (`Tablero`) | `rounded-md px-3 py-1 text-xs font-medium bg-white text-slate-800 shadow-sm` |
| Inactivo (`Calendario`) | `rounded-md px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-700` |

**d) `+ Nueva creatividad`** — `btn-primary text-sm`, que en el CSS del live resuelve a
`inline-flex items-center justify-center gap-.5rem; border-radius:.5rem; padding:.5rem 1rem;
font-size:.875rem; font-weight:500` con `bg` computado `rgb(68,68,76)` = `brand-600`.

### Eje 2 · Pastillas de estado — RESPUESTA EXACTA

Todas usan la clase de componente `.badge` del live, que resuelve a:
```css
.badge { display:inline-flex; align-items:center; border-radius:9999px;
         padding:.125rem .625rem; font-size:.75rem; line-height:1rem; font-weight:500 }
```

| Estado | Clase de tono | Texto | Fondo |
|---|---|---|---|
| `Briefing` | `bg-slate-100 text-slate-600` | `rgb(71,85,105)` `#475569` | `rgb(241,245,249)` `#F1F5F9` |
| **`En producción`** | **`bg-sky-100 text-sky-700`** | **`rgb(3,105,161)` `#0369A1`** | **`rgb(224,242,254)` `#E0F2FE`** |
| **`Revisión`** | **`bg-amber-100 text-amber-700`** | **`rgb(180,83,9)` `#B45309`** | **`rgb(254,243,199)` `#FEF3C7`** |
| `Cambios` | `bg-rose-100 text-rose-700` | `rgb(190,18,60)` `#BE123C` | `rgb(255,228,230)` `#FFE4E6` |
| `Aprobado` | `bg-emerald-100 text-emerald-700` | `rgb(4,120,87)` `#047857` | `rgb(209,250,229)` `#D1FAE5` |
| `Pendiente cliente` (extra, en tarjeta) | `badge text-[10px] bg-amber-100 text-amber-700` | igual que Revisión, a 10 px | idem |

Los tres que se pedían están **doblemente medidos**: `getComputedStyle` arriba y muestreo PIL de los
PNG a 4× (`badge-*-4x.png`), y coinciden al valor exacto:
`Briefing` fondo `#F1F5F9` / texto `#475569` · `Revisión` `#FEF3C7` / `#B45309` ·
`En producción` `#E0F2FE` / `#0369A1`.

> **Cabecera de columna del kanban:** es la misma `.badge` con el mismo tono que el estado, dentro de
> `div.mb-2 flex items-center justify-between px-1`, con el contador en
> `span.rounded-full bg-slate-100 px-2 text-xs text-slate-500`.

### Eje 3 · Tarjeta del kanban

**Elemento: `<button draggable="true">`** (no un `div`, no un `article`), ancho renderizado 224 px.

```html
<button draggable="true" class="block w-full rounded-lg border border-slate-200 bg-white p-2.5 text-left hover:border-brand-300 hover:shadow-sm">
  <div class="flex items-center gap-2"> … asignado … </div>
  <div class="mt-1 truncate text-sm font-medium text-slate-800">Flyer SIGHT: …</div>
  <div class="mt-0.5 truncate text-xs text-slate-400">SIGHT · Estático · v1</div>
  <div class="mt-1.5 flex flex-wrap items-center gap-1"> … deadline + badges … </div>
</button>
```

| Propiedad | Valor computado |
|---|---|
| `border` | `1px solid rgb(226,232,240)` = `slate-200` |
| `border-radius` | `8px` (`rounded-lg`) |
| `padding` | `10px` (`p-2.5`) |
| `box-shadow` | **`none`** en reposo; la sombra es solo `hover:shadow-sm` |
| `background` | `rgb(255,255,255)` |
| `cursor` | `pointer` · `text-align: left` |
| hover | `hover:border-brand-300 hover:shadow-sm` |

**Fila de asignado — dos variantes, no una:**

- Con persona: pastilla con **avatar de imagen real**
  `span.flex shrink-0 items-center gap-1 rounded-full bg-slate-100 py-0.5 pl-0.5 pr-2`
  con `<img class="shrink-0 rounded-full object-cover" style="width:20px;height:20px">` + nombre en
  `span.text-[11px] font-medium text-slate-600`.
- Sin persona: **no hay pastilla**, solo `span.shrink-0 text-[11px] text-slate-300` con `Sin asignar`.

**Badge de deadline** (dentro de la tarjeta, `text-[11px]`; en la tabla el mismo con `text-xs`):
`rounded px-1.5 py-0.5 text-[11px] font-semibold` + uno de estos cuatro tonos:

| Tono | Clase | Cuándo (inferido de los datos) |
|---|---|---|
| Rojo | `bg-rose-100 text-rose-700` | vencido |
| Ámbar | `bg-amber-100 text-amber-800` ← **800, no 700** | próximo |
| Verde | `bg-emerald-100 text-emerald-700` | con holgura |
| Gris | `bg-slate-100 text-slate-500` | sin urgencia |

Extra opcional en la misma fila: contador de checklist `span.text-[10px] text-slate-500` → `☑ 0/3`.

---

## Deltas contra NUESTRO código (para quien vaya a converger)

Los tonos de estado del live son los de **`src/features/creativos`**; los de
**`src/features/euphoric/components/StatusChip.tsx`** están mal en dos casos:

| Estado | Nuestro `StatusChip` → variante de `Badge` | Resuelve a | Live | ¿OK? |
|---|---|---|---|---|
| `Briefing` | `neutral` | `bg-slate-100 text-slate-600` | igual | ✅ |
| `En producción` | `info` | **`bg-blue-50 text-blue-700`** | `bg-sky-100 text-sky-700` | ❌ |
| `Revisión` | `amber` | `bg-amber-100 text-amber-700` | igual | ✅ |
| `Cambios` | `danger` | **`bg-red-50 text-red-700`** | `bg-rose-100 text-rose-700` | ❌ |
| `Aprobado` | `emerald` | `bg-emerald-100 text-emerald-700` | igual | ✅ |

Arreglo: en `StatusChip`, `'En producción' → 'sky'` y `'Cambios' → 'rose'`.
(`Badge` ya tiene ambas variantes con los tonos exactos del live, no hay que tocar `Badge`.)

Nuestra `.badge` (`Badge` variante `md`) es `inline-flex items-center rounded-full font-medium
px-2.5 py-0.5 text-xs` → **coincide exactamente** con la `.badge` del live. No tocar.

Nuestro `PieceCard` (Creativos) ya clava el contenedor del `<button>` al live
(`block w-full rounded-lg border border-slate-200 bg-white p-2.5 text-left hover:border-brand-300 hover:shadow-sm`).
Le quedan **cinco** diferencias — cuatro de clases y una funcional:

| # | Delta | Live | Nuestro `PieceCard` |
|---|---|---|---|
| 1 | Contenedor y fila de asignado | `<button draggable="true">` · fila `flex items-center gap-2` (el icono se empuja con `ml-auto`) | `<button type="button">` · fila `flex items-center justify-between gap-1.5` |
| 2 | Caso **`Sin asignar`** | sin pastilla: `span.shrink-0 text-[11px] text-slate-300` → `rgb(203,213,225)` `#CBD5E1`, 11 px | siempre pastilla |
| 2b | Pastilla con persona | `flex shrink-0 items-center gap-1 rounded-full bg-slate-100 py-0.5 pl-0.5 pr-2` | `inline-flex items-center gap-1.5 …` (falta `shrink-0`) |
| 3 | Avatar | `<img class="shrink-0 rounded-full object-cover" style="width:20px;height:20px">`, `alt` = nombre completo («Alba G») y texto = nombre corto («Alba») | `span.grid h-4 w-4 … rounded-full bg-slate-200 text-[9px] …` con la inicial (16 px) |
| 4 | Fila de badges | `mt-1.5 flex flex-wrap items-center gap-1` | `mt-2 flex items-center gap-2` (falta `flex-wrap`) |
| 5 | **Aprobación de cliente** | **la pinta** (ver abajo) | **no la pinta** ← única diferencia funcional |

Detalle menor sin efecto visual: el live usa `<div>` para título y bajada; nosotros `<p>`.
El `flex-wrap` del punto 4 importa: esa fila puede llevar hasta tres cosas (deadline + aprobación + checklist).

---

## Dos reglas que no se pueden suponer, resueltas contra el live de hoy

### El icono de la tarjeta NO se deriva del tipo

Solo **1 de las 10** tarjetas lleva icono. El marcado es:

```html
<span class="ml-auto shrink-0 text-xs" title="Vídeo">🎬</span>
```

- **Posición:** dentro de la fila de asignado, **después** de la pastilla de la persona, empujado al
  extremo derecho con `ml-auto`. **No** va antes del título.
- **Tamaño:** `text-xs` (12 px). Nosotros usamos `text-[11px] leading-none`.

**Contraejemplo limpio, en la misma captura:** la tarjeta que lo lleva es `Video Pomo 26/07`, con bajada
`SIGHT · Vídeo · v1`. Pero `Flyer Claptone 02/08` tiene la bajada **`SIGHT · Vídeo · v1` también** —
mismo tipo — y **no** lleva icono. Así que aunque el `title` del icono diga «Vídeo», derivarlo de
`type === 'Vídeo'` es **demostrablemente falso**.

→ La regla buena es la de **Creativos** (campo libre por pieza). La derivación de Euphoric hay que quitarla.
→ **Límite honesto:** qué campo dispara realmente el icono **no es observable desde esta pantalla**; solo
consta que **no** es el tipo de la bajada. Modelarlo como dato opcional por pieza y no inventar regla.

### La aprobación de cliente SÍ se pinta en la tarjeta

```html
<span class="badge text-[10px] bg-amber-100 text-amber-700">Pendiente cliente</span>
```

| | Valor |
|---|---|
| Posición | dentro de la fila de badges, **después** del badge de deadline |
| Computado | color `rgb(180,83,9)` `#B45309` · fondo `rgb(254,243,199)` `#FEF3C7` · radio `9999px` · padding `2px 10px` · 10 px / 500 |
| Frecuencia | 2 de las 10 tarjetas |
| Textos observados | **solo uno**: `Pendiente cliente` |
| Caso negativo en la tarjeta | **no pinta nada** (no hay raya) |
| Caso negativo en la tabla | `<span class="text-slate-300">—</span>` en la columna `Cliente aprob.` |
| En la tabla, caso positivo | el mismo badge **sin** `text-[10px]`, o sea a 12 px |

**Es ortogonal al estado, no derivada de él:** aparece en una tarjeta con estado `Briefing` y en otra con
`Cambios`, y **no** aparece en ninguna de las de `Aprobado`. Es un flag propio de la pieza.

→ Es un **hueco de Creativos**, y el primer punto donde la referencia por defecto no manda: aquí manda
**Euphoric**, que sí lo pintaba.

**Resumen de la convergencia: Creativos manda en todo MENOS en la aprobación de cliente.**

## Ficheros

| Fichero | Qué es |
|---|---|
| `live-creativos-main.html` / `live-euphoric-piezas-main.html` | `main.outerHTML` **íntegro**, sin truncar |
| `live-*-full.png` | Pantalla completa de cada ruta |
| `live-*-{chips,badge-*,kanban-card,tabla-cabeceras,tabla-fila1}-4x.png` | Recortes a `deviceScaleFactor: 4` |
| `live-comparativa-raw.json` | Volcado estructurado de las dos pantallas |
| `comparacion-resultado.json` | Resultado eje por eje + los dos textos planos normalizados |
| `kanban-card.json` / `kanban-card.html` | Tarjeta del kanban con `getComputedStyle` |
| `kanban-detalle.json` | Las 10 tarjetas, todas las `.badge`, cabeceras de columna y badges de deadline |
| `clases-componente-live.json` | `.badge`, `.card` y `.btn-primary` resueltos desde el CSS servido por el live |

---

# Addenda — el panel de alta («Nueva creatividad»), abierto por clic

**Capturado:** 2026-07-30, ~10:3x CEST · abierto **por clic** en `+ Nueva creatividad` en las dos rutas.
**Ningún formulario se ha enviado.** Abrir el panel es lectura; `Guardar` no se ha pulsado.

**Por qué esta addenda:** el diff byte a byte del cuerpo de este documento cubría el `main` con el panel de
alta **cerrado** (los aciertos de «Nueva creatividad» en aquel HTML eran el texto del botón y los `title` de
los chips, no un panel abierto). Al converger, `/euphoric/piezas` pasa a usar el drawer de Creativos y se
borra el de Euphoric: había que comprobarlo, no suponerlo.

## RESPUESTA: SÍ. El panel de alta es EL MISMO, y aquí ni el título difiere.

| Medida | Resultado |
|---|---|
| `aside.outerHTML` de `/creativos` | **12 988 bytes** |
| `aside.outerHTML` de `/euphoric/piezas` | **12 988 bytes** |
| Diff **sin normalizar absolutamente nada** | **byte-idénticos**, 0 hunks |
| Recorte a `deviceScaleFactor: 4` (2048×4272) | **mismo SHA-256** `03b25f21f867d5d7…` |

Es un resultado **más fuerte** que el del tablero: allí había que normalizar el H1 y la bajada; aquí los dos
documentos coinciden tal cual, y el título es `Nueva creatividad` en ambos.

→ **La convergencia del drawer está autorizada por la evidencia.** No hay que parametrizar nada: se puede
borrar el `PieceDrawer` de Euphoric y usar el `NuevaPiezaDrawer` de Creativos sin condicionales por módulo.

Ficheros: `live-{creativos,euphoric-piezas}-drawer-alta.html`,
`live-{creativos,euphoric-piezas}-drawer-alta-4x.png`, `-drawer-alta-full.png`, `drawer-alta-raw.json`.

## Carcasa del panel

```html
<aside class="fixed inset-y-0 right-0 w-full flex-col border-l border-slate-200 bg-white shadow-2xl
              sm:inset-y-4 sm:w-[32rem] sm:overflow-hidden sm:rounded-2xl sm:border lg:w-[32rem]
              z-50 sm:right-4 flex">
  <div class="flex items-center justify-between border-b border-slate-100 px-5 py-3">   <!-- cabecera -->
    <div class="flex min-w-0 items-center gap-2">
      <svg class="h-4 w-4 shrink-0 text-slate-400">…</svg>  <!-- icono "imagen": rect + circle + path -->
      <h3 class="truncate text-lg font-semibold text-slate-800">Nueva creatividad</h3>
    </div>
    <button class="text-slate-400 hover:text-slate-700" aria-label="Cerrar">✕</button>
  </div>
  <div class="flex-1 overflow-y-auto px-5 py-4">
    <div class="grid gap-4 sm:grid-cols-2"> … campos … </div>
  </div>
  <div class="flex items-center justify-between gap-2 border-t border-slate-100 px-5 py-3">  <!-- pie -->
    <span></span>
    <div class="flex gap-2">
      <button class="btn-secondary">Cerrar</button>
      <button class="btn-primary">Guardar</button>
    </div>
  </div>
</aside>
```

Computado: `position: fixed` · **512 px** de ancho · alto 1068 px · `top`/`right`/`bottom` = `16px` ·
`border-radius: 16px` · borde `1px solid rgb(226,232,240)` = `slate-200` · `z-index: 50` ·
`padding: 0` (el padding vive en las tres zonas) · `overflow: hidden`.

**Cajón lateral derecho de 3 zonas** (cabecera `border-b` / cuerpo con scroll / pie `border-t`), con una
rejilla de **2 columnas** en `sm:` y los campos anchos en `sm:col-span-2`.

## Los campos, en orden

Secciones, todas `text-xs font-semibold uppercase tracking-wide text-slate-500`:
`Responsable` · `Aprueba` · `Adaptaciones / versiones` · `¿Para quién?` · `Aprobación del cliente` · `Checklist`.

| # | Etiqueta | Control | Detalle |
|---|---|---|---|
| 1 | `Nombre *` | `input` texto `.input` | `placeholder="Ej: Reel lanzamiento v2"`, ancho completo. **El único obligatorio** |
| 2 | *(sección)* `Responsable` | `button` `＋ Asignar` | `inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm text-slate-400 hover:bg-slate-200` |
| 3 | *(sección)* `Aprueba` | `button` `＋ Asignar` | mismas clases |
| 4 | `Tipo` | `select.select w-full` | `Estático · Animado · Vídeo` |
| 5 | `Departamento` | `select.select w-full` | `Diseño · Vídeo · Otro` |
| 6 | `Estado` | `select.select w-full` | `Briefing · En producción · Revisión · Cambios · Aprobado` |
| 7 | `Versión` | `input type="number"` | `min="1"`, **valor por defecto `1`** |
| 8 | `Deadline` | `input type="date"` | el input real va oculto (`absolute inset-0 h-full w-full cursor-pointer opacity-0`) sobre un disparador visible; muestra `dd/mm/aaaa` |
| 9 | `Tamaños / ratios` | 4 `button` toggle | `1:1` · `4:5` · `9:16` · `16:9` — `rounded-lg border px-3 py-1.5 text-sm font-medium disabled:opacity-60`, inactivo `border-slate-300 text-slate-600 hover:bg-slate-50` |
| 10 | *(sección)* `Adaptaciones / versiones` | `button` `＋ Añadir adaptación` | `text-xs font-medium text-brand-600 hover:underline`. Lleva un `title` largo: «Genera de golpe la principal + otras versiones de la misma creatividad (estático/vídeo/animado, «Sold Out 1st Release», etc.). Comparten evento, cuenta y brief; cada una es su propia creatividad con su estado y aprobación.» |
| — | *(sección)* `¿Para quién? · elige solo uno` | — | los tres siguientes son **mutuamente excluyentes** |
| 11 | `Cuenta Euphoric` | `select.select w-full` | `— · Mogli Marbella · Opium Bcn · SIGHT` |
| 12 | `Cliente (CRM)` | `input` texto | `placeholder="Cliente…"` |
| 13 | `Empresa interna` | `select.select w-full` | `— · ConceptOne · CRUDA · Etra Agency · Euphoric Media · Mixmag Spain · TAGMAG` |
| 14 | `Evento` | `input` texto | `placeholder="Buscar o crear evento…"` |
| 15 | `Campaña` | `select.select w-full` | `Sin campaña · Genérico Julio` |
| 16 | `Publicación` | `select.select w-full` | `Sin publicación` + 9 publicaciones con formato `título · YYYY-MM-DD` |
| 17 | `Brief` | editor de texto rico | barra: `B` `i` `U` `S` `•` `1.` `☑` `🔗` `A` `A` `A` `✕`; cada botón `grid h-7 min-w-[28px] place-items-center rounded px-1 text-slate-600 hover:bg-slate-100` |
| 18 | `Enlace al asset` | `input` texto | `placeholder="Drive / Frame.io / Dropbox…"` |
| 19 | `Adjuntos` / `＋ Adjuntar` | `input type="file"` `.hidden` | el `input` va oculto tras la etiqueta-botón |
| 20 | *(sección)* `Aprobación del cliente` | 4 `button` toggle | `Sin enviar` (**activo por defecto**: `border-brand-500 bg-brand-50 text-brand-700`) · `Pendiente cliente` · `Aprobado cliente` · `Cambios cliente`; inactivos `border-slate-300 text-slate-600`; todos `rounded-lg border px-2.5 py-1 text-xs font-medium disabled:opacity-60` |
| 21 | *(sección)* `Checklist` | `button` `＋ Añadir tarea` | `text-xs text-brand-600 hover:underline`, dentro de `rounded-lg border border-slate-200 p-3` |
| 22 | `Notas` | `textarea` | `.input min-h-[60px]`, ancho completo |

Pie: `Cerrar` (`btn-secondary`) y `Guardar` (`btn-primary`).

**Total: 42 controles** — 18 `label` con clase `.label`, 7 `select`, 6 `input` de texto/número/fecha,
1 `input[type=file]`, 1 `textarea`, y el resto botones.

> **Cierra un hueco del cuerpo de este documento.** Los cuatro estados posibles de la aprobación del cliente
> son `Sin enviar` · `Pendiente cliente` · `Aprobado cliente` · `Cambios cliente`. En la tarjeta del kanban
> solo se había observado el badge `Pendiente cliente`; aquí se ve el dominio completo. `Sin enviar` es el
> default, y es el que la tabla pinta como `—`.
