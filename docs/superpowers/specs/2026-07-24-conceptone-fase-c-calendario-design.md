# ConceptOne · Recalco — Fase C (Calendario) · Design

**Fecha:** 2026-07-24
**Rama:** `feature/conceptone-recalco` (continúa sobre Fase B)
**Tipo:** Calco fiel al live, presentacional, en memoria. **Fase 3 de 4** del recalco de ConceptOne.

---

## 1. Contexto y objetivo

Fase A dejó `/calendario-c1` como stub. Fase C lo construye: **grid mensual** de shows y holds de artista + **agenda por día** debajo, con navegación de mes. Fuente: recon `scratchpad/recon-conceptone/` (`c1-calendario.json` julio + `c1-cal-agosto.json` + `c1-cal-septiembre.json`).

### Criterios de éxito
- `/calendario-c1` muestra: header "Calendario" + subtítulo *"Shows y holds de artista en un solo sitio. Un hold puede subir a show sin duplicar."* + botón **"+ Hold"** (inerte, D2).
- **Navegación de mes** ‹ Mes Año › (prev/next) funcional; **default julio 2026**.
- **Grid mensual** semanas LU–DO con chips "Artista · Ciudad" en su día.
- **Agenda por día** bajo el grid: cada día con eventos → encabezado "weekday, D de month" + tarjetas Show (Artista · Venue · Ciudad · Evento · chip de pago) y Hold (Artista · Título(del artista) · badge etapa + botones Subir a show/Editar/✕ inertes).
- Seed = los **16 eventos exactos** (§3: 15 shows + 1 hold) en Jul/Ago/Sept.
- Verde total (tests, lint 0, tsc). Verificación Playwright ours-vs-live formal al **cierre del módulo** (tras Fase D).

---

## 2. Arquitectura

### 2.1 Modelo (`src/features/booking/` — nuevo, independiente de `Show`)
```ts
export type CalendarEventType = 'show' | 'hold';
export interface CalendarEvent {
  id: string;
  date: string;                 // 'YYYY-MM-DD' (colocación en grid + agrupación de agenda)
  type: CalendarEventType;
  artist: string;
  // Shows:
  venue?: string | null;        // "Edén Ibiza" | null
  city?: string | null;         // "Sant Antoni de Portmany" | null (campo propio del calendario)
  event?: string;               // "FUEGO"
  paymentStatus?: PaymentStatus;// reutiliza el tipo de Fase B
  // Holds:
  holdTitle?: string;           // "Dentista" → se muestra "Dentista (del artista)"
  etapa?: ShowStatus;           // badge del hold ("Confirmado")
}
```
**Decisión D1 (Arian):** `CalendarEvent` es un **seed propio**, independiente del dataset de `Show` de Fase B. El calendario muestra shows por mes (no filtrados por rango) e incluye alguno que la lista de Shows oculta (Bizza el 15-jul, Los Canarios @ Mamarela el 2-ago) y con **ciudad** (campo que `Show` no tiene). Se acepta el solape presentacional a cambio de fidelidad y simplicidad. NO se toca `Show` ni `getShows()`.

### 2.2 Componentes (`src/features/booking/components/`)
- **`MonthNav`** — ‹ {MesAño} › con botones prev/next (`onPrev`/`onNext`).
- **`MonthGrid`** — cabecera LU MA MI JU VI SÁ DO (semana empieza en lunes) + celdas de los días del mes; en cada día, chips de sus eventos ("{artist} · {city}"). Días fuera del mes vacíos.
- **`DayAgenda`** — bajo el grid: por cada día del mes con eventos (orden ascendente), encabezado "**{weekday}, {D} de {month}**" (es-ES, minúsculas) + las tarjetas del día.
- **`AgendaShowCard`** — "Show" + `{artist} · {venue} · {city} · {event}` (omitir venue/city si null) + chip de estado de pago (reusar el chip de Fase B: No abonado gris / Parcialmente abonado ámbar / Liquidado verde).
- **`AgendaHoldCard`** — "Calendario" + `{artist} · {holdTitle} (del artista)` + badge de etapa + botones **Subir a show / Editar / ✕** (inertes, D2).
- Reusar primitivos `@/components/ui` y el helper `etapaLabel` (Fase B) para el badge del hold.

### 2.3 Página
- `CalendarioPage` (reemplaza `CalendarioStubPage` en el router; borrar el stub): estado `mesActual: { year, month }` inicial **julio 2026** (`{ year: 2026, month: 6 }` 0-indexed). Deriva del seed los eventos del mes visible (por prefijo `YYYY-MM`). Compone `MonthNav` + `MonthGrid` + `DayAgenda`. `onPrev`/`onNext` decrementan/incrementan el mes.
- Fuente de datos: helper/hook local `useCalendarEvents()` o `getCalendarEvents()` en el patrón del repo (in-memory). No hace falta pasar por `MockRepository` si se prefiere un `data/calendar.ts` local (seguir el patrón de otros features del módulo; decidir en el plan).

---

## 3. Seed — los 16 eventos (evidencia del live, 3 meses)

**Julio 2026** (7 shows + 1 hold):
| date | type | artist | venue | city | event | pago/etapa |
|------|------|--------|-------|------|-------|-----------|
| 2026-07-15 | show | Bizza | Hï | Illes Balears | Paradise - Bunker | No abonado |
| 2026-07-18 | show | Los Canarios | Edén Ibiza | Sant Antoni de Portmany | FUEGO | No abonado |
| 2026-07-18 | show | Abdon | Bassment | Madrid | FUNDAYS | No abonado |
| 2026-07-21 | show | Test Artist | Ku Barcelona | Barcelona | SIGHT | No abonado |
| 2026-07-23 | **hold** | Test Artist | — | — | Dentista | Confirmado (etapa) |
| 2026-07-25 | show | Florentia | Paseo de Santiago, Torreperogil | Torreperogil | Summer Opening Festival | Liquidado |
| 2026-07-26 | show | Abdon | Ku Barcelona | Barcelona | SIGHT | No abonado |
| 2026-07-26 | show | Pau Guilera | Marina Beach Club | Valencia | the next | No abonado |

**Agosto 2026** (3 shows):
| date | type | artist | venue | city | event | pago |
|------|------|--------|-------|------|-------|------|
| 2026-08-01 | show | Milan | Casa del Mar | Isla Santa Catalina | Casa del Mar | No abonado |
| 2026-08-01 | show | Los Canarios | Hangar 37 | San Bartolomé de Tirajana | Solart Fest | No abonado |
| 2026-08-02 | show | Los Canarios | Marmarela | Alicante | Mamarela | No abonado |

**Septiembre 2026** (5 shows):
| date | type | artist | venue | city | event | pago |
|------|------|--------|-------|------|-------|------|
| 2026-09-04 | show | Brenda Serna | null | null | Alcazar de San Juan | Parcialmente abonado |
| 2026-09-18 | show | Sergio Saffe | el Tebo | Valparaiso | el Tebo | No abonado |
| 2026-09-25 | show | Marian Ariss | La Fábrica | Cordoba | Kevin de Vries Cordoba | No abonado |
| 2026-09-26 | show | ART NO LOGIA | Boho Beer Garden | Birmingham | Jiwa | No abonado |
| 2026-09-26 | show | Marian Ariss | Mandarine Park | Buenos Aires | Kevin de Vries Buenos Aires | No abonado |

**Fidelidad del live (transcribir literal):** el 2-ago venue = "Marmarela" y evento = "Mamarela" (grafías distintas, así en el live). El 4-sept la tarjeta de Brenda Serna solo muestra "Brenda Serna · Alcazar de San Juan · Parcialmente abonado" (sin venue/ciudad; "Alcazar de San Juan" es el evento). Bizza (15-jul) y Los Canarios @ Mamarela (2-ago) NO están en la lista de Shows de Fase B (el rango los oculta) — son evidencia del calendario.

---

## 4. Layout (capturas `c1-calendario.png`, `c1-cal-agosto.png`, `c1-cal-septiembre.png`)
- Header: "Calendario" + subtítulo + botón "+ Hold" a la derecha (inerte).
- Barra de mes: ‹ centrado "{Mes} {Año}" › (p.ej. "Julio 2026"), flechas prev/next.
- Grid: 7 columnas (LU MA MI JU VI SÁ DO), filas por semana; número de día arriba en cada celda; chips de eventos apilados ("{artist} · {city}", truncado si largo). Semana empieza en **lunes**. 1-jul-2026 es miércoles → la primera fila tiene 2 celdas vacías antes del 1.
- Agenda: lista vertical; por día con eventos, encabezado "**{weekday}, {D} de {mes}**" (es-ES, minúsculas, sin año) y sus tarjetas. Ajustar spacing/tokens a las capturas.

---

## 5. Decisiones / deltas conscientes
- **D1 — `CalendarEvent` seed propio** (Arian): independiente de `Show`; incluye ciudad y los shows que el rango de la lista oculta. Solape presentacional aceptado. No toca `Show`/`getShows()`.
- **D2 — Holds y "+ Hold" inertes** (Arian): botones "Subir a show"/"Editar"/"✕"/"+ Hold" presentes e idénticos al live pero sin mutar estado (mock documentado, como los exports de Herramientas).
- **D3 — Default julio 2026** y nav funcional; meses fuera de Jul-Sept → **estado vacío** (p.ej. "Sin shows ni holds este mes."). Documentado (solo se capturaron esos 3 meses; enriquecer más adelante si hace falta).
- **D4 — Datos = evidencia del live** (PATH A): los 16 eventos y sus campos (incl. ciudad, grafías "Marmarela/Mamarela") salen del recon, no de inferencia.

---

## 6. Testing (resumen; detalle en el plan TDD)
- **Seed:** 16 eventos; el hold es 2026-07-23 (Test Artist/Dentista/etapa confirmed); Bizza 2026-07-15; grafías Marmarela/Mamarela literales; Brenda Serna 4-sept con venue/city null.
- **MonthGrid:** julio 2026 pinta los chips en los días correctos (15, 18×2, 21, 23, 25, 26×2); la primera semana arranca con 2 huecos (1-jul = miércoles).
- **DayAgenda:** julio agrupa por día con los encabezados es-ES ("miércoles, 15 de julio"); el 23-jul muestra la tarjeta Hold con los 3 botones; el 18-jul muestra 2 shows.
- **Navegación:** next desde julio → agosto muestra los 3 shows de agosto; su agenda incluye "Los Canarios · Marmarela · Alicante · Mamarela"; prev vuelve a julio. Un mes sin datos (p.ej. junio) muestra el estado vacío.
- **Holds inertes:** pulsar "Subir a show"/"+ Hold" no cambia el estado (sin efecto observable / documentado).
- Regresión: el resto de la app no cambia; suite global verde.
