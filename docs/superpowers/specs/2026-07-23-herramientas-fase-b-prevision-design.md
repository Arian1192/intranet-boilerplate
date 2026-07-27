# Herramientas · Fase B — Tab Previsión (motor de escenarios) · Design

**Fecha:** 2026-07-23
**Rama:** `feature/herramientas` (continúa sobre Fase A, commits hasta `6c06385`)
**Tipo:** Calco fiel al live, presentacional, en memoria (sin Supabase). Fase 2 de 3 del módulo Herramientas.

---

## 1. Contexto y objetivo

Fase A dejó la tab **Previsión** como placeholder ("Esta vista se construye en la Fase B") y resolvió el tab **Acuerdo** con una nota de fidelidad abierta: el bruto de ticketing usado por Acuerdo (`acuerdoBrutos.ticketing = 4600€`) **no coincide** con Σ(entradas×precio) de la tabla de ticketing sembrada (que da 6.125€), y Fase A no consiguió explicar el porqué solo con las capturas — lo dejó como constante verificada y difirió la reconciliación a esta fase.

Esta fase **resuelve esa discrepancia** (ver §3) construyendo el motor real de escenarios y sustituyendo `acuerdoBrutos` (campo estático) por un cálculo derivado real a partir de `ticketing[]` / `mesasVip[]` / `barrasComidaMerch` / `gastos[]`, parametrizado por el escenario activo (Pesimista/Base/Optimista).

### Criterios de éxito de Fase B
- Tab Previsión pixel-fiel a `live-prevision-full-page.png` / `live-proyeccion-detalle-prevision-escenarios.png`, desde el selector ESCENARIO hasta el total de Gastos.
- Motor de escenarios que reproduce **exactamente al céntimo** las 3 filas de la tabla "Escenarios" del live (Pesimista -1.134,69€/-26.2%, Base 860,14€/13.6%, Optimista 2.604,97€/32.3%) y el breakeven (77% · 461 entradas · 511 asistencia), partiendo únicamente de los datos "crudos" (`ticketing[]`, `mesasVip[]`, `barrasComidaMerch`, `gastos[]`, `acuerdo`), sin ninguna constante hardcodeada.
- `acuerdoBrutos` (campo estático en `Proyeccion`, con su nota de fidelidad) **desaparece**; `AcuerdoTab` y `ProyeccionRow` pasan a usar el cálculo derivado (a escenario "Base", que es el que Acuerdo siempre usó implícitamente).
- Verde total (tests, lint 0, tsc). Sin mutaciones reales en el live.

---

## 2. Arquitectura

Nuevos ficheros bajo `src/features/herramientas/data/`:

- **`calculos-escenarios.ts`**: el motor real — multiplicadores, ticketing en cascada ("waterfall"), VIP, consumo (barras/comida/merch), `calcularBrutosEscenario`, comparativa de los 3 escenarios, gasto por categoría.
- **`calculos-breakeven.ts`**: resolución numérica (búsqueda binaria) del % de venta que iguala el beneficio a 0, solo sobre las vías marcadas.

Modificados:
- **`calculos-acuerdo.ts`** (Fase A): se añade `calcularImporteGasto` (generaliza `Gasto.base` más allá de `importe_fijo`, necesario para el Gastos-CRUD de esta fase) y `calcularResultadoAcuerdo` pasa a sumar gastos con esa función (mismo resultado exacto para los 7 gastos sembrados, todos `importe_fijo`).
- **`types.ts`**: se retira `acuerdoBrutos: AcuerdoBrutos` de `Proyeccion` (la interfaz `AcuerdoBrutos` se mantiene, ahora como tipo de retorno de `calcularBrutosEscenario`); se añade `canales?: string[]` a `TicketingRelease` (desglose por ticketera).
- **`seed.ts`** / **`proyecciones-crud.ts`**: se retira el campo `acuerdoBrutos` de la semilla y del borrador en blanco.
- **`AcuerdoTab.tsx`** / **`ProyeccionRow.tsx`**: usan `calcularBrutosEscenario(proyeccion, 'base')` en vez de leer `proyeccion.acuerdoBrutos`.

Nuevos componentes bajo `src/features/herramientas/components/`:

`EscenarioSelector`, `EscenariosTable`, `GastoPorCategoriaCard`, `CollapsibleSection` (primitivo local, no existe en `@/components/ui`), `AjustesEscenariosCard`, `EventoAforoCard`, `TicketingTable`, `MesasVipTable`, `BarrasComidaMerchCards`, `GastosTable` (CRUD completo, distinto de `QuienPagaGastos` que sigue viviendo en Acuerdo).

Orquestador: **`PrevisionTab.tsx`**, sustituye `<TabPlaceholder fase="B" />` en `ProyeccionDetailPage`.

---

## 3. El motor de escenarios — reconciliación de la discrepancia de Fase A

**Hallazgo clave de esta fase:** la discrepancia que Fase A no pudo explicar (ticketing bruto 4.600€ del live vs 6.125€ de sumar las 7 filas) **no es un problema de redondeo** — es un modelo de **venta en cascada por tramos ("waterfall")**: los releases de ticketing se agotan en el orden configurado (`orden`) hasta cubrir el número de entradas que el escenario activo proyecta vender; los releases posteriores a ese punto no llegan a "activarse" en el escenario. Se validó reproduciendo **exactamente al céntimo** los 3 escenarios completos (ver script de verificación, tabla siguiente) — no queda ninguna discrepancia sin explicar en el ticketing.

| Escenario | Mult. | Entradas objetivo (N) | Asistencia | Ticketing bruto | Ingresos | Beneficio (calc) | Beneficio (live) | Margen (calc) | Margen (live) |
|---|---|---|---|---|---|---|---|---|---|
| Pesimista | 50% | 300 | 350 | 2.800,00€ | 4.335,31€ | **-1.134,69€** | -1.134,69€ | **-26.2%** | -26.2% |
| Base | 75% | 450 | 500 | 4.600,00€ | 6.330,14€ | **860,14€** | 860,14€ | **13.6%** | 13.6% |
| Optimista | 100% | 600 | 650 | 6.125,00€ | 8.074,97€ | **2.604,97€** | 2.604,97€ | **32.3%** | 32.3% |

Coincidencia exacta en las 3 filas (célula "calc" vs "live"), sin ajustar nada a mano. Esto **reemplaza** la nota de fidelidad de Fase A: no hace falta documentar una discrepancia de redondeo porque no la hay — el modelo waterfall más "VIP sin escalar por escenario" (ver abajo) la explica por completo.

### 3.1 Multiplicador de escenario → entradas objetivo (N)

```ts
type Escenario = 'pesimista' | 'base' | 'optimista';

function multiplicadorPct(ajustes: AjustesEscenarios, escenario: Escenario): number {
  return { pesimista: ajustes.multiplicadorPesimistaPct, base: ajustes.multiplicadorBasePct, optimista: ajustes.multiplicadorOptimistaPct }[escenario];
}

// N = entradas que el escenario proyecta vender, redondeadas UNA VEZ sobre el total
// (nunca fila a fila — de ahí que la cascada de abajo tenga que repartir esa N entre
// releases, no escalar cada fila y volver a sumar, que es lo que Fase A probó y no cuadraba).
function entradasObjetivo(ticketing: TicketingRelease[], ajustes: AjustesEscenarios, escenario: Escenario, asistenciaForzada?: number, invitaciones: number): number {
  if (asistenciaForzada !== undefined) return Math.max(0, asistenciaForzada - invitaciones);
  const totalRaw = ticketing.reduce((a, r) => a + r.entradas, 0);
  return Math.round(totalRaw * multiplicadorPct(ajustes, escenario) / 100);
}
```

Con la semilla (600 entradas configuradas), Base(75%) da N=450 exacto (450+50 invitaciones = 500 = "Asistencia 500/600" del live).

### 3.2 Ticketing en cascada ("waterfall")

```ts
function ticketingBrutoWaterfall(ticketing: TicketingRelease[], entradasObjetivo: number): number {
  const ordenado = [...ticketing].sort((a, b) => a.orden - b.orden);
  let cum = 0, bruto = 0;
  for (const r of ordenado) {
    if (cum >= entradasObjetivo) break;
    const tomadas = Math.min(r.entradas, entradasObjetivo - cum);
    bruto += tomadas * r.precio;
    cum += tomadas;
  }
  return bruto;
}
```

Con N=450: se agotan enteras "Early Access" (100), "Online·R1" (200) y "Online·R3" (150) → cum=450 exacto, bruto = 800+2000+1800 = **4.600€** — coincide con el live sin resto (esta semilla no ejercita el caso de "fila parcial", pero la función lo soporta: si el corte cae a mitad de una fila, esa fila cuenta solo sus entradas parciales × precio).

**Nota de diseño:** "entradas objetivo" es SIEMPRE un valor único agregado (nunca se escala fila a fila); las **filas visibles de la tabla de Ticketing no cambian** al mover el selector de escenario — siguen mostrando la configuración cruda (tal como se observa en el live: la tabla no reacciona visualmente al clic en Pesimista/Base/Optimista, solo lo hacen los KPIs/tarjetas de arriba).

### 3.3 Mesas VIP — NO se escala por escenario (hallazgo, contradice el texto de ayuda)

El texto "¿Cómo se calcula?" (`live-info-como-se-calcula.png`) dice literalmente que el escenario "multiplica a la vez todo el volumen de venta — entradas, probabilidad VIP y consumo". Sin embargo, reproducir los 3 escenarios exactos **solo cuadra si el bruto VIP se mantiene constante** (12.790€ en los 3), usando la probabilidad cruda sin multiplicador de escenario:

```ts
function vipBruto(mesasVip: MesaVip[]): number {
  return mesasVip.reduce((a, z) => a + z.mesas * (z.probabilidadPct / 100) * z.precio, 0);
}
```

Si se aplica el multiplicador de escenario también a la probabilidad VIP (como sugiere el texto), el Beneficio en Pesimista/Optimista deja de cuadrar (se comprobó numéricamente). Se documenta este matiz: el copy de ayuda es más una explicación conceptual/aproximada que una spec literal del motor; el motor real (inferido de los 3 datos exactos disponibles) mantiene VIP como valor esperado fijo, y el escenario solo tensiona ticketing (vía la cascada) y consumo (vía la asistencia, que si depende de N).

### 3.4 Barras, comida y merch — dependen de la asistencia (que sí escala con el escenario)

```ts
asistencia = entradasObjetivo + eventoAforo.invitaciones;   // 450+50=500 en Base

barrasBruto  = barras.consumicionesHora × eventoAforo.duracionHoras × barras.precioMedio × asistencia;  // 0.5×6×10×500 = 15.000€
comidaBruto  = (comida.pctQueConsume/100) × comida.ticketMedio × asistencia;                            // 0.15×15×500 = 1.125€
merchBruto   = (merch.pctConversion/100) × merch.precioMedio × asistencia;                              // 0
```

### 3.5 `calcularBrutosEscenario` — junta todo

```ts
function calcularBrutosEscenario(p: Proyeccion, escenario: Escenario): AcuerdoBrutos {
  const N = entradasObjetivo(p.ticketing, p.ajustesEscenarios, escenario, p.eventoAforo.asistenciaForzada, p.eventoAforo.invitaciones);
  const asistencia = N + p.eventoAforo.invitaciones;
  return {
    ticketing: ticketingBrutoWaterfall(p.ticketing, N),
    mesasVip: vipBruto(p.mesasVip),
    barras: p.barrasComidaMerch.barras.consumicionesHora * p.eventoAforo.duracionHoras * p.barrasComidaMerch.barras.precioMedio * asistencia,
    comida: (p.barrasComidaMerch.comida.pctQueConsume / 100) * p.barrasComidaMerch.comida.ticketMedio * asistencia,
    merchandising: (p.barrasComidaMerch.merch.pctConversion / 100) * p.barrasComidaMerch.merch.precioMedio * asistencia,
  };
}
```

`calcularResultadoAcuerdo(p.acuerdo, calcularBrutosEscenario(p, escenario), p.eventoAforo, p.gastos)` (función de Fase A, sin cambios de firma) reproduce entonces el "Resultado por acuerdo" / la fila "Escenarios" para cualquier escenario. **`AcuerdoTab` y `ProyeccionRow` usan siempre `'base'`** (el Acuerdo del live no tiene selector propio de escenario, y la lista muestra la cifra "PREVISIÓN" que coincide con Base).

### 3.6 `calcularEscenariosComparativa` (tabla "Escenarios", 3 filas fijas)

```ts
function calcularEscenariosComparativa(p: Proyeccion): { escenario: Escenario; label: string; beneficio: number; margen: number }[] {
  return (['pesimista', 'base', 'optimista'] as const).map((escenario) => {
    const r = calcularResultadoAcuerdo(p.acuerdo, calcularBrutosEscenario(p, escenario), p.eventoAforo, p.gastos);
    return { escenario, label: { pesimista: 'Pesimista', base: 'Base', optimista: 'Optimista' }[escenario], beneficio: r.beneficioPorAcuerdo, margen: r.margenSobreIngresos };
  });
}
```

### 3.7 Gasto por categoría

```ts
function calcularGastoPorCategoria(gastos: Gasto[]): { categoria: string; importe: number; pct: number }[] {
  const totales = new Map<string, number>();
  gastos.forEach((g) => totales.set(g.categoria, (totales.get(g.categoria) ?? 0) + g.valor));
  const total = Array.from(totales.values()).reduce((a, v) => a + v, 0);
  return Array.from(totales.entries())
    .map(([categoria, importe]) => ({ categoria, importe, pct: total === 0 ? 0 : Math.round((importe / total) * 100) }))
    .sort((a, b) => b.importe - a.importe);
}
```

Verificado contra el seed: Artística 2.400€/44%, Promoción 1.500€/27%, Publicidad 1.300€/24%, Staff 270€/5% (suma de %, 100).

### 3.8 Breakeven

Texto de ayuda: *"Es el % de la venta proyectada (solo de las vías que elijas) necesario para que el beneficio sea 0. Con acuerdo activo se calcula sobre NUESTRO beneficio y solo cuenta los gastos que asumimos."*

Se resuelve `N` (entradas, continuo — no limitado a los tramos de la cascada) tal que:

```
Σ ingresoTramo(vía, brutoVía(N)) para las vías marcadas en ajustesEscenarios.viasBreakeven = |gastosQueAsumimos|
```

- Las vías NO marcadas no cuentan en la suma (pero `asistencia = N + invitaciones` sigue definida y sigue alimentando barras/comida/merch si están marcadas).
- `gastosQueAsumimos` se evalúa una vez, a brutos de escenario **Base** (los gastos son mayormente costes fijos — es la premisa estándar de un análisis de punto de equilibrio; con esta semilla es irrelevante porque los 7 gastos son `importe_fijo`, invariables por definición).
- La función total-ingreso(N) es monótona no decreciente (todos los precios/tarifas son ≥0) → búsqueda binaria en `[0, totalRawEntradas]` con un número fijo de iteraciones (60, precisión ampliamente suficiente) converge al `N` exacto.
- Salida: `pctVentaProyectada = round(N / totalRawEntradas × 100)`, `entradasNecesarias = round(N)`, `asistenciaNecesaria = entradasNecesarias + invitaciones`.
- Validado contra el seed (`viasBreakeven: ['ticketing', 'barras']`): **N=460,71 → 77% · 461 entradas · 511 asistencia**, exacto contra el live.
- Edge case: si ni siquiera con el 100% de venta se cubre el gasto (o si no hay vías marcadas / todas dan 0), la función devuelve `null` y la UI muestra "—" en vez de romper.

---

## 4. Gastos — generalizar `Gasto.base` (Gastos-CRUD completo)

Fase A solo ejercitó `base: 'importe_fijo'`. Fase B necesita las 7 bases reales del live:

```ts
function calcularImporteGasto(g: Gasto, brutos: AcuerdoBrutos, eventoAforo: EventoAforo): number {
  const netoTicketing = netoDeIva(brutos.ticketing, eventoAforo.ivaTicketingPct);
  const netoVip = netoDeIva(brutos.mesasVip, eventoAforo.ivaBarrasComidaVipPct);
  const netoBarras = netoDeIva(brutos.barras, eventoAforo.ivaBarrasComidaVipPct);
  const netoComida = netoDeIva(brutos.comida, eventoAforo.ivaBarrasComidaVipPct);
  const netoMerch = netoDeIva(brutos.merchandising, eventoAforo.ivaBarrasComidaVipPct);
  const netoFacturacion = netoTicketing + netoVip + netoBarras + netoComida + netoMerch;
  const base: Record<BaseGasto, number> = {
    importe_fijo: g.valor,
    pct_facturacion_neta: (g.valor / 100) * netoFacturacion,
    pct_ticketing_neto: (g.valor / 100) * netoTicketing,
    pct_vip_neto: (g.valor / 100) * netoVip,
    pct_barras_neto: (g.valor / 100) * netoBarras,
    pct_comida_neta: (g.valor / 100) * netoComida,
    pct_merch_neto: (g.valor / 100) * netoMerch,
  };
  return -base[g.base];
}
```

`calcularResultadoAcuerdo` (Fase A) cambia su línea `gastosQueAsumimos` para sumar `calcularImporteGasto(g, brutos, eventoAforo)` en vez de `-g.valor` — para los 7 gastos sembrados (`importe_fijo`) el resultado es **idéntico** (mismo valor exacto), así que no rompe ningún test de Fase A; solo añade soporte real para las otras 6 bases, necesario para que `GastosTable` (nueva, Previsión) permita elegirlas de verdad.

`GastosTable` es una tabla CRUD nueva (categoría/concepto/base/valor/importe-calculado/paga/borrar/＋Añadir) — **distinta** de `QuienPagaGastos` (que sigue en Acuerdo, sin cambios, agrupada por categoría con toggle a granel).

---

## 5. Componentes de UI

### 5.1 `CollapsibleSection` (primitivo local — no existe nada así en `@/components/ui`)
Botón de cabecera (icono ▾/▸ + `<h3>` + resumen opcional a la derecha cuando está colapsado) + contenido. Props: `title`, `summary?`, `defaultOpen?`. Usado por `AjustesEscenariosCard` y `EventoAforoCard` (colapsadas por defecto, con el resumen fiel: "Base 75% · BE 77%" y "18 jul 2026 · 600 · 6h · 500 pax").

### 5.2 `EscenarioSelector`
3 botones tipo toggle-único ("Pesimista · 50%", "Base · 75%", "Optimista · 100%" — el label incluye el multiplicador en vivo) + texto "Ves el resultado por acuerdo." (estático, sin acción — no explorado en el live, se trata como inerte).

### 5.3 Franja de 6 `StatCard` (reusa `@/components/ui/StatCard`)
INGRESOS POR ACUERDO (caption "Total {Σbrutos}€") · INVERSIÓN QUE ASUMIMOS (caption "Total {mismo valor}€" — ver nota) · BENEFICIO POR ACUERDO (caption "Total {eventoCompletoBeneficio}€") · MARGEN POR ACUERDO (sin caption) · PUNTO DE EQUILIBRIO (caption "{entradasNecesarias} entradas") · ASISTENCIA ("{asistencia} / {aforoMáximo}", caption "{pct ocupación}% ocupación").

**Nota de fidelidad (asunción documentada):** la caption de "Total" de INVERSIÓN QUE ASUMIMOS es idéntica a su propio valor en el live (-5.470,00€ ambas) porque los 7 gastos sembrados son 100% "Nosotros" — no hay forma de distinguir con este seed si esa caption es "total de TODOS los gastos (Nosotros+Venue)" o una repetición de "gastos que asumimos". Se implementa como "total de todos los gastos configurados" (independiente de quién paga), que con este seed da el mismo número y es la lectura más consistente con el patrón de las otras 2 captions ("Total" = magnitud agregada sin filtrar por acuerdo/escenario).

### 5.4 Fila de 3 tarjetas
`ResultadoAcuerdoCard` (reutilizada de Fase A, sin cambios) · `EscenariosTable` (nueva, tabla de 3 filas) · `GastoPorCategoriaCard` (nueva, lista + `ProgressBar` de `@/components/ui`).

### 5.5 `AjustesEscenariosCard` (colapsable)
3 spinbuttons (Pesimista/Base/Optimista %) editando `ajustesEscenarios.multiplicador*Pct` + 5 checkboxes (Ticketing/Mesas VIP/Barras/Comida/Merchandising) editando `ajustesEscenarios.viasBreakeven` + línea de resultado "% de venta proyectada X% · Entradas necesarias Y · Asistencia necesaria Z" (o "—" si `calcularBreakeven` devuelve `null`).

### 5.6 `EventoAforoCard` (colapsable)
Aunque no está listada explícitamente en el alcance de Fase B, es infraestructura imprescindible: los KPIs (asistencia, ocupación, duración para Barras, IVAs) necesitan que estos campos de `EventoAforo` sean editables en algún sitio del módulo, y el live los aloja precisamente aquí, dentro de Previsión. Campos: NOMBRE, FECHA, VENUE (texto simple, sin buscador — el buscador real de venues es fuera de alcance), AFORO MÁXIMO, DURACIÓN (HORAS), INVITACIONES, IVA TICKETING %, IVA BARRAS/COMIDA/VIP %, + checkbox "Forzar a mano" con su input numérico (asistencia forzada, `eventoAforo.asistenciaForzada`) + nota "Asistencia proyectada N = entradas + invitaciones · PAX de pago M".

### 5.7 `TicketingTable`
Tabla editable RELEASE(texto)/ENTRADAS(número)/PRECIO €(número)/FACTURACIÓN(calculada, `entradas×precio`, fila individual — no la cascada) + ↑/↓ (reordena `orden`, primero/último deshabilitados) + × (borra) + "+ Añadir" (nueva fila al final) + checkbox "Desglosar por ticketera (Fourvenues, RA, DICE…)". Al marcarlo, cada fila gana una sub-línea "Reparto ticketeras: {chips de `canales`} + ticketera" (añade/quita nombres de canal en `TicketingRelease.canales`, sin efecto en los totales — fiel a la nota de recon #6 "los totales de la tabla no cambian"). Fila total: "Total ticketing · {Σentradas} entradas" + `Σ(entradas×precio)` (bruto crudo de configuración, **no** la cascada — la cascada solo se usa para los KPIs/escenarios de arriba) + "Por acuerdo" (`ingresoTramo` sobre el bruto de cascada del escenario seleccionado).

### 5.8 `MesasVipTable`
ZONA(texto)/MESAS(número)/PROB. %(número)/PRECIO €(número)/FACTURACIÓN(calculada) + × + "+ Añadir". Total VIP + "Por acuerdo".

### 5.9 `BarrasComidaMerchCards`
3 tarjetas fijas (Barras/Comida/Merch), cada una: bruto calculado + "Por acuerdo" + sus 2 inputs específicos (Barras: consumiciones/hora, precio medio, nota "X cons./pax en Yh"; Comida: % que consume, ticket medio; Merch: % conversión, precio medio) + total "Barras, comida y merch" + "Por acuerdo".

### 5.10 `GastosTable`
CATEGORÍA(select 14 opciones)/CONCEPTO(texto)/BASE(select 7 opciones)/VALOR(número)/IMPORTE(calculado, `calcularImporteGasto`)/PAGA(`SegmentedControl` Nosotros/Venue)/× + "+ Añadir" (nueva fila con defaults `Artística`/`''`/`importe_fijo`/`0`/`nosotros`). Total gastos (Σ importes, con signo).

---

## 6. Orquestación — `PrevisionTab.tsx`

Estado local (no persistido, es una vista/lente): `escenario: Escenario = 'base'`. Todo lo demás (ticketing, mesasVip, barrasComidaMerch, gastos, ajustesEscenarios, eventoAforo) vive en `proyeccion` y se actualiza vía `onUpdate` (mismo patrón que `AcuerdoTab`).

Orden de renderizado (fiel a `live-prevision-full-page.png`, empezando justo debajo de las tabs, que es donde arranca el alcance de esta fase — el bloque "¿Cómo se calcula?"/"Notas y comentarios" que aparece más arriba en esa captura pertenece a los botones "i"/"Comentarios" de cabecera, **Fase C**, no al layout propio de Previsión):

1. `EscenarioSelector`
2. Franja de 6 `StatCard`
3. Fila `ResultadoAcuerdoCard` / `EscenariosTable` / `GastoPorCategoriaCard`
4. `AjustesEscenariosCard` (colapsada)
5. `EventoAforoCard` (colapsada)
6. `TicketingTable`
7. `MesasVipTable`
8. `BarrasComidaMerchCards`
9. `GastosTable`

---

## 7. Errores y edge cases

- Lista de ticketing/VIP/gastos vacía → tabla con solo cabecera + fila de total en 0 (mismo patrón que "Nueva proyección" del live, gap #1 de recon).
- `calcularBreakeven` sin vías marcadas o con gastos=0 → `null` → UI muestra "—" en vez de `NaN`/`Infinity`.
- `aforoMaximo = 0` → % ocupación 0 en vez de división por cero.
- Reordenar (↑/↓): primer/último elemento deshabilita la flecha correspondiente (mismo patrón visto en el live: `disabled` en los extremos).

---

## 8. Testing

TDD estricto, Vitest + RTL, un commit por tarea:
- `data/calculos-escenarios.test.ts`: cascada de ticketing (caso exacto + caso con corte a mitad de fila), VIP constante, consumo, `calcularBrutosEscenario` reproduce los 3 escenarios exactos de la tabla de §3, `calcularGastoPorCategoria`.
- `data/calculos-breakeven.test.ts`: caso exacto del seed (77%/461/511), caso `null` (gasto inalcanzable), caso con otra combinación de vías.
- `data/calculos-acuerdo.test.ts` (Fase A, ampliado): `calcularImporteGasto` para las 7 bases; `calcularResultadoAcuerdo` sigue dando los mismos 4 valores exactos de Fase A alimentado con `calcularBrutosEscenario(seed, 'base')` en vez de `p.acuerdoBrutos`.
- Componentes: cada tabla/tarjeta nueva con un test de render + interacción (editar campo, añadir/borrar fila, reordenar, toggle checkbox).
- `PrevisionTab.test.tsx`: integración — cambia de escenario y verifica que los 6 `StatCard` cambian a los 3 juegos de cifras exactos; verifica que Ticketing/VIP/Gastos permiten editar y persisten vía `onUpdate`.
- Actualizar tests existentes que leían `p.acuerdoBrutos` (`seed.test.ts`, `calculos-acuerdo.test.ts`, `ResultadoAcuerdoCard.test.tsx`) para usar `calcularBrutosEscenario(p, 'base')`.

---

## 9. Fuera de alcance de Fase B (explícito)

- Tab Real, caja real, panel Comentarios, picker de responsables, exports PDF/Excel, botón "i", buscador real de venue → **Fase C**.
- Persistencia real (Supabase) → futura.
- El propio contenido de "¿Cómo se calcula?" como panel dentro de Previsión (vive detrás del botón "i" de cabecera, Fase C) — sus fórmulas SÍ se han usado como fuente de verdad para el motor de esta fase, pero el panel en sí no se construye aquí.
