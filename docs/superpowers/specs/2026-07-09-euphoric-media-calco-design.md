# Fase — Euphoric Media (calco pixel-perfect)

**Fecha:** 2026-07-09
**Rama:** `feature/fase3-comunicacion-produccion` (o rama nueva dedicada al ejecutar el plan)
**Objetivo:** Construir el módulo **Euphoric Media** como copia visual exacta (pixel-perfect) de la web de referencia, con sus **7 vistas**: Resumen, Campañas, Contenido, Piezas, Eventos, Cuentas y Analítica. Hoy `EuphoricShell` es un placeholder (`ModuleShell`); se sustituye por un shell real con rutas anidadas y páginas.

**Fuentes de verdad:**
1. 11 capturas en `/Users/arian/Desktop/Euphoric_Media/` (Resumen, Campañas, Contenido, Piezas, Piezas+drawer ×2, Eventos lista, Eventos form, Eventos calendario, Cuentas lista, Cuentas form).
2. Web real navegable (solo lectura): `https://bookings.conceptoneagency.com/euphoric` (usuario `test@blackmoose.es`). Usada para confirmar rutas, valores seed y la vista **Analítica** que no aparece en las capturas.

**Restricción invariable:** todo es **presentacional**. Nada persiste ni llama al repositorio con mutaciones. Los botones `Guardar`, `+ Nueva …`, filtros, toggles y segmented controls solo manipulan **estado de UI local** y datos seed en memoria. No se crea/edita/borra ningún dato real. Cuando exista el `.sql`, se adaptará la fuente de datos (repositorio agnóstico ya presente) sin reescribir la UI.

**Decisiones tomadas (brainstorming):**
- Todo el módulo en **una sola fase**.
- **Calco visual**; datos seed hardcodeados; forms/tabs/filtros interactivos sin persistencia.
- Se **mantiene el header compartido** actual (tile violeta + `APP_NAME`), con **un único añadido aditivo**: un slot opcional `iconAction` en `TopNav` que solo Euphoric aporta (icono de gráfica → `/euphoric/analitica`). Los demás módulos no lo pasan y su header queda idéntico.

---

## 1. Rutas y navegación

Rutas reales confirmadas en la web (nótese `Contenido` → `/calendario`):

| Tab (label) | Ruta | Página |
|---|---|---|
| Resumen | `/euphoric` (index) | `ResumenPage` |
| Campañas | `/euphoric/campanas` | `CampanasPage` |
| Contenido | `/euphoric/calendario` | `ContenidoPage` |
| Piezas | `/euphoric/piezas` | `PiezasPage` |
| Eventos | `/euphoric/eventos` | `EventosPage` |
| Cuentas | `/euphoric/cuentas` | `CuentasPage` |
| Analítica | `/euphoric/analitica` | `AnaliticaPage` |

`Analítica` **no** es una tab de texto: se accede por el icono de gráfica del header (ver §3). Las 6 tabs de texto van en `module.tabs`.

### `router.tsx`
Sustituir la ruta plana `<Route path="/euphoric" element={<EuphoricShell />} />` por rutas anidadas (patrón idéntico a `/conceptone` y `/etra`):

```tsx
<Route path="/euphoric" element={<EuphoricShell />}>
  <Route index element={<ResumenPage />} />
  <Route path="campanas" element={<CampanasPage />} />
  <Route path="calendario" element={<ContenidoPage />} />
  <Route path="piezas" element={<PiezasPage />} />
  <Route path="eventos" element={<EventosPage />} />
  <Route path="cuentas" element={<CuentasPage />} />
  <Route path="analitica" element={<AnaliticaPage />} />
</Route>
```

### `EuphoricShell.tsx` (reescritura)
Reemplaza el placeholder `ModuleShell` por el patrón `AppLayout` + `<Outlet/>` (como `ConceptOneShell`):

```tsx
const tabs = [
  { label: 'Resumen', href: '/euphoric' },
  { label: 'Campañas', href: '/euphoric/campanas' },
  { label: 'Contenido', href: '/euphoric/calendario' },
  { label: 'Piezas', href: '/euphoric/piezas' },
  { label: 'Eventos', href: '/euphoric/eventos' },
  { label: 'Cuentas', href: '/euphoric/cuentas' },
];
// module.iconAction = { icon: 'BarChart2', href: '/euphoric/analitica', label: 'Analítica' }
```

El `end` de la tab "Resumen" debe ser `true` (href === `/euphoric`) para que solo esté activa en el índice — ajustar la condición existente en `TopNav` que hoy compara con `/conceptone`/`module.href` para que use `href === module.href` de forma genérica.

---

## 2. Estructura de archivos

Nueva carpeta `src/features/euphoric/`:

```
src/features/euphoric/
  data/
    seed.ts                 # constantes seed (cuentas, campañas, piezas, eventos, publicaciones)
    types.ts                # tipos locales de la UI (Cuenta, Campaña, Pieza, Evento, Publicacion)
  pages/
    ResumenPage.tsx
    CampanasPage.tsx
    ContenidoPage.tsx
    PiezasPage.tsx
    EventosPage.tsx
    CuentasPage.tsx
    AnaliticaPage.tsx
  components/
    CampaignBoard.tsx       # fila de columnas por estado + card
    CampaignTable.tsx
    PieceBoard.tsx          # tablero por estado con cards de pieza
    PieceTable.tsx
    PieceDrawer.tsx         # slide-over "Nueva pieza" (form largo)
    EventForm.tsx           # form "Nuevo evento" (panel derecho)
    AccountForm.tsx         # form "Nueva cuenta" (panel derecho)
    RetainerBarChart.tsx    # gráfico de barras de Analítica
    (helpers de badges/chips específicos si hacen falta)
```

`EuphoricShell.tsx` se mantiene en `src/features/modules/`.

---

## 3. Cambio en el header compartido (`TopNav`)

Añadido **aditivo y opcional**. `ModuleHeader` gana un campo:

```ts
import type { LucideIcon } from 'lucide-react';

export interface ModuleHeader {
  name: string;
  href?: string;
  tabs?: { label: string; href: string }[];
  actionLabel?: string;
  iconAction?: { icon: LucideIcon; href: string; label: string }; // NUEVO
}
```

Los iconos del repo son componentes `LucideIcon` (ver `src/lib/icons.ts`). En `TopNav`, **antes** del botón de campana, si `module?.iconAction` existe, renderizar un `NavLink` icon-only (36×36, `rounded-lg`, `text-slate-500 hover:bg-slate-100`, activo → `bg-brand-50 text-brand-700`) con `aria-label={iconAction.label}`. Para Euphoric: `icon: BarChart2` (lucide) → `/euphoric/analitica`.

Ningún otro módulo pasa `iconAction`; su header no cambia. Verificar con un test de `TopNav` que sin `iconAction` no se renderiza el icono.

> Nota calco: la web real muestra `9+` en la campana y logo "blackmoose"; **no** replicamos eso (decisión: header actual del boilerplate se mantiene — tile violeta + `APP_NAME`, contador `7`). Solo se añade el icono de gráfica.

---

## 4. Datos seed (`data/seed.ts`)

Valores exactos confirmados en la web real. Todos en memoria, sin repositorio.

**Cuenta (1):**
- `SIGHT` — tipo Cliente · servicios `Redes sociales, Paid media, Contenido` · estado `Activa` · retainer `800 €/mes`.

**Campaña (1):**
- `Genérico Julio` — cuenta `SIGHT` · tipo `Paid media` · fechas `10 jul 2026 → 31 ago 2026` · estado `En curso` · responsable `Sin asignar` · presupuesto `600 €` · inversión `0 €`.

**Piezas (3):**
| Pieza | Cliente | Tipo | Prioridad | Deadline | Estado | Resp. | Cliente aprob. | Checklist |
|---|---|---|---|---|---|---|---|---|
| Pack Sold Out · Pack Sold Out | SIGHT | Estático | Media | 10 jul 2026 | Revisión | Carlos | — | 0/3 |
| Pack Sold Out · Pack Sold Out | SIGHT | Vídeo | Media | 10 jul 2026 | Briefing | Carlos | — | 0/3 |
| Test | SIGHT | Estático | Alta | 09 jul 2026 | En producción | Carlos | — | — |

KPIs Piezas: `3 Piezas activas`, `1 Pend. aprobar`, `0 En correcciones`, `0 Atrasadas`.
Columnas tablero: `Briefing 1`, `En producción 1`, `Revisión 1`, `Cambios 0`, `Aprobado 0`.

**Eventos (4):**
| Nombre | Fecha | Ciudad | Tipo | Nº en Euphoric |
|---|---|---|---|---|
| SIGHT: Oden & Fatzo, KOKO b2b Bizza, Jan, Caste | 19 jul 2026 | Barcelona | Marketing | 1 en Euphoric |
| Please Quiet x SIGHT | 18 jul 2026 | Barcelona | Producción | — |
| Mixmag Intimate Sessions: BLOND:ISH | 15 jul 2026 | Ibiza | Producción | — |
| SIGHT: Patrick Topping, ACA, Luca 606, Nicholls | 12 jul 2026 | Barcelona | Marketing | 3 en Euphoric |

Badge tipo: `Marketing` = chip slate; `Producción` = chip rosa/rojo.

**Publicación / Contenido (1):**
- `Set Times` — cuenta `SIGHT` · `10 jul 2026` · canal `Instagram` · estado `En producción` · ubicación/evento `SIGHT: Patrick Topping, ACA, Luca 606, Nicholls` · tipo `Post`.
- En el calendario de Contenido aparecen además píldoras de **eventos** (rojo) los días 12, 15, 18, 19.

**Analítica:** MRR `800,00 €`, Cuentas activas `1 de 1`, Presupuesto campañas `600,00 €`, Inversión `0,00 €` (`0% del presupuesto`). Contenido por estado: `Idea 0`, `En producción 1`, `Revisión 0`, `Aprobado 0`, `Programado 0`, `Publicado 0`. Contenido por canal: `Instagram 1`.

---

## 5. Especificación por vista (calco de las capturas)

Tokens base (de `.stitch/DESIGN.md`): fondo `slate-50`, cards `bg-white border-slate-100 rounded-xl shadow-sm`, brand `#7C3AED` (`brand-600`), labels de sección `text-xs font-semibold uppercase tracking-wide text-slate-400`, contenedor `max-w-[1248px]`. Badges pill `text-xs` con fondos pálidos.

### 5.1 Resumen (`/euphoric`)
- H1 `Euphoric Media` (`text-2xl font-semibold slate-900`) + subtítulo `Marketing del grupo: cuentas, campañas y calendario de contenido.` (`text-slate-500`).
- **3 KPI cards** en grid de 3 (gap ~16px, cada una `p-5 rounded-xl border shadow-sm`):
  - `CUENTAS ACTIVAS` → `1` grande + ` de 1` en gris (card enlaza a `/euphoric/cuentas`).
  - `CAMPAÑAS EN CURSO` → `1`.
  - `PUBLICACIONES (7 DÍAS)` → `1`.
  - Label uppercase gris; número `text-2xl/3xl font-bold slate-900`.
- **2 paneles** en grid de 2 (`rounded-xl border shadow-sm`, header con label uppercase):
  - `CAMPAÑAS EN CURSO`: fila `Genérico Julio` / `SIGHT · hasta 31 ago 2026` + badge `En curso` (chip azul pálido) a la derecha; enlaza a `/euphoric/campanas`.
  - `PRÓXIMAS PUBLICACIONES`: fila `Set Times` / `10 jul 2026 · Instagram · SIGHT` + badge `En producción` (chip azul pálido); enlaza a `/euphoric/calendario`.
- Texto helper al pie: `Campañas y calendario de contenido se gestionan en las siguientes fases del espacio.` (`text-sm text-slate-400`).

### 5.2 Campañas (`/euphoric/campanas`)
- H1 `Campañas` + subtítulo `Campañas y proyectos de marketing: RRSS, paid media, contenido y lanzamientos.`
- Arriba a la derecha: botón primario `+ Nueva campaña` (brand) + **SegmentedControl** `Tablero | Cronograma | Gestión` (activo `Tablero`).
- **Fila de columnas por estado** (5): chips de cabecera `Planificada 0`, `En curso 1`, `Pausada 0`, `Finalizada 0`, `Cancelada 0`. Cada chip con su color: Planificada slate, En curso azul, Pausada ámbar, Finalizada verde, Cancelada rojo. En la columna `En curso`, una card: `Sin asignar` (gris) / `Genérico Julio` / `SIGHT · Paid media` / `10 jul 2026 → 31 ago 2026`. Resto de columnas: guion `—` centrado (vacío).
- **Tabla** debajo (`rounded-xl border`, header uppercase): columnas `CAMPAÑA · CUENTA · TIPO · FECHAS · ESTADO`. Fila: `Genérico Julio · SIGHT · Paid media · 10 jul 2026 → 31 ago 2026 · [En curso]`.
- Vistas `Cronograma` y `Gestión`: replicar tal como aparezcan en la web real (capturar durante implementación). Si están vacías/placeholder, calcarlo igual.

### 5.3 Contenido (`/euphoric/calendario`)
- H1 `Contenido` + subtítulo `Community management: planifica y controla el estado de las publicaciones.`
- Arriba derecha: **Select** `Todos los canales` (▼).
- Fila de filtros: chips `Todas` (activo, brand) · `SIGHT`. A la derecha **SegmentedControl** `Calendario | Lista | Kanban`.
- Barra de mes: `← Julio 2026 →` a la izquierda; a la derecha toggle `● Eventos` (pill con borde rojo, punto rojo) + `Hoy`.
- **MonthCalendar** (reutilizar `MonthCalendar`): rejilla L–D, cabeceras `LUN…DOM`, días fuera de mes atenuados. Día 9 resaltado (círculo brand, es "hoy"). Píldoras:
  - Día 9: card-popover expandido `Set Times` / `SIGHT` / 📍`SIGHT: Patrick Topping, ACA, Luca 606, Nicholls` (rojo) / chips `Post` + `En producción`.
  - Píldoras de evento (rojo, con 📍) los días 12 (`SIGHT: Patrick Topping…`), 15 (`Mixmag Intimate Sessions: BLOND:ISH`), 18 (`Please Quiet x SIGHT`), 19 (`SIGHT: Oden & Fatzo, KOKO b2b…`).
- Vistas `Lista` y `Kanban`: calcar de la web real (capturar en implementación).

### 5.4 Piezas (`/euphoric/piezas`)
- H1 `Piezas` + subtítulo `Content creation: seguimiento de artes por estado de producción.`
- Arriba derecha: `Asignar a: [+ Alba] [+ Carlos]` (chips outline) + botón primario `+ Nueva pieza`.
- **4 KPI cards**: `3 Piezas activas`, `1 Pend. aprobar` (número ámbar), `0 En correcciones` (rojo), `0 Atrasadas` (rojo).
- **Fila de chips de filtro**: `Todas` (activo brand) · `Mías` · `Diseño` · `Vídeo` · `Pend. aprobar` · `Correcciones` · `Atrasadas`. A la derecha: `Recursos: — Editar` (texto gris + link).
- **Tablero por estado** (cards con avatar+nombre `Carlos`, título, `SIGHT · Tipo · v1`, chip prioridad, 📅 fecha, ✓ checklist `0/3`):
  - `Briefing 1`, `En producción 1`, `Revisión 1`, `Cambios 0`, `Aprobado 0`. Columnas vacías con `—`.
- **Tabla** debajo: `PIEZA · CLIENTE · TIPO · PRIORIDAD · DEADLINE · ESTADO · CLIENTE APROB.` con las 3 filas del seed. Nombre de pieza con sufijo `v1` en gris.
- **PieceDrawer** (slide-over derecho, ~640px, backdrop dim, `Nueva pieza` + `✕`): ver §6.

### 5.5 Eventos (`/euphoric/eventos`)
- H1 `Eventos` + subtítulo `Base de eventos del grupo (compartida). Crea aquí los eventos de marketing; solo aparecen en Producción si marcas que los produce Black Moose.`
- Barra: **SegmentedControl** `Lista | Calendario` + botón primario `+ Nuevo evento`.
- **Vista Lista** (master-detail):
  - Izquierda: input `Buscar evento…` + lista de 4 eventos (título, `fecha · ciudad · Nº en Euphoric`, badge `Marketing`/`Producción`).
  - Derecha: empty-state `Selecciona un evento o crea uno nuevo.` (card centrada) o **EventForm** (§6) al pulsar `+ Nuevo evento`.
- **Vista Calendario**: card grande con `← Julio 2026 →`, rejilla mensual (celdas más grandes que Contenido), píldoras de evento en días 12/15/18/19 (violeta para Marketing, rojo/rosa para Producción), y debajo helper `Toca un evento del calendario para editarlo, o «+ Nuevo evento».`

### 5.6 Cuentas (`/euphoric/cuentas`)
- H1 `Cuentas` + subtítulo `Clientes y marcas que gestiona Euphoric. Los clientes externos se enlazan al CRM del grupo.`
- Master-detail:
  - Izquierda: botón primario **full-width** `+ Nueva cuenta` + lista: card `SIGHT` / `Cliente · Redes sociales, Paid media, Contenido` + badge `Activa` (verde).
  - Derecha: empty-state `Selecciona una cuenta o crea una nueva.` o **AccountForm** (§6).

### 5.7 Analítica (`/euphoric/analitica`)
- H1 `Analítica` + subtítulo `Cartera de cuentas, ingresos recurrentes (retainers), inversión en campañas y contenido.`
- **4 KPI cards**: `MRR (RETAINERS ACTIVOS)` → `800,00 €` (**texto rosa** `#F43F5E`/`text-rose-500`); `CUENTAS ACTIVAS` → `1` + `de 1`; `PRESUPUESTO CAMPAÑAS` → `600,00 €`; `INVERSIÓN CAMPAÑAS` → `0,00 €` + `0% del presupuesto`.
- **Panel `RETAINER MENSUAL POR CUENTA`**: gráfico de barras (`RetainerBarChart`). Eje Y `0,00 €`…`800,00 €` (5 marcas), una barra `SIGHT` a valor 800 (color rosa). Grid horizontal punteado. (Consultar `dataviz` skill al construir el chart.)
- Grid inferior 2 columnas:
  - Izq. panel `POR CUENTA`: tabla `CUENTA · ESTADO · RETAINER · CAMPAÑAS · INVERSIÓN · PUBLICACIONES` → `SIGHT · [Activa] · 800,00 € · 1 · — · 1`.
  - Der. dos paneles apilados: `CONTENIDO POR ESTADO` (Idea 0, En producción 1, Revisión 0, Aprobado 0, Programado 0, Publicado 0 — label izq, número der) y `CONTENIDO POR CANAL` (Instagram 1).

---

## 6. Formularios (presentacionales)

### 6.1 `PieceDrawer` — slide-over "Nueva pieza"
Panel derecho fijo con backdrop. Header `Nueva pieza` + `✕`. Footer sticky `Cerrar` (secondary) + `Guardar` (primary). Campos, en orden (captura 16.01.52 + 16.02.18):
1. `Nombre *` (input, placeholder `Ej: Reel lanzamiento v2`).
2. Bloque `RESPONSABLE` / `APRUEBA`: dos "+ Asignar" (chips add).
3. Fila `Tipo` (select, `Estático`) · `Departamento` (`Diseño`) · `Estado` (`Briefing`) · `Versión` (`1`).
4. `Prioridad`: SegmentedControl `Baja | Media | Alta` (activo `Media`, brand).
5. `Deadline`: date input `dd/mm/aaaa` + icono calendario.
6. `Tamaños / ratios`: chips `1:1 | 4:5 | 9:16 | 16:9` (toggle).
7. Panel punteado `ADAPTACIONES / VERSIONES` (label brand): texto explicativo + link `+ Añadir adaptación`.
8. `¿PARA QUIÉN? · elige solo uno`: 3 columnas `Cuenta Euphoric` (select) · `Cliente (CRM)` (input `Cliente…`) · `Empresa interna` (select).
9. `Evento`: input `Buscar o crear evento…`.
10. Fila `Campaña` (select `Sin campaña`) · `Publicación` (select `Sin publicación`).
11. `Brief`: toolbar rich-text (B I U S · A A A · ✕) + textarea placeholder `Qué necesita la pieza: mensaje, formato, maquetación, referencias…`.
12. `Enlace al asset`: input `Drive / Frame.io / Dropbox…`.
13. `Adjuntos`: botón punteado `+ Adjuntar`.
14. Panel `APROBACIÓN DEL CLIENTE` + badge `Sin enviar`: chips `Sin enviar | Pendiente cliente | Aprobado cliente | Cambios cliente`.
15. Panel `CHECKLIST`: link `+ Añadir tarea`.
16. `Notas`: textarea.

Toolbar rich-text y toggles son **visuales** (no se implementa editor real; textarea plano estilizado).

### 6.2 `EventForm` — "Nuevo evento" (panel derecho, card)
Campos: `Nombre *` (`Ej: OFF BCN · Ku · 12 jul`); fila `Fecha inicio` / `Fecha fin (opc.)` (date); fila `Ciudad` (input) / `Venue (CRM)` (`Buscar o crear venue…`); `Descripción` (textarea); checkbox `La produce Black Moose` + texto helper (`Activa el módulo de Producción…`); botón `Guardar` (primary, abajo derecha).

### 6.3 `AccountForm` — "Nueva cuenta" (panel derecho, card)
Campos: `Nombre de la cuenta *` (`Nombre del cliente o marca`); checkbox `Cuenta interna del grupo (no es cliente externo)`; `Cliente en el CRM` (`Buscar o crear cliente…`) + helper; fila `Estado` (select `Activa`) / `Retainer mensual (€)` (input `Opcional`); `Servicios`: chips `Redes sociales | Paid media | Contenido` (toggle); fila `Responsable` (select `Sin asignar`) / `Resp. de aprobar` (select `Sin asignar`) + helper `Se autocompleta en las piezas de esta cuenta.`; `Notas` (textarea `Alcance, condiciones, observaciones…`); botón `Guardar`.

---

## 7. Componentes: reutilizar vs nuevos

**Reutilizar** (`src/components/ui`): `Card`, `StatCard`, `Badge`, `SegmentedControl`, `MonthCalendar`, `MasterDetailList`, `Modal` (base para drawer si encaja; si no, drawer propio), `Select`, `Input`, `Textarea`, `Button`, `UnderlineTabs`. Revisar cada primitivo antes de crear uno nuevo; extender props si falta poco.

**Nuevos** (en `features/euphoric/components`): `CampaignBoard`, `CampaignTable`, `PieceBoard`, `PieceTable`, `PieceDrawer`, `EventForm`, `AccountForm`, `RetainerBarChart`. Chips de estado/prioridad: si hay más de 2 usos, extraer helper local (`StatusChip`).

**KanbanBoard existente**: evaluar si sirve para el tablero de Piezas/Campañas; si su API no encaja con las cabeceras contadoras + cards, usar `PieceBoard`/`CampaignBoard` dedicados.

---

## 8. Verificación

1. `npm run build` / typecheck sin errores; `npm test` verde.
2. Tests de patrón (Vitest + Testing Library) para componentes nuevos con lógica: `PieceDrawer` (abre/cierra, toggles cambian estado local), `EventForm`/`AccountForm` (render de campos), `CampaignBoard`/`PieceBoard` (conteos por estado), y `TopNav` (icono `iconAction` solo si se pasa).
3. **Pixel-perfect**: levantar Vite y comparar con Playwright a 1440px cada una de las 7 vistas (+ drawer y forms) contra la web real / capturas, iterando hasta que coincidan (spacing, colores, tipografía, badges).
4. Comparar rutas y estados activos de tabs con la web real.

---

## 9. Fuera de alcance

- Persistencia / mutaciones reales (llega con el `.sql`).
- Editor rich-text funcional en el Brief (solo visual).
- Lógica de negocio real de KPIs/gráficos (valores hardcodeados del seed).
- Cambiar el logo/marca del header o el contador `9+` (se mantiene el header del boilerplate).
- Módulo `Creativos` (comparte el concepto de "piezas" en la web real, pero es otro espacio y otra fase).

---

## 10. Neutralidad de marca

Fases previas (Etra, Fase 3) impusieron sustituir nombres reales por genéricos en el diff. **Aquí NO aplica**: el módulo se llama `Euphoric Media` y los datos seed (`SIGHT`, `Genérico Julio`, `Set Times`, artistas, `Black Moose`) reproducen la web tal cual, porque el objetivo explícito es el calco pixel-perfect y el usuario los ha aprobado como contenido de esta fase. `EuphoricShell`/ruta `/euphoric` ya existen en el repo. Si en el futuro se decide neutralizar, será un paso aparte.
