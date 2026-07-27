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

## Huecos — recon de cierre 2026-07-23 (hecho por Claude/Herramientas contra el live, solo navegación/toggles reversibles, sin pulsar Guardar en ningún cambio sobre el registro real; verificado que los valores de "PQ @ SLS Barcelona" quedaron idénticos a los de arriba tras todas las pruebas)

1. **"Nueva proyección"** (`live-nueva-proyeccion-form-vacio.png/.json`): el botón navega directo a un detalle en blanco con las 3 tabs ya montadas y estado "Cambios sin guardar" (modelo de guardado explícito, no autosave — confirmado: nunca se persistió nada porque no se pulsó "Guardar" y se navegó fuera). Campos vacíos relevantes en "Evento y aforo": NOMBRE (texto, prellenado "Nuevo evento"), FECHA (date), VENUE (buscador "Buscar venue…"), AFORO MÁXIMO, DURACIÓN (HORAS) (def. 6), INVITACIONES, IVA TICKETING % (def. 10), IVA BARRAS/COMIDA/VIP % (def. 10), toggle "forzar a mano" para la asistencia proyectada. Todas las secciones (Ticketing, Mesas VIP, Barras/comida/merch, Gastos) arrancan a 0/vacías con sus mismos headers que en el registro sembrado — no hay un estado-vacío distinto, es la misma UI con ceros.
2. **Picker "＋ Añadir" responsables** (`live-picker-responsables.png`): dropdown con buscador "Buscar persona…" + lista de personas (avatar+iniciales+nombre), los ya asignados aparecen con "✓" al final de la lista (Jack Howell, Tony Carrerira). No se seleccionó a nadie (solo captura + Escape). **Botón "i"** (`live-info-como-se-calcula.png`): abre una caja "¿Cómo se calcula?" (cerrable con ×) con 6 sub-secciones fijas: ASISTENCIA, BRUTO Y NETO (IVA), VIP: PROBABILIDAD VS ESCENARIO, CONSUMO, PUNTO DE EQUILIBRIO (BREAKEVEN), ACUERDO: BMG VS VENUE — texto explicativo de las fórmulas, útil como fuente de verdad para los cálculos del spec.
3. Exports (**PDF Ventas / PDF Explotación / Excel**): siguen sin pulsarse — no se genera nada para no tocar nada real. Decisión de spec: implementarlos como export real in-memory (jsPDF/xlsx o similar) sobre los datos ya calculados en cliente, mismo patrón que otros exports del repo; no hace falta ver el PDF real del live para maquetar contenido razonable (Ventas = ticketing/VIP, Explotación = cuenta completa).
4. **Panel "Comentarios"** (`live-panel-comentarios.png`): caja colapsable "Notas y comentarios", estado vacío "Sin comentarios todavía.", input "Escribe un comentario…" + botón "Enviar". No se envió ningún comentario real.
5. **"Evento y aforo"** interior: ver punto 1 (mismos campos que en el formulario vacío, aquí con los datos sembrados: PQ @ SLS Barcelona, 18/07/2026, Cósmico @ SLS Barcelona, 600, 6h, 50 invitaciones, IVA 10%/10%, "Asistencia proyectada 500 = entradas + invitaciones · PAX de pago 450").
6. **Checkbox "Desglosar por ticketera"** (`live-ticketing-desglose-antes.png` / `-despues.png`): al activarlo, cada fila de RELEASE gana una línea extra "Reparto ticketeras: 0 / N + ticketera" (breakdown por canal de venta tipo Fourvenues/RA/DICE, con botón "+ ticketera" para añadir canal); los totales de la tabla no cambian, es puramente un desglose adicional por fila. Se restauró el checkbox a su estado original (desactivado) y se confirmó que el contenido de la tabla vuelve a ser idéntico al de antes.
7. **"Barras, comida y merch" (Previsión) vs "Caja real" (Real)** (`live-prevision-full-page.png`): confirmado que son formas distintas. Previsión es fija: 3 tarjetas (Barras/Comida/Merch), cada una con 2 inputs específicos + "Por acuerdo" calculado — Barras: CONSUMICIONES/HORA + PRECIO MEDIO € (nota "X cons./pax en Yh"); Comida: % QUE CONSUME + TICKET MEDIO €; Merch: % CONVERSIÓN + PRECIO MEDIO €. Real, en cambio, es una tabla libre de líneas manuales con botón "Rellenar con previsión" (según recon previo).
8. **Duplicar/Borrar/Convertir en evento** (`live-lista-hover-duplicar-borrar.png`, `live-convertir-en-evento-hover.png`): confirmada la existencia y el copy exacto de los 3 botones (hover únicamente, nunca se pulsaron — Borrar/Duplicar mutarían el único registro real sembrado y Convertir en evento es integración cruzada). Para el spec: asumir comportamiento estándar (Borrar con confirmación modal, Duplicar crea copia editable con sufijo o "(copia)", Convertir en evento queda **inerte** en nuestro calco, fuera de alcance de esta fase).
9. Lista con varias proyecciones: sigue sin poder verse (solo 1 sembrada en el live y no se puede crear una real para probarlo). Se diseñará la lista de forma genérica para N filas (orden por fecha de actualización descendente, como sugiere "actualizado —" en el único item).

Capturas/snapshots de esta ronda en esta misma carpeta: `live-nueva-proyeccion-form-vacio.{png,json}`, `live-picker-responsables.png`, `live-info-como-se-calcula.png`, `live-panel-comentarios.png`, `live-prevision-full-page.png`, `live-lista-hover-duplicar-borrar.png`, `live-convertir-en-evento-hover.png`, `live-ticketing-desglose-{antes,despues}.png`.

## Notas de fidelidad ya verificadas

- Formato de moneda del live usa coma decimal sin agrupar miles con NBSP raro salvo excepción ya conocida (ver `formatCurrency`/`formatCurrencyPrecise` en `src/lib/format.ts` — reusar, no reinventar).
- Porcentajes con un decimal tipo `13.6%` (con punto, no coma — verificar si es un caso especial del live o simple `toFixed(1)` sin locale).
- El módulo cuelga del layout global (`AppLayout`, TopNav, panel Ayuda) igual que el resto — reusar el shell pattern ya usado en Incidencias/Mi trabajo (`AppLayout` + tabs de sub-nav reales, sin `useOutletContext`, un solo módulo no parametrizado).
