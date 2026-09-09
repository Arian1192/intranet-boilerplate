# Los dos ejes de pago del live — medida para quien parta `PaymentStatus`

**Medido:** 2026-09-09, 12:19-12:24 CEST, sobre `/shows` y `/liquidaciones` del live.
**Por qué existe este documento:** durante el lote 1 de la Fase E se propuso renombrar
`No abonado → Sin liquidar`. **No es un renombrado**, y por eso no se hizo. Lo que sigue es la medida
completa, para que quien coja ese trabajo empiece donde se dejó en vez de volver a medirlo.

## El hallazgo en una frase

El live tiene **dos vocabularios distintos de «estado de pago»** conviviendo en la misma pantalla, y
nosotros tenemos **un solo campo** —`PaymentStatus`— alimentando los dos sitios.

## Eje 1 — COBRO / FACTURACIÓN: el chip de la fila de `/shows`

Es el `<span class="s …">` dentro del `.ramt` de cada `button.srow`. Recuento sobre las **87 filas**
de la captura:

| Literal | Clase | Filas |
|---|---|---|
| `Sin cobrar` | `p-rose` | 40 |
| `No facturado` | `p-amber` | 20 |
| `Cobrado` | `p-mint` | 8 |
| `Cobro parcial` | `p-amber` | 4 |
| `Falta recuperar` | `p-amber` | 3 |
| `Cancelado` | `p-none` | 2 |
| `Liquidado` | `p-mint` | 1 |

Las filas sin importe no pintan chip: el `.ramt` va vacío.

## Eje 2 — LIQUIDACIÓN: el `<select>` «Estado de pago» del drawer de Filtros

`Todos los estados` · `Sin liquidar` · `Parcialmente liquidado` · `Pendiente liquidar` ·
`Liquidado` · `Incidencia`

**Es el mismo vocabulario que gasta `/liquidaciones`**, cuyo `<select>` de estado trae exactamente
esas seis opciones. Y `Sin liquidar` aparece **198 veces** en el volcado de `/liquidaciones`.

## Lo que tenemos nosotros

`src/types/index.ts`:

```ts
export type PaymentStatus =
  | 'No abonado' | 'Parcialmente abonado' | 'Pendiente liquidar' | 'Liquidado' | 'Incidencia';
```

Un solo campo, `Show.paymentStatus`, que alimenta **a la vez**:

- el chip de la fila, vía `PaymentChip` (eje 1 en el live),
- el `<select>` «Estado de pago» del drawer (eje 2 en el live),
- `MonthGrid`, `calendar.ts` y las chapas del dashboard.

## Por qué no se puede renombrar y ya

`No abonado → Sin liquidar` **colapsaría «no cobrado» con «no liquidado»**, que en el live son cosas
distintas: un show puede estar `Cobrado` (eje 1) y seguir `Sin liquidar` (eje 2) — de hecho es el
caso normal entre el cobro al promotor y la liquidación al artista.

Partirlo en dos campos es **modelo, no vocabulario**. Toca `types/index.ts`, `MockRepository.ts`,
`PaymentChip.tsx`, `calendar.ts`, `MonthGrid.tsx`, `FiltrosDrawer.tsx` y sus tests, o sea Cobros,
Liquidaciones, Agenda y Shows. Pide rama, brief y PR propios.

## Lo que sí se hizo, y que conviene saber antes de empezar

El renombrado de **etapa y fase** `Liquidado → Cerrado` **ya está aplicado** (lote 1 de la Fase E,
`etapaLabels.ts` y `FiltrosDrawer.tsx`). Se verificó por tres vías independientes: el `<select>`
`Etapa` del live trae las mismas seis opciones en el mismo orden con sólo la sexta cambiada, el tile
del dashboard rotula «Ver shows en Cerrado» con el mismo `emerald-600`, y **`Cerrado` aparece cero
veces en `/liquidaciones`**.

Ese cambio **ayuda** a esta tarea: después de él, la palabra `Liquidado` ya sólo vive en el eje de
pago, que es donde el live la tiene. Antes la usábamos para las dos cosas.

## Evidencia

- `docs/references/conceptone-v3-2026-09-09/shows.main.html` — las 87 filas con sus chips.
- `docs/references/conceptone-v3-2026-09-09/f2e-shows-filtros.txt` — el drawer abierto, con las
  opciones exactas de los tres `<select>`.
- `docs/references/conceptone-v3-2026-09-09/liquidaciones.main.html` — el eje 2 en su pantalla.
