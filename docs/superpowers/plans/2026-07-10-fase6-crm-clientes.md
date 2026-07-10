# Fase 6a — CRM · Clientes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar la tab **Clientes** del módulo CRM como calco pixel-perfect del live (master-detail de organizaciones + buscador + filtros + detalle con contactos/direcciones/portal + formulario "Nueva organización"), reemplazando el stub.

**Architecture:** Módulo self-contained `src/features/crm/` (patrón cruda/creativos): shell real (`AppLayout` + tabs + `<Outlet/>`), datos mock en `data/` local, y una `ClientesPage` que compone **un layout master-detail a medida** (grid 3-col: izquierda 1 col con filtros+lista, derecha 2 col con detalle/empty/formulario). Componentes presentacionales aislados: `OrgListRow`, `OrgDetail`, `OrgForm`. Pipeline y Crecimiento = páginas placeholder hasta su fase.

**Tech Stack:** React 19, react-router 7, Tailwind 3, lucide-react, Vitest + Testing Library.

## Global Constraints

- **Todo presentacional, sin persistencia.** Buscador y filtros **funcionan** (cliente). Seleccionar org → detalle. `+ Nueva organización` → formulario; `Cancelar`/`Guardar` cierran (sin persistir). Inertes: `Modificar`, `+ Añadir persona/dirección`, `Invitar`, "Buscar dirección en Google", "Asignar" responsable.
- **PIXEL-PERFECT incluidos tamaños** (tokens medidos del live vía Elements/CSS). **NO reutilizar `MasterDetailList`** (sus filas son `px-4 py-3` / selección `bg-brand-50/60`; el live es `px-3 py-2.5` / selección `bg-slate-50`). Se construye el layout a medida con los tokens exactos de abajo.
- **Marca:** brand violeta solo donde el live usa su "brand" (botón `+ Nueva organización`/`Guardar` = `Button variant="primary"`). Los tokens neutros/semánticos se calcan exactos.
- Usar utilidades `.input/.label/.select` (ya existen) y componentes `Card`/`Button`/`Badge`.

### Tokens medidos (del live)

- **Grid master-detail:** `grid gap-6 lg:grid-cols-3` · izquierda `lg:col-span-1 min-w-0` (400px) · derecha `lg:col-span-2 min-w-0` (824px). gap 24px.
- **Botón Nueva organización:** `Button variant="primary"` + `className="mb-3 w-full"` (alto 36, r-8).
- **Card de filtros:** `Card` + `className="mb-3 space-y-2 p-3 border-slate-200"` → dentro: input buscador (`.input`), select Tipo (`.select`), select Empresa (`.select`).
- **Card de lista:** `Card` + `className="border-slate-200 divide-y divide-slate-100 overflow-hidden p-0"`. Filas o empty state dentro.
- **Fila de org:** `flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-slate-50` + selección `bg-slate-50`. Nombre `truncate font-medium text-slate-800` (16px/500). NIF `block truncate text-xs text-slate-400`. Badge de tipo a la derecha.
- **Badge de tipo (lista y ficha):** `Badge variant="neutral"` = `bg-slate-100 text-slate-500 rounded-full px-2.5 py-0.5 text-xs` (medido para "Cliente"; verificar Proveedor/Lead en el paso de verificación — si difieren, ajustar).
- **Cards de detalle (ficha y secciones):** `Card` + `className="border-slate-200 p-5"` (r-12, borde slate-200, padding 20px).
- **Nombre en ficha:** `text-lg font-semibold text-slate-800` (18px/600).
- **Chip "Trabaja con" (detalle):** `inline-flex items-center rounded-full bg-blue-600/10 px-2.5 py-0.5 text-xs font-medium text-blue-600` (medido: bg `rgba(37,99,235,.1)`, texto `#2563EB`).
- **Botones secundarios** (`Modificar`, `+ Añadir…`, `Invitar`, `Cancelar`): `Button variant="secondary"` + `className="border-slate-300"` (el live usa borde slate-300; nuestro secondary por defecto es slate-200). `size="sm"` para los de sección.
- **Cabecera de sección:** `text-sm font-semibold uppercase tracking-wide text-slate-400`.
- **Estado vacío de sección:** `text-sm text-slate-400`.
- **Formulario:** `grid gap-4 sm:grid-cols-2` (gap 16). Campos con `.label` (14px/500 slate-600) + `.input`/`.select`. Chips "Trabaja con (empresas del grupo)" = pills toggle `rounded-full border px-3 py-1 text-sm` (no-sel `border-slate-200 text-slate-500`; sel `border-brand-500 bg-brand-50 text-brand-700`). Radios/checkboxes nativos con `accent-brand-600`. Footer `Guardar` (`variant="primary"`) + `Cancelar` (`variant="secondary" border-slate-300`).
- Repo enforcea `npm run lint --max-warnings 0`, `npx tsc --noEmit`, `npm test` en verde.
- Referencias: `docs/references/crm/` (1440×900, dSF 2).

---

### Task 1: Datos mock + helper `filterOrgs`

**Files:**
- Create: `src/features/crm/data/seed.ts`
- Create: `src/features/crm/data/crm.ts`
- Test: `src/features/crm/data/crm.test.ts`

**Interfaces:**
- Produces (`./seed`): tipos `OrgKind`, `OrgRole`, `CrmContact`, `CrmOrg`; const `orgs: CrmOrg[]`; const `GROUP_COMPANIES: string[]`.
- Produces (`./crm`): type `CrmFilters = { query: string; role: OrgRole | 'Todos'; worksWith: string | 'Cualquiera' }`; `filterOrgs(orgs, filters): CrmOrg[]`; const `ROLE_OPTIONS`, `COMPANY_OPTIONS`.

- [ ] **Step 1: Escribir el seed**

Crear `src/features/crm/data/seed.ts`:

```ts
export type OrgKind = 'Empresa' | 'Persona';
export type OrgRole = 'Cliente' | 'Proveedor' | 'Lead';

export interface CrmContact {
  id: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
}

export interface CrmOrg {
  id: string;
  name: string;
  legalName?: string;
  tradeName?: string;
  nif?: string;
  vat?: string;
  kind: OrgKind;
  roles: OrgRole[];
  email?: string;
  website?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  worksWith: string[];
  contacts: CrmContact[];
  shippingAddresses: string[];
}

export const GROUP_COMPANIES = [
  'ConceptOne', 'CRUDA', 'Etra Agency', 'Euphoric Media', 'Mixmag Spain', 'TAGMAG',
];

export const orgs: CrmOrg[] = [
  {
    id: 'o1', name: 'BMG', legalName: 'BMG RIGHTS MANAGEMENT AND ADMINISTRATION (SPAIN) SL',
    nif: 'B64730187', kind: 'Empresa', roles: ['Cliente'],
    email: 'laura.martin@bmg.com',
    address: "C/ O'DONNELL 10 1º IZQ, Madrid, 28009, Madrid, España",
    worksWith: ['Etra Agency'], contacts: [], shippingAddresses: [],
  },
  {
    id: 'o2', name: 'Foot District', legalName: 'FOOT DISTRICT SL', nif: 'B66112233',
    kind: 'Empresa', roles: ['Cliente'], email: 'hola@footdistrict.com', website: 'footdistrict.com',
    address: 'C/ Tallers 42, Barcelona, 08001, Barcelona, España',
    worksWith: ['Etra Agency'],
    contacts: [
      { id: 'c1', name: 'Marta Ruiz', role: 'Marketing', email: 'marta@footdistrict.com' },
    ],
    shippingAddresses: ['Almacén central · Pol. Ind. Zona Franca, Barcelona'],
  },
  {
    id: 'o3', name: 'New Era', legalName: 'NEW ERA CAP EUROPE', nif: 'W1234567H',
    kind: 'Empresa', roles: ['Cliente', 'Proveedor'], email: 'eu@neweracap.com',
    address: 'Amsterdam, Países Bajos', worksWith: ['CRUDA', 'Etra Agency'],
    contacts: [], shippingAddresses: [],
  },
  {
    id: 'o4', name: '1A PROJECTS 1802 SL', nif: 'B21932975', kind: 'Empresa', roles: ['Proveedor'],
    worksWith: ['ConceptOne'], contacts: [], shippingAddresses: [],
  },
  {
    id: 'o5', name: 'ALQUIEVENTS SL', nif: 'B87650446', kind: 'Empresa', roles: ['Proveedor'],
    email: 'info@alquievents.es', worksWith: ['ConceptOne', 'Mixmag Spain'],
    contacts: [], shippingAddresses: [],
  },
  {
    id: 'o6', name: 'Alvaro Costa España', nif: '71953601X', kind: 'Persona', roles: ['Proveedor'],
    worksWith: ['Euphoric Media'], contacts: [], shippingAddresses: [],
  },
  {
    id: 'o7', name: 'DSKONNECT', legalName: 'DSKONNECT SL', nif: 'B99887766', kind: 'Empresa',
    roles: ['Lead'], email: 'sales@dskonnect.com', worksWith: [], contacts: [], shippingAddresses: [],
  },
  {
    id: 'o8', name: 'HILTON OF SPAIN SL', nif: 'B12093844', kind: 'Empresa', roles: ['Cliente'],
    email: 'events@hilton.es', address: 'Madrid, España', worksWith: ['ConceptOne'],
    contacts: [], shippingAddresses: [],
  },
  {
    id: 'o9', name: 'Oso Polita', nif: '39532340D', kind: 'Persona', roles: ['Lead'],
    worksWith: [], contacts: [], shippingAddresses: [],
  },
  {
    id: 'o10', name: 'TAGMAG', legalName: 'TAGMAG MEDIA SL', nif: 'B55512347', kind: 'Empresa',
    roles: ['Cliente'], email: 'hey@tagmag.es', website: 'tagmag.es',
    address: 'Barcelona, España', worksWith: ['Etra Agency', 'Euphoric Media'],
    contacts: [{ id: 'c2', name: 'Nil Prat', role: 'Editor', email: 'nil@tagmag.es' }],
    shippingAddresses: [],
  },
];
```

- [ ] **Step 2: Escribir el test del helper (debe fallar)**

Crear `src/features/crm/data/crm.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { orgs } from './seed';
import { filterOrgs, ROLE_OPTIONS, COMPANY_OPTIONS } from './crm';

describe('crm helpers', () => {
  it('exposes role and company options', () => {
    expect(ROLE_OPTIONS).toEqual(['Todos', 'Clientes', 'Proveedores', 'Leads']);
    expect(COMPANY_OPTIONS[0]).toBe('Cualquiera');
    expect(COMPANY_OPTIONS).toContain('Etra Agency');
  });

  it('filters by query on name, nif and contact', () => {
    expect(filterOrgs(orgs, { query: 'bmg', role: 'Todos', worksWith: 'Cualquiera' }).map(o => o.id)).toEqual(['o1']);
    expect(filterOrgs(orgs, { query: 'B21932975', role: 'Todos', worksWith: 'Cualquiera' }).map(o => o.id)).toEqual(['o4']);
    expect(filterOrgs(orgs, { query: 'nil prat', role: 'Todos', worksWith: 'Cualquiera' }).map(o => o.id)).toEqual(['o10']);
  });

  it('filters by role (singular UI plural mapped)', () => {
    const clientes = filterOrgs(orgs, { query: '', role: 'Cliente', worksWith: 'Cualquiera' });
    expect(clientes.every(o => o.roles.includes('Cliente'))).toBe(true);
    expect(clientes.map(o => o.id)).toContain('o1');
    const leads = filterOrgs(orgs, { query: '', role: 'Lead', worksWith: 'Cualquiera' });
    expect(leads.map(o => o.id).sort()).toEqual(['o7', 'o9']);
  });

  it('filters by company (worksWith)', () => {
    const etra = filterOrgs(orgs, { query: '', role: 'Todos', worksWith: 'Etra Agency' });
    expect(etra.map(o => o.id)).toEqual(expect.arrayContaining(['o1', 'o2', 'o3', 'o10']));
    expect(etra.map(o => o.id)).not.toContain('o4');
  });
});
```

- [ ] **Step 3: Ejecutar y ver fallar**

Run: `npx vitest run src/features/crm/data/crm.test.ts`
Expected: FAIL — `./crm` inexistente.

- [ ] **Step 4: Implementar el helper**

Crear `src/features/crm/data/crm.ts`:

```ts
import { GROUP_COMPANIES, type CrmOrg, type OrgRole } from './seed';

export const ROLE_OPTIONS = ['Todos', 'Clientes', 'Proveedores', 'Leads'] as const;
export const COMPANY_OPTIONS = ['Cualquiera', ...GROUP_COMPANIES] as const;

export interface CrmFilters {
  query: string;
  role: OrgRole | 'Todos';
  worksWith: string; // 'Cualquiera' | company
}

export function filterOrgs(list: CrmOrg[], filters: CrmFilters): CrmOrg[] {
  const q = filters.query.trim().toLowerCase();
  return list.filter((o) => {
    if (filters.role !== 'Todos' && !o.roles.includes(filters.role)) return false;
    if (filters.worksWith !== 'Cualquiera' && !o.worksWith.includes(filters.worksWith)) return false;
    if (q) {
      const hay = [
        o.name, o.legalName ?? '', o.nif ?? '',
        ...o.contacts.map((c) => c.name),
      ].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
```

- [ ] **Step 5: Ejecutar y ver pasar**

Run: `npx vitest run src/features/crm/data/crm.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add src/features/crm/data/
git commit -m "feat(crm): mock orgs seed + filterOrgs helper"
```

---

### Task 2: `OrgListRow` + `TypeBadge`

**Files:**
- Create: `src/features/crm/components/OrgListRow.tsx`
- Test: `src/features/crm/components/OrgListRow.test.tsx`

**Interfaces:**
- Consumes: `CrmOrg` de `../data/seed`; `Badge` de `@/components/ui`.
- Produces: `OrgListRow({ org, selected, onSelect }: { org: CrmOrg; selected: boolean; onSelect: () => void })` → un `<button>`.

- [ ] **Step 1: Test (debe fallar)**

Crear `src/features/crm/components/OrgListRow.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrgListRow } from './OrgListRow';
import type { CrmOrg } from '../data/seed';

const org: CrmOrg = {
  id: 'o1', name: 'BMG', nif: 'B64730187', kind: 'Empresa', roles: ['Cliente'],
  worksWith: [], contacts: [], shippingAddresses: [],
};

describe('OrgListRow', () => {
  it('shows name, nif and the first role badge; calls onSelect; reflects selection', () => {
    const onSelect = vi.fn();
    const { rerender } = render(<OrgListRow org={org} selected={false} onSelect={onSelect} />);
    expect(screen.getByText('BMG')).toHaveClass('font-medium', 'text-slate-800');
    expect(screen.getByText('B64730187')).toHaveClass('text-xs', 'text-slate-400');
    expect(screen.getByText('Cliente')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalled();
    rerender(<OrgListRow org={org} selected onSelect={onSelect} />);
    expect(screen.getByRole('button')).toHaveClass('bg-slate-50');
  });
});
```

- [ ] **Step 2: Ejecutar y ver fallar**

Run: `npx vitest run src/features/crm/components/OrgListRow.test.tsx`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar**

Crear `src/features/crm/components/OrgListRow.tsx`:

```tsx
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { CrmOrg } from '../data/seed';

export interface OrgListRowProps {
  org: CrmOrg;
  selected: boolean;
  onSelect: () => void;
}

export function OrgListRow({ org, selected, onSelect }: OrgListRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-slate-50',
        selected && 'bg-slate-50',
      )}
    >
      <span className="min-w-0">
        <span className="block truncate font-medium text-slate-800">{org.name}</span>
        {org.nif && <span className="block truncate text-xs text-slate-400">{org.nif}</span>}
      </span>
      {org.roles[0] && (
        <Badge variant="neutral" className="shrink-0">
          {org.roles[0]}
        </Badge>
      )}
    </button>
  );
}
```

- [ ] **Step 4: Ejecutar y ver pasar**

Run: `npx vitest run src/features/crm/components/OrgListRow.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/crm/components/OrgListRow.tsx src/features/crm/components/OrgListRow.test.tsx
git commit -m "feat(crm): OrgListRow (name/nif + role badge)"
```

---

### Task 3: `OrgDetail`

**Files:**
- Create: `src/features/crm/components/OrgDetail.tsx`
- Test: `src/features/crm/components/OrgDetail.test.tsx`

**Interfaces:**
- Consumes: `CrmOrg`, `CrmContact` de `../data/seed`; `Card`, `Badge`, `Button` de `@/components/ui`.
- Produces: `OrgDetail({ org }: { org: CrmOrg })`.

- [ ] **Step 1: Test (debe fallar)**

Crear `src/features/crm/components/OrgDetail.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OrgDetail } from './OrgDetail';
import type { CrmOrg } from '../data/seed';

const org: CrmOrg = {
  id: 'o1', name: 'BMG', legalName: 'BMG RIGHTS SL', nif: 'B64730187', kind: 'Empresa',
  roles: ['Cliente'], email: 'laura@bmg.com', address: "C/ O'DONNELL 10, Madrid",
  worksWith: ['Etra Agency'], contacts: [], shippingAddresses: [],
};

describe('OrgDetail', () => {
  it('renders the org card, works-with chips and the three empty sections', () => {
    render(<OrgDetail org={org} />);
    expect(screen.getByRole('heading', { name: 'BMG' })).toHaveClass('text-lg', 'font-semibold');
    expect(screen.getByText('NIF: B64730187')).toBeInTheDocument();
    expect(screen.getByText('Etra Agency')).toHaveClass('bg-blue-600/10', 'text-blue-600');
    expect(screen.getByRole('button', { name: 'Modificar' })).toBeInTheDocument();
    expect(screen.getByText('PERSONAS DE CONTACTO')).toBeInTheDocument();
    expect(screen.getByText('Sin personas de contacto.')).toBeInTheDocument();
    expect(screen.getByText('DIRECCIONES DE ENVÍO')).toBeInTheDocument();
    expect(screen.getByText('PORTAL DE REPOSICIONES (CRUDA)')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar y ver fallar**

Run: `npx vitest run src/features/crm/components/OrgDetail.test.tsx`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar**

Crear `src/features/crm/components/OrgDetail.tsx`:

```tsx
import { Badge, Button, Card } from '@/components/ui';
import type { CrmContact, CrmOrg } from '../data/seed';

function SectionCard({ title, action, children }: { title: string; action: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="border-slate-200 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{title}</h3>
        {action}
      </div>
      {children}
    </Card>
  );
}

export interface OrgDetailProps {
  org: CrmOrg;
}

export function OrgDetail({ org }: OrgDetailProps) {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="truncate text-lg font-semibold text-slate-800">{org.name}</h2>
          <Button variant="secondary" size="sm" className="shrink-0 border-slate-300">
            Modificar
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
          <Badge variant="neutral">{org.roles[0] ?? 'Lead'}</Badge>
          <span>{org.kind}</span>
          {org.nif && <span>NIF: {org.nif}</span>}
        </div>
        {org.legalName && <p className="mt-2 text-sm text-slate-500">Razón social: {org.legalName}</p>}
        {org.email && <p className="mt-1 text-sm text-slate-600">{org.email}</p>}
        {org.address && <p className="mt-1 text-sm text-slate-600">{org.address}</p>}
        {org.worksWith.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>Trabaja con:</span>
            {org.worksWith.map((c) => (
              <span key={c} className="inline-flex items-center rounded-full bg-blue-600/10 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                {c}
              </span>
            ))}
          </div>
        )}
      </Card>

      <SectionCard
        title="PERSONAS DE CONTACTO"
        action={<Button variant="secondary" size="sm" className="border-slate-300">+ Añadir persona</Button>}
      >
        {org.contacts.length === 0 ? (
          <p className="text-sm text-slate-400">Sin personas de contacto.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {org.contacts.map((c: CrmContact) => (
              <li key={c.id} className="py-2">
                <p className="text-sm font-medium text-slate-800">{c.name}</p>
                <p className="text-xs text-slate-400">
                  {[c.role, c.email, c.phone].filter(Boolean).join(' · ')}
                </p>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard
        title="DIRECCIONES DE ENVÍO"
        action={<Button variant="secondary" size="sm" className="border-slate-300">+ Añadir dirección</Button>}
      >
        {org.shippingAddresses.length === 0 ? (
          <p className="text-sm text-slate-400">Sin direcciones de envío.</p>
        ) : (
          <ul className="space-y-1 text-sm text-slate-600">
            {org.shippingAddresses.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        )}
      </SectionCard>

      <Card className="border-slate-200 p-5">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          PORTAL DE REPOSICIONES (CRUDA)
        </h3>
        <p className="mb-3 text-sm text-slate-500">
          Da acceso a este cliente para que pida sus reposiciones de forma autónoma. Verá solo su catálogo y sus pedidos.
        </p>
        <div className="flex items-center gap-2">
          <input className="input" placeholder="email@cliente.com" />
          <Button variant="secondary" className="shrink-0 border-slate-300">Invitar</Button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Se le enviará un email para crear su contraseña. Requiere permiso de gestión de usuarios.
        </p>
      </Card>
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar y ver pasar**

Run: `npx vitest run src/features/crm/components/OrgDetail.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/crm/components/OrgDetail.tsx src/features/crm/components/OrgDetail.test.tsx
git commit -m "feat(crm): OrgDetail (ficha + contactos + direcciones + portal CRUDA)"
```

---

### Task 4: `OrgForm` (Nueva organización)

**Files:**
- Create: `src/features/crm/components/OrgForm.tsx`
- Test: `src/features/crm/components/OrgForm.test.tsx`

**Interfaces:**
- Consumes: `Card`, `Button` de `@/components/ui`; `GROUP_COMPANIES` de `../data/seed`; `cn`.
- Produces: `OrgForm({ onClose }: { onClose: () => void })` (Guardar y Cancelar llaman `onClose`; sin persistencia).

- [ ] **Step 1: Test (debe fallar)**

Crear `src/features/crm/components/OrgForm.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrgForm } from './OrgForm';

describe('OrgForm', () => {
  it('renders key fields with Cliente checked by default and toggles a company chip', () => {
    render(<OrgForm onClose={() => {}} />);
    expect(screen.getByPlaceholderText('Escribe la dirección y elige un resultado…')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Cliente' })).toBeChecked();
    const chip = screen.getByRole('button', { name: 'ConceptOne' });
    expect(chip).toHaveClass('border-slate-200');
    fireEvent.click(chip);
    expect(chip).toHaveClass('bg-brand-50', 'text-brand-700');
  });

  it('calls onClose from Guardar and Cancelar', () => {
    const onClose = vi.fn();
    render(<OrgForm onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
```

- [ ] **Step 2: Ejecutar y ver fallar**

Run: `npx vitest run src/features/crm/components/OrgForm.test.tsx`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar**

Crear `src/features/crm/components/OrgForm.tsx`:

```tsx
import { useState } from 'react';
import { Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { GROUP_COMPANIES } from '../data/seed';

const COUNTRIES = ['España', 'Portugal', 'Francia', 'Italia', 'Alemania', 'Reino Unido', 'Países Bajos', 'Bélgica', 'Andorra'];

export interface OrgFormProps {
  onClose: () => void;
}

export function OrgForm({ onClose }: OrgFormProps) {
  const [worksWith, setWorksWith] = useState<string[]>([]);
  const [fiscalOpen, setFiscalOpen] = useState(false);
  const toggle = (c: string) =>
    setWorksWith((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  return (
    <Card className="border-slate-200 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Nombre / Razón social *</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">Nombre comercial</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">NIF</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">Identificación VAT</label>
          <input className="input" />
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="radio" name="kind" defaultChecked className="accent-brand-600" /> Empresa
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="radio" name="kind" className="accent-brand-600" /> Persona
          </label>
          <span className="h-5 w-px bg-slate-200" />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" defaultChecked className="accent-brand-600" /> Cliente
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="accent-brand-600" /> Proveedor
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="accent-brand-600" /> Lead
          </label>
        </div>

        <div>
          <label className="label">Email</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">Website</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">Teléfono</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">Móvil</label>
          <input className="input" />
        </div>

        <div className="sm:col-span-2">
          <label className="label">Buscar dirección en Google</label>
          <input className="input" placeholder="Escribe la dirección y elige un resultado…" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Dirección</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">Población</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">Código postal</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">Provincia</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">País</label>
          <select className="select" defaultValue="España">
            {COUNTRIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="label">Trabaja con (empresas del grupo)</label>
          <div className="flex flex-wrap gap-2">
            {GROUP_COMPANIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggle(c)}
                className={cn(
                  'rounded-full border px-3 py-1 text-sm transition-colors',
                  worksWith.includes(c)
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-500 hover:border-brand-400',
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-500">Marca todas las empresas del grupo que dan servicio a este cliente.</p>
        </div>

        <div>
          <label className="label">Responsable</label>
          <button type="button" className="inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm text-slate-400 hover:bg-slate-100">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-dashed border-slate-300 text-slate-400">＋</span>
            <span>Asignar</span>
          </button>
        </div>
        <div>
          <label className="label">Referencia interna</label>
          <input className="input" />
        </div>

        <div className="sm:col-span-2">
          <label className="label">Notas</label>
          <textarea className="input min-h-[80px]" />
        </div>

        <div className="sm:col-span-2">
          <button
            type="button"
            onClick={() => setFiscalOpen((v) => !v)}
            className="text-sm font-medium text-slate-600 hover:text-slate-800"
          >
            {fiscalOpen ? '▾' : '▸'} Datos fiscales / facturación
          </button>
          {fiscalOpen && (
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">IBAN</label>
                <input className="input" />
              </div>
              <div>
                <label className="label">Condiciones de pago</label>
                <input className="input" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <Button variant="primary" onClick={onClose}>Guardar</Button>
        <Button variant="secondary" className="border-slate-300" onClick={onClose}>Cancelar</Button>
      </div>
    </Card>
  );
}
```

Nota: en el test, `getByRole('checkbox', { name: 'Cliente' })` funciona porque el `<input type="checkbox">` está dentro del `<label>` con el texto "Cliente" (nombre accesible por asociación).

- [ ] **Step 4: Ejecutar y ver pasar**

Run: `npx vitest run src/features/crm/components/OrgForm.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/crm/components/OrgForm.tsx src/features/crm/components/OrgForm.test.tsx
git commit -m "feat(crm): OrgForm — Nueva organización form (calco)"
```

---

### Task 5: `ClientesPage` (composición master-detail)

**Files:**
- Create: `src/features/crm/pages/ClientesPage.tsx`
- Test: `src/features/crm/pages/ClientesPage.test.tsx`

**Interfaces:**
- Consumes: `orgs` de `../data/seed`; `filterOrgs`, `ROLE_OPTIONS`, `COMPANY_OPTIONS`, tipos de `../data/crm`; `OrgListRow`, `OrgDetail`, `OrgForm`; `Button`, `Card` de `@/components/ui`.
- Produces: `ClientesPage()`.

- [ ] **Step 1: Test (debe fallar)**

Crear `src/features/crm/pages/ClientesPage.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ClientesPage } from './ClientesPage';

describe('ClientesPage', () => {
  it('renders header, list, empty detail, and filters by search', () => {
    render(<ClientesPage />);
    expect(screen.getByRole('heading', { name: 'Clientes', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Selecciona una organización o crea una nueva.')).toBeInTheDocument();
    // list has multiple orgs; search narrows to BMG
    fireEvent.change(screen.getByPlaceholderText('Busca por empresa, NIF o contacto…'), { target: { value: 'BMG' } });
    expect(screen.getByRole('button', { name: /BMG/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Foot District/ })).not.toBeInTheDocument();
  });

  it('selects an org to show its detail', () => {
    render(<ClientesPage />);
    fireEvent.change(screen.getByPlaceholderText('Busca por empresa, NIF o contacto…'), { target: { value: 'BMG' } });
    fireEvent.click(screen.getByRole('button', { name: /BMG/ }));
    expect(screen.getByRole('heading', { name: 'BMG' })).toBeInTheDocument();
    expect(screen.getByText('PERSONAS DE CONTACTO')).toBeInTheDocument();
  });

  it('opens the Nueva organización form and closes it', () => {
    render(<ClientesPage />);
    fireEvent.click(screen.getByRole('button', { name: /Nueva organización/ }));
    expect(screen.getByText('Trabaja con (empresas del grupo)')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByText('Selecciona una organización o crea una nueva.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar y ver fallar**

Run: `npx vitest run src/features/crm/pages/ClientesPage.test.tsx`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar**

Crear `src/features/crm/pages/ClientesPage.tsx`:

```tsx
import { useMemo, useState } from 'react';
import { Button, Card } from '@/components/ui';
import { orgs as allOrgs } from '../data/seed';
import { filterOrgs, ROLE_OPTIONS, COMPANY_OPTIONS } from '../data/crm';
import type { OrgRole } from '../data/seed';
import { OrgListRow } from '../components/OrgListRow';
import { OrgDetail } from '../components/OrgDetail';
import { OrgForm } from '../components/OrgForm';

const ROLE_VALUE: Record<(typeof ROLE_OPTIONS)[number], OrgRole | 'Todos'> = {
  Todos: 'Todos', Clientes: 'Cliente', Proveedores: 'Proveedor', Leads: 'Lead',
};

export function ClientesPage() {
  const [query, setQuery] = useState('');
  const [roleLabel, setRoleLabel] = useState<(typeof ROLE_OPTIONS)[number]>('Todos');
  const [company, setCompany] = useState<string>('Cualquiera');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const visible = useMemo(
    () => filterOrgs(allOrgs, { query, role: ROLE_VALUE[roleLabel], worksWith: company }),
    [query, roleLabel, company],
  );
  const selected = visible.find((o) => o.id === selectedId) ?? null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Clientes</h1>
        <p className="text-sm text-slate-500">
          CRM del grupo: organizaciones (clientes, proveedores, leads) y sus contactos.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="min-w-0 lg:col-span-1">
          <Button
            variant="primary"
            className="mb-3 w-full"
            onClick={() => { setCreating(true); setSelectedId(null); }}
          >
            + Nueva organización
          </Button>

          <Card className="mb-3 space-y-2 border-slate-200 p-3">
            <input
              className="input"
              placeholder="Busca por empresa, NIF o contacto…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select className="select" value={roleLabel} onChange={(e) => setRoleLabel(e.target.value as (typeof ROLE_OPTIONS)[number])}>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r === 'Todos' ? 'Todos' : r}</option>
              ))}
            </select>
            <select className="select" value={company} onChange={(e) => setCompany(e.target.value)}>
              {COMPANY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c === 'Cualquiera' ? 'Cualquier empresa del grupo' : `Trabaja con ${c}`}</option>
              ))}
            </select>
          </Card>

          <Card className="divide-y divide-slate-100 overflow-hidden border-slate-200 p-0">
            {visible.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-400">
                Sin resultados. Ajusta la búsqueda o los filtros.
              </p>
            ) : (
              visible.map((org) => (
                <OrgListRow
                  key={org.id}
                  org={org}
                  selected={selectedId === org.id}
                  onSelect={() => { setSelectedId(org.id); setCreating(false); }}
                />
              ))
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="min-w-0 lg:col-span-2">
          {creating ? (
            <OrgForm onClose={() => setCreating(false)} />
          ) : selected ? (
            <OrgDetail org={selected} />
          ) : (
            <Card className="flex min-h-[300px] items-center justify-center border-slate-200 p-5 text-sm text-slate-400">
              Selecciona una organización o crea una nueva.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar y ver pasar**

Run: `npx vitest run src/features/crm/pages/ClientesPage.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/crm/pages/ClientesPage.tsx src/features/crm/pages/ClientesPage.test.tsx
git commit -m "feat(crm): ClientesPage — master-detail compose + filters/search/create"
```

---

### Task 6: Shell real + router (+ placeholders Pipeline/Crecimiento)

**Files:**
- Modify: `src/features/modules/CRMShell.tsx`
- Create: `src/features/crm/pages/PipelinePage.tsx`
- Create: `src/features/crm/pages/CrecimientoPage.tsx`
- Modify: `src/app/router.tsx`

**Interfaces:**
- Consumes: `AppLayout`, `ClientesPage`, `PipelinePage`, `CrecimientoPage`, `Outlet`.

- [ ] **Step 1: Placeholders de Pipeline y Crecimiento**

Crear `src/features/crm/pages/PipelinePage.tsx`:

```tsx
export function PipelinePage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-slate-800">Pipeline de ventas</h1>
      <p className="text-sm text-slate-500">Oportunidades por etapa. Cada empresa del grupo tiene su propio embudo.</p>
      <p className="pt-8 text-center text-sm text-slate-400">Próximamente.</p>
    </div>
  );
}
```

Crear `src/features/crm/pages/CrecimientoPage.tsx`:

```tsx
export function CrecimientoPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-slate-800">Crecimiento</h1>
      <p className="text-sm text-slate-500">Oportunidades de venta cruzada entre empresas del grupo y clientes en riesgo por inactividad.</p>
      <p className="pt-8 text-center text-sm text-slate-400">Próximamente.</p>
    </div>
  );
}
```

- [ ] **Step 2: Shell real**

Reemplazar `src/features/modules/CRMShell.tsx` por:

```tsx
import { Outlet } from 'react-router';
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';

const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'Admin' };

const tabs = [
  { label: 'Clientes', href: '/crm' },
  { label: 'Pipeline', href: '/crm/pipeline' },
  { label: 'Crecimiento', href: '/crm/crecimiento' },
];

export function CRMShell() {
  return (
    <AppLayout user={mockUser} module={{ name: 'CRM', href: '/crm', tabs }}>
      <Outlet />
    </AppLayout>
  );
}
```

- [ ] **Step 3: Router anidado**

En `src/app/router.tsx`: añadir imports `ClientesPage`, `PipelinePage`, `CrecimientoPage` desde `@/features/crm/pages/...`; convertir la ruta leaf `<Route path="/crm" element={<CRMShell />} />` en anidada:

```tsx
      <Route path="/crm" element={<CRMShell />}>
        <Route index element={<ClientesPage />} />
        <Route path="pipeline" element={<PipelinePage />} />
        <Route path="crecimiento" element={<CrecimientoPage />} />
      </Route>
```

- [ ] **Step 4: Verificación completa**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: tsc sin errores; lint 0 warnings; suite completa en verde.

- [ ] **Step 5: Commit**

```bash
git add src/features/modules/CRMShell.tsx src/features/crm/pages/PipelinePage.tsx src/features/crm/pages/CrecimientoPage.tsx src/app/router.tsx
git commit -m "feat(crm): real shell + nested routes (Clientes + Pipeline/Crecimiento placeholders)"
```

---

### Task 7: Verificación pixel-perfect

**Files:** ninguno (verificación; capturas al scratchpad).

- [ ] **Step 1: Dev server** (si no está): `npm run dev`.
- [ ] **Step 2: Capturar `/crm`** con Playwright (chromium de caché, 1440×900, dSF 2). Login mock; navegar a `/crm`; capturar: (a) estado inicial (lista + empty detail), (b) org seleccionada (buscar "BMG" → click → detalle), (c) formulario (`+ Nueva organización`).
- [ ] **Step 3: Contrastar** contra `docs/references/crm/` (`live-clientes-list.png`, `live-clientes-detail.png`, `live-clientes-nueva-org-form.png`): grid 3-col (izq 400 / der 824), filas `px-3 py-2.5` con selección slate-50, badges de tipo, ficha `card p-5`, chips "Trabaja con" azules, 3 secciones, formulario 2-col con radios/checks/chips/colapsable.
- [ ] **Step 4: Confirmar tokens críticos** (tamaños): columna izquierda 400px, filas alto ~44px (`py-2.5`), cards de detalle `p-5`/borde slate-200. Verificar el color de los badges Proveedor/Lead vs el live (si difieren del neutral, ajustar a lo medido).
- [ ] **Step 5: Probar interacción:** búsqueda, filtro Tipo y Empresa, selección, abrir/cerrar formulario, toggle de chips "Trabaja con".
- [ ] **Step 6: Actualizar memoria** ([[fase5-creativos-status]] o nueva `fase6-crm-status`): Fase 6a CRM Clientes completada en `feature/fase6-crm`, PR sobre `feature/creativos-functional-editor`; Pipeline/Crecimiento pendientes.

---

## Notas de auto-revisión (cobertura del spec)

- Datos + filtros funcionales → Task 1. Fila de lista + badge → Task 2. Detalle (ficha/contactos/direcciones/portal) → Task 3. Formulario Nueva organización → Task 4. Composición master-detail a medida (grid 3-col, tokens exactos) → Task 5. Shell real + router + placeholders → Task 6. Verificación pixel + tamaños → Task 7.
- **Desviación consciente del spec** (justificada por CSS medido): NO se reutiliza `MasterDetailList` (filas `px-4 py-3`/selección brand) — se construye a medida con `px-3 py-2.5`/selección `bg-slate-50` para calcar tamaños.
- Datos: `data/seed.ts` local (patrón cruda/creativos), no MockRepository.
- Sin placeholders. Deltas intencionales: brand violeta en Nueva organización/Guardar; "Buscar dirección Google", Modificar, Añadir, Invitar, Asignar inertes; Pipeline/Crecimiento placeholders.
