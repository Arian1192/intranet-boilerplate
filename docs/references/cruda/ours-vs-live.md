# CRUDA — ours vs live (2026-07-27)

Evidencia del live: `live-2026-07-27-*` (recon en solo lectura, 1440px, full-page).
Capturas nuestras: `ours-2026-07-27-*` (Playwright, 1440px) — **primera comparativa ours-vs-live del módulo**.

## Hallazgos del diff dirigido (Tarea 1)

Comparación a ojo entre `live-2026-07-27-30-pedidos.png`, `live-2026-07-27-31-pedido-CR00104-detalle.png`,
`live-2026-07-27-02-cruda-catalogo.png` (+ sus volcados `-text.txt` y `-json`) y el módulo tal como está en `main`.

### 1. Cabecera del detalle de pedido

Orden y estilo confirmados sobre la imagen (recorte a 2×):

`CR00104` (2xl, bold, `text-slate-900`) · píldora gris `Colección` · píldora azul claro `Reposición`
· …espacio… · `1650,00 €` alineado a la derecha, bold.

- Los dos badges van **dentro del `<h2>`** (el JSON del live lo confirma: `{"tag":"H2","text":"CR00104ColecciónReposición"}`).
- `Reposición` usa el mismo tono azul (`sky`) que ya usamos en la lista (`OrderList.tsx:64`), y va **después** del badge
  de línea de negocio.
- La fila meta inferior es: badge `Colección` · `TAGMAG` (oscuro) · `Fecha: 20 jul 2026` (gris) y, **en una segunda
  línea debajo**, `Reposición solicitada desde el portal de cliente.` en gris. No va inline en la misma fila.
  La spec (D3) la llama "nota en la fila meta"; el live la pinta como segunda línea del mismo bloque. Se implementa
  como segunda línea, que es lo que muestra la evidencia.
- El botón `Modificar` sigue a la derecha de ese bloque, centrado verticalmente respecto a las dos líneas.

### 2. Portal de reposiciones: cómo se pinta el email ya concedido

**Texto plano, no input con valor.** El live pinta **dos filas independientes**:

1. Una caja con borde, ancho completo de la tarjeta, con el email concedido `hello@carlospego.com` a la izquierda y
   el botón-texto `Quitar acceso` a la derecha.
2. **Debajo**, el formulario de invitación que ya teníamos, con el input **vacío** y su placeholder intacto, más el
   botón `Invitar`.

Prueba dura en el volcado del live: `inputs` incluye `{"type":"email","placeholder":"email@cliente.com","value":""}`
— el único input de email de la página está **vacío** aun teniendo un acceso concedido. El email concedido aparece en
`innerText` (`… hello@carlospego.com Quitar acceso Invitar …`) pero no como valor de ningún input.

> **Contradice a la spec.** §D4 dice *"cuando existe [`portalEmail`], el campo aparece con ese valor"*. La evidencia
> dice lo contrario: fila de acceso concedido (texto) **+** input de invitación vacío, coexistiendo. La Tarea 6 del
> plan ya previó este caso ("input con valor vs texto plano, según lo que confirmara la Tarea 1"), así que se
> implementa **según el live**: texto plano en fila propia y el input de invitar sin tocar.

### 3. Catálogo: ¿algún delta más allá de "productos más vendidos"?

No. Contrastado bloque a bloque contra `live-2026-07-27-02-cruda-catalogo-text.txt`:

| Bloque del live | Estado en ours |
|---|---|
| `COLECCIONES` — `Todas 1` / `Top Sales 1 ✎` / `Sin colección` + `+ Nueva colección` | `CollectionChips` + cabecera de `CatalogoPage` — coincide |
| Buscador `Buscar por nombre o SKU…` | dentro de `ProductsTable` — coincide |
| Tabla de productos: `3 variantes`, `Top Sales`, `340 uds`, `16,50 €`, margen `8,50 €` | derivado del seed (3 variantes 150+150+40, price 16,5, cost 8) — coincide |
| `PRODUCTOS MÁS VENDIDOS`: `960` uds · `16.358,35 €` | seed dice `860` / `14708.35` — **único delta (D5)** |
| `ALERTAS DE STOCK`: `340 uds · valor a coste 2720,00 €`, `1 variante(s)…`, `Algodón / L / Crudo 40 / 50` | derivado del seed — coincide |
| `EXTRAS`: 3 filas (`0,70 €` / `2,50 €` / `0,15 €`), modo `Por unidad (× prendas)` | seed `extras` — coincide |
| `VARIABLES DE PRODUCTO`: 3 acabados / 6 tallas / 2 colores + textos | seed `variables` — coincide |

### 4. Delta adicional detectado, **fuera del alcance del plan**

En el live, `Anular`, `Descontar del stock` y `Hoja de pedido (PDF)` están **en la misma fila que la barra de estados**,
alineados a la derecha. Nosotros pintamos `Anular` en esa fila (con `ml-auto`) pero bajamos los otros dos botones a una
**fila extra** debajo (`OrderDetail.tsx:41-44`). Es una fila de más respecto al live.

No está en la spec (§2 solo lista D1–D5) ni en ninguna tarea del plan, así que **no se toca en esta rama**: queda
anotado aquí como delta consciente y pendiente.

---

## Comparativa de capturas (Tarea 8)

- **Viewport:** 1440px, `deviceScaleFactor = 1`, `fullPage`.
- **Ours:** `http://127.0.0.1:5187/cruda…` sobre `feature/recalco-cruda` (build de dev de Vite).
- **Live:** capturas del recon en solo lectura del 2026-07-27 (`live-2026-07-27-*`).
- **Métrica:** RMS y % de píxeles cambiados (umbral por canal > 16) sobre el **área común** de cada par; las alturas
  difieren porque nuestro `fullPage` incluye el fondo vacío bajo el contenido.
- **Errores de consola durante la captura de las 4 vistas: 0.**

| Vista | Ruta | Ours | Live | Comparado | RMS | Px cambiados |
|---|---|---:|---:|---:|---:|---:|
| Pedidos (lista) | `/cruda` | `ours-2026-07-27-pedidos.png` (1620x1200) | `live-2026-07-27-30-pedidos.png` (1440x900) | 1440x900 | 13,06 % | 10,61 % |
| Detalle `CR00104` | `/cruda` → fila `CR00104` | `ours-2026-07-27-pedido-CR00104-detalle.png` (1440x1200) | `live-2026-07-27-31-pedido-CR00104-detalle.png` (1440x1005) | 1440x1005 | 10,47 % | 8,18 % |
| Catálogo | `/cruda/catalogo` | `ours-2026-07-27-catalogo.png` (1440x1200) | `live-2026-07-27-02-cruda-catalogo.png` (1440x1069) | 1440x1069 | 10,51 % | 8,20 % |
| Analítica | `/cruda/analitica` | `ours-2026-07-27-analitica.png` (1440x1200) | `live-2026-07-27-94-analitica.png` (1440x900) | 1440x900 | 12,27 % | 9,55 % |

Métricas en crudo: `comparison-metrics.json`. Manifiesto de captura: `ours-capture-manifest.json`.

### Discrepancias explicadas

**De entorno / cromo global (afectan a las 4 vistas, no son del módulo):**

1. **TopNav.** Live: logo del cliente + `/ CRUDA ⌄`. Ours: cuadro `I` + `Intranet` + desplegable `Espacios` + `/ CRUDA`.
   Es el cromo global del boilerplate, fuera de alcance por encargo.
2. **Usuario.** Live `test / Admin / T`; ours `Test User / Admin / TE`.
3. **Panel de Ayuda.** Live: cabecera `CRUDA` con la píldora de consejo del módulo ("El stock se descuenta al confirmar
   el pedido…"). Ours: panel genérico "Ayuda / Pregunta lo que quieras de esta pantalla…". Cromo global, fuera de alcance.
4. **Token de marca.** El acento del boilerplate es violeta (`brand-600`) y el del live azul marino/`indigo`. Afecta a
   botones primarios (`+ Nuevo pedido`, `+ Nuevo producto`), chips activos, barras de progreso y la barra del gráfico
   (nuestra barra de julio sale violeta, la del live gris). Es el tema global, no el módulo.
5. **Emoji de producto.** La celda de producto del catálogo usa 👕; el Chromium headless de la captura no tiene fuente de
   emoji y lo pinta como caja. En navegador normal se ve igual que en el live.
6. **Altura de página.** Nuestro `fullPage` deja fondo vacío bajo el contenido (1200 px de viewport) mientras que el live
   recorta antes; por eso las alturas no coinciden y la comparación se hace sobre el área común.

**De contenido del módulo — verificadas iguales tras esta rama:**

7. Pedidos: los 5 pedidos en el mismo orden y con los mismos importes, `17.264,85 €` / `5 pedidos` / `2540,25 €`,
   `Colección 17.264,85 €` / `Producción 0,00 €`, y las 6 tarjetas de fase con `6424,60 €` / `8300,00 €` / ceros /
   `2540,25 €` y sus contadores `2 / 2 / 0 / 0 / 0 / 1`.
8. Detalle `CR00104`: cabecera con los dos badges, importe `1650,00 €`, barra de 7 estados con `Confirmado` marcado,
   fila meta con la nota de portal, línea única con `100 / 16,50 € / 16,50 € / 1650,00 €`, `Bruto` = `Total` = `1650,00 €`
   y el portal con `hello@carlospego.com` + `Quitar acceso`.
9. Catálogo: `960 uds` / `16.358,35 €`, `340 uds`, margen `8,50 €`, alerta `40 / 50`, 3 extras y las 3 listas de variables.
10. Analítica: se mueve sola con el seed (mismo `phaseAccum` y `orderSummary`), sin tocar una línea de la página — DD3
    confirmado. Muestra `17.264,85 €`, `5 pedidos`, `8300,00 €`, `960`, `16.358,35 €`.

**Deltas del módulo detectados en esta comparativa y NO corregidos (fuera del alcance de la spec y del plan):**

11. **Fila de acciones del detalle.** Ver §4 de los hallazgos: el live pone `Anular`, `Descontar del stock` y
    `Hoja de pedido (PDF)` en la misma fila que la barra de estados; nosotros bajamos los dos últimos a una fila extra.
12. **Etiquetas de las tarjetas de fase.** El live pinta el nombre de la fase como *chip* de estado con color propio
    (`Borrador` gris, `Confirmado` azul, `En producción` ámbar, `Enviado` índigo, `Entregado` verde claro, `Facturado`
    verde), igual que `CrudaStatusChip`. Nosotros lo pintamos como texto plano `text-slate-600`. Afecta a Pedidos y a
    Analítica por igual (mismo componente `PhaseAccumCards`).
13. **Desbordamiento horizontal en Pedidos.** La fila de fases tiene `overflow-x-auto` en ambos, pero en el live el
    documento sigue midiendo 1440 px mientras que el nuestro llega a **1620 px** (la columna `1fr` del grid no tiene
    `min-w-0`, así que el contenido empuja la página). Por eso `ours-2026-07-27-pedidos.png` mide 1620 de ancho.
14. **Cabeceras de tabla del catálogo.** El live las escribe en caja normal (`Producto`, `Tipo`, `Colección`, `Stock`,
    `Precio`, `Margen`; `Producto/Unidades/Valor`; `Variante/Stock/Mín.`) y nosotros en versalitas/mayúsculas. En la tabla
    de líneas del pedido sí coincidimos (el live también usa mayúsculas allí).
15. **Nits menores del detalle:** el live escribe `Extras` en el botón de la línea y nosotros `Extras (0)`; los campos
    `PVP €` y `×` están vacíos en el live y con `0` en el nuestro.

Ninguno de los cuatro últimos puntos aparece en la spec (§2 solo lista D1–D5) ni en el plan; se dejan anotados para una
rama posterior en lugar de ampliar el alcance de ésta.
