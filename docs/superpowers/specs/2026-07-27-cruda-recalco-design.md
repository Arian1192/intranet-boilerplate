# CRUDA — recalco al live (2026-07-27) · Design

**Rama:** `feature/recalco-cruda` (base `main`, `7659541`) · **PR:** una sola al cierre.
**Módulo:** `src/features/cruda/` + `src/features/modules/CrudaShell.tsx`.
**Evidencia:** `docs/references/cruda/live-2026-07-27-*` (recon en solo lectura del 2026-07-27, 1440px full-page). Las capturas `cruda-*.png` de 2026-07-09/10 quedan como histórico.

## 1. Por qué, y qué NO hay que hacer

El gap-analysis del 2026-07-21 pedía para CRUDA: *"quitar Analítica, añadir filtros + dinero acumulado por fase en Pedidos"*. **El recon del 27-jul desmiente las tres cosas**:

- `/cruda/analitica` **existe y está viva** en el live, como link solo-icono (`title="Analítica"`) al final de la sub-nav — exactamente como la tenemos (`CrudaShell.tsx:21`). **No se quita nada.**
- Los filtros de Pedidos **ya existen** en `OrderList.tsx` (buscador + `<select>` de línea de negocio + `<select>` de estados) y coinciden opción por opción con el live.
- "Dinero acumulado por fase" **ya existe** (`PhaseAccumCards.tsx`), con las 6 fases correctas y la fila con scroll horizontal.
- `eur()` (`data/format.ts`) **ya reproduce la inconsistencia del live**: punto de millar solo cuando la parte entera tiene ≥5 dígitos (`17.264,85 €` pero `6424,60 €`). Es fidelidad deliberada, está documentada en el propio fichero, y **no se "arregla"**.

Lo que queda es un desfase de datos y cuatro nits de fidelidad en el detalle de pedido. El módulo está sano; esta rama lo pone al día.

## 2. Alcance

### D1 — Seed de pedidos al día (5 pedidos, no 4)
El live tiene un pedido nuevo, el más reciente, primero de la lista:

| Campo | Valor |
|---|---|
| id | `CR00104` |
| cliente | `TAGMAG` |
| fecha | `20 jul 2026` |
| línea | `Colección` |
| flags | `Reposición` |
| estado | `Confirmado` |
| importe | `1650,00 €` |

Su única línea (de `live-2026-07-27-31-pedido-CR00104-detalle-text.txt`): `(Test) Camiseta A&F · Algodón` · SKU `4878test02` · talla `M` · color `Crudo` · precio `16,50 €` · neto `16,50 €` · subtotal `1650,00 €`. Cantidad = 100 (`1650 / 16,50`; el live la pinta dentro de un `<input>`, por eso no sale en el volcado de texto). Sin extras: `Bruto: 1650,00 €` = `Total: 1650,00 €`.

Arrastra dos agregados, ambos verificados aritméticamente contra el live:

- `orderSummary`: `activeAmount 15614.85 → 17264.85`, `activeCount 4 → 5`, `coleccionAmount 15614.85 → 17264.85`. (`activos` = todos los pedidos, incluido el facturado; es como ya funcionaba.)
- `phaseAccum.Confirmado`: `1 / 6650 → 2 / 8300`. `Borrador` (2 / 6424,60 €) y `Facturado` (1 / 2540,25 €) no cambian.

### D2 — Detalle de pedido: badge `Reposición` en la cabecera
Live: `CR00104` `Colección` `Reposición` `1650,00 €`. `OrderDetail.tsx:22-27` solo pinta el badge de línea de negocio. Se añade el segundo badge cuando `order.reposicion`, con el mismo estilo que ya usa `OrderList.tsx` para la lista (`bg-sky-100 text-sky-700`).

### D3 — Detalle: nota de origen en la fila meta
Live: `Colección · TAGMAG · Fecha: 20 jul 2026 · Reposición solicitada desde el portal de cliente.` — donde nosotros pintamos `Resp.: …` (`OrderDetail.tsx:56`). No son excluyentes: `CR00103` sí tiene responsable (`Israel Cuenca`) y `CR00104` tiene nota de portal. Se añade un campo opcional `portalNote?: string` al modelo `Order`, sembrado solo en `CR00104` con el texto literal.

### D4 — Detalle: portal de reposiciones con acceso ya concedido
Live, bloque `PORTAL DE REPOSICIONES (CRUDA)`: muestra el email concedido `hello@carlospego.com`, un botón `Quitar acceso` y un botón `Invitar`. Nuestro bloque (`OrderDetail.tsx:70-79`) tiene el input vacío y solo `Invitar`.

Se añade `portalEmail?: string` al modelo. Cuando existe, el campo aparece con ese valor y sale además `Quitar acceso`. Cuando no, se queda como hoy (placeholder `email@cliente.com`, solo `Invitar`). Copy y footnote ya coinciden literalmente.

### D5 — Catálogo: cifras de "productos más vendidos"
Único delta del Catálogo. Live: `(Test) Camiseta A&F · 960 uds · 16.358,35 €`. Seed hoy: `soldUnits 860`, `soldValue 14708.35`.

El resto del Catálogo ya cuadra al detalle contra `live-2026-07-27-02-cruda-catalogo-text.txt`: los 6 bloques, las 3 variantes, `340 uds`, `16,50 €` de precio, `8,50 €` de margen, `340 uds · valor a coste 2720,00 €`, la variante bajo mínimo (`L / Crudo · 40 / 50`), los 3 extras con sus precios y las tres listas de variables. **Confirmar, no reescribir.**

## 3. Decisiones de diseño

**DD1 — mock inerte para las acciones nuevas.** `Quitar acceso`, `Invitar`, `Hoja de pedido (PDF)` y `Descontar del stock` son botones fieles al live pero **sin acción**, siguiendo la decisión D5 del módulo Herramientas (el live no muestra ningún "Próximamente", así que tampoco nosotros). La barra de estados del detalle sigue siendo interactiva en local como hoy. Delta consciente, se documenta en la PR.

**DD2 — no se toca `eur()`.** Ver §1. Cualquier "corrección" del separador de millar es una regresión de fidelidad.

**DD3 — no se toca la sub-nav ni `/cruda/analitica`.** Ya son fieles. La Analítica sigue repitiendo "Dinero acumulado por fase" con las mismas cifras que Pedidos: al cambiar el seed, ambas pantallas deben moverse juntas (`PhaseAccumCards` se alimenta del mismo `phaseAccum`, así que sale gratis — verificar que sigue siendo así).

**DD4 — sin persistencia.** Todo in-memory, como el resto del módulo.

## 4. Fuera de alcance

- Los años `2023/2024/2025/2027` de `/cruda/analitica`: el recon solo capturó `2026` (el activo). No se inventa dato.
- Aplicar los filtros de Pedidos en el live para ver estados con datos: `En producción`, `Enviado` y `Entregado` están a cero hoy, así que no hay evidencia de cómo se pinta una barra de progreso llena en esas fases. Se deja como está.
- Modales de producto y alta de pedido: no divergen.
- TopNav, panel de Ayuda y cromo global.

## 5. Verificación

- TDD estricto: test antes de implementación, un commit por tarea.
- `npx vitest run` en verde (baseline de `main`: 224 archivos / 722 tests), `npx tsc --noEmit` limpio, `npm run lint` con 0 warnings. Ojo: `data/seed.test.ts` fija el número de pedidos y `pages/PedidosPage.test.tsx` recorre lista/detalle — ambos se actualizan **antes** de tocar el seed.
- **Playwright ours-vs-live a 1440px** en Pedidos (lista), detalle de `CR00104`, Catálogo y Analítica → `docs/references/cruda/ours-2026-07-27-*.png` + `ours-vs-live.md` con la tabla de discrepancias explicadas. **Es la primera comparativa ours-vs-live que tendrá CRUDA**: hoy no existe ni una captura nuestra.
- 0 errores de consola.
