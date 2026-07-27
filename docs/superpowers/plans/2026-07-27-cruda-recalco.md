# CRUDA — recalco al live · Plan de implementación

> **Para agentes de trabajo:** SUB-SKILL REQUERIDO: usa `superpowers:subagent-driven-development` o `superpowers:executing-plans` para ejecutar este plan tarea a tarea. Los pasos usan checkbox (`- [ ]`).

**Spec:** `docs/superpowers/specs/2026-07-27-cruda-recalco-design.md` — léela entera antes de la Tarea 1. Su §1 dice explícitamente **qué NO hay que hacer**; el gap-analysis viejo estaba equivocado en tres puntos.
**Rama:** `feature/recalco-cruda` (ya creada, base `main` `7659541`).
**Evidencia:** `docs/references/cruda/live-2026-07-27-*`.

## Restricciones globales

- **TDD estricto**: un test que falla antes de cada implementación. Un commit por tarea, mensaje en es-ES.
- **No tocar `data/format.ts`.** Su `eur()` reproduce a propósito la inconsistencia del separador de millar del live (`17.264,85 €` en KPIs vs `6424,60 €` en las tarjetas de fase, en la misma pantalla). "Arreglarlo" es una regresión.
- **No tocar la sub-nav ni `/cruda/analitica`**: ya son fieles al live.
- Todo in-memory, sin persistencia. Los botones nuevos son mock inerte (DD1).
- es-ES. Target ES2020: nada de `Array.prototype.at()`. Lint `--max-warnings 0`, `tsc` limpio.
- Baseline de `main` que hay que mantener en verde: **224 archivos / 722 tests**.

---

## Tarea 1 — Diff dirigido contra las capturas (sin código)

- [ ] Abrir `live-2026-07-27-30-pedidos.png`, `…-31-pedido-CR00104-detalle.png` y `…-02-cruda-catalogo.png` y compararlas con el módulo en la mano.
- [ ] Confirmar sobre la imagen (el volcado de texto no lo resuelve):
  1. La disposición de la cabecera del detalle: orden y estilo de `CR00104` · badge `Colección` · badge `Reposición` · importe.
  2. Cómo se pinta el email ya concedido en `PORTAL DE REPOSICIONES`: ¿input con valor, o texto plano con el botón `Quitar acceso` al lado?
  3. Que el Catálogo no tiene más deltas que las cifras de "productos más vendidos" (§D5 de la spec).
- [ ] Anotar las respuestas en `docs/references/cruda/ours-vs-live.md` bajo `## Hallazgos del diff dirigido (Tarea 1)`.
- [ ] Si algo contradice la spec, **parar y decirlo** antes de seguir.
- [ ] Commit: `docs(cruda): hallazgos del diff dirigido contra el live del 27-jul`.

## Tarea 2 — Modelo: `portalNote` y `portalEmail`

- [ ] Test en `data/seed.test.ts`: `Order` admite `portalNote?` y `portalEmail?`; `CR00104` los trae con los valores del live.
- [ ] Añadir ambos campos opcionales a `Order` en `data/types.ts` con un comentario que indique que espejan columnas del pedido en Supabase.
- [ ] Verde. Commit: `feat(cruda): el modelo Order admite nota de portal y email de acceso`.

## Tarea 3 — Seed: quinto pedido `CR00104` y agregados

- [ ] Actualizar primero los tests que fijan los valores viejos: `data/seed.test.ts` (número de pedidos) y `pages/PedidosPage.test.tsx` (lista y detalle).
- [ ] Nuevos valores esperados: lista de **5** pedidos encabezada por `CR00104 · TAGMAG`, `20 jul 2026 · Colección`, chip `Reposición`, estado `Confirmado`, `1650,00 €`.
- [ ] `orderSummary` → `activeAmount 17264.85`, `activeCount 5`, `coleccionAmount 17264.85`. `invoicedAmount` y `produccionAmount` no cambian.
- [ ] `phaseAccum.Confirmado` → `count 2`, `amount 8300`. Las demás fases, intactas.
- [ ] La línea de `CR00104`: `(Test) Camiseta A&F · Algodón`, SKU `4878test02`, talla `M`, color `Crudo`, `qty: 100`, `price: 16.5`, `discountPct: 0`, sin extras → subtotal `1650,00 €` y `headerTotal 1650`. Comprobar con `orderLinesTotal` que da exactamente 1650.
- [ ] `portalNote: 'Reposición solicitada desde el portal de cliente.'` y `portalEmail: 'hello@carlospego.com'` solo en este pedido.
- [ ] Verde. Commit: `feat(cruda): seed al día con el pedido CR00104 y sus agregados`.
- [ ] **Comprobar de paso** que `/cruda/analitica` refleja las cifras nuevas sin tocarla (se alimenta del mismo `phaseAccum`). Si no lo hace, es un hallazgo: anotarlo.

## Tarea 4 — Detalle: badge `Reposición` en la cabecera

- [ ] Test en `components/OrderDetail.test.tsx`: para un pedido con `reposicion: true` se pintan los dos badges (`Colección` y `Reposición`); para uno sin el flag, solo el de línea de negocio.
- [ ] Implementar en `OrderDetail.tsx:22-27`, reutilizando el mismo estilo que ya usa `OrderList.tsx` (`bg-sky-100 text-sky-700`).
- [ ] Verde. Commit: `feat(cruda): badge Reposición en la cabecera del detalle`.

## Tarea 5 — Detalle: nota de origen en la fila meta

- [ ] Test: con `portalNote`, la fila meta muestra `Reposición solicitada desde el portal de cliente.`; con `responsible` (p.ej. `CR00103`), sigue mostrando `Resp.: Israel Cuenca`. Los dos casos conviven.
- [ ] Implementar en `OrderDetail.tsx:54-60`.
- [ ] Verde. Commit: `feat(cruda): nota de origen del pedido en la fila meta`.

## Tarea 6 — Detalle: portal con acceso ya concedido

- [ ] Test: con `portalEmail`, el bloque muestra ese email y aparece `Quitar acceso` junto a `Invitar`; sin él, se comporta como hoy (placeholder `email@cliente.com`, solo `Invitar`).
- [ ] Implementar en `OrderDetail.tsx:70-79` según lo que confirmara la Tarea 1 (input con valor vs texto plano). Botones inertes (DD1).
- [ ] El copy del bloque y la footnote ya coinciden literalmente con el live: no tocarlos.
- [ ] Verde. Commit: `feat(cruda): portal de reposiciones con acceso concedido`.

## Tarea 7 — Catálogo: cifras de productos más vendidos

- [ ] Test en `data/seed.test.ts` o `pages/CatalogoPage.test.tsx`: el producto vendió `960` unidades por `16.358,35 €`.
- [ ] `data/seed.ts` → `soldUnits: 960`, `soldValue: 16358.35`.
- [ ] Verificar que el resto del Catálogo ya cuadra contra `live-2026-07-27-02-cruda-catalogo-text.txt` (6 bloques, 3 variantes, `340 uds`, margen `8,50 €`, alerta `40 / 50`, 3 extras, 3 listas de variables). Si algo no cuadra, es un hallazgo: anotarlo y corregirlo.
- [ ] Verde. Commit: `feat(cruda): cifras de productos más vendidos al día`.

## Tarea 8 — Verificación ours-vs-live y cierre

- [ ] `npx vitest run`, `npx tsc --noEmit`, `npm run lint` — los tres limpios. Pegar las cifras reales en el informe, no "todo verde".
- [ ] Playwright a **1440px** sobre nuestra app: `docs/references/cruda/ours-2026-07-27-{pedidos,pedido-CR00104-detalle,catalogo,analitica}.png`. **Es la primera comparativa ours-vs-live de CRUDA**: hoy no existe ninguna captura nuestra.
- [ ] Completar `docs/references/cruda/ours-vs-live.md`: tabla `Vista | ours | live | RMS | px cambiados` + sección de **discrepancias explicadas**. Ninguna sin explicar; las de entorno (logo, usuario, panel de Ayuda) se nombran como tales.
- [ ] Verificar 0 errores de consola.
- [ ] Commit final + **abrir UNA sola PR** con base `main` titulada `CRUDA — recalco al live (2026-07-27)`, dejando claro en la descripción que el gap-analysis viejo pedía tres cosas que el live desmiente (no se quita Analítica, los filtros ya existían, el dinero por fase ya existía) y que el trabajo real fue desfase de datos + 4 nits del detalle.
