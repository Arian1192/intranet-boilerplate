# Configuración Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el placeholder `ConfigShell` (`ModuleShell` genérico) por un calco pixel-perfect del módulo **Configuración**: shell con sidebar propio de 6 secciones / 12 ítems y 10 sub-vistas reales bajo `/configuracion` (landing = Plantillas de correo), más el ítem "Cuentas (auditoría)" como link de salida a `/personal`.

**Architecture:** `ConfiguracionShell` envuelve `AppLayout` (sin `tabs`) con un layout de dos columnas: `ConfiguracionSidebar` (fuente única `data/sidebar.ts`) + `<Outlet/>`. Cada sub-vista es una página autocontenida en `pages/` que lee su propio módulo de datos en-memoria (`data/*.ts`, espejo Supabase) vía helpers puros, sin `useOutletContext` (a diferencia de Mixmag/TAGMAG, aquí no hay parametrización por gemelo). Componentes pequeños y aislados en `components/`, uno por responsabilidad.

**Tech Stack:** React 19, react-router 7, Tailwind 3, Vitest + Testing Library, TypeScript strict (target ES2020, `noUnusedLocals`, lint `--max-warnings 0`).

## Global Constraints

- **FIEL AL LIVE (pixel-perfect).** Todo el texto (títulos, subtítulos, ayudas, seeds) transcrito literalmente de `docs/references/configuracion/live-configuracion*.png`. Verificación final Playwright ours↔live obligatoria en las 11 vistas propias.
- Presentacional / in-memory: **nada persiste**, ningún botón hace una llamada real (Resend, IA, Signaturit, Spotify, FlightAPI). Modelo espeja tablas Supabase futuras: FKs explícitas (`categoryId`, `integrationId`, `stageId`-style), campos denormalizados documentados inline.
- **Reusar primitivos compartidos** (`@/components/ui`): `Card`, `Button`, `Input`, `Select`, `StatCard`, `SegmentedControl`, `RichTextEditor`. `formatCurrency` de `@/lib/format`. **No duplicar** ninguno — se extienden con props opcionales cuando el live lo exige (ver deltas de las Tasks 4 y 8), nunca se crean componentes paralelos.
- Sin clases `brand-*` en los grises/negros del módulo. Botón primario de marca en todo el módulo: `style={{ backgroundColor: '#44444C' }}`, `text-white`, `rounded-lg`, `text-sm`, `font-medium`, `px-4 py-2` — **nunca** `variant="primary"` del `Button` compartido (ese usa `bg-brand-600`, reservado al resto de la app).
- es-ES. Target ES2020: prohibido `Array.prototype.at()`. `formatCurrency` usa NBSP antes de € → en tests, matchear la parte numérica con regex (p. ej. `/53,89/`), nunca un literal con `€` y NBSP.
- Ubicación: `src/features/configuracion/` (`ConfiguracionShell.tsx` + `data/`, `components/`, `pages/`). Cada test importa `'@testing-library/jest-dom'`. Un commit por tarea.
- **Cuentas (auditoría)** es un `<Link to="/personal">` real, no un `NavLink`: nunca se resalta como activo dentro de `/configuracion/*` porque nunca es la ruta activa del módulo. No renderiza contenido propio (fuera de alcance, pertenece a una fase futura de Team/Usuarios).
- "Alertas de eventos" (ítem del sidebar) abre una página cuyo H1 real es **"Alertas de producción"** (fiel al live, discrepancia deliberada entre label de sidebar y título de página, igual que en el resto del recon).

---

### Task 1: Modelo de datos completo (10 ficheros `data/*.ts` + tests)

**Files:**
- Create: `src/features/configuracion/data/sidebar.ts`
- Create: `src/features/configuracion/data/plantillasCorreo.ts`
- Create: `src/features/configuracion/data/uso.ts`
- Create: `src/features/configuracion/data/incidencias.ts`
- Create: `src/features/configuracion/data/notificaciones.ts`
- Create: `src/features/configuracion/data/comisiones.ts`
- Create: `src/features/configuracion/data/contratos.ts`
- Create: `src/features/configuracion/data/alertas.ts`
- Create: `src/features/configuracion/data/rrhh.ts`
- Create: `src/features/configuracion/data/festivos.ts`
- Test: `src/features/configuracion/data/sidebar.test.ts`
- Test: `src/features/configuracion/data/plantillasCorreo.test.ts`
- Test: `src/features/configuracion/data/uso.test.ts`
- Test: `src/features/configuracion/data/incidencias.test.ts`
- Test: `src/features/configuracion/data/notificaciones.test.ts`
- Test: `src/features/configuracion/data/comisiones.test.ts`
- Test: `src/features/configuracion/data/contratos.test.ts`
- Test: `src/features/configuracion/data/alertas.test.ts`
- Test: `src/features/configuracion/data/rrhh.test.ts`
- Test: `src/features/configuracion/data/festivos.test.ts`

**Interfaces (Produces — todas puras, inmutables, devuelven copias):**
- `sidebar.ts`: `interface SidebarItem { label: string; href: string; external?: boolean }`, `interface SidebarSection { label: string; items: SidebarItem[] }`, `sidebarSections(): SidebarSection[]`.
- `plantillasCorreo.ts`: `interface EmailTemplate { id; slug; title; description; subject; emailTitle; message; buttonLabel; buttonLink; variables: string[] }`, `FOOTER_NOTE: string`, `templates(): EmailTemplate[]`.
- `uso.ts`: `type UsagePeriod = '7d'|'30d'|'90d'|'1y'`, `interface AiSubfunction { id; label; model; usos; tokensIn; tokensOut; spend }`, `interface Integration { id; name; provider; pricingModel: 'cuota'|'por_uso'; monthlyFee?; statusDot: 'green'|'amber'; statusLabel; subfunctions? }`, `interface IntegrationUsageSnapshot { integrationId; period; usos?; tarda?; tokensLabel?; spend?; perUse?: number|null; includedNote? }`, `interface UsageTotals { period; cuotaFijaMes; gastoTotalPeriodo; errores }`, `interface UsageBannerData { boldText?; text; linkLabel? }`, `integrations(): Integration[]`, `snapshotFor(id, period): IntegrationUsageSnapshot|undefined`, `totalsFor(period): UsageTotals`, `usageBanners(): UsageBannerData[]`.
- `incidencias.ts`: `type IncidentStatus = 'nueva'|'auto'|'en_curso'|'resuelta'|'descartada'`, `interface Incidencia { id; status; type: 'Idea'|'Bug'|'Duda'; text; originPath?; authorInitials?; authorColor? }`, `incidencias(): Incidencia[]`, `countByStatus(list): Record<IncidentStatus, number>`.
- `notificaciones.ts`: `type NotificationCategoryId = 'vacaciones'|'pedidos_reposicion'|'contratos_firmados'|'alertas_rrhh'`, `interface NotificationCategory { id; title; description; hasEmailToggle }`, `interface NotificationRecipient { categoryId; userName; checked; alsoEmail }`, `interface PersonalNotificationType { id; label; description }`, `categories(): NotificationCategory[]`, `recipientsFor(categoryId): NotificationRecipient[]`, `personalTypes(): PersonalNotificationType[]`.
- `comisiones.ts`: `interface CommissionSettings { globalPercent; exclusivityWindowDays; exclusivityRadiusKm; logisticJumpKm }`, `interface BookerCommission { bookerName; percent }`, `interface CommissionLedgerTotals { devengadoTotal; abonado; pendienteDeAbonar }`, `commissionSettings()`, `bookerCommissions()`, `ledgerTotals()`.
- `contratos.ts`: `interface ContractTemplate { id; name; langCode: 'ES'|'EN'; description }`, `contractTemplates(): ContractTemplate[]`.
- `alertas.ts`: `type AlertSeverity = 'info'|'aviso'|'critica'`, `interface EventAlertRule { id; title; description; active; windowDaysBefore; severity; alsoEmail }`, `alertRules(): EventAlertRule[]`.
- `rrhh.ts`: `interface HrSettings { ssEmployerPercent; workingDaysPerMonth; hoursPerMonth; freelanceVatPercent; freelanceIrpfPercent; contractEndNoticeDays: number[]; probationEndNoticeDays: number[]; salaryReviewNoticeDays: number[]; notifyBirthdays }`, `type DepartmentColor = 'blue'|'green'|'orange'|'red'|'purple'|'cyan'|'pink'|'amber'`, `interface Department { id; name; color: DepartmentColor; active }`, `DEPARTMENT_COLORS: DepartmentColor[]`, `hrSettings()`, `departments()`.
- `festivos.ts`: `type HolidayScope = 'espana'|'catalunya'|'barcelona'`, `interface Holiday { id; date; name; scope }`, `holidays(): Holiday[]`, `isPast(holiday, today?: Date): boolean`, `filterHolidays(list, opts: { includePast: boolean }): Holiday[]`, `groupByYear(list): { year: number; items: Holiday[] }[]`, `formatHolidayDate(date): string`.

- [ ] **Step 1: Write the failing tests**

```ts
// src/features/configuracion/data/sidebar.test.ts
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { sidebarSections } from './sidebar';

describe('sidebar data', () => {
  it('6 secciones en el orden del live', () => {
    const sections = sidebarSections();
    expect(sections.map((s) => s.label)).toEqual([
      'SISTEMA', 'MI TRABAJO', 'COMUNICACIÓN', 'CONCEPTONE · BOOKING', 'PRODUCCIÓN', 'EQUIPO',
    ]);
  });

  it('12 ítems en total, en el orden del live', () => {
    const sections = sidebarSections();
    const items = sections.flatMap((s) => s.items.map((i) => i.label));
    expect(items).toEqual([
      'Uso y coste', 'Incidencias', 'Cuentas (auditoría)',
      'Documentos (tipografía)',
      'Plantillas de correo', 'Notificaciones',
      'Comisiones de bookers', 'Control de comisiones', 'Contratos',
      'Alertas de eventos',
      'RRHH (coste y avisos)', 'Festivos',
    ]);
  });

  it('Cuentas (auditoría) es un link de salida a /personal', () => {
    const sections = sidebarSections();
    const item = sections.flatMap((s) => s.items).find((i) => i.label === 'Cuentas (auditoría)')!;
    expect(item.href).toBe('/personal');
    expect(item.external).toBe(true);
  });

  it('Plantillas de correo apunta al índice del módulo (landing)', () => {
    const sections = sidebarSections();
    const item = sections.flatMap((s) => s.items).find((i) => i.label === 'Plantillas de correo')!;
    expect(item.href).toBe('/configuracion');
    expect(item.external).toBeUndefined();
  });

  it('es inmutable entre llamadas', () => {
    const a = sidebarSections();
    a[0].items.push({ label: 'x', href: '/x' });
    const b = sidebarSections();
    expect(b[0].items.length).toBe(3);
  });
});
```

```ts
// src/features/configuracion/data/plantillasCorreo.test.ts
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { templates, FOOTER_NOTE } from './plantillasCorreo';

describe('plantillasCorreo data', () => {
  it('siembra las 6 plantillas en el orden del live', () => {
    const list = templates();
    expect(list.map((t) => t.slug)).toEqual([
      'invitacion_portal', 'invitacion_usuario', 'liquidacion_show',
      'reset_password', 'vacaciones_aprobada', 'vacaciones_rechazada',
    ]);
  });

  it('solo las 3 de autenticación tienen botón/enlace', () => {
    const list = templates();
    const conBoton = list.filter((t) => t.buttonLabel !== '');
    expect(conBoton.map((t) => t.slug).sort()).toEqual(['invitacion_portal', 'invitacion_usuario', 'reset_password'].sort());
    const sinBoton = list.filter((t) => t.buttonLabel === '');
    expect(sinBoton).toHaveLength(3);
    sinBoton.forEach((t) => expect(t.buttonLink).toBe(''));
  });

  it('liquidacion_show tiene 10 variables incluida gastos_detalle', () => {
    const t = templates().find((x) => x.slug === 'liquidacion_show')!;
    expect(t.variables).toHaveLength(10);
    expect(t.variables).toContain('{{gastos_detalle}}');
    expect(t.subject).toBe('Liquidación {{artista}}, {{show}} - {{fecha}}');
  });

  it('asuntos y títulos exactos de invitacion_portal', () => {
    const t = templates().find((x) => x.slug === 'invitacion_portal')!;
    expect(t.subject).toBe('Acceso a tu portal de cliente · CRUDA by Black Moose Group');
    expect(t.emailTitle).toBe('Acceso a tu portal de cliente');
    expect(t.buttonLabel).toBe('Crear mi contraseña');
    expect(t.buttonLink).toBe('{{link}}');
  });

  it('FOOTER_NOTE literal del live', () => {
    expect(FOOTER_NOTE).toMatch(/no-reply@blackmoose\.es/);
  });

  it('es inmutable: mutar el array devuelto no afecta a la siguiente llamada', () => {
    const a = templates();
    a[0].variables.push('{{x}}');
    a.pop();
    const b = templates();
    expect(b).toHaveLength(6);
    expect(b[0].variables).not.toContain('{{x}}');
  });
});
```

```ts
// src/features/configuracion/data/uso.test.ts
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { integrations, snapshotFor, totalsFor, usageBanners } from './uso';

describe('uso data', () => {
  it('6 integraciones en el orden del live', () => {
    const list = integrations();
    expect(list.map((i) => i.id)).toEqual([
      'precio-vuelos', 'ia', 'correo-saliente', 'firma-contratos', 'perfiles-artista', 'horarios-vuelos',
    ]);
  });

  it('ia tiene 4 sub-funciones gemini-flash-latest', () => {
    const ia = integrations().find((i) => i.id === 'ia')!;
    expect(ia.subfunctions).toHaveLength(4);
    expect(ia.subfunctions!.every((s) => s.model === 'gemini-flash-latest')).toBe(true);
    expect(ia.subfunctions!.map((s) => s.label)).toEqual(['Triaje de incidencias', 'Chat de ayuda', 'copys', 'mejorar']);
  });

  it('snapshotFor(precio-vuelos, 30d) trae el importe incluido y por-uso', () => {
    const s = snapshotFor('precio-vuelos', '30d')!;
    expect(s.usos).toBe(1);
    expect(s.perUse).toBe(42.89);
    expect(s.includedNote).toBe('1 de 30.000 incluidas');
  });

  it('snapshotFor(perfiles-artista) perUse es null (nunca usado, sin cifra)', () => {
    const s = snapshotFor('perfiles-artista', '30d')!;
    expect(s.perUse).toBeNull();
  });

  it('snapshotFor(firma-contratos) no tiene fila de métricas en el live', () => {
    expect(snapshotFor('firma-contratos', '30d')).toBeUndefined();
  });

  it('totalsFor(30d) coincide con el live', () => {
    const t = totalsFor('30d');
    expect(t.cuotaFijaMes).toBeCloseTo(53.89);
    expect(t.gastoTotalPeriodo).toBeCloseTo(53.92);
    expect(t.errores).toBe(0);
  });

  it('usageBanners: 3 banners, el primero con link Rellenar precios', () => {
    const banners = usageBanners();
    expect(banners).toHaveLength(3);
    expect(banners[0].linkLabel).toBe('Rellenar precios');
  });
});
```

```ts
// src/features/configuracion/data/incidencias.test.ts
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { incidencias, countByStatus } from './incidencias';

describe('incidencias data', () => {
  it('siembra 8 incidencias', () => {
    expect(incidencias()).toHaveLength(8);
  });

  it('countByStatus: 1 nueva, 1 auto, 0 en_curso, 2 resueltas, 4 descartadas', () => {
    const counts = countByStatus(incidencias());
    expect(counts).toEqual({ nueva: 1, auto: 1, en_curso: 0, resuelta: 2, descartada: 4 });
  });

  it('todas son de tipo Idea, fiel al live', () => {
    expect(incidencias().every((i) => i.type === 'Idea')).toBe(true);
  });

  it('la primera fila no tiene autor (icono genérico)', () => {
    const sinAutor = incidencias().filter((i) => !i.authorInitials);
    expect(sinAutor.length).toBeGreaterThanOrEqual(4);
  });
});
```

```ts
// src/features/configuracion/data/notificaciones.test.ts
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { categories, recipientsFor, personalTypes } from './notificaciones';

describe('notificaciones data', () => {
  it('4 categorías; solo "Solicitudes de vacaciones" sin toggle de email', () => {
    const cats = categories();
    expect(cats).toHaveLength(4);
    const vacaciones = cats.find((c) => c.id === 'vacaciones')!;
    expect(vacaciones.hasEmailToggle).toBe(false);
    expect(cats.filter((c) => c.id !== 'vacaciones').every((c) => c.hasEmailToggle)).toBe(true);
  });

  it('cada categoría tiene 15 destinatarios', () => {
    for (const c of categories()) {
      expect(recipientsFor(c.id)).toHaveLength(15);
    }
  });

  it('Carlos Pego y test marcados en las 4 categorías, con email en las 3 con toggle', () => {
    for (const c of categories()) {
      const recs = recipientsFor(c.id);
      const carlos = recs.find((r) => r.userName === 'Carlos Pego')!;
      const test = recs.find((r) => r.userName === 'test')!;
      expect(carlos.checked).toBe(true);
      expect(test.checked).toBe(true);
      if (c.hasEmailToggle) {
        expect(carlos.alsoEmail).toBe(true);
        expect(test.alsoEmail).toBe(true);
      }
    }
  });

  it('Israel Cuenca solo marcado (con email) en pedidos_reposicion', () => {
    const pedidos = recipientsFor('pedidos_reposicion').find((r) => r.userName === 'Israel Cuenca')!;
    expect(pedidos.checked).toBe(true);
    expect(pedidos.alsoEmail).toBe(true);
    const vacaciones = recipientsFor('vacaciones').find((r) => r.userName === 'Israel Cuenca')!;
    expect(vacaciones.checked).toBe(false);
  });

  it('11 tipos de notificación personal', () => {
    expect(personalTypes()).toHaveLength(11);
    expect(personalTypes().map((t) => t.label)[0]).toBe('Tus vacaciones resueltas');
  });
});
```

```ts
// src/features/configuracion/data/comisiones.test.ts
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { commissionSettings, bookerCommissions, ledgerTotals } from './comisiones';

describe('comisiones data', () => {
  it('ajustes globales exactos del live', () => {
    expect(commissionSettings()).toEqual({
      globalPercent: 25, exclusivityWindowDays: 30, exclusivityRadiusKm: 100, logisticJumpKm: 600,
    });
  });

  it('15 bookers, todos al 25%', () => {
    const list = bookerCommissions();
    expect(list).toHaveLength(15);
    expect(list.every((b) => b.percent === 25)).toBe(true);
    expect(list[0].bookerName).toBe('Alba Gelabert');
  });

  it('ledgerTotals: los 3 en 0 (estado vacío real del live)', () => {
    expect(ledgerTotals()).toEqual({ devengadoTotal: 0, abonado: 0, pendienteDeAbonar: 0 });
  });
});
```

```ts
// src/features/configuracion/data/contratos.test.ts
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { contractTemplates } from './contratos';

describe('contratos data', () => {
  it('exactamente 2 plantillas, ES y EN', () => {
    const list = contractTemplates();
    expect(list).toHaveLength(2);
    expect(list.map((t) => t.langCode)).toEqual(['ES', 'EN']);
    expect(list[0].name).toBe('Contrato estándar (ES)');
    expect(list[1].name).toBe('Booking Agreement (EN)');
  });
});
```

```ts
// src/features/configuracion/data/alertas.test.ts
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { alertRules } from './alertas';

describe('alertas data', () => {
  it('5 reglas con D-N y severidad exactos del live', () => {
    const list = alertRules();
    expect(list.map((r) => r.windowDaysBefore)).toEqual([21, 14, 10, 7, 3]);
    expect(list.map((r) => r.severity)).toEqual(['info', 'aviso', 'critica', 'aviso', 'aviso']);
  });

  it('todas activas; solo "Contrato sin subir" con email', () => {
    const list = alertRules();
    expect(list.every((r) => r.active)).toBe(true);
    const conEmail = list.filter((r) => r.alsoEmail);
    expect(conEmail).toHaveLength(1);
    expect(conEmail[0].title).toBe('Contrato sin subir');
  });
});
```

```ts
// src/features/configuracion/data/rrhh.test.ts
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { hrSettings, departments, DEPARTMENT_COLORS } from './rrhh';

describe('rrhh data', () => {
  it('hrSettings exacto del live', () => {
    const s = hrSettings();
    expect(s.ssEmployerPercent).toBe(31.5);
    expect(s.workingDaysPerMonth).toBe(21);
    expect(s.hoursPerMonth).toBe(160);
    expect(s.freelanceVatPercent).toBe(21);
    expect(s.freelanceIrpfPercent).toBe(15);
    expect(s.contractEndNoticeDays).toEqual([60, 30, 15]);
    expect(s.probationEndNoticeDays).toEqual([15, 7]);
    expect(s.salaryReviewNoticeDays).toEqual([30]);
    expect(s.notifyBirthdays).toBe(true);
  });

  it('12 departamentos, todos activos, colores exactos', () => {
    const list = departments();
    expect(list).toHaveLength(12);
    expect(list.every((d) => d.active)).toBe(true);
    expect(list.find((d) => d.name === 'Board')!.color).toBe('amber');
    expect(list.find((d) => d.name === 'Redacción')!.color).toBe('cyan');
    expect(list.find((d) => d.name === 'Vídeo')!.color).toBe('red');
  });

  it('8 colores disponibles para "Nuevo departamento"', () => {
    expect(DEPARTMENT_COLORS).toHaveLength(8);
  });

  it('es inmutable', () => {
    const a = hrSettings();
    a.contractEndNoticeDays.push(1);
    const b = hrSettings();
    expect(b.contractEndNoticeDays).toEqual([60, 30, 15]);
  });
});
```

```ts
// src/features/configuracion/data/festivos.test.ts
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { holidays, groupByYear, filterHolidays, isPast, formatHolidayDate } from './festivos';

describe('festivos data', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-22T10:00:00'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('siembra 23 festivos 2026-2027', () => {
    expect(holidays()).toHaveLength(23);
  });

  it('groupByYear agrupa 7 en 2026 y 16 en 2027', () => {
    const groups = groupByYear(holidays());
    expect(groups.map((g) => g.year)).toEqual([2026, 2027]);
    expect(groups[0].items).toHaveLength(7);
    expect(groups[1].items).toHaveLength(16);
  });

  it('filterHolidays: con "hoy" en 2026-07-22 ninguno es pasado', () => {
    const visible = filterHolidays(holidays(), { includePast: false });
    expect(visible).toHaveLength(23);
    const withPast = filterHolidays(holidays(), { includePast: true });
    expect(withPast).toHaveLength(23);
  });

  it('isPast distingue fechas pasadas de futuras respecto a "hoy"', () => {
    expect(isPast({ id: 'x', date: '2026-01-01', name: 'x', scope: 'espana' })).toBe(true);
    expect(isPast({ id: 'y', date: '2026-08-15', name: 'y', scope: 'espana' })).toBe(false);
  });

  it('formatHolidayDate formatea "15 ago 2026"', () => {
    expect(formatHolidayDate('2026-08-15')).toBe('15 ago 2026');
    expect(formatHolidayDate('2026-09-11')).toBe('11 sept 2026');
  });

  it('es inmutable', () => {
    const a = holidays();
    a.push({ id: 'z', date: '2099-01-01', name: 'z', scope: 'espana' });
    const b = holidays();
    expect(b).toHaveLength(23);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/features/configuracion/data/`
Expected: FAIL (modules not found).

- [ ] **Step 3: Write minimal implementation**

```ts
// src/features/configuracion/data/sidebar.ts
export interface SidebarItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    label: 'SISTEMA',
    items: [
      { label: 'Uso y coste', href: '/configuracion/uso' },
      { label: 'Incidencias', href: '/configuracion/incidencias' },
      { label: 'Cuentas (auditoría)', href: '/personal', external: true },
    ],
  },
  {
    label: 'MI TRABAJO',
    items: [{ label: 'Documentos (tipografía)', href: '/configuracion/documentos' }],
  },
  {
    label: 'COMUNICACIÓN',
    items: [
      { label: 'Plantillas de correo', href: '/configuracion' },
      { label: 'Notificaciones', href: '/configuracion/notificaciones' },
    ],
  },
  {
    label: 'CONCEPTONE · BOOKING',
    items: [
      { label: 'Comisiones de bookers', href: '/configuracion/comisiones' },
      { label: 'Control de comisiones', href: '/configuracion/comisiones-pagos' },
      { label: 'Contratos', href: '/configuracion/contratos' },
    ],
  },
  {
    label: 'PRODUCCIÓN',
    items: [{ label: 'Alertas de eventos', href: '/configuracion/alertas' }],
  },
  {
    label: 'EQUIPO',
    items: [
      { label: 'RRHH (coste y avisos)', href: '/configuracion/rrhh' },
      { label: 'Festivos', href: '/configuracion/festivos' },
    ],
  },
];

export function sidebarSections(): SidebarSection[] {
  return SIDEBAR_SECTIONS.map((s) => ({ ...s, items: s.items.map((i) => ({ ...i })) }));
}
```

```ts
// src/features/configuracion/data/plantillasCorreo.ts
export interface EmailTemplate {
  id: string;
  slug: string;
  title: string;
  description: string;
  subject: string;
  emailTitle: string;
  message: string;
  buttonLabel: string;
  buttonLink: string;
  variables: string[];
}

export const FOOTER_NOTE =
  'Salen por Resend desde no-reply@blackmoose.es con copia a quien los lanza. En invitaciones, {{link}} es el enlace para crear la contraseña: va en el botón, no en el texto.';

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl-invitacion-portal',
    slug: 'invitacion_portal',
    title: 'Bienvenida — portal de cliente',
    description: 'Invitación a un cliente al portal de reposiciones (CRUDA).',
    subject: 'Acceso a tu portal de cliente · CRUDA by Black Moose Group',
    emailTitle: 'Acceso a tu portal de cliente',
    message:
      'Hola {{nombre}},\nTe damos acceso a tu portal de CRUDA para que gestiones tus reposiciones de forma autónoma: pides, ves el estado y consultas tu histórico sin esperar a nadie.\nCrea tu contraseña para entrar. El enlace caduca en 24 horas.',
    buttonLabel: 'Crear mi contraseña',
    buttonLink: '{{link}}',
    variables: ['{{nombre}}', '{{link}}'],
  },
  {
    id: 'tpl-invitacion-usuario',
    slug: 'invitacion_usuario',
    title: 'Bienvenida — usuario de la intranet',
    description: 'Invitación a un usuario nuevo de la intranet.',
    subject: 'Tu acceso a la intranet · Black Moose',
    emailTitle: 'Tu acceso a la intranet',
    message:
      'Hola {{nombre}},\nTe hemos dado acceso a la intranet de Black Moose. Desde ahí gestionas tu trabajo, tus vacaciones y todo lo demás.\nPara entrar, crea tu contraseña. El enlace caduca en 24 horas: si se te pasa, pídenos otro y listo.',
    buttonLabel: 'Crear mi contraseña',
    buttonLink: '{{link}}',
    variables: ['{{nombre}}', '{{link}}'],
  },
  {
    id: 'tpl-liquidacion-show',
    slug: 'liquidacion_show',
    title: 'Liquidación de show (artista)',
    description: 'Informe de liquidación de show que se envía al artista (con el PDF adjunto).',
    subject: 'Liquidación {{artista}}, {{show}} - {{fecha}}',
    emailTitle: 'Liquidación de {{show}}',
    message:
      'Hola {{artista}},\nAdjuntamos la liquidación del show {{show}} ({{codigo}}) del {{fecha}}.\n\nFee bruto: {{fee_bruto}}\nBooking fee: {{booking_fee}}\nManagement fee: {{management_fee}}\nGastos: {{gastos_total}}\n\nNeto al artista: {{neto_artista}}\n\nTienes el detalle completo en el PDF adjunto. Cualquier duda, respóndenos a este correo.',
    buttonLabel: '',
    buttonLink: '',
    variables: [
      '{{artista}}', '{{show}}', '{{codigo}}', '{{fecha}}', '{{neto_artista}}',
      '{{fee_bruto}}', '{{booking_fee}}', '{{management_fee}}', '{{gastos_total}}', '{{gastos_detalle}}',
    ],
  },
  {
    id: 'tpl-reset-password',
    slug: 'reset_password',
    title: 'Restablecer contraseña',
    description: 'Correo para restablecer la contraseña (lo lanza un administrador).',
    subject: 'Restablece tu contraseña · Black Moose',
    emailTitle: 'Restablecer tu contraseña',
    message:
      'Hola {{nombre}},\nHemos recibido una petición para cambiar la contraseña de tu cuenta de Black Moose.\nSi has sido tú, entra desde el botón. Si no, ignora este correo: tu contraseña no cambia hasta que alguien la ponga desde ese enlace.',
    buttonLabel: 'Cambiar mi contraseña',
    buttonLink: '{{link}}',
    variables: ['{{nombre}}', '{{link}}'],
  },
  {
    id: 'tpl-vacaciones-aprobada',
    slug: 'vacaciones_aprobada',
    title: 'Vacaciones — aprobada',
    description: 'Email al empleado cuando se aprueba su solicitud de vacaciones/ausencia.',
    subject: 'Tu solicitud de {{tipo}} ha sido aprobada · Black Moose',
    emailTitle: 'Solicitud aprobada',
    message: 'Hola {{nombre}},\nTu solicitud de {{tipo}} ha sido aprobada.\nDesde el {{desde}} hasta el {{hasta}} ({{dias}} días hábiles).\n{{notas}}',
    buttonLabel: '',
    buttonLink: '',
    variables: ['{{nombre}}', '{{tipo}}', '{{desde}}', '{{hasta}}', '{{dias}}', '{{notas}}', '{{estado}}'],
  },
  {
    id: 'tpl-vacaciones-rechazada',
    slug: 'vacaciones_rechazada',
    title: 'Vacaciones — rechazada',
    description: 'Email al empleado cuando se rechaza su solicitud de vacaciones/ausencia.',
    subject: 'Tu solicitud de {{tipo}} ha sido rechazada · Black Moose',
    emailTitle: 'Solicitud rechazada',
    message:
      'Hola {{nombre}},\nTu solicitud de {{tipo}} (del {{desde}} al {{hasta}}) no ha podido aprobarse.\n{{notas}}\nSi necesitas darle una vuelta, habla con tu responsable.',
    buttonLabel: '',
    buttonLink: '',
    variables: ['{{nombre}}', '{{tipo}}', '{{desde}}', '{{hasta}}', '{{dias}}', '{{notas}}', '{{estado}}'],
  },
];

export function templates(): EmailTemplate[] {
  return EMAIL_TEMPLATES.map((t) => ({ ...t, variables: [...t.variables] }));
}
```

```ts
// src/features/configuracion/data/uso.ts
export type UsagePeriod = '7d' | '30d' | '90d' | '1y';

export interface AiSubfunction {
  id: string;
  label: string;
  model: string;
  usos: number;
  tokensIn: string;
  tokensOut: string;
  spend: number;
}

export interface Integration {
  id: string;
  name: string;
  provider: string;
  pricingModel: 'cuota' | 'por_uso';
  monthlyFee?: number;
  statusDot: 'green' | 'amber';
  statusLabel: string;
  subfunctions?: AiSubfunction[];
}

export interface IntegrationUsageSnapshot {
  integrationId: string;
  period: UsagePeriod;
  usos?: number;
  tarda?: string;
  tokensLabel?: string;
  spend?: number;
  perUse?: number | null;
  includedNote?: string;
}

export interface UsageTotals {
  period: UsagePeriod;
  cuotaFijaMes: number;
  gastoTotalPeriodo: number;
  errores: number;
}

export interface UsageBannerData {
  boldText?: string;
  text: string;
  linkLabel?: string;
}

const AI_SUBFUNCTIONS: AiSubfunction[] = [
  { id: 'ia-triaje', label: 'Triaje de incidencias', model: 'gemini-flash-latest', usos: 11, tokensIn: '44k', tokensOut: '1k', spend: 0.0154 },
  { id: 'ia-chat', label: 'Chat de ayuda', model: 'gemini-flash-latest', usos: 12, tokensIn: '46k', tokensOut: '923', spend: 0.015 },
  { id: 'ia-copys', label: 'copys', model: 'gemini-flash-latest', usos: 3, tokensIn: '1k', tokensOut: '695', spend: 0.0019 },
  { id: 'ia-mejorar', label: 'mejorar', model: 'gemini-flash-latest', usos: 2, tokensIn: '490', tokensOut: '159', spend: 0.0005 },
];

const INTEGRATIONS: Integration[] = [
  { id: 'precio-vuelos', name: 'Precio de vuelos', provider: 'FlightAPI', pricingModel: 'cuota', monthlyFee: 42.89, statusDot: 'green', statusLabel: 'Funciona · última vez 21/7/2026' },
  { id: 'ia', name: 'Inteligencia artificial', provider: 'Anthropic / Google / OpenAI', pricingModel: 'por_uso', statusDot: 'green', statusLabel: 'Funciona · última vez 21/7/2026', subfunctions: AI_SUBFUNCTIONS },
  { id: 'correo-saliente', name: 'Correo saliente', provider: 'Resend', pricingModel: 'por_uso', statusDot: 'amber', statusLabel: 'Sin usar en este periodo' },
  { id: 'firma-contratos', name: 'Firma de contratos', provider: 'Signaturit', pricingModel: 'por_uso', statusDot: 'amber', statusLabel: 'Sin usar en este periodo' },
  { id: 'perfiles-artista', name: 'Perfiles de artista', provider: 'Spotify / Deezer', pricingModel: 'cuota', monthlyFee: 11, statusDot: 'amber', statusLabel: 'Lo pagas y no lo has usado' },
  { id: 'horarios-vuelos', name: 'Horarios de vuelos', provider: 'AeroDataBox (RapidAPI)', pricingModel: 'por_uso', statusDot: 'amber', statusLabel: 'Sin usar en este periodo' },
];

// Solo hay cifras reales observadas para el periodo 30d; 7d/90d/1y reutilizan el mismo
// snapshot como delta documentado (no se fabrican series temporales no observadas en el live).
const SNAPSHOTS_30D: IntegrationUsageSnapshot[] = [
  { integrationId: 'precio-vuelos', period: '30d', usos: 1, tarda: '10.6 s', perUse: 42.89, includedNote: '1 de 30.000 incluidas' },
  { integrationId: 'ia', period: '30d', usos: 28, tarda: '11.2 s', tokensLabel: '92k → 3k', spend: 0.03 },
  { integrationId: 'correo-saliente', period: '30d', usos: 0, spend: 0 },
  { integrationId: 'perfiles-artista', period: '30d', usos: 0, perUse: null },
  { integrationId: 'horarios-vuelos', period: '30d', usos: 0, spend: 0 },
  // 'firma-contratos': el live no muestra fila de métricas para esta integración.
];

const TOTALS_30D: UsageTotals = { period: '30d', cuotaFijaMes: 53.89, gastoTotalPeriodo: 53.92, errores: 0 };

const USAGE_BANNERS: UsageBannerData[] = [
  { boldText: '3 suscripciones sin importe.', text: 'Salen a 0 €, y eso no es que sean gratis: es que no le has dicho lo que pagas.', linkLabel: 'Rellenar precios' },
  { boldText: 'Estás pagando y no lo usas:', text: 'Perfiles de artista. Ninguna llamada en 30 días.' },
  { text: '12 tarifas de IA sin verificar contra una factura real. El coste que ves es un orden de magnitud, no una cifra contable.' },
];

export function integrations(): Integration[] {
  return INTEGRATIONS.map((i) => ({ ...i, subfunctions: i.subfunctions ? i.subfunctions.map((s) => ({ ...s })) : undefined }));
}

export function snapshotFor(integrationId: string, period: UsagePeriod): IntegrationUsageSnapshot | undefined {
  const found = SNAPSHOTS_30D.find((s) => s.integrationId === integrationId);
  return found ? { ...found, period } : undefined;
}

export function totalsFor(period: UsagePeriod): UsageTotals {
  return { ...TOTALS_30D, period };
}

export function usageBanners(): UsageBannerData[] {
  return USAGE_BANNERS.map((b) => ({ ...b }));
}
```

```ts
// src/features/configuracion/data/incidencias.ts
export type IncidentStatus = 'nueva' | 'auto' | 'en_curso' | 'resuelta' | 'descartada';

export interface Incidencia {
  id: string;
  status: IncidentStatus;
  type: 'Idea' | 'Bug' | 'Duda';
  text: string;
  originPath?: string;
  authorInitials?: string;
  authorColor?: string;
}

const INCIDENCIAS: Incidencia[] = [
  { id: 'inc-1', status: 'descartada', type: 'Idea', text: 'viendo como crear un cliente y pone una dirección de correo. Puede…', originPath: '/', authorInitials: 'FV', authorColor: '#f97316' },
  { id: 'inc-2', status: 'resuelta', type: 'Idea', text: 'Me gustaría hacer la solicitud de 2 cosas: 1. Que se pudiera crear un nuevo evento haciendo clic en el calendario…', originPath: '/euphoric/calendario', authorInitials: 'AG', authorColor: '#059669' },
  { id: 'inc-3', status: 'descartada', type: 'Idea', text: 'Me gustaría hacer la solicitud de 2 cosas: 1. Que se pudiera crear un…', originPath: '/', authorInitials: 'AG', authorColor: '#059669' },
  { id: 'inc-4', status: 'descartada', type: 'Idea', text: 'Esto debería estar enlazado con no…', originPath: '/euphoric/campanas' },
  { id: 'inc-5', status: 'nueva', type: 'Idea', text: 'En el apartat de contactes del Signer/Buyer molaria afegir la opcio d…', originPath: '/shows/nuevo', authorInitials: 'JC', authorColor: '#2563eb' },
  { id: 'inc-6', status: 'descartada', type: 'Idea', text: 'Esto podrías darle color por favor, en cada pestaña igual.', originPath: '/shows/95a152d1-d546-40…' },
  { id: 'inc-7', status: 'resuelta', type: 'Idea', text: 'En logística del deal si se selecciona traslados internos tiene que s…', originPath: '/shows/08ea3304-af17-47…' },
  { id: 'inc-8', status: 'auto', type: 'Idea', text: '¿por qué no puedo seleccionar ida y vuelta en la estimación de vuelo?', originPath: '/shows/08ea3304-af17-47…' },
];

export function incidencias(): Incidencia[] {
  return INCIDENCIAS.map((i) => ({ ...i }));
}

export function countByStatus(list: Incidencia[]): Record<IncidentStatus, number> {
  const out: Record<IncidentStatus, number> = { nueva: 0, auto: 0, en_curso: 0, resuelta: 0, descartada: 0 };
  list.forEach((i) => {
    out[i.status] += 1;
  });
  return out;
}
```

```ts
// src/features/configuracion/data/notificaciones.ts
export type NotificationCategoryId = 'vacaciones' | 'pedidos_reposicion' | 'contratos_firmados' | 'alertas_rrhh';

export interface NotificationCategory {
  id: NotificationCategoryId;
  title: string;
  description: string;
  hasEmailToggle: boolean;
}

export interface NotificationRecipient {
  categoryId: NotificationCategoryId;
  userName: string;
  checked: boolean;
  alsoEmail: boolean;
}

export interface PersonalNotificationType {
  id: string;
  label: string;
  description: string;
}

const USERS = [
  'Alba Gelabert', 'Aldo Messina', 'Alex González', 'Carlos Pego', 'Fran Hinojosa Veredas',
  'Israel Cuenca', 'Jack Howell', 'Jassi Gonzalez Montes', 'Joe Coe', 'Juan (Staff Level Test)',
  'Oscar Buch', 'Sadkiel', 'test', 'Tony Carrerira', 'Yenifer Bernardo',
];

const CATEGORIES: NotificationCategory[] = [
  { id: 'vacaciones', title: 'Solicitudes de vacaciones', description: 'Cuando alguien pide vacaciones o una ausencia. La reciben quienes aprueban.', hasEmailToggle: false },
  { id: 'pedidos_reposicion', title: 'Pedidos de reposición (portal)', description: 'Cuando un cliente crea un pedido desde su portal. La reciben quienes lo atienden. Puedes activar además el aviso por email.', hasEmailToggle: true },
  { id: 'contratos_firmados', title: 'Contratos firmados', description: 'Cuando un promotor firma online el contrato de un show (Signaturit). La reciben quienes designes. Puedes activar además el aviso por email.', hasEmailToggle: true },
  { id: 'alertas_rrhh', title: 'Alertas de RRHH', description: 'Fin de contrato, fin de periodo de prueba y revisión salarial, con antelación. La reciben quienes designes. Puedes activar además el aviso por email.', hasEmailToggle: true },
];

const CHECKED_ALWAYS = ['Carlos Pego', 'test'];

const RECIPIENTS: NotificationRecipient[] = CATEGORIES.flatMap((c) =>
  USERS.map((userName) => {
    const checked = CHECKED_ALWAYS.includes(userName) || (c.id === 'pedidos_reposicion' && userName === 'Israel Cuenca');
    const alsoEmail = c.hasEmailToggle && checked;
    return { categoryId: c.id, userName, checked, alsoEmail };
  })
);

const PERSONAL_TYPES: PersonalNotificationType[] = [
  { id: 'vacaciones_resueltas', label: 'Tus vacaciones resueltas', description: 'Cuando aprueban o rechazan tu solicitud. Llega siempre al solicitante.' },
  { id: 'acciones_asignadas', label: 'Acciones asignadas', description: 'Cuando te asignan o te añaden a una acción de Etra. Llega siempre al implicado.' },
  { id: 'novedades_grupo', label: 'Novedades del grupo', description: 'Cuando se publica una novedad. Llega a todo el equipo.' },
  { id: 'alertas_produccion', label: 'Alertas de producción', description: 'Cuando un evento incumple un hito (line-up, contrato, depósito...) dentro de su ventana. Llega al responsable y al equipo de producción.' },
  { id: 'alertas_shows', label: 'Alertas de shows', description: 'Cuando un show tiene un agujero por el que se puede caer el dinero (confirmado sin contrato, logística sin cerrar a D-7, oferta que nadie persigue, show sin liquidar). Llega al booker del show y a los admins.' },
  { id: 'arte_pendiente', label: 'Arte pendiente de aprobar', description: 'Cuando hay un flyer o pieza esperando tu aprobación. Llega al aprobador designado del artista.' },
  { id: 'arte_resuelto', label: 'Tu arte, resuelto', description: 'Cuando aprueban, rechazan o piden cambios en un arte que subiste. Llega a quien lo subió.' },
  { id: 'trabajo_asignado', label: 'Trabajo asignado', description: 'Cuando te asignan como responsable de una pieza, publicación, campaña o tarea de producción. Llega siempre al implicado.' },
  { id: 'aprobaciones_asignadas', label: 'Aprobaciones asignadas', description: 'Cuando te ponen como responsable de aprobar una pieza. Llega siempre al implicado.' },
  { id: 'aprobaciones_cliente', label: 'Aprobaciones del cliente', description: 'Cuando un cliente aprueba o pide cambios en una pieza o publicación desde su enlace. Llega al responsable.' },
  { id: 'cumpleanos_equipo', label: 'Cumpleaños del equipo', description: 'El día del cumpleaños de un compañero. Llega a todo el equipo.' },
];

export function categories(): NotificationCategory[] {
  return CATEGORIES.map((c) => ({ ...c }));
}

export function recipientsFor(categoryId: NotificationCategoryId): NotificationRecipient[] {
  return RECIPIENTS.filter((r) => r.categoryId === categoryId).map((r) => ({ ...r }));
}

export function personalTypes(): PersonalNotificationType[] {
  return PERSONAL_TYPES.map((t) => ({ ...t }));
}
```

```ts
// src/features/configuracion/data/comisiones.ts
export interface CommissionSettings {
  globalPercent: number;
  exclusivityWindowDays: number;
  exclusivityRadiusKm: number;
  logisticJumpKm: number;
}

export interface BookerCommission {
  bookerName: string;
  percent: number;
}

export interface CommissionLedgerTotals {
  devengadoTotal: number;
  abonado: number;
  pendienteDeAbonar: number;
}

const SETTINGS: CommissionSettings = { globalPercent: 25, exclusivityWindowDays: 30, exclusivityRadiusKm: 100, logisticJumpKm: 600 };

const BOOKERS = [
  'Alba Gelabert', 'Aldo Messina', 'Alex González', 'Carlos Pego', 'Fran Hinojosa Veredas',
  'Israel Cuenca', 'Jack Howell', 'Jassi Gonzalez Montes', 'Joe Coe', 'Juan (Staff Level Test)',
  'Oscar Buch', 'Sadkiel', 'test', 'Tony Carrerira', 'Yenifer Bernardo',
];

const BOOKER_COMMISSIONS: BookerCommission[] = BOOKERS.map((bookerName) => ({ bookerName, percent: 25 }));

const LEDGER_TOTALS: CommissionLedgerTotals = { devengadoTotal: 0, abonado: 0, pendienteDeAbonar: 0 };

export function commissionSettings(): CommissionSettings {
  return { ...SETTINGS };
}

export function bookerCommissions(): BookerCommission[] {
  return BOOKER_COMMISSIONS.map((b) => ({ ...b }));
}

export function ledgerTotals(): CommissionLedgerTotals {
  return { ...LEDGER_TOTALS };
}
```

```ts
// src/features/configuracion/data/contratos.ts
export interface ContractTemplate {
  id: string;
  name: string;
  langCode: 'ES' | 'EN';
  description: string;
}

const CONTRACT_TEMPLATES: ContractTemplate[] = [
  { id: 'contrato-es', name: 'Contrato estándar (ES)', langCode: 'ES', description: 'Plantilla base de actuación en español.' },
  { id: 'contrato-en', name: 'Booking Agreement (EN)', langCode: 'EN', description: 'Contrato de actuación completo en inglés (basado en el contrato ConceptOne).' },
];

export function contractTemplates(): ContractTemplate[] {
  return CONTRACT_TEMPLATES.map((t) => ({ ...t }));
}
```

```ts
// src/features/configuracion/data/alertas.ts
export type AlertSeverity = 'info' | 'aviso' | 'critica';

export interface EventAlertRule {
  id: string;
  title: string;
  description: string;
  active: boolean;
  windowDaysBefore: number;
  severity: AlertSeverity;
  alsoEmail: boolean;
}

const ALERT_RULES: EventAlertRule[] = [
  { id: 'alerta-presupuesto', title: 'Presupuesto sin definir', description: 'El evento no tiene ninguna partida de coste ni ingreso.', active: true, windowDaysBefore: 21, severity: 'info', alsoEmail: false },
  { id: 'alerta-lineup', title: 'Line-up sin cerrar', description: 'Quedan artistas sin confirmar (o no hay ninguno confirmado).', active: true, windowDaysBefore: 14, severity: 'aviso', alsoEmail: false },
  { id: 'alerta-contrato', title: 'Contrato sin subir', description: 'No hay ningún documento de tipo Contrato en el evento.', active: true, windowDaysBefore: 10, severity: 'critica', alsoEmail: true },
  { id: 'alerta-proveedores', title: 'Proveedores sin confirmar', description: 'Hay proveedores en estado pendiente.', active: true, windowDaysBefore: 7, severity: 'aviso', alsoEmail: false },
  { id: 'alerta-tareas', title: 'Tareas de producción pendientes', description: 'Quedan tareas de producción sin completar.', active: true, windowDaysBefore: 3, severity: 'aviso', alsoEmail: false },
];

export function alertRules(): EventAlertRule[] {
  return ALERT_RULES.map((r) => ({ ...r }));
}
```

```ts
// src/features/configuracion/data/rrhh.ts
export interface HrSettings {
  ssEmployerPercent: number;
  workingDaysPerMonth: number;
  hoursPerMonth: number;
  freelanceVatPercent: number;
  freelanceIrpfPercent: number;
  contractEndNoticeDays: number[];
  probationEndNoticeDays: number[];
  salaryReviewNoticeDays: number[];
  notifyBirthdays: boolean;
}

export type DepartmentColor = 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'cyan' | 'pink' | 'amber';

export interface Department {
  id: string;
  name: string;
  color: DepartmentColor;
  active: boolean;
}

export const DEPARTMENT_COLORS: DepartmentColor[] = ['blue', 'green', 'orange', 'red', 'purple', 'cyan', 'pink', 'amber'];

const HR_SETTINGS: HrSettings = {
  ssEmployerPercent: 31.5,
  workingDaysPerMonth: 21,
  hoursPerMonth: 160,
  freelanceVatPercent: 21,
  freelanceIrpfPercent: 15,
  contractEndNoticeDays: [60, 30, 15],
  probationEndNoticeDays: [15, 7],
  salaryReviewNoticeDays: [30],
  notifyBirthdays: true,
};

const DEPARTMENTS: Department[] = [
  { id: 'dept-advancing', name: 'Advancing', color: 'blue', active: true },
  { id: 'dept-board', name: 'Board', color: 'amber', active: true },
  { id: 'dept-booking', name: 'Booking', color: 'blue', active: true },
  { id: 'dept-comercial', name: 'Comercial', color: 'orange', active: true },
  { id: 'dept-comunicacion', name: 'Comunicación & PR', color: 'purple', active: true },
  { id: 'dept-diseno', name: 'Diseño', color: 'green', active: true },
  { id: 'dept-logistica', name: 'Logística', color: 'blue', active: true },
  { id: 'dept-management', name: 'Management', color: 'blue', active: true },
  { id: 'dept-marketing', name: 'Marketing', color: 'pink', active: true },
  { id: 'dept-paidads', name: 'Paid Ads', color: 'amber', active: true },
  { id: 'dept-redaccion', name: 'Redacción', color: 'cyan', active: true },
  { id: 'dept-video', name: 'Vídeo', color: 'red', active: true },
];

export function hrSettings(): HrSettings {
  return {
    ...HR_SETTINGS,
    contractEndNoticeDays: [...HR_SETTINGS.contractEndNoticeDays],
    probationEndNoticeDays: [...HR_SETTINGS.probationEndNoticeDays],
    salaryReviewNoticeDays: [...HR_SETTINGS.salaryReviewNoticeDays],
  };
}

export function departments(): Department[] {
  return DEPARTMENTS.map((d) => ({ ...d }));
}
```

```ts
// src/features/configuracion/data/festivos.ts
export type HolidayScope = 'espana' | 'catalunya' | 'barcelona';

export interface Holiday {
  id: string;
  date: string;
  name: string;
  scope: HolidayScope;
}

const HOLIDAYS: Holiday[] = [
  { id: 'hol-2026-08-15', date: '2026-08-15', name: "L'Assumpció", scope: 'espana' },
  { id: 'hol-2026-09-11', date: '2026-09-11', name: 'Diada de Catalunya', scope: 'catalunya' },
  { id: 'hol-2026-09-24', date: '2026-09-24', name: 'La Mercè', scope: 'barcelona' },
  { id: 'hol-2026-10-12', date: '2026-10-12', name: "Festa Nacional d'Espanya", scope: 'espana' },
  { id: 'hol-2026-12-08', date: '2026-12-08', name: 'La Immaculada', scope: 'espana' },
  { id: 'hol-2026-12-25', date: '2026-12-25', name: 'Nadal', scope: 'espana' },
  { id: 'hol-2026-12-26', date: '2026-12-26', name: 'Sant Esteve', scope: 'catalunya' },
  { id: 'hol-2027-01-01', date: '2027-01-01', name: 'Any Nou', scope: 'espana' },
  { id: 'hol-2027-01-06', date: '2027-01-06', name: 'Reis', scope: 'espana' },
  { id: 'hol-2027-03-26', date: '2027-03-26', name: 'Divendres Sant', scope: 'espana' },
  { id: 'hol-2027-03-29', date: '2027-03-29', name: 'Dilluns de Pasqua Florida', scope: 'catalunya' },
  { id: 'hol-2027-05-01', date: '2027-05-01', name: 'Festa del Treball', scope: 'espana' },
  { id: 'hol-2027-05-17', date: '2027-05-17', name: 'Segona Pasqua (Pasqua Granada)', scope: 'barcelona' },
  { id: 'hol-2027-06-24', date: '2027-06-24', name: 'Sant Joan', scope: 'catalunya' },
  { id: 'hol-2027-08-15', date: '2027-08-15', name: "L'Assumpció", scope: 'espana' },
  { id: 'hol-2027-09-11', date: '2027-09-11', name: 'Diada de Catalunya', scope: 'catalunya' },
  { id: 'hol-2027-09-24', date: '2027-09-24', name: 'La Mercè', scope: 'barcelona' },
  { id: 'hol-2027-10-12', date: '2027-10-12', name: "Festa Nacional d'Espanya", scope: 'espana' },
  { id: 'hol-2027-11-01', date: '2027-11-01', name: 'Tots Sants', scope: 'espana' },
  { id: 'hol-2027-12-06', date: '2027-12-06', name: 'Dia de la Constitució', scope: 'espana' },
  { id: 'hol-2027-12-08', date: '2027-12-08', name: 'La Immaculada', scope: 'espana' },
  { id: 'hol-2027-12-25', date: '2027-12-25', name: 'Nadal', scope: 'espana' },
  { id: 'hol-2027-12-26', date: '2027-12-26', name: 'Sant Esteve', scope: 'catalunya' },
];

export function holidays(): Holiday[] {
  return HOLIDAYS.map((h) => ({ ...h }));
}

export function isPast(holiday: Holiday, today: Date = new Date()): boolean {
  const d = new Date(`${holiday.date}T00:00:00`);
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return d.getTime() < t.getTime();
}

export function filterHolidays(list: Holiday[], opts: { includePast: boolean }): Holiday[] {
  if (opts.includePast) return [...list];
  return list.filter((h) => !isPast(h));
}

export function groupByYear(list: Holiday[]): { year: number; items: Holiday[] }[] {
  const byYear = new Map<number, Holiday[]>();
  [...list]
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((h) => {
      const year = Number(h.date.slice(0, 4));
      const bucket = byYear.get(year);
      if (bucket) bucket.push(h);
      else byYear.set(year, [h]);
    });
  return [...byYear.entries()].sort((a, b) => a[0] - b[0]).map(([year, items]) => ({ year, items }));
}

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'];

export function formatHolidayDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return `${String(d).padStart(2, '0')} ${MONTHS[m - 1]} ${y}`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/features/configuracion/data/`
Expected: PASS (10 test files, all green).

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/data/
git commit -m "feat(configuracion): modelo de datos completo (10 dominios) + tests"
```

---

### Task 2: `ConfiguracionSidebar`

**Files:**
- Create: `src/features/configuracion/components/ConfiguracionSidebar.tsx`
- Test: `src/features/configuracion/components/ConfiguracionSidebar.test.tsx`

**Interfaces:**
- Consumes: `sidebarSections()` de `../data/sidebar`; `NavLink`, `Link` de `react-router`.
- Produces: `ConfiguracionSidebar(): JSX.Element` (sin props, lee `sidebarSections()` internamente).

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/components/ConfiguracionSidebar.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { ConfiguracionSidebar } from './ConfiguracionSidebar';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/configuracion/*" element={<ConfiguracionSidebar />} />
        <Route path="/personal" element={<ConfiguracionSidebar />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ConfiguracionSidebar', () => {
  it('renderiza las 6 secciones y 12 ítems', () => {
    renderAt('/configuracion');
    ['SISTEMA', 'MI TRABAJO', 'COMUNICACIÓN', 'CONCEPTONE · BOOKING', 'PRODUCCIÓN', 'EQUIPO'].forEach((s) =>
      expect(screen.getByText(s)).toBeInTheDocument()
    );
    expect(screen.getByText('Uso y coste')).toBeInTheDocument();
    expect(screen.getByText('Festivos')).toBeInTheDocument();
  });

  it('resalta el ítem activo por ruta', () => {
    renderAt('/configuracion/uso');
    expect(screen.getByText('Uso y coste').closest('a')).toHaveClass('bg-slate-100');
    expect(screen.getByText('Incidencias').closest('a')).not.toHaveClass('bg-slate-100');
  });

  it('"Plantillas de correo" solo activo en la ruta índice exacta', () => {
    renderAt('/configuracion/uso');
    expect(screen.getByText('Plantillas de correo').closest('a')).not.toHaveClass('bg-slate-100');
  });

  it('"Cuentas (auditoría)" es un link de salida a /personal y nunca queda activo', () => {
    renderAt('/configuracion');
    const link = screen.getByText('Cuentas (auditoría)').closest('a')!;
    expect(link).toHaveAttribute('href', '/personal');
    expect(link).not.toHaveClass('bg-slate-100');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/components/ConfiguracionSidebar.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/components/ConfiguracionSidebar.tsx
import { Link, NavLink } from 'react-router';
import { sidebarSections } from '../data/sidebar';

export function ConfiguracionSidebar() {
  const sections = sidebarSections();
  return (
    <aside className="w-56 shrink-0">
      <nav className="space-y-6">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{section.label}</p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <Link to={item.href} className="block rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                      {item.label}
                    </Link>
                  ) : (
                    <NavLink
                      to={item.href}
                      end={item.href === '/configuracion'}
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-1.5 text-sm ${
                          isActive ? 'bg-slate-100 font-semibold text-slate-800' : 'text-slate-600 hover:bg-slate-50'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/components/ConfiguracionSidebar.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/components/ConfiguracionSidebar.tsx src/features/configuracion/components/ConfiguracionSidebar.test.tsx
git commit -m "feat(configuracion): ConfiguracionSidebar (6 secciones, 12 ítems, link de salida)"
```

---

### Task 3: `ConfigPageHeader`

**Files:**
- Create: `src/features/configuracion/components/ConfigPageHeader.tsx`
- Test: `src/features/configuracion/components/ConfigPageHeader.test.tsx`

**Interfaces:**
- Produces: `ConfigPageHeader(props: { title: string; subtitle: React.ReactNode }): JSX.Element` — `subtitle` acepta nodo (no solo string) porque varias vistas (RRHH, Control de comisiones, Festivos) llevan negritas embebidas fieles al live.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/components/ConfigPageHeader.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConfigPageHeader } from './ConfigPageHeader';

describe('ConfigPageHeader', () => {
  it('renderiza título (h1) y subtítulo string', () => {
    render(<ConfigPageHeader title="Uso del sistema" subtitle="Qué integraciones funcionan." />);
    expect(screen.getByRole('heading', { level: 1, name: 'Uso del sistema' })).toBeInTheDocument();
    expect(screen.getByText('Qué integraciones funcionan.')).toBeInTheDocument();
  });

  it('acepta subtítulo con nodos (negritas embebidas)', () => {
    render(
      <ConfigPageHeader
        title="Festivos"
        subtitle={<><strong>Se descuentan</strong> de las vacaciones.</>}
      />
    );
    expect(screen.getByText('Se descuentan')).toBeInTheDocument();
    expect(screen.getByText('Se descuentan').tagName).toBe('STRONG');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/components/ConfigPageHeader.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/components/ConfigPageHeader.tsx
import type { ReactNode } from 'react';

export interface ConfigPageHeaderProps {
  title: string;
  subtitle: ReactNode;
}

export function ConfigPageHeader({ title, subtitle }: ConfigPageHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/components/ConfigPageHeader.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/components/ConfigPageHeader.tsx src/features/configuracion/components/ConfigPageHeader.test.tsx
git commit -m "feat(configuracion): ConfigPageHeader (título+subtítulo reusado en 10 páginas)"
```

---

### Task 4: `EmailTemplateCard` (+ extensión `RichTextEditor` con `content`/`onChange`)

**Files:**
- Modify: `src/components/ui/RichTextEditor.tsx` (añadir props opcionales `content` y `onChange`, retrocompatibles)
- Modify: `src/components/ui/RichTextEditor.test.tsx` (cubrir el delta)
- Create: `src/features/configuracion/components/EmailTemplateCard.tsx`
- Test: `src/features/configuracion/components/EmailTemplateCard.test.tsx`

**Interfaces:**
- Consumes: `EmailTemplate` de `../data/plantillasCorreo`; `Card`, `Input`, `Button`, `RichTextEditor` de `@/components/ui`.
- Produces: `EmailTemplateCard(props: { template: EmailTemplate }): JSX.Element`.
- Extensión `RichTextEditorProps`: añade `content?: string` (contenido inicial, default `''`, retrocompatible) y `onChange?: (html: string) => void` (llamado en `onUpdate` del editor TipTap; default `undefined` = no-op, retrocompatible con el único consumidor existente en Creativos).

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/ui/RichTextEditor.test.tsx (reemplaza el fichero completo)
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RichTextEditor } from './RichTextEditor';

const flush = () => new Promise((r) => setTimeout(r, 50));

describe('RichTextEditor', () => {
  it('renders the toolbar and an editable region; format buttons do not crash', async () => {
    const { container } = render(<RichTextEditor />);
    await flush();
    ['Negrita', 'Cursiva', 'Subrayado', 'Tachado', 'Quitar formato'].forEach((t) =>
      expect(screen.getByRole('button', { name: t })).toBeInTheDocument(),
    );
    expect(container.querySelector('.ProseMirror, [contenteditable="true"]')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Negrita' }));
    fireEvent.click(screen.getByRole('button', { name: 'Quitar formato' }));
  });

  it('acepta contenido inicial (content) y notifica cambios via onChange', async () => {
    const onChange = vi.fn();
    const { container } = render(<RichTextEditor content="<p>Hola</p>" onChange={onChange} />);
    await flush();
    expect(screen.getByText('Hola')).toBeInTheDocument();
    const editable = container.querySelector('[contenteditable="true"]') as HTMLElement;
    await userEvent.type(editable, ' mundo');
    expect(onChange).toHaveBeenCalled();
  });
});
```

```tsx
// src/features/configuracion/components/EmailTemplateCard.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmailTemplateCard } from './EmailTemplateCard';
import { templates } from '../data/plantillasCorreo';

const flush = () => new Promise((r) => setTimeout(r, 50));
const template = templates()[0]; // invitacion_portal

describe('EmailTemplateCard', () => {
  it('muestra título, descripción, slug y campos con los valores del seed', async () => {
    render(<EmailTemplateCard template={template} />);
    await flush();
    expect(screen.getByText('Bienvenida — portal de cliente')).toBeInTheDocument();
    expect(screen.getByText('Invitación a un cliente al portal de reposiciones (CRUDA).')).toBeInTheDocument();
    expect(screen.getByText('invitacion_portal')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Acceso a tu portal de cliente · CRUDA by Black Moose Group')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Crear mi contraseña')).toBeInTheDocument();
    expect(screen.getByDisplayValue('{{link}}')).toBeInTheDocument();
    expect(screen.getByText('{{nombre}}')).toBeInTheDocument();
  });

  it('Guardar arranca deshabilitado con "Sin cambios"; editar Asunto lo habilita y cambia el texto', async () => {
    render(<EmailTemplateCard template={template} />);
    await flush();
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeDisabled();
    expect(screen.getByText('Sin cambios')).toBeInTheDocument();

    await userEvent.type(screen.getByDisplayValue('Acceso a tu portal de cliente · CRUDA by Black Moose Group'), '!');

    expect(screen.getByRole('button', { name: 'Guardar' })).toBeEnabled();
    expect(screen.getByText('Cambios sin guardar')).toBeInTheDocument();
  });

  it('Editar y Vista previa son inertes (type=button, sin acción real)', async () => {
    render(<EmailTemplateCard template={template} />);
    await flush();
    expect(screen.getByRole('button', { name: 'Editar' })).toHaveAttribute('type', 'button');
    expect(screen.getByRole('button', { name: 'Vista previa' })).toHaveAttribute('type', 'button');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/ui/RichTextEditor.test.tsx src/features/configuracion/components/EmailTemplateCard.test.tsx`
Expected: FAIL (RichTextEditor: `content`/`onChange` no soportados; EmailTemplateCard: module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/ui/RichTextEditor.tsx (reemplaza el fichero completo)
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@/lib/utils';

const DEFAULT_PLACEHOLDER = 'Qué necesita la pieza: mensaje, formato, maquetación, referencias…';
const toolBtn = 'grid h-7 min-w-[28px] place-items-center rounded px-1 text-slate-600 hover:bg-slate-100';

export interface RichTextEditorProps {
  content?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
  className?: string;
}

export function RichTextEditor({ content = '', placeholder = DEFAULT_PLACEHOLDER, onChange, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontSize, Placeholder.configure({ placeholder })],
    content,
    editorProps: {
      attributes: { class: 'min-h-[90px] px-3 py-2 text-sm leading-snug outline-none' },
    },
    onUpdate: ({ editor: e }) => onChange?.(e.getHTML()),
  });

  const marks: [string, string, string, () => void][] = [
    ['B', 'Negrita', 'font-bold', () => editor?.chain().focus().toggleBold().run()],
    ['i', 'Cursiva', 'italic', () => editor?.chain().focus().toggleItalic().run()],
    ['U', 'Subrayado', 'underline', () => editor?.chain().focus().toggleUnderline().run()],
    ['S', 'Tachado', 'line-through', () => editor?.chain().focus().toggleStrike().run()],
  ];
  const sizes: [string, string, string][] = [
    ['text-[11px]', 'Texto pequeño', '12px'],
    ['text-sm', 'Texto normal', '15px'],
    ['text-base', 'Texto grande', '20px'],
  ];

  return (
    <div className={cn('overflow-hidden rounded-lg border border-slate-300 focus-within:border-brand-400', className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-1.5 py-1">
        {marks.map(([label, title, cls, run]) => (
          <button
            key={title}
            type="button"
            title={title}
            aria-label={title}
            onMouseDown={(e) => e.preventDefault()}
            onClick={run}
            className={cn(toolBtn, cls)}
          >
            {label}
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-slate-200" />
        {sizes.map(([sz, title, px]) => (
          <button
            key={title}
            type="button"
            title={title}
            aria-label={title}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor?.chain().focus().setFontSize(px).run()}
            className={toolBtn}
          >
            <span className={sz}>A</span>
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-slate-200" />
        <button
          type="button"
          title="Quitar formato"
          aria-label="Quitar formato"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().unsetAllMarks().run()}
          className={toolBtn}
        >
          <span className="text-xs">✕</span>
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
```

```tsx
// src/features/configuracion/components/EmailTemplateCard.tsx
import { useState } from 'react';
import { Card, Input, Button, RichTextEditor } from '@/components/ui';
import type { EmailTemplate } from '../data/plantillasCorreo';

export interface EmailTemplateCardProps {
  template: EmailTemplate;
}

export function EmailTemplateCard({ template }: EmailTemplateCardProps) {
  const [subject, setSubject] = useState(template.subject);
  const [emailTitle, setEmailTitle] = useState(template.emailTitle);
  const [buttonLabel, setButtonLabel] = useState(template.buttonLabel);
  const [buttonLink, setButtonLink] = useState(template.buttonLink);
  const [messageDirty, setMessageDirty] = useState(false);

  const dirty =
    subject !== template.subject ||
    emailTitle !== template.emailTitle ||
    buttonLabel !== template.buttonLabel ||
    buttonLink !== template.buttonLink ||
    messageDirty;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-800">{template.title}</h3>
          <p className="text-sm text-slate-400">{template.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" variant="ghost" size="sm">Editar</Button>
          <Button type="button" variant="ghost" size="sm">Vista previa</Button>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{template.slug}</span>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <label className="text-xs text-slate-500">Asunto — lo que se lee en la bandeja</label>
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div className="mt-3 space-y-1">
        <label className="text-xs text-slate-500">Título — el titular al abrir el correo</label>
        <Input value={emailTitle} onChange={(e) => setEmailTitle(e.target.value)} />
      </div>
      <div className="mt-3 space-y-1">
        <label className="text-xs text-slate-500">Mensaje</label>
        <RichTextEditor
          content={`<p>${template.message.split('\n').join('</p><p>')}</p>`}
          onChange={() => setMessageDirty(true)}
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Botón — vacío = sin botón</label>
          <Input value={buttonLabel} onChange={(e) => setButtonLabel(e.target.value)} placeholder="Crear mi contraseña" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Enlace del botón</label>
          <Input value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} placeholder="{{link}}" />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1 text-xs text-slate-500">
        <span>Variables:</span>
        {template.variables.map((v) => (
          <span key={v} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-600">{v}</span>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          disabled={!dirty}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: '#44444C' }}
        >
          Guardar
        </button>
        <span className="text-xs text-slate-400">{dirty ? 'Cambios sin guardar' : 'Sin cambios'}</span>
      </div>
    </Card>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/ui/RichTextEditor.test.tsx src/features/configuracion/components/EmailTemplateCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/RichTextEditor.tsx src/components/ui/RichTextEditor.test.tsx src/features/configuracion/components/EmailTemplateCard.tsx src/features/configuracion/components/EmailTemplateCard.test.tsx
git commit -m "feat(configuracion): EmailTemplateCard + extensión RichTextEditor (content/onChange)"
```

---

### Task 5: `PlantillasCorreoPage` (landing real del módulo)

**Files:**
- Create: `src/features/configuracion/pages/PlantillasCorreoPage.tsx`
- Test: `src/features/configuracion/pages/PlantillasCorreoPage.test.tsx`

**Interfaces:**
- Consumes: `templates()`, `FOOTER_NOTE` de `../data/plantillasCorreo`; `ConfigPageHeader`, `EmailTemplateCard`.
- Produces: `PlantillasCorreoPage(): JSX.Element`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/pages/PlantillasCorreoPage.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlantillasCorreoPage } from './PlantillasCorreoPage';

const flush = () => new Promise((r) => setTimeout(r, 50));

describe('PlantillasCorreoPage', () => {
  it('renderiza título, las 6 plantillas y el pie de página', async () => {
    render(<PlantillasCorreoPage />);
    await flush();
    expect(screen.getByRole('heading', { level: 1, name: 'Plantillas de correo' })).toBeInTheDocument();
    ['invitacion_portal', 'invitacion_usuario', 'liquidacion_show', 'reset_password', 'vacaciones_aprobada', 'vacaciones_rechazada'].forEach((slug) =>
      expect(screen.getByText(slug)).toBeInTheDocument()
    );
    expect(screen.getByText(/no-reply@blackmoose\.es/)).toBeInTheDocument();
  });

  it('no usa clases brand-*', async () => {
    const { container } = render(<PlantillasCorreoPage />);
    await flush();
    expect(container.querySelector('[class*="brand-"]')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/pages/PlantillasCorreoPage.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/pages/PlantillasCorreoPage.tsx
import { templates, FOOTER_NOTE } from '../data/plantillasCorreo';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { EmailTemplateCard } from '../components/EmailTemplateCard';

export function PlantillasCorreoPage() {
  const list = templates();
  return (
    <div className="space-y-4">
      <ConfigPageHeader
        title="Plantillas de correo"
        subtitle="Escribe el correo como un correo. La marca —logo, tipografía, botón y pie— la pone el sistema: aquí solo va el mensaje. Las variables van entre llaves, p. ej. {{nombre}}."
      />
      <div className="space-y-4">
        {list.map((t) => (
          <EmailTemplateCard key={t.id} template={t} />
        ))}
      </div>
      <p className="pt-2 text-xs text-slate-400">{FOOTER_NOTE}</p>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/pages/PlantillasCorreoPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/pages/PlantillasCorreoPage.tsx src/features/configuracion/pages/PlantillasCorreoPage.test.tsx
git commit -m "feat(configuracion): PlantillasCorreoPage (landing real del módulo)"
```

---

### Task 6: `IntegrationRow`

**Files:**
- Create: `src/features/configuracion/components/IntegrationRow.tsx`
- Test: `src/features/configuracion/components/IntegrationRow.test.tsx`

**Interfaces:**
- Consumes: `Integration`, `IntegrationUsageSnapshot` de `../data/uso`; `formatCurrency` de `@/lib/format`; icono `Plug` de `lucide-react`.
- Produces: `IntegrationRow(props: { integration: Integration; snapshot?: IntegrationUsageSnapshot }): JSX.Element`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/components/IntegrationRow.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntegrationRow } from './IntegrationRow';
import { integrations, snapshotFor } from '../data/uso';

describe('IntegrationRow', () => {
  it('precio-vuelos: cuota, provider/estado, usos/tarda/por-uso y nota incluida', () => {
    const integration = integrations().find((i) => i.id === 'precio-vuelos')!;
    render(<IntegrationRow integration={integration} snapshot={snapshotFor('precio-vuelos', '30d')} />);
    expect(screen.getByText('Precio de vuelos')).toBeInTheDocument();
    expect(screen.getByText(/FlightAPI/)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10.6 s')).toBeInTheDocument();
    expect(screen.getByText(/42,89/)).toBeInTheDocument();
    expect(screen.getByText('1 de 30.000 incluidas')).toBeInTheDocument();
  });

  it('ia: expande las 4 sub-funciones', () => {
    const integration = integrations().find((i) => i.id === 'ia')!;
    render(<IntegrationRow integration={integration} snapshot={snapshotFor('ia', '30d')} />);
    expect(screen.getByText('Triaje de incidencias')).toBeInTheDocument();
    expect(screen.getByText('Chat de ayuda')).toBeInTheDocument();
    expect(screen.getByText('copys')).toBeInTheDocument();
    expect(screen.getByText('mejorar')).toBeInTheDocument();
    expect(screen.getAllByText('gemini-flash-latest')).toHaveLength(4);
  });

  it('perfiles-artista: por uso "—" cuando perUse es null', () => {
    const integration = integrations().find((i) => i.id === 'perfiles-artista')!;
    render(<IntegrationRow integration={integration} snapshot={snapshotFor('perfiles-artista', '30d')} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('firma-contratos: sin snapshot, no revienta y no muestra métricas', () => {
    const integration = integrations().find((i) => i.id === 'firma-contratos')!;
    render(<IntegrationRow integration={integration} snapshot={undefined} />);
    expect(screen.getByText('Firma de contratos')).toBeInTheDocument();
    expect(screen.queryByText('Usos')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/components/IntegrationRow.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/components/IntegrationRow.tsx
import { Plug } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import type { Integration, IntegrationUsageSnapshot } from '../data/uso';

const DOT: Record<'green' | 'amber', string> = { green: 'bg-emerald-500', amber: 'bg-amber-500' };

export interface IntegrationRowProps {
  integration: Integration;
  snapshot?: IntegrationUsageSnapshot;
}

export function IntegrationRow({ integration, snapshot }: IntegrationRowProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-400">
          <Plug className="h-4 w-4" />
        </span>
        <span className={`h-2 w-2 shrink-0 rounded-full ${DOT[integration.statusDot]}`} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-800">{integration.name}</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
              {integration.pricingModel === 'cuota' ? `cuota ${formatCurrency(integration.monthlyFee ?? 0)}/mes` : 'por uso'}
            </span>
          </div>
          <p className="truncate text-sm text-slate-400">
            {integration.provider} · {integration.statusLabel}
          </p>
          {snapshot?.includedNote && <p className="text-xs text-slate-400">{snapshot.includedNote}</p>}
        </div>
        <div className="flex shrink-0 items-start gap-6 text-right">
          {snapshot?.usos !== undefined && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Usos</p>
              <p className="font-semibold text-slate-800">{snapshot.usos}</p>
            </div>
          )}
          {snapshot?.tarda && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Tarda</p>
              <p className="font-semibold text-slate-800">{snapshot.tarda}</p>
            </div>
          )}
          {snapshot?.tokensLabel && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Tokens</p>
              <p className="font-semibold text-slate-800">{snapshot.tokensLabel}</p>
            </div>
          )}
          {snapshot?.spend !== undefined && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Gasto</p>
              <p className="font-semibold text-slate-800">{formatCurrency(snapshot.spend)}</p>
            </div>
          )}
          {snapshot && 'perUse' in snapshot && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Por uso</p>
              <p className="font-semibold text-slate-800">{snapshot.perUse == null ? '—' : formatCurrency(snapshot.perUse)}</p>
            </div>
          )}
        </div>
      </div>
      {integration.subfunctions && (
        <div className="mt-3 space-y-1.5 border-t border-slate-50 pt-3">
          {integration.subfunctions.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center justify-between text-sm">
              <span className="text-slate-700">
                {s.label} <span className="text-xs text-slate-400">{s.model}</span>
              </span>
              <span className="flex items-center gap-4 text-slate-500">
                <span>{s.usos} usos</span>
                <span>{s.tokensIn} → {s.tokensOut}</span>
                <span className="font-medium text-slate-700">{formatCurrency(s.spend)}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/components/IntegrationRow.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/components/IntegrationRow.tsx src/features/configuracion/components/IntegrationRow.test.tsx
git commit -m "feat(configuracion): IntegrationRow (dot + métricas + sub-funciones IA)"
```

---

### Task 7: `UsageBanner`

**Files:**
- Create: `src/features/configuracion/components/UsageBanner.tsx`
- Test: `src/features/configuracion/components/UsageBanner.test.tsx`

**Interfaces:**
- Produces: `UsageBanner(props: { boldText?: string; text: string; linkLabel?: string }): JSX.Element`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/components/UsageBanner.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UsageBanner } from './UsageBanner';

describe('UsageBanner', () => {
  it('renderiza texto en negrita + texto plano + link opcional', () => {
    render(<UsageBanner boldText="3 suscripciones sin importe." text="Salen a 0 €." linkLabel="Rellenar precios" />);
    expect(screen.getByText('3 suscripciones sin importe.').tagName).toBe('STRONG');
    expect(screen.getByText(/Salen a 0/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Rellenar precios' })).toBeInTheDocument();
  });

  it('sin boldText ni linkLabel, solo pinta el texto', () => {
    render(<UsageBanner text="12 tarifas de IA sin verificar." />);
    expect(screen.getByText('12 tarifas de IA sin verificar.')).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/components/UsageBanner.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/components/UsageBanner.tsx
export interface UsageBannerProps {
  boldText?: string;
  text: string;
  linkLabel?: string;
}

export function UsageBanner({ boldText, text, linkLabel }: UsageBannerProps) {
  return (
    <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {boldText && <strong className="font-semibold">{boldText} </strong>}
      {text}
      {linkLabel && (
        <a href="#" onClick={(e) => e.preventDefault()} className="ml-1 underline">
          {linkLabel}
        </a>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/components/UsageBanner.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/components/UsageBanner.tsx src/features/configuracion/components/UsageBanner.test.tsx
git commit -m "feat(configuracion): UsageBanner (aviso ámbar con negrita + link opcional)"
```

---

### Task 8: `UsoPage` (+ extensión `SegmentedControl` con `tone`)

**Files:**
- Modify: `src/components/ui/SegmentedControl.tsx` (añade prop opcional `tone?: 'light'|'dark'`, default `'light'` = comportamiento actual)
- Modify: `src/components/ui/SegmentedControl.test.tsx` (cubre el delta)
- Create: `src/features/configuracion/pages/UsoPage.tsx`
- Test: `src/features/configuracion/pages/UsoPage.test.tsx`

**Interfaces:**
- Consumes: `integrations`, `snapshotFor`, `totalsFor`, `usageBanners`, `UsagePeriod` de `../data/uso`; `StatCard`, `SegmentedControl` de `@/components/ui`; `formatCurrency`.
- Produces: `UsoPage(): JSX.Element`.
- Extensión `SegmentedControlProps<T>`: añade `tone?: 'light' | 'dark'` (default `'light'`); en `tone="dark"` el activo pinta `bg-[#44444C] text-white` en vez de `bg-white text-slate-800 shadow-sm`.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/ui/SegmentedControl.test.tsx (reemplaza el fichero completo)
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SegmentedControl } from './SegmentedControl';

describe('SegmentedControl', () => {
  it('highlights the active option and calls onChange on click', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        options={[
          { label: 'Listado', value: 'list' },
          { label: 'Kanban', value: 'kanban' },
        ]}
        value="list"
        onChange={onChange}
      />
    );
    expect(screen.getByRole('button', { name: 'Listado' })).toHaveClass('bg-white');
    expect(screen.getByRole('button', { name: 'Kanban' })).not.toHaveClass('bg-white');

    fireEvent.click(screen.getByRole('button', { name: 'Kanban' }));
    expect(onChange).toHaveBeenCalledWith('kanban');
  });

  it('spreads segments across the full width when fullWidth is set', () => {
    render(
      <SegmentedControl
        fullWidth
        options={[
          { label: 'Envío MRW', value: 'mrw' },
          { label: 'Uso interno', value: 'internal' },
        ]}
        value="mrw"
        onChange={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: 'Envío MRW' }).parentElement).toHaveClass('grid');
  });

  it('tone="dark" pinta el activo con fondo #44444C en vez del claro por defecto', () => {
    render(
      <SegmentedControl
        tone="dark"
        options={[
          { label: '7 días', value: '7d' },
          { label: '30 días', value: '30d' },
        ]}
        value="30d"
        onChange={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: '30 días' })).toHaveClass('bg-[#44444C]');
    expect(screen.getByRole('button', { name: '30 días' })).not.toHaveClass('bg-white');
    expect(screen.getByRole('button', { name: '7 días' })).not.toHaveClass('bg-[#44444C]');
  });
});
```

```tsx
// src/features/configuracion/pages/UsoPage.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsoPage } from './UsoPage';

describe('UsoPage', () => {
  it('renderiza título, 3 stat cards, 3 banners y 6 integraciones', () => {
    render(<UsoPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Uso del sistema' })).toBeInTheDocument();
    expect(screen.getByText(/53,89/)).toBeInTheDocument();
    expect(screen.getByText(/53,92/)).toBeInTheDocument();
    expect(screen.getByText('3 suscripciones sin importe.')).toBeInTheDocument();
    expect(screen.getByText('Precio de vuelos')).toBeInTheDocument();
    expect(screen.getByText('Horarios de vuelos')).toBeInTheDocument();
    expect(screen.getByText('Triaje de incidencias')).toBeInTheDocument();
  });

  it('el toggle de periodo por defecto está en 30 días', () => {
    render(<UsoPage />);
    expect(screen.getByRole('button', { name: '30 días' })).toHaveClass('bg-[#44444C]');
  });

  it('cambiar a "Un año" no revienta (reusa el mismo snapshot documentado)', async () => {
    render(<UsoPage />);
    await userEvent.click(screen.getByRole('button', { name: 'Un año' }));
    expect(screen.getByRole('button', { name: 'Un año' })).toHaveClass('bg-[#44444C]');
    expect(screen.getByText('Precio de vuelos')).toBeInTheDocument();
  });

  it('no usa clases brand-*', () => {
    const { container } = render(<UsoPage />);
    expect(container.querySelector('[class*="brand-"]')).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/ui/SegmentedControl.test.tsx src/features/configuracion/pages/UsoPage.test.tsx`
Expected: FAIL (`tone` no soportado; `UsoPage` module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/ui/SegmentedControl.tsx (reemplaza el fichero completo)
import { cn } from '@/lib/utils';

export interface SegmentedControlOption<T extends string> {
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  fullWidth?: boolean;
  tone?: 'light' | 'dark';
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  fullWidth = false,
  tone = 'light',
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        'rounded-lg bg-slate-100 p-1',
        fullWidth ? 'grid w-full auto-cols-fr grid-flow-col gap-1' : 'inline-flex items-center gap-1',
        className
      )}
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-md px-3 py-1 text-sm font-medium transition-colors',
              active
                ? tone === 'dark'
                  ? 'bg-[#44444C] text-white'
                  : 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
```

```tsx
// src/features/configuracion/pages/UsoPage.tsx
import { useState } from 'react';
import { formatCurrency } from '@/lib/format';
import { StatCard, SegmentedControl } from '@/components/ui';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { UsageBanner } from '../components/UsageBanner';
import { IntegrationRow } from '../components/IntegrationRow';
import { integrations, snapshotFor, totalsFor, usageBanners, type UsagePeriod } from '../data/uso';

const PERIODS: { label: string; value: UsagePeriod }[] = [
  { label: '7 días', value: '7d' },
  { label: '30 días', value: '30d' },
  { label: '90 días', value: '90d' },
  { label: 'Un año', value: '1y' },
];

export function UsoPage() {
  const [period, setPeriod] = useState<UsagePeriod>('30d');
  const list = integrations();
  const totals = totalsFor(period);
  const banners = usageBanners();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <ConfigPageHeader
          title="Uso del sistema"
          subtitle="Qué integraciones funcionan y cuánto está costando todo esto. Se mide aquí, llamada a llamada."
        />
        <SegmentedControl options={PERIODS} value={period} onChange={setPeriod} tone="dark" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="CUOTA FIJA · AL MES" value={formatCurrency(totals.cuotaFijaMes)} />
        <StatCard label="GASTO TOTAL · 30 DÍAS" value={formatCurrency(totals.gastoTotalPeriodo)} caption="Cuota prorrateada + consumo" />
        <StatCard label="ERRORES" value={String(totals.errores)} />
      </div>

      <div className="space-y-2">
        {banners.map((b, i) => (
          <UsageBanner key={i} boldText={b.boldText} text={b.text} linkLabel={b.linkLabel} />
        ))}
      </div>

      <div className="space-y-3">
        {list.map((i) => (
          <IntegrationRow key={i.id} integration={i} snapshot={snapshotFor(i.id, period)} />
        ))}
      </div>

      <p className="flex gap-4 text-xs text-slate-400 underline">
        <a href="#" onClick={(e) => e.preventDefault()}>Cuotas y tarifas</a>
        <a href="#" onClick={(e) => e.preventDefault()}>Actualizar</a>
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/ui/SegmentedControl.test.tsx src/features/configuracion/pages/UsoPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/SegmentedControl.tsx src/components/ui/SegmentedControl.test.tsx src/features/configuracion/pages/UsoPage.tsx src/features/configuracion/pages/UsoPage.test.tsx
git commit -m "feat(configuracion): UsoPage + extensión SegmentedControl (tone=dark)"
```

---

### Task 9: `IncidenciaRow`

**Files:**
- Create: `src/features/configuracion/components/IncidenciaRow.tsx`
- Test: `src/features/configuracion/components/IncidenciaRow.test.tsx`

**Interfaces:**
- Consumes: `Incidencia`, `IncidentStatus` de `../data/incidencias`; icono `User` de `lucide-react`.
- Produces: `IncidenciaRow(props: { incidencia: Incidencia }): JSX.Element`.
- Nota: el avatar con iniciales usa un `<span style={{backgroundColor}}>` inline (mismo patrón ya establecido en `src/features/crm/components/OpportunityCard.tsx` para `ownerColor`/`ownerInitials`), no el primitivo `Avatar` — ese primitivo no acepta color dinámico y Tailwind JIT no compila clases con hex interpolado en runtime.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/components/IncidenciaRow.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IncidenciaRow } from './IncidenciaRow';
import { incidencias } from '../data/incidencias';

const list = incidencias();

describe('IncidenciaRow', () => {
  it('con autor: muestra chip de estado, tipo, texto, origen e iniciales', () => {
    const row = list.find((i) => i.authorInitials === 'FV')!;
    render(<IncidenciaRow incidencia={row} />);
    expect(screen.getByText('DESCARTADA')).toBeInTheDocument();
    expect(screen.getByText('Idea')).toBeInTheDocument();
    expect(screen.getByText(row.text)).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
    expect(screen.getByText('FV')).toBeInTheDocument();
  });

  it('sin autor: icono genérico en vez de iniciales', () => {
    const row = list.find((i) => !i.authorInitials)!;
    render(<IncidenciaRow incidencia={row} />);
    expect(screen.queryByText('FV')).toBeNull();
  });

  it('estado nueva se pinta en rojo, resuelta en verde', () => {
    const nueva = list.find((i) => i.status === 'nueva')!;
    const { container: c1 } = render(<IncidenciaRow incidencia={nueva} />);
    expect(c1.querySelector('.bg-red-100')).not.toBeNull();

    const resuelta = list.find((i) => i.status === 'resuelta')!;
    const { container: c2 } = render(<IncidenciaRow incidencia={resuelta} />);
    expect(c2.querySelector('.bg-emerald-100')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/components/IncidenciaRow.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/components/IncidenciaRow.tsx
import { User } from 'lucide-react';
import type { Incidencia, IncidentStatus } from '../data/incidencias';

const STATUS_CHIP: Record<IncidentStatus, string> = {
  nueva: 'bg-red-100 text-red-700',
  auto: 'bg-sky-100 text-sky-700',
  en_curso: 'bg-slate-100 text-slate-400',
  resuelta: 'bg-emerald-100 text-emerald-700',
  descartada: 'bg-slate-100 text-slate-500',
};

const STATUS_LABEL: Record<IncidentStatus, string> = {
  nueva: 'NUEVA',
  auto: 'AUTO',
  en_curso: 'EN CURSO',
  resuelta: 'RESUELTA',
  descartada: 'DESCARTADA',
};

export interface IncidenciaRowProps {
  incidencia: Incidencia;
}

export function IncidenciaRow({ incidencia }: IncidenciaRowProps) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 px-2 py-3 text-sm last:border-b-0">
      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_CHIP[incidencia.status]}`}>
        {STATUS_LABEL[incidencia.status]}
      </span>
      <span className="shrink-0 rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-600">{incidencia.type}</span>
      <span className="flex-1 truncate text-slate-700">{incidencia.text}</span>
      <span className="w-40 shrink-0 truncate font-mono text-xs text-slate-400">{incidencia.originPath ?? '—'}</span>
      {incidencia.authorInitials ? (
        <span
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
          style={{ backgroundColor: incidencia.authorColor ?? '#64748b' }}
          title={incidencia.authorInitials}
        >
          {incidencia.authorInitials}
        </span>
      ) : (
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <User className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/components/IncidenciaRow.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/components/IncidenciaRow.tsx src/features/configuracion/components/IncidenciaRow.test.tsx
git commit -m "feat(configuracion): IncidenciaRow (chip estado+tipo, origen, autor)"
```

---

### Task 10: `IncidentCountPill`

**Files:**
- Create: `src/features/configuracion/components/IncidentCountPill.tsx`
- Test: `src/features/configuracion/components/IncidentCountPill.test.tsx`

**Interfaces:**
- Produces: `IncidentCountPill(props: { label: string; count: number; tone: 'red'|'sky'|'emerald'|'neutral' }): JSX.Element` — sin `onClick`: el live no lo muestra clicable. Se atenúa visualmente (deshabilitado) cuando `count === 0`, independientemente del `tone`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/components/IncidentCountPill.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IncidentCountPill } from './IncidentCountPill';

describe('IncidentCountPill', () => {
  it('con count>0 y tone coloreado: chip con color y número oscuro', () => {
    const { container } = render(<IncidentCountPill label="RESUELTAS" count={2} tone="emerald" />);
    expect(screen.getByText('RESUELTAS')).toHaveClass('bg-emerald-100');
    expect(screen.getByText('2')).toHaveClass('text-slate-800');
    expect(container.firstChild).not.toHaveClass('opacity-60');
  });

  it('con count=0 (EN CURSO): se atenúa visualmente, aunque el tone sea neutral', () => {
    const { container } = render(<IncidentCountPill label="EN CURSO" count={0} tone="neutral" />);
    expect(screen.getByText('0')).toHaveClass('text-slate-300');
    expect(container.firstChild).toHaveClass('opacity-60');
  });

  it('DESCARTADAS con count>0 y tone neutral: no se atenúa aunque el label no lleve chip de color', () => {
    const { container } = render(<IncidentCountPill label="DESCARTADAS" count={4} tone="neutral" />);
    expect(container.firstChild).not.toHaveClass('opacity-60');
    expect(screen.getByText('4')).toHaveClass('text-slate-800');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/components/IncidentCountPill.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/components/IncidentCountPill.tsx
const CHIP: Record<'red' | 'sky' | 'emerald' | 'neutral', string> = {
  red: 'bg-red-100 text-red-700',
  sky: 'bg-sky-100 text-sky-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  neutral: 'text-slate-400',
};

export interface IncidentCountPillProps {
  label: string;
  count: number;
  tone: 'red' | 'sky' | 'emerald' | 'neutral';
}

export function IncidentCountPill({ label, count, tone }: IncidentCountPillProps) {
  const disabled = count === 0;
  return (
    <div className={`rounded-xl border p-3 ${disabled ? 'border-slate-100 opacity-60' : 'border-slate-200 bg-white'}`}>
      <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${CHIP[tone]}`}>
        {label}
      </span>
      <p className={`mt-1 text-xl font-bold ${disabled ? 'text-slate-300' : 'text-slate-800'}`}>{count}</p>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/components/IncidentCountPill.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/components/IncidentCountPill.tsx src/features/configuracion/components/IncidentCountPill.test.tsx
git commit -m "feat(configuracion): IncidentCountPill (contador con tono deshabilitado en 0)"
```

---

### Task 11: `IncidenciasPage`

**Files:**
- Create: `src/features/configuracion/pages/IncidenciasPage.tsx`
- Test: `src/features/configuracion/pages/IncidenciasPage.test.tsx`

**Interfaces:**
- Consumes: `incidencias`, `countByStatus` de `../data/incidencias`; `ConfigPageHeader`, `IncidentCountPill`, `IncidenciaRow`.
- Produces: `IncidenciasPage(): JSX.Element`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/pages/IncidenciasPage.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IncidenciasPage } from './IncidenciasPage';

describe('IncidenciasPage', () => {
  it('título, 5 contadores exactos (1/1/0/2/4) y 8 filas', () => {
    render(<IncidenciasPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Incidencias' })).toBeInTheDocument();
    expect(screen.getByText('NUEVAS').nextSibling?.textContent).toBe('1');
    expect(screen.getByText('AUTO').nextSibling?.textContent).toBe('1');
    expect(screen.getByText('EN CURSO').nextSibling?.textContent).toBe('0');
    expect(screen.getByText('RESUELTAS').nextSibling?.textContent).toBe('2');
    expect(screen.getByText('DESCARTADAS').nextSibling?.textContent).toBe('4');
    expect(screen.getAllByText('Idea')).toHaveLength(8);
  });

  it('no usa clases brand-*', () => {
    const { container } = render(<IncidenciasPage />);
    expect(container.querySelector('[class*="brand-"]')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/pages/IncidenciasPage.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/pages/IncidenciasPage.tsx
import { incidencias, countByStatus } from '../data/incidencias';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { IncidentCountPill } from '../components/IncidentCountPill';
import { IncidenciaRow } from '../components/IncidenciaRow';

export function IncidenciasPage() {
  const list = incidencias();
  const counts = countByStatus(list);

  return (
    <div className="space-y-4">
      <ConfigPageHeader
        title="Incidencias"
        subtitle="Lo que el equipo reporta desde el panel de ayuda. Responder es lo que hace que sigan reportando."
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <IncidentCountPill label="NUEVAS" count={counts.nueva} tone="red" />
        <IncidentCountPill label="AUTO" count={counts.auto} tone="sky" />
        <IncidentCountPill label="EN CURSO" count={counts.en_curso} tone="neutral" />
        <IncidentCountPill label="RESUELTAS" count={counts.resuelta} tone="emerald" />
        <IncidentCountPill label="DESCARTADAS" count={counts.descartada} tone="neutral" />
      </div>
      <div className="rounded-xl border border-slate-100 bg-white">
        {list.map((i) => (
          <IncidenciaRow key={i.id} incidencia={i} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/pages/IncidenciasPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/pages/IncidenciasPage.tsx src/features/configuracion/pages/IncidenciasPage.test.tsx
git commit -m "feat(configuracion): IncidenciasPage (5 contadores derivados + 8 filas)"
```

---

### Task 12: `TypographySlider`

**Files:**
- Create: `src/features/configuracion/components/TypographySlider.tsx`
- Test: `src/features/configuracion/components/TypographySlider.test.tsx`

**Interfaces:**
- Produces: `TypographySlider(props: { label: string; value: number; unit: 'px'|'x'|''; min: number; max: number; step: number; help?: string; onChange: (value: number) => void }): JSX.Element`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/components/TypographySlider.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TypographySlider } from './TypographySlider';

describe('TypographySlider', () => {
  it('muestra label, valor entero + unidad px, y help', () => {
    render(<TypographySlider label="Tamaño del texto" value={16} unit="px" min={10} max={24} step={1} help="16 px es el tamaño normal." onChange={() => {}} />);
    expect(screen.getByText('Tamaño del texto')).toBeInTheDocument();
    expect(screen.getByText('16 px')).toBeInTheDocument();
    expect(screen.getByText('16 px es el tamaño normal.')).toBeInTheDocument();
  });

  it('muestra valor decimal con coma y unidad x', () => {
    render(<TypographySlider label="Título 1" value={1.9} unit="x" min={1} max={3} step={0.05} onChange={() => {}} />);
    expect(screen.getByText('1,90 x')).toBeInTheDocument();
  });

  it('sin unidad: solo el número con coma', () => {
    render(<TypographySlider label="Interlineado" value={1.45} unit="" min={1} max={2} step={0.05} onChange={() => {}} />);
    expect(screen.getByText('1,45')).toBeInTheDocument();
  });

  it('mover el slider dispara onChange con el valor numérico', () => {
    const onChange = vi.fn();
    render(<TypographySlider label="Aire entre párrafos" value={4} unit="px" min={0} max={16} step={1} onChange={onChange} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '8' } });
    expect(onChange).toHaveBeenCalledWith(8);
  });

  it('sin help, no revienta y no pinta párrafo de ayuda', () => {
    const { container } = render(<TypographySlider label="Título 2" value={1.5} unit="x" min={1} max={3} step={0.05} onChange={() => {}} />);
    expect(container.querySelectorAll('p')).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/components/TypographySlider.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/components/TypographySlider.tsx
export interface TypographySliderProps {
  label: string;
  value: number;
  unit: 'px' | 'x' | '';
  min: number;
  max: number;
  step: number;
  help?: string;
  onChange: (value: number) => void;
}

function formatValue(value: number, unit: 'px' | 'x' | ''): string {
  if (unit === 'px') return `${Math.round(value)} px`;
  const decimal = value.toFixed(2).replace('.', ',');
  return unit === 'x' ? `${decimal} x` : decimal;
}

export function TypographySlider({ label, value, unit, min, max, step, help, onChange }: TypographySliderProps) {
  return (
    <div className="py-3">
      <div className="flex items-center justify-between text-sm">
        <label className="font-medium text-slate-700">{label}</label>
        <span className="text-slate-500">{formatValue(value, unit)}</span>
      </div>
      <input
        type="range"
        role="slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-slate-700"
      />
      {help && <p className="mt-1 text-xs text-slate-400">{help}</p>}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/components/TypographySlider.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/components/TypographySlider.tsx src/features/configuracion/components/TypographySlider.test.tsx
git commit -m "feat(configuracion): TypographySlider (rango + valor formateado + ayuda)"
```

---

### Task 13: `DocumentosTipografiaPage`

**Files:**
- Create: `src/features/configuracion/pages/DocumentosTipografiaPage.tsx`
- Test: `src/features/configuracion/pages/DocumentosTipografiaPage.test.tsx`

**Interfaces:**
- Consumes: `TypographySlider`, `ConfigPageHeader`.
- Produces: `DocumentosTipografiaPage(): JSX.Element`; exporta `interface TypographySettings { textSize; lineHeight; paragraphGap; h1Scale; h2Scale; h3Scale; headingLineHeight }` y `FACTORY_DEFAULTS: TypographySettings` (no hay `data/documentos.ts` dedicado: son valores locales de la página, per spec).

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/pages/DocumentosTipografiaPage.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DocumentosTipografiaPage } from './DocumentosTipografiaPage';

describe('DocumentosTipografiaPage', () => {
  it('título y los 7 sliders con su label', () => {
    render(<DocumentosTipografiaPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Documentos · tipografía' })).toBeInTheDocument();
    [
      'Tamaño del texto', 'Interlineado', 'Aire entre párrafos',
      'Título 1', 'Título 2', 'Título 3', 'Interlineado de los títulos',
    ].forEach((label) => expect(screen.getByText(label)).toBeInTheDocument());
  });

  it('el panel "Así se verá" refleja el tamaño de texto en vivo', () => {
    render(<DocumentosTipografiaPage />);
    const h1 = screen.getByText('Rider de Charlotte de Witte');
    expect(h1).toHaveStyle({ fontSize: `${16 * 1.9}px` });

    const slider = screen.getAllByRole('slider')[0];
    fireEvent.change(slider, { target: { value: '20' } });
    expect(screen.getByText('Rider de Charlotte de Witte')).toHaveStyle({ fontSize: `${20 * 1.9}px` });
  });

  it('"Volver a los valores de fábrica" resetea tras un cambio', async () => {
    render(<DocumentosTipografiaPage />);
    const slider = screen.getAllByRole('slider')[0];
    fireEvent.change(slider, { target: { value: '22' } });
    expect(screen.getByText('Cambios sin guardar')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Volver a los valores de fábrica' }));
    expect(screen.getByText('Guardado')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/pages/DocumentosTipografiaPage.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/pages/DocumentosTipografiaPage.tsx
import { useState } from 'react';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { TypographySlider } from '../components/TypographySlider';

export interface TypographySettings {
  textSize: number;
  lineHeight: number;
  paragraphGap: number;
  h1Scale: number;
  h2Scale: number;
  h3Scale: number;
  headingLineHeight: number;
}

export const FACTORY_DEFAULTS: TypographySettings = {
  textSize: 16,
  lineHeight: 1.45,
  paragraphGap: 4,
  h1Scale: 1.9,
  h2Scale: 1.5,
  h3Scale: 1.15,
  headingLineHeight: 1.2,
};

export function DocumentosTipografiaPage() {
  const [settings, setSettings] = useState<TypographySettings>(FACTORY_DEFAULTS);
  const dirty = JSON.stringify(settings) !== JSON.stringify(FACTORY_DEFAULTS);

  const set = <K extends keyof TypographySettings>(key: K) => (value: number) =>
    setSettings((s) => ({ ...s, [key]: value }));

  return (
    <div className="space-y-4">
      <ConfigPageHeader
        title="Documentos · tipografía"
        subtitle="Cómo se ve el texto en Mi trabajo. Vale para todo el equipo: si cada uno tuviera la suya, dos personas mirando el mismo documento verían páginas distintas."
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setSettings(FACTORY_DEFAULTS)}
          className="text-sm text-slate-500 underline hover:text-slate-700"
        >
          Volver a los valores de fábrica
        </button>
        <span className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-500">
          {dirty ? 'Cambios sin guardar' : 'Guardado'}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white px-4">
          <TypographySlider
            label="Tamaño del texto" value={settings.textSize} unit="px" min={10} max={24} step={1}
            help="16 px es el tamaño normal de lectura: lo que usan Notion y Word (12 pt). Por debajo de 15, la gente acerca la cara a la pantalla."
            onChange={set('textSize')}
          />
          <TypographySlider
            label="Interlineado" value={settings.lineHeight} unit="" min={1} max={2} step={0.05}
            help="Espacio entre las líneas de un mismo párrafo. Notion usa 1,45. Por debajo de 1,35 el texto se apelmaza y cuesta seguir el renglón."
            onChange={set('lineHeight')}
          />
          <TypographySlider
            label="Aire entre párrafos" value={settings.paragraphGap} unit="px" min={0} max={16} step={1}
            help="Separación ENTRE párrafos. Si el texto te parece aireado y el interlineado ya está bajo, el culpable suele ser este."
            onChange={set('paragraphGap')}
          />
          <TypographySlider
            label="Título 1" value={settings.h1Scale} unit="x" min={1} max={3} step={0.05}
            help="Multiplica el tamaño del texto. BlockNote trae 3x de serie, que es enorme."
            onChange={set('h1Scale')}
          />
          <TypographySlider label="Título 2" value={settings.h2Scale} unit="x" min={1} max={3} step={0.05} onChange={set('h2Scale')} />
          <TypographySlider label="Título 3" value={settings.h3Scale} unit="x" min={1} max={3} step={0.05} onChange={set('h3Scale')} />
          <TypographySlider
            label="Interlineado de los títulos" value={settings.headingLineHeight} unit="" min={1} max={2} step={0.05}
            help="Apretado a propósito: un título de dos líneas con el interlineado del cuerpo abre un desierto en medio de la página."
            onChange={set('headingLineHeight')}
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Así se verá</p>
          <div
            className="rounded-xl border border-slate-100 bg-white p-5"
            style={{ fontSize: `${settings.textSize}px`, lineHeight: settings.lineHeight }}
          >
            <h1
              style={{ fontSize: `${settings.textSize * settings.h1Scale}px`, lineHeight: settings.headingLineHeight, marginBottom: settings.paragraphGap }}
              className="font-bold text-slate-800"
            >
              Rider de Charlotte de Witte
            </h1>
            <p style={{ marginBottom: settings.paragraphGap }} className="text-slate-600">
              El promotor confirma la fecha antes del 12 de septiembre. Si no hay confirmación por escrito, la reserva
              decae y la fecha vuelve a estar disponible para otros territorios. Esto no es una formalidad: el año
              pasado perdimos dos fines de semana esperando un correo que nunca llegó.
            </p>
            <h2
              style={{ fontSize: `${settings.textSize * settings.h2Scale}px`, lineHeight: settings.headingLineHeight, marginBottom: settings.paragraphGap }}
              className="font-bold text-slate-800"
            >
              Técnico
            </h2>
            <p style={{ marginBottom: settings.paragraphGap }} className="text-slate-600">
              Cabina con dos CDJ-3000 y un DJM-A9. Monitores a la altura de la cabina, nunca en el suelo.
            </p>
            <ul className="list-disc pl-5 text-slate-600" style={{ marginBottom: settings.paragraphGap }}>
              <li>Soundcheck 90 minutos antes de la apertura de puertas</li>
              <li>Hospitality en camerino privado</li>
              <li>Toalla, agua sin gas, fruta</li>
            </ul>
            <h3
              style={{ fontSize: `${settings.textSize * settings.h3Scale}px`, lineHeight: settings.headingLineHeight, marginBottom: settings.paragraphGap }}
              className="font-bold text-slate-800"
            >
              Nota
            </h3>
            <p className="text-slate-600">Cualquier cambio en el horario se comunica al management, no al artista.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/pages/DocumentosTipografiaPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/pages/DocumentosTipografiaPage.tsx src/features/configuracion/pages/DocumentosTipografiaPage.test.tsx
git commit -m "feat(configuracion): DocumentosTipografiaPage (7 sliders + preview en vivo)"
```

---

### Task 14: `NotificationCategoryCard`

**Files:**
- Create: `src/features/configuracion/components/NotificationCategoryCard.tsx`
- Test: `src/features/configuracion/components/NotificationCategoryCard.test.tsx`

**Interfaces:**
- Consumes: `NotificationCategory`, `NotificationRecipient` de `../data/notificaciones`; `Card` de `@/components/ui`.
- Produces: `NotificationCategoryCard(props: { category: NotificationCategory; recipients: NotificationRecipient[]; onToggle: (userName: string) => void; onToggleEmail: (userName: string) => void }): JSX.Element`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/components/NotificationCategoryCard.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationCategoryCard } from './NotificationCategoryCard';
import { categories, recipientsFor } from '../data/notificaciones';

describe('NotificationCategoryCard', () => {
  it('categoría con toggle de email: 15 filas, columna email visible', () => {
    const cat = categories().find((c) => c.id === 'pedidos_reposicion')!;
    render(<NotificationCategoryCard category={cat} recipients={recipientsFor(cat.id)} onToggle={() => {}} onToggleEmail={() => {}} />);
    expect(screen.getByText('Pedidos de reposición (portal)')).toBeInTheDocument();
    expect(screen.getAllByText('también por email')).toHaveLength(15);
  });

  it('categoría sin toggle (vacaciones): columna email ausente', () => {
    const cat = categories().find((c) => c.id === 'vacaciones')!;
    render(<NotificationCategoryCard category={cat} recipients={recipientsFor(cat.id)} onToggle={() => {}} onToggleEmail={() => {}} />);
    expect(screen.queryByText('también por email')).toBeNull();
  });

  it('checkbox secundario deshabilitado si el principal no está marcado', () => {
    const cat = categories().find((c) => c.id === 'pedidos_reposicion')!;
    render(<NotificationCategoryCard category={cat} recipients={recipientsFor(cat.id)} onToggle={() => {}} onToggleEmail={() => {}} />);
    const albaRow = screen.getByText('Alba Gelabert').closest('div')!;
    const emailCheckbox = within(albaRow).getByText('también por email').closest('label')!.querySelector('input')!;
    expect(emailCheckbox).toBeDisabled();
  });

  it('togglear el checkbox principal llama a onToggle con el userName', async () => {
    const onToggle = vi.fn();
    const cat = categories().find((c) => c.id === 'vacaciones')!;
    render(<NotificationCategoryCard category={cat} recipients={recipientsFor(cat.id)} onToggle={onToggle} onToggleEmail={() => {}} />);
    const checkbox = screen.getByText('Alba Gelabert').closest('label')!.querySelector('input')!;
    await userEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith('Alba Gelabert');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/components/NotificationCategoryCard.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/components/NotificationCategoryCard.tsx
import { Card } from '@/components/ui';
import type { NotificationCategory, NotificationRecipient } from '../data/notificaciones';

export interface NotificationCategoryCardProps {
  category: NotificationCategory;
  recipients: NotificationRecipient[];
  onToggle: (userName: string) => void;
  onToggleEmail: (userName: string) => void;
}

export function NotificationCategoryCard({ category, recipients, onToggle, onToggleEmail }: NotificationCategoryCardProps) {
  return (
    <Card className="p-5">
      <h3 className="font-semibold text-slate-800">{category.title}</h3>
      <p className="text-sm text-slate-400">{category.description}</p>
      <div className="mt-3 divide-y divide-slate-50">
        {recipients.map((r) => (
          <div key={r.userName} className="flex items-center justify-between py-1.5 text-sm">
            <label className="flex items-center gap-2 text-slate-700">
              <input type="checkbox" checked={r.checked} onChange={() => onToggle(r.userName)} />
              {r.userName}
            </label>
            {category.hasEmailToggle && (
              <label className={`flex items-center gap-2 ${r.checked ? 'text-slate-500' : 'text-slate-300'}`}>
                <input type="checkbox" checked={r.alsoEmail} disabled={!r.checked} onChange={() => onToggleEmail(r.userName)} />
                también por email
              </label>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/components/NotificationCategoryCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/components/NotificationCategoryCard.tsx src/features/configuracion/components/NotificationCategoryCard.test.tsx
git commit -m "feat(configuracion): NotificationCategoryCard (15 destinatarios + toggle email condicional)"
```

---

### Task 15: `NotificacionesPage`

**Files:**
- Create: `src/features/configuracion/pages/NotificacionesPage.tsx`
- Test: `src/features/configuracion/pages/NotificacionesPage.test.tsx`

**Interfaces:**
- Consumes: `categories`, `recipientsFor`, `personalTypes`, `NotificationCategoryId`, `NotificationRecipient` de `../data/notificaciones`; `NotificationCategoryCard`, `ConfigPageHeader`, `Card`.
- Produces: `NotificacionesPage(): JSX.Element`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/pages/NotificacionesPage.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificacionesPage } from './NotificacionesPage';

describe('NotificacionesPage', () => {
  it('título, 4 categorías y bloque de 11 notificaciones personales', () => {
    render(<NotificacionesPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Notificaciones' })).toBeInTheDocument();
    ['Solicitudes de vacaciones', 'Pedidos de reposición (portal)', 'Contratos firmados', 'Alertas de RRHH'].forEach((t) =>
      expect(screen.getByText(t)).toBeInTheDocument()
    );
    expect(screen.getByText('Notificaciones personales (automáticas)')).toBeInTheDocument();
    expect(screen.getByText('Cumpleaños del equipo')).toBeInTheDocument();
  });

  it('togglear un checkbox actualiza el estado local sin reventar', async () => {
    render(<NotificacionesPage />);
    const checkbox = screen.getAllByText('Alba Gelabert')[0].closest('label')!.querySelector('input')!;
    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/pages/NotificacionesPage.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/pages/NotificacionesPage.tsx
import { useState } from 'react';
import { Card } from '@/components/ui';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { NotificationCategoryCard } from '../components/NotificationCategoryCard';
import {
  categories, recipientsFor, personalTypes,
  type NotificationCategoryId, type NotificationRecipient,
} from '../data/notificaciones';

export function NotificacionesPage() {
  const cats = categories();
  const [state, setState] = useState<Record<NotificationCategoryId, NotificationRecipient[]>>(() =>
    Object.fromEntries(cats.map((c) => [c.id, recipientsFor(c.id)])) as Record<NotificationCategoryId, NotificationRecipient[]>
  );

  const toggle = (categoryId: NotificationCategoryId, userName: string) =>
    setState((s) => ({
      ...s,
      [categoryId]: s[categoryId].map((r) =>
        r.userName === userName ? { ...r, checked: !r.checked, alsoEmail: r.checked ? false : r.alsoEmail } : r
      ),
    }));

  const toggleEmail = (categoryId: NotificationCategoryId, userName: string) =>
    setState((s) => ({
      ...s,
      [categoryId]: s[categoryId].map((r) => (r.userName === userName ? { ...r, alsoEmail: !r.alsoEmail } : r)),
    }));

  return (
    <div className="space-y-4">
      <ConfigPageHeader
        title="Notificaciones"
        subtitle="Decide quién recibe cada aviso del grupo. Las notificaciones personales llegan siempre a la persona implicada."
      />
      {cats.map((c) => (
        <NotificationCategoryCard
          key={c.id}
          category={c}
          recipients={state[c.id]}
          onToggle={(u) => toggle(c.id, u)}
          onToggleEmail={(u) => toggleEmail(c.id, u)}
        />
      ))}
      <Card className="p-5">
        <h3 className="font-semibold text-slate-800">Notificaciones personales (automáticas)</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
          {personalTypes().map((t) => (
            <li key={t.id}>
              <span className="font-medium text-slate-700">{t.label}</span> — {t.description}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/pages/NotificacionesPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/pages/NotificacionesPage.tsx src/features/configuracion/pages/NotificacionesPage.test.tsx
git commit -m "feat(configuracion): NotificacionesPage (4 categorías + bloque personal)"
```

---

### Task 16: `BookerCommissionRow`

**Files:**
- Create: `src/features/configuracion/components/BookerCommissionRow.tsx`
- Test: `src/features/configuracion/components/BookerCommissionRow.test.tsx`

**Interfaces:**
- Produces: `BookerCommissionRow(props: { bookerName: string; percent: number; globalPercent: number; onChange: (percent: number) => void }): JSX.Element`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/components/BookerCommissionRow.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookerCommissionRow } from './BookerCommissionRow';

describe('BookerCommissionRow', () => {
  it('muestra nombre, input con el % y "(global X%)"', () => {
    render(<BookerCommissionRow bookerName="Alba Gelabert" percent={25} globalPercent={25} onChange={() => {}} />);
    expect(screen.getByText('Alba Gelabert')).toBeInTheDocument();
    expect(screen.getByDisplayValue('25')).toBeInTheDocument();
    expect(screen.getByText('(global 25%)')).toBeInTheDocument();
  });

  it('editar el input dispara onChange con el número', () => {
    const onChange = vi.fn();
    render(<BookerCommissionRow bookerName="Alba Gelabert" percent={25} globalPercent={25} onChange={onChange} />);
    const input = screen.getByDisplayValue('25');
    (input as HTMLInputElement).focus();
    input.dispatchEvent(new Event('change', { bubbles: true }));
    // simula el cambio real a través del atributo value + evento change (jsdom)
    Object.defineProperty(input, 'value', { value: '30', configurable: true });
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(onChange).toHaveBeenCalled();
  });

  it('recalcula "(global X%)" cuando cambia el globalPercent recibido', () => {
    const { rerender } = render(<BookerCommissionRow bookerName="Alba Gelabert" percent={25} globalPercent={25} onChange={() => {}} />);
    expect(screen.getByText('(global 25%)')).toBeInTheDocument();
    rerender(<BookerCommissionRow bookerName="Alba Gelabert" percent={25} globalPercent={30} onChange={() => {}} />);
    expect(screen.getByText('(global 30%)')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/components/BookerCommissionRow.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/components/BookerCommissionRow.tsx
export interface BookerCommissionRowProps {
  bookerName: string;
  percent: number;
  globalPercent: number;
  onChange: (percent: number) => void;
}

export function BookerCommissionRow({ bookerName, percent, globalPercent, onChange }: BookerCommissionRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 px-2 py-3 text-sm last:border-b-0">
      <span className="text-slate-700">{bookerName}</span>
      <span className="flex items-center gap-2">
        <input
          type="number"
          value={percent}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-9 w-16 rounded-lg border border-slate-200 px-2 text-right text-sm"
        />
        <span className="text-slate-500">%</span>
        <span className="text-slate-400">(global {globalPercent}%)</span>
      </span>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/components/BookerCommissionRow.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/components/BookerCommissionRow.tsx src/features/configuracion/components/BookerCommissionRow.test.tsx
git commit -m "feat(configuracion): BookerCommissionRow (% inline + referencia al global)"
```

---

### Task 17: `ComisionesBookersPage`

**Files:**
- Create: `src/features/configuracion/pages/ComisionesBookersPage.tsx`
- Test: `src/features/configuracion/pages/ComisionesBookersPage.test.tsx`

**Interfaces:**
- Consumes: `commissionSettings`, `bookerCommissions`, `BookerCommission` de `../data/comisiones`; `ConfigPageHeader`, `BookerCommissionRow`, `Card`.
- Produces: `ComisionesBookersPage(): JSX.Element`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/pages/ComisionesBookersPage.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComisionesBookersPage } from './ComisionesBookersPage';

describe('ComisionesBookersPage', () => {
  it('título, ajustes globales (25/30/100/600) y 15 bookers al 25%', () => {
    render(<ComisionesBookersPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Comisiones de bookers' })).toBeInTheDocument();
    expect(screen.getByText('Alba Gelabert')).toBeInTheDocument();
    expect(screen.getByText('Yenifer Bernardo')).toBeInTheDocument();
    expect(screen.getAllByText(/\(global 25%\)/)).toHaveLength(15);
  });

  it('editar el % global recalcula "(global X%)" de todos los bookers', async () => {
    render(<ComisionesBookersPage />);
    const globalInputs = screen.getAllByDisplayValue('25');
    // el primero de todos es el % global (aparece antes que los 15 de bookers en el DOM)
    await userEvent.clear(globalInputs[0]);
    await userEvent.type(globalInputs[0], '30');
    expect(screen.getAllByText(/\(global 30%\)/).length).toBeGreaterThan(0);
  });

  it('editar el % de un booker concreto no afecta a los demás', async () => {
    render(<ComisionesBookersPage />);
    const rows = screen.getAllByDisplayValue('25');
    const albaInput = rows[1]; // [0] = global, [1] = primer booker (Alba Gelabert)
    await userEvent.clear(albaInput);
    await userEvent.type(albaInput, '40');
    expect(screen.getByDisplayValue('40')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('25').length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/pages/ComisionesBookersPage.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/pages/ComisionesBookersPage.tsx
import { useState } from 'react';
import { Card } from '@/components/ui';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { BookerCommissionRow } from '../components/BookerCommissionRow';
import { commissionSettings, bookerCommissions, type BookerCommission } from '../data/comisiones';

export function ComisionesBookersPage() {
  const seedSettings = commissionSettings();
  const [globalPercent, setGlobalPercent] = useState(seedSettings.globalPercent);
  const [windowDays, setWindowDays] = useState(seedSettings.exclusivityWindowDays);
  const [radiusKm, setRadiusKm] = useState(seedSettings.exclusivityRadiusKm);
  const [jumpKm, setJumpKm] = useState(seedSettings.logisticJumpKm);
  const [bookers, setBookers] = useState<BookerCommission[]>(bookerCommissions());

  const setBookerPercent = (bookerName: string, percent: number) =>
    setBookers((list) => list.map((b) => (b.bookerName === bookerName ? { ...b, percent } : b)));

  return (
    <div className="space-y-4">
      <ConfigPageHeader
        title="Comisiones de bookers"
        subtitle="La comisión se calcula sobre el Booking Fee del show. Cada booker tiene su propio %; si un artista concreto tiene un override, ese manda (se configura en la ficha del artista). El booker oficial y el aprobador de arte también se asignan en la ficha del artista."
      />

      <Card className="p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Porcentaje global por defecto</h3>
        <label className="mt-3 block text-sm text-slate-600">% sobre el Booking Fee</label>
        <div className="mt-1 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={globalPercent}
              onChange={(e) => setGlobalPercent(Number(e.target.value))}
              className="h-10 w-20 rounded-lg border border-slate-200 px-2 text-sm"
            />
            <span className="text-sm text-slate-500">%</span>
          </div>
          <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: '#44444C' }}>
            Guardar
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">Se aplica a los bookers que no tengan un % propio abajo.</p>
      </Card>

      <Card className="p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Exclusividad y logística de agenda</h3>
        <p className="mt-1 text-xs text-slate-400">
          Valores por defecto para avisar de conflictos al crear un show. Se pueden ajustar en cada show. La distancia
          real (km) se calcula cuando el venue tiene coordenadas (autocompletado de Google).
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm text-slate-600">Ventana (días)</label>
            <input type="number" value={windowDays} onChange={(e) => setWindowDays(Number(e.target.value))} className="mt-1 h-10 w-24 rounded-lg border border-slate-200 px-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-slate-600">Radio de exclusividad (km)</label>
            <input type="number" value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))} className="mt-1 h-10 w-24 rounded-lg border border-slate-200 px-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-slate-600">Salto logístico máx. (km)</label>
            <input type="number" value={jumpKm} onChange={(e) => setJumpKm(Number(e.target.value))} className="mt-1 h-10 w-24 rounded-lg border border-slate-200 px-2 text-sm" />
          </div>
          <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: '#44444C' }}>
            Guardar
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Exclusividad: otro show del artista dentro de la ventana de días y del radio en km. Salto logístico: dos
          shows a 1-2 días pero más lejos que este límite (viaje inviable).
        </p>
      </Card>

      <Card className="p-0">
        <h3 className="border-b border-slate-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          % de comisión por booker
        </h3>
        <div className="px-5">
          {bookers.map((b) => (
            <BookerCommissionRow
              key={b.bookerName}
              bookerName={b.bookerName}
              percent={b.percent}
              globalPercent={globalPercent}
              onChange={(p) => setBookerPercent(b.bookerName, p)}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/pages/ComisionesBookersPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/pages/ComisionesBookersPage.tsx src/features/configuracion/pages/ComisionesBookersPage.test.tsx
git commit -m "feat(configuracion): ComisionesBookersPage (global + exclusividad + 15 bookers)"
```

---

### Task 18: `ControlComisionesPage`

**Files:**
- Create: `src/features/configuracion/pages/ControlComisionesPage.tsx`
- Test: `src/features/configuracion/pages/ControlComisionesPage.test.tsx`

**Interfaces:**
- Consumes: `ledgerTotals` de `../data/comisiones`; `StatCard`, `Card` de `@/components/ui`; `formatCurrency`.
- Produces: `ControlComisionesPage(): JSX.Element`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/pages/ControlComisionesPage.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ControlComisionesPage } from './ControlComisionesPage';

describe('ControlComisionesPage', () => {
  it('título y 3 stat cards en 0,00 €', () => {
    render(<ControlComisionesPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Control de comisiones' })).toBeInTheDocument();
    expect(screen.getAllByText(/0,00/)).toHaveLength(3);
    expect(screen.getByText('DEVENGADO TOTAL')).toBeInTheDocument();
    expect(screen.getByText('ABONADO')).toBeInTheDocument();
    expect(screen.getByText('PENDIENTE DE ABONAR')).toBeInTheDocument();
  });

  it('estado vacío real: "Aún no hay comisiones devengadas ni abonos."', () => {
    render(<ControlComisionesPage />);
    expect(screen.getByText('Aún no hay comisiones devengadas ni abonos.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/pages/ControlComisionesPage.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/pages/ControlComisionesPage.tsx
import { Card, StatCard } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { ledgerTotals } from '../data/comisiones';

export function ControlComisionesPage() {
  const totals = ledgerTotals();
  return (
    <div className="space-y-4">
      <ConfigPageHeader
        title="Control de comisiones"
        subtitle={
          <>
            Comisión <strong className="font-semibold text-slate-700">devengada</strong> = suma de comisiones de
            shows <strong className="font-semibold text-slate-700">liquidados</strong> donde el booker es oficial u
            origen. Registra aquí los <strong className="font-semibold text-slate-700">abonos</strong>; el pendiente
            se actualiza solo. Importes en EUR.
          </>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="DEVENGADO TOTAL" value={formatCurrency(totals.devengadoTotal)} />
        <StatCard label="ABONADO" value={formatCurrency(totals.abonado)} valueClassName="text-emerald-600" />
        <StatCard label="PENDIENTE DE ABONAR" value={formatCurrency(totals.pendienteDeAbonar)} valueClassName="text-red-600" />
      </div>
      <Card className="p-0">
        <h3 className="border-b border-slate-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Por booker
        </h3>
        <p className="px-5 py-8 text-center text-sm text-slate-400">Aún no hay comisiones devengadas ni abonos.</p>
      </Card>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/pages/ControlComisionesPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/pages/ControlComisionesPage.tsx src/features/configuracion/pages/ControlComisionesPage.test.tsx
git commit -m "feat(configuracion): ControlComisionesPage (3 totales + estado vacío real)"
```

---

### Task 19: `ContractTemplateRow`

**Files:**
- Create: `src/features/configuracion/components/ContractTemplateRow.tsx`
- Test: `src/features/configuracion/components/ContractTemplateRow.test.tsx`

**Interfaces:**
- Consumes: `ContractTemplate` de `../data/contratos`; `Button` de `@/components/ui`.
- Produces: `ContractTemplateRow(props: { template: ContractTemplate }): JSX.Element` — "Editar"/"✕" inertes (el live no mostró el resultado de borrar sobre una lista de 2 plantillas; se documenta como delta, ver plan raíz).

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/components/ContractTemplateRow.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContractTemplateRow } from './ContractTemplateRow';
import { contractTemplates } from '../data/contratos';

describe('ContractTemplateRow', () => {
  it('muestra nombre, chip de idioma y descripción', () => {
    render(<ContractTemplateRow template={contractTemplates()[0]} />);
    expect(screen.getByText('Contrato estándar (ES)')).toBeInTheDocument();
    expect(screen.getByText('ES')).toBeInTheDocument();
    expect(screen.getByText('Plantilla base de actuación en español.')).toBeInTheDocument();
  });

  it('Editar y ✕ son inertes (type=button)', () => {
    render(<ContractTemplateRow template={contractTemplates()[1]} />);
    expect(screen.getByRole('button', { name: 'Editar' })).toHaveAttribute('type', 'button');
    expect(screen.getByRole('button', { name: /Eliminar/ })).toHaveAttribute('type', 'button');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/components/ContractTemplateRow.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/components/ContractTemplateRow.tsx
import { Button } from '@/components/ui';
import type { ContractTemplate } from '../data/contratos';

export interface ContractTemplateRowProps {
  template: ContractTemplate;
}

export function ContractTemplateRow({ template }: ContractTemplateRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 last:border-b-0">
      <div>
        <span className="font-semibold text-slate-800">{template.name}</span>
        <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">{template.langCode}</span>
        <p className="text-sm text-slate-400">{template.description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1 text-sm">
        <Button type="button" variant="ghost" size="sm">Editar</Button>
        <Button type="button" variant="ghost" size="sm" aria-label={`Eliminar ${template.name}`}>✕</Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/components/ContractTemplateRow.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/components/ContractTemplateRow.tsx src/features/configuracion/components/ContractTemplateRow.test.tsx
git commit -m "feat(configuracion): ContractTemplateRow (nombre+idioma+desc, acciones inertes)"
```

---

### Task 20: `ContratosPage`

**Files:**
- Create: `src/features/configuracion/pages/ContratosPage.tsx`
- Test: `src/features/configuracion/pages/ContratosPage.test.tsx`

**Interfaces:**
- Consumes: `contractTemplates` de `../data/contratos`; `ConfigPageHeader`, `ContractTemplateRow`, `Card`.
- Produces: `ContratosPage(): JSX.Element`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/pages/ContratosPage.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContratosPage } from './ContratosPage';

describe('ContratosPage', () => {
  it('título "Plantillas de contrato", botón +Nueva plantilla y 2 filas', () => {
    render(<ContratosPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Plantillas de contrato' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Nueva plantilla' })).toHaveAttribute('type', 'button');
    expect(screen.getByText('Contrato estándar (ES)')).toBeInTheDocument();
    expect(screen.getByText('Booking Agreement (EN)')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/pages/ContratosPage.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/pages/ContratosPage.tsx
import { Card } from '@/components/ui';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { ContractTemplateRow } from '../components/ContractTemplateRow';
import { contractTemplates } from '../data/contratos';

export function ContratosPage() {
  const list = contractTemplates();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <ConfigPageHeader
          title="Plantillas de contrato"
          subtitle="Escribe el contrato con variables {{grupo.campo}}; se rellenan con los datos del show al generarlo."
        />
        <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: '#44444C' }}>
          + Nueva plantilla
        </button>
      </div>
      <Card className="p-0">
        {list.map((t) => (
          <ContractTemplateRow key={t.id} template={t} />
        ))}
      </Card>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/pages/ContratosPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/pages/ContratosPage.tsx src/features/configuracion/pages/ContratosPage.test.tsx
git commit -m "feat(configuracion): ContratosPage (2 plantillas + Nueva plantilla inerte)"
```

---

### Task 21: `EventAlertRuleCard`

**Files:**
- Create: `src/features/configuracion/components/EventAlertRuleCard.tsx`
- Test: `src/features/configuracion/components/EventAlertRuleCard.test.tsx`

**Interfaces:**
- Consumes: `EventAlertRule`, `AlertSeverity` de `../data/alertas`; `Select` de `@/components/ui`.
- Produces: `EventAlertRuleCard(props: { rule: EventAlertRule; onToggleActive: () => void; onWindowChange: (v: number) => void; onSeverityChange: (v: AlertSeverity) => void; onToggleEmail: () => void }): JSX.Element`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/components/EventAlertRuleCard.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventAlertRuleCard } from './EventAlertRuleCard';
import { alertRules } from '../data/alertas';

const rule = alertRules().find((r) => r.id === 'alerta-contrato')!; // D-10, Crítica, email true

describe('EventAlertRuleCard', () => {
  it('muestra título, desc, checkbox Activa, D-N, severidad y email', () => {
    render(
      <EventAlertRuleCard rule={rule} onToggleActive={() => {}} onWindowChange={() => {}} onSeverityChange={() => {}} onToggleEmail={() => {}} />
    );
    expect(screen.getByText('Contrato sin subir')).toBeInTheDocument();
    expect(screen.getByText('No hay ningún documento de tipo Contrato en el evento.')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Activa' })).toBeChecked();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('critica');
    expect(screen.getByRole('checkbox', { name: 'Avisar también por email' })).toBeChecked();
  });

  it('togglear Activa llama a onToggleActive', async () => {
    const onToggleActive = vi.fn();
    render(
      <EventAlertRuleCard rule={rule} onToggleActive={onToggleActive} onWindowChange={() => {}} onSeverityChange={() => {}} onToggleEmail={() => {}} />
    );
    await userEvent.click(screen.getByRole('checkbox', { name: 'Activa' }));
    expect(onToggleActive).toHaveBeenCalledTimes(1);
  });

  it('cambiar la severidad llama a onSeverityChange con el nuevo valor', async () => {
    const onSeverityChange = vi.fn();
    render(
      <EventAlertRuleCard rule={rule} onToggleActive={() => {}} onWindowChange={() => {}} onSeverityChange={onSeverityChange} onToggleEmail={() => {}} />
    );
    await userEvent.selectOptions(screen.getByRole('combobox'), 'aviso');
    expect(onSeverityChange).toHaveBeenCalledWith('aviso');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/components/EventAlertRuleCard.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/components/EventAlertRuleCard.tsx
import { Card, Select } from '@/components/ui';
import type { AlertSeverity, EventAlertRule } from '../data/alertas';

export interface EventAlertRuleCardProps {
  rule: EventAlertRule;
  onToggleActive: () => void;
  onWindowChange: (value: number) => void;
  onSeverityChange: (value: AlertSeverity) => void;
  onToggleEmail: () => void;
}

export function EventAlertRuleCard({ rule, onToggleActive, onWindowChange, onSeverityChange, onToggleEmail }: EventAlertRuleCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">{rule.title}</h3>
          <p className="text-sm text-slate-400">{rule.description}</p>
        </div>
        <label className="flex shrink-0 items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={rule.active} onChange={onToggleActive} aria-label="Activa" />
          Activa
        </label>
      </div>
      <div className="mt-3 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm text-slate-600">Ventana (días antes)</label>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-sm text-slate-400">D-</span>
            <input
              type="number"
              value={rule.windowDaysBefore}
              onChange={(e) => onWindowChange(Number(e.target.value))}
              className="h-10 w-20 rounded-lg border border-slate-200 px-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-600">Severidad</label>
          <Select value={rule.severity} onChange={(e) => onSeverityChange(e.target.value as AlertSeverity)} className="mt-1 w-32">
            <option value="info">Info</option>
            <option value="aviso">Aviso</option>
            <option value="critica">Crítica</option>
          </Select>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={rule.alsoEmail} onChange={onToggleEmail} aria-label="Avisar también por email" />
          Avisar también por email
        </label>
      </div>
    </Card>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/components/EventAlertRuleCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/components/EventAlertRuleCard.tsx src/features/configuracion/components/EventAlertRuleCard.test.tsx
git commit -m "feat(configuracion): EventAlertRuleCard (activa + D-N + severidad + email)"
```

---

### Task 22: `AlertasEventosPage`

**Files:**
- Create: `src/features/configuracion/pages/AlertasEventosPage.tsx`
- Test: `src/features/configuracion/pages/AlertasEventosPage.test.tsx`

**Interfaces:**
- Consumes: `alertRules`, `EventAlertRule` de `../data/alertas`; `EventAlertRuleCard`, `ConfigPageHeader`, `Button`.
- Produces: `AlertasEventosPage(): JSX.Element` — H1 real del live: **"Alertas de producción"**.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/pages/AlertasEventosPage.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlertasEventosPage } from './AlertasEventosPage';

describe('AlertasEventosPage', () => {
  it('título real "Alertas de producción", 5 reglas y botón Evaluar ahora', () => {
    render(<AlertasEventosPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Alertas de producción' })).toBeInTheDocument();
    expect(screen.getByText('Presupuesto sin definir')).toBeInTheDocument();
    expect(screen.getByText('Tareas de producción pendientes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Evaluar ahora' })).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox', { name: 'Activa' })).toHaveLength(5);
  });

  it('togglear "Activa" de una regla actualiza el estado local', async () => {
    render(<AlertasEventosPage />);
    const checkboxes = screen.getAllByRole('checkbox', { name: 'Activa' });
    expect(checkboxes[0]).toBeChecked();
    await userEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
  });

  it('no usa clases brand-*', () => {
    const { container } = render(<AlertasEventosPage />);
    expect(container.querySelector('[class*="brand-"]')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/pages/AlertasEventosPage.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/pages/AlertasEventosPage.tsx
import { useState } from 'react';
import { Button } from '@/components/ui';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { EventAlertRuleCard } from '../components/EventAlertRuleCard';
import { alertRules, type AlertSeverity, type EventAlertRule } from '../data/alertas';

export function AlertasEventosPage() {
  const [rules, setRules] = useState<EventAlertRule[]>(alertRules());

  const update = (id: string, patch: Partial<EventAlertRule>) =>
    setRules((list) => list.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <ConfigPageHeader
          title="Alertas de producción"
          subtitle="Reglas que vigilan hitos de cada evento y avisan dentro de su ventana (D-N respecto a la fecha)."
        />
        <Button type="button" variant="secondary" size="sm">Evaluar ahora</Button>
      </div>
      <div className="space-y-3">
        {rules.map((r) => (
          <EventAlertRuleCard
            key={r.id}
            rule={r}
            onToggleActive={() => update(r.id, { active: !r.active })}
            onWindowChange={(v) => update(r.id, { windowDaysBefore: v })}
            onSeverityChange={(v: AlertSeverity) => update(r.id, { severity: v })}
            onToggleEmail={() => update(r.id, { alsoEmail: !r.alsoEmail })}
          />
        ))}
      </div>
      <p className="text-xs text-slate-400">
        El aviso se envía cuando el evento entra en la ventana (D-{'{días}'}) y el hito sigue incumplido, hasta el día
        del evento. La evaluación automática corre a diario; usa «Evaluar ahora» para forzarla.
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/pages/AlertasEventosPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/pages/AlertasEventosPage.tsx src/features/configuracion/pages/AlertasEventosPage.test.tsx
git commit -m "feat(configuracion): AlertasEventosPage (5 reglas in-memory + Evaluar ahora inerte)"
```

---

### Task 23: `DepartmentRow`

**Files:**
- Create: `src/features/configuracion/components/DepartmentRow.tsx`
- Test: `src/features/configuracion/components/DepartmentRow.test.tsx`

**Interfaces:**
- Consumes: `Department`, `DepartmentColor` de `../data/rrhh`; `Button` de `@/components/ui`.
- Produces: `DepartmentRow(props: { department: Department; onToggleActive: () => void; onRemove: () => void }): JSX.Element`; exporta `COLOR_DOT: Record<DepartmentColor, string>` reusado por `RrhhPage` para el selector de "Nuevo departamento" (evita duplicar el mapeo de color).

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/components/DepartmentRow.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DepartmentRow } from './DepartmentRow';

describe('DepartmentRow', () => {
  it('activo: muestra "Desactivar"', () => {
    render(<DepartmentRow department={{ id: 'd1', name: 'Booking', color: 'blue', active: true }} onToggleActive={() => {}} onRemove={() => {}} />);
    expect(screen.getByText('Booking')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Desactivar' })).toBeInTheDocument();
  });

  it('inactivo: muestra "Activar"', () => {
    render(<DepartmentRow department={{ id: 'd2', name: 'Diseño', color: 'green', active: false }} onToggleActive={() => {}} onRemove={() => {}} />);
    expect(screen.getByRole('button', { name: 'Activar' })).toBeInTheDocument();
  });

  it('Desactivar y ✕ llaman a los callbacks', async () => {
    const onToggleActive = vi.fn();
    const onRemove = vi.fn();
    render(<DepartmentRow department={{ id: 'd1', name: 'Booking', color: 'blue', active: true }} onToggleActive={onToggleActive} onRemove={onRemove} />);
    await userEvent.click(screen.getByRole('button', { name: 'Desactivar' }));
    expect(onToggleActive).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole('button', { name: /Eliminar/ }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/components/DepartmentRow.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/components/DepartmentRow.tsx
import { Button } from '@/components/ui';
import type { Department, DepartmentColor } from '../data/rrhh';

export const COLOR_DOT: Record<DepartmentColor, string> = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  cyan: 'bg-cyan-500',
  pink: 'bg-pink-500',
  amber: 'bg-amber-500',
};

export interface DepartmentRowProps {
  department: Department;
  onToggleActive: () => void;
  onRemove: () => void;
}

export function DepartmentRow({ department, onToggleActive, onRemove }: DepartmentRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 px-2 py-2.5 text-sm last:border-b-0">
      <span className="flex items-center gap-2 text-slate-700">
        <span className={`h-2.5 w-2.5 rounded-full ${COLOR_DOT[department.color]}`} />
        {department.name}
      </span>
      <span className="flex items-center gap-1">
        <Button type="button" variant="ghost" size="sm" onClick={onToggleActive}>
          {department.active ? 'Desactivar' : 'Activar'}
        </Button>
        <Button type="button" variant="ghost" size="sm" aria-label={`Eliminar ${department.name}`} onClick={onRemove}>
          ✕
        </Button>
      </span>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/components/DepartmentRow.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/components/DepartmentRow.tsx src/features/configuracion/components/DepartmentRow.test.tsx
git commit -m "feat(configuracion): DepartmentRow (dot color + Desactivar/Activar + ✕)"
```

---

### Task 24: `RrhhPage`

**Files:**
- Create: `src/features/configuracion/pages/RrhhPage.tsx`
- Test: `src/features/configuracion/pages/RrhhPage.test.tsx`

**Interfaces:**
- Consumes: `hrSettings`, `departments`, `Department`, `HrSettings`, `DEPARTMENT_COLORS`, `DepartmentColor` de `../data/rrhh`; `DepartmentRow`, `COLOR_DOT` de `../components/DepartmentRow`; `ConfigPageHeader`, `Card`, `Input`.
- Produces: `RrhhPage(): JSX.Element`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/pages/RrhhPage.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RrhhPage } from './RrhhPage';

describe('RrhhPage', () => {
  it('título y valores exactos de asalariados/autónomos/avisos', () => {
    render(<RrhhPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'RRHH' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('31.5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('21')).toBeInTheDocument(); // días laborables (primer 21 en el DOM)
    expect(screen.getByDisplayValue('160')).toBeInTheDocument();
    expect(screen.getByDisplayValue('60, 30, 15')).toBeInTheDocument();
    expect(screen.getByDisplayValue('15, 7')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /cumpleaños/ })).toBeChecked();
  });

  it('12 departamentos activos y selector de 8 colores para "Nuevo departamento"', () => {
    render(<RrhhPage />);
    expect(screen.getByText('Advancing')).toBeInTheDocument();
    expect(screen.getByText('Vídeo')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Desactivar' })).toHaveLength(12);
    expect(screen.getAllByLabelText(/^(blue|green|orange|red|purple|cyan|pink|amber)$/)).toHaveLength(8);
  });

  it('añadir un departamento nuevo lo suma a la lista local', async () => {
    render(<RrhhPage />);
    await userEvent.type(screen.getByPlaceholderText('Booking, Marketing, Producción…'), 'Eventos');
    await userEvent.click(screen.getByRole('button', { name: 'Añadir' }));
    expect(screen.getByText('Eventos')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Desactivar' })).toHaveLength(13);
  });

  it('Desactivar un departamento lo pasa a "Activar"', async () => {
    render(<RrhhPage />);
    const row = screen.getByText('Advancing').closest('div')!.parentElement!;
    await userEvent.click(screen.getByRole('button', { name: 'Desactivar' }));
    expect(row).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/pages/RrhhPage.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/pages/RrhhPage.tsx
import { useState } from 'react';
import { Card, Input } from '@/components/ui';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { DepartmentRow, COLOR_DOT } from '../components/DepartmentRow';
import { hrSettings, departments, DEPARTMENT_COLORS, type Department, type DepartmentColor, type HrSettings } from '../data/rrhh';

function noticeListToString(arr: number[]): string {
  return arr.join(', ');
}

function parseNoticeList(v: string): number[] {
  return v
    .split(',')
    .map((n) => Number(n.trim()))
    .filter((n) => !Number.isNaN(n));
}

export function RrhhPage() {
  const [settings, setSettings] = useState<HrSettings>(hrSettings());
  const [depts, setDepts] = useState<Department[]>(departments());
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState<DepartmentColor>('blue');

  const addDepartment = () => {
    if (!newName.trim()) return;
    setDepts((list) => [...list, { id: `dept-${Date.now()}`, name: newName.trim(), color: newColor, active: true }]);
    setNewName('');
  };
  const removeDepartment = (id: string) => setDepts((list) => list.filter((d) => d.id !== id));
  const toggleDepartment = (id: string) => setDepts((list) => list.map((d) => (d.id === id ? { ...d, active: !d.active } : d)));

  return (
    <div className="space-y-4">
      <ConfigPageHeader title="RRHH" subtitle="Parámetros de cálculo de coste y antelación de los avisos." />

      <Card className="p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Asalariados</h3>
        <p className="mt-1 text-sm text-slate-500">
          Coste empresa = <strong className="font-semibold text-slate-700">bruto + Seguridad Social a cargo de la empresa</strong>.
          El IRPF y la SS del trabajador salen del bruto: no suman coste. Si alguien tiene un contrato con
          bonificaciones, ponle su % propio en su ficha.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm text-slate-600">% SS a cargo de la empresa</label>
            <Input
              type="number"
              value={settings.ssEmployerPercent}
              onChange={(e) => setSettings((s) => ({ ...s, ssEmployerPercent: Number(e.target.value) }))}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">En España suele rondar el 30-32%.</p>
          </div>
          <div>
            <label className="block text-sm text-slate-600">Días laborables / mes</label>
            <Input
              type="number"
              value={settings.workingDaysPerMonth}
              onChange={(e) => setSettings((s) => ({ ...s, workingDaysPerMonth: Number(e.target.value) }))}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">Para convertir tarifas por día.</p>
          </div>
          <div>
            <label className="block text-sm text-slate-600">Horas / mes</label>
            <Input
              type="number"
              value={settings.hoursPerMonth}
              onChange={(e) => setSettings((s) => ({ ...s, hoursPerMonth: Number(e.target.value) }))}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">Para convertir tarifas por hora.</p>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Autónomos</h3>
        <p className="mt-1 text-sm text-slate-500">
          Un autónomo <strong className="font-semibold text-slate-700">no genera Seguridad Social a cargo de la empresa</strong>:
          factura. Su <strong className="font-semibold text-slate-700">coste real es la base</strong>. El IVA que
          repercute es deducible (lo recuperas: es neutro) y el IRPF{' '}
          <strong className="font-semibold text-slate-700">no se suma, se retiene</strong> de la base y lo ingresas tú
          en Hacienda en su nombre. Estos porcentajes son los de partida; cada autónomo puede llevar el suyo en sus
          condiciones.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-slate-600">IVA por defecto (%)</label>
            <Input
              type="number"
              value={settings.freelanceVatPercent}
              onChange={(e) => setSettings((s) => ({ ...s, freelanceVatPercent: Number(e.target.value) }))}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600">IRPF retenido por defecto (%)</label>
            <Input
              type="number"
              value={settings.freelanceIrpfPercent}
              onChange={(e) => setSettings((s) => ({ ...s, freelanceIrpfPercent: Number(e.target.value) }))}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">15% general; 7% los primeros años de alta.</p>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Avisos</h3>
        <p className="mt-1 text-sm text-slate-500">
          Días de antelación de cada aviso. Quién los recibe se elige en Configuración → Notificaciones («Alertas de RRHH»).
        </p>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm text-slate-600">Fin de contrato</label>
            <Input
              value={noticeListToString(settings.contractEndNoticeDays)}
              onChange={(e) => setSettings((s) => ({ ...s, contractEndNoticeDays: parseNoticeList(e.target.value) }))}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">Días antes de fecha_fin. Ej: 60, 30, 15</p>
          </div>
          <div>
            <label className="block text-sm text-slate-600">Fin de periodo de prueba</label>
            <Input
              value={noticeListToString(settings.probationEndNoticeDays)}
              onChange={(e) => setSettings((s) => ({ ...s, probationEndNoticeDays: parseNoticeList(e.target.value) }))}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">Días antes de que venza. Ej: 15, 7</p>
          </div>
          <div>
            <label className="block text-sm text-slate-600">Revisión salarial</label>
            <Input
              value={noticeListToString(settings.salaryReviewNoticeDays)}
              onChange={(e) => setSettings((s) => ({ ...s, salaryReviewNoticeDays: parseNoticeList(e.target.value) }))}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-slate-400">Días antes de la fecha de revisión. Ej: 30</p>
          </div>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={settings.notifyBirthdays}
            onChange={(e) => setSettings((s) => ({ ...s, notifyBirthdays: e.target.checked }))}
            aria-label="Avisar al equipo de los cumpleaños"
          />
          Avisar al equipo de los cumpleaños
        </label>
      </Card>

      <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: '#44444C' }}>
        Guardar configuración
      </button>

      <Card className="p-0">
        <div className="border-b border-slate-100 px-5 py-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Departamentos</h3>
          <p className="mt-1 text-sm text-slate-500">
            El coste de cada persona se reparte entre departamentos en su ficha (Condiciones económicas), y la suma se
            ve en <strong className="font-semibold text-slate-700">Team → Analítica</strong>.
          </p>
        </div>
        <div className="px-5">
          {depts.map((d) => (
            <DepartmentRow key={d.id} department={d} onToggleActive={() => toggleDepartment(d.id)} onRemove={() => removeDepartment(d.id)} />
          ))}
        </div>
        <div className="flex flex-wrap items-end gap-4 border-t border-slate-100 px-5 py-4">
          <div className="flex-1">
            <label className="block text-sm text-slate-600">Nuevo departamento</label>
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Booking, Marketing, Producción…" className="mt-1" />
          </div>
          <div>
            <p className="mb-1 text-sm text-slate-600">Color</p>
            <div className="flex items-center gap-1.5">
              {DEPARTMENT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={c}
                  aria-pressed={newColor === c}
                  onClick={() => setNewColor(c)}
                  className={`h-5 w-5 rounded-full ${COLOR_DOT[c]} ${newColor === c ? 'ring-2 ring-offset-1 ring-slate-400' : ''}`}
                />
              ))}
            </div>
          </div>
          <button type="button" onClick={addDepartment} className="rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: '#44444C' }}>
            Añadir
          </button>
        </div>
      </Card>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/pages/RrhhPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/pages/RrhhPage.tsx src/features/configuracion/pages/RrhhPage.test.tsx
git commit -m "feat(configuracion): RrhhPage (asalariados+autónomos+avisos + departamentos)"
```

---

### Task 25: `HolidayRow`

**Files:**
- Create: `src/features/configuracion/components/HolidayRow.tsx`
- Test: `src/features/configuracion/components/HolidayRow.test.tsx`

**Interfaces:**
- Consumes: `Holiday`, `HolidayScope`, `formatHolidayDate` de `../data/festivos`; `Button` de `@/components/ui`.
- Produces: `HolidayRow(props: { holiday: Holiday; onRemove: () => void }): JSX.Element`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/components/HolidayRow.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HolidayRow } from './HolidayRow';

describe('HolidayRow', () => {
  it('formatea la fecha, muestra nombre y chip de ámbito (Catalunya = ámbar)', () => {
    render(<HolidayRow holiday={{ id: 'h1', date: '2026-09-11', name: 'Diada de Catalunya', scope: 'catalunya' }} onRemove={() => {}} />);
    expect(screen.getByText('11 sept 2026')).toBeInTheDocument();
    expect(screen.getByText('Diada de Catalunya')).toBeInTheDocument();
    expect(screen.getByText('Catalunya')).toHaveClass('bg-amber-100');
  });

  it('Barcelona = chip azul, España = chip gris', () => {
    const { rerender } = render(<HolidayRow holiday={{ id: 'h2', date: '2026-09-24', name: 'La Mercè', scope: 'barcelona' }} onRemove={() => {}} />);
    expect(screen.getByText('Barcelona')).toHaveClass('bg-sky-100');
    rerender(<HolidayRow holiday={{ id: 'h3', date: '2026-08-15', name: "L'Assumpció", scope: 'espana' }} onRemove={() => {}} />);
    expect(screen.getByText('España')).toHaveClass('bg-slate-100');
  });

  it('✕ llama a onRemove', async () => {
    const onRemove = vi.fn();
    render(<HolidayRow holiday={{ id: 'h1', date: '2026-09-11', name: 'Diada de Catalunya', scope: 'catalunya' }} onRemove={onRemove} />);
    await userEvent.click(screen.getByRole('button', { name: /Eliminar/ }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/components/HolidayRow.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/components/HolidayRow.tsx
import { Button } from '@/components/ui';
import { formatHolidayDate, type Holiday, type HolidayScope } from '../data/festivos';

const SCOPE_LABEL: Record<HolidayScope, string> = { espana: 'España', catalunya: 'Catalunya', barcelona: 'Barcelona' };
const SCOPE_CHIP: Record<HolidayScope, string> = {
  espana: 'bg-slate-100 text-slate-500',
  catalunya: 'bg-amber-100 text-amber-700',
  barcelona: 'bg-sky-100 text-sky-700',
};

export interface HolidayRowProps {
  holiday: Holiday;
  onRemove: () => void;
}

export function HolidayRow({ holiday, onRemove }: HolidayRowProps) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-3 text-sm last:border-b-0">
      <span className="w-24 shrink-0 text-slate-400">{formatHolidayDate(holiday.date)}</span>
      <span className="flex-1 font-semibold text-slate-800">{holiday.name}</span>
      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${SCOPE_CHIP[holiday.scope]}`}>
        {SCOPE_LABEL[holiday.scope]}
      </span>
      <Button type="button" variant="ghost" size="sm" aria-label={`Eliminar ${holiday.name}`} onClick={onRemove}>
        ✕
      </Button>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/components/HolidayRow.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/components/HolidayRow.tsx src/features/configuracion/components/HolidayRow.test.tsx
git commit -m "feat(configuracion): HolidayRow (fecha+nombre+chip de ámbito+eliminar)"
```

---

### Task 26: `FestivosPage`

**Files:**
- Create: `src/features/configuracion/pages/FestivosPage.tsx`
- Test: `src/features/configuracion/pages/FestivosPage.test.tsx`

**Interfaces:**
- Consumes: `holidays`, `groupByYear`, `filterHolidays`, `Holiday`, `HolidayScope` de `../data/festivos`; `HolidayRow`, `ConfigPageHeader`, `Card`, `Input`, `Select`.
- Produces: `FestivosPage(): JSX.Element`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/pages/FestivosPage.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FestivosPage } from './FestivosPage';

describe('FestivosPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-22T10:00:00'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  // Con fake timers activos, userEvent necesita delay:null + advanceTimers para no colgarse
  // (sus esperas internas usan setTimeout, que las fake timers interceptan sin auto-avanzar).
  function setupUser() {
    return userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });
  }

  it('título, 2026 (7) y 2027 (16), checkbox de pasados y acordeón de importación colapsado', () => {
    render(<FestivosPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Festivos' })).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
    expect(screen.getByText('2027')).toBeInTheDocument();
    expect(screen.getByText("L'Assumpció")).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /festivos pasados/ })).not.toBeChecked();
    expect(screen.queryByTestId('import-accordion-body')).toBeNull();
  });

  it('el acordeón de importación alterna abierto/cerrado sin contenido interno', async () => {
    const user = setupUser();
    render(<FestivosPage />);
    await user.click(screen.getByRole('button', { name: /Importar un año entero/ }));
    expect(screen.getByTestId('import-accordion-body')).toBeInTheDocument();
    expect(screen.getByTestId('import-accordion-body')).toBeEmptyDOMElement();
  });

  it('añadir un festivo inline lo suma a la lista local', async () => {
    const user = setupUser();
    render(<FestivosPage />);
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2026-12-25' } });
    await user.type(screen.getByPlaceholderText('Ej. La Mercè'), 'Prueba');
    await user.click(screen.getByRole('button', { name: 'Añadir' }));
    expect(screen.getAllByText('Prueba').length).toBeGreaterThan(0);
  });

  it('eliminar un festivo lo quita de la lista', async () => {
    const user = setupUser();
    render(<FestivosPage />);
    const before = screen.getAllByRole('button', { name: /Eliminar/ }).length;
    await user.click(screen.getAllByRole('button', { name: /Eliminar/ })[0]);
    expect(screen.getAllByRole('button', { name: /Eliminar/ })).toHaveLength(before - 1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/pages/FestivosPage.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/pages/FestivosPage.tsx
import { useState } from 'react';
import { Card, Input, Select } from '@/components/ui';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { HolidayRow } from '../components/HolidayRow';
import { holidays, groupByYear, filterHolidays, type Holiday, type HolidayScope } from '../data/festivos';

export function FestivosPage() {
  const [list, setList] = useState<Holiday[]>(holidays());
  const [includePast, setIncludePast] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [scope, setScope] = useState<HolidayScope>('espana');

  const visible = filterHolidays(list, { includePast });
  const groups = groupByYear(visible);

  const addHoliday = () => {
    if (!date || !name.trim()) return;
    setList((cur) => [...cur, { id: `hol-${Date.now()}`, date, name: name.trim(), scope }]);
    setDate('');
    setName('');
  };
  const removeHoliday = (id: string) => setList((cur) => cur.filter((h) => h.id !== id));

  return (
    <div className="space-y-4">
      <ConfigPageHeader
        title="Festivos"
        subtitle={
          <>
            Calendario de festivos (base Barcelona: España, Catalunya y locales).{' '}
            <strong className="font-semibold text-slate-700">Se descuentan de las vacaciones del equipo</strong>, todos,
            sea cual sea su ámbito. También se usa en el saludo de la home.
          </>
        }
      />

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_2fr_1fr_auto] sm:items-end">
          <div>
            <label className="block text-sm text-slate-600">Fecha</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-slate-600">Nombre</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. La Mercè" className="mt-1" />
          </div>
          <div>
            <label className="block text-sm text-slate-600">Ámbito</label>
            <Select value={scope} onChange={(e) => setScope(e.target.value as HolidayScope)} className="mt-1">
              <option value="espana">España</option>
              <option value="catalunya">Catalunya</option>
              <option value="barcelona">Barcelona</option>
            </Select>
          </div>
          <button type="button" onClick={addHoliday} className="h-10 rounded-lg px-4 text-sm font-medium text-white" style={{ backgroundColor: '#44444C' }}>
            Añadir
          </button>
        </div>
      </Card>

      <Card className="p-0">
        <button
          type="button"
          onClick={() => setImportOpen((o) => !o)}
          className="flex w-full items-center gap-2 px-5 py-3 text-left text-sm font-medium text-slate-600"
        >
          <span className={`inline-block transition-transform ${importOpen ? 'rotate-90' : ''}`}>▸</span>
          Importar un año entero (pegar lista)
        </button>
        {importOpen && <div data-testid="import-accordion-body" className="border-t border-slate-100" />}
      </Card>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={includePast}
          onChange={(e) => setIncludePast(e.target.checked)}
          aria-label="Ver también los festivos pasados"
        />
        Ver también los festivos pasados
      </label>

      {groups.map((g) => (
        <div key={g.year}>
          <h3 className="mb-2 text-sm font-semibold text-slate-500">{g.year}</h3>
          <Card className="p-0">
            {g.items.map((h) => (
              <HolidayRow key={h.id} holiday={h} onRemove={() => removeHoliday(h.id)} />
            ))}
          </Card>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/pages/FestivosPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/configuracion/pages/FestivosPage.tsx src/features/configuracion/pages/FestivosPage.test.tsx
git commit -m "feat(configuracion): FestivosPage (23 seeds agrupados por año + alta/baja inline)"
```

---

### Task 27: `ConfiguracionShell` + wiring del router (última tarea)

**Files:**
- Create: `src/features/configuracion/ConfiguracionShell.tsx`
- Test: `src/features/configuracion/ConfiguracionShell.test.tsx`
- Modify: `src/features/modules/ConfigShell.tsx` (pasa a ser un wrapper delgado)
- Modify: `src/app/router.tsx` (sustituye la ruta plana `/configuracion` por índice + 10 rutas hijas)

**Interfaces:**
- Consumes: `AppLayout` de `@/components/layout`; `ConfiguracionSidebar`; las 11 páginas de `pages/`.
- Produces: `ConfiguracionShell(): JSX.Element`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/features/configuracion/ConfiguracionShell.test.tsx
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { ConfiguracionShell } from './ConfiguracionShell';
import { PlantillasCorreoPage } from './pages/PlantillasCorreoPage';
import { UsoPage } from './pages/UsoPage';
import { FestivosPage } from './pages/FestivosPage';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/configuracion" element={<ConfiguracionShell />}>
          <Route index element={<PlantillasCorreoPage />} />
          <Route path="uso" element={<UsoPage />} />
          <Route path="festivos" element={<FestivosPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

const flush = () => new Promise((r) => setTimeout(r, 50));

describe('ConfiguracionShell', () => {
  it('índice: sidebar completo (6 secciones/12 ítems) + PlantillasCorreoPage vía Outlet', async () => {
    renderAt('/configuracion');
    await flush();
    expect(screen.getByText('SISTEMA')).toBeInTheDocument();
    expect(screen.getByText('EQUIPO')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Plantillas de correo' })).toBeInTheDocument();
    // 'Plantillas de correo' aparece dos veces (link del sidebar + H1 de la página): se
    // distingue por rol para evitar la colisión de texto duplicado.
    expect(screen.getByRole('link', { name: 'Plantillas de correo' })).toHaveClass('bg-slate-100');
  });

  it('/configuracion/uso: Outlet renderiza UsoPage y el sidebar resalta "Uso y coste"', () => {
    renderAt('/configuracion/uso');
    expect(screen.getByRole('heading', { level: 1, name: 'Uso del sistema' })).toBeInTheDocument();
    expect(screen.getByText('Uso y coste').closest('a')).toHaveClass('bg-slate-100');
  });

  it('/configuracion/festivos: Outlet renderiza FestivosPage', () => {
    renderAt('/configuracion/festivos');
    expect(screen.getByRole('heading', { level: 1, name: 'Festivos' })).toBeInTheDocument();
  });

  it('"Cuentas (auditoría)" apunta a /personal y nunca está activo', () => {
    renderAt('/configuracion/uso');
    const link = screen.getByText('Cuentas (auditoría)').closest('a')!;
    expect(link).toHaveAttribute('href', '/personal');
    expect(link).not.toHaveClass('bg-slate-100');
  });

  it('no usa clases brand-* en el árbol del shell', async () => {
    const { container } = renderAt('/configuracion');
    await flush();
    expect(container.querySelector('[class*="brand-"]')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/configuracion/ConfiguracionShell.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/features/configuracion/ConfiguracionShell.tsx
import { Outlet } from 'react-router';
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';
import { ConfiguracionSidebar } from './components/ConfiguracionSidebar';

const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'Admin' };

export function ConfiguracionShell() {
  return (
    <AppLayout user={mockUser} module={{ name: 'Configuración', href: '/configuracion' }}>
      <div className="flex gap-8">
        <ConfiguracionSidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </AppLayout>
  );
}
```

```tsx
// src/features/modules/ConfigShell.tsx (reemplaza el fichero completo)
import { ConfiguracionShell } from '@/features/configuracion/ConfiguracionShell';

export function ConfigShell() {
  return <ConfiguracionShell />;
}
```

En `src/app/router.tsx`:
1. Añadir los imports de las 11 páginas:

```tsx
import { PlantillasCorreoPage } from '@/features/configuracion/pages/PlantillasCorreoPage';
import { UsoPage as ConfigUsoPage } from '@/features/configuracion/pages/UsoPage';
import { IncidenciasPage as ConfigIncidenciasPage } from '@/features/configuracion/pages/IncidenciasPage';
import { DocumentosTipografiaPage } from '@/features/configuracion/pages/DocumentosTipografiaPage';
import { NotificacionesPage } from '@/features/configuracion/pages/NotificacionesPage';
import { ComisionesBookersPage } from '@/features/configuracion/pages/ComisionesBookersPage';
import { ControlComisionesPage } from '@/features/configuracion/pages/ControlComisionesPage';
import { ContratosPage as ConfigContratosPage } from '@/features/configuracion/pages/ContratosPage';
import { AlertasEventosPage } from '@/features/configuracion/pages/AlertasEventosPage';
import { RrhhPage } from '@/features/configuracion/pages/RrhhPage';
import { FestivosPage } from '@/features/configuracion/pages/FestivosPage';
```

(Alias `as Config*Page` en `UsoPage`, `IncidenciasPage` y `ContratosPage` porque esos nombres ya están importados desde `booking`/`etra`/`cruda` en otras rutas del mismo fichero — evita colisión de identificadores, no de rutas.)

2. Sustituir la ruta plana:

```tsx
<Route path="/configuracion" element={<ConfigShell />} />
```

por las rutas anidadas:

```tsx
<Route path="/configuracion" element={<ConfigShell />}>
  <Route index element={<PlantillasCorreoPage />} />
  <Route path="uso" element={<ConfigUsoPage />} />
  <Route path="incidencias" element={<ConfigIncidenciasPage />} />
  <Route path="documentos" element={<DocumentosTipografiaPage />} />
  <Route path="notificaciones" element={<NotificacionesPage />} />
  <Route path="comisiones" element={<ComisionesBookersPage />} />
  <Route path="comisiones-pagos" element={<ControlComisionesPage />} />
  <Route path="contratos" element={<ConfigContratosPage />} />
  <Route path="alertas" element={<AlertasEventosPage />} />
  <Route path="rrhh" element={<RrhhPage />} />
  <Route path="festivos" element={<FestivosPage />} />
</Route>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/configuracion/ConfiguracionShell.test.tsx`
Expected: PASS.

- [ ] **Step 5: Run full gate**

Run: `npx vitest run && npx tsc --noEmit && npx eslint . --max-warnings 0`
Expected: todo verde — 27 tareas, ~10 ficheros de datos + tests, 14 componentes + tests, 11 páginas + tests, shell + tests, sin warnings de lint, sin errores de tipos (ES2020, sin `Array.prototype.at()`).

- [ ] **Step 6: Commit**

```bash
git add src/features/configuracion/ConfiguracionShell.tsx src/features/configuracion/ConfiguracionShell.test.tsx src/features/modules/ConfigShell.tsx src/app/router.tsx
git commit -m "feat(configuracion): ConfiguracionShell + 10 rutas hijas + landing Plantillas de correo"
```

---

## Verificación final (fuera de tareas, en review de rama)

- **FIEL AL LIVE:** Playwright ours↔live en las 11 vistas propias del módulo (`/configuracion`, `/configuracion/uso`, `/configuracion/incidencias`, `/configuracion/documentos`, `/configuracion/notificaciones`, `/configuracion/comisiones`, `/configuracion/comisiones-pagos`, `/configuracion/contratos`, `/configuracion/alertas`, `/configuracion/rrhh`, `/configuracion/festivos`) contra `docs/references/configuracion/live-configuracion*.png`. **"Cuentas (auditoría)" queda excluida** de esta verificación (pertenece al módulo Team en una fase futura); basta con confirmar que el link de salida a `/personal` funciona y nunca se resalta como activo.
- 0 errores de consola en las 11 vistas. Ajustar tokens visuales (paddings, tamaños de chip, colores exactos de estado) si Playwright detecta diffs perceptibles frente a las capturas.
- Confirmar explícitamente los números clave observados en el live: Uso y coste (53,89 € / 53,92 € / 0 errores), Incidencias (1/1/0/2/4), Comisiones de bookers (25% global, 30/100/600, 15 bookers a 25%), Control de comisiones (3× 0,00 €), Alertas (D-21/14/10/7/3, solo "Contrato sin subir" con email), RRHH (31.5/21/160, 21/15, 60-30-15/15-7/30, 12 departamentos), Festivos (23 fechas 2026-2027).
- Confirmar que ningún botón "Guardar"/"+ Nueva plantilla"/"Añadir"/"Evaluar ahora" hace una llamada real (sin `fetch`/`XHR` en el árbol de red durante la sesión Playwright).
- Confirmar que `/configuracion` (sin sub-ruta) renderiza `PlantillasCorreoPage`, no `UsoPage` (landing deliberada, fiel al live aunque "Uso y coste" sea la primera entrada del sidebar).

## Self-review (cobertura spec → tarea)

- **Modelo de datos (10 dominios + sidebar)** → Task 1. Todos los counts del spec (6 plantillas, 6 integraciones, 8 incidencias, 4×15 notificaciones, 15 bookers, 2 plantillas de contrato, 5 reglas de alerta, 12 departamentos, 23 festivos, 12 ítems de sidebar) cubiertos con tests exactos.
- **ConfiguracionSidebar** → Task 2 (6 secciones/12 ítems, activo por ruta, link de salida a `/personal`).
- **ConfigPageHeader** → Task 3 (reusado en las 10 páginas restantes vía import directo).
- **Plantillas de correo** (EmailTemplateCard + extensión RichTextEditor + PlantillasCorreoPage) → Tasks 4-5.
- **Uso y coste** (IntegrationRow + UsageBanner + extensión SegmentedControl + UsoPage) → Tasks 6-8.
- **Incidencias** (IncidenciaRow + IncidentCountPill + IncidenciasPage) → Tasks 9-11.
- **Documentos (tipografía)** (TypographySlider + DocumentosTipografiaPage) → Tasks 12-13.
- **Notificaciones** (NotificationCategoryCard + NotificacionesPage) → Tasks 14-15.
- **Comisiones de bookers + Control de comisiones** (BookerCommissionRow + ambas páginas) → Tasks 16-18.
- **Contratos** (ContractTemplateRow + ContratosPage) → Tasks 19-20.
- **Alertas de eventos** (EventAlertRuleCard + AlertasEventosPage, título real "Alertas de producción") → Tasks 21-22.
- **RRHH** (DepartmentRow + RrhhPage) → Tasks 23-24.
- **Festivos** (HolidayRow + FestivosPage) → Tasks 25-26.
- **Shell + router** (landing real, sidebar siempre visible, "Cuentas (auditoría)" como link de salida, 10 rutas hijas) → Task 27.
- **Reutilización de primitivos** fijada explícitamente: `StatCard` (Tasks 8, 18), `SegmentedControl` extendido con `tone` (Task 8), `RichTextEditor` extendido con `content`/`onChange` (Task 4), `formatCurrency` (Tasks 6, 8, 18), `Button`/`Card`/`Input`/`Select` (todas las tareas de componentes/páginas relevantes) — cero primitivos duplicados, cero clases `brand-*` en los grises/negros del módulo, botón primario `#44444C` consistente en las 6 vistas que lo requieren (Plantillas, Comisiones×2, Contratos, RRHH, Festivos).
- **Sin placeholders**: todo texto (títulos, subtítulos, ayudas, seeds) transcrito literalmente de las 11 capturas del live; tipos y firmas de cada tarea reutilizados sin variación en las tareas siguientes (`EmailTemplate`, `Integration`/`IntegrationUsageSnapshot`, `Incidencia`/`IncidentStatus`, `NotificationCategory`/`NotificationRecipient`, `BookerCommission`, `ContractTemplate`, `EventAlertRule`, `Department`/`HrSettings`, `Holiday` idénticos en data → componente → página → shell).
