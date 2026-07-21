# Fase 8 — CRM · Pipeline + Crecimiento · Design

**Fecha:** 2026-07-13
**Rama objetivo:** `feature/fase8-crm-pipeline` (desde `feature/fase6-crm`)
**Tipo:** Calco **100% fiel** al live (pixel-perfect + modelo de datos alineado a las futuras tablas de Supabase). Presentacional, in-memory.

---

## 1. Contexto y objetivo

Cierra el módulo CRM: reemplaza los dos placeholders `PipelinePage` y `CrecimientoPage` por las pantallas reales del live (`/crm/pipeline`, `/crm/crecimiento`), calcadas pixel-perfect.

**Requisito explícito del usuario:** *"100% fiel al live porque cuando tengamos acceso a Supabase deberemos adaptarnos a las tablas"*. Por tanto el **modelo de datos del seed espeja las tablas probables** (`pipeline_stages` por empresa + `opportunities`), y las etapas son las **exactas** capturadas del live (no inventadas).

Referencias: `docs/references/crm/live-pipeline-etra-data.png` (pipeline con datos), `live-pipeline-empty-state.png` (empresa sin etapas), `live-pipeline-computed.json` (tokens), `live-crecimiento.png`.

### Criterios de éxito
- `/crm/pipeline`: cabecera + select de empresa (funcional) + botones Etapas/+ Oportunidad (stubs) + 3 stat cards calculadas + kanban con las etapas exactas de cada empresa y tarjetas de oportunidad pixel-perfect; "Mover ◄ ▶" cambia la etapa en memoria; empresas sin etapas muestran el empty-state calcado.
- `/crm/crecimiento`: sección Venta cruzada (tabla derivada de `orgs`) + sección Clientes en riesgo (tabla + select de umbral).
- Verde total (tests, lint 0, tsc). Verificación Playwright vs referencias.

---

## 2. Datos capturados del live (fidelidad 100%)

### Empresas del grupo (select, orden exacto)
`ConceptOne`, `CRUDA`, `Etra Agency`, `Euphoric Media`, `Mixmag Spain`, `TAGMAG` (= `GROUP_COMPANIES` ya existente en `crm/data/seed.ts`).

### Etapas por empresa (exactas)
- **ConceptOne**: `Interés` → `Oferta enviada` → `Confirmando fecha` → `Contratado` → `Caído`
- **Etra Agency**: `Nuevo` → `Contactado` → `Cualificado` → `Propuesta` → `Negociación` → `Ganada` → `Perdida`
- **CRUDA / Euphoric Media / Mixmag Spain / TAGMAG**: **sin etapas configuradas** → empty-state: texto `"<Empresa> no tiene etapas configuradas todavía."` + botón `Configurar etapas`.

### Oportunidad real observada (Etra · Contactado)
`Carhartt` · `48.000,00 €` · forecast `12.000 €` (**probabilidad implícita 25%** en Contactado) · Cierre `01 oct 2026` · nota `Mostrar la oficina reformada · 15 sept 2026` · owner `IC` (avatar verde).

### Semántica de etapas
- **Ganadas** (won): etapa `Contratado` (ConceptOne) / `Ganada` (Etra). Cuentan en el stat GANADAS.
- **Perdidas** (lost): `Caído` (ConceptOne) / `Perdida` (Etra). Excluidas de "abierto" y de "ganadas".
- **Abiertas** (open): el resto.

> Probabilidades por etapa: solo `Contactado=25%` es observable. El resto se asignan con valores de venta razonables (ver §4) y se marcan como **asunción a sustituir cuando llegue Supabase**. La probabilidad vive en la etapa (no en la oportunidad), como en el live (forecast = Σ importe × prob. de su etapa).

---

## 3. Tokens pixel-perfect (medidos)

### Cabecera
- Select empresa: clase `input` (`h-9 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm`, ~154px).
- `Etapas`: `btn-secondary whitespace-nowrap`. `+ Oportunidad`: `btn-primary whitespace-nowrap`.

### Stat cards (3 en fila)
- Contenedor `rounded-2xl border border-slate-200 bg-white p-5`; label uppercase `text-xs text-slate-400`; valor `text-2xl font-bold`; sublabel `text-xs text-slate-400`. Orden: `PIPELINE ABIERTO` (valor + `N oportunidades`), `FORECAST PONDERADO` (valor + `Σ valor × probabilidad`), `GANADAS` (valor **verde/emerald** + `N cerradas`).

### Columna del kanban
- Cabecera: nombre de etapa `font-semibold text-slate-800` + badge contador (slate-100) + `Σ€` a la derecha (`text-xs text-slate-400`). Columnas en fila con **scroll horizontal** (`overflow-x-auto`); ancho de columna acorde a tarjeta (~288px).

### Tarjeta de oportunidad (tokens exactos)
- Contenedor: `rounded-lg border border-slate-200 bg-white p-3 shadow-sm` (~272px).
- Título (nombre org/cliente): `font-medium text-slate-800`.
- Importe: `font-bold` (formato `48.000,00 €`).
- Avatar owner: `grid shrink-0 place-items-center rounded-full font-semibold text-white` ~`h-[22px] w-[22px]` `text-[9px]`, color de fondo por owner (ej. `#059669` emerald-600).
- `Cierre: <fecha>`: `text-xs text-slate-400`.
- Nota: `↳ <descripcion> · <fecha>` `text-xs text-slate-400 truncate`.
- Footer: fila `◀  Mover  ▶` (botones flecha izq/der + label `Mover`), `text-xs text-slate-400`, borde superior sutil.

### Empty-state (empresa sin etapas)
- Texto centrado `text-sm text-slate-500`: `"<Empresa> no tiene etapas configuradas todavía."` + botón `Configurar etapas` (`btn-secondary`, stub).

### Crecimiento (tablas)
- Sección título uppercase `text-sm font-semibold text-slate-400` (`VENTA CRUZADA (CROSS-SELL)`, `CLIENTES EN RIESGO (INACTIVOS)`) + subtítulo `text-sm text-slate-500`.
- Tabla en `Card` (borde slate-200 redondeado), cabecera `text-sm font-semibold text-slate-400`, filas separadas por `divide-y divide-slate-100`, celdas `px-4 py-3 text-sm`.
- Chip empresa "Trabaja con"/"Empresas": `inline-flex rounded-full bg-blue-600/10 px-2.5 py-0.5 text-xs font-medium text-blue-600` (mismo que `OrgDetail`).
- Chips "Oportunidad de ofrecer": `rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500` (empresas del grupo que el cliente NO usa).
- "Última actividad": `Nunca` en `text-amber-600` (naranja) o fecha.
- Select "Sin actividad en N meses": clase `input`.

---

## 4. Modelo de datos (seed espejando Supabase)

Módulo `src/features/crm/data/pipeline.ts` (+ tipos en `seed.ts` o un `pipeline-seed.ts`). Reusa `GROUP_COMPANIES` y `orgs`.

```ts
// pipeline_stages (por empresa)
export interface PipelineStage {
  id: string;          // `${companyKey}-${slug}`
  company: string;     // uno de GROUP_COMPANIES
  name: string;        // 'Interés', 'Nuevo', ...
  order: number;       // 0..n
  probability: number; // 0..1  (weight para forecast)
  outcome?: 'won' | 'lost'; // marca etapas terminales
}

// opportunities
export interface Opportunity {
  id: string;
  orgId: string;       // FK a CrmOrg (cliente)
  orgName: string;     // denormalizado para la tarjeta
  company: string;     // pipeline al que pertenece
  stageId: string;     // FK a PipelineStage
  amount: number;      // €
  ownerInitials: string;
  ownerColor: string;  // hex del avatar
  closeDate: string;   // ISO; se muestra 'dd mmm yyyy'
  note?: string;       // '<descripcion> · <fecha>'
  createdAt: string;   // para "última actividad" en Crecimiento
}
```

### Seed
- `STAGES: PipelineStage[]` con las etapas **exactas** de ConceptOne (5) y Etra Agency (7). Probabilidades: ConceptOne `Interés .1 / Oferta enviada .4 / Confirmando fecha .7 / Contratado 1 (won) / Caído 0 (lost)`; Etra `Nuevo .1 / Contactado .25 / Cualificado .4 / Propuesta .6 / Negociación .8 / Ganada 1 (won) / Perdida 0 (lost)`. (Contactado=.25 es el observado; el resto asunción documentada.)
- `COMPANIES_WITH_PIPELINE = ['ConceptOne', 'Etra Agency']`; las otras 4 → sin etapas (empty-state).
- `opportunities: Opportunity[]`: incluye la real (Carhartt en Etra·Contactado) + **un puñado representativo** repartido por etapas de ConceptOne y Etra (mismo criterio que en Clientes, donde sembramos 10 orgs representativas). `orgId`/`orgName` referencian `orgs` existentes.

### Helpers puros (testeables) — `pipeline.ts`
- `stagesFor(company): PipelineStage[]` (ordenadas por `order`).
- `opportunitiesFor(company): Opportunity[]`.
- `groupByStage(opps, stages): { stage, opps, total }[]`.
- `pipelineStats(opps, stages): { openTotal, openCount, forecast, wonTotal, wonCount }`
  - `open` = opps cuya etapa no es `won` ni `lost`; `openTotal` = Σ amount; `forecast` = Σ amount×stage.probability.
  - `won` = opps en etapa `outcome==='won'`; `wonTotal`/`wonCount`.
- `moveOpportunity(opps, oppId, dir: -1|1, stages): Opportunity[]` — mueve la opp a la etapa anterior/siguiente (clamp en extremos), inmutable.

### Crecimiento — helpers `crecimiento.ts` (derivan de `orgs` + `opportunities`)
- `crossSell(orgs): { org, worksWith: string, offer: string[] }[]` — clientes (`roles` incluye 'Cliente') con **exactamente una** empresa en `worksWith`; `offer` = `GROUP_COMPANIES` \ `worksWith`. `unassignedCount` = clientes con `worksWith` vacío (para la nota "Además, N clientes sin ninguna empresa asignada").
- `atRisk(orgs, opps, months): { org, lastActivity: string | null, companies: string[] }[]` — última actividad = fecha más reciente de `opportunities` del org (`createdAt`/`closeDate`); si no hay o supera el umbral `months`, aparece; `null` → "Nunca". Opciones del select: `3`, `6`, `12` meses (default 6).

---

## 5. Componentes y páginas

```
src/features/crm/
  data/
    pipeline.ts        # PipelineStage/Opportunity types export? (tipos en seed) + STAGES + opportunities + helpers
    pipeline.test.ts
    crecimiento.ts     # crossSell + atRisk (derivan de orgs/opps)
    crecimiento.test.ts
  components/
    PipelineStatCards.tsx   # 3 stat cards (recibe stats)
    OpportunityCard.tsx     # tarjeta calco + Mover ◀▶ (onMove)
    PipelineColumn.tsx      # cabecera etapa + lista de OpportunityCard
    PipelineBoard.tsx       # scroll horizontal de columnas / empty-state
    CrossSellTable.tsx
    AtRiskTable.tsx
  pages/
    PipelinePage.tsx        # estado: empresa seleccionada + opps locales (para Mover); compone header+stats+board
    PipelinePage.test.tsx
    CrecimientoPage.tsx     # compone las 2 secciones + select umbral
    CrecimientoPage.test.tsx
```

- **`PipelinePage`**: `useState` empresa (default `ConceptOne`) + `useState` opps (copia del seed, para `moveOpportunity`). Header (select empresa funcional, Etapas/+ Oportunidad stubs). Stats vía `pipelineStats`. Board: si la empresa no tiene etapas → empty-state; si tiene → `PipelineBoard` con columnas y tarjetas; `onMove(oppId, dir)` actualiza estado.
- **`OpportunityCard`**: recibe `opp` + `onMove`; deshabilita ◀ en primera etapa y ▶ en última.
- **`CrecimientoPage`**: sección cross-sell (`CrossSellTable` + nota unassigned) + sección riesgo (select meses + `AtRiskTable`).

---

## 6. Alcance (YAGNI)

**Dentro:** ambas pantallas pixel-perfect; select empresa funcional (cambia etapas+opps+stats); kanban con etapas exactas + empty-state; tarjetas calco + "Mover" funcional (in-memory); stats calculadas; Crecimiento con ambas tablas + select de umbral funcional; modelo de datos alineado a Supabase.

**Fuera:**
- 🚫 Panel **Ayuda** global (fase Incidencias).
- ⏸ **`+ Oportunidad`**, **`Etapas`**, **`Configurar etapas`** → stubs inertes (sin formularios).
- 🚫 Persistencia / red / drag&drop real (el movimiento es por botones "Mover", como el live).

---

## 7. Deltas intencionales
- Marca **violeta** (brand) donde el live usa gris/negro en botones primarios. GANADAS en verde/emerald = igual que el live.

## 8. Estrategia de tests
- `pipeline.test.ts`: `stagesFor`/`opportunitiesFor`/`groupByStage`/`pipelineStats` (open vs won/lost, forecast ponderado con el caso real 48.000×.25=12.000)/`moveOpportunity` (avanza, retrocede, clamp).
- `crecimiento.test.ts`: `crossSell` (solo clientes con 1 empresa; offer = complemento; unassignedCount), `atRisk` (umbral, "Nunca").
- Componentes: `OpportunityCard` (título/importe/fecha/nota/avatar; ◀ deshabilitado en 1ª etapa; onMove), `PipelineColumn` (cabecera nombre+contador+Σ€), `CrossSellTable`/`AtRiskTable` (filas + chips).
- Páginas: `PipelinePage` (empresa con etapas muestra board; empresa sin etapas muestra "no tiene etapas configuradas"; Mover reordena; stats correctas), `CrecimientoPage` (dos secciones, select cambia umbral).
- Verificación Playwright: `/crm/pipeline` y `/crm/crecimiento` vs referencias (stat cards, columnas exactas ConceptOne/Etra, tarjeta Carhartt, empty-state CRUDA, tablas crecimiento).

## 9. Riesgos
- Probabilidades de etapa (salvo Contactado .25) son asunción → documentadas en el seed para sustituir con Supabase. No afectan al layout.
- El "Mover" funcional in-memory no persiste (esperado en esta fase).
