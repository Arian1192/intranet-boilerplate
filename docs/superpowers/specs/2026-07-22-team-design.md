# Team (`/personal`) — calco pixel-perfect

**Fecha:** 2026-07-22
**Rama:** `feature/team`
**Requisito clave (usuario):** 100% fiel al live (pixel-perfect); el modelo de datos espeja tablas Supabase. Presentacional/in-memory, sin persistencia.

## Objetivo

Reemplazar el placeholder actual (`TeamShell` → `ModuleShell` genérico, tabs falsos `Dashboard/Equipo/Vacaciones`) por un calco fiel del módulo **Team** del live: 3 sub-vistas reales por ruta —**Equipo** (Directorio/Organigrama), **Calendario** y **Fichas**— con el modelo de datos de personas, ausencias, empresas y fichas sensibles.

### Fuera de alcance (documentado, no se inventa)

- `+ Nueva persona`, `⬇ Exportar a Excel`: botones inertes (irreversibles/generan descarga en el live; nunca se pulsaron durante el recon).
- Tabs internos de la ficha **Acceso y permisos**, **Condiciones económicas**, **Vacaciones**, **Registro de horas**: solo se calca **Datos personales** (única pestaña capturada con contenido); el resto queda como tab clicable pero sin contenido propio (placeholder "En construcción"), fiel a lo observado.
- Edición/guardado real de la ficha (`Guardar` inerte, sin mutar el seed).
- Aprobación/creación de ausencias en Calendario (`Solo aprobadas` es el único control interactivo real: filtra).
- Icono de gráfico de barras en el TopNav (`iconActions`): su destino exacto no se pudo determinar en el recon (no se pulsó); se deja **sin acción** en vez de inventar una ruta.
- Mapeo 1:1 persona↔empresa por fila en Fichas: 4 filas quedaron tapadas por el panel de Ayuda fijo durante la captura (Carlos Pego Muñoz, Carlos Ramudo Valencia, Federico Cortina, Fran Hinojosa Veredas); su `companyIds` exacto no se fabrica (ver sección de datos).

## Contexto del live (fuente de verdad)

Ruta real: `https://bookings.conceptoneagency.com/personal` (+ `/personal/calendario`, `/personal/fichas`, `/personal/fichas?p=<uuid>`).

Capturas en `docs/references/team/`:
- `live-team-equipo.png` (Directorio), `live-team-organigrama.png` (Organigrama)
- `live-team-calendario.png` (Calendario, Julio 2026)
- `live-team-fichas.png` (lista + dashboard costes vacío), `live-team-ficha-detail-directorio.png` (ficha de Alba Gelabert abierta)
- `live-team-organigrama.txt`, `live-team-ficha-detail-directorio.txt`, `live-team-tokens.json` (texto íntegro y tokens computados)

### TopNav submódulo

`/ Team ▾` + tabs **Equipo / Calendario / Fichas** (navegación por ruta real vía `NavLink`, tab activa = pill `bg-slate-100`) + iconos globales (gráfico de barras — módulo, sin destino confirmado; maletín y campana con badge `9+` — globales de `TopNav`; avatar `T` + `test / Admin`).

### Vista Equipo — Directorio (H1 "Equipo", subtítulo "Quién es quién, cómo contactarle y de quién depende.")

Toggle **Directorio** (activo, pill oscura `rgb(68,68,76)` texto blanco) / Organigrama. Buscador "Buscar por nombre, puesto o email..." + select "Todos los departamentos". Grid 3 columnas de `PersonCard`: avatar (iniciales coloreadas o foto real para Carlos Pego Muñoz y Jack Howell), nombre en negrita, puesto(s) principal, chip departamento (si tiene), email/teléfono (gris "Sin email"/"Sin teléfono" si faltan), línea opcional **"Reporta a `<Nombre>`"**, link azul "Ver ficha personal →". 26 personas, orden alfabético.

### Vista Equipo — Organigrama

Mismo H1/toggle (Organigrama activo). Filas jerárquicas: avatar + nombre + `puesto · departamento` a la izquierda, badge pill **"1 persona"** junto al nombre si tiene reports directos, icono ✉ (si tiene email) + link "Ficha" a la derecha. Reports anidados con indentación. Solo 2 relaciones: Alba Gelabert → Pablo Carrera; Lucía Gómez Garcia → Inés Batlle. Resto son raíz (`managerId: null`).

### Vista Calendario (H1 "Calendario del equipo", subtítulo "Quién está fuera y quién teletrabaja, de un vistazo.")

Selector de mes "‹ Julio 2026 ›". Banner "Hoy: `Carlos Ramudo Valencia · Vacaciones`" (chip). Leyenda: checkbox "Solo aprobadas" + 5 dots (Vacaciones morado, Teletrabajo azul, Baja rojo, Ausencia naranja, Festivo/finde gris claro). Tabla persona × 31 días de julio: columna "Persona" (avatar+nombre) + 31 columnas de día (fines de semana sombreados, columna "hoy" día 22 resaltada) + columna "Días" (total, "—" si no tiene ausencias). Barras horizontales moradas para rangos de vacaciones:

| Persona | Rango | Días |
|---|---|---|
| Alejandro Gonzalez | 3–7 jul | 5 |
| Carlos Pego Muñoz | 3–5 jul | 3 |
| Carlos Ramudo Valencia | 16–22 jul | 7 |

Resto de las 26 personas sin ausencias este mes. Nota al pie: "Pasa el ratón por una fila para seguirla. Las solicitudes pendientes de aprobar se ven translúcidas. El total de días solo se muestra de ti y de las personas a tu cargo."

### Vista Fichas (H1 "Fichas del equipo", subtítulo "Información sensible: datos personales, condiciones económicas, vacaciones y horas. El resto del equipo solo ve el directorio.")

Botón "⬇ Exportar a Excel" arriba a la derecha del H1. Panel izquierdo: botón ancho `+ Nueva persona` (oscuro), selects **Empresa** (Todas/ConceptOne/CRUDA/Etra Agency/Euphoric Media/Mixmag Spain/TAGMAG) y **Tipo** (Todos/Contratado/Freelance), lista de 26 personas (`nombre` + `Tipo · Puesto(s)` en gris + dots de color = empresas asociadas). Panel derecho: `MasterDetailList`-like, vacío por defecto ("Selecciona una persona o crea una nueva.") y con el formulario cuando hay selección (`?p=<uuid>`).

**Ficha detalle** (ejemplo Alba Gelabert): cabecera nombre + badges "Con cuenta" (gris) / "Activa" (verde). 5 tabs: Datos personales / Acceso y permisos / Condiciones económicas / Vacaciones / Registro de horas. Banner naranja "Cambios sin guardar" + botón "Guardar" (oscuro, arriba y duplicado al final del formulario). Formulario 2 columnas, campos (Datos personales):

`Nombre*` · `Puestos` (multi, ★=el que se enseña en directorio) · `Reporta a` (select: "Nadie (raíz del organigrama)" + resto de personas) · `Email` · `Teléfono` · `DNI/NIE` · `Nº Seguridad Social` · `Tipo` (Contratado/Freelance) · `Fecha de nacimiento` (date picker) · `Dirección` · `Ciudad` · `País` · `Fecha de inicio` (date) · `Fecha de fin` (date) · `Días de vacaciones/año` ("0 = sin límite") · `Fin del periodo de prueba` (date, "Avisa antes de que venza.") · `% SS empresa` (opcional, "Vacío = usa el % global de Configuración.") · `Persona activa` (checkbox) · `Notas` (textarea).

Datos de Alba Gelabert: Con cuenta=true, Activa=true, fecha nacimiento 09/07/1997, días vacaciones/año=22, resto de campos vacíos.

**Nota de fidelidad (delta deliberado):** en el live, el banner "Cambios sin guardar" aparece nada más abrir la ficha, sin tocar nada (bug de normalización de fechas al cargar el form). Nuestro calco **no** replica ese bug: el banner solo aparece tras una edición real. Documentado en Deltas.

**Dashboard de costes** (debajo de la lista/detalle, mismo para todas las selecciones): "Coste mensual estimado total: **34.522,07 €**". Tarjeta **COSTE POR EMPRESA** (dot color + nombre + barra horizontal proporcional + importe) y tarjeta **COSTE POR PERSONA** (ranking nombre + puesto + importe).

## Arquitectura

- **Rutas** (`src/app/router.tsx`, reemplaza la entrada actual `<Route path="/personal" element={<TeamShell />} />`):
  ```
  <Route path="/personal" element={<TeamShell />}>
    <Route index element={<EquipoPage />} />
    <Route path="calendario" element={<CalendarioPage />} />
    <Route path="fichas" element={<FichasPage />} />
  </Route>
  ```
- **`TeamShell`** (`src/features/team/TeamShell.tsx`): sigue el patrón de `RedaccionShell` — `AppLayout` con `module.tabs = [{label:'Equipo', href:'/personal'}, {label:'Calendario', href:'/personal/calendario'}, {label:'Fichas', href:'/personal/fichas'}]` + `<Outlet />`. Sin `useOutletContext` (módulo no parametrizado, a diferencia de Mixmag/TAGMAG).
- **Datos** en `src/features/team/data/`: `people.ts` (Person + jerarquía + helpers directorio/organigrama), `absences.ts` (Absence + calendario), `fichas.ts` (Ficha + Company + dashboard costes).
- **Componentes** en `src/features/team/components/`, **páginas** en `src/features/team/pages/`.
- **Reutilización de primitivos:**
  - `formatCurrency` (`@/lib/format`) para todos los importes.
  - `SegmentedControl` (`@/components/ui`) para el toggle Directorio/Organigrama. El live usa un active oscuro (`bg-[#44444C] text-white`) distinto del active claro por defecto del componente (`bg-white`, usado ya en Contenidos/Campañas). Se **extiende** `SegmentedControl` con una prop opcional `tone?: 'light' | 'dark'` (default `'light'`, no rompe usos existentes) en vez de duplicar el componente; Team lo usa con `tone="dark"`.
  - `Avatar` (`@/components/ui`) para iniciales/foto en `PersonCard`, `OrgRow`, filas de calendario.
  - `MasterDetailList` (`@/components/ui`) como base de `FichasPage` (lista izquierda + panel derecho), con `listTop` para los selects Empresa/Tipo + botón `+ Nueva persona`, y `detailOverride` para renderizar `FichaDetailPanel` en vez de `renderDetail` genérico (para poder leer `?p=` de la URL en lugar de estado interno).
  - `StatCard`/`ProgressBar` (`@/components/ui`) para las tarjetas del dashboard de costes (barra horizontal proporcional).
  - `Button` (`@/components/ui`) para `Guardar`, `+ Nueva persona`, `⬇ Exportar a Excel` (todos inertes, `type="button"`).
- **Naming:** evitar colisión con `src/features/redaccion/components/TeamTabs.tsx` / `TeamGroup.tsx` (filtro de equipo por departamento dentro de Contenidos Mixmag/TAGMAG, módulo no relacionado) — los componentes de este módulo usan prefijo `Person*`/`Org*`/`Ficha*`, nunca `Team*`.

## Modelo de datos (espejo Supabase)

```ts
// tabla people
export interface Person {
  id: string;
  name: string;
  positions: string[];       // 'Puestos'; [] si "—" en el live
  primaryPosition?: string;  // el marcado con ★ (mostrado en Directorio); subset de positions
  department?: string;       // chip; ausente en 7/26 personas
  email?: string;
  phone?: string;
  managerId?: string;        // FK → Person.id; null/undefined = raíz del organigrama
  photoUrl?: string;         // solo Carlos Pego Muñoz y Jack Howell en el seed
  avatarColor: string;       // hex; determinístico (helper), documentado como snapshot visual
}

// tabla absences — Calendario del equipo
export type AbsenceType = 'vacaciones' | 'teletrabajo' | 'baja' | 'ausencia';

export interface Absence {
  id: string;
  personId: string;   // FK → Person.id
  type: AbsenceType;
  startDate: string;   // ISO 'YYYY-MM-DD'
  endDate: string;     // ISO 'YYYY-MM-DD' (inclusive)
  approved: boolean;   // controla el filtro "Solo aprobadas" y el translúcido
}

// tabla companies — holding (mismo catálogo que Fichas/CRM)
export type CompanyId = 'conceptone' | 'cruda' | 'etra' | 'euphoric' | 'mixmag' | 'tagmag';

export interface Company {
  id: CompanyId;
  name: string;         // 'ConceptOne', 'CRUDA', 'Etra Agency', 'Euphoric Media', 'Mixmag Spain', 'TAGMAG'
  colorHex: string;     // dot color en dashboard y lista Fichas
  monthlyCost: number;  // snapshot observado del live (agregado independiente, ver nota)
}

// tabla fichas — extensión sensible 1:1 de Person, visible solo en /personal/fichas
export interface Ficha {
  id: string;
  personId: string;          // FK → Person.id (1:1)
  companyIds: CompanyId[];   // empresas asociadas (dots multicolor); [] = no determinado en el recon
  employmentType: 'contratado' | 'freelance';
  monthlyCost?: number;       // snapshot observado; undefined = sin coste en el live (7/26)
  hasAccount: boolean;        // badge "Con cuenta"
  active: boolean;            // badge "Activa" / checkbox "Persona activa"
  birthDate?: string;         // ISO
  dni?: string;
  ssNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  vacationDaysPerYear?: number; // 0 = sin límite
  probationEndDate?: string;
  ssPercent?: number;          // vacío = % global de Configuración
  notes?: string;
}
```

**Denormalización/snapshot documentado:**
- `Person.primaryPosition`/`positions`: el live permite "varios puestos, el marcado con ★ se enseña en el directorio"; se modela como array + campo derivado en vez de tabla `person_positions` aparte (simplificación de fase 1).
- `Company.monthlyCost` y `Ficha.monthlyCost` son **dos agregados observados de forma independiente** (no se deriva uno sumando el otro): el recon confirma que los 19 `Ficha.monthlyCost` no vacíos suman exactamente 34.522,07 € (= el total del dashboard), pero **no** hay certeza 1:1 de qué `companyIds` corresponde a cada coste individual (4 filas de Fichas quedaron tapadas por el panel de Ayuda fijo en la captura). Sembrar ambos rankings como constantes observadas evita fabricar un join falso.
- `avatarColor`: valor de snapshot visual (paleta variada observada: verde, azul, morado, naranja, rojo, negro/slate, rosa), no hay campo real conocido en Supabase — se documenta como snapshot, sustituible por preferencia de usuario a futuro.

### Seed — Directorio/Organigrama (26 personas, orden alfabético del live)

| Nombre | Puestos (★ principal) | Departamento | Email | Teléfono | Reporta a |
|---|---|---|---|---|---|
| Alba Gelabert | Account Manager | Marketing | alba@blackmoose.es | — | — |
| Alberto Egea | Ads Specialist | Paid Ads | — | — | — |
| Aldo Messina | Booker | Booking | aldo@conceptoneagency.com | — | — |
| Alejandro Gonzalez | Logística, Booker | Logística | alex@blackmoose.es | 664604640 | — |
| Borja Comino | Comercial, Redacción | Comercial | — | — | — |
| Carlos Pego Muñoz | (—) | — | carlos@blackmoose.es | 648815985 | — |
| Carlos Ramudo Valencia | (—) | Comercial | c.ramudo@blackmoose.es | — | — |
| Federico Cortina | Dirección, Redacción | Redacción | — | — | — |
| Fran Hinojosa Veredas | (—) | — | fran@blackmoose.es | — | — |
| Inés Batlle | Comunicación, PR | Comunicación & PR | — | — | **Lucía Gómez Garcia** |
| Israel B Gras Cuenca | (—) | — | israel@blackmoose.es | 606263540 | — |
| Jack Howell (foto) | (—) | — | jack@blackmoose.es | — | — |
| Jassi Gonzalez Montes | (—) | — | jassi@blackmoose.es | — | — |
| Joe Coe | Advancing | Advancing | joe@blackmoose.es | 620719682 | — |
| Juan Manuel Molina | Redacción | Redacción | — | — | — |
| Lucía Gómez Garcia | Account Manager | Comunicación & PR | — | — | — |
| Maria Fernanda Rodriguez | Diseño | Diseño | — | — | — |
| Marian Aristimuno | Redacción | Redacción | — | — | — |
| Oscar Buch | Booker, Logística | Booking | oscar@conceptoneagency.com | — | — |
| Pablo Carrera | Social Media Manager | Marketing | — | — | **Alba Gelabert** |
| Patricia Pareja Casalí | Project Manager | Management | patricia@blackmoose.es | — | — |
| Sadkiel | Project Manager | Management | sadkiel@blackmoose.es | — | — |
| Tony Carrerira | (—) | — | tony@blackmoose.es | — | — |
| Usuario Test | (—) | — | cpegomunoz@gmail.com | — | — |
| Victor Moreno | Video Editor | Vídeo | — | — | — |
| Yenifer Bernardo | Booker | Booking | yenifer@conceptoneagency.com | — | — |

Carlos Pego Muñoz y Jack Howell tienen `photoUrl` (foto real) en vez de iniciales.

### Seed — Ausencias (Calendario, Julio 2026)

| Persona | Tipo | Rango | Días | Aprobada |
|---|---|---|---|---|
| Alejandro Gonzalez | vacaciones | 2026-07-03 → 2026-07-07 | 5 | true |
| Carlos Pego Muñoz | vacaciones | 2026-07-03 → 2026-07-05 | 3 | true |
| Carlos Ramudo Valencia | vacaciones | 2026-07-16 → 2026-07-22 | 7 | true |

"Hoy" = 2026-07-22 → banner "Hoy: Carlos Ramudo Valencia · Vacaciones" (su ausencia cubre el día de hoy).

### Seed — Empresas y coste por empresa (`Company[]`)

| id | name | monthlyCost | color observado |
|---|---|---|---|
| conceptone | ConceptOne | 11460.00 | morado/violeta |
| euphoric | Euphoric Media | 8937.68 | naranja |
| mixmag | Mixmag Spain | 6750.00 | rojo |
| etra | Etra Agency | 4894.39 | azul |
| tagmag | TAGMAG | 2480.00 | verde |
| cruda | CRUDA | 0.00 | negro/slate |

### Seed — Fichas (`employmentType` + `monthlyCost`, 26 filas)

Contratado (4): Inés Batlle, Lucía Gómez Garcia, Pablo Carrera, Usuario Test. Freelance: el resto (22).

| Persona | Coste mensual |
|---|---|
| Alberto Egea | 4000,00 € |
| Lucía Gómez Garcia | 3068,33 € |
| Maria Fernanda Rodriguez | 2420,00 € |
| Borja Comino | 2400,00 € |
| Pablo Carrera | 2007,68 € |
| Alba Gelabert | 2000,00 € |
| Sadkiel | 2000,00 € |
| Federico Cortina | 1900,00 € |
| Inés Batlle | 1826,06 € |
| Victor Moreno | 1700,00 € |
| Aldo Messina | 1500,00 € |
| Joe Coe | 1500,00 € |
| Marian Aristimuno | 1500,00 € |
| Patricia Pareja Casalí | 1500,00 € |
| Yenifer Bernardo | 1500,00 € |
| Alejandro Gonzalez | 1200,00 € |
| Oscar Buch | 1200,00 € |
| Juan Manuel Molina | 800,00 € |
| Carlos Ramudo Valencia | 500,00 € |
| Carlos Pego Muñoz, Fran Hinojosa Veredas, Israel B Gras Cuenca, Jack Howell, Jassi Gonzalez Montes, Tony Carrerira, Usuario Test | sin coste (`undefined`) |

Verificado: la suma de los 19 valores anteriores = **34.522,07 €**, exactamente el total del dashboard.

`companyIds` por ficha: sembrar solo lo legible en `live-team-fichas.png` (dot único = esa empresa); las 4 filas tapadas por el panel de Ayuda (Carlos Pego Muñoz, Carlos Ramudo Valencia, Federico Cortina, Fran Hinojosa Veredas) y los casos multi-dot ambiguos quedan `companyIds: []` con comentario `// TODO: verificar contra Supabase — fila tapada/ambigua en el recon`. No se fabrica el dato para no romper fidelidad.

### Ficha detalle sembrada (Alba Gelabert)

`hasAccount: true`, `active: true`, `birthDate: '1997-07-09'`, `vacationDaysPerYear: 22`, resto de campos sensibles `undefined`. Resto de personas: mismo shape con todos los campos sensibles `undefined` salvo lo ya cubierto por Directorio/Fichas (nombre, puestos, reporta a, email/teléfono, tipo, coste).

## Helpers

**`people.ts`**
```ts
allPeople(): Person[]                                    // orden alfabético (seed)
searchPeople(list: Person[], query: string, department?: string): Person[]
departmentsList(): string[]                               // únicos, orden alfabético
directReports(personId: string): Person[]                 // managerId === personId
orgRoots(): Person[]                                      // managerId undefined/null
personLabel(person: Person): string                        // 'puesto · departamento' o '—'
```

**`absences.ts`**
```ts
absencesForMonth(year: number, month: number, opts?: { approvedOnly?: boolean }): Absence[]
absenceDays(absence: Absence): number                      // inclusive
todaysAbsence(isoToday: string): { person: Person; absence: Absence } | undefined
totalDaysForPerson(personId: string, year: number, month: number): number | undefined // '—' si 0
```

**`fichas.ts`**
```ts
fichaFor(personId: string): Ficha | undefined
filterFichas(list: Ficha[], f: { companyId?: CompanyId | 'todas'; type?: Ficha['employmentType'] | 'todos' }): Ficha[]
companies(): Company[]
totalMonthlyCost(): number                                  // Σ Company.monthlyCost (constante observada)
costRankingByPerson(): { person: Person; ficha: Ficha }[]    // orden desc por monthlyCost, sin undefined
```

## Componentes (unidades pequeñas y aisladas)

1. **`PersonCard`** (Directorio) — avatar/foto, nombre, `positions` (★ principal), chip departamento opcional, email/teléfono (o "Sin email"/"Sin teléfono" gris), línea opcional "Reporta a `<Nombre>`", link "Ver ficha personal →" (navega a `/personal/fichas?p=<id>`).
2. **`DirectorioToolbar`** — buscador + select departamento; controlado por props/callbacks.
3. **`OrgRow`** — fila de organigrama: avatar+nombre+`puesto · departamento`, badge "N persona(s)" si tiene reports, icono ✉ condicional + link "Ficha"; soporta indentación (`level: number` prop) para reports anidados.
4. **`EquipoPage`** — orquesta Directorio/Organigrama: `SegmentedControl tone="dark"`, estado `view`, búsqueda/filtro (Directorio) o árbol `orgRoots()`+`directReports()` recursivo (Organigrama).
5. **`TeamCalendarGrid`** — tabla persona × 31 días: cabecera con letra+número de día, fines de semana sombreados, columna "hoy" resaltada; celdas con barra morada `absolute`/`rounded` cuando el rango de una ausencia cruza esa fila (posicionada por `startDate`/`endDate`); columna "Días" con `absenceDays` o "—"; translúcida si `!approved` y no aplica el filtro. Componente nuevo (no encaja en `MonthCalendar`, que es grid mensual de celdas, no tabla persona×día).
6. **`CalendarLegend`** — checkbox "Solo aprobadas" + 5 dots de leyenda (Vacaciones/Teletrabajo/Baja/Ausencia/Festivo·finde).
7. **`CalendarioPage`** — orquesta: selector de mes (state local `year/month`), banner "Hoy: …", `CalendarLegend`, `TeamCalendarGrid`, nota al pie.
8. **`FichasFilterPanel`** — selects Empresa/Tipo + botón ancho `+ Nueva persona` (inerte); `listTop` de `MasterDetailList`.
9. **`FichaListRow`** — nombre + `Tipo · Puesto(s)` gris + dots de `companyIds` (color por `Company.colorHex`).
10. **`FichaDetailPanel`** — cabecera nombre + badges Con cuenta/Activa; 5 tabs (`UnderlineTabs` o similar ya existente) — solo "Datos personales" con formulario real, resto placeholder; banner "Cambios sin guardar" condicionado a edición real (delta vs bug del live) + botón `Guardar` (arriba y abajo, inerte); formulario 2 columnas con los ~18 campos.
11. **`CostByCompanyCard`** — título "COSTE POR EMPRESA" + filas (dot + nombre + `ProgressBar` proporcional al máximo + `formatCurrency`).
12. **`CostByPersonCard`** — título "COSTE POR PERSONA" + ranking (nombre + puesto + `formatCurrency`, `font-bold` en el importe).
13. **`CostDashboard`** — "Coste mensual estimado total: `formatCurrency(total)`" + grid 2 columnas con `CostByCompanyCard`/`CostByPersonCard`.
14. **`FichasPage`** — orquesta: filtros, `MasterDetailList` (o composición equivalente) con `FichaListRow`, lee `?p=` de la URL (`useSearchParams`) para seleccionar/mostrar `FichaDetailPanel`, botón "⬇ Exportar a Excel" inerte, `CostDashboard` debajo.

## Interactividad (funcional in-memory; nunca muta el live ni persiste)

- Directorio: búsqueda (nombre/puesto/email) + filtro departamento → funcional.
- Toggle Directorio/Organigrama → funcional (estado local).
- "Ver ficha personal →" → navega a `/personal/fichas?p=<id>` (funcional).
- Calendario: cambio de mes (‹ ›) → funcional sobre el seed de julio 2026 (meses sin ausencias muestran tabla vacía, fiel al dato real); checkbox "Solo aprobadas" → funcional (todas las ausencias sembradas son `approved: true`, así que el filtro no cambia el resultado visible con el seed actual, pero el control es real).
- Fichas: filtros Empresa/Tipo → funcionales; selección de fila → actualiza `?p=` y muestra `FichaDetailPanel`; edición de campos del formulario → estado local (banner "Cambios sin guardar" se activa solo entonces, delta vs live).
- **Inertes** (`type="button"`, sin acción): `+ Nueva persona`, `⬇ Exportar a Excel`, `Guardar` (ambos), tabs de ficha distintos de "Datos personales" (placeholder), icono de gráfico de barras del TopNav.

## Deltas intencionales vs live

1. `SegmentedControl` extendido con `tone="dark"` (en vez de duplicar el componente) para el active oscuro `#44444C` de Directorio/Organigrama — resto de usos (`tone` por defecto `'light'`) no cambian.
2. Banner "Cambios sin guardar" **no** aparece al abrir la ficha sin editar (el live lo muestra por un bug de normalización de fechas); en el calco aparece solo tras una edición real.
3. `companyIds` de las 4 fichas tapadas por el panel de Ayuda en la captura se siembran como `[]` en vez de fabricar un valor; documentado con TODO en el seed.
4. Tabs de ficha "Acceso y permisos" / "Condiciones económicas" / "Vacaciones" / "Registro de horas": placeholder "En construcción" (no se capturó su contenido en el live).
5. Sin clases `brand-*` en grises/negros; botones oscuros usan `#44444C`/`slate-800` según corresponda (igual que el resto del boilerplate).

## Testing

- **Datos:** `people.test.ts` (26 personas, 2 relaciones manager/reports, `directReports`/`orgRoots`, `searchPeople` por nombre/puesto/email, `departmentsList` sin duplicados), `absences.test.ts` (3 ausencias de julio 2026, `absenceDays` inclusive, `todaysAbsence('2026-07-22')` → Carlos Ramudo Valencia, `totalDaysForPerson` "—"/número), `fichas.test.ts` (26 fichas, 4 Contratado/22 Freelance, suma de `monthlyCost` = 34.522,07 €, `filterFichas` por empresa/tipo, `costRankingByPerson` ordenado desc, `totalMonthlyCost` = Σ `Company.monthlyCost`).
- **Componentes:** `PersonCard` (foto vs iniciales, chip departamento opcional, "Sin email"/"Sin teléfono", "Reporta a"), `OrgRow` (badge "N persona(s)" condicional, indentación), `TeamCalendarGrid` (fin de semana sombreado, columna hoy resaltada, barra de rango correcta, translúcida si no aprobada), `CalendarLegend`, `FichaListRow` (dots multicolor), `FichaDetailPanel` (badges, banner solo tras editar, campos, tabs placeholder), `CostByCompanyCard`/`CostByPersonCard` (`formatCurrency`, orden), `DirectorioToolbar`, `FichasFilterPanel`.
- **Integración por página:** `EquipoPage` (toggle + búsqueda + filtro departamento combinados), `CalendarioPage` (navegación de mes, banner "Hoy", checkbox filtro), `FichasPage` (filtros Empresa/Tipo, selección → `?p=`, `CostDashboard` con totales exactos).
- **Verificación final:** Playwright ours↔live las 3 sub-vistas + ficha detalle; sin `brand-*` en el árbol; 0 errores de consola.

## Criterios de aceptación

1. `/personal`, `/personal/calendario`, `/personal/fichas` renderizan páginas reales (no `ModuleShell` placeholder); `TeamShell` usa tabs por ruta real como `RedaccionShell`.
2. Equipo/Directorio: 26 `PersonCard` alfabéticas con los campos exactos de la tabla de seed; búsqueda y filtro de departamento funcionan.
3. Equipo/Organigrama: jerarquía plana con exactamente 2 nodos con reports (Alba→Pablo, Lucía→Inés), badge "1 persona" en ambos.
4. Calendario: julio 2026 muestra exactamente 3 barras de ausencia con los rangos/días de la tabla de seed; banner "Hoy: Carlos Ramudo Valencia · Vacaciones"; resto de personas "—".
5. Fichas: lista de 26 con `Tipo · Puesto(s)` correcto; dashboard de costes con total 34.522,07 € y los 6 importes por empresa exactos; ranking por persona con los 19 importes exactos en el orden correcto.
6. Abrir una ficha vía `?p=<id>` muestra `FichaDetailPanel` con los datos sembrados (ejemplo Alba Gelabert: Con cuenta/Activa, nacimiento 09/07/1997, 22 días/año); banner "Cambios sin guardar" no aparece hasta editar.
7. `+ Nueva persona`, `⬇ Exportar a Excel`, `Guardar` son inertes; tabs de ficha distintos de Datos personales muestran placeholder.
8. `SegmentedControl` reutilizado (no duplicado) con nueva prop `tone`; `formatCurrency`, `Avatar`, `MasterDetailList` reutilizados sin duplicar.
9. Suite verde, lint `--max-warnings 0`, `tsc` limpio (ES2020, sin `Array.prototype.at()`), sin clases `brand-*` en grises/negros.
