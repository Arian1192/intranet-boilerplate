# Euphoric Media — Calco-fidelity addendum (3 points)

**Fecha:** 2026-07-09
**Contexto:** Tras el calco inicial de Euphoric, el usuario pide dejar 3 puntos **exactamente como el original** (`https://bookings.conceptoneagency.com/euphoric`). Specs extraídos del DOM/estilos reales.
**Restricción:** presentacional (sin persistencia). Reutilizar primitivos; no romper Etra/Producción. Marca: mantener nuestro `brand-600` (#7C3AED) de la app; NO adoptar el #773C9F del original (fuera de alcance).

---

## R1 — Analítica: gráfico de barras (RetainerBarChart)

El original usa Recharts; la barra real medida: `x≈166.7, y=8, width≈710, height=212, fill=#db2777`. Es una **barra ANCHA** (llena ~80% de la banda de categoría), altura completa para SIGHT (800=máx), **esquinas rectas**, color **`#db2777`** (pink-600, NO rose-500).

Cambios a `src/features/euphoric/components/RetainerBarChart.tsx` (mantener SVG/flex propio, sin añadir Recharts):
1. **Barra ancha**: que llene la mayor parte del ancho disponible de su categoría (~70–80% del área de plot para 1 barra), centrada. No estrecha.
2. **Color** `#db2777` (usar `fill-[#db2777]` / `bg-[#db2777]`). Esquinas rectas (sin `rounded`).
3. **Gridlines**: horizontales punteadas (`#f1f5f9`, ya están) + añadir **verticales** punteadas en bordes izq/der y centro (3 líneas), `stroke-dasharray 3 3`, `#f1f5f9`.
4. **Etiqueta de categoría** "SIGHT": rotada **-20°** (no -45), `text-anchor: end`, gris.
5. Ejes Y ticks `0/200/400/600/800 €` (ya correcto).

Además, `src/features/euphoric/pages/AnaliticaPage.tsx`: el valor **MRR** debe ir en **`#db2777`** (pink-600), no `text-rose-500`. Usar `text-[#db2777]` o `text-pink-600`.

---

## R2 — Calendarios (Contenido + Eventos): nuevo componente `EuphoricCalendar`

El original NO usa nuestro `MonthCalendar` compartido. Para no tocar Etra/Producción, crear `src/features/euphoric/components/EuphoricCalendar.tsx` y usarlo en Contenido (vista Calendario) y Eventos (vista Calendario). Specs medidos del original:

**Navegación** (dentro del card): fila con **flechas simples** — botón `←` (aria-label "Mes anterior") · `Julio 2026` (centrado, semibold) · botón `→` (aria "Mes siguiente"). NADA de texto "Anterior/Siguiente".

**Cabeceras de día**: `Lun Mar Mié Jue Vie Sáb Dom` con `text-transform: uppercase` (render "LUN MAR…"), gris, `text-xs`.

**Celda de día**: `min-h-[124px] border-b border-r border-slate-100 p-1.5 bg-white cursor-pointer hover:bg-brand-50/30`. Número del día arriba-derecha: `mb-1 text-right text-xs text-slate-500`. Contenedor de eventos: `space-y-1.5`.

**Hoy (día 9)**: el número va dentro de un círculo brand: `inline-grid h-5 w-5 place-items-center rounded-full bg-brand text-white` (usar `bg-brand-600 text-white`).

**Días fuera de mes**: atenuados (número `text-slate-300`, celda fondo `slate-50/40`), como el original.

**Card de publicación (Set Times, día 10)** — `<button>` con:
`block w-full space-y-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-left leading-snug hover:border-brand-300 hover:shadow-sm`, `title="SIGHT · Set Times · En producción"`. Contenido:
- `<span class="block truncate text-[11px] font-semibold text-slate-800">Set Times</span>`
- `<span class="block truncate text-[10px] text-slate-400">SIGHT</span>`
- `<span class="flex items-start gap-0.5 text-[10px] text-rose-500"><span class="shrink-0">📍</span><span class="line-clamp-2">SIGHT: Patrick Topping, ACA, Luca 606, Nicholls</span></span>`
- fila de chips: `Post` (chip neutro pequeño) + `En producción` (chip azul pequeño), `text-[9px]/[10px]`.

**Píldora de evento (días 12/15/18/19)** — `<div class="flex items-start gap-1 rounded-md border-l-2 border-rose-400 bg-rose-50 px-1.5 py-1 text-[10px] text-rose-600">📍 {nombre}</div>` (truncado/line-clamp). Días y eventos: 12=SIGHT: Patrick Topping…, 15=Mixmag Intimate Sessions: BLOND:ISH, 18=Please Quiet x SIGHT, 19=SIGHT: Oden & Fatzo, KOKO b2b Bizza, Jan, Caste.

**Contenido**: la barra de mes externa (← Julio 2026 →, ● Eventos, Hoy) puede quedar como está; el grid pasa a `EuphoricCalendar`. Set Times en día 10 (card rica) + 4 eventos.
**Eventos** (vista Calendario): mismo `EuphoricCalendar`, solo las 4 píldoras de evento (marketing violeta `border-l-2 border-brand-400 bg-brand-50 text-brand-700`, producción rosa) + helper debajo `Toca un evento del calendario para editarlo, o «+ Nuevo evento».`

**"Hoy" = 9 jul 2026** (fecha del sistema del calco). Usar año 2026, mes 6 (julio), hoy=9.

---

## R3 — Vista "Artistas" (8ª vista)

Ruta `/euphoric/artistas`, accesible por un **icono de persona** en el header (a la IZQUIERDA del icono de gráfica de Analítica).

### Header (TopNav): soportar varios icon-actions
Cambiar `ModuleHeader.iconAction` (singular) → `iconActions?: { icon: LucideIcon; href: string; label: string }[]` (array), renderizados en orden antes de la campana. EuphoricShell pasa **dos**: `[{ Users, '/euphoric/artistas', 'Artistas' }, { BarChart2, '/euphoric/analitica', 'Analítica' }]`. Actualizar el test de TopNav y el de EuphoricShell. Ningún otro módulo pasa iconActions → sin cambios.

### Página `ArtistasPage` (master-detail, patrón Cuentas/Eventos)
- H1 `Artistas` + subtítulo `Base compartida con ConceptOne. Crea aquí los artistas externos para tus line-ups y flyers.`; botón primario `+ Nuevo artista` (top-right, setea `creating=true`).
- Izquierda (`listTop` = `Input` `Buscar artista…`): lista de artistas. Cada fila: avatar de iniciales (chip circular tintado brand, 2 letras) + nombre + tag a la derecha `Agencia` (badge brand/`fuchsia`-ish violeta pálido) o `Externo` (badge slate/neutral).
- Derecha: empty-state `Elige un artista o crea uno nuevo.`; al `creating`, `<ArtistaForm/>` via `detailOverride`.

### `ArtistaForm` (card, sin título visible o "Nuevo artista")
Campos: `Nombre *` (input); `Email de contacto` (`Para mandar flyers a aprobar`); fila `Enlace press kit` (`https://...`) / `Foto (URL)` (`https://...`); `Redes (URL)` en 2 columnas: `Instagram` / `Facebook` / `TikTok` / `Spotify` / `Resident Advisor` / `SoundCloud` / `YouTube` (7 inputs, placeholders = el nombre de la red); `Guardar` primario abajo-derecha. Presentacional (`onSave` → cierra).

### Seed (`src/features/euphoric/data/seed.ts`, nuevo `artists`)
Tipo `Artist { id; name; kind: 'Agencia' | 'Externo' }`. 42 artistas (orden alfabético como el original):
Aaron Martin·A, Abdon·A, ACA·A, Andrea Castells·A, ART NO LOGIA·A, Bassel Darwish·A, Bizza·A, Brenda Serna·A, Claudia Tejeda·A, DH Moon·A, Dhuna·A, Florentia·A, Fran Hernandez·A, Freddy Bello·A, **Galgo·Externo**, Gaston Zani·A, Janse·A, Jose Fajardo·A, Koleto·A, LA CINTIA·A, Londonground·A, Los Canarios·A, Marcel BS·A, Marian Ariss·A, **Miane·Externo**, Milan·A, Nacho Scoppa·A, **Nicole Moudaber·Externo**, Olivia Bass·A, Parsa Jafari·A, Pau Guilera·A, Prophecy·A, Rivellino·A, **Rooléh·Externo**, Rubenus·A, Saldivar·A, Sebastian Ledher·A, Sera De Villalta·A, Sergio Saffe·A, SUMIA·A, Tomi & Kesh·A, Vidaloca·A. (·A = Agencia)
Iniciales del avatar: 2 primeras letras en mayúscula del nombre (p.ej. "Aaron Martin"→"AA", "ACA"→"AC", "LA CINTIA"→"LA", "Rooléh"→"RO").

### Router
Añadir `<Route path="artistas" element={<ArtistasPage />} />` bajo `/euphoric`.

---

## Verificación
Playwright 1440px contra la web real para cada punto: Analítica (barra ancha rosa + label -20°), Contenido/Eventos (calendario con card rica + flechas + hoy), Artistas (lista + tags + form). Tests de patrón para EuphoricCalendar, ArtistasPage, ArtistaForm, TopNav (iconActions array).
