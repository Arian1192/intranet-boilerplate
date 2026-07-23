# Configuración (calco pixel-perfect)

**Fecha:** 2026-07-22
**Rama propuesta:** `feature/configuracion`
**Requisito clave (usuario):** 100% fiel al live (pixel-perfect); el modelo de datos espeja tablas Supabase. Nunca inventar affordances que el live no tiene.

## Objetivo

Reemplazar el placeholder `ConfigShell` (`ModuleShell` genérico "Contenido del módulo en desarrollo") por un calco fiel del módulo **Configuración** completo: shell con sidebar de navegación agrupado en 6 secciones (SISTEMA, MI TRABAJO, COMUNICACIÓN, CONCEPTONE·BOOKING, PRODUCCIÓN, EQUIPO) y **10 sub-vistas propias** (una es un link de salida, ver abajo), todas bajo `/configuracion`.

Alcanzado: `true`. El módulo existe completo en el live y se ha reconocido en su totalidad (12 capturas, ver abajo).

## Fuera de alcance

- **"Cuentas (auditoría)"**: en el live este ítem del sidebar de Configuración **no renderiza contenido propio** — navega fuera del módulo hacia `/team/usuarios` (top nav cambia a Team/Equipo/Calendario/Fichas). En nuestro repo el módulo Team equivalente es `/personal` (`TeamShell`, hoy un placeholder `ModuleShell`). Esta fase implementa el ítem del sidebar como **link de salida** (`<Link to="/personal">`), sin renderizar la matriz de permisos ni la tabla de usuarios — eso pertenece a una fase futura de Team/Usuarios, no a esta.
- Editor visual de contratos/plantillas de contrato (solo lista + stub "Editar"/"+ Nueva plantilla" inertes).
- Acordeón "Importar un año entero (pegar lista)" en Festivos: queda colapsado/inerte (no se exploró su interior en el live para evitar acciones de escritura).
- Envío real de correos (Resend), llamadas reales a integraciones (FlightAPI/IA/Signaturit/Spotify), persistencia de cualquier campo — todo es in-memory de sesión.
- Drag&drop, importación/exportación, generación real de contratos con `{{grupo.campo}}`.

## Contexto del live (fuente de verdad)

Capturas en `docs/references/configuracion/`:
`live-configuracion.png` (Plantillas de correo, landing por defecto), `live-configuracion-uso-y-coste.png`, `live-configuracion-incidencias.png`, `live-configuracion-cuentas-auditoria.png` (fuera de alcance, referencia), `live-configuracion-documentos-tipografia.png`, `live-configuracion-notificaciones.png`, `live-configuracion-comisiones-de-bookers.png`, `live-configuracion-control-de-comisiones.png`, `live-configuracion-contratos.png`, `live-configuracion-alertas-de-eventos.png`, `live-configuracion-rrhh-coste-y-avisos.png`, `live-configuracion-festivos.png`.

**Landing:** `/configuracion` (sin sub-ruta) renderiza el contenido de **"Plantillas de correo"** — no la primera entrada del sidebar ("Uso y coste"). Se replica tal cual (deliberado, no bug a corregir).

**Sidebar** (fijo izquierda, ~220px, fondo gris muy claro `rgb(246,246,247)` en el activo): 6 secciones con label gris mayúscula pequeño y 12 ítems:

| Sección | Ítems |
|---|---|
| SISTEMA | Uso y coste · Incidencias · Cuentas (auditoría) *(sale del módulo)* |
| MI TRABAJO | Documentos (tipografía) |
| COMUNICACIÓN | Plantillas de correo *(default)* · Notificaciones |
| CONCEPTONE · BOOKING | Comisiones de bookers · Control de comisiones · Contratos |
| PRODUCCIÓN | Alertas de eventos |
| EQUIPO | RRHH (coste y avisos) · Festivos |

Breadcrumb superior `/ Configuración ⌄` + iconos derecha (maletín, campana 9+, avatar "T"/"test Admin") — idéntico al resto de módulos vía `TopNav`. Panel "Ayuda" flotante abajo-izquierda presente en todas las páginas (ya existe, `HelpPanel`).

Botón primario de marca en todo el módulo: `bg-[#44444C]` texto blanco, `rounded-lg` (8px), `text-sm`, `font-medium`, `px-4 py-2` (Guardar, +Nueva plantilla, Invitar, Añadir, Guardar configuración). **Nunca** `variant="primary"` del `Button` compartido (ese usa `bg-brand-600`) — se sobreescribe con `className` o se añade un `variant="dark"` si se decide extender el primitivo.

Datos literales por sub-vista: ver tablas de seeds en cada sección del modelo de datos abajo (transcritos directamente de las capturas).

## Arquitectura

### Rutas

```
/configuracion                    → index → PlantillasCorreoPage (landing real del live)
/configuracion/uso                → UsoPage
/configuracion/incidencias         → IncidenciasPage
/configuracion/documentos          → DocumentosTipografiaPage
/configuracion/notificaciones      → NotificacionesPage
/configuracion/comisiones          → ComisionesBookersPage
/configuracion/comisiones-pagos    → ControlComisionesPage
/configuracion/contratos           → ContratosPage
/configuracion/alertas             → AlertasEventosPage
/configuracion/rrhh                → RrhhPage
/configuracion/festivos            → FestivosPage
```

`ConfigShell` (en `src/features/modules/ConfigShell.tsx`) pasa a ser un wrapper delgado, igual patrón que `MixmagShell`/`TagmagShell`:

```tsx
import { ConfiguracionShell } from '@/features/configuracion/ConfiguracionShell';
export function ConfigShell() { return <ConfiguracionShell />; }
```

`router.tsx`: sustituir `<Route path="/configuracion" element={<ConfigShell />} />` por rutas anidadas (index + 10 `path` children) apuntando a las páginas de `src/features/configuracion/pages/`.

### Shell

`src/features/configuracion/ConfiguracionShell.tsx`:
- `<AppLayout user={mockUser} module={{ name: 'Configuración', href: '/configuracion' }}>` — **sin** `tabs` (a diferencia de Mixmag/CRM): el live no tiene pestañas superiores en este módulo, la navegación vive en el sidebar propio.
- Dentro de `children`: layout de dos columnas `flex gap-8`: `<ConfiguracionSidebar />` (aside, `w-56 shrink-0`) + `<div className="flex-1"><Outlet /></div>`.
- El "Cuentas (auditoría)" del sidebar es un `<Link to="/personal">` normal (no `NavLink` activo dentro del módulo — nunca queda resaltado porque nunca es la ruta activa de `/configuracion/*`).

### Dónde viven los datos y componentes

```
src/features/configuracion/
  ConfiguracionShell.tsx
  ConfiguracionShell.test.tsx
  data/
    sidebar.ts            // SIDEBAR_SECTIONS (fuente única de la nav; también usada por el propio shell)
    plantillasCorreo.ts    // EmailTemplate + seeds (6) + helpers
    uso.ts                 // Integration + UsageSnapshot + seeds + helpers
    incidencias.ts         // Incidencia + seeds (8) + helpers de conteo
    notificaciones.ts      // NotificationCategory + NotificationUser + seeds
    comisiones.ts          // BookerCommission + CommissionSettings + CommissionLedger + seeds
    contratos.ts           // ContractTemplate + seeds (2)
    alertas.ts             // EventAlertRule + seeds (5)
    rrhh.ts                // HrSettings + Department + seeds (12 deptos)
    festivos.ts            // Holiday + seeds (23, 2026-2027)
    *.test.ts              // un test por fichero de datos
  components/
    ConfiguracionSidebar.tsx / .test.tsx
    ConfigPageHeader.tsx / .test.tsx        // título + subtítulo, reusado en las 10 páginas
    EmailTemplateCard.tsx / .test.tsx
    IntegrationRow.tsx / .test.tsx
    UsageBanner.tsx / .test.tsx
    IncidenciaRow.tsx / .test.tsx
    IncidentCountPill.tsx / .test.tsx
    TypographySlider.tsx / .test.tsx
    NotificationCategoryCard.tsx / .test.tsx
    BookerCommissionRow.tsx / .test.tsx
    ContractTemplateRow.tsx / .test.tsx
    EventAlertRuleCard.tsx / .test.tsx
    DepartmentRow.tsx / .test.tsx
    HolidayRow.tsx / .test.tsx
  pages/
    PlantillasCorreoPage.tsx / .test.tsx
    UsoPage.tsx / .test.tsx
    IncidenciasPage.tsx / .test.tsx
    DocumentosTipografiaPage.tsx / .test.tsx
    NotificacionesPage.tsx / .test.tsx
    ComisionesBookersPage.tsx / .test.tsx
    ControlComisionesPage.tsx / .test.tsx
    ContratosPage.tsx / .test.tsx
    AlertasEventosPage.tsx / .test.tsx
    RrhhPage.tsx / .test.tsx
    FestivosPage.tsx / .test.tsx
```

### Primitivos compartidos reusados (no duplicar)

- `StatCard` (`@/components/ui`) → stat cards de Uso y coste (3) y Control de comisiones (3).
- `Card`, `Button`, `Input`, `Select`, `Textarea` (`@/components/ui`).
- `SegmentedControl` (`@/components/ui`) → toggle de periodo en Uso y coste (7 días/30 días/90 días/Un año). El live pinta el activo con fondo oscuro `#44444C`, distinto del estilo actual del primitivo (fondo blanco sobre `bg-slate-100`). **Decisión:** extender `SegmentedControl` con una prop opcional `tone?: 'light' | 'dark'` (default `'light'`, el existente) en vez de duplicarlo — `tone="dark"` pinta el activo `bg-[#44444C] text-white`. Se reusa igual en cualquier futuro toggle de periodo del resto de módulos.
- `RichTextEditor` (`@/components/ui`, TipTap, ya funcional en Creativos) → campo "Mensaje" de cada plantilla de correo. Delta documentado: el set exacto de iconos de la barra del live (B i U S · 1. ☑ 🔗 A A A ✕) puede no calcar 1:1 los botones del editor existente; se preserva el comportamiento (negrita/cursiva/subrayado/tachado/listas/enlace) y se documenta cualquier icono sin equivalente como delta, sin inventar botones nuevos.
- `formatCurrency` (`@/lib/format`) → todos los importes en euros (Uso y coste, Control de comisiones).
- `Avatar` (`@/components/ui`) → autor de cada incidencia (iniciales + color o icono genérico si no hay foto, ya soportado por el primitivo en CRM/Pipeline).

## Modelo de datos (espejo Supabase)

Convención: cada dominio es una tabla futura; FKs explícitas; campos denormalizados documentados inline.

### 1. Plantillas de correo — tabla `email_templates`

```ts
export interface EmailTemplate {
  id: string;
  slug: string;           // técnico, único: invitacion_portal, invitacion_usuario, ...
  title: string;          // 'Bienvenida — portal de cliente'
  description: string;
  subject: string;
  emailTitle: string;     // 'Título — el titular al abrir el correo'
  message: string;        // cuerpo (multi-línea; futuro: JSON de bloques TipTap)
  buttonLabel: string;    // '' = sin botón (vacío = sin botón, como el live)
  buttonLink: string;     // '' = sin enlace; normalmente '{{link}}'
  variables: string[];    // ['{{nombre}}', '{{link}}', ...]
}
```

**Seeds (6, orden del live):**

| slug | title | subject | buttonLabel | variables |
|---|---|---|---|---|
| `invitacion_portal` | Bienvenida — portal de cliente | Acceso a tu portal de cliente · CRUDA by Black Moose Group | Crear mi contraseña | `{{nombre}}` `{{link}}` |
| `invitacion_usuario` | Bienvenida — usuario de la intranet | Tu acceso a la intranet · Black Moose | Crear mi contraseña | `{{nombre}}` `{{link}}` |
| `liquidacion_show` | Liquidación de show (artista) | Liquidación {{artista}}, {{show}} - {{fecha}} | *(vacío)* | `{{artista}}` `{{show}}` `{{codigo}}` `{{fecha}}` `{{neto_artista}}` `{{fee_bruto}}` `{{booking_fee}}` `{{management_fee}}` `{{gastos_total}}` `{{gastos_detalle}}` |
| `reset_password` | Restablecer contraseña | Restablece tu contraseña · Black Moose | Cambiar mi contraseña | `{{nombre}}` `{{link}}` |
| `vacaciones_aprobada` | Vacaciones — aprobada | Tu solicitud de {{tipo}} ha sido aprobada · Black Moose | *(vacío)* | `{{nombre}}` `{{tipo}}` `{{desde}}` `{{hasta}}` `{{dias}}` `{{notas}}` `{{estado}}` |
| `vacaciones_rechazada` | Vacaciones — rechazada | Tu solicitud de {{tipo}} ha sido rechazada · Black Moose | *(vacío)* | `{{nombre}}` `{{tipo}}` `{{desde}}` `{{hasta}}` `{{dias}}` `{{notas}}` `{{estado}}` |

Solo las 3 plantillas de autenticación (`invitacion_portal`, `invitacion_usuario`, `reset_password`) tienen botón/enlace reales — las 3 informativas (liquidación, vacaciones) van sin CTA, como en el live. Textos completos de `message`/`emailTitle` se transcriben literalmente de la captura al implementar (ver `live-configuracion.png`).

Pie del módulo (texto estático, no editable): *"Salen por Resend desde no-reply@blackmoose.es con copia a quien los lanza. En invitaciones, {{link}} es el enlace para crear la contraseña: va en el botón, no en el texto."*

### 2. Uso y coste — tablas `integrations` + `integration_usage_snapshots`

```ts
export type UsagePeriod = '7d' | '30d' | '90d' | '1y';

export interface AiSubfunction {
  id: string;
  label: string;          // 'Triaje de incidencias', 'Chat de ayuda', 'copys', 'mejorar'
  model: string;           // 'gemini-flash-latest'
  usos: number;
  tokensIn: string;        // '44k' (snapshot formateado, como el live)
  tokensOut: string;       // '1k'
  spend: number;           // EUR
}

export interface Integration {
  id: string;              // 'precio-vuelos', 'ia', 'correo-saliente', ...
  name: string;
  provider: string;        // 'FlightAPI', 'Anthropic / Google / OpenAI', ...
  pricingModel: 'cuota' | 'por_uso';
  monthlyFee?: number;      // solo si pricingModel === 'cuota'
  statusDot: 'green' | 'amber';
  statusLabel: string;     // 'Funciona · última vez 21/7/2026' | 'Sin usar en este periodo' | 'Lo pagas y no lo has usado'
  subfunctions?: AiSubfunction[]; // solo 'ia'
}

// snapshot de métricas por integración y periodo (una fila real observada: '30d')
export interface IntegrationUsageSnapshot {
  integrationId: string;   // FK → Integration.id
  period: UsagePeriod;     // FK conceptual
  usos?: number;
  tarda?: string;          // '10.6 s'
  tokensLabel?: string;    // '92k → 3k'
  spend?: number;
  perUse?: number | null;  // null = '—' (nunca usado, sin cifra)
  includedNote?: string;   // '1 de 30.000 incluidas'
}

export interface UsageTotals {
  period: UsagePeriod;
  cuotaFijaMes: number;    // 53.89 — fija, no cambia por periodo
  gastoTotalPeriodo: number;
  errores: number;
}
```

**Seeds — 6 integraciones:**

| id | name | provider | pricingModel | cuota/mes | dot | statusLabel |
|---|---|---|---|---|---|---|
| `precio-vuelos` | Precio de vuelos | FlightAPI | cuota | 42,89 € | green | Funciona · última vez 21/7/2026 |
| `ia` | Inteligencia artificial | Anthropic / Google / OpenAI | por_uso | — | green | Funciona · última vez 21/7/2026 |
| `correo-saliente` | Correo saliente | Resend | por_uso | — | amber | Sin usar en este periodo |
| `firma-contratos` | Firma de contratos | Signaturit | por_uso | — | amber | Sin usar en este periodo |
| `perfiles-artista` | Perfiles de artista | Spotify / Deezer | cuota | 11,00 € | amber | Lo pagas y no lo has usado |
| `horarios-vuelos` | Horarios de vuelos | AeroDataBox (RapidAPI) | por_uso | — | amber | Sin usar en este periodo |

**Snapshot `30d`** (único periodo con cifras reales observadas; 7d/90d/1y quedan con el mismo seed documentado como delta, ver más abajo):

| integrationId | usos | tarda | tokens | gasto | porUso | nota |
|---|---|---|---|---|---|---|
| precio-vuelos | 1 | 10.6 s | — | — | 42,89 € | 1 de 30.000 incluidas |
| ia | 28 | 11.2 s | 92k → 3k | 0,0300 € | — | — |
| correo-saliente | 0 | — | — | 0,00 € | — | — |
| firma-contratos | — | — | — | — | — | *(sin fila de métricas en el live)* |
| perfiles-artista | 0 | — | — | — | — (nunca usado) | — |
| horarios-vuelos | 0 | — | — | 0,00 € | — | — |

**Sub-funciones de IA (todas `gemini-flash-latest`):**

| label | usos | tokens | gasto |
|---|---|---|---|
| Triaje de incidencias | 11 | 44k → 1k | 0,0154 € |
| Chat de ayuda | 12 | 46k → 923 | 0,0150 € |
| copys | 3 | 1k → 695 | 0,0019 € |
| mejorar | 2 | 490 → 159 | 0,0005 € |

**Totales (`30d`):** cuota fija/mes 53,89 € · gasto total 30 días 53,92 € (caption "Cuota prorrateada + consumo") · errores 0.

**Banners (3, estáticos, no varían por periodo):**
1. "3 suscripciones sin importe. Salen a 0 €, y eso no es que sean gratis: es que no le has dicho lo que pagas." + link `Rellenar precios` (subrayado, inerte).
2. "Estás pagando y no lo usas: Perfiles de artista. Ninguna llamada en 30 días."
3. "12 tarifas de IA sin verificar contra una factura real. El coste que ves es un orden de magnitud, no una cifra contable."

Pie: enlaces `Cuotas y tarifas` · `Actualizar` (inertes).

### 3. Incidencias — tabla `help_reports` (mismo origen que el panel de Ayuda global)

```ts
export type IncidentStatus = 'nueva' | 'auto' | 'en_curso' | 'resuelta' | 'descartada';

export interface Incidencia {
  id: string;
  status: IncidentStatus;
  type: 'Idea' | 'Bug' | 'Duda';  // el live solo muestra 'Idea' en el seed
  text: string;                    // texto completo (la UI trunca)
  originPath?: string;             // '/euphoric/calendario', '/shows/nuevo', '/shows/{uuid}'
  authorInitials?: string;         // undefined = icono genérico (sin foto)
  authorColor?: string;
}
```

**Contadores:** NUEVAS 1 · AUTO 1 · EN CURSO 0 · RESUELTAS 2 · DESCARTADAS 4 (derivados con `countByStatus`, nunca hardcodeados).

**Seeds (8, orden del live):**

| status | tipo | texto | origen | autor |
|---|---|---|---|---|
| descartada | Idea | viendo como crear un cliente y pone una dirección de correo. Puede… | `/` | FV |
| resuelta | Idea | Me gustaría hacer la solicitud de 2 cosas: 1. Que se pudiera crear un nuevo evento haciendo clic en el calendario… | `/euphoric/calendario` | AG |
| descartada | Idea | Me gustaría hacer la solicitud de 2 cosas: 1. Que se pudiera crear un… | `/` | AG |
| descartada | Idea | Esto debería estar enlazado con no… | `/euphoric/campanas` | *(genérico)* |
| nueva | Idea | En el apartat de contactes del Signer/Buyer molaria afegir la opcio d… | `/shows/nuevo` | JC |
| descartada | Idea | Esto podrías darle color por favor, en cada pestaña igual. | `/shows/95a152d1-d546-40…` | *(genérico)* |
| resuelta | Idea | En logística del deal si se selecciona traslados internos tiene que s… | `/shows/08ea3304-af17-47…` | *(genérico)* |
| auto | Idea | ¿por qué no puedo seleccionar ida y vuelta en la estimación de vuelo? | `/shows/08ea3304-af17-47…` | *(genérico)* |

### 4. Notificaciones — tabla `notification_recipients` (categoría × usuario)

```ts
export type NotificationCategoryId = 'vacaciones' | 'pedidos_reposicion' | 'contratos_firmados' | 'alertas_rrhh';

export interface NotificationCategory {
  id: NotificationCategoryId;
  title: string;
  description: string;
  hasEmailToggle: boolean;   // 'Solicitudes de vacaciones' = false; el resto = true
}

export interface NotificationRecipient {
  categoryId: NotificationCategoryId; // FK
  userName: string;                   // denormalizado; FK futura a users.id
  checked: boolean;
  alsoEmail: boolean;                 // solo relevante si hasEmailToggle; deshabilitado si !checked
}

export interface PersonalNotificationType {
  id: string;
  label: string;
  description: string; // informativo, no configurable
}
```

**15 usuarios** (mismo roster que `Comisiones de bookers`): Alba Gelabert, Aldo Messina, Alex González, Carlos Pego, Fran Hinojosa Veredas, Israel Cuenca, Jack Howell, Jassi Gonzalez Montes, Joe Coe, Juan (Staff Level Test), Oscar Buch, Sadkiel, test, Tony Carrerira, Yenifer Bernardo.

**Marcados en el seed** (resto sin marcar): Carlos Pego y test están marcados en las 4 categorías; en las 3 categorías con toggle de email también tienen "también por email" activado; Israel Cuenca además marcado (con email) solo en "Pedidos de reposición (portal)".

**11 tipos de notificación personal automática** (bloque final, solo informativo): Tus vacaciones resueltas, Acciones asignadas, Novedades del grupo, Alertas de producción, Alertas de shows, Arte pendiente de aprobar, Tu arte resuelto, Trabajo asignado, Aprobaciones asignadas, Aprobaciones del cliente, Cumpleaños del equipo (cada una con su descripción literal de la captura).

### 5. Comisiones de bookers + Control de comisiones — tablas `commission_settings`, `booker_commissions`, `commission_ledger`

```ts
export interface CommissionSettings {
  globalPercent: number;       // 25
  exclusivityWindowDays: number; // 30
  exclusivityRadiusKm: number;   // 100
  logisticJumpKm: number;        // 600
}

export interface BookerCommission {
  bookerName: string;   // FK futura a users.id
  percent: number;      // 25 para todos en el seed (sin overrides)
}

export interface CommissionLedgerTotals {
  devengadoTotal: number;  // 0
  abonado: number;         // 0
  pendienteDeAbonar: number; // 0
}
```

**Seeds:** `globalPercent=25`, ventana 30 días, radio 100 km, salto logístico 600 km. 15 bookers (mismo roster), todos a `percent: 25`. Control de comisiones: los 3 totales en 0,00 € y bloque "POR BOOKER" con estado vacío ("Aún no hay comisiones devengadas ni abonos.") — reflejar el estado vacío real, no inventar datos.

### 6. Contratos — tabla `contract_templates`

```ts
export interface ContractTemplate {
  id: string;
  name: string;      // 'Contrato estándar (ES)'
  langCode: 'ES' | 'EN';
  description: string;
}
```

**Seeds (2):**

| name | lang | description |
|---|---|---|
| Contrato estándar (ES) | ES | Plantilla base de actuación en español. |
| Booking Agreement (EN) | EN | Contrato de actuación completo en inglés (basado en el contrato ConceptOne). |

### 7. Alertas de eventos — tabla `event_alert_rules`

```ts
export type AlertSeverity = 'info' | 'aviso' | 'critica';

export interface EventAlertRule {
  id: string;
  title: string;
  description: string;
  active: boolean;
  windowDaysBefore: number; // D-N
  severity: AlertSeverity;
  alsoEmail: boolean;
}
```

**Seeds (5, orden del live):**

| title | D- | severidad | email |
|---|---|---|---|
| Presupuesto sin definir | 21 | Info | ✗ |
| Line-up sin cerrar | 14 | Aviso | ✗ |
| Contrato sin subir | 10 | Crítica | ✓ |
| Proveedores sin confirmar | 7 | Aviso | ✗ |
| Tareas de producción pendientes | 3 | Aviso | ✗ |

Todas `active: true`. Solo "Contrato sin subir" tiene email activado (coherente con ser la única severidad Crítica).

### 8. RRHH — tablas `hr_settings` (fila única) + `departments`

```ts
export interface HrSettings {
  ssEmployerPercent: number;    // 31.5
  workingDaysPerMonth: number;  // 21
  hoursPerMonth: number;        // 160
  freelanceVatPercent: number;  // 21
  freelanceIrpfPercent: number; // 15
  contractEndNoticeDays: number[];  // [60, 30, 15]
  probationEndNoticeDays: number[]; // [15, 7]
  salaryReviewNoticeDays: number[]; // [30]
  notifyBirthdays: boolean;         // true
}

export interface Department {
  id: string;
  name: string;
  color: string;   // token de color (dot), no libre: paleta de 8 swatches
  active: boolean; // 'Desactivar' vs 'Activar'
}
```

**Seeds — 12 departamentos:**

| nombre | color |
|---|---|
| Advancing | azul |
| Board | ámbar |
| Booking | azul |
| Comercial | naranja |
| Comunicación & PR | morado |
| Diseño | verde |
| Logística | azul |
| Management | azul |
| Marketing | rosa |
| Paid Ads | ámbar |
| Redacción | cian |
| Vídeo | rojo |

Todos `active: true` (todos muestran "Desactivar", ninguno "Activar" en el seed). Paleta de 8 swatches para "Nuevo departamento": azul, verde, naranja, rojo, morado, cian, rosa, ámbar.

### 9. Festivos — tabla `holidays`

```ts
export type HolidayScope = 'espana' | 'catalunya' | 'barcelona';

export interface Holiday {
  id: string;
  date: string;     // ISO yyyy-mm-dd
  name: string;
  scope: HolidayScope;
}
```

**Seeds (23, 2026–2027, orden cronológico):**

| fecha | nombre | ámbito |
|---|---|---|
| 2026-08-15 | L'Assumpció | España |
| 2026-09-11 | Diada de Catalunya | Catalunya |
| 2026-09-24 | La Mercè | Barcelona |
| 2026-10-12 | Festa Nacional d'Espanya | España |
| 2026-12-08 | La Immaculada | España |
| 2026-12-25 | Nadal | España |
| 2026-12-26 | Sant Esteve | Catalunya |
| 2027-01-01 | Any Nou | España |
| 2027-01-06 | Reis | España |
| 2027-03-26 | Divendres Sant | España |
| 2027-03-29 | Dilluns de Pasqua Florida | Catalunya |
| 2027-05-01 | Festa del Treball | España |
| 2027-05-17 | Segona Pasqua (Pasqua Granada) | Barcelona |
| 2027-06-24 | Sant Joan | Catalunya |
| 2027-08-15 | L'Assumpció | España |
| 2027-09-11 | Diada de Catalunya | Catalunya |
| 2027-09-24 | La Mercè | Barcelona |
| 2027-10-12 | Festa Nacional d'Espanya | España |
| 2027-11-01 | Tots Sants | España |
| 2027-12-06 | Dia de la Constitució | España |
| 2027-12-08 | La Immaculada | España |
| 2027-12-25 | Nadal | España |
| 2027-12-26 | Sant Esteve | Catalunya |

Colores de chip por ámbito (fieles al live): España = gris, Catalunya = ámbar, Barcelona = azul.

## Helpers

```ts
// sidebar.ts
sidebarSections(): SidebarSection[]                          // fuente única de la nav

// plantillasCorreo.ts
templates(): EmailTemplate[]

// uso.ts
integrations(): Integration[]
snapshotFor(integrationId: string, period: UsagePeriod): IntegrationUsageSnapshot | undefined
totalsFor(period: UsagePeriod): UsageTotals

// incidencias.ts
incidencias(): Incidencia[]
countByStatus(list: Incidencia[]): Record<IncidentStatus, number>

// notificaciones.ts
categories(): NotificationCategory[]
recipientsFor(categoryId: NotificationCategoryId): NotificationRecipient[]
personalTypes(): PersonalNotificationType[]

// comisiones.ts
commissionSettings(): CommissionSettings
bookerCommissions(): BookerCommission[]
ledgerTotals(): CommissionLedgerTotals

// contratos.ts
contractTemplates(): ContractTemplate[]

// alertas.ts
alertRules(): EventAlertRule[]

// rrhh.ts
hrSettings(): HrSettings
departments(): Department[]

// festivos.ts
holidays(): Holiday[]
groupByYear(list: Holiday[]): { year: number; items: Holiday[] }[]
isPast(holiday: Holiday, today?: Date): boolean
filterHolidays(list: Holiday[], opts: { includePast: boolean }): Holiday[]
```

Todos puros, inmutables (devuelven copias/nuevos arrays, nunca mutan los seeds), igual que `campanas.ts`/`pipeline.ts`.

## Componentes

Unidades pequeñas y aisladas (una responsabilidad, props explícitas):

1. **`ConfiguracionSidebar`** — renderiza `sidebarSections()`; cada ítem `NavLink` (`end` en el index) salvo "Cuentas (auditoría)" que es `Link to="/personal"` plano (nunca `isActive`). Resalta el activo con `bg-slate-100 font-semibold` como el live.
2. **`ConfigPageHeader`** — `{ title, subtitle }`; reusado en las 10 páginas (H1 + párrafo gris, patrón ya usado en Uso/Incidencias/etc.).
3. **`EmailTemplateCard`** — una plantilla: título+desc, botones "Editar"/"Vista previa" (inertes), chip slug, inputs Asunto/Título, `RichTextEditor` para Mensaje, inputs Botón/Enlace (placeholder "vacío = sin botón" cuando están vacíos), lista de variables (chips `{{var}}`), botón "Guardar" deshabilitado con texto "Sin cambios" (se habilita solo si algo cambia localmente — sin persistir).
4. **`IntegrationRow`** — icono + dot de estado + nombre + chip pricingModel + provider/statusLabel + métricas alineadas a la derecha (USOS/TARDA/TOKENS/GASTO/POR USO, cada columna opcional). Si `integration.id === 'ia'`, expande sub-filas de `AiSubfunction`.
5. **`UsageBanner`** — banner amarillo pálido con la frase clave en negrita y link opcional subrayado inerte.
6. **`IncidenciaRow`** — chip de estado (tono por `IncidentStatus`) + chip "Idea" + texto truncado (`line-clamp` o `truncate`) + `originPath` (mono/gris, `—` si no hay) + `Avatar` (iniciales+color o icono genérico).
7. **`IncidentCountPill`** — `{ label, count, tone }`; tono deshabilitado visual para "EN CURSO" cuando `count === 0` y no aplica (gris apagado, sin interacción — el live no lo muestra clicable).
8. **`TypographySlider`** — `{ label, value, unit, min, max, step, help, onChange }`; range input + valor a la derecha + texto de ayuda gris debajo. Usado 7 veces en Documentos.
9. **`NotificationCategoryCard`** — título+desc + lista de `NotificationRecipient` con checkbox principal y checkbox secundario "también por email" (deshabilitado si `!checked`, oculta la columna entera si `!category.hasEmailToggle`).
10. **`BookerCommissionRow`** — nombre + input numérico inline + `(global {globalPercent}%)` gris.
11. **`ContractTemplateRow`** — nombre + chip lang + desc + acciones "Editar"/"✕" (inertes, tono `linkAction_muted`).
12. **`EventAlertRuleCard`** — título+desc + checkbox "Activa" (derecha) + input D-N + `Select` severidad + checkbox "Avisar también por email".
13. **`DepartmentRow`** — dot de color + nombre + "Desactivar"/"Activar" + "✕" (inertes salvo toggle local de `active`).
14. **`HolidayRow`** — fecha formateada + nombre (bold) + chip de ámbito coloreado + "✕" (elimina del estado local, in-memory).

## Interactividad (funcional in-memory; nunca persiste ni llama al live)

**Funcional:**
- Sidebar: navegación real entre las 10 sub-rutas + salida a `/personal`.
- Uso y coste: toggle de periodo (`SegmentedControl` `tone="dark"`) cambia el `UsagePeriod` mostrado; banners y stat cards siguen la selección donde hay dato (30d real; el resto reusa el mismo seed, ver deltas).
- Plantillas de correo: editar cualquier campo habilita "Guardar" (local, sin persistir) y muestra "Cambios sin guardar" en vez de "Sin cambios"; "Guardar" nunca hace nada real (`type="button"`).
- Documentos (tipografía): los 7 sliders actualizan el panel "Así se verá" en vivo (estilos inline/CSS vars derivados del estado); "Volver a los valores de fábrica" resetea al seed local.
- Notificaciones: togglear checkboxes (principal y "también por email", con el secundario deshabilitado si el principal está desmarcado).
- Comisiones de bookers: editar `% global` y los 3 campos de exclusividad/logística habilita su "Guardar" propio (inerte); editar el % de un booker individual actualiza el estado local (el texto `(global 25%)` se recalcula si cambia el global).
- Alertas de eventos: toggle "Activa", input D-N, select de severidad, checkbox email — todo en estado local.
- RRHH: los inputs de "Guardar configuración" son editables in-memory; departamentos: "Desactivar"/"Activar" alterna `active` localmente; "✕" quita de la lista local (in-memory); alta de "Nuevo departamento" añade a la lista local (no persiste).
- Festivos: checkbox "Ver también los festivos pasados" filtra la lista (`filterHolidays`); alta inline (Fecha/Nombre/Ámbito/Añadir) añade al estado local; "✕" quita del estado local.
- Incidencias: solo lectura (sin filtros interactivos observados en el live más allá de scroll).

**Inerte / diferido (documentado, nunca inventado):**
- "Vista previa" de plantillas de correo (el live no abre nada verificable desde fuera; se deja como stub `type="button"`).
- "Rellenar precios", "Cuotas y tarifas", "Actualizar" (Uso y coste).
- "+ Nueva plantilla", "Editar"/"✕" en Contratos (más allá de que "✕" podría razonablemente quitar de la lista local — se deja inerte porque el live no lo mostró en acción y evitamos inventar).
- "Evaluar ahora" (Alertas de eventos).
- Acordeón "Importar un año entero (pegar lista)" en Festivos: queda colapsado, clic solo alterna abierto/cerrado sin contenido interno (no explorado en el live).
- Matriz de permisos y tabla de usuarios de "Cuentas (auditoría)": no se renderiza (fuera de alcance, ver arriba).

## Deltas intencionales vs live

- `SegmentedControl` gana `tone="dark"` para el toggle de periodo (en vez de un componente nuevo) — mismo primitivo, no duplicado.
- Botones primarios usan `bg-[#44444C]` explícito, no `variant="primary"` del `Button` compartido (ese sigue en `brand-600` para el resto de la app) — sin introducir clases `brand-*` en los grises/negros de este módulo.
- Snapshot de Uso y coste solo tiene cifras reales para el periodo `30d` (las únicas observadas en el live); `7d`/`90d`/`1y` reusan el mismo dataset como placeholder documentado — no se fabrican series temporales que el recon no capturó.
- "✕" en Contratos queda inerte (ver arriba) aunque otros "✕" del módulo (Festivos, Departamentos) sí son funcionales in-memory — decisión deliberada para no inventar affordances sobre una lista de solo 2 plantillas donde el live no mostró el resultado de borrar.
- "Cuentas (auditoría)" implementado como link de salida real a `/personal`, no como contenido embebido — fiel al comportamiento observado (es la única forma de no fabricar una pantalla que pertenece a otro módulo).

## Testing

- **Datos:** un `*.test.ts` por fichero en `data/`: shape de seeds (counts exactos: 6 plantillas, 6 integraciones, 8 incidencias, 4 categorías × 15 destinatarios, 15 bookers a 25%, 2 plantillas de contrato, 5 reglas de alerta, 12 departamentos, 23 festivos), helpers puros (`countByStatus` cuadra con los 5 contadores del live, `groupByYear` agrupa 2026/2027, `filterHolidays` incluye/excluye pasados, `snapshotFor`/`totalsFor` devuelven el snapshot 30d exacto), inmutabilidad.
- **Componentes:** cada componente de la lista anterior con sus variantes (p. ej. `IncidentCountPill` tono deshabilitado en 0; `NotificationCategoryCard` columna email oculta cuando `hasEmailToggle=false` y checkbox secundario deshabilitado si el principal no está marcado; `TypographySlider` refleja `value`/`unit` y dispara `onChange`; `DepartmentRow` alterna Desactivar/Activar).
- **Páginas:** cada una de las 11 (`PlantillasCorreoPage` … `FestivosPage`) renderiza título/subtítulo/seeds correctos y no revienta con datos vacíos donde el live los tiene vacíos (Control de comisiones).
- **Shell:** `ConfiguracionShell.test.tsx` — sidebar con las 6 secciones y 12 ítems en orden; ítem activo resaltado por ruta; "Cuentas (auditoría)" navega a `/personal` y nunca queda "activo"; `Outlet` renderiza la sub-página correcta para cada ruta.
- **Integración/router:** `/configuracion` (index) renderiza `PlantillasCorreoPage` (landing real); las 10 rutas hijas resuelven a su página; sin `brand-*` en el árbol renderizado del módulo.
- **Verificación final:** Playwright ours↔live en las 11 vistas relevantes (excluida "Cuentas (auditoría)", cubierta por su propio módulo Team en fase futura); 0 errores de consola.

## Criterios de aceptación

1. `/configuracion` (sin sub-ruta) renderiza `PlantillasCorreoPage` con las 6 plantillas en el orden y datos exactos del live (slugs, asuntos, variables, botón vacío en las 3 informativas).
2. Las 10 rutas hijas (`uso`, `incidencias`, `documentos`, `notificaciones`, `comisiones`, `comisiones-pagos`, `contratos`, `alertas`, `rrhh`, `festivos`) renderizan su página correspondiente con el sidebar de 6 secciones / 12 ítems siempre visible y el activo resaltado.
3. "Cuentas (auditoría)" navega fuera del módulo a `/personal` sin renderizar contenido propio ni quedar marcado como activo.
4. Uso y coste: 3 stat cards (53,89 € / 53,92 € / 0), 3 banners, 6 integraciones con dot/estado/métricas correctas, sub-desglose de IA con las 4 sub-funciones; toggle de periodo funcional (`tone="dark"`).
5. Incidencias: 5 contadores derivados (`countByStatus`) coinciden con 1/1/0/2/4 sobre las 8 filas sembradas.
6. Documentos (tipografía): 7 sliders con su valor/unidad/help exactos; el panel "Así se verá" refleja los cambios en vivo; "Volver a los valores de fábrica" resetea.
7. Notificaciones: 4 categorías × 15 usuarios con los marcados exactos del seed; checkbox secundario deshabilitado si el principal no está marcado; columna de email ausente en "Solicitudes de vacaciones"; bloque de 11 notificaciones personales listado tal cual (no configurable).
8. Comisiones de bookers: global 25%, ventana/radio/salto 30/100/600, 15 bookers a 25% con `(global 25%)`. Control de comisiones: 3 totales en 0,00 € y estado vacío "Aún no hay comisiones devengadas ni abonos.".
9. Contratos: exactamente 2 plantillas (ES/EN) con sus descripciones; "+ Nueva plantilla" y "Editar"/"✕" inertes.
10. Alertas de eventos: 5 reglas con D-21/14/10/7/3 y severidades Info/Aviso/Crítica/Aviso/Aviso; solo "Contrato sin subir" con email activado; toggles/inputs funcionales in-memory.
11. RRHH: valores exactos (31.5/21/160, 21/15, "60,30,15"/"15,7"/"30", cumpleaños activado) y 12 departamentos con sus colores; alta/baja de departamento funcional in-memory.
12. Festivos: 23 fechas 2026–2027 con ámbito y color de chip correctos, agrupadas por año; checkbox "Ver también los festivos pasados" filtra; alta/baja inline funcional in-memory; acordeón de importación colapsado e inerte.
13. Ningún botón de guardar/crear/eliminar del módulo hace una llamada real; todo es estado de React sin persistencia.
14. Suite verde, lint `--max-warnings 0`, `tsc` limpio (ES2020, sin `Array.prototype.at()`), sin clases `brand-*` en los grises/negros del módulo; reusa `StatCard`, `SegmentedControl` (extendido con `tone`), `formatCurrency`, `RichTextEditor`, `Avatar`, `Button`/`Card`/`Input`/`Select` — cero primitivos duplicados.
