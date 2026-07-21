# Panel Ayuda — Modal "Reportar con captura" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hacer funcional el botón "Reportar con captura" del `HelpPanel`: abre el modal "Reportar" del live (anclado abajo-izquierda con backdrop), con toggle Algo falla/Una idea, textarea, zona adjuntar inerte, y "Enviar" que cierra + muestra un toast de confirmación.

**Architecture:** Nuevo componente `ReportDialog` (backdrop + card anclada abajo-izq, estado local: pestaña + texto). El `HelpPanel` orquesta: estado `reporting` (muestra el dialog en vez del panel) y `sent` (toast efímero auto-descartable). Sin backend — presentacional.

**Tech Stack:** React 19, TypeScript, Tailwind, Vitest + React Testing Library + user-event, lucide-react.

## Global Constraints

- **Colorimetría 100% fiel al live**: NO clases `brand-*`. Grises/negros del live.
- **Tokens exactos** del spec `docs/superpowers/specs/2026-07-21-help-report-dialog-design.md` §3 (medidos del live). No aproximar.
- **Presentacional (sin backend)**: "Enviar" no persiste nada; "Añadir captura" inerte (sin `onClick`). El único efecto de "Enviar" es cerrar el modal + toast.
- **Anclaje**: el modal va `fixed bottom-4 left-4` (mismo sitio que el panel Ayuda), NO centrado. Backdrop `fixed inset-0 bg-slate-900/40`.
- **Gate por tarea**: `npx vitest run <ficheros>` verde, `npm run lint` = 0, `npx tsc --noEmit` limpio antes de commit.

---

### Task 1: Componente `ReportDialog`

**Files:**
- Create: `src/components/layout/ReportDialog.tsx`
- Modify: `src/components/layout/index.ts` (export)
- Test: `src/components/layout/ReportDialog.test.tsx`

**Interfaces:**
- Produces: `<ReportDialog onCancel={() => void} onSend={() => void} />`. Estado local: pestaña (`'bug' | 'idea'`, default `'bug'`) y texto. `onSend` solo se invoca con texto no vacío. El backdrop es un `<button aria-label="Cerrar">` que llama `onCancel`.

- [ ] **Step 1: Escribir el test que falla**

`src/components/layout/ReportDialog.test.tsx`:
```tsx
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportDialog } from './ReportDialog';

function setup() {
  const onCancel = vi.fn();
  const onSend = vi.fn();
  render(<ReportDialog onCancel={onCancel} onSend={onSend} />);
  return { onCancel, onSend };
}

describe('ReportDialog', () => {
  it('renderiza título, pestañas, textarea, adjuntar, ayuda y botones', () => {
    setup();
    expect(screen.getByRole('heading', { name: 'Reportar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Algo falla' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Una idea' })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Añadir captura')).toBeInTheDocument();
    expect(screen.getByText(/Se adjuntan solos/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument();
  });

  it('Enviar está deshabilitado sin texto y se habilita al escribir', async () => {
    const user = userEvent.setup();
    const { onSend } = setup();
    const enviar = screen.getByRole('button', { name: 'Enviar' });
    expect(enviar).toBeDisabled();
    await user.type(screen.getByRole('textbox'), 'algo va mal');
    expect(enviar).toBeEnabled();
    await user.click(enviar);
    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it('el placeholder cambia según la pestaña', async () => {
    const user = userEvent.setup();
    setup();
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'placeholder',
      'Qué esperabas que pasara y qué ha pasado…'
    );
    await user.click(screen.getByRole('button', { name: 'Una idea' }));
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'placeholder',
      'Qué se podría hacer mejor…'
    );
  });

  it('Cancelar y el backdrop invocan onCancel', async () => {
    const user = userEvent.setup();
    const { onCancel } = setup();
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onCancel).toHaveBeenCalledTimes(2);
  });
});
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `npx vitest run src/components/layout/ReportDialog.test.tsx`
Expected: FAIL ("Cannot find module './ReportDialog'").

- [ ] **Step 3: Crear `ReportDialog.tsx`**

```tsx
import { useState } from 'react';

export interface ReportDialogProps {
  onCancel: () => void;
  onSend: () => void;
}

const PLACEHOLDERS = {
  bug: 'Qué esperabas que pasara y qué ha pasado…',
  idea: 'Qué se podría hacer mejor…',
} as const;

export function ReportDialog({ onCancel, onSend }: ReportDialogProps) {
  const [tab, setTab] = useState<'bug' | 'idea'>('bug');
  const [text, setText] = useState('');
  const canSend = text.trim() !== '';

  const tabClass = (active: boolean) =>
    `rounded-md px-2 py-0.5 text-xs font-medium ${
      active ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'
    }`;

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCancel}
        className="fixed inset-0 z-40 cursor-default bg-slate-900/40"
      />
      <div className="fixed bottom-4 left-4 z-50 w-[480px] rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Reportar</h2>
          <div className="inline-flex items-center">
            <button type="button" onClick={() => setTab('bug')} className={tabClass(tab === 'bug')}>
              Algo falla
            </button>
            <button type="button" onClick={() => setTab('idea')} className={tabClass(tab === 'idea')}>
              Una idea
            </button>
          </div>
        </div>

        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDERS[tab]}
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />

        <button
          type="button"
          className="mt-3 w-full rounded-lg border border-dashed border-slate-300 py-2.5 text-center text-sm"
        >
          <span className="font-medium text-slate-600">Añadir captura</span>
          <span className="text-slate-400"> · o pega una con ⌘V</span>
        </button>

        <p className="mt-3 text-[11px] text-slate-400">
          Se adjuntan solos la página, el navegador, el tamaño de ventana y los últimos errores.
        </p>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!canSend}
            onClick={() => canSend && onSend()}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              canSend
                ? 'bg-slate-800 text-white hover:bg-slate-900'
                : 'cursor-not-allowed bg-slate-200 text-slate-400'
            }`}
          >
            Enviar
          </button>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 4: Exportar en `index.ts`**

Añadir a `src/components/layout/index.ts`:
```ts
export * from './ReportDialog';
```

- [ ] **Step 5: Ejecutar tests + gate**

Run: `npx vitest run src/components/layout/ReportDialog.test.tsx && npm run lint && npx tsc --noEmit`
Expected: PASS + lint 0 + tsc limpio.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/ReportDialog.tsx src/components/layout/index.ts src/components/layout/ReportDialog.test.tsx
git commit -m "feat(help-report): ReportDialog (modal abajo-izq + backdrop, toggle, textarea, Enviar)"
```

---

### Task 2: Integrar en `HelpPanel` + toast

**Files:**
- Modify: `src/components/layout/HelpPanel.tsx`
- Test: `src/components/layout/HelpPanel.test.tsx` (ampliar)

**Interfaces:**
- Consumes: `ReportDialog` (Task 1).
- Produces: `HelpPanel` con estado `reporting` (muestra `ReportDialog` en vez del panel) y `sent` (toast efímero "Gracias, hemos recibido tu incidencia." auto-descartado a los 3 s).

- [ ] **Step 1: Ampliar el test**

Añadir a `src/components/layout/HelpPanel.test.tsx` (asegurar imports `userEvent`, `render`, `screen`, `@testing-library/jest-dom`):
```tsx
  it('abre el modal Reportar, envía y muestra el toast', async () => {
    const user = userEvent.setup();
    render(<HelpPanel />);
    await user.click(screen.getByRole('button', { name: 'Reportar con captura' }));
    expect(screen.getByRole('heading', { name: 'Reportar' })).toBeInTheDocument();
    // el panel de ayuda ya no está visible
    expect(screen.queryByText('Reportar con captura')).toBeNull();
    await user.type(screen.getByRole('textbox'), 'no carga la página');
    await user.click(screen.getByRole('button', { name: 'Enviar' }));
    expect(screen.queryByRole('heading', { name: 'Reportar' })).toBeNull();
    expect(screen.getByText('Gracias, hemos recibido tu incidencia.')).toBeInTheDocument();
  });

  it('Cancelar vuelve al panel de ayuda', async () => {
    const user = userEvent.setup();
    render(<HelpPanel />);
    await user.click(screen.getByRole('button', { name: 'Reportar con captura' }));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByPlaceholderText('Pregunta o cuenta qué falla…')).toBeInTheDocument();
  });
```

- [ ] **Step 2: Ejecutar para verificar que falla**

Run: `npx vitest run src/components/layout/HelpPanel.test.tsx`
Expected: FAIL (el botón "Reportar con captura" es inerte; no hay modal ni toast).

- [ ] **Step 3: Editar `HelpPanel.tsx`**

Cambiar el import inicial y añadir estado + render del dialog/toast. El fichero completo queda así:
```tsx
import { useEffect, useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { ReportDialog } from './ReportDialog';

export function HelpPanel() {
  const [open, setOpen] = useState(true);
  const [reporting, setReporting] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!sent) return;
    const timer = setTimeout(() => setSent(false), 3000);
    return () => clearTimeout(timer);
  }, [sent]);

  if (reporting) {
    return (
      <ReportDialog
        onCancel={() => setReporting(false)}
        onSend={() => {
          setReporting(false);
          setSent(true);
        }}
      />
    );
  }

  return (
    <>
      {open ? (
        <div className="fixed bottom-4 left-4 z-30 w-[352px] rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <HelpCircle className="h-4 w-4 text-slate-500" />
              Ayuda
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-600"
              aria-label="Cerrar ayuda"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-slate-500">
            Pregunta lo que quieras de esta pantalla, o cuenta qué está fallando.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              placeholder="Pregunta o cuenta qué falla…"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
            <button
              type="button"
              className="shrink-0 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900"
            >
              Enviar
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={() => setReporting(true)}
              className="hover:text-slate-600"
            >
              Reportar con captura
            </button>
            <button type="button" className="hover:text-slate-600">
              Mis avisos
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 left-4 z-30 grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-lg hover:text-slate-800"
          aria-label="Abrir ayuda"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      )}
      {sent && (
        <div className="fixed bottom-4 left-4 z-50 rounded-lg bg-slate-800 px-4 py-2.5 text-sm text-white shadow-lg">
          Gracias, hemos recibido tu incidencia.
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 4: Ejecutar tests + gate**

Run: `npx vitest run src/components/layout/HelpPanel.test.tsx && npm run lint && npx tsc --noEmit`
Expected: PASS + lint 0 + tsc limpio.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/HelpPanel.tsx src/components/layout/HelpPanel.test.tsx
git commit -m "feat(help-report): HelpPanel abre ReportDialog y muestra toast al enviar"
```

---

### Task 3: Verificación final (suite + Playwright ours↔live)

- [ ] **Step 1: Suite completa + lint + tsc**

Run: `npm test -- --run && npm run lint && npx tsc --noEmit`
Expected: todos verdes, lint 0, tsc limpio. Si algo falla, arreglar y commit `fix(help-report): …`.

- [ ] **Step 2: Comparar contra el live**

Levantar `npm run dev`; con Playwright navegar a `/`, pulsar "Reportar con captura", screenshot `docs/references/home-v2/ours-reportar-modal.png`. Checklist pixel-perfect contra `docs/references/home-v2/live-reportar-modal.png`:
  - Card abajo-izq `w-[480px] rounded-xl shadow-2xl`, backdrop atenuando.
  - Header "Reportar" + toggle (activa `bg-slate-100`, inactiva slate-400).
  - Placeholder correcto por pestaña.
  - Zona adjuntar dashed, texto de ayuda 11px, Cancelar + Enviar (deshabilitado gris sin texto).
  - Al escribir + Enviar: cierra + toast slate abajo-izq.
  Anotar desviaciones y corregir (commit `fix(help-report): ajuste pixel-perfect …`).

- [ ] **Step 3: Commit de captura**

```bash
git add docs/references/home-v2/ours-reportar-modal.png
git commit -m "test(help-report): captura ours del modal Reportar"
```

---

## Notas de ejecución
- `HelpPanel.test.tsx` ya existe (de la fase Home v2) con tests del panel/colapso; NO los rompas — solo añade los dos casos nuevos. Si algún test previo asume que "Reportar con captura" es inerte, actualízalo.
- El backdrop es un `<button aria-label="Cerrar">` a pantalla completa (mismo patrón que `EspaciosDropdown`), para que sea accesible y testeable por rol/nombre.
