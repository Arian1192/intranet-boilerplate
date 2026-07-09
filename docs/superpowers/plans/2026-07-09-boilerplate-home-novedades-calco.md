# Home Novedades (calco pixel-perfect) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir el bloque Novedades del dashboard en un calco pixel-perfect de la home real: cards de novedad separadas y rosáceas, formulario inline "Nueva novedad" (sin modal) y expandir/colapsar con contenido + Editar/Eliminar.

**Architecture:** Se refactoriza `NewsFeed.tsx` (contenedor) y se añaden dos componentes hermanos con responsabilidad única: `NewsCard.tsx` (card individual con expand/collapse) y `NewsForm.tsx` (formulario inline presentacional). Se añade el campo opcional `content` a `NewsItem` y dos tokens de color exactos a Tailwind. Todo es presentacional; nada persiste.

**Tech Stack:** React + TypeScript, Vite, TailwindCSS, Vitest + @testing-library/react, lucide-react.

## Global Constraints

- **Solo presentacional:** `Publicar`, `Cancelar`, `Editar`, `Eliminar` y el chevron solo manipulan estado de UI local. Nunca se crea/edita/borra datos ni se llama a mutaciones del repositorio.
- **Colores exactos (medidos de las capturas):** card novedad fondo `#F7F6FC`, borde `#EEE3F6`; inputs del formulario borde `slate-300` (`#CBD5E1`); card/panel del formulario borde `slate-200` (`#E2E8F0`); checkbox accent `#0075FF`; botón Publicar brand-600 (`#773C9F`).
- **Tipografía:** system font stack existente. Único cambio: título de novedad → `font-semibold` (slate-800 `#1E293B`).
- **No hardcodear brand colors:** usar tokens Tailwind; los dos colores nuevos de la card se añaden como tokens `news-card` / `news-border`.
- **Tests:** Vitest, ejecutados con `npx vitest run <ruta>`.

---

### Task 1: Fundaciones — tokens de color, tipo `content`, mock data

**Files:**
- Modify: `tailwind.config.js:5-26` (añadir token `news` dentro de `colors`)
- Modify: `src/types/index.ts:23-32` (añadir `content?` a `NewsItem`)
- Modify: `src/repositories/MockRepository.ts:119-137` (añadir `content` a los items de news)
- Test: `src/repositories/MockRepository.test.ts`

**Interfaces:**
- Produces: `NewsItem.content?: string`. Tokens Tailwind `news-card` (bg `#F7F6FC`) y `news-border` (border `#EEE3F6`).

- [ ] **Step 1: Escribir el test que falla**

Añadir este test dentro del `describe('MockRepository', ...)` en `src/repositories/MockRepository.test.ts`:

```ts
  it('includes content on news items for the expandable card', async () => {
    const repo = new MockRepository();
    const dashboard = await repo.getDashboard();
    expect(dashboard.news.length).toBeGreaterThan(0);
    expect(dashboard.news.every((n) => typeof n.content === 'string' && n.content.length > 0)).toBe(true);
  });
```

- [ ] **Step 2: Ejecutar el test para verificar que falla**

Run: `npx vitest run src/repositories/MockRepository.test.ts`
Expected: FAIL — los items de news aún no tienen `content`.

- [ ] **Step 3: Añadir el token de color en `tailwind.config.js`**

Dentro de `theme.extend.colors`, junto a `brand` y `status`, añadir:

```js
        news: {
          card: '#F7F6FC',
          border: '#EEE3F6',
        },
```

- [ ] **Step 4: Añadir el campo `content` al tipo `NewsItem`**

En `src/types/index.ts`, en la interfaz `NewsItem`, añadir la propiedad opcional tras `title`:

```ts
export interface NewsItem {
  id: string;
  author: string;
  scope: string;
  date: string;
  title: string;
  content?: string;
  scheduledFor?: string;
  actionLabel?: string;
  actionHref?: string;
}
```

- [ ] **Step 5: Añadir `content` a los items mock**

En `src/repositories/MockRepository.ts`, dentro del array `news`, añadir el campo `content` a cada item:

```ts
      news: [
        {
          id: 'news-1',
          author: 'Ana López',
          scope: 'Grupo',
          date: '06 jul 2026',
          title: 'Comida de verano, ganas de pasar un rato con todos vosotros! 🍻',
          content:
            'Nos vemos el viernes para la comida de verano del equipo. Habrá barra libre y sorpresas. Confirma tu asistencia para reservar sitio.',
          scheduledFor: 'Programada 09 jul 2026',
          actionLabel: 'Confirmar asistencia',
          actionHref: '#',
        },
        {
          id: 'news-2',
          author: 'Ana López',
          scope: 'Grupo',
          date: '05 jul 2026',
          title: 'Teletrabajo hasta el 7 de julio incluido',
          content:
            'Debido a la instalación de las nuevas máquinas de aire acondicionado establecemos teletrabajo hasta el 7 de julio inclusive. Estad atentos a próximas novedades.',
        },
      ],
```

- [ ] **Step 6: Ejecutar el test para verificar que pasa**

Run: `npx vitest run src/repositories/MockRepository.test.ts`
Expected: PASS (todos los tests, incluido el nuevo).

- [ ] **Step 7: Commit**

```bash
git add tailwind.config.js src/types/index.ts src/repositories/MockRepository.ts src/repositories/MockRepository.test.ts
git commit -m "feat: add news content field and rose card color tokens"
```

---

### Task 2: `NewsCard` — card individual rosácea con expand/collapse

**Files:**
- Create: `src/features/dashboard/NewsCard.tsx`
- Test: `src/features/dashboard/NewsCard.test.tsx`

**Interfaces:**
- Consumes: `NewsItem` de `@/types` (con `content?`); `Button` de `@/components/ui`.
- Produces: `NewsCard({ item }: { item: NewsItem })` — export nombrado `NewsCard` y `NewsCardProps`.

- [ ] **Step 1: Escribir el test que falla**

Crear `src/features/dashboard/NewsCard.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NewsCard } from './NewsCard';
import type { NewsItem } from '@/types';

const item: NewsItem = {
  id: 'n1',
  author: 'Ana López',
  scope: 'Grupo',
  date: '05 jul 2026',
  title: 'Teletrabajo hasta el 7 de julio incluido',
  content: 'Detalle completo de la novedad.',
};

describe('NewsCard', () => {
  it('renders the title with semibold weight and hides content when collapsed', () => {
    render(<NewsCard item={item} />);
    expect(screen.getByText(item.title)).toHaveClass('font-semibold');
    expect(screen.queryByText('Detalle completo de la novedad.')).not.toBeInTheDocument();
    expect(screen.queryByText('Editar')).not.toBeInTheDocument();
  });

  it('reveals content and Editar/Eliminar when the chevron is clicked', () => {
    render(<NewsCard item={item} />);
    fireEvent.click(screen.getByRole('button', { name: 'Expandir' }));
    expect(screen.getByText('Detalle completo de la novedad.')).toBeInTheDocument();
    expect(screen.getByText('Editar')).toBeInTheDocument();
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Colapsar' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar el test para verificar que falla**

Run: `npx vitest run src/features/dashboard/NewsCard.test.tsx`
Expected: FAIL con "Cannot find module './NewsCard'".

- [ ] **Step 3: Implementar `NewsCard`**

Crear `src/features/dashboard/NewsCard.tsx`:

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui';
import type { NewsItem } from '@/types';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

export interface NewsCardProps {
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-news-border bg-news-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
          {item.author.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-normal text-slate-700">{item.author}</span>
            <ArrowRight className="h-3 w-3" />
            <span>{item.scope}</span>
            <span>·</span>
            <span>{item.date}</span>
            {item.scheduledFor && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-700">
                {item.scheduledFor}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-800">{item.title}</p>
          {expanded && item.content && (
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.content}</p>
          )}
          {expanded && (
            <div className="mt-4 flex items-center justify-between">
              <div>
                {item.actionLabel && (
                  <Button variant="primary" size="sm">
                    {item.actionLabel}
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <button type="button" className="hover:text-slate-600">
                  Editar
                </button>
                <button type="button" className="hover:text-slate-600">
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-slate-300 hover:text-slate-500"
          aria-label={expanded ? 'Colapsar' : 'Expandir'}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar el test para verificar que pasa**

Run: `npx vitest run src/features/dashboard/NewsCard.test.tsx`
Expected: PASS (ambos tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/dashboard/NewsCard.tsx src/features/dashboard/NewsCard.test.tsx
git commit -m "feat: add expandable rose NewsCard component"
```

---

### Task 3: `NewsForm` — formulario inline "Nueva novedad"

**Files:**
- Create: `src/features/dashboard/NewsForm.tsx`
- Test: `src/features/dashboard/NewsForm.test.tsx`

**Interfaces:**
- Consumes: `Card`, `Input`, `Select`, `Textarea`, `Button`, `SegmentedControl` de `@/components/ui`.
- Produces: `NewsForm({ onClose }: { onClose: () => void })` — export nombrado `NewsForm` y `NewsFormProps`.

- [ ] **Step 1: Escribir el test que falla**

Crear `src/features/dashboard/NewsForm.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NewsForm } from './NewsForm';

describe('NewsForm', () => {
  it('renders the timing segmented control and publish timing options', () => {
    render(<NewsForm onClose={() => {}} />);
    expect(screen.getByText('¿Cuándo se publica?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ahora' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Programar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Borrador' })).toBeInTheDocument();
  });

  it('calls onClose when Publicar or Cancelar is clicked', () => {
    const onClose = vi.fn();
    render(<NewsForm onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
```

- [ ] **Step 2: Ejecutar el test para verificar que falla**

Run: `npx vitest run src/features/dashboard/NewsForm.test.tsx`
Expected: FAIL con "Cannot find module './NewsForm'".

- [ ] **Step 3: Implementar `NewsForm`**

Crear `src/features/dashboard/NewsForm.tsx`:

```tsx
import { useState } from 'react';
import { Card, Input, Select, Textarea, Button, SegmentedControl } from '@/components/ui';

export interface NewsFormProps {
  onClose: () => void;
}

type Timing = 'now' | 'schedule' | 'draft';

const timingOptions: { label: string; value: Timing }[] = [
  { label: 'Ahora', value: 'now' },
  { label: 'Programar', value: 'schedule' },
  { label: 'Borrador', value: 'draft' },
];

export function NewsForm({ onClose }: NewsFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [scope, setScope] = useState('Todo el grupo');
  const [buttonHref, setButtonHref] = useState('');
  const [buttonLabel, setButtonLabel] = useState('');
  const [timing, setTiming] = useState<Timing>('now');
  const [notify, setNotify] = useState(true);
  const [email, setEmail] = useState(false);

  return (
    <Card className="border-slate-200 p-5">
      <div className="space-y-4">
        <Input
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-slate-300"
        />
        <Textarea
          label="Contenido"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border-slate-300"
        />
        <Select
          label="Ámbito"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          className="border-slate-300"
        >
          <option>Todo el grupo</option>
          <option>ConceptOne</option>
          <option>Etra</option>
          <option>Producción</option>
        </Select>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Enlace del botón (opcional)"
            placeholder="https://..."
            value={buttonHref}
            onChange={(e) => setButtonHref(e.target.value)}
            className="border-slate-300"
          />
          <Input
            label="Texto del botón"
            placeholder="Ej.: Confirmar asistencia"
            value={buttonLabel}
            onChange={(e) => setButtonLabel(e.target.value)}
            className="border-slate-300"
          />
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="mb-3 text-sm font-medium text-slate-700">¿Cuándo se publica?</p>
          <SegmentedControl
            fullWidth
            options={timingOptions}
            value={timing}
            onChange={setTiming}
          />
          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
                className="accent-[#0075FF]"
              />
              Notificar a todo el equipo <span className="text-slate-400">(campanita)</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={email}
                onChange={(e) => setEmail(e.target.checked)}
                className="accent-[#0075FF]"
              />
              Enviar también por email{' '}
              <span className="text-slate-400">(para novedades importantes)</span>
            </label>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <Button variant="primary" onClick={onClose}>
            Publicar
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

- [ ] **Step 4: Ejecutar el test para verificar que pasa**

Run: `npx vitest run src/features/dashboard/NewsForm.test.tsx`
Expected: PASS (ambos tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/dashboard/NewsForm.tsx src/features/dashboard/NewsForm.test.tsx
git commit -m "feat: add inline NewsForm for creating a novedad"
```

---

### Task 4: Refactor `NewsFeed` — cards separadas + toggle del formulario

**Files:**
- Modify: `src/features/dashboard/NewsFeed.tsx` (reescritura completa)
- Test: `src/features/dashboard/NewsFeed.test.tsx`

**Interfaces:**
- Consumes: `NewsCard` de `./NewsCard`, `NewsForm` de `./NewsForm`, `NewsItem` de `@/types`.
- Produces: `NewsFeed({ items }: { items: NewsItem[] })` (firma sin cambios).

- [ ] **Step 1: Escribir el test que falla**

Crear `src/features/dashboard/NewsFeed.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NewsFeed } from './NewsFeed';
import type { NewsItem } from '@/types';

const items: NewsItem[] = [
  { id: 'n1', author: 'Ana', scope: 'Grupo', date: '05 jul 2026', title: 'Primera novedad', content: 'A' },
  { id: 'n2', author: 'Ana', scope: 'Grupo', date: '04 jul 2026', title: 'Segunda novedad', content: 'B' },
];

describe('NewsFeed', () => {
  it('renders one card per item', () => {
    render(<NewsFeed items={items} />);
    expect(screen.getByText('Primera novedad')).toBeInTheDocument();
    expect(screen.getByText('Segunda novedad')).toBeInTheDocument();
  });

  it('toggles the inline form with the + button', () => {
    render(<NewsFeed items={items} />);
    expect(screen.queryByText('¿Cuándo se publica?')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Añadir novedad' }));
    expect(screen.getByText('¿Cuándo se publica?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByText('¿Cuándo se publica?')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar el test para verificar que falla**

Run: `npx vitest run src/features/dashboard/NewsFeed.test.tsx`
Expected: FAIL — el formulario no se monta / no existe el toggle.

- [ ] **Step 3: Reescribir `NewsFeed`**

Reemplazar todo el contenido de `src/features/dashboard/NewsFeed.tsx` por:

```tsx
import { useState } from 'react';
import type { NewsItem } from '@/types';
import { NewsCard } from './NewsCard';
import { NewsForm } from './NewsForm';

export interface NewsFeedProps {
  items: NewsItem[];
}

export function NewsFeed({ items }: NewsFeedProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Novedades
        </h2>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-sm font-medium text-slate-500 hover:bg-brand-50 hover:text-brand-600"
          aria-label="Añadir novedad"
        >
          +
        </button>
      </div>
      {showForm && (
        <div className="mb-3">
          <NewsForm onClose={() => setShowForm(false)} />
        </div>
      )}
      <div className="space-y-3">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Ejecutar el test para verificar que pasa**

Run: `npx vitest run src/features/dashboard/NewsFeed.test.tsx`
Expected: PASS (ambos tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/dashboard/NewsFeed.tsx src/features/dashboard/NewsFeed.test.tsx
git commit -m "feat: rebuild NewsFeed with separated cards and inline form toggle"
```

---

### Task 5: Verificación integral (typecheck, tests, calco visual)

**Files:**
- Ninguno nuevo (verificación).

- [ ] **Step 1: Typecheck del proyecto**

Run: `npx tsc --noEmit`
Expected: sin errores. (Verifica que `SegmentedControl<Timing>` infiere bien el tipo y que `content` no rompe nada.)

- [ ] **Step 2: Suite de tests completa**

Run: `npx vitest run`
Expected: PASS en toda la suite (incluidos los nuevos tests de Task 1–4).

- [ ] **Step 3: Verificación visual contra las capturas**

Levantar la app (`npm run dev`) y navegar al dashboard. Comparar con las 3 capturas de referencia (`C:\Users\Arian\Documents\Capturas de pantalla\home`):
- Cards de novedad separadas, con fondo `#F7F6FC` y borde rosáceo `#EEE3F6` (no blanco unido).
- Título en `font-semibold`.
- Click en "+" monta el formulario inline (Título, Contenido, Ámbito, Enlace/Texto del botón, panel "¿Cuándo se publica?" con Ahora/Programar/Borrador y los dos checkboxes, Publicar/Cancelar).
- Click en el chevron expande la card mostrando el contenido y los enlaces Editar/Eliminar; el chevron cambia a "arriba".
- Publicar y Cancelar cierran el formulario sin persistir nada.

Usar la skill `verify` si está disponible para conducir el flujo end-to-end.

- [ ] **Step 4: Commit final (si hubo ajustes de calco)**

```bash
git add -A
git commit -m "fix: pixel-perfect adjustments for Home novedades calco"
```

(Si el Step 3 no requirió cambios, omitir este commit.)

---

## Notas de implementación

- **Restricción de solo-lectura:** ningún handler llama a métodos de mutación del repositorio. Editar/Eliminar/Publicar/Cancelar son no-ops o cierran UI.
- **Tokens Tailwind:** `bg-news-card` y `border-news-border` derivan de `colors.news = { card, border }`. Si el build no reconoce las clases, reiniciar el dev server para que Tailwind recompile la config.
- **`SegmentedControl` reutilizado:** ya coincide pixel-perfect (track slate-100, activo blanco, inactivo slate-500); no se re-estiliza.
