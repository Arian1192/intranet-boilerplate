# Recon — Herramientas (`/herramientas`) — 2026-07-23

Hecho por Claude (coordinador) contra el live logueado (`test@blackmoose.es` / `Concept1234`), solo navegación/toggles, sin crear/editar/borrar nada real. Screenshots y snapshots de accesibilidad en esta carpeta. **Recon parcial** — hay huecos señalados abajo que el agente que implemente debe completar antes de dar el módulo por especificado (regla del proyecto: "abrir el detalle antes de dar un módulo por cerrado").

## Estructura general

- `/herramientas` (landing, `live-herramientas.png`): H1 "Utilidades del grupo", subtítulo "Calculadoras y herramientas transversales del equipo. Se irán sumando más con el tiempo.", una sola tarjeta-link: **"Proyecciones · P&L de eventos"** — "Cuenta de explotación por aforo, ventas y gastos. Escenarios, punto de equilibrio selectivo e informes PDF/Excel."
- Nav propia del módulo en el header (patrón ya visto en otros módulos): botón "Herramientas" + sub-nav con links "Herramientas" / "Proyecciones".
- `/herramientas/proyecciones` (lista, `live-proyecciones-lista.png`): botón "Nueva proyección" (arriba, no explorado — **falta ver el formulario/flujo de creación**), y una lista de proyecciones existentes como filas-botón. Solo hay **1 proyección real sembrada**: "PQ @ SLS Barcelona" — badge "Real", estado "Aprobada", "18 jul 2026 · actualizado —", con dos cifras a la derecha (PREVISIÓN 860,14€ / REAL -4792,73€) y acciones "Duplicar"/"Borrar" en hover o al lado.

## Detalle de una proyección (clic en la fila)

Cabecera fija: "← Volver", nombre editable (botón "PQ @ SLS Barcelona", clic no explorado — **¿inline-edit?**), botón "i" (**no explorado, probablemente info/metadata**), "Guardado" (autosave, texto de estado), botón "Comentarios" (**no explorado**), 3 botones de export **"PDF Ventas" / "PDF Explotación" / "Excel"** (no explorado el contenido de los documentos generados — no se pulsaron para no generar nada real en el live), "Guardar".

Fila de **ESTADO** (4 botones tipo toggle-único): Borrador / En junta / Aprobada / Rechazada — el activo actualmente es "Aprobada".

**REUNIÓN**: date picker con día/mes/año.

**RESPONSABLES**: chips de persona (avatar+nombre+"Quitar"), botón "＋ Añadir" (**no explorado el picker**). Sembrado con 2: Jack Howell, Tony (Carrerira, iniciales "TC").

Botón **"Convertir en evento →"** (no explorado — probablemente crea/vincula un evento real de producción; **inerte en nuestro calco**, es una integración cruzada con otro módulo que no toca esta fase).

### 3 tabs de vista: Acuerdo / Previsión / Real

Comparten la mayoría de secciones pero con datos y algunos campos distintos:

**Tab "Acuerdo"** (config del contrato, `live-proyeccion-acuerdo-snapshot.txt`): sección "Acuerdo con el venue / promotor" — una fila por tramo de ingreso (ticketing, VIP, barras, etc., 5 filas vistas) con: `NOS LLEVAMOS %`, toggle **"SOBRE Bruto" / "Neto"** (base de cálculo), `DEDUC. FIJA €`, `DEDUC. %`. Sección "¿Quién paga cada gasto?" con toggles Nosotros/Venue (mismo patrón que en Gastos).

**Tab "Previsión"** (`live-proyeccion-prevision-snapshot.txt`, `live-proyeccion-detalle-prevision-escenarios.png`): esta es la vista más rica.
- "Resultado por acuerdo": NUESTROS INGRESOS, GASTOS QUE ASUMIMOS, BENEFICIO POR ACUERDO, MARGEN S/INGRESOS + frase resumen "Evento completo: X€ (Y%)."
- **"Escenarios"**: tabla ESCENARIO / Bº POR ACUERDO / MARGEN con 3 filas fijas: Pesimista / Base / Optimista (valores: -1134,69€/-26.2%, 860,14€/13.6%, 2604,97€/32.3% en el seed).
- "Gasto por categoría": barra/lista de categorías con importe + %.
- **"Ajustes de escenarios y breakeven"** (colapsable, resumen en el título "Base 75% · BE 77%"): `MULTIPLICADOR POR ESCENARIO` — 3 spinbuttons PESIMISTA %/BASE %/OPTIMISTA % (seed 50/75/100, son multiplicadores de aforo, no de precio); `BREAKEVEN · VÍAS QUE CUENTAN` — 5 checkboxes (Ticketing✓/Mesas VIP/Barras✓/Comida/Merchandising) que determinan qué fuentes de ingreso cuentan para el cálculo de equilibrio; resultado derivado: "% de venta proyectada 77% · Entradas necesarias 461 · Asistencia necesaria 511".
- "Evento y aforo" (colapsable, resumen "18 jul 2026 · 600 · 6h · 500 pax"): fecha, aforo total, duración, pax proyectados — **no explorado su interior, solo el resumen**.
- "Ticketing": tabla editable RELEASE/ENTRADAS/PRECIO €/FACTURACIÓN, reordenable (↑↓), borrable (×), + "Añadir", checkbox "Desglosar por ticketera (Fourvenues, RA, DICE…)" (**no explorado qué cambia al activarlo**). Total ticketing + entradas + "Por acuerdo" (aplicando el % de la pestaña Acuerdo).
- "Mesas VIP": tabla ZONA/MESAS/PROB. %/PRECIO € (+ "MESAS REAL" solo en tab Real), + Añadir, total.
- "Barras, comida y merch" (nombre en Previsión; en Real se llama **"Caja real (barras, comida, extras)"** — el copy cambia según el tab): en Real es una tabla libre "una línea por fuente" con botón "Rellenar con previsión" y estado vacío "Sin líneas todavía. Añade o rellena con la previsión." — **en Previsión no se vio su forma exacta, solo el título; comprobar si difiere de la de Real**.
- "Gastos": tabla CATEGORÍA (select con 14 opciones: Artística/Publicidad/Promoción/Staff/Alquileres/Sonido/Iluminación/Efectos/Producción/Seguridad/Barras/Comida/Ticketing/Otros) / CONCEPTO (texto) / BASE (select: Importe fijo €, % facturación neta, % ticketing neto, % VIP neto, % barras neto, % comida neta, % merch neto) / VALOR / IMPORTE (calculado) / PAGA (toggle Nosotros/Venue) / borrar. Total gastos.

**Tab "Real"** (visto primero, contenido íntegro ya lo leí aunque no guardé el .txt — reconstruible del screenshot `live-proyeccion-detalle-real.png`): mismas secciones que Previsión pero con columnas "REAL" añadidas (p.ej. ticketing tiene columna extra "ENTRADAS REAL" con su propia "Facturación real"; Mesas VIP tiene "MESAS REAL"), sin sección Escenarios/breakeven (esas son solo de planificación, en Real ya no aplican — **a confirmar**), con "Caja real" en vez de "Barras, comida y merch". Los KPIs de cabecera (ASISTENCIA REAL 132/600, 22% ocupación) usan los números reales en vez de los proyectados.

## Huecos que quedan por reconocer (antes de cerrar el spec)

1. Formulario/flujo de **"Nueva proyección"** (vacío) y estado vacío del módulo si no hay ninguna.
2. Picker de **"＋ Añadir" responsables** y el botón **"i"** de la cabecera.
3. Contenido real de los 3 exports (**PDF Ventas / PDF Explotación / Excel**) — no se generaron para no tocar nada real; en nuestro calco serán botones inertes o con export real in-memory (a decidir en el spec, igual que "Descargar código QR" u otros exports de otros módulos).
4. Panel **"Comentarios"**.
5. Interior de **"Evento y aforo"** (qué campos tiene además del resumen).
6. Efecto exacto del checkbox **"Desglosar por ticketera"**.
7. Si "Barras, comida y merch" (Previsión) tiene la misma forma que "Caja real" (Real) o es distinta.
8. Comportamiento de **"Duplicar"** y **"Borrar"** en la lista, y de **"Convertir en evento →"**.
9. Solo hay **1 proyección sembrada** en el live — no se ha visto cómo luce con varias, ni filtros/orden en la lista.

## Notas de fidelidad ya verificadas

- Formato de moneda del live usa coma decimal sin agrupar miles con NBSP raro salvo excepción ya conocida (ver `formatCurrency`/`formatCurrencyPrecise` en `src/lib/format.ts` — reusar, no reinventar).
- Porcentajes con un decimal tipo `13.6%` (con punto, no coma — verificar si es un caso especial del live o simple `toFixed(1)` sin locale).
- El módulo cuelga del layout global (`AppLayout`, TopNav, panel Ayuda) igual que el resto — reusar el shell pattern ya usado en Incidencias/Mi trabajo (`AppLayout` + tabs de sub-nav reales, sin `useOutletContext`, un solo módulo no parametrizado).
