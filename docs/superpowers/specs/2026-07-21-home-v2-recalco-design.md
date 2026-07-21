# Home v2 — Recalco pixel-perfect del home + TopNav + panel Ayuda · Design

**Fecha:** 2026-07-21
**Rama objetivo:** `feature/home-v2` (desde `feature/fase6-crm`)
**Tipo:** Calco **100% fiel** al live (pixel-perfect: tipografía, colorimetría, espacios). Presentacional (mock) con navegación real.

---

## 1. Contexto y objetivo

El live (`bookings.conceptoneagency.com`) rediseñó el home desde la última vez que lo calcamos (fase "home-2col-refresh", 2026-07-10). Ya no es "2 columnas Novedades+Eventos": ahora es un **home agrupado** con hero (saludo + banner festivo + clima), grid de espacios en **pills compactas agrupadas en 3 secciones**, tarjeta **inbox-zero**, y Novedades. Además hay dos elementos **globales** nuevos: la **TopNav** ligeramente rediseñada (dropdown "Espacios", colorimetría gris) y un **panel "Ayuda"** flotante abajo-izquierda presente en todas las pantallas.

Esta es la **primera fase** de la migración acordada tras el gap-analysis del 2026-07-21 (registrado en la memoria `live-gap-analysis-2026-07-21`). Se hace el home antes que nada porque el TopNav y el panel Ayuda son transversales (base del resto de fases).

**Decisión de colorimetría (usuario):** esta vez **100% fiel al live** — se abandonan los deltas violeta (brand-*) en las superficies que toca esta fase; se replican los grises/negros del live. Es el inicio de la migración progresiva de toda la app a la colorimetría fiel.

### Referencias (capturas + estilos computados)
Generadas con Playwright (login demo `test@blackmoose.es` / `Concept1234`) el 2026-07-21, en `docs/references/home-v2/`:
- `live-home.png` — home completo logueado.
- `live-home-computed.json` / `live-home-computed-2.json` — tokens computados de todos los bloques (incluye el HTML exacto del TopNav y del panel Ayuda).
- `live-home-modules.json` — acentos (rgba) + paths SVG de los iconos de los 12 módulos.
- Scripts regenerables: `scan-live.mjs`, `scan-deep.mjs`, `scan-computed2.mjs`, `scan-mods.mjs`.

### Criterios de éxito
- Home: hero (saludo `text-3xl`, banner festivo `text-sm`, clima `text-xs`) + grid de espacios agrupado en 3 secciones con pills compactas (icono badge accent@8% + nombre) + tarjeta inbox-zero + Novedades, todo con los tokens exactos de §3.
- Las 12 pills + el dropdown "Espacios" **navegan** a su ruta (con 3 stubs mínimos para las rutas aún no construidas).
- TopNav recalcada a fiel (grises, dropdown "Espacios", badge "9+") — cambia en **todas** las pantallas.
- Panel Ayuda global visible en todas las pantallas (inerte).
- Verde total: tests, lint 0, tsc limpio. Verificación Playwright ours↔live.

---

## 2. Alcance

**Entra:**
1. **Home body** (`DashboardPage` + `ModuleGrid` + `NewsFeed`/inbox-zero) recalcado.
2. **TopNav** global (`components/layout/TopNav.tsx`) recalcada a fiel + dropdown "Espacios".
3. **Panel Ayuda** global nuevo (`components/layout/HelpPanel.tsx`), montado en `AppLayout`.
4. **Datos mock** (`MockRepository.getDashboard`) ampliados: 3 grupos, 12 módulos, acentos exactos, festivo, clima, inbox-zero.
5. **Stubs mínimos** de ruta para `/mixmag`, `/tagmag`, `/herramientas` (shell vacío "en construcción") — solo para que la navegación no dé 404.

**No entra (fases posteriores):**
- Contenido real de Mixmag / TAGMAG / Herramientas / Incidencias.
- Backend del panel Ayuda / bandeja Incidencias (el "Enviar" queda inerte).
- Recalco de otros módulos (ConceptOne/Euphoric sub-navs, etc.).
- Migrar a fiel la colorimetría *interna* de módulos ya hechos (solo se toca lo global: TopNav + panel Ayuda; el resto se hará en sus fases).

---

## 3. Tokens exactos del live (pixel-perfect)

Medidos con `getComputedStyle` a viewport 1440×900.

### Contenedor / fondo
- `body` background: `#f8fafc` (slate-50).
- Fuente: stack Tailwind por defecto (`ui-sans-serif, system-ui, …`). Sin cambios.
- Contenedor de contenido (`main`): `mx-auto w-full max-w-7xl px-4 py-6` (max-w-7xl = **1280px**). **Acción:** `AppLayout` hoy usa `max-w-[1248px]` → cambiar a `max-w-7xl`.

### Hero (`text-center`, contenedor `mt-2 mb-6`)
| Elemento | Tamaño / peso | Color | Clase Tailwind |
|---|---|---|---|
| `h1` "Hola, {nombre} 👋🏼" | 30px / 600 / lh36 | `#1e293b` slate-800 | `text-3xl font-semibold text-slate-800` |
| Banner festivo | 14px / 400 / lh20 | `#64748b` slate-500 | `text-sm text-slate-500` |
| Clima "☁️ Barcelona · 31° / 25°" | 12px / 400 / lh16 | `#94a3b8` slate-400 | `text-xs text-slate-400` |

### Grid de espacios (alineado a la izquierda; 3 grupos)
- **Etiqueta de grupo:** `text-xs font-semibold uppercase tracking-wider text-slate-400`, `mb-3`. (El live la renderiza en mayúsculas vía `text-transform: uppercase` — el texto en datos va en Title Case.)
- **Disposición:** "ESPACIOS DE TRABAJO" en su propia fila (pills en `flex flex-wrap gap-2`). "GESTIÓN INTERNA" y "HERRAMIENTAS Y AJUSTES" comparten fila (dos columnas lado a lado), cada una con sus pills.
- **Pill** (HTML exacto del live):
  ```html
  <a class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white
            px-2.5 py-1.5 text-sm shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
     href="/{slug}">
    <span class="grid h-7 w-7 shrink-0 place-items-center rounded-md"
          style="background-color: {accent}14;">   <!-- accent @ 8% -->
      <Icon class="shrink-0 text-slate-500" width=20 height=20 strokeWidth=1.75 />
    </span>
    {nombre}
  </a>
  ```
  Tokens: pill `rounded-lg` (8px), `border-slate-200`, `bg-white`, `px-2.5 py-1.5`, `text-sm`, `shadow-sm`; badge `h-7 w-7` (28px) `rounded-md`, `bg = accent@8%`; icono `20px`, `stroke-1.75`, `text-slate-500` (el icono es slate-500, **no** el color de acento; solo el badge lleva el tinte).

### Tarjeta inbox-zero (cuando no hay pendientes)
- Contenedor: `bg-white border border-slate-200 rounded-xl py-10 px-6 text-center`, ancho completo, sin sombra.
- Contenido centrado: ✓ (check) + título "No te toca nada ahora mismo" (`text-sm font-medium text-slate-700` = `#334155`) + subtítulo "Ni alertas, ni creatividades, ni aprobaciones. Está todo al día." (`text-xs text-slate-400` = `#94a3b8`).

### Novedades
- Etiqueta "NOVEDADES" (misma micro-label que los grupos) + icono `+`.
- Tarjeta de novedad (reusa el `NewsCard` existente, restilado): fila con avatar, "Nombre → Grupo · fecha", título del evento, botón **"Confirmar Asistencia"** (`bg-slate-800 text-white rounded-lg text-sm`, inerte) y chevron de expandir.

### TopNav (global)
- `<header class="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">`
- Interior: `mx-auto flex h-14 max-w-7xl items-center gap-4 px-4`.
- **Izquierda:** logo (nuestro wordmark, ver §6) + separador `/` (`text-slate-300`) + **dropdown "Espacios"**: `button` `flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900` + chevron.
- **Centro:** `nav hidden flex-1 … md:flex` con las pestañas del módulo activo (vacío en el home). Sin cambios estructurales respecto a nuestro `module` prop.
- **Derecha** (`ml-auto flex items-center gap-3`): maletín→`/mi-trabajo` (`grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800`); campana con badge `absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white` = "9+"; menú usuario.
- **Deltas a aplicar sobre nuestro TopNav actual:** `max-w-[1248px]`→`max-w-7xl`; `border-slate-100`→`border-slate-200`; `bg-white/80 backdrop-blur-sm`→`bg-white/90 backdrop-blur`; `z-30`→`z-20`; quitar acentos `brand-*` de las pestañas activas → grises del live (`bg-slate-100 text-slate-900` en hover/activo); añadir dropdown "Espacios".

### Panel Ayuda (global, nuevo)
- `fixed bottom-4 left-4 w-[352px] bg-white border border-slate-200 rounded-xl shadow-lg` (rect medido 352×175 a x16/y710).
- Cabecera: icono `?` + "Ayuda" + botón cerrar `×`.
- Cuerpo: texto "Pregunta lo que quieras de esta pantalla, o cuenta qué está fallando." (`text-sm text-slate-500`).
- Input (`textarea`/input "Pregunta o cuenta qué falla…") + botón "Enviar" (`bg-slate-800 text-white`, inerte).
- Pie: "Reportar con captura" (izq) · "Mis avisos" (der) — enlaces inertes.
- Comportamiento: colapsable (estado local `useState`); sin persistencia ni envío real.

---

## 4. Paleta de módulos (12 · acentos exactos del live)

| # | id / slug | Nombre (label) | Grupo | Acento (hex) | Icono lucide (aprox.) |
|---|---|---|---|---|---|
| 1 | conceptone | ConceptOne | workspace | `#773C9F` | Headphones |
| 2 | etra | Etra | workspace | `#2563EB` | Megaphone |
| 3 | produccion | Producción | workspace | `#BE123C` | Calendar |
| 4 | euphoric | Euphoric Media | workspace | `#DB2777` | Sparkles |
| 5 | mixmag | Mixmag | workspace | `#E11D48` | Sparkles (mismo icono que Euphoric en el live) |
| 6 | tagmag | TAGMAG | workspace | `#0EA5E9` | Sparkles |
| 7 | creativos | Creativos | workspace | `#7C3AED` | Palette |
| 8 | cruda | CRUDA | workspace | `#171717` | Shirt |
| 9 | crm | CRM | management | `#0D9488` | Target |
| 10 | personal | Team | management | `#0F172A` | Users |
| 11 | herramientas | Herramientas | tools | `#16834D` | BarChart3 |
| 12 | configuracion | Configuración | tools | `#475569` | Settings |

- Los iconos exactos (path SVG) están en `live-home-modules.json`; en implementación se mapea cada uno al icono lucide más cercano (los ya existentes se conservan).
- Acentos 1–8 (menos Mixmag/TAGMAG) ya están en `MockRepository`; **corregir** CRM (`#64748B`→`#0D9488`) y Team (`#64748B`→`#0F172A`); **añadir** Mixmag, TAGMAG, Herramientas, Configuración (`#475569`).

---

## 5. Cambios en el modelo de datos (`MockRepository.getDashboard` + tipos)

- `Module.category`: de `'business' | 'internal'` → `'workspace' | 'management' | 'tools'`. Ajustar `types/index.ts`, `constants.ts` (MODULES) y consumidores (`ModuleSelector`, tests).
- `getDashboard().modules`: pasar a **12** entradas con los acentos y grupos de §4.
- Añadir campo `festivoNotice: string` (p.ej. "Faltan 25 días para el próximo festivo (L'Assumpció) 🎉"). Mantener `weather` (cambiar a "Barcelona · 31° / 25°"). `birthdayNotice` queda como opcional (el hero muestra `festivoNotice` en su lugar; decidir en plan si se elimina o coexiste).
- Inbox-zero: el home muestra la tarjeta "No te toca nada" cuando `reminders.length === 0` (o un flag `allClear`). Con datos mock actuales, forzar el estado vacío para calcar el live.

### Unificación de listas de módulos (mejora acotada)
Hoy hay dos fuentes: `constants.ts` `MODULES` (7, para nav) y `MockRepository` `getDashboard().modules` (9, para el grid). Divergen en nombres ("Booking & Management" vs "ConceptOne"). **Acción:** unificar en una sola fuente canónica (`constants.ts` `MODULES` con los 12, incluyendo `accent` y `category`), y que tanto el grid del home como el dropdown "Espacios" la consuman. El `MockRepository` referencia esa lista en vez de duplicarla. Esto evita el drift y es el origen del "Espacios" dropdown.

---

## 6. Identidad de marca (decisión usuario)

Se **mantiene nuestro wordmark propio** (no se copia el logo real de Black Moose). Se restila a neutro/gris para encajar en la colorimetría fiel (p.ej. cuadro `bg-slate-800`/`bg-slate-900` con inicial + wordmark `text-slate-900`, en vez del `bg-brand-600` actual). **Delta intencional documentado:** logo propio en lugar del antler de Black Moose.

---

## 7. Componentes / archivos afectados

| Archivo | Cambio |
|---|---|
| `src/components/layout/AppLayout.tsx` | `max-w-[1248px]`→`max-w-7xl`; montar `<HelpPanel/>` global. |
| `src/components/layout/TopNav.tsx` | Recalco a fiel (grises); añadir dropdown "Espacios"; badge "9+". |
| `src/components/layout/EspaciosDropdown.tsx` | **Nuevo** — dropdown que lista los 12 módulos (desde `MODULES`), navega. |
| `src/components/layout/HelpPanel.tsx` | **Nuevo** — panel Ayuda global colapsable, inerte. |
| `src/features/dashboard/DashboardPage.tsx` | Hero (festivo+clima), grid agrupado en 3, inbox-zero. |
| `src/features/dashboard/ModuleGrid.tsx` | Tarjetas grandes → **pills compactas**; soportar 3 grupos / render por grupo. |
| `src/features/dashboard/NewsCard.tsx` / `NewsFeed.tsx` | Restyle a la tarjeta de novedad del live (botón "Confirmar Asistencia" slate). |
| `src/features/dashboard/InboxZero.tsx` | **Nuevo** — tarjeta "No te toca nada ahora mismo". |
| `src/lib/constants.ts` | `MODULES` canónica (12 con accent+category); fuente única. |
| `src/repositories/MockRepository.ts` | `getDashboard` con 12 módulos/3 grupos/festivo/clima/inbox-zero. |
| `src/types/index.ts` | `Module.category` a 3 valores; `Dashboard.festivoNotice`. |
| `src/app/router.tsx` | 3 rutas stub: `/mixmag`, `/tagmag`, `/herramientas`. |
| `src/features/modules/*Shell.tsx` (o genérico) | Stubs mínimos "en construcción" para las 3 rutas nuevas. |

---

## 8. Testing

- **Unit (Vitest + RTL):**
  - `ModuleGrid`: renderiza los 3 grupos con sus etiquetas; pill lleva `href` correcto y badge con el acento (`background-color` = accent@8%); icono slate-500.
  - `DashboardPage`: muestra hero con festivo+clima; inbox-zero cuando `reminders` vacío; 12 pills.
  - `EspaciosDropdown`: abre/cierra; lista 12 módulos; enlaces correctos.
  - `HelpPanel`: colapsa/expande; "Enviar" no rompe (inerte); enlaces presentes.
  - `TopNav`: badge "9+"; maletín→/mi-trabajo; sin clases `brand-*`.
- **Verificación visual:** Playwright ours↔live sobre el home (comparar hero, pills, inbox-zero, TopNav, panel Ayuda) contra `docs/references/home-v2/live-home.png`.
- Gate: `npm test`, `npm run lint` (0), `tsc --noEmit` limpios antes de cerrar.

---

## 9. Deltas intencionales (documentados)

1. **Logo/wordmark propio** en lugar del logo real de Black Moose (§6).
2. Textos de "Mis avisos"/"Reportar con captura"/"Enviar" del panel Ayuda **inertes** (sin backend).
3. Contenido de Mixmag/TAGMAG/Herramientas = **stub "en construcción"** (rutas navegables pero vacías).
4. `festivoNotice`/`weather` con valores mock estáticos (no hay servicio de festivos/clima).

---

## 10. Fuera de alcance / siguientes fases

Mixmag + TAGMAG (contenido real), Incidencias (+ wiring del panel Ayuda), Configuración real, Team real, recalco ConceptOne/Euphoric, Herramientas/Proyecciones P&L. Orden en la memoria `live-gap-analysis-2026-07-21`.
