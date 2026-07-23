# Herramientas · Fase A — Shell + Landing + Lista + Acuerdo · Design

**Fecha:** 2026-07-23
**Rama:** `feature/herramientas` (base `feature/mixmag-tagmag`, ya sincronizada con el merge de Team #10 e Incidencias #9)
**Tipo:** Calco fiel al live (`bookings.conceptoneagency.com`), presentacional, en memoria (sin Supabase todavía). Fase 1 de 3 del módulo Herramientas.

---

## 1. Contexto y objetivo

`/herramientas` hoy es un placeholder (`ModuleShell` genérico). El live tiene un módulo real: landing "Utilidades del grupo" con una tarjeta-link a **Proyecciones · P&L de eventos**, una lista de proyecciones, y un detalle con 3 tabs (Acuerdo / Previsión / Real) muy ricos en subsecciones (acuerdo con el venue, escenarios, breakeven, ticketing, mesas VIP, gastos, caja real, comentarios, exports).

Dado el tamaño del módulo, se divide en 3 fases (acordado con el usuario):
- **Fase A (esta)**: shell del módulo con sub-nav real, landing, lista de proyecciones (con alta/duplicar/borrar en memoria), y la tab **Acuerdo** del detalle.
- **Fase B**: tab **Previsión** (escenarios, breakeven, ticketing, mesas VIP, gastos, barras/comida/merch).
- **Fase C**: tab **Real** + extras transversales de la cabecera del detalle (panel Comentarios, picker de responsables, exports PDF/Excel, botón "i").

Recon completo (incluyendo el cierre de los 9 huecos iniciales) en `docs/references/herramientas/recon-notas.md` — es la fuente de verdad para textos, valores y comportamiento exacto del live. Este documento no transcribe cifras a mano; los valores exactos de la semilla se toman de los ficheros ya guardados en esa carpeta.

**Importante (nota del usuario):** todavía no hay acceso a Supabase. El modelo de datos de esta fase es **UI-first**: se define para que la interfaz funcione y sea fiel al live, no como espejo de un schema real. Cuando haya acceso a Supabase, el tipo se **adaptará** a las tablas que existan — no al revés.

### Criterios de éxito de Fase A
- `/herramientas`: landing con H1 "Utilidades del grupo", subtítulo, y la tarjeta-link a Proyecciones, pixel-fiel a `live-herramientas.png`.
- `/herramientas/proyecciones`: título "Cuenta de explotación de eventos" + subtítulo, botón "Nueva proyección" funcional, lista de proyecciones (semilla: solo "PQ @ SLS Barcelona", fiel a `live-proyecciones-lista.png`), Duplicar/Borrar funcionales sobre el estado en memoria.
- `/herramientas/proyecciones/:id`: cabecera completa pixel-fiel (Volver, nombre, Guardado/Guardar, Estado, Reunión, Responsables, Convertir en evento, más los botones "i"/Comentarios/PDF Ventas/PDF Explotación/Excel **visibles pero inertes** hasta Fase C) + tabs Acuerdo/Previsión/Real, con **Acuerdo** funcional y Previsión/Real como placeholder "se construye en la Fase B/C".

**Simplificación deliberada respecto al live:** en el live, un borrador nuevo no persiste hasta pulsar "Guardar" (hay backend real detrás; si navegas fuera sin guardar, el registro nunca se creó). En nuestro calco no hay backend que "no confirme" una fila — el propio store en memoria hace ese papel. Por tanto `createBlankProyeccion()` **inserta el borrador de inmediato** en el store compartido (con `estado: 'borrador'`) y navega a su detalle; el botón "Guardar" solo controla el indicador visual "Cambios sin guardar" → "Guardado" (fidelidad de copy), sin lógica de descarte-si-no-guardas. Esto evita tener que sincronizar un estado "draft huérfano" fuera del store y sus problemas de ciclo de vida (qué pasa si se navega fuera, se cierra la pestaña, etc.), a costa de un matiz de fidelidad que no es observable salvo que el usuario cree y abandone deliberadamente una proyección sin guardar.
- Verde total (tests, lint 0, tsc). Sin mutaciones reales en el live durante el desarrollo (todo el trabajo de datos es local).

---

## 2. Arquitectura y rutas

`src/features/modules/HerramientasShell.tsx` deja de usar el placeholder `ModuleShell` (que sigue existiendo para `ConfigShell`, sin tocar) y copia el patrón real de `TeamShell.tsx`:

```tsx
export function HerramientasShell() {
  const tabs = [
    { label: 'Herramientas', href: '/herramientas' },
    { label: 'Proyecciones', href: '/herramientas/proyecciones' },
  ];
  return (
    <AppLayout user={mockUser} module={{ name: 'Herramientas', href: '/herramientas', tabs }}>
      <Outlet />
    </AppLayout>
  );
}
```

`src/app/router.tsx` — la ruta simple actual se anida:

```tsx
<Route path="/herramientas" element={<HerramientasShell />}>
  <Route index element={<HerramientasResumenPage />} />
  <Route path="proyecciones" element={<ProyeccionesListPage />} />
  <Route path="proyecciones/:id" element={<ProyeccionDetailPage />} />
</Route>
```

`proyecciones/:id` no tiene tab propio en la nav (se llega solo por clic en una fila o en "Nueva proyección"); el tab "Proyecciones" cubre ambas.

Estructura de carpetas nueva (mismo patrón que `crm`/`team`):
```
src/features/herramientas/
  data/       types.ts, proyecciones.ts (seed + funciones puras), proyecciones-provider.tsx
  components/ ProyeccionRow.tsx, ProyeccionHeader.tsx, AcuerdoTab.tsx, ...
  pages/      HerramientasResumenPage.tsx, ProyeccionesListPage.tsx, ProyeccionDetailPage.tsx
```

---

## 3. Modelo de datos

Tipo completo `Proyeccion` (cubre las 3 tabs aunque esta fase solo renderiza Acuerdo, para no tener que migrar el tipo en Fase B/C):

```ts
export type ProyeccionEstado = 'borrador' | 'en_junta' | 'aprobada' | 'rechazada';
export type BaseCalculoAcuerdo = 'bruto' | 'neto';
export type QuienPaga = 'nosotros' | 'venue';
export type CategoriaGasto = 'Artística' | 'Publicidad' | 'Promoción' | 'Staff' | 'Alquileres'
  | 'Sonido' | 'Iluminación' | 'Efectos' | 'Producción' | 'Seguridad' | 'Barras' | 'Comida' | 'Ticketing' | 'Otros';
export type BaseGasto = 'importe_fijo' | 'pct_facturacion_neta' | 'pct_ticketing_neto'
  | 'pct_vip_neto' | 'pct_barras_neto' | 'pct_comida_neta' | 'pct_merch_neto';
export type ViaBreakeven = 'ticketing' | 'mesas_vip' | 'barras' | 'comida' | 'merchandising';

export interface Responsable { id: string; nombre: string; avatarUrl?: string; iniciales: string }
export interface Comentario { id: string; autor: string; texto: string; fecha: string }

export interface TramoAcuerdo {
  id: string; nombre: string; nosLlevamosPct: number; base: BaseCalculoAcuerdo;
  deduccionFijaEur: number; deduccionPct: number;
}
export interface Gasto {
  id: string; categoria: CategoriaGasto; concepto: string; base: BaseGasto;
  valor: number; paga: QuienPaga;
}
export interface TicketingRelease {
  id: string; orden: number; release: string; entradas: number; precio: number; entradasReal?: number;
}
export interface MesaVip {
  id: string; zona: string; mesas: number; probabilidadPct: number; precio: number; mesasReal?: number;
}
export interface CajaRealLinea { id: string; fuente: string; importe: number }
export interface BarrasComidaMerchConfig {
  barras: { consumicionesHora: number; precioMedio: number };
  comida: { pctQueConsume: number; ticketMedio: number };
  merch: { pctConversion: number; precioMedio: number };
}
export interface AjustesEscenarios {
  multiplicadorPesimistaPct: number; multiplicadorBasePct: number; multiplicadorOptimistaPct: number;
  viasBreakeven: ViaBreakeven[];
}
export interface EventoAforo {
  nombre: string; fecha: string; venue: string; aforoMaximo: number; duracionHoras: number;
  invitaciones: number; ivaTicketingPct: number; ivaBarrasComidaVipPct: number; asistenciaForzada?: number;
}

export interface Proyeccion {
  id: string; nombre: string; estado: ProyeccionEstado; reunionFecha: string;
  responsables: Responsable[]; comentarios: Comentario[];
  eventoAforo: EventoAforo; acuerdo: TramoAcuerdo[]; ajustesEscenarios: AjustesEscenarios;
  ticketing: TicketingRelease[]; desglosarPorTicketera: boolean; mesasVip: MesaVip[];
  barrasComidaMerch: BarrasComidaMerchConfig; cajaReal: CajaRealLinea[]; gastos: Gasto[];
  creadoEn: string; actualizadoEn?: string;
}
```

**Semilla:** una única `Proyeccion` ("PQ @ SLS Barcelona") con todos los valores exactos leídos de `docs/references/herramientas/` (snapshots `.txt` + capturas `.png` + `live-nueva-proyeccion-form-vacio.json` para los defaults de un borrador nuevo). Responsables sembrados: Jack Howell (avatar con foto) y Tony Carrerira (iniciales "TC"). 7 gastos, todos "Nosotros", que suman -5.470,00 €, tal como aparece en `live-info-como-se-calcula.png` / `live-panel-comentarios.png`.

**Funciones puras** (mismo patrón que `crm/data/pipeline.ts`, sin capa de hooks): `createBlankProyeccion()`, `duplicateProyeccion(p)`, `removeProyeccion(list, id)`, `updateProyeccion(list, id, patch)`, más agregaciones que ya sean necesarias para Acuerdo (p. ej. total de gastos que "asumimos").

**Estado compartido lista↔detalle:** no existe hoy en el repo ningún caso de estado mutable compartido entre páginas hermanas (cada página siembra su propio `useState` al montar). Se introduce un `ProyeccionesProvider` (React Context) montado en `HerramientasShell`, con hook `useProyecciones()` que expone el array + las funciones puras de arriba. Es el primer uso de Context en el repo — justificado porque crear/editar una proyección en el detalle debe reflejarse en la lista al volver, y no hay backend del que releer.

---

## 4. Páginas y componentes

- **`HerramientasResumenPage`** (`/herramientas`): H1 + subtítulo + `Card` único enlazando a `/herramientas/proyecciones`.
- **`ProyeccionesListPage`** (`/herramientas/proyecciones`): título + subtítulo + botón "Nueva proyección" (crea el borrador vía `createBlankProyeccion()`, lo inserta de inmediato en el store compartido y navega a su detalle — ver simplificación deliberada arriba). `ProyeccionRow` por fila: nombre, badges Real/Estado, fecha, PREVISIÓN/REAL, acciones Duplicar/Borrar en hover (ambas mutan el Context). Estado vacío si la lista queda a 0.
- **`ProyeccionDetailPage`** (`/herramientas/proyecciones/:id`):
  - `ProyeccionHeader`: Volver, nombre, Guardar (controla solo el indicador visual "Cambios sin guardar"/"Guardado", sin lógica de descarte), Estado (4 vías, funcional), Reunión (date input, funcional), Responsables (chips + quitar, funcional; "＋ Añadir" **visible pero inerte**, su picker es Fase C), "Convertir en evento →" (siempre inerte, fuera de alcance de todo el módulo), y "i" / Comentarios / PDF Ventas / PDF Explotación / Excel **visibles con su estilo real pero inertes** (Fase C).
  - `UnderlineTabs` (ya existente en `components/ui`) para Acuerdo / Previsión / Real.
  - `AcuerdoTab` (única tab funcional): tabla "Acuerdo con el venue/promotor" (los `TramoAcuerdo` sembrados, editables: nombre, NOS LLEVAMOS %, toggle Bruto/Neto, DEDUC. FIJA €, DEDUC. %) + lista "¿Quién paga cada gasto?" (concepto + toggle Nosotros/Venue por cada `Gasto` sembrado, solo lectura del resto de campos — el CRUD completo de Gastos es de Previsión/Fase B).
  - `PrevisionTabPlaceholder` / `RealTabPlaceholder`: tarjeta simple "Esta vista se construye en la Fase B/C" (mismo patrón que los stubs de Mixmag/TAGMAG en Home v2).

---

## 5. Errores y edge cases

Sin llamadas de red (todo en memoria), así que no hay manejo de errores de fetch/backend. Edge cases reales: lista vacía tras borrar todas las proyecciones; nombre vacío al intentar guardar un borrador nuevo (validación mínima, mismo criterio que otros módulos); navegar a un `:id` inexistente (mostrar estado "Proyección no encontrada" con enlace de vuelta a la lista).

---

## 6. Testing

TDD estricto, un commit por tarea, test junto a cada archivo nuevo (Vitest + React Testing Library + jest-dom, es-ES, ES2020 sin `Array.prototype.at()`):

- **Datos** (`data/*.test.ts`): funciones puras sin render — `createBlankProyeccion`, `duplicateProyeccion`, `removeProyeccion`, `updateProyeccion`, agregaciones de Acuerdo.
- **Provider**: `useProyecciones()` expone y muta el array correctamente (test con un componente de prueba envuelto en el provider).
- **Páginas/componentes**: landing renderiza la tarjeta; lista renderiza filas y reacciona a Nueva/Duplicar/Borrar; detalle renderiza cabecera + tabs y refleja cambios de Estado/Reunión/Responsables; `AcuerdoTab` edita tramos y togglea Nosotros/Venue; placeholders de Previsión/Real se renderizan.
- **`HerramientasShell.test.tsx`** (reescrito desde cero, ya no testea el `ModuleShell` genérico): tabs reales y resaltado del tab activo, mismo patrón que `TeamShell.test.tsx`.
- **Verificación visual incremental**: tras las tareas de landing/lista/cabecera/Acuerdo, captura rápida del dev server comparada a ojo contra `docs/references/herramientas/*.png` para no acumular deriva de fidelidad. La verificación formal Playwright ours-vs-live queda para el cierre del módulo completo (cuando Fase C esté fusionada), según la regla del proyecto.

---

## 7. Fuera de alcance de Fase A (explícito)

- Escenarios, breakeven, ticketing (incl. desglose por ticketera), mesas VIP, barras/comida/merch, Gastos-CRUD completo → **Fase B**.
- Tab Real, caja real, panel Comentarios, picker de responsables, exports PDF/Excel, botón "i" → **Fase C**.
- Cualquier persistencia real (Supabase) → futura, fuera de alcance de todo el módulo por ahora.
