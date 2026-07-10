# Creativos "Nueva pieza" Drawer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cablear el botón "+ Nueva pieza" de `/creativos` a un drawer lateral derecho calcado pixel-perfect del live, presentacional (sin persistencia).

**Architecture:** Un `NuevaPiezaDrawer` (overlay + `aside`) que compone el formulario completo y posee el estado local de los grupos segmentados (Prioridad, Tamaños/ratios, Aprobación cliente). Componentes auxiliares `SegmentedButtons` y `BriefEditor`. Tres utilidades CSS (`.label/.input/.select`) en `index.css` reproducen las clases del live para mapear el HTML 1:1. El botón de la página abre el drawer.

**Tech Stack:** React 19, Tailwind 3 (`@layer components`), lucide-react, Vitest + Testing Library.

## Global Constraints

- **Todo presentacional, sin persistencia.** Abrir/cerrar funciona (botón abre; ✕ / Cerrar / Guardar / overlay cierran). Prioridad/ratios/Aprobación tienen selección local. Inputs/selects/date/textarea/contenteditable tecleables pero no guardan. Inertes: chips "Asignar", "＋ Añadir adaptación", "＋ Añadir tarea", "＋ Adjuntar", toolbar del Brief.
- **Marca violeta** (nuestro brand): Guardar = `Button variant="primary"`; estado seleccionado de los segmentados = `border-brand-500 bg-brand-50 text-brand-700`. NO adoptar el gris del live.
- **Col-spans exactos:** el `grid gap-4 sm:grid-cols-2` contiene celdas de 1 col (Tipo/Departamento, Estado/Versión — cada una con grid interno de 2; Prioridad, Deadline, Campaña, Publicación) y celdas `sm:col-span-2` (Nombre, Responsable/Aprueba, ratios, Adaptaciones, ¿Para quién?, Evento, Brief, Enlace, Adjuntos, Aprobación cliente, Checklist, Notas).
- Repo enforcea `npm run lint --max-warnings 0`, `npx tsc --noEmit`, y `npm test` en verde.
- Referencia visual: `docs/references/creativos/live-nueva-pieza-drawer.png` (1440×1000, dSF 2).

---

### Task 1: Utilidades CSS `.label/.input/.select`

**Files:**
- Modify: `src/styles/index.css`

**Interfaces:**
- Produces: clases globales `.label`, `.input`, `.select` (usadas por el drawer).

- [ ] **Step 1: Añadir el bloque `@layer components`**

En `src/styles/index.css`, añadir tras el `@layer base { … }` existente:

```css
@layer components {
  .label {
    @apply mb-1 block text-sm font-medium text-slate-600;
  }
  .input {
    @apply w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none;
  }
  .select {
    @apply w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-800 focus:border-brand-400 focus:outline-none;
  }
}
```

- [ ] **Step 2: Verificar que Tailwind compila y typecheck/lint pasan**

Run: `npm run build && npm run lint`
Expected: build OK (Tailwind procesa los `@apply` sin error); lint 0 warnings.

- [ ] **Step 3: Commit**

```bash
git add src/styles/index.css
git commit -m "feat(creativos): .label/.input/.select form utilities (live tokens)"
```

---

### Task 2: `SegmentedButtons`

**Files:**
- Create: `src/features/creativos/components/drawer/SegmentedButtons.tsx`
- Test: `src/features/creativos/components/drawer/SegmentedButtons.test.tsx`

**Interfaces:**
- Produces: `SegmentedButtons({ options, value, onChange, buttonClassName, className }: { options: string[]; value: string | string[]; onChange: (option: string) => void; buttonClassName?: string; className?: string })`. Marca activo con `border-brand-500 bg-brand-50 text-brand-700`; inactivo `border-slate-300 text-slate-600`. `onChange` reporta la opción pulsada (el padre decide toggle vs replace).

- [ ] **Step 1: Test (debe fallar)**

Crear `src/features/creativos/components/drawer/SegmentedButtons.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SegmentedButtons } from './SegmentedButtons';

describe('SegmentedButtons', () => {
  it('marks the single active option and reports clicks', () => {
    const onChange = vi.fn();
    render(<SegmentedButtons options={['Baja', 'Media', 'Alta']} value="Media" onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Media' })).toHaveClass('border-brand-500', 'bg-brand-50', 'text-brand-700');
    expect(screen.getByRole('button', { name: 'Baja' })).toHaveClass('border-slate-300', 'text-slate-600');
    fireEvent.click(screen.getByRole('button', { name: 'Alta' }));
    expect(onChange).toHaveBeenCalledWith('Alta');
  });

  it('supports a multi-select value (array)', () => {
    const onChange = vi.fn();
    render(<SegmentedButtons options={['1:1', '4:5', '9:16']} value={['1:1', '9:16']} onChange={onChange} />);
    expect(screen.getByRole('button', { name: '1:1' })).toHaveClass('bg-brand-50');
    expect(screen.getByRole('button', { name: '4:5' })).toHaveClass('border-slate-300');
    fireEvent.click(screen.getByRole('button', { name: '4:5' }));
    expect(onChange).toHaveBeenCalledWith('4:5');
  });
});
```

- [ ] **Step 2: Ejecutar y ver fallar**

Run: `npx vitest run src/features/creativos/components/drawer/SegmentedButtons.test.tsx`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar**

Crear `src/features/creativos/components/drawer/SegmentedButtons.tsx`:

```tsx
import { cn } from '@/lib/utils';

export interface SegmentedButtonsProps {
  options: string[];
  value: string | string[];
  onChange: (option: string) => void;
  buttonClassName?: string;
  className?: string;
}

export function SegmentedButtons({ options, value, onChange, buttonClassName, className }: SegmentedButtonsProps) {
  const isActive = (option: string) =>
    Array.isArray(value) ? value.includes(option) : value === option;

  return (
    <div className={className}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            'rounded-lg border font-medium disabled:opacity-60',
            buttonClassName,
            isActive(option)
              ? 'border-brand-500 bg-brand-50 text-brand-700'
              : 'border-slate-300 text-slate-600',
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar y ver pasar**

Run: `npx vitest run src/features/creativos/components/drawer/SegmentedButtons.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/creativos/components/drawer/SegmentedButtons.tsx src/features/creativos/components/drawer/SegmentedButtons.test.tsx
git commit -m "feat(creativos): SegmentedButtons (single/multi toggle group)"
```

---

### Task 3: `BriefEditor`

**Files:**
- Create: `src/features/creativos/components/drawer/BriefEditor.tsx`
- Test: `src/features/creativos/components/drawer/BriefEditor.test.tsx`

**Interfaces:**
- Produces: `BriefEditor()` — editor presentacional (toolbar inerte + `contenteditable`).

- [ ] **Step 1: Test (debe fallar)**

Crear `src/features/creativos/components/drawer/BriefEditor.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BriefEditor } from './BriefEditor';

describe('BriefEditor', () => {
  it('renders the toolbar buttons and the contenteditable body with placeholder', () => {
    const { container } = render(<BriefEditor />);
    ['Negrita', 'Cursiva', 'Subrayado', 'Tachado', 'Quitar formato'].forEach((t) =>
      expect(screen.getByRole('button', { name: t })).toBeInTheDocument(),
    );
    const body = container.querySelector('[contenteditable="true"]');
    expect(body).not.toBeNull();
    expect(body).toHaveAttribute('data-placeholder', expect.stringContaining('Qué necesita la pieza'));
  });
});
```

- [ ] **Step 2: Ejecutar y ver fallar**

Run: `npx vitest run src/features/creativos/components/drawer/BriefEditor.test.tsx`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar**

Crear `src/features/creativos/components/drawer/BriefEditor.tsx`:

```tsx
import { cn } from '@/lib/utils';

const MARKS: [string, string, string][] = [
  ['B', 'Negrita', 'font-bold'],
  ['i', 'Cursiva', 'italic'],
  ['U', 'Subrayado', 'underline'],
  ['S', 'Tachado', 'line-through'],
];

const SIZES: [string, string][] = [
  ['text-[11px]', 'Texto pequeño'],
  ['text-sm', 'Texto normal'],
  ['text-base', 'Texto grande'],
];

const toolBtn = 'grid h-7 min-w-[28px] place-items-center rounded px-1 text-slate-600 hover:bg-slate-100';

export function BriefEditor() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-300 focus-within:border-brand-400">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-1.5 py-1">
        {MARKS.map(([label, title, cls]) => (
          <button key={title} type="button" title={title} className={cn(toolBtn, cls)}>
            {label}
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-slate-200" />
        {SIZES.map(([sz, title]) => (
          <button key={title} type="button" title={title} className={toolBtn}>
            <span className={sz}>A</span>
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-slate-200" />
        <button type="button" title="Quitar formato" className={toolBtn}>
          <span className="text-xs">✕</span>
        </button>
      </div>
      <div
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Qué necesita la pieza: mensaje, formato, maquetación, referencias…"
        className="min-h-[90px] px-3 py-2 text-sm leading-snug outline-none [&:empty]:before:text-slate-400 [&:empty]:before:content-[attr(data-placeholder)]"
      />
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar y ver pasar**

Run: `npx vitest run src/features/creativos/components/drawer/BriefEditor.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/creativos/components/drawer/BriefEditor.tsx src/features/creativos/components/drawer/BriefEditor.test.tsx
git commit -m "feat(creativos): BriefEditor (rich-text toolbar + contenteditable, inert)"
```

---

### Task 4: `NuevaPiezaDrawer`

**Files:**
- Create: `src/features/creativos/components/NuevaPiezaDrawer.tsx`
- Test: `src/features/creativos/components/NuevaPiezaDrawer.test.tsx`

**Interfaces:**
- Consumes: `Badge`, `Button` de `@/components/ui`; `Calendar` de `lucide-react`; `SegmentedButtons` (Task 2); `BriefEditor` (Task 3); utilidades `.label/.input/.select` (Task 1).
- Produces: `NuevaPiezaDrawer({ open, onClose }: { open: boolean; onClose: () => void })`. Devuelve `null` si `!open`.

- [ ] **Step 1: Test (debe fallar)**

Crear `src/features/creativos/components/NuevaPiezaDrawer.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NuevaPiezaDrawer } from './NuevaPiezaDrawer';

describe('NuevaPiezaDrawer', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<NuevaPiezaDrawer open={false} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the form with "Media" priority active by default when open', () => {
    render(<NuevaPiezaDrawer open onClose={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Nueva pieza' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ej: Reel lanzamiento v2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Media' })).toHaveClass('bg-brand-50');
  });

  it('selects priority and toggles a ratio via local state', () => {
    render(<NuevaPiezaDrawer open onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Alta' }));
    expect(screen.getByRole('button', { name: 'Alta' })).toHaveClass('bg-brand-50');
    expect(screen.getByRole('button', { name: 'Media' })).not.toHaveClass('bg-brand-50');
    const ratio = screen.getByRole('button', { name: '9:16' });
    expect(ratio).not.toHaveClass('bg-brand-50');
    fireEvent.click(ratio);
    expect(ratio).toHaveClass('bg-brand-50');
  });

  it('calls onClose from the ✕, Cerrar, Guardar and overlay', () => {
    const onClose = vi.fn();
    const { container } = render(<NuevaPiezaDrawer open onClose={onClose} />);
    // The ✕ button (aria-label="Cerrar") and the footer "Cerrar" button share the
    // accessible name "Cerrar" — there are exactly two, click both.
    const closers = screen.getAllByRole('button', { name: 'Cerrar' });
    expect(closers).toHaveLength(2);
    closers.forEach((btn) => fireEvent.click(btn));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    fireEvent.click(container.querySelector('[aria-hidden="true"]')!); // overlay
    expect(onClose).toHaveBeenCalledTimes(4);
  });
});
```

- [ ] **Step 2: Ejecutar y ver fallar**

Run: `npx vitest run src/features/creativos/components/NuevaPiezaDrawer.test.tsx`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar**

Crear `src/features/creativos/components/NuevaPiezaDrawer.tsx`:

```tsx
import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { SegmentedButtons } from './drawer/SegmentedButtons';
import { BriefEditor } from './drawer/BriefEditor';

export interface NuevaPiezaDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function NuevaPiezaDrawer({ open, onClose }: NuevaPiezaDrawerProps) {
  const [priority, setPriority] = useState('Media');
  const [ratios, setRatios] = useState<string[]>([]);
  const [approval, setApproval] = useState('Sin enviar');

  if (!open) return null;

  const toggleRatio = (r: string) =>
    setRatios((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/20" onClick={onClose} aria-hidden="true" />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-slate-200 bg-white shadow-2xl sm:inset-y-4 sm:right-4 sm:w-[32rem] sm:overflow-hidden sm:rounded-2xl sm:border lg:w-[32rem]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <h3 className="text-lg font-semibold text-slate-800">Nueva pieza</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700" aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Nombre */}
            <div className="sm:col-span-2">
              <label className="label">Nombre *</label>
              <input className="input" placeholder="Ej: Reel lanzamiento v2" />
            </div>

            {/* Responsable / Aprueba */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg bg-slate-50 px-3 py-2 sm:col-span-2">
              {['Responsable', 'Aprueba'].map((role) => (
                <div key={role}>
                  <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {role}
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm text-slate-400 hover:bg-slate-200"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-dashed border-slate-300 text-slate-400">
                      ＋
                    </span>
                    <span>Asignar</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Tipo / Departamento (celda 1-col con grid interno) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Tipo</label>
                <select className="select">
                  <option>Estático</option>
                  <option>Animado</option>
                  <option>Vídeo</option>
                </select>
              </div>
              <div>
                <label className="label">Departamento</label>
                <select className="select">
                  <option>Diseño</option>
                  <option>Vídeo</option>
                  <option>Otro</option>
                </select>
              </div>
            </div>

            {/* Estado / Versión */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Estado</label>
                <select className="select">
                  <option>Briefing</option>
                  <option>En producción</option>
                  <option>Revisión</option>
                  <option>Cambios</option>
                  <option>Aprobado</option>
                </select>
              </div>
              <div>
                <label className="label">Versión</label>
                <input type="number" min={1} defaultValue={1} className="input" />
              </div>
            </div>

            {/* Prioridad */}
            <div>
              <label className="label">Prioridad</label>
              <SegmentedButtons
                options={['Baja', 'Media', 'Alta']}
                value={priority}
                onChange={setPriority}
                className="flex gap-1.5"
                buttonClassName="flex-1 px-2 py-1.5 text-xs"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="label">Deadline</label>
              <div className="input relative flex items-center gap-2">
                <span className="truncate text-slate-400">dd/mm/aaaa</span>
                <Calendar className="ml-auto h-4 w-4 shrink-0 text-slate-400" />
                <input
                  type="date"
                  aria-label="Fecha"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
            </div>

            {/* Tamaños / ratios */}
            <div className="sm:col-span-2">
              <label className="label">Tamaños / ratios</label>
              <SegmentedButtons
                options={['1:1', '4:5', '9:16', '16:9']}
                value={ratios}
                onChange={toggleRatio}
                className="flex flex-wrap gap-2"
                buttonClassName="px-3 py-1.5 text-sm hover:bg-slate-50"
              />
            </div>

            {/* Adaptaciones / versiones */}
            <div className="rounded-lg border border-dashed border-brand-200 bg-brand-50/40 p-3 sm:col-span-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                  Adaptaciones / versiones
                </span>
              </div>
              <p className="mb-2 text-[11px] text-slate-500">
                Genera de golpe la principal + otras versiones de la misma pieza (estático/vídeo/animado,
                «Sold Out 1st Release», etc.). Comparten evento, cuenta y brief; cada una es su propia pieza
                con su estado y aprobación.
              </p>
              <button type="button" className="text-xs font-medium text-brand-600 hover:underline">
                ＋ Añadir adaptación
              </button>
            </div>

            {/* ¿Para quién? */}
            <div className="rounded-lg border border-slate-200 p-3 sm:col-span-2">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                ¿Para quién? <span className="font-normal normal-case text-slate-400">· elige solo uno</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="label">Cuenta Euphoric</label>
                  <select className="select">
                    <option>—</option>
                    <option>SIGHT</option>
                  </select>
                </div>
                <div>
                  <label className="label">Cliente (CRM)</label>
                  <input className="input" placeholder="Cliente…" />
                </div>
                <div>
                  <label className="label">Empresa interna</label>
                  <select className="select">
                    <option>—</option>
                    <option>ConceptOne</option>
                    <option>CRUDA</option>
                    <option>Etra Agency</option>
                    <option>Euphoric Media</option>
                    <option>Mixmag Spain</option>
                    <option>TAGMAG</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Evento */}
            <div className="sm:col-span-2">
              <label className="label">Evento</label>
              <input className="input" placeholder="Buscar o crear evento…" />
            </div>

            {/* Campaña */}
            <div>
              <label className="label">Campaña</label>
              <select className="select">
                <option>Sin campaña</option>
                <option>Genérico Julio</option>
              </select>
            </div>

            {/* Publicación */}
            <div>
              <label className="label">Publicación</label>
              <select className="select">
                <option>Sin publicación</option>
                <option>Set Times · 2026-07-10</option>
              </select>
            </div>

            {/* Brief */}
            <div className="sm:col-span-2">
              <label className="label">Brief</label>
              <BriefEditor />
            </div>

            {/* Enlace al asset */}
            <div className="sm:col-span-2">
              <label className="label">Enlace al asset</label>
              <input className="input" placeholder="Drive / Frame.io / Dropbox…" />
            </div>

            {/* Adjuntos */}
            <div className="sm:col-span-2">
              <label className="label">Adjuntos</label>
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-dashed border-slate-300 px-2 py-1.5 text-xs text-slate-500 hover:border-brand-400 hover:text-brand-600">
                  ＋ Adjuntar
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>

            {/* Aprobación del cliente */}
            <div className="rounded-lg border border-slate-200 p-3 sm:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Aprobación del cliente
                </span>
                <Badge variant="neutral">{approval}</Badge>
              </div>
              <SegmentedButtons
                options={['Sin enviar', 'Pendiente cliente', 'Aprobado cliente', 'Cambios cliente']}
                value={approval}
                onChange={setApproval}
                className="flex flex-wrap gap-1.5"
                buttonClassName="px-2.5 py-1 text-xs"
              />
            </div>

            {/* Checklist */}
            <div className="rounded-lg border border-slate-200 p-3 sm:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Checklist</span>
              </div>
              <button type="button" className="text-xs text-brand-600 hover:underline">
                ＋ Añadir tarea
              </button>
            </div>

            {/* Notas */}
            <div className="sm:col-span-2">
              <label className="label">Notas</label>
              <textarea className="input min-h-[60px]" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-5 py-3">
          <span />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={onClose}>
              Guardar
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
```

- [ ] **Step 4: Ejecutar y ver pasar**

Run: `npx vitest run src/features/creativos/components/NuevaPiezaDrawer.test.tsx`
Expected: PASS (4 tests).

Nota: el botón ✕ lleva `aria-label="Cerrar"` (fiel al HTML del live) y el botón "Cerrar" del footer tiene ese texto, así que AMBOS tienen nombre accesible "Cerrar" (dos coincidencias). Por eso el test usa `getAllByRole('button', { name: 'Cerrar' })` y comprueba que hay exactamente 2. `getByRole('button', { name: 'Cerrar' })` (singular) lanzaría por múltiples coincidencias.

- [ ] **Step 5: Commit**

```bash
git add src/features/creativos/components/NuevaPiezaDrawer.tsx src/features/creativos/components/NuevaPiezaDrawer.test.tsx
git commit -m "feat(creativos): NuevaPiezaDrawer — full calco form drawer"
```

---

### Task 5: Cablear en `CreativosPage`

**Files:**
- Modify: `src/features/creativos/pages/CreativosPage.tsx`
- Test: `src/features/creativos/pages/CreativosPage.test.tsx`

**Interfaces:**
- Consumes: `NuevaPiezaDrawer` (Task 4).

- [ ] **Step 1: Añadir el test de integración (debe fallar)**

En `src/features/creativos/pages/CreativosPage.test.tsx`, añadir dentro del `describe` existente:

```tsx
it('opens and closes the Nueva pieza drawer', () => {
  render(<CreativosPage />);
  expect(screen.queryByRole('heading', { name: 'Nueva pieza' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Nueva pieza/ }));
  expect(screen.getByRole('heading', { name: 'Nueva pieza' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
  expect(screen.queryByRole('heading', { name: 'Nueva pieza' })).not.toBeInTheDocument();
});
```

Asegúrate de que `fireEvent` está importado en ese fichero (`import { render, screen, fireEvent, within } from '@testing-library/react'`).

- [ ] **Step 2: Ejecutar y ver fallar**

Run: `npx vitest run src/features/creativos/pages/CreativosPage.test.tsx`
Expected: FAIL — no existe el heading "Nueva pieza" al pulsar (el botón aún es inerte).

- [ ] **Step 3: Cablear el drawer en la página**

En `src/features/creativos/pages/CreativosPage.tsx`:
(a) añadir el import `import { NuevaPiezaDrawer } from '../components/NuevaPiezaDrawer';`
(b) añadir estado: `const [drawerOpen, setDrawerOpen] = useState(false);` (junto al `useState` del filtro; `useState` ya está importado).
(c) dar `onClick` al botón "+ Nueva pieza":

```tsx
<Button variant="primary" size="sm" onClick={() => setDrawerOpen(true)}>
  + Nueva pieza
</Button>
```

(d) montar el drawer al final del árbol devuelto (dentro del `<div className="space-y-4">`, tras `<PiecesTable />`):

```tsx
<NuevaPiezaDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
```

- [ ] **Step 4: Ejecutar y ver pasar + verificación completa**

Run: `npx vitest run src/features/creativos/pages/CreativosPage.test.tsx`
Expected: PASS.

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: tsc sin errores; lint 0 warnings; suite completa en verde.

- [ ] **Step 5: Commit**

```bash
git add src/features/creativos/pages/CreativosPage.tsx src/features/creativos/pages/CreativosPage.test.tsx
git commit -m "feat(creativos): wire + Nueva pieza button to open the drawer"
```

---

### Task 6: Verificación pixel-perfect

**Files:** ninguno (solo verificación; capturas al scratchpad).

- [ ] **Step 1: Dev server** (si no está): `npm run dev` → `http://localhost:5173/`.
- [ ] **Step 2: Capturar el drawer** con Playwright (chromium de caché `/home/arian/.npm/_npx/e41f203b7505f1fb/...`, viewport 1440×1000, dSF 2). Login mock si hace falta; ir a `/creativos`; pulsar "+ Nueva pieza"; screenshot del `aside`.
- [ ] **Step 3: Contrastar** contra `docs/references/creativos/live-nueva-pieza-drawer.png`: header, Nombre, Responsable/Aprueba, fila Tipo/Departamento/Estado/Versión, Prioridad ("Media" activo) / Deadline, ratios, Adaptaciones (dashed brand), ¿Para quién?, Evento, Campaña/Publicación, Brief (toolbar), Enlace, Adjuntos, Aprobación cliente, Checklist, Notas, footer Cerrar/Guardar.
- [ ] **Step 4: Probar interacción**: seleccionar Prioridad "Alta", togglear un ratio, cambiar Aprobación (badge refleja), cerrar por overlay.
- [ ] **Step 5: Actualizar memoria** ([[fase5-creativos-status]]): microfase drawer "Nueva pieza" completada en `feature/creativos-nueva-pieza-drawer`, PR sobre `feature/fase5-creativos`.

---

## Notas de auto-revisión (cobertura del spec)

- Utilidades `.label/.input/.select` → Task 1. `SegmentedButtons` (Prioridad/ratios/Aprobación) → Task 2. `BriefEditor` → Task 3. Drawer completo con todos los campos + col-spans exactos + estado local → Task 4. Cableado del botón + abrir/cerrar → Task 5. Verificación pixel + interacción → Task 6.
- Col-spans: Tipo/Departamento y Estado/Versión son celdas de 1 col con grid interno de 2; Prioridad/Deadline/Campaña/Publicación son 1 col; el resto `sm:col-span-2` (fiel al HTML).
- Sin placeholders: código literal en cada step.
- Consistencia de tipos: `NuevaPiezaDrawerProps { open, onClose }` (Task 4) consumido por Task 5; `SegmentedButtons`/`BriefEditor` (Tasks 2/3) consumidos por Task 4.
- Deltas intencionales: brand violeta (Guardar/selección) vs gris del live; overlay añadido para cerrar al clicar fuera; toolbar del Brief inerte; uuids de options → valores planos.
