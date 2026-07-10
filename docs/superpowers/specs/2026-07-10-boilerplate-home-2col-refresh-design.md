# Home 2-col refresh — calco pixel-perfect (2026-07-10)

## Contexto

El home en vivo de la intranet de referencia (`https://bookings.conceptoneagency.com/`,
"Black Moose Group") ha cambiado de layout. Esta microfase recalca nuestro
`DashboardPage` para que vuelva a ser **pixel-perfect** contra el live actual.

Referencia capturada el 2026-07-10 logueando con las credenciales demo de `.env`
(`test@blackmoose.es`). Capturas y medidas persistidas en
`docs/references/home-2col-refresh/`:

- `live-home-full.png` — home completo del live (nuevo).
- `ours-home-full.png` — nuestro home actual (antes de esta fase).
- `live-eventos.png` — recorte de la columna Próximos Eventos.
- `live-novedad-card.png` — recorte de una tarjeta de Novedad.
- `live-computed.json` — estilos computados extraídos con Playwright/CDP.

Restricción del proyecto (igual que fases previas): **todo presentacional, sin
persistencia real** — nada crea/edita/borra datos; los controles son inertes.

## Cambio principal

El live reorganiza el home: **Novedades (izquierda) y Próximos Eventos (derecha)
pasan a una fila de dos columnas 50/50 colocada _encima_ de los grids de módulos**.
Hoy tenemos Novedades a ancho completo arriba y Próximos Eventos a ancho completo
al final. Además, Próximos Eventos se rediseña (badge de fecha, sin chips de estado)
y la tarjeta de Novedad se compacta.

## Alcance (decisiones confirmadas)

- **Rama:** `feature/home-2col-refresh`, creada desde el HEAD actual
  (`origin/feature/fase4-cruda-catalogo`, que ya contiene todo el home). Se mantiene
  sin fusionar, como las fases previas.
- **Recordatorios:** se **mantiene** `<Reminders/>` debajo de los grids (solo si hay
  datos). El live no lo muestra, pero es funcionalidad ya hecha y no estorba al reflow.
- **Tarjeta de Novedad:** se **recalca al live compacto** (pixel-perfect real).

Fuera de alcance: cambios de datos/tipos salvo los mínimos de derivación; grids de
módulos, saludo y TopNav (ya coinciden, solo micro-ajuste de color del saludo).

---

## Diseño detallado

### 1. `DashboardPage.tsx` — estructura

Reemplazar la pila actual por:

```tsx
<div className="space-y-8">
  {/* saludo — igual que hoy, salvo color h1 */}
  <div className="text-center">
    <h1 className="text-3xl font-semibold text-slate-800">{greeting} 👋🏼</h1>
    {birthdayNotice && <p className="mt-1 text-slate-500">{birthdayNotice}</p>}
    <p className="mt-1 text-sm text-slate-400">{weather}</p>
  </div>

  {/* NUEVO: fila de dos columnas */}
  <div className="grid items-start gap-6 lg:grid-cols-2">
    <NewsFeed items={dashboard.news} />
    <UpcomingEvents events={dashboard.upcomingEvents} />
  </div>

  <ModuleGrid modules={businessModules} title="Tus espacios" />
  <ModuleGrid modules={internalModules} title="Uso interno" />

  {dashboard.reminders.length > 0 && <Reminders reminders={dashboard.reminders} />}
</div>
```

- Contenedor de la fila: `grid items-start gap-6 lg:grid-cols-2` (gap 24px, columnas
  50/50 en ≥`lg`, apiladas debajo). En el live el div lleva además `mb-8`; aquí el
  `space-y-8` del contenedor padre ya aporta esa separación.
- `items-start`: las columnas se alinean arriba (Novedades suele ser más corta que
  Eventos y no debe estirarse).
- Único cambio del saludo: `text-slate-900 → text-slate-800` en el `h1` (medido:
  `rgb(30,41,59)`).

### 2. Cabeceras de sección — unificar token

Las cuatro cabeceras del live usan **el mismo** token:
`text-sm font-semibold uppercase tracking-wide text-slate-400`
(14px / 600 / `letter-spacing 0.35px` / `rgb(148,163,184)`).

Hoy la cabecera "Novedades" (en `NewsFeed`) usa `text-xs ... tracking-wider` (12px):
alinearla a `text-sm ... tracking-wide`. Las de módulos y Próximos Eventos ya usan
el token correcto.

### 3. `NewsFeed.tsx` — columna Novedades

- Cabecera: `<div className="mb-3 flex items-center gap-2">` con el `h2` (token
  unificado del punto 2) y el botón "+".
- Botón "+": mantener el actual (`grid h-5 w-5 place-items-center rounded-full
  bg-slate-100 text-slate-500 hover:bg-brand-50 hover:text-brand-600`).
- Lista: `<ul className="space-y-2">` (hoy es `div.space-y-3`) con un `<NewsCard>`
  (ahora `<li>`) por ítem.
- El formulario inline (`NewsForm`) que despliega el "+" se conserva tal cual.

### 4. `NewsCard.tsx` — tarjeta compacta (recalcada al live)

Estructura y tokens medidos:

```tsx
<li className="overflow-hidden rounded-xl border border-news-border bg-news-card px-4 py-3">
  {/* fila meta */}
  <div className="mb-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
    <span aria-hidden className="grid h-[18px] w-[18px] shrink-0 place-items-center
      rounded-full bg-slate-200 text-[10px] font-medium text-slate-600">
      {author.charAt(0)}
    </span>
    <span className="font-medium text-slate-600">{author}</span>
    <ArrowRight className="h-3 w-3 text-slate-400" />
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">{scope}</span>
    <span>·</span>
    <span className="text-slate-400">{date}</span>
    {scheduledFor && (
      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-700">{scheduledFor}</span>
    )}
  </div>

  {/* fila título + chevron */}
  <div className="flex items-center gap-3">
    <button className="min-w-0 flex-1 truncate text-left text-base font-medium text-slate-800"
      onClick={toggle}>
      {title}
    </button>
    <button onClick={toggle} className="shrink-0 text-slate-300 hover:text-slate-500">
      {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    </button>
  </div>

  {/* expandido — se conserva la funcionalidad actual */}
  {expanded && item.content && (
    <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.content}</p>
  )}
  {expanded && (/* Button acción + Editar/Eliminar, igual que hoy */)}
</li>
```

Cambios respecto al actual:

| Elemento | Antes | Ahora (live) |
|---|---|---|
| Padding card | `p-5` | `px-4 py-3` |
| Avatar | 32px (`h-8 w-8`), inicial, columna izquierda | 18px (`h-[18px] w-[18px]`) redondo, **inline en la fila meta** |
| Meta `gap` | `gap-2` | `gap-1.5` |
| Autor | `text-slate-700` normal | `font-medium text-slate-600` (`rgb(71,85,105)`) |
| Scope | texto plano | **pill** `rounded-full bg-slate-100 px-2 py-0.5 text-slate-500` |
| Fecha | `text-slate-500` (heredado) | `text-slate-400` explícito (`rgb(148,163,184)`) |
| Título | `text-sm font-semibold` | `text-base font-medium` (16px/500), `truncate`, es el disparador de expandir |

- Colores de la card: se conservan los tokens `news-card` / `news-border` (medidos
  antes como `#F7F6FC`/`#EEE3F6`); el live usa `bg-brand-50/60 + border-brand-100`
  que computa a `rgba(246,246,247,.6)` / `rgb(236,236,237)` — visualmente idéntico
  (casi-blanco neutro). **No se tocan los tokens.**
- El avatar es una inicial en círculo (no tenemos fotos como el live); 18px con
  inicial a `text-[10px]`.
- Estado **expandido**: se mantiene el comportamiento actual (contenido +
  Editar/Eliminar + Button de acción, inertes). No verificado contra el live
  (requiere click); ver "Verificación".

### 5. `UpcomingEvents.tsx` — columna Próximos Eventos

- `<section className="min-w-0">` (permite encoger en el grid; imprescindible con
  `truncate`).
- Cabecera: `<div className="mb-3 flex items-center justify-between">` con el `h2`
  (token unificado) y el link "Ver todos"
  (`<Link className="shrink-0 text-xs text-brand-600 hover:underline">`, ya existe).
- Card lista: `<ul className="divide-y divide-slate-100 overflow-hidden rounded-xl
  border border-slate-200 bg-white shadow-sm">`
  (único cambio vs. hoy: `border-slate-100 → border-slate-200`, medido
  `rgb(226,232,240)`).
- Cada fila:

```tsx
<li>
  <Link to={`/produccion/${event.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50">
    <DateBadge date={event.date} />
    <span className="min-w-0 flex-1">
      <span className="block truncate font-medium text-slate-800">{event.title}</span>
      <span className="block truncate text-xs text-slate-400">
        {startTime(event.timeRange)} · {event.location}
      </span>
    </span>
  </Link>
</li>
```

Cambios respecto al actual:

| Elemento | Antes | Ahora (live) |
|---|---|---|
| Indicador fecha | emoji `🎫` | **`DateBadge`** (badge calendario) |
| Subtítulo | `{date} · {timeRange} · {location}` | `{startTime} · {location}` (solo hora inicio + lugar) |
| Chip de estado | `<Badge>` Confirmado / En producción | **eliminado** |
| Padding fila | `px-4 py-2.5` | `px-4 py-3` |

- `startTime(timeRange)`: primera parte de `timeRange` partiendo por `–`/`-`
  (`"20:00–21:30" → "20:00"`). Helper local o en `lib/format.ts`.
- Título: `font-medium text-slate-800` (16px/500). Subtítulo: `text-xs text-slate-400`
  (12px, `rgb(148,163,184)`).

### 6. `DateBadge` — componente nuevo

Badge calendario medido en el live: cuadro blanco con borde, franja superior tenue
con el mes (uppercase, pequeño, muted) y el día grande debajo.

```tsx
export function DateBadge({ date }: { date: string }) {
  const { day, month } = parseDateBadge(date); // "15 jul 2026" → { day: "15", month: "JUL" }
  return (
    <span className="flex w-12 shrink-0 flex-col items-center overflow-hidden
      rounded-lg border border-slate-200 bg-white text-center">
      <span className="w-full bg-slate-50 py-0.5 text-[10px] font-bold uppercase
        tracking-wide text-slate-400">{month}</span>
      <span className="py-1 text-lg font-bold leading-none text-slate-800">{day}</span>
    </span>
  );
}
```

- Día: `text-lg font-bold leading-none text-slate-800` (medido exacto: 18px/700,
  `rgb(30,41,59)`, `padding 4px 0`).
- Mes: uppercase pequeño en franja `bg-slate-50`.
- Ancho `w-12` (~48px, medido ~42–48px).
- `parseDateBadge`: parte `date` por espacios → `[día, mes, año]`; `día = parts[0]`,
  `mes = parts[1].toUpperCase()`. Robusto para el formato es de nuestro mock
  (`"15 jul 2026"`).
- Ubicación: reutilizar el badge de `produccion/EventsPage` si ya existe uno
  equivalente; si no, crear `src/components/ui/DateBadge.tsx` (o
  `features/dashboard/DateBadge.tsx`) y exportarlo. Decidir en el plan tras revisar
  `EventsPage.tsx`.

---

## Unidades y límites

- `DashboardPage` — solo compone; decide el layout (fila 2-col + grids + reminders).
- `NewsFeed` / `NewsCard` — columna Novedades; `NewsCard` es presentacional puro
  con estado local de expandir.
- `UpcomingEvents` — columna Eventos; consume `DateBadge`.
- `DateBadge` — unidad aislada, entrada `date: string`, sin dependencias de dominio.

## Testing

- Actualizar/ajustar tests existentes: `NewsFeed.test`, `NewsCard.test`,
  `UpcomingEvents.test` (ya no hay chips de estado ni fecha en subtítulo; aparece
  `DateBadge`).
- Nuevo `DateBadge.test`: `"15 jul 2026"` → renderiza `JUL` y `15`.
- Test de layout en `DashboardPage` (si existe) que verifique que Novedades y Eventos
  conviven en la fila 2-col.
- `npm run lint`, `tsc`, `vitest run` en verde.

## Verificación (pixel-perfect)

1. Comparar `npm run dev` (puerto 5173) contra `docs/references/home-2col-refresh/`
   con capturas Playwright a viewport 1440×900 (deviceScaleFactor 2), como en esta
   sesión.
2. Contrastar medidas clave: fila `gap-6` (24px), cards de novedad `px-4 py-3` /
   72–74px alto, `DateBadge` ~48px, subtítulo de evento sin fecha ni rango.
3. **Pendiente/opcional:** verificar el estado _expandido_ de la tarjeta de Novedad
   contra el live (requiere click en el chevron del live). Si difiere, follow-up.

## Riesgos

- Sin fotos de avatar (el live usa `object-cover`): usamos inicial en círculo 18px —
  diferencia deliberada y aceptada.
- El "brand" del live es escala de grises; el de nuestra app es violeta. Los tokens
  neutros (`news-*`, `slate-*`) replican el aspecto; **no** adoptamos el gris del live
  para `brand` (mantiene la identidad de nuestra app).
