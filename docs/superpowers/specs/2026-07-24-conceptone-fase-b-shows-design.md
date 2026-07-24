# ConceptOne · Recalco — Fase B (Shows) · Design

**Fecha:** 2026-07-24
**Rama:** `feature/conceptone-recalco` (continúa sobre Fase A)
**Tipo:** Calco fiel al live, presentacional, en memoria. **Fase 2 de 4** del recalco de ConceptOne.

---

## 1. Contexto y objetivo

Fase A dejó la sub-nav plana y el Dashboard financiero, con `ShowsPage` **intacta** (tabla genérica placeholder). Fase B **reescribe Shows** para calcar el live: lista de **tarjetas ricas** con buscador, selector de rango temporal y drawer de Filtros multi-criterio, sobre un **modelo de datos nuevo** sembrado con los 14 shows reales del live (evidencia del recon, `scratchpad/recon-conceptone/c1-shows.json` + `c1-shows-filtros.json` + `fase-map.json`).

### Criterios de éxito
- `/shows` muestra **14 ShowCards** fieles al live (código `C1-2026-0NN`, `Artista @ Evento`, badge de etapa [+ "● Excepción"], `Venue, País`, deal, fee/BF/MF, estado de pago, estado de arte), con header **"Shows · 14 shows"**.
- Buscador (artista/evento/venue), selector de **rango** (2 selects Desde/Hasta) y **drawer Filtros** (Etapa/Fase/Estado de pago/Artista) presentes y **funcionales**.
- **Deep-link `?status=<etapa>`** desde los tiles del dashboard pre-selecciona el filtro Etapa (conserva la navegación de Fase A).
- Seed = los **14 shows exactos** (§3), con `fase` por evidencia (§3.1).
- Verde total (tests, lint 0, tsc). Verificación Playwright ours-vs-live formal al **cierre del módulo** (tras Fase D).

### Corrección de la costura A↔B (hallazgo del recon)
La spec de Fase A previó **derivar** los 6 tiles del dashboard agregando los shows. El recon de Fase B lo **desmiente**: la lista sale filtrada por el rango por defecto ("Última semana → Todo el futuro"), así que los tiles agregan un **conjunto mayor** que los 14 visibles (p.ej. Confirmado: tiles 10.200€/8 vs 6 confirmados visibles = 8.500€). **Decisión (Arian):** los tiles se quedan con su **seed standalone** de Fase A (ya son evidencia exacta) y **NO se derivan**. Fase B **no toca** los tiles ni `getBookingDashboard()`; ambas pantallas quedan sembradas por evidencia, independientes.

---

## 2. Arquitectura

### 2.1 Modelo de datos (`src/features/booking/` — tipos y seed)
Hoy `ShowsPage` usa `useShows()` + `DataTable` con un modelo pobre (`{ id, name, client, date, status, amount }`). Se sustituye por un modelo rico. **Nuevo tipo** (ubicación: `@/types` si ahí viven `Show`/`ShowStatus`, o un `types.ts` local del feature — seguir donde está hoy `ShowStatus`):

```ts
export type DealType = 'All In' | 'Landed' | '+++';
export type PaymentStatus =
  | 'No abonado' | 'Parcialmente abonado' | 'Pendiente liquidar' | 'Liquidado' | 'Incidencia';
export type ArtStatus = 'Arte no subido' | 'Arte pendiente' | 'Arte subido';
export type ShowFase =
  | 'tentative' | 'confirmed' | 'contract' | 'pagos' | 'liquidacion' | 'liquidado' | 'cancelado';

export interface Show {
  id: string;
  code: string;              // "C1-2026-012"
  date: string | null;       // "18 jul 2026" | null (muestra "—")
  artist: string;            // "Abdon"
  event: string;             // "FUNDAYS"
  venue: string | null;      // "Bassment" | null
  country: string | null;    // "España" | null
  etapa: ShowStatus;         // enum existente (badge visible + filtro Etapa + deep-link ?status=)
  fase: ShowFase;            // dimensión workflow (filtro Fase; evidencia §3.1)
  dealType: DealType;
  fee: number;               // 3000
  bf: number;                // 600  (Booking Fee)
  mf: number;                // 449.58 (Management Fee)
  paymentStatus: PaymentStatus;
  artStatus: ArtStatus;
  exception: boolean;        // "● Excepción" junto al badge (solo C1-2026-006)
}
```
- **`etapa`** reutiliza el enum `ShowStatus` (tentative/offer/confirmed/contract/pending-payment/pending-settlement/done). Etiquetas del filtro Etapa (6, sin `offer`): Tentative/Confirmado/Contrato/Pendiente cobro/Pendiente liquidar/Liquidado → mapean a tentative/confirmed/contract/pending-payment/pending-settlement/done.
- **`fase`** es un enum NUEVO (7 valores). Etiquetas del filtro Fase: Tentative/Confirmado/Contrato/Pagos/Liquidación/Liquidado/Cancelado.
- Moneda: todos los fees capturados están en €; se formatea con `formatCurrency`. (El live admite otras monedas por deal — fuera de alcance; se documenta como simplificación.)

### 2.2 Componentes (`src/features/booking/components/`)
- **Nuevos:**
  - `ShowCard` — una fila-tarjeta por show (layout §4).
  - `ShowsToolbar` — header "Shows · {N} shows" + buscador + botón de rango (abre popover) + botón "Filtros".
  - `RangoPopover` — popover con 2 `<select>` nativos (Desde / Hasta) (§4.2).
  - `FiltrosDrawer` — panel lateral con 4 `<select>` (Etapa/Fase/Estado de pago/Artista) (§4.3).
- **Retirados:** `DataTable` (+ `.test`) si tras Fase B no lo usa nadie (verificar con grep; ShowsPage era su único consumidor probable).
- **Reusar** primitivos de `@/components/ui` (`Card`, `Input`, `Select`, `Button`, `Badge`, `Drawer`/equivalente si existe; si no, panel propio).

### 2.3 Página y datos
- `ShowsPage` orquesta: estado local de `busqueda`, `rango` ({desde, hasta}), `filtros` ({etapa, fase, pago, artista}); lee `?status=` para inicializar `filtros.etapa`; aplica todo sobre `shows` y renderiza la lista de `ShowCard` + `ShowsToolbar` + `FiltrosDrawer`.
- Seed de los 14 shows: donde hoy vive `useShows`/`MockRepository.getShows` (seguir el patrón existente del repo). Sustituir el seed pobre por los 14 shows del §3.

---

## 3. Seed — los 14 shows (evidencia del live)

Orden tal como los devuelve el live (por fecha ascendente, "—" al final):

| # | code | date | artist @ event | venue, país | etapa | fase | deal | fee | bf | mf | pago | arte | exc |
|---|------|------|----------------|-------------|-------|------|------|-----|----|----|------|------|-----|
| 1 | C1-2026-012 | 18 jul 2026 | Abdon @ FUNDAYS | Bassment, España | Tentative | tentative | All In | 0 | 0 | 0 | No abonado | Arte no subido | — |
| 2 | C1-2026-006 | 18 jul 2026 | Los Canarios @ FUEGO | Edén Ibiza, España | Confirmado | confirmed | Landed | 3000 | 600 | 449.58 | No abonado | Arte no subido | ● |
| 3 | C1-2026-015 | 21 jul 2026 | Test Artist @ SIGHT | Ku Barcelona, España | Confirmado | confirmed | All In | 0 | 0 | 0 | No abonado | Arte no subido | — |
| 4 | C1-2026-014 | 25 jul 2026 | Florentia @ Summer Opening Festival | Paseo de Santiago, Torreperogil, España | Liquidado | liquidado | Landed | 1000 | 200 | 0 | Liquidado | Arte pendiente | — |
| 5 | C1-2026-019 | 26 jul 2026 | Pau Guilera @ the next | Marina Beach Club, España | Confirmado | confirmed | Landed | 700 | 140 | 0 | No abonado | Arte no subido | — |
| 6 | C1-2026-021 | 26 jul 2026 | Abdon @ SIGHT | Ku Barcelona, España | Confirmado | confirmed | All In | 1000 | 200 | 200 | No abonado | Arte no subido | — |
| 7 | C1-2026-018 | 01 ago 2026 | Milan @ Casa del Mar | Casa del Mar, USA | Tentative | tentative | All In | 350.56 | 70.11 | 0 | No abonado | Arte no subido | — |
| 8 | C1-2026-020 | 01 ago 2026 | Los Canarios @ Solart Fest | Hangar 37, España | Confirmado | confirmed | +++ | 2000 | 400 | 400 | No abonado | Arte no subido | — |
| 9 | C1-2026-005 | 04 sept 2026 | Brenda Serna @ Alcazar de San Juan | (sin venue/país) | Liquidado | liquidado | All In | 2500 | 500 | 0 | Parcialmente abonado | Arte no subido | — |
| 10 | C1-2026-013 | 18 sept 2026 | Sergio Saffe @ el Tebo | el Tebo, Chile | Tentative | tentative | All In | 875 | 175 | 0 | No abonado | Arte no subido | — |
| 11 | C1-2026-016 | 25 sept 2026 | Marian Ariss @ Kevin de Vries Cordoba | La Fábrica, Argentina | Tentative | tentative | All In | 1226.96 | 245.39 | 0 | No abonado | Arte no subido | — |
| 12 | C1-2026-017 | 26 sept 2026 | Marian Ariss @ Kevin de Vries Buenos Aires | Mandarine Park, Argentina | Tentative | tentative | All In | 1226.96 | 245.39 | 0 | No abonado | Arte no subido | — |
| 13 | C1-2026-011 | 26 sept 2026 | ART NO LOGIA @ Jiwa | Boho Beer Garden, Reino Unido | Confirmado | confirmed | All In | 1800 | 360 | 272 | No abonado | Arte no subido | — |
| 14 | C1-2026-007 | — | Andrea Castells @ Sephora Opening | (sin venue/país) | Tentative | tentative | All In | 2000 | 400 | 0 | No abonado | Arte no subido | — |

### 3.1 `fase` por evidencia (recon `fase-map.json`, filtro Fase aplicado uno a uno)
Tentative (6): 007, 012, 013, 016, 017, 018 · Confirmado (6): 006, 011, 015, 019, 020, 021 · Liquidado (2): 005, 014. Las fases Contrato/Pagos/Liquidación/Cancelado existen como opción pero **ningún show las tiene** con estos datos. En este dataset `fase` coincide con `etapa`, pero se modela y siembra como campo independiente (evidencia del filtro Fase, no inferencia).

---

## 4. Layout (capturas `c1-shows.png`, `c1-shows-filtros.png`, `range-open2.png`)

### 4.1 ShowCard (fila)
Izquierda→derecha en una fila con separadores: **fecha** (o "—") · **código** en mono/gris · **`Artista @ Evento`** (nombre en negrita) · **badge de etapa** (color por etapa; junto a él "● Excepción" en rojo si `exception`) · **`Venue, País`** (o vacío si null) · **deal** (`· All In`/`· Landed`/`· +++`) · **fee** `formatCurrency` grande · sub-línea **`BF {bf} · MF {mf}`** · **estado de pago** (chip: No abonado gris / Parcialmente abonado ámbar / Liquidado verde) · **estado de arte** (texto tenue: "Arte no subido"/"Arte pendiente"). Fila clicable-inerte en Fase B (el detalle del show queda fuera de alcance). Ajustar spacing/tokens al PNG.

### 4.2 ShowsToolbar + RangoPopover
- Header: **"Shows"** + contador **"{N} shows"**.
- Buscador: `Input type="search"` con placeholder **"Buscar artista, evento, venue…"** (name `buscar-shows`).
- Botón de rango: etiqueta dinámica **"{Desde} → {Hasta}"** (por defecto "Última semana → Todo el futuro"); al pulsarlo abre `RangoPopover` con 2 `<select>`:
  - **Desde:** Última semana *(def)* · Últimos 3 días · Último mes · Último año · Todo el pasado
  - **Hasta:** Todo el futuro *(def)* · Próximos 3 días · Próxima semana · Próximo mes · Próximo año · Hasta hoy
- Botón **"Filtros"** abre `FiltrosDrawer`.

### 4.3 FiltrosDrawer (4 selects nativos)
- **Etapa:** Todas las etapas · Tentative · Confirmado · Contrato · Pendiente cobro · Pendiente liquidar · Liquidado
- **Fase:** Todas las fases · Tentative · Confirmado · Contrato · Pagos · Liquidación · Liquidado · Cancelado
- **Estado de pago:** Todos los estados · No abonado · Parcialmente abonado · Pendiente liquidar · Liquidado · Incidencia
- **Artista:** Todos los artistas · {lista alfabética de artistas — usar la del recon `c1-shows-filtros.json`, ~70 nombres, en `data/artistas.ts`}

### 4.4 Ayuda contextual (copy del live, minor)
Dos textos de ayuda ("?"): *"El fee va en la moneda del deal — Si el acuerdo es en dólares, se guarda en dólares y se convierte con el tipo de cambio del show…"* y *"Cerrar gastos es lo que congela la liquidación — Mientras no cierres gastos, la cifra sigue moviéndose…"*. Incluir como tooltip/popover del icono "?" si aparece en la toolbar del live; si el spacing no lo justifica, omitir y documentar (delta menor).

---

## 5. Comportamiento (filtrado)

`ShowsPage` deriva `shownShows` de `shows` aplicando, en este orden, todos los criterios activos (AND):
- **Búsqueda:** `q` no vacío → match case-insensitive en `artist`, `event` o `venue`.
- **Etapa:** `filtros.etapa` != 'todas' → `show.etapa === etapaSeleccionada`. Inicializada desde `?status=` (deep-link de los tiles).
- **Fase:** `filtros.fase` != 'todas' → `show.fase === faseSeleccionada`.
- **Estado de pago:** `filtros.pago` != 'todos' → `show.paymentStatus === pago`.
- **Artista:** `filtros.artista` != 'todos' → `show.artist === artista`.
- **Rango:** interpretar `desde`/`hasta` como ventana relativa a **hoy = 2026-07-24** (constante `HOY` documentada; el live usa el reloj real, pero fijarlo mantiene el calco determinista y testeable). Parsear `date` (formato "DD mmm YYYY" es-ES) a `Date`; shows con `date: null` se muestran siempre (no se filtran por rango). Con el rango por defecto (Última semana→Todo el futuro) se ven los 14. **Delta consciente:** `HOY` fijo en vez del reloj real.

El contador del header refleja `shownShows.length`.

---

## 6. Decisiones / deltas conscientes
- **D1 — Tiles standalone** (Arian): no se derivan de los shows; se quedan con el seed de Fase A. Corrige la costura A↔B prevista. Fase B no toca `getBookingDashboard()`.
- **D2 — `fase` por evidencia** (Arian, PATH A): recapturada del filtro Fase del live (§3.1), no inferida. En este dataset coincide con `etapa` pero se modela aparte.
- **D3 — Deep-link `?status=`** se conserva: los tiles del dashboard (Fase A) siguen navegando a `/shows?status=<etapa>` y pre-seleccionan el filtro Etapa.
- **D4 — `HOY` fijo (2026-07-24)** para el filtro de rango, en vez del reloj real: calco determinista y testeable. Documentado.
- **D5 — Moneda única (€)** y detalle de show fuera de alcance (fila inerte). El multi-moneda y el detalle se dejan para más adelante si el live lo exige.

---

## 7. Testing (resumen; detalle en el plan TDD)
- **Modelo/seed:** los 14 shows con sus valores exactos (código, fee/bf/mf, etapa, fase, pago, arte); `fase` según §3.1 (p.ej. C1-2026-005 → 'liquidado', C1-2026-007 → 'tentative').
- **ShowCard:** pinta código, `Artista @ Evento`, badge de etapa, venue/país (o su ausencia), deal, fee/BF/MF con `formatCurrency`, pago y arte; "● Excepción" solo en C1-2026-006.
- **Filtrado:** búsqueda por artista/evento/venue; cada uno de los 4 filtros reduce la lista correctamente; `?status=confirmed` inicializa Etapa=Confirmado y muestra solo confirmados; rango por defecto muestra 14; el contador del header cuadra.
- **Rango/Filtros UI:** el popover muestra las opciones Desde/Hasta exactas; el drawer muestra los 4 selects con sus opciones exactas.
- Regresión: el dashboard (tiles) y el resto de la app no cambian. Suite global verde.
