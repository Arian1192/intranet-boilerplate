# ConceptOne · Recalco — Fase A (reestructura de sub-nav + Dashboard financiero) · Design

**Fecha:** 2026-07-24
**Rama:** `feature/conceptone-recalco` (base `feature/mixmag-tagmag`)
**Tipo:** Calco fiel al live, presentacional, en memoria (sin Supabase). **Fase 1 de 4** del recalco de ConceptOne.

---

## 0. El recalco completo (contexto de las 4 fases)

El recon del 2026-07-24 (evidencia en `scratchpad/recon-conceptone/`, capturas por clic dentro de la SPA) confirmó que ConceptOne se ha alejado estructuralmente del live. El recalco se descompone en 4 fases, una rama, **una sola PR al cierre** (patrón Herramientas/Mixmag):

- **Fase A (este doc):** reestructura de sub-nav (rutas planas, quitar Artistas/Analítica/Logística-tab) + **Dashboard financiero** (6 tiles + afinar las 4 secciones). Calendario/Disponibilidad/Contactos quedan como **stubs**.
- **Fase B:** **Shows** — reescritura completa (lista de tarjetas ricas: código `C1-YYYY-NNN`, `Artista @ Evento`, etapa, venue+país, tipo de deal, fee con desglose BF/MF, estado pago, estado arte) + buscador + rango temporal + drawer Filtros multi-criterio + modelo de datos nuevo.
- **Fase C:** **Calendario** (`/calendario-c1`) — grid mensual + holds de artista ("Subir a show"/Editar/✕) + agenda por día.
- **Fase D:** **Disponibilidad** (`/disponibilidad`, generador de mensaje "N libres" con chips de estilo) + **Contactos** (`/contactos`, sub-tabs Venues | Empresas y contactos).

## 1. Contexto y objetivo de Fase A

Hoy (`src/features/booking/` + `src/features/modules/ConceptOneShell.tsx`) ConceptOne tiene sub-nav **Dashboard · Shows · Logística · Artistas · Analítica** anidada bajo `/conceptone/*`, y un dashboard con **7** KPI tiles de nombres viejos. El live tiene sub-nav **Dashboard · Shows · Calendario · Disponibilidad · Contactos** en **rutas planas**, y un dashboard financiero de **6** tiles.

Objetivo de Fase A: dejar la **estructura de navegación** y el **Dashboard** fieles al live, sin tocar todavía el interior de Shows (intacto) ni construir Calendario/Disponibilidad/Contactos (stubs).

### Criterios de éxito de Fase A
- Shell con 5 tabs exactas del live (Dashboard · Shows · Calendario · Disponibilidad · Contactos), `aria-current` en la activa; **sin** Logística/Artistas/Analítica.
- **Rutas planas** fieles al live (decisión de Arian): `/conceptone` (Dashboard), `/shows`, `/calendario-c1`, `/disponibilidad`, `/contactos`, todas bajo el shell de ConceptOne (layout route sin prefijo).
- Dashboard con **6 tiles** (labels y valores exactos del live, evidencia — §3) y las **4 secciones** (Advancing / Logística / Próximos shows / Notas urgentes) con copy y datos del live.
- Páginas muertas (`LogisticsPage`, `ArtistsPage`, `AnalyticsPage`) y sus hooks/artefactos huérfanos eliminados; sin referencias colgando.
- Verde total (tests, lint 0, tsc). Verificación Playwright ours-vs-live formal al **cierre del módulo** (tras Fase D).

---

## 2. Arquitectura

### 2.1 Rutas y shell (rutas planas)
El live mantiene el chrome/tabs de ConceptOne en las 5 pantallas pero con **URLs planas**. Se replica con un **layout route sin path** en `src/app/router.tsx`:

```tsx
<Route element={<ConceptOneShell />}>
  <Route path="/conceptone" element={<BookingDashboardPage />} />
  <Route path="/shows" element={<ShowsPage />} />
  <Route path="/calendario-c1" element={<CalendarioStubPage />} />
  <Route path="/disponibilidad" element={<DisponibilidadStubPage />} />
  <Route path="/contactos" element={<ContactosStubPage />} />
</Route>
```
- Sustituye al bloque anidado actual `<Route path="/conceptone" element={<ConceptOneShell/>}> …index/shows/logistica/artistas/analitica… </Route>`.
- **Colisión de rutas:** verificar que `/shows`, `/calendario-c1`, `/disponibilidad`, `/contactos` no chocan con ninguna otra ruta raíz existente (grep en `router.tsx`). Si alguna coincide, resolver antes.
- `ConceptOneShell.tsx`: `tabs` pasa a los 5 hrefs planos; se mantiene `AppLayout` con `module={{ name: 'Booking & Management', tabs, actionLabel: '+ Añadir show' }}`. La tab activa la resuelve `AppLayout`/`NavLink` por ruta (patrón existente).

### 2.2 Componentes
- **Nuevos:** `CalendarioStubPage`, `DisponibilidadStubPage`, `ContactosStubPage` (stubs mínimos: título de la pantalla + nota "Próximamente" fiel al estilo de stub del repo — se sustituyen en Fases C/D).
- **Modificados:**
  - `ConceptOneShell.tsx` — nuevos tabs + hrefs planos.
  - `KpiCard.tsx` — el mapa `label`/`color` deja de incluir `offer`; `pending-payment` → **"Pendiente cobro"**, `done` → **"Liquidado"** (ver §3.1). El componente en sí no cambia de API.
  - `BookingDashboardPage.tsx` — renderiza **6** tiles (no 7) y afina las 4 secciones al copy/datos del live.
  - `useBookingDashboard.ts` / fuente de datos — 6 tiles con los valores del live; datos de las 4 secciones.
- **Eliminados:** `LogisticsPage.tsx`, `ArtistsPage.tsx`, `AnalyticsPage.tsx` (+ `.test`), hooks `useLogistics.ts`, `useArtists.ts`, `useAnalytics.ts`, y componentes solo usados por ellas (`ArtistCard`, `ChartPlaceholder` si quedan huérfanos — verificar con grep antes de borrar). Retirar sus exports de los `index.ts`.

### 2.3 Datos
- Fuente local en memoria (modelo espejo). Los **6 tiles** se siembran con los importes/counts exactos del live (§3, evidencia). Las filas de las **4 secciones** se siembran con los ejemplos capturados (§3.2), estructura fiel; el volumen exacto de filas se afina en la verificación ours-vs-live de cierre.

---

## 3. Dashboard financiero — evidencia del live

### 3.1 Los 6 tiles (orden y valores exactos capturados)
| # | Label (live) | `status` (enum ours) | Valor capturado |
|---|---|---|---|
| 1 | TENTATIVE | `tentative` | **5.679,48 €** · 7 shows |
| 2 | CONFIRMADO | `confirmed` | **10.200,00 €** · 8 shows |
| 3 | CONTRATO | `contract` | **0,00 €** · 0 shows |
| 4 | PENDIENTE COBRO | `pending-payment` (relabel) | **0,00 €** · 0 shows |
| 5 | PENDIENTE LIQUIDAR | `pending-settlement` | **1.850,00 €** · 3 shows |
| 6 | LIQUIDADO | `done` (relabel) | **3.500,00 €** · 2 shows |

- **Se elimina** el tile `offer` ("OFERTA"). **Relabels:** `pending-payment` "Pendiente pago" → **"Pendiente cobro"**; `done` "Celebrado" → **"Liquidado"**. El enum `status` NO cambia (solo el diccionario de labels), para no propagar el cambio a otros consumidores del tipo — verificar que `DataTable.tsx` y demás usen el mismo diccionario o se actualicen en coherencia.
- Cada tile: importe `formatCurrency` (€, coma decimal, miles con punto) + label mayúsculas + "N shows". Reusar `KpiCard`.

### 3.2 Las 4 secciones (copy y muestras del live)
Panel de ayuda superior/inferior (copy exacto): *"El panel de atención no es una lista de tareas. Es lo que está en riesgo por fecha: cuanto más cerca el show, más arriba…"*

- **Advancing** — subtítulo "· Contrato · pagos · detalles", contador 4. Filas ordenadas por urgencia `D-n`: `D-2 · Pau Guilera @ the next` + badges de riesgo ("Contrato sin firmar", "Falta firmante") + fecha.
- **Logística** — subtítulo "· Itinerario · vuelos · set times", contador 4. Filas con badges "Pendiente logística" / "Sin set times" / "Gastos sin cerrar" + fecha.
- **Próximos shows** — filas: fecha · `D-n` · `Artista @ Evento` · Ciudad, País · badge etapa (Confirmado/Tentative) · estado pago (No abonado).
- **Notas urgentes** — botón `+` (abre textarea para nota); estado vacío **"Sin notas pendientes."**

Las 4 secciones **ya existen** en `BookingDashboardPage.tsx` (`ShowListItem`, `TaskList`, etc.); Fase A solo afina copy, subtítulos, badges, orden por `D-n` y estado vacío a lo capturado.

---

## 4. Costura Fase A ↔ Fase B (decisión aprobada)

El modelo rico de Shows llega en Fase B. Por eso en Fase A los 6 tiles se siembran como **valores directos del live (standalone)**. En Fase B, cuando exista el dataset de shows, los tiles pasarán a **derivarse** por agregación de etapa y se retirará el seed directo — misma costura que Herramientas (sembrar → derivar). Es un seam temporal **documentado**, no un hardcode permanente. (Aprobado por Arian.)

---

## 5. Decisiones / deltas conscientes

- **D1 — Rutas planas** (decisión de Arian): fidelidad de URL al live (`/shows`, `/calendario-c1`, `/disponibilidad`, `/contactos`) por encima de la convención de anidamiento del resto de módulos. Se implementa con layout route sin prefijo.
- **D2 — Shows intacto en Fase A** (aprobado): la `ShowsPage` actual (tabla genérica) se deja funcional hasta Fase B para que Fase A sea puramente estructura + dashboard. No se degrada a stub.
- **D3 — Enum `status` sin cambios**: solo se ajusta el diccionario de labels (quitar `offer` de los tiles, relabel cobro/liquidado). Evita propagar el cambio a otros consumidores del tipo.
- **D4 — Valores del dashboard = evidencia del live** (PATH A): los importes/counts de los 6 tiles y las muestras de las 4 secciones salen del recon capturado, no de inferencia. El detalle fino de filas se cierra en la verificación ours-vs-live del cierre de módulo.

---

## 6. Testing (resumen; el detalle va en el plan TDD)
- **Shell**: renderiza las 5 tabs correctas (Dashboard/Shows/Calendario/Disponibilidad/Contactos), NO renderiza Logística/Artistas/Analítica, `aria-current` en la ruta activa.
- **Rutas planas**: cada una de `/conceptone`, `/shows`, `/calendario-c1`, `/disponibilidad`, `/contactos` renderiza su página bajo el shell (los stubs muestran su título).
- **Dashboard**: 6 tiles con labels + valores exactos (Tentative 5.679,48€/7 … Liquidado 3.500,00€/2); ausencia de "OFERTA" y "CELEBRADO"; las 4 secciones con su copy/subtítulos y estado vacío de Notas.
- **Limpieza**: `grep -rn` de `LogisticsPage|ArtistsPage|AnalyticsPage|useLogistics|useArtists|useAnalytics|offer` sin referencias colgando (salvo el `status` enum si se conserva).
- Regresión: el resto de la app no cambia; suite global verde. Verificación Playwright ours-vs-live formal al cierre del módulo (tras Fase D).
