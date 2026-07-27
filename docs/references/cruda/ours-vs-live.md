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
