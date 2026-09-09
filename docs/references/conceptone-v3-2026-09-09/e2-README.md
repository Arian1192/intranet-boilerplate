# Evidencia `e2-` — Cobros y Gastos (Fase E, lote 2)

Captura del live del **2026-09-09 entre las 12:52 y las 13:20 CEST**. Nueve volcados con `.txt`
(innerText del `<main>`) y `.main.html` (**DOM sin truncar**), más tres PNG `fullPage`.

| Fichero | Qué es |
|---|---|
| `e2-cobros` | `/cobros` en su estado inicial (`Por show`, chip `Todos`) |
| `e2-cobros--vencidos` | el chip `Vencidos` (119 filas) |
| `e2-cobros--por-factura` | la vista `Por factura` |
| `e2-gastos` | `/gastos` con el filtro por defecto (`Sin asignar`) |
| `e2-gastos--asignados`, `e2-gastos--todos`, `e2-gastos--sin-asignar` | los tres filtros |
| `e2-gastos--panel` | un movimiento seleccionado, con el panel de conciliación abierto |

## Sólo lectura

Se navegó y se pulsaron **chips y conmutadores de vista**, y se **seleccionó** un movimiento, que en
un master-detail es selección de vista. No se tecleó en el buscador del panel, no se pulsó
`Asignar como gasto` ni `↻ Actualizar`, y no se abrió ningún alta.

Listener de red antes de cada clic. **Todos los conmutadores dan cero peticiones**: los filtros de
Gastos, los chips de Cobros, la vista `Por factura` y la selección de un movimiento **no tocan la
red** — el dato ya venía en la carga.

Al **cargar** la ruta sí aparecen `POST`, y **no son escrituras**: `rpc/cobros_pendientes` y
`rpc/cobros_por_factura` en Cobros, y `functions/v1/holded-gastos` en Gastos, más un
`auth/v1/token?grant_type=refresh_token`. En Supabase una lectura `rpc/` viaja por `POST`; los tres
primeros están en la lista de lecturas conocidas del proyecto. Ninguno se disparó por un clic nuestro.

## El espacio duro, medido de una vez por todas

**El live pone `U+00A0` antes del `€` en 949 de 949 importes** — 587 en `/cobros` y 362 en `/gastos`,
sin una sola excepción. `formatImporte` de `cobros.ts` lo convertía a espacio normal a propósito, y
eso era el error; `formatImporteLiquidacion` ya lo había diagnosticado en la Fase A y se escribió
aparte en vez de arreglarlo.

**Y la agrupación de millares no es una rareza del live.** Escribe `6421,40 €` sin punto y
`10.000,00 €` con él, lo que parece un umbral caprichoso; no lo es: es el `minimumGroupingDigits` de
`es-ES`, así que `Intl` lo resuelve solo. Verificado en 10 pares valor↔pantalla, exactos al carácter.
Con eso, `formatCurrency` a secas **reproduce el live**.

> Cuidado al escribir tests: `getByText` de Testing Library **normaliza** el `U+00A0` a espacio
> normal, así que un aserto de pantalla pasa igual con el formateo mal. Lo único que lo prueba es
> mirar el `textContent` por **código de carácter** (`charCodeAt` = 160).

## Delta real, que es mayor que el del §4

### Cobros — la forma ya estaba; lo que difiere es el volumen

Los tres deltas de la tabla (**bajada ampliada**, botón **`Facturar el mes…`** y los **4 KPI**) **ya
estaban aplicados** por una ronda anterior (`f53d17c`). Lo que difiere hoy:

- **Volumen:** nuestro seed es «espejo del live del **29 jul 2026**» con 7 shows por cobrar; el live
  de hoy trae **155 filas**, **79 facturas**, `SHOWS POR COBRAR 155` y `PENDIENTE TOTAL 172.489,88 €`.
- **`HOY` está clavado a `2026-07-29`** en `cobros.ts`, y es lo que calcula las etiquetas `D±n` y los
  chips `Vencido` / `Esta semana`.
- **Las filas del live son anclas** (`232 <a href>` a `/shows/:id`). Las nuestras **no son ni anclas
  ni botones**: son `<tr>` planos. Y no basta con envolverlas, porque **la ruta `/shows/:id` no
  existe en nuestro router** —sólo `/shows`— y el modelo `Cobro` no tiene `showId`.
  `TourDetallePage.tsx:281` ya enlaza a `/shows/:id`, así que hay enlaces muertos en `main` desde
  antes de este lote.

### Gastos — no es «revisar»: falta el cuerpo entero

Nosotros pintamos el placeholder «Cargando movimientos de Holded…» con los 3 KPI a cero. **El live ya
carga**, y trae:

- **3 KPI con datos:** `GASTO SIN ASIGNAR 201.704,56 €` con pie `361 movimiento(s)`,
  `MOVIMIENTOS (TOTAL) 398` y `CUENTAS 3`. El tercero **sí existe** y es `CUENTAS`: a la lista del
  spec simplemente le faltaba.
- **Una barra de filtros** que no tenemos: un desplegable de cuenta que es **`ApxDd`** (`.dd` /
  `.dd-btn` / `.dd-lab` / `.chev`, no un `select` nativo), tres chips
  `Sin asignar` / `Asignados` / `Todos` —con el activo en `border-brand-300 bg-brand-50
  text-brand-700`, o sea `brand-*` tal cual— y un `↻ Actualizar`.
- **361 filas de movimiento**, que son `button`, no una tabla.
- **Un panel lateral pegajoso** (`lg:sticky lg:w-[400px]`) que hace de master-detail. Vacío dice
  «Selecciona un movimiento de la izquierda para conciliarlo.»; con un movimiento elegido muestra
  concepto, `fecha · importe`, una etiqueta `Show` con el buscador
  «Buscar show por nombre o artista…» y un botón **`Asignar como gasto`** — que es una escritura y
  va **inerte**, como los exports.

Los contadores cuadran entre sí: `Sin asignar` 361 + `Asignados` 37 = `Todos` 398.

## Negativos explícitos

- **No hay ninguna clase `apx` sin definir.** De las 116 clases distintas de las dos pantallas, 28
  están en `apx.css` —incluidas `dd`, `dd-btn`, `dd-lab`, `chev` e `input`— y las otras 88 son
  utilidades Tailwind, verificadas una a una.
- **Ningún conmutador pide datos.** Ni los filtros, ni los chips, ni la vista `Por factura`, ni
  seleccionar un movimiento.

## Las cifras se mueven

La ventana de Gastos es de **120 días móviles**: entre el §4 (194.004,76 € / 356 / 393) y esta
captura (201.704,56 € / 361 / 398) han entrado movimientos nuevos. Las cifras de este lote se fijan a
**esta** captura y los tests van contra reglas y literales, no contra números que se muevan.
