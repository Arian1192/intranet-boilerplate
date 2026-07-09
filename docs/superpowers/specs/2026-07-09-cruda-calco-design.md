# Fase 4 — CRUDA (calco pixel-perfect)

**Fecha:** 2026-07-09
**Rama:** `feature/fase4-cruda-catalogo` (creada desde `feature/fase3-comunicacion-produccion`)
**Objetivo:** Construir el módulo **CRUDA** (catálogo, pedidos y control de stock de ropa/merch) como copia visual exacta (pixel-perfect) de la web de referencia, con sus **3 vistas**: **Pedidos** (`/cruda`), **Catálogo** (`/cruda/catalogo`) y **Analítica** (`/cruda/analitica`). Hoy `CrudaShell` es un placeholder (`ModuleShell`); se sustituye por un shell real con rutas anidadas y páginas.

**Fuentes de verdad** (en `docs/references/cruda/`):
1. **7 capturas** full-page: `cruda-pedidos-list.png`, `cruda-pedido-detail.png`, `cruda-nuevo-pedido.png`, `cruda-catalogo.png`, `cruda-producto-detail.png` (modal producto), `cruda-analitica.png`.
2. **4 snapshots de accesibilidad** (texto/estructura exactos): `cruda-pedido-detail-snapshot.md`, `cruda-catalogo-snapshot.md`, `cruda-producto-modal-snapshot.md`, `cruda-analitica-snapshot.md`.
3. **Colores computados** extraídos de la web real (ver §5), y web navegable (solo lectura) `https://bookings.conceptoneagency.com/cruda`.

**Restricción invariable:** todo es **presentacional**. Nada persiste ni llama al repositorio con mutaciones. Botones (`+ Nuevo pedido`, `+ Nuevo producto`, `Guardar`, `Crear pedido`, `+ Añadir línea`, `Descontar del stock`, `Invitar`…), forms, steppers de estado, líneas editables, segmented controls y chip-editors solo manipulan **estado de UI local** y **datos seed en memoria**. No se crea/edita/borra ningún dato real. Cuando exista el `.sql`, se adaptará la fuente de datos (repositorio agnóstico ya presente) **sin reescribir la UI**.

**Decisiones tomadas (brainstorming):**
- Todo el módulo (las **3 vistas**, Analítica incluida) en **una sola fase**.
- **Calco visual** + **interacción presentacional completa** (misma profundidad que Euphoric/Etra): abrir detalle, editar líneas en memoria, cambiar estado, abrir modales/forms.
- **Analítica no es una tab de texto**: se accede por el **icono de gráfica** del header (patrón `iconActions` idéntico a Euphoric). Las 2 tabs de texto son Pedidos y Catálogo.
- Datos seed hardcodeados tomados de la web real.

---

## 1. Rutas y navegación

Rutas reales confirmadas en la web:

| Tab / acción | Ruta | Página |
|---|---|---|
| Pedidos (tab texto) | `/cruda` (index) | `PedidosPage` |
| Catálogo (tab texto) | `/cruda/catalogo` | `CatalogoPage` |
| Analítica (icono header) | `/cruda/analitica` | `AnaliticaPage` |

### `router.tsx`
Sustituir la ruta plana `<Route path="/cruda" element={<CrudaShell />} />` por rutas anidadas (patrón idéntico a `/euphoric`):

```tsx
<Route path="/cruda" element={<CrudaShell />}>
  <Route index element={<PedidosPage />} />
  <Route path="catalogo" element={<CatalogoPage />} />
  <Route path="analitica" element={<AnaliticaPage />} />
</Route>
```

### `CrudaShell.tsx` (reescritura)
Reemplaza el placeholder `ModuleShell` por el patrón `AppLayout` + `<Outlet/>` (como `EuphoricShell`):

```tsx
const tabs = [
  { label: 'Pedidos', href: '/cruda' },
  { label: 'Catálogo', href: '/cruda/catalogo' },
];
// module.iconActions = [{ icon: BarChart2, href: '/cruda/analitica', label: 'Analítica' }]
```

La tab "Pedidos" (href === `/cruda`) usa el matching `end` genérico ya existente en `TopNav` (href === module.href) para estar activa solo en el índice. El header compartido (tile violeta + nombre módulo "CRUDA") se mantiene idéntico; el único añadido es el `iconAction` de gráfica, que ya soporta `AppLayout`/`TopNav` (usado por Euphoric).

---

## 2. Estructura de archivos

Nueva carpeta `src/features/cruda/` (patrón Euphoric):

```
src/features/cruda/
  data/
    types.ts        # tipos UI: Producto, Variante, Pedido, LineaPedido, Extra, Coleccion, Variables, ...
    seed.ts         # constantes seed (productos, pedidos, extras, colecciones, variables, analítica)
    format.ts       # formato ES: eur(6650) → "6650,00 €"; eurMiles(15614.85) → "15.614,85 €"; fecha "07 jul 2026"
    labels.ts       # labels y orden de estados de pedido
  components/
    CrudaStatusChip.tsx    # chip de estado de pedido (8 estados, colores exactos §5)
    PhaseAccumCards.tsx    # "Dinero acumulado por fase" (tarjetas horizontales con barra brand)
    OrderList.tsx          # lista maestra de pedidos (buscador + 2 selects filtro + items)
    OrderSummaryPanel.tsx  # panel derecho: En curso / Facturado / Por línea de negocio
    OrderDetail.tsx        # detalle: header total + stepper estado + acciones + meta + Modificar
    OrderLinesTable.tsx    # tabla líneas editable (Cant/Dto/PVP/x/Extras/✕) + "Añadir línea" + totales
    NewOrderForm.tsx       # form "Nuevo pedido" (segmented línea negocio + campos)
    ProductModal.tsx       # modal Producto (form madre + tabla variantes editable)
    VariableChips.tsx      # editor de chips Acabados / Tallas / Colores (Añadir… + ✕)
    CollectionChips.tsx    # chips de colecciones (Todas / <colección> ✎ / Sin colección + "Nueva colección")
    ProductsTable.tsx      # tabla de productos del catálogo
    ExtrasTable.tsx        # tabla de extras (Extra/Tipo/Modo/Precio)
    TopProductsTable.tsx   # "Productos más vendidos"
    StockAlerts.tsx        # "Alertas de stock"
    SalesByMonthChart.tsx  # barras mensuales "Ventas facturadas por mes" (Analítica)
  pages/
    PedidosPage.tsx        # lista + panel resumen + PhaseAccumCards; al seleccionar → OrderDetail; +Nuevo → NewOrderForm
    CatalogoPage.tsx       # colecciones + productos + más vendidos + alertas + extras + variables; fila/nuevo → ProductModal
    AnaliticaPage.tsx      # 4 stat cards + selector año + SalesByMonthChart + PhaseAccumCards + más vendidos + alertas
```

Tests colocados junto a los archivos (`*.test.tsx`), ver §8.

---

## 3. Vistas — detalle de composición

### 3.1 `PedidosPage` (`/cruda`)
**H1** "Pedidos" · subtítulo "Hojas de pedido de CRUDA: producto, cantidades y estado."

Dos estados de la página (gobernados por estado UI local `selectedOrderId` / `creating`):

**(a) Lista (default):**
- Columna izquierda (`OrderList`): botón primario `+ Nuevo pedido`; buscador "Buscar por código o cliente…"; `Select` "Todas las líneas de negocio" (Colección / Producción (custom)); `Select` "Todos los estados" (Borrador…Anulado); lista de items. Cada item: código+cliente (`CR00103 · New Era`), fecha+línea (`07 jul 2026 · Colección`), badge(s) de estado y opcional "Reposición", e importe (p.ej. `6650,00 €`). Los filtros y el buscador filtran el array seed **en memoria**.
- Columna derecha (`OrderSummaryPanel` + `PhaseAccumCards`):
  - Tres tarjetas resumen: **En curso (activos)** `15.614,85 €` · `4 pedidos`; **Facturado** `2540,25 €` (verde); **Por línea de negocio** (`Colección 15.614,85 €`, `Producción 0,00 €`).
  - **Dinero acumulado por fase** (`PhaseAccumCards`): tarjetas horizontales por fase (Borrador 2 / 6424,60 €, Confirmado 1 / 6650,00 €, En producción 0, Enviado 0, Entregado 0, Facturado 1 / 2540,25 €) con **barra de progreso púrpura (brand)** proporcional al máximo.

**(b) Detalle** (al pulsar un pedido) — enlace `← Todos los pedidos` arriba, luego `OrderDetail`:
- **Header**: `CR00103` + badge outline `Colección` + total a la derecha (`5782,50 €`).
- **Stepper de estado** (`OrderStatusStepper` dentro de `OrderDetail`): botones fila `Borrador · Confirmado · En producción · Enviado · Entregado · Facturado · Cancelado` + `Anular` (derecha). El estado actual resaltado (Confirmado = outline azul). Cambiar de estado solo actualiza estado UI local.
- **Acciones**: `Descontar del stock` (rojo outline) · `Hoja de pedido (PDF)` (outline). Presentacionales (no-op / alert).
- **Meta**: badge `Colección` · `New Era` · `Fecha: 07 jul 2026` · `Resp.: Israel Cuenca` · botón `Modificar` (derecha).
- **Líneas del pedido** (`OrderLinesTable`): tabla con columnas `Descripción · SKU · Talla · Color · Cant. · Precio € · Dto % · Neto € · PVP € · × · Subtotal · Extras · (✕)`. `Cant.`, `Dto %`, `PVP €`, `×` son inputs numéricos editables (recalculan Neto/Subtotal/total en memoria). `Neto €` = precio·(1−dto/100). `Extras (n)` es un botón (popover no requerido para el calco; basta el botón con contador). `✕` elimina la línea del estado local.
  - **Añadir línea**: `Select` Producto (`Libre…` / productos), `Select` Variante (deshabilitado si Libre), `Descripción *`, `Cant.`, `Precio`, botón `+ Añadir línea`.
  - **Totales** (derecha): `Bruto: 6650,00 €` · `Total: 6650,00 €`.
- **Portal de reposiciones (CRUDA)**: texto explicativo, input `email@cliente.com`, botón `Invitar`, nota inferior. Presentacional.

**(c) Nuevo pedido** (al pulsar `+ Nuevo pedido`) — `← Todos los pedidos` + `NewOrderForm` en una `Card`:
- Título "Nuevo pedido".
- `SegmentedControl` **Línea de negocio**: `Colección` / `Producción (custom)` + texto de ayuda.
- Grid 2 col: `Cliente` (input "Buscar o crear cliente…" + enlace "Abrir CRM ↗") | `Colección` (select); `Fecha` (date, default hoy) | `Entrega prevista` (date); `Responsable` ("+ Asignar") | `Descuento global (%)` (número, 0); `Dirección de envío` (ancho completo); `Notas` (textarea ancho completo).
- Botones `Crear pedido` (primario) · `Cancelar`; nota inferior. `Crear pedido`/`Cancelar` vuelven a la lista sin persistir.

### 3.2 `CatalogoPage` (`/cruda/catalogo`)
**H1** "Catálogo" · subtítulo "Colecciones y productos de CRUDA."

Secciones (de arriba a abajo):
1. **Colecciones** (`CollectionChips`): título + enlace `+ Nueva colección` (derecha). Chips: `Todas 1` (activo brand), `Top Sales 1` con botón `✎`, `Sin colección`. Filtran la tabla de productos en memoria.
2. **Productos** (`ProductsTable`): título + botón primario `+ Nuevo producto`; buscador "Buscar por nombre o SKU…"; tabla `Producto · Tipo · Colección · Stock · Precio · Margen`. Fila: miniatura + nombre, `3 variantes`, `Top Sales`, `340 uds`, `16,50 €`, `8,50 €` (margen en verde). Click en fila o `+ Nuevo producto` → `ProductModal`.
3. Grid 2 col: **Productos más vendidos** (`TopProductsTable`: Producto/Unidades/Valor → `(Test) Camiseta A&F` / `860` / `14.708,35 €`) | **Alertas de stock** (`StockAlerts`: subtítulo `340 uds · valor a coste 2720,00 €`, aviso rojo `1 variante(s) en o por debajo del mínimo:`, tabla Variante/Stock/Mín → `… · Algodón / L / Crudo` / `40` (rojo) / `50`).
4. **Extras (packaging, personalización…)** (`ExtrasTable`): título + `+ Nuevo extra`; tabla Extra/Tipo/Modo/Precio → Bolsa Cierre Zip·Packaging·Por unidad (× prendas)·0,70 €; Bordado·Personalización·…·2,50 €; Etiqueta Bordada Personalizada·Etiqueta·…·0,15 €.
5. **Variables de producto** (`VariableChips` ×3): párrafo explicativo; 3 tarjetas: **Acabados** (Algodón/Ripstop/Lino), **Tallas** (XS/S/M/L/XL/XXL), **Colores** (Crudo/Azul). Cada chip con `✕`; input `Añadir…` + botón `+`. Añadir/quitar solo en memoria.

**`ProductModal`** (al abrir producto o `+ Nuevo producto`): modal (overlay) con:
- Título "Producto" + párrafo explicativo; botón cerrar `✕`.
- Miniatura imagen (`Cambiar`/`✕`), `Nombre *`, `Colección` (select).
- `Tipo de producto`: segmented `Con variantes` / `Producto único` + ayuda; checkbox `Activo`; `Notas` (textarea).
- **Variantes**: heading "Variantes" + `Stock total: 340 uds`; tabla por variante con columnas `Img (Subir) · SKU · Acabado · Talla · Color · Precio € · Coste € · Margen · PVP € · × · Stock · Mín. · (✕)`. Los selects Acabado/Talla/Color se alimentan de las Variables (§Catálogo). Última fila vacía para añadir (botón `+`). Márgenes calculados en memoria (precio − coste).
- Footer: `Guardar` (primario) · `Cancelar` · `Eliminar` (rojo, derecha). Todos presentacionales.

### 3.3 `AnaliticaPage` (`/cruda/analitica`)
**H1** "Analítica CRUDA" · subtítulo "Ventas, líneas de negocio, productos y stock." + `Select` año (2023–2027, default 2026) a la derecha.

1. **4 stat cards**: En curso (activos) `15.614,85 €` / `4 pedidos`; Facturado (histórico) `2540,25 €` (verde); Colección `15.614,85 €` / `en curso`; Producción (custom) `0,00 €` / `en curso`.
2. **Ventas facturadas por mes · 2026** (`SalesByMonthChart`): 12 barras (Ene–Dic); solo Jul con valor (`2540,25 €`, etiqueta `3K€`), resto `·`/`0,00 €`. Barra púrpura `~#8D4EB6/80%`. El selector de año recalcula (seed por año; años sin datos → todo a 0).
3. **Dinero acumulado por fase** (`PhaseAccumCards`, reutilizado): variante ancho completo (6 tarjetas en fila).
4. Grid 2 col: **Productos más vendidos** + **Alertas de stock** (mismos componentes que Catálogo).

---

## 4. Reutilización de UI existente y extensiones aditivas

Reutilizar de `src/components/ui`: `Card`, `Modal`, `StatCard`, `SegmentedControl`, `Select`, `Input`, `Textarea`, `Button`, `Badge`, `MasterDetailList` (opcional para la lista de pedidos).

Dos extensiones **aditivas** (no rompen consumidores existentes):
- **`Badge`**: añadir variante `indigo` (`bg-indigo-100 text-indigo-700`) para el estado **Enviado**. No se toca ninguna variante existente.
- **`ProgressBar`**: añadir prop opcional `fillClassName` (default actual `bg-emerald-500`). Las barras de "Dinero acumulado por fase" usan relleno **brand/púrpura**. Sin la prop, el comportamiento actual es idéntico.

El estado **Facturado** es un badge **sólido** `emerald-600` con texto blanco (no encaja en las variantes claras de `Badge`), por lo que `CrudaStatusChip` lo renderiza con estilo propio.

---

## 5. Paleta de estados de pedido (valores exactos capturados de la web)

`CrudaStatusChip` mapea cada estado a estas clases (pill `rounded-full`, `text-xs font-medium`, `px-2.5 py-0.5`):

| Estado | Texto | Fondo | Tailwind |
|---|---|---|---|
| Borrador | `#334155` | `#E2E8F0` | `text-slate-700 bg-slate-200` |
| Confirmado | `#1D4ED8` | `#DBEAFE` | `text-blue-700 bg-blue-100` |
| En producción | `#B45309` | `#FEF3C7` | `text-amber-700 bg-amber-100` |
| Enviado | `#4338CA` | `#E0E7FF` | `text-indigo-700 bg-indigo-100` |
| Entregado | `#047857` | `#D1FAE5` | `text-emerald-700 bg-emerald-100` |
| Facturado | `#FFFFFF` | `#059669` | `text-white bg-emerald-600` (sólido) |
| Cancelado | gris tenue | — | `text-slate-400` (outline/atenuado) |
| Anulado | gris tenue | — | `text-slate-400` |

Otros valores confirmados:
- Fondo página: `#F8FAFC` (slate-50). Texto base: `#1E293B` (slate-800). `H1`: 24px / 600.
- Tab activa: `#633383` sobre `#F7F3FB` → tokens existentes `brand-700` / `brand-50` (radio 8px). ✓
- Barra del bar-chart y de fases: púrpura `rgba(141,78,182,0.8)` ≈ `#8D4EB6/80%`.
- Badge "Colección"/"Producción" (línea de negocio): outline gris tenue tipo `neutral`.
- Badge "Reposición": azul claro tenue (tipo `info`/`sky`).

---

## 6. Datos seed (tomados de la web real)

**Colecciones:** `Top Sales` (1 producto). Filtros: Todas / Top Sales / Sin colección.

**Variables de producto:** Acabados `[Algodón, Ripstop, Lino]` · Tallas `[XS, S, M, L, XL, XXL]` · Colores `[Crudo, Azul]`.

**Producto:** `(Test) Camiseta A&F`, colección Top Sales, tipo "Con variantes", activo. 3 variantes:

| SKU | Acabado | Talla | Color | Precio | Coste | Margen | PVP | × | Stock | Mín |
|---|---|---|---|---|---|---|---|---|---|---|
| 4878test01 | Algodón | S | Crudo | 16,50 | 8 | 8,50 | 41,03 | 2,49 | 150 | 50 |
| 4878test02 | Algodón | M | Crudo | 16,50 | 8 | 8,50 | 45 | 2,73 | 150 | 50 |
| 4878test03 | Algodón | L | Crudo | 16,50 | 8 | 8,50 | 45 | 2,73 | 40 | 50 |

Stock total 340 uds · valor a coste 2720,00 €. Alerta: variante L/Crudo (40 ≤ 50). Más vendido: 860 uds / 14.708,35 €.

**Extras:** Bolsa Cierre Zip (Packaging, Por unidad × prendas, 0,70 €); Bordado (Personalización, Por unidad × prendas, 2,50 €); Etiqueta Bordada Personalizada (Etiqueta, Por unidad × prendas, 0,15 €).

**Pedidos** (4):

| Código | Cliente | Fecha | Línea | Estado(s) | Importe |
|---|---|---|---|---|---|
| CR00103 | New Era | 07 jul 2026 | Colección | Confirmado | 6650,00 € |
| CR00102 | TAGMAG | 06 jul 2026 | Colección | Reposición + Borrador | 3730,00 € |
| CR00101 | TAGMAG | 06 jul 2026 | Colección | Facturado | 2540,25 € |
| CR00100 | Sin cliente | 06 jul 2026 | Colección | Borrador | 2694,60 € |

Detalle CR00103 (Resp.: Israel Cuenca): 3 líneas `(Test) Camiseta A&F · Algodón`, SKU 01/02/03, tallas S/M/L, color Crudo, precio 16,50 €, dto 0, PVP 45, × 2,73, cant 100/200/50, subtotales 1900/3800/950 → Bruto/Total 6650,00 €. (El header muestra 5782,50 € como total con extras/otra métrica; se replica el valor mostrado tal cual.)

**Resumen Pedidos:** En curso (activos) 15.614,85 € / 4 pedidos; Facturado 2540,25 €; Por línea: Colección 15.614,85 €, Producción 0,00 €.

**Dinero acumulado por fase:** Borrador 2 / 6424,60 €; Confirmado 1 / 6650,00 €; En producción 0 / 0; Enviado 0 / 0; Entregado 0 / 0; Facturado 1 / 2540,25 €.

**Analítica:** año 2026 → Jul 2540,25 € (resto 0). Stat cards: En curso 15.614,85 € (4), Facturado hist. 2540,25 €, Colección 15.614,85 €, Producción 0,00 €.

Todos los importes con `format.ts` (coma decimal, punto de miles: `15.614,85 €`, `6650,00 €`).

---

## 7. Comportamiento presentacional (resumen de qué "hace" cada acción)

- **Filtros/buscadores** (pedidos, catálogo): filtran arrays seed con `useState`/`useMemo`.
- **Selección de pedido / producto**: cambia estado UI local para mostrar detalle/modal.
- **Stepper de estado, inputs de líneas, chips de variables, checkbox Activo, segmented controls, selector de año**: mutan **estado local** (posiblemente copia en memoria del seed), recalculando totales/derivados. No hay persistencia ni llamada a repositorio de escritura.
- **Botones de acción** (`Crear pedido`, `Guardar`, `+ Añadir línea`, `Invitar`, `Descontar del stock`, `Hoja de pedido (PDF)`, `+ Nuevo …`, `Eliminar`, `Modificar`, `Abrir CRM ↗`): sin efecto persistente; navegan entre estados de UI o son no-ops. Ninguno crea/edita/borra datos reales.

---

## 8. Testing

Tests con Vitest + Testing Library (patrón `*.test.tsx` existente), cubriendo:
- **`CrudaShell`/router**: render de las 3 rutas; iconAction de Analítica presente; tabs Pedidos/Catálogo.
- **`PedidosPage`**: render lista + panel resumen + tarjetas de fase; seleccionar pedido muestra `OrderDetail`; `+ Nuevo pedido` muestra `NewOrderForm`; filtro por estado reduce la lista.
- **`OrderLinesTable`**: editar `Cant.`/`Dto %` recalcula Neto/Subtotal/Total; `✕` elimina línea.
- **`CatalogoPage`**: render de secciones; click en producto abre `ProductModal`; chip de colección filtra productos; `VariableChips` añade/quita chip.
- **`AnaliticaPage`**: render de 4 stat cards + chart; cambiar año recalcula (año sin datos → barras a 0).
- **`CrudaStatusChip`**: mapeo estado → clases correctas (incluye Enviado=indigo, Facturado=sólido).
- **`format.ts`**: `eur`/`eurMiles` producen el formato ES exacto.

---

## 9. Fuera de alcance

- Persistencia real, backend, repositorio de escritura (llegará con el `.sql`; solo se cambiará la fuente de datos).
- Popover de "Extras (n)" por línea (basta el botón con contador para el calco).
- Subida real de imágenes (`Subir`/`Cambiar` son presentacionales).
- Envío real de invitaciones / generación de PDF.
