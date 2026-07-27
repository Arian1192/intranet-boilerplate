# Herramientas · Fase C — Cierre del módulo (tab Real · Comentarios · Responsables · Exports · Info) · Design

**Fecha:** 2026-07-24
**Rama:** `feature/herramientas` (continúa sobre Fase B, commits hasta `58ddc70`)
**Tipo:** Calco fiel al live, presentacional, en memoria (sin Supabase). Fase 3 de 3 — **cierra el módulo Herramientas**.

---

## 1. Contexto y objetivo

Fases A y B dejaron el detalle de una proyección con las tabs **Acuerdo** y **Previsión** resueltas y con motor real (escenarios, breakeven, gastos-CRUD). Lo que sigue pendiente, todo agrupado en esta fase de cierre:

1. **Tab Real** — hoy es `<TabPlaceholder fase="C" />`. Debe mostrar la cuenta de explotación con las cifras **reales ejecutadas** del evento, comparadas implícitamente contra la Previsión, reusando el motor de Acuerdo y los componentes de sección donde aplique.
2. **Panel de Comentarios** ("Notas y comentarios") — hoy el botón "Comentarios" del header es inerte.
3. **Picker de responsables** ("＋ Añadir") — hoy el botón es inerte; se pueden quitar chips pero no añadir.
4. **Exports** PDF Ventas / PDF Explotación / Excel — hoy 3 botones inertes en el header.
5. **Botón "i"** ("¿Cómo se calcula?") — hoy inerte.

Además, como Fase B eliminó el campo estático `acuerdoBrutos` sustituyéndolo por cálculo derivado, esta fase hace lo simétrico con el **último hardcode que queda**: `Proyeccion.resultadoReal = { beneficioNeto: -4792.73 }`. Se retira y se calcula de verdad a partir de `entradasReal[]` / `mesasReal` / `cajaReal[]` (los campos `?` que Fase A/B ya dejaron previstos en `types.ts`).

### Criterios de éxito de Fase C
- Tab Real pixel-fiel al live (`live-info-como-se-calcula.png` + `live-picker-responsables.png`, que capturan la cabecera de la tab Real): **5 KPIs** (no 6 — desaparece "Punto de equilibrio", entra "Asistencia real"), `Resultado por acuerdo`, `Gasto por categoría`, y las secciones de detalle con sus **columnas REAL**.
- Motor real que reproduce **exactamente al céntimo** los agregados observados del seed "PQ @ SLS Barcelona": Ingresos por acuerdo **677,27€** (Total **745,00€**), Inversión que asumimos **-5470,00€**, Beneficio por acuerdo **-4792,73€**, Margen **-707.7%**, Asistencia real **132 / 600 (22%)**, "Evento completo: -4792,73€ (-708%)". **Sin ninguna constante hardcodeada** (se elimina `resultadoReal`).
- Comentarios, Responsables e Info funcionan (no maquetas muertas). Exports = **MOCK FIEL** (ver §7, delta consciente acordado con el coordinador).
- Verde total (tests, lint 0, tsc). Verificación Playwright ours-vs-live formal al cerrar el módulo. Una sola PR (A+B+C) con base `feature/mixmag-tagmag`.

---

## 2. Arquitectura

### Nuevos ficheros `data/`
- **`calculos-real.ts`** — el motor real (simétrico a `calculos-escenarios.ts`):
  - `calcularBrutosReal(p): AcuerdoBrutos` — brutos a partir de datos ejecutados, **sin waterfall ni escenario** (las ventas reales son hechos, no proyecciones en cascada).
  - `asistenciaReal(p): number` — `Σ entradasReal + invitaciones`.
  - `tieneDatosReal(p): boolean` — hay algún input real (`entradasReal`/`mesasReal`/`cajaReal`).
  - `calcularResultadoReal(p): ResultadoAcuerdo | null` — `null` si `!tieneDatosReal`; si no, `calcularResultadoAcuerdo(p.acuerdo, calcularBrutosReal(p), p.eventoAforo, p.gastos)`. **Reusa la MISMA `calcularResultadoAcuerdo` de Fase A — cero duplicación de la lógica de acuerdo/IVA/gastos.**
- **`personas.ts`** — pool local de personas seleccionables en el picker de responsables (ver §5 / decisión D4).
- **`textos-info.ts`** — las 6 secciones fijas de "¿Cómo se calcula?" (copy exacto transcrito del live) como datos, para que el componente sea presentacional puro.

### Modificados `data/`
- **`types.ts`**: se retira `resultadoReal: ResultadoReal | null` de `Proyeccion` y se elimina la interfaz `ResultadoReal` (queda como derivado, igual que `acuerdoBrutos` en Fase B). `Comentario` ya existe (`{ id, autor, texto, fecha }`). Se añade `Persona` (para el pool) si no reutilizamos otra fuente (D4).
- **`seed.ts`**: se retira `resultadoReal`; se siembran los inputs reales de "PQ @ SLS Barcelona" (`entradasReal` en releases, `cajaReal` vacío, `mesasReal` ausentes) que reproducen los agregados del live (ver §3, decisión D1). `comentarios: []` se mantiene.
- **`proyecciones-crud.ts`**: se retira `resultadoReal: null` del borrador en blanco.

### Componentes
- **Nuevos**: `RealTab` (orquestador), `CajaRealTable` (tabla libre "Caja real (barras, comida, extras)" con "Rellenar con previsión" + estado vacío), `ComentariosPanel`, `ResponsablesPicker`, `InfoComoSeCalcula`.
- **Modificados (reuso con variación, no duplicación)**:
  - `TicketingTable` / `MesasVipTable`: aceptan `modo: 'prevision' | 'real'`; en `'real'` ticketing añade **ENTRADAS REAL** + sub-línea "Facturación real" (y renombra ENTRADAS→ENTRADAS PREV., oculta la columna FACTURACIÓN), y VIP añade solo la columna **MESAS REAL** (sin facturación por fila). Layout exacto en §4.1. En `'prevision'` no cambian.
  - `ProyeccionHeader`: cablea "Comentarios" (toggle), "i" (toggle), "＋ Añadir" (abre `ResponsablesPicker`), y los 3 botones de export (mock, D5). Ajuste de estructura de tarjetas para hospedar fielmente los paneles (D2).
  - `ProyeccionRow`: sustituye `proyeccion.resultadoReal` por `tieneDatosReal(p)` (badge "Real") y `calcularResultadoReal(p)?.beneficioPorAcuerdo` (cifra REAL).
  - `ProyeccionDetailPage`: `tab === 'real'` renderiza `<RealTab>` en vez del placeholder; hospeda los paneles Comentarios/Info.

---

## 3. El motor real — reconciliación al céntimo

**Identidad clave que fija el modelo:** de las 2 capturas buenas de la tab Real (`live-info-como-se-calcula.png`, `live-picker-responsables.png`) se leen los agregados: Ingresos **677,27€** / Total brutos **745,00€**. Y **745,00 ÷ 1,10 = 677,272… = 677,27€ exacto**. Como el tramo de acuerdo de ticketing es `100% · neto · 0€ · 0%` (seed), esto obliga a que **todo el ingreso real sea "ticketing"** (VIP/barras/comida/merch reales = 0). Además "Evento completo: -4792,73€" = Beneficio por acuerdo, lo que confirma `nuestrosIngresos = totalNetoEvento` (solo hay una vía real). Todo cuadra sin forzar nada:

| Magnitud | Fórmula | Valor |
|---|---|---|
| Ticketing bruto real | `Σ entradasReal × precio` | **745,00€** |
| Ticketing neto | `745 / 1,10` | 677,27€ |
| Nuestros ingresos | ticketing 100%/neto → neto; resto vías = 0 | **677,27€** |
| Gastos que asumimos | 7 gastos `importe_fijo`, todos "nosotros" | **-5470,00€** |
| Beneficio por acuerdo | 677,27 − 5470 | **-4792,73€** |
| Margen s/ ingresos | -4792,73 / 677,27 × 100 | **-707.7%** (`toFixed(1)`) |
| Evento completo | totalNeto (=677,27) − 5470 | **-4792,73€ (-708%)** (`Math.round`) |
| Asistencia real | `Σ entradasReal (82) + invitaciones (50)` | **132 / 600** → 22% |

Coincidencia exacta en TODAS las celdas visibles, sin constantes. `calcularResultadoReal` es literalmente `calcularResultadoAcuerdo` con brutos reales — el mismo motor que ya reproduce Previsión al céntimo (Fase B).

### 3.1 `calcularBrutosReal`
```ts
export function calcularBrutosReal(p: Proyeccion): AcuerdoBrutos {
  const ticketing = p.ticketing.reduce((a, r) => a + (r.entradasReal ?? 0) * r.precio, 0);
  const mesasVip = p.mesasVip.reduce((a, z) => a + (z.mesasReal ?? 0) * z.precio, 0);
  const cajaTotal = p.cajaReal.reduce((a, l) => a + l.importe, 0);
  // "Caja real" es una tabla libre indiferenciada (barras/comida/extras). El acuerdo
  // distingue tramos, pero la caja no; se pliega en el bucket `barras` (mismo IVA que
  // comida/VIP). IMPACTO NULO en el seed (cajaReal vacío); se documenta como decisión
  // de modelado (D1) para el caso no-vacío.
  return { ticketing, mesasVip, barras: cajaTotal, comida: 0, merchandising: 0 };
}
```
- **Ticketing real: `Σ entradasReal × precio`** — directo, sin waterfall (a diferencia de Previsión, que proyecta en cascada). Las ventas reales por release son hechos observados.
- **VIP real: `Σ mesasReal × precio`** — sin `probabilidadPct` (la probabilidad es una herramienta de proyección; en Real ya se sabe cuántas mesas se vendieron).

### 3.2 Semilla de datos reales — EVIDENCIA del live (PATH A, ejecutado)
Decisión firme de Arian: nada de inferencia. Re-capturé yo mismo la tab Real del live (`test@blackmoose.es`, solo lectura, sin mutar nada), reemplacé el asset corrupto por `docs/references/herramientas/live-proyeccion-detalle-real.png` (1440×2707 válido) y leí los **inputs `ENTRADAS REAL` exactos del DOM** (no deducidos):

| Release (orden) | precio | **entradasReal (live)** | facturación real |
|---|---|---|---|
| Early Access | 8 | **20** | 160,00€ |
| Online · Release 1 | 10 | **20** | 200,00€ |
| Online · Release 3 | 12 | **0** | 0,00€ |
| Online · Release 2 | 15 | **9** | 135,00€ |
| Pack 2 Entradas | 7,5 | **28** | 210,00€ |
| Pack 5 Entradas | 8 | **5** | 40,00€ |
| Taquilla | 0 | **0** | 0,00€ |
| **Total** | | **82** | **745,00€** |

`mesasReal = 0` en las 3 zonas VIP (Zona 1/2/3), leído del DOM (columna MESAS REAL = 0/0/0 → Total VIP real 0,00€). `cajaReal: []` (el live muestra el estado vacío "Sin líneas todavía. Añade o rellena con la previsión." · Total caja neto 0,00€). Con estos valores exactos, `calcularBrutosReal` reproduce ticketing 745,00€ → neto 677,27€ → beneficio -4792,73€ y asistencia 82+50=132. **La distribución sale de la captura, no de la interpretación.**

---

## 4. Tab Real — layout

Orquestador `RealTab` (espejo de `PrevisionTab`, con estas diferencias):

- **Sin** `EscenarioSelector`, **sin** tabla `Escenarios`, **sin** `AjustesEscenariosCard` (breakeven/escenarios son solo de planificación — confirmado por el recon y por la ausencia de la KPI "Punto de equilibrio").
- **5 KPIs** (grid de 5, no 6):
  1. Ingresos por acuerdo → `resultado.nuestrosIngresos` · caption `Total {totalBrutosReal}`.
  2. Inversión que asumimos → `resultado.gastosQueAsumimos` (rojo) · caption `Total {-totalGastos}`.
  3. Beneficio por acuerdo → `resultado.beneficioPorAcuerdo` (rojo/verde) · caption `Total {eventoCompletoBeneficio}`.
  4. Margen por acuerdo → `{margenSobreIngresos.toFixed(1)}%`.
  5. **Asistencia real** → `{asistenciaReal} / {aforoMaximo}` · caption `{ocupacion}% ocupación`.
- `ResultadoAcuerdoCard` y `GastoPorCategoriaCard` **reusados tal cual** (los gastos son los mismos que en Previsión → "Gasto por categoría" idéntico: Artística 44% / Promoción 27% / Publicidad 24% / Staff 5%).
- Secciones de detalle: `EventoAforoCard` (resumen con **132 pax** real), `TicketingTable modo="real"`, `MesasVipTable modo="real"`, `CajaRealTable` (en lugar de `BarrasComidaMerchCards`), `GastosTable` (idéntico).

### 4.1 Columnas REAL (layout exacto del live capturado)
- **Ticketing** (`modo="real"`): columnas **RELEASE · ENTRADAS PREV. · PRECIO € · ENTRADAS REAL** (+ reordenar ↑↓ / borrar ×). La columna "ENTRADAS" pasa a llamarse **"ENTRADAS PREV."**; **desaparece la columna "FACTURACIÓN"** de Previsión, sustituida por una sub-línea por fila a la derecha **"Facturación real {entradasReal × precio}"**. Pie: **"Total ticketing · 82 entradas"** · **"745,00 €"** · **"Por acuerdo 677,27 €"**. El checkbox "Desglosar por ticketera" se mantiene (compartido; false en el seed).
- **Mesas VIP** (`modo="real"`): columnas **ZONA · MESAS · PROB. % · PRECIO € · MESAS REAL** (+ borrar ×). **No** hay sub-línea de facturación por fila (a diferencia de ticketing). Pie: **"Total VIP"** · **"0,00 €"** (real = Σ mesasReal × precio) · **"Por acuerdo 0,00 €"**.
- **CajaRealTable** (sustituye a `BarrasComidaMerchCards` en Real): título **"Caja real (barras, comida, extras)"**, subtítulo **"Una línea por fuente: cada TPV de barra o datáfono, guardarropa, comida, shishas…"**, acciones **"Rellenar con previsión"** (genera líneas a partir de `calcularBrutosEscenario(p,'base')` barras/comida/merch) y **"+ Añadir"**; estado vacío **"Sin líneas todavía. Añade o rellena con la previsión."**; pie **"Total caja neto {Σ importe}"** (0,00€ en el seed).

---

## 5. Comentarios · Responsables · Info

### 5.1 ComentariosPanel ("Notas y comentarios")
- Toggle desde el botón "Comentarios" del header. Se renderiza como tarjeta colapsable entre la barra de herramientas y la tarjeta ESTADO (ver D2).
- Contenido: título "Notas y comentarios"; lista de `p.comentarios` (autor · fecha · texto) o estado vacío **"Sin comentarios todavía."**; `Textarea` "Escribe un comentario…" + botón "Enviar" (oscuro).
- "Enviar" → `actualizar(id, { comentarios: [...p.comentarios, nuevo] })`. `nuevo = { id, autor, texto, fecha }` (D3: `autor` = usuario actual fijo "Tú"; `fecha` ISO, se muestra en formato corto es-ES vía `src/lib/format`). Input se limpia; textarea vacía o en blanco no envía.

### 5.2 ResponsablesPicker ("＋ Añadir")
- Dropdown bajo el botón "＋ Añadir": `Input` "Buscar persona…" + lista de personas (avatar/iniciales + nombre); los ya asignados aparecen con "✓" al final y no se re-añaden. Clic en una persona no asignada → `actualizar(id, { responsables: [...p.responsables, persona] })`. Escape / clic fuera cierra.
- Pool: `personas.ts` local (D4), con nombres cortos tal como los muestra el live (Alba Gelabert, Aldo Messina, Alex González, Carlos Pego, Fran Hinojosa Veredas, Israel Cuenca, …) e iniciales/color de avatar.

### 5.3 InfoComoSeCalcula ("¿Cómo se calcula?")
- Toggle desde el botón "i" del header (que pasa a círculo relleno oscuro cuando está abierto). Se renderiza bajo las tabs, sobre los KPIs (visible en cualquier tab). Cerrable con "×".
- Caja con **6 subsecciones fijas** en grid 3×2, copy exacto de `textos-info.ts` (transcrito de `live-info-como-se-calcula.png`): ASISTENCIA · BRUTO Y NETO (IVA) · VIP: PROBABILIDAD VS ESCENARIO · CONSUMO · PUNTO DE EQUILIBRIO (BREAKEVEN) · ACUERDO: BMG VS VENUE.

---

## 6. Estado de UI del detalle

`ProyeccionDetailPage` gana estado local `panelComentarios: boolean` e `infoAbierta: boolean` (o un `panelAbierto: 'comentarios' | null` si son exclusivos — no lo son en el live, el info es independiente). El picker de responsables gestiona su propio abierto/cerrado dentro de `ResponsablesPicker`. Nada de esto se persiste (UI efímera).

---

## 7. Decisiones abiertas / deltas conscientes

- **D1 — Datos reales por sección.** **RESUELTO (PATH A, evidencia del live).** Re-capturé la tab Real yo mismo (solo lectura), reemplacé el asset corrupto y leí los `entradasReal`/`mesasReal` exactos del DOM (§3.2). La distribución sembrada es la del live, no inferencia. Cerrado.
- **D2 — Estructura de tarjetas del header.** El live muestra la barra de herramientas (Volver/nombre/i/Guardado/botones) **flotando sobre el fondo** (sin tarjeta) y ESTADO/RESPONSABLES en su propia tarjeta, con el panel Comentarios insertándose entre ambas. La `ProyeccionHeader` de Fase A envuelve todo en una sola tarjeta. **Recomendación:** ajustar a la estructura del live (necesario para hospedar Comentarios fielmente). Toca un componente de Fase A pero dentro del mismo módulo/rama.
- **D3 — Autor/fecha de comentarios.** Sin auth real → `autor` fijo ("Tú" / usuario actual del shell), `fecha` ISO mostrada en formato corto es-ES. Minor.
- **D4 — Pool de responsables. RESUELTO: pool local `personas.ts` sembrado con EVIDENCIA del live.** Antes de Task 7 se re-captura en SOLO LECTURA el desplegable "＋ Añadir" del live (mismo rigor que la tab Real: sin mutar nada) y se siembra `personas.ts` con la **lista exacta — mismos nombres y orden que el live** (no nombres aproximados). El PNG se guarda en `docs/references/herramientas/` (`live-picker-responsables-full.png`). Se mantiene el pool **local** (módulo autocontenido, sin importar `team/data`), pero su contenido es evidencia capturada.
- **D5 — Exports = BOTONES INERTES (acordado con el coordinador).** Los 3 botones (PDF Ventas / PDF Explotación / Excel) presentes e **idénticos al live** en posición/etiqueta/icono, **sin acción al pulsar** (cero ruido). **NO** se añade aviso "Próximamente" ni ningún feedback: el live no lo muestra y la prioridad es la fidelidad al píxel. No generan fichero ni replican el layout del PDF. **Delta consciente documentado aquí y a repetir en la descripción de la PR**, igual que el adjunto de Incidencias.

---

## 8. Testing (resumen; el detalle va en el plan TDD)
- `calculos-real.test.ts`: reproduce al céntimo la tabla de §3 (brutos reales, resultado, asistencia 132, margen -707.7%, evento completo -708%), incluye caso `tieneDatosReal=false` → `null`, y VIP/caja reales no nulos.
- Un `.test.tsx` por componente nuevo/modificado (RealTab, CajaRealTable, ComentariosPanel, ResponsablesPicker, InfoComoSeCalcula, columnas REAL de Ticketing/MesasVip, ProyeccionRow derivado, ProyeccionHeader cableado).
- Regresión: la tab Previsión y Acuerdo no cambian su salida (los `modo="prevision"` y los tests existentes siguen verdes).
