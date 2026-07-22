# Fase C — Mixmag/TAGMAG · Campañas (calco pixel-perfect)

**Fecha:** 2026-07-22
**Rama:** `feature/mixmag-tagmag-campanas` (sobre `feature/mixmag-tagmag`)
**Requisito clave (usuario):** 100% fiel al live; el modelo de datos espeja tablas Supabase. Pixel-perfect.

## Objetivo

Reemplazar el placeholder "En construcción" de la pestaña **Campañas** de Mixmag y TAGMAG (`/mixmag/campanas`, `/tagmag/campanas`) por un calco fiel y funcional del embudo de ventas del live, con vistas **Embudo** y **Kanban**. Una única página parametrizada sirve a ambas revistas (`useOutletContext<Magazine>`).

Fuera de alcance (posterior): editor de campaña, "+ Campaña" real, arrastrar/mover en Kanban, "Generar contenidos".

## Contexto del live (fuente de verdad)

Referencias en `docs/references/mixmag/`:
- `live-mixmag-campanas-embudo.png`, `live-mixmag-campanas-kanban.png`
- `live-tagmag-campanas-embudo.png`, `live-tagmag-campanas-kanban.png`
- `live-campanas-tokens.json` (texto de ambas vistas + token `+ Campaña`)

Datos observados (idénticos en ambas revistas):
- Header: buscar "Buscar campaña o anuncian…" · **"En el aire 0,00 €"** · **"Ganado 1500,00 €"** · toggle Embudo/Kanban · `+ Campaña`.
- Etapas del embudo: TENTATIVA 0 · PROPUESTA ENVIADA 0 · NEGOCIACIÓN 0 · **ACEPTADA 1 (1500,00 €)** · EN CURSO 0 · COMPLETADA 0.
- Fila/tarjeta: ACEPTADA · **Campaña Test 1** · **Cold Cloud SL** · hasta 29 jul · **1500,00 €**.
- Botón `+ Campaña`: bg `#44444C` (rgb 68,68,76), radius 8px, `text-sm`, `font-medium`, `px-4 py-2`.
- Kanban: columnas por etapa; la de ACEPTADA expandida (crece para llenar el ancho), el resto colapsadas verticales a ambos lados. Cabecera de columna: chip de etapa + contador. Tarjeta: nombre (bold) · cliente (gris) · importe (bold) · "hasta 29 jul" (gris).

## Arquitectura

- **Ruta:** `/mixmag/campanas` y `/tagmag/campanas` → `<CampanasPage />` (reemplaza `EnConstruccionPage`; la ruta `contenidos` ya usa `ContenidosPage` de Fase B; `revistas`/`index` intactas).
- **Página parametrizada:** `CampanasPage` lee `magazine = useOutletContext<Magazine>()`, obtiene etapas/campañas vía helpers de `campanas.ts` (keyed por `magazine.id`). Cero hardcoding de revista.
- **Datos separados:** `src/features/redaccion/data/campanas.ts` (espejo de `contenidos.ts`/`crm/data/pipeline.ts`).
- **Reutilización:** `formatCurrency` de `@/lib/format` (es-ES EUR → "1.500,00 €"); `SegmentedControl` de `@/components/ui` para el toggle Embudo/Kanban.

## Modelo de datos (espejo Supabase)

```ts
import type { MagazineId } from './contenidos'; // 'mixmag' | 'tagmag'

// tabla campaign_stages — etapas del embudo por revista
export interface CampaignStage {
  id: string;            // p.ej. 'mix-aceptada'
  magazine: MagazineId;  // FK
  label: string;         // 'TENTATIVA', 'ACEPTADA', ...
  order: number;
  bucket: 'aire' | 'ganado'; // TENTATIVA/PROPUESTA/NEGOCIACIÓN=aire · ACEPTADA/EN CURSO/COMPLETADA=ganado
  tone: 'slate' | 'emerald'; // ACEPTADA=emerald; resto=slate
}

// tabla campaigns
export interface Campaign {
  id: string;
  magazine: MagazineId;  // FK
  stageId: string;       // FK → CampaignStage.id
  name: string;          // 'Campaña Test 1'
  client: string;        // 'Cold Cloud SL' (denormalizado)
  clientId?: string;     // FK futuro (org)
  amount: number;        // 1500
  untilLabel: string;    // 'hasta 29 jul' (snapshot del live)
}
```

**Denormalización/snapshot:** `client` denormalizado (documentado; join futuro por `clientId`). `untilLabel` es snapshot textual (el live calcula fechas; congelamos el texto para tests deterministas).

### Etapas sembradas (ambas revistas, `order` 1..6)

1. TENTATIVA — `bucket: 'aire'`, `tone: 'slate'`
2. PROPUESTA ENVIADA — `aire`, `slate`
3. NEGOCIACIÓN — `aire`, `slate`
4. ACEPTADA — `ganado`, `emerald`
5. EN CURSO — `ganado`, `slate`
6. COMPLETADA — `ganado`, `slate`

### Campañas sembradas

Una por revista (el live muestra la misma en ambas):

| magazine | stageId | name | client | amount | untilLabel |
|----------|---------|------|--------|--------|------------|
| mixmag | mix-aceptada | Campaña Test 1 | Cold Cloud SL | 1500 | hasta 29 jul |
| tagmag | tag-aceptada | Campaña Test 1 | Cold Cloud SL | 1500 | hasta 29 jul |

Stats derivadas: **En el aire = 0 €** (Σ amount con bucket 'aire'), **Ganado = 1500 €** (Σ amount con bucket 'ganado').

## Helpers (`campanas.ts`)

```ts
stagesFor(magazine: MagazineId): CampaignStage[]                 // ordenadas por order
campaignsFor(magazine: MagazineId): Campaign[]
interface CampaignFilter { query?: string; stageId?: string }
filterCampaigns(list: Campaign[], f: CampaignFilter): Campaign[] // por name/client (case-insensitive) + stageId; inmutable
groupByStage(list: Campaign[], stages: CampaignStage[]): { stage: CampaignStage; items: Campaign[] }[]
countByStage(list, stages): Record<string, number>
sumByStage(list, stages): Record<string, number>                // Σ amount por etapa (para el "1500,00 €" de ACEPTADA)
campaignStats(list, stages): { enElAire: number; ganado: number }
```

## Componentes (unidades pequeñas y aisladas)

1. **`CampanasToolbar`** — buscar "Buscar campaña o anuncian…" · "En el aire {formatCurrency(enElAire)}" + "Ganado {formatCurrency(ganado)}" (Ganado en `font-bold`) · (derecha) `SegmentedControl` Embudo/Kanban + botón `+ Campaña` (`#44444C`, `type="button"`, inerte). Controlado por props/callbacks.
2. **`StageBox`** — caja de etapa del embudo: label (uppercase; `tone` emerald/slate cuando tiene items, `text-slate-400`/`text-slate-300` si 0) + contador + importe opcional (`sumByStage`, solo si >0, junto al número). `button` clicable con `aria-pressed` (filtro por etapa). Las 6 se distribuyen (`grid grid-cols-6` o `flex` equidistante).
3. **`CampaignRow`** (Embudo) — fila full-width `rounded border`; chip de etapa (tono) · nombre (`font-medium`) · cliente (gris) · untilLabel (gris) · importe (`font-bold`, derecha). Tinte verde suave cuando la etapa es `emerald` (ACEPTADA), como el live.
4. **`CampaignCard`** (Kanban) — `rounded border bg-white p-4`; nombre (`font-medium`) · cliente (gris `text-sm`) · importe (`font-bold`) · untilLabel (gris `text-sm`).
5. **`CampanaKanbanColumn`** — normal: header (chip de etapa por `tone` + contador) + tarjetas; **expandida crece** (`flex-1 min-w-[16rem]`) para llenar el ancho como el live. Colapsada (sin campañas): `w-10 shrink-0`, label vertical rotado (`[writing-mode:vertical-rl] rotate-180`), gris tenue. Distingue vía `data-testid="campana-column"` + `data-collapsed`.
6. **`CampanasPage`** — orquesta: `magazine` de outlet; estado local (`view: 'embudo'|'kanban'`, `query`, `stageFilter`); aplica `filterCampaigns`; stats con `campaignStats`; render Embudo (StageBoxes + CampaignRows o vacío) / Kanban (columnas). `stageFilter` se resetea al cambiar de vista.

## Interactividad (funcional in-memory; nunca muta el live ni persiste)

- Búsqueda → filtra por `name`/`client`.
- StageBox clicable → filtra al estado (toggle; segunda pulsación limpia).
- Toggle Embudo/Kanban → cambia vista (resetea `stageFilter`).
- `+ Campaña` → stub inerte (`type="button"`, sin acción).
- **Arrastrar/mover** → diferido (documentado; el live usa drag; no inventamos botones → pixel-perfect).

## Deltas intencionales vs live

- ACEPTADA en emerald (=live). `+ Campaña` `#44444C`. Marca violeta `brand-*` no se filtra en los grises/negros.

## Testing

- **TDD por componente:** `StageBox` (label/count/importe opcional/tone/aria-pressed/count 0), `CampaignRow` (campos + tinte emerald en ACEPTADA), `CampaignCard` (campos), `CampanaKanbanColumn` (normal vs colapsada, `data-collapsed`), `CampanasToolbar` (buscar + stats formateadas + toggle + `+ Campaña` inerte).
- **Datos:** `campanas.test.ts` — 6 etapas por revista con buckets/tones correctos; 1 campaña por revista; `campaignStats` (aire 0 / ganado 1500); `sumByStage` (ACEPTADA 1500); `filterCampaigns` (query name/client + stageId); inmutabilidad.
- **Integración `CampanasPage`:** toggle Embudo↔Kanban; parametrización (Mixmag y TAGMAG, ambas con su Campaña Test 1); stats "En el aire 0,00 € / Ganado 1.500,00 €"; StageBox ACEPTADA filtra a 1 fila; columna ACEPTADA con tarjeta y resto colapsadas; sin `brand-*` en el árbol.
- **Verificación final:** Playwright ours↔live ambas revistas y vistas; 0 errores de consola.

## Criterios de aceptación

1. `/mixmag/campanas` y `/tagmag/campanas` renderizan `CampanasPage` (no placeholder).
2. Embudo: header con stats correctas, 6 cajas de etapa (ACEPTADA=1 con 1500,00 € y emerald, resto 0), 1 fila de campaña con datos exactos.
3. Kanban: 6 columnas; ACEPTADA expandida con tarjeta correcta, resto colapsadas verticales.
4. Parametrización: idéntico en Mixmag y TAGMAG (cada una su seed).
5. Filtros y toggle funcionan; `+ Campaña` inerte.
6. Suite verde, lint 0, tsc limpio, sin `brand-*` en grises; reusa `formatCurrency` y `SegmentedControl`.
