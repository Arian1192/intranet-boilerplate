# Documentos (`/mi-trabajo`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Calcar pixel-perfect el módulo Documentos del live (`/mi-trabajo`): shell Tailwind de 3 columnas + un editor de bloques funcional (BlockNote) con el doc seed "Bienvenido a Documentos", árbol de documentos y panel de Tareas — todo in-memory, sin Supabase.

**Architecture:** Módulo `src/features/mi-trabajo/` (patrón "cruda": `data/` local + `components/` + `pages/`). El canvas del editor es **BlockNote** (misma librería que el original, clases `bn-`), montado dentro de un `article` calcado. El shell (árbol izquierdo 224px, centro flex, panel Tareas 288px) es Tailwind propio con los tokens medidos del live. Ruta nueva sin tabs de módulo bajo `AppLayout`.

**Tech Stack:** React 19, react-router 7, Tailwind 3, BlockNote (`@blocknote/core` + `@blocknote/react` + `@blocknote/mantine` 0.51.x), lucide-react, Vitest + Testing Library.

## Global Constraints

- **Pixel-perfect**: calco fiel al live incluyendo tamaños. Tokens medidos (izq `lg:w-56`=224px, centro `flex-1`, der `lg:w-72`=288px; gap `gap-6`). Ver `docs/references/mi-trabajo/`.
- **Presentacional / in-memory**: sin Supabase, sin persistencia. Nada de red.
- **Prohibido tocar la web original** (solo referencias ya capturadas).
- **No deprecado**: BlockNote 0.51.x (peer `react: ^19` verificado).
- **Deltas intencionales**: marca violeta (brand) donde el live usa gris/negro. Coherente con el resto de la app.
- **Fuera de alcance** (no implementar aquí): panel "Ayuda" global (va con Incidencias), IA real (solo stub visual), `@`-menciones y restaurar-papelera (diferidos), persistencia.
- Copy exacto del live: secciones árbol `PRIVADOS`/`COMPARTIDOS`/`TODO EL EQUIPO`, vacío `Vacío`, tabs tareas `Mías`/`Creadas`/`Todas`/`Ver hechas`, vacío tareas `Nada pendiente. 🎉`, placeholder tarea `Tarea de este documento…`, opciones visibilidad `Privado`/`Compartido`/`Todo el equipo`.

---

### Task 1: Instalar BlockNote y verificar montaje (spike)

Verifica la dependencia arriesgada antes de construir encima. Confirma versión, peer React 19, importación de estilos y tipos de bloque disponibles (`quote`, `codeBlock`, `table`).

**Files:**
- Modify: `package.json` (deps)
- Create: `src/features/mi-trabajo/editor/blocknote-theme.ts`
- Test: `src/features/mi-trabajo/editor/blocknote.smoke.test.ts`

**Interfaces:**
- Produces: `docBlockNoteTheme` (objeto de tema claro para `BlockNoteView`), y la certeza de la API `useCreateBlockNote` / `BlockNoteView` (desde `@blocknote/mantine`).

- [ ] **Step 1: Instalar dependencias**

Run:
```bash
npm install @blocknote/core@^0.51.0 @blocknote/react@^0.51.0 @blocknote/mantine@^0.51.0
```
Expected: se añaden a `dependencies`; `npm ls @blocknote/react` sin errores de peer con React 19.

- [ ] **Step 2: Crear el tema (light) hacia nuestro look**

`src/features/mi-trabajo/editor/blocknote-theme.ts`:
```ts
import type { Theme } from '@blocknote/mantine';

// Tema claro calcado al canvas del live (fondo blanco, texto slate, radios suaves).
// Los detalles finos se ajustan con overrides CSS acotados al canvas.
export const docBlockNoteTheme: Theme = {
  colors: {
    editor: { text: '#334155', background: '#ffffff' }, // slate-700 / white
    menu: { text: '#334155', background: '#ffffff' },
    tooltip: { text: '#334155', background: '#f8fafc' },
    hovered: { text: '#334155', background: '#f1f5f9' },
    selected: { text: '#ffffff', background: '#7c3aed' }, // brand violeta
    disabled: { text: '#94a3b8', background: '#f8fafc' },
    shadow: '#e2e8f0',
    border: '#e2e8f0',
    sideMenu: '#cbd5e1',
    highlights: {} as Theme['colors']['highlights'],
  },
  borderRadius: 8,
  fontFamily: 'Inter, "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};
```

- [ ] **Step 3: Smoke test — BlockNote importa y expone la API esperada**

`src/features/mi-trabajo/editor/blocknote.smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import * as react from '@blocknote/react';
import * as mantine from '@blocknote/mantine';
import { docBlockNoteTheme } from './blocknote-theme';

describe('BlockNote availability', () => {
  it('exposes useCreateBlockNote and BlockNoteView', () => {
    expect(typeof react.useCreateBlockNote).toBe('function');
    expect(mantine.BlockNoteView).toBeDefined();
  });

  it('theme has brand-selected and Inter font', () => {
    expect(docBlockNoteTheme.fontFamily).toContain('Inter');
    expect(docBlockNoteTheme.colors?.selected.background).toBe('#7c3aed');
  });
});
```

- [ ] **Step 4: Verificar bloques por defecto disponibles**

Run:
```bash
node -e "const s=require('@blocknote/core'); const bs=s.defaultBlockSpecs; console.log(Object.keys(bs))"
```
Expected: incluye `paragraph`, `heading`, `bulletListItem`, `numberedListItem`, `checkListItem`, `table`, `codeBlock`, `quote`.
Si `quote` o `codeBlock` NO estuvieran, anotarlo: en el seed (Task 2) el bloque de cita se emula con `paragraph` + estilo, y el de código con `codeBlock` si existe o `paragraph` monospace. (Con 0.51 ambos deberían existir.)

- [ ] **Step 5: Run tests**

Run: `npx vitest run src/features/mi-trabajo/editor/blocknote.smoke.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/features/mi-trabajo/editor
git commit -m "feat(fase7): add BlockNote deps + theme, verify mount (spike)"
```

---

### Task 2: Seed data + helpers `docs.ts`

**Files:**
- Create: `src/features/mi-trabajo/data/seed.ts`
- Create: `src/features/mi-trabajo/data/docs.ts`
- Test: `src/features/mi-trabajo/data/docs.test.ts`

**Interfaces:**
- Produces:
  - Tipos `DocVisibility = 'privado' | 'compartido' | 'equipo'`, `DocNode`, `DocTask`, `TreeSection`.
  - `docs: DocNode[]`, `tasks: DocTask[]`, `WELCOME_ID = 'd-welcome'`.
  - `buildTree(docs: DocNode[]): TreeSection[]`
  - `findDoc(docs: DocNode[], id: string): DocNode | undefined`
  - `childrenOf(docs: DocNode[], parentId: string): DocNode[]`
  - `filterDocs(docs: DocNode[], query: string): DocNode[]`
  - `createDoc(visibility: DocVisibility, parentId?: string | null): DocNode`
  - `SECTIONS: { key: DocVisibility; title: string }[]` (títulos `PRIVADOS`/`COMPARTIDOS`/`TODO EL EQUIPO`).

- [ ] **Step 1: Escribir el test (helpers)**

`src/features/mi-trabajo/data/docs.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { docs, tasks, WELCOME_ID } from './seed';
import { buildTree, findDoc, childrenOf, filterDocs, createDoc, SECTIONS } from './docs';

describe('mi-trabajo data', () => {
  it('welcome doc exists in the equipo section with BlockNote content', () => {
    const w = findDoc(docs, WELCOME_ID);
    expect(w?.title).toBe('Bienvenido a Documentos');
    expect(w?.visibility).toBe('equipo');
    expect(Array.isArray(w?.content)).toBe(true);
    expect(w!.content.length).toBeGreaterThan(10); // muchos bloques
  });

  it('SECTIONS map to live titles in order', () => {
    expect(SECTIONS.map((s) => s.title)).toEqual(['PRIVADOS', 'COMPARTIDOS', 'TODO EL EQUIPO']);
  });

  it('buildTree groups by visibility and nests children by parentId', () => {
    const tree = buildTree(docs);
    const equipo = tree.find((s) => s.key === 'equipo')!;
    // welcome es raíz en equipo y tiene al menos un hijo anidado
    const root = equipo.roots.find((n) => n.doc.id === WELCOME_ID)!;
    expect(root).toBeTruthy();
    expect(root.children.length).toBeGreaterThanOrEqual(1);
  });

  it('childrenOf returns direct children only', () => {
    const kids = childrenOf(docs, WELCOME_ID);
    expect(kids.every((d) => d.parentId === WELCOME_ID)).toBe(true);
  });

  it('filterDocs matches by title (case-insensitive)', () => {
    expect(filterDocs(docs, 'bienvenido').map((d) => d.id)).toContain(WELCOME_ID);
    expect(filterDocs(docs, 'zzz-none')).toEqual([]);
    expect(filterDocs(docs, '').length).toBe(docs.length);
  });

  it('createDoc returns a new empty doc titled "Sin título"', () => {
    const d = createDoc('privado', null);
    expect(d.title).toBe('Sin título');
    expect(d.visibility).toBe('privado');
    expect(d.parentId).toBeNull();
    expect(d.content).toEqual([{ type: 'paragraph', content: '' }]);
    expect(d.id).toMatch(/^d-/);
  });

  it('tasks seed defaults to empty pending list', () => {
    expect(Array.isArray(tasks)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/mi-trabajo/data/docs.test.ts`
Expected: FAIL (módulos no existen).

- [ ] **Step 3: Escribir `seed.ts`**

`src/features/mi-trabajo/data/seed.ts` — tipos + doc de bienvenida calcado del live (transcripción verbatim de `docs/references/mi-trabajo/live-doc-open.png`) + docs de árbol + tareas.

```ts
import type { PartialBlock } from '@blocknote/core';

export type DocVisibility = 'privado' | 'compartido' | 'equipo';

export interface DocNode {
  id: string;
  emoji: string;
  title: string;
  visibility: DocVisibility;
  parentId: string | null;
  content: PartialBlock[];
  updatedLabel: string;
}

export interface DocTask {
  id: string;
  docId: string;
  text: string;
  done: boolean;
  owner: string;
  dueLabel?: string;
  scope: 'mias' | 'creadas' | 'todas';
}

export const WELCOME_ID = 'd-welcome';

// Contenido calcado del doc "Bienvenido a Documentos" del live.
const welcomeContent: PartialBlock[] = [
  { type: 'heading', props: { level: 1 }, content: 'Bienvenido' },
  { type: 'paragraph', content: 'Esto sustituye a Notion. Todo lo que hacías allí, lo puedes hacer aquí — y algunas cosas que allí no podías. Este documento es una chuleta: tócalo, rómpelo, escribe encima.' },

  { type: 'heading', props: { level: 2 }, content: 'Lo primero: la tecla /' },
  { type: 'paragraph', content: 'Escribe una barra (/) en una línea vacía y se abre el menú de bloques. Ahí está todo: títulos, listas, tablas, código, imágenes, citas. No hay que memorizar nada, solo la barra.' },
  { type: 'paragraph', content: 'El otro gesto que importa: arrastra el asa que aparece a la izquierda de cada bloque para moverlo. Puedes reordenar el documento entero sin cortar y pegar.' },

  { type: 'heading', props: { level: 2 }, content: 'Texto' },
  { type: 'paragraph', content: [
    { type: 'text', text: 'Puedes poner texto en ', styles: {} },
    { type: 'text', text: 'negrita', styles: { bold: true } },
    { type: 'text', text: ', en ', styles: {} },
    { type: 'text', text: 'cursiva', styles: { italic: true } },
    { type: 'text', text: ', ', styles: {} },
    { type: 'text', text: 'subrayado', styles: { underline: true } },
    { type: 'text', text: ', ', styles: {} },
    { type: 'text', text: 'tachado', styles: { strike: true } },
    { type: 'text', text: ' o como código. Selecciona el texto y sale la barra de formato.', styles: {} },
  ] },

  { type: 'heading', props: { level: 2 }, content: 'Listas' },
  { type: 'paragraph', content: 'Con viñetas, para cosas que no llevan orden:' },
  { type: 'bulletListItem', content: 'Rider técnico del artista' },
  { type: 'bulletListItem', content: 'Hospitality' },
  { type: 'bulletListItem', content: 'Alojamiento y vuelos' },
  { type: 'paragraph', content: 'Numeradas, cuando el orden importa:' },
  { type: 'numberedListItem', content: 'El promotor confirma la fecha' },
  { type: 'numberedListItem', content: 'Se manda la oferta' },
  { type: 'numberedListItem', content: 'Se firma el contrato' },
  { type: 'numberedListItem', content: 'Se pide el depósito' },
  { type: 'paragraph', content: 'Y de tareas, con su casilla:' },
  { type: 'checkListItem', props: { checked: true }, content: 'Confirmar hora de soundcheck' },
  { type: 'checkListItem', props: { checked: false }, content: 'Mandar rider al venue' },
  { type: 'checkListItem', props: { checked: false }, content: 'Reservar hotel' },

  { type: 'heading', props: { level: 2 }, content: 'Citas' },
  { type: 'quote', content: 'Lo importante no es lo que dice el contrato, sino lo que pasa cuando el promotor no lo lee.' },

  { type: 'heading', props: { level: 2 }, content: 'Tablas' },
  { type: 'paragraph', content: 'Para lo que es tabla y no debería ser una lista:' },
  { type: 'table', content: {
    type: 'tableContent',
    rows: [
      { cells: ['Concepto', 'Importe', 'Estado'] },
      { cells: ['Caché artista', '3.500 €', 'Confirmado'] },
      { cells: ['Vuelos', '420 €', 'Pendiente'] },
      { cells: ['Hotel', '180 €', 'Pagado'] },
    ],
  } },

  { type: 'heading', props: { level: 2 }, content: 'Código' },
  { type: 'paragraph', content: 'Por si alguna vez hay que pegar algo técnico:' },
  { type: 'codeBlock', props: { language: 'javascript' }, content: 'const beneficio = ingresos - gastos\nif (beneficio < 0) avisar("Este show pierde dinero")' },

  { type: 'heading', props: { level: 2 }, content: 'El asistente de escritura' },
  { type: 'paragraph', content: 'Arriba del editor hay un botón ≡ Asistente. Selecciona un párrafo y puedes pedirle que lo mejore, lo corrija, lo acorte, lo desarrolle o lo traduzca. Sin nada seleccionado, puede resumirte el documento entero o escribir algo nuevo a partir de una instrucción.' },
  { type: 'paragraph', content: [
    { type: 'text', text: 'Nunca machaca el texto: primero te enseña lo que ha escrito y tú decides si lo insertas.', styles: { bold: true } },
  ] },

  { type: 'heading', props: { level: 2 }, content: 'Quién ve esto' },
  { type: 'paragraph', content: 'Arriba a la derecha eliges la visibilidad, y conviene entenderla bien:' },
  { type: 'table', content: {
    type: 'tableContent',
    rows: [
      { cells: ['Visibilidad', 'Quién lo ve'] },
      { cells: ['Privado', 'SOLO tú. Ni los administradores.'] },
      { cells: ['Compartido', 'Tú y las personas que elijas, una a una.'] },
      { cells: ['Todo el equipo', 'Cualquiera del equipo interno.'] },
    ],
  } },
  { type: 'paragraph', content: [
    { type: 'text', text: 'Lo de ', styles: {} },
    { type: 'text', text: 'privado es privado de verdad', styles: { bold: true } },
    { type: 'text', text: ': está garantizado en la base de datos, no es una promesa que te hagamos. Si no fuera así, nadie usaría esto para pensar.', styles: {} },
  ] },

  { type: 'heading', props: { level: 2 }, content: 'Lo que Notion no hacía' },
  { type: 'paragraph', content: 'Al pie de cada documento tienes «Tareas de este documento». De una reunión salen cosas que hay que hacer: cuélgalas ahí y aparecen en tu carril de tareas de la derecha, con su fecha y su responsable. El documento y el trabajo que sale de él viven juntos.' },

  { type: 'heading', props: { level: 2 }, content: 'Si te equivocas' },
  { type: 'paragraph', content: [
    { type: 'text', text: '«Archivar» lo quita de la lista sin borrarlo. «Eliminar» lo manda a la papelera, y tienes ', styles: {} },
    { type: 'text', text: '15 días', styles: { bold: true } },
    { type: 'text', text: ' para recuperarlo. La papelera está al final de la columna izquierda, pequeñita y a propósito: no queremos que borrar sea cómodo.', styles: {} },
  ] },

  { type: 'heading', props: { level: 2 }, content: 'Ahora prueba tú' },
  { type: 'paragraph', content: 'Borra esta línea, escribe / y mira lo que sale.' },
];

export const docs: DocNode[] = [
  { id: WELCOME_ID, emoji: '📘', title: 'Bienvenido a Documentos', visibility: 'equipo', parentId: null, content: welcomeContent, updatedLabel: 'Editado hoy' },
  { id: 'd-riders', emoji: '📄', title: 'Plantilla de rider técnico', visibility: 'equipo', parentId: WELCOME_ID, content: [
    { type: 'heading', props: { level: 1 }, content: 'Rider técnico' },
    { type: 'paragraph', content: 'Pega aquí el rider del artista y se convierte en filas automáticamente.' },
  ], updatedLabel: 'Editado hace 2 d' },
];

export const tasks: DocTask[] = [];
```

- [ ] **Step 4: Escribir `docs.ts`**

`src/features/mi-trabajo/data/docs.ts`:
```ts
import type { DocNode, DocVisibility } from './seed';

export interface TreeNode { doc: DocNode; children: TreeNode[] }
export interface TreeSection { key: DocVisibility; title: string; roots: TreeNode[] }

export const SECTIONS: { key: DocVisibility; title: string }[] = [
  { key: 'privado', title: 'PRIVADOS' },
  { key: 'compartido', title: 'COMPARTIDOS' },
  { key: 'equipo', title: 'TODO EL EQUIPO' },
];

export function findDoc(docs: DocNode[], id: string): DocNode | undefined {
  return docs.find((d) => d.id === id);
}

export function childrenOf(docs: DocNode[], parentId: string): DocNode[] {
  return docs.filter((d) => d.parentId === parentId);
}

function toTree(docs: DocNode[], parentId: string | null): TreeNode[] {
  return docs
    .filter((d) => d.parentId === parentId)
    .map((doc) => ({ doc, children: toTree(docs, doc.id) }));
}

export function buildTree(docs: DocNode[]): TreeSection[] {
  return SECTIONS.map(({ key, title }) => ({
    key,
    title,
    // raíces de la sección = docs de esa visibilidad sin padre (o cuyo padre no es de la sección)
    roots: toTree(docs.filter((d) => d.visibility === key), null).length
      ? toTree(docs.filter((d) => d.visibility === key), null)
      : [],
  }));
}

export function filterDocs(docs: DocNode[], query: string): DocNode[] {
  const q = query.trim().toLowerCase();
  if (!q) return docs;
  return docs.filter((d) => d.title.toLowerCase().includes(q));
}

let seq = 0;
export function createDoc(visibility: DocVisibility, parentId: string | null = null): DocNode {
  seq += 1;
  return {
    id: `d-new-${seq}`,
    emoji: '📄',
    title: 'Sin título',
    visibility,
    parentId,
    content: [{ type: 'paragraph', content: '' }],
    updatedLabel: 'Nuevo',
  };
}
```

> Nota: `buildTree` usa `toTree(...,null)` sobre el subconjunto por visibilidad; los hijos anidados (mismo visibility) cuelgan de su raíz. El welcome (`equipo`, parent null) es raíz y `d-riders` (equipo, parent welcome) es su hijo.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/features/mi-trabajo/data/docs.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 6: Commit**

```bash
git add src/features/mi-trabajo/data
git commit -m "feat(fase7): seed docs (welcome BlockNote content) + tree/filter helpers"
```

---

### Task 3: `DocTreeItem` + `DocTree` (columna izquierda)

**Files:**
- Create: `src/features/mi-trabajo/components/DocTreeItem.tsx`
- Create: `src/features/mi-trabajo/components/DocTree.tsx`
- Test: `src/features/mi-trabajo/components/DocTree.test.tsx`

**Interfaces:**
- Consumes: `buildTree`, `filterDocs`, `SECTIONS`, `TreeNode`, `TreeSection` (Task 2); `DocNode` (Task 2).
- Produces:
  - `DocTreeItem({ node, depth, selectedId, onSelect, onAddChild }: { node: TreeNode; depth: number; selectedId: string | null; onSelect: (id: string) => void; onAddChild: (parentId: string) => void })`
  - `DocTree({ docs, selectedId, onSelect, onCreate }: { docs: DocNode[]; selectedId: string | null; onSelect: (id: string) => void; onCreate: (visibility: DocVisibility, parentId: string | null) => void })`

- [ ] **Step 1: Escribir el test**

`src/features/mi-trabajo/components/DocTree.test.tsx`:
```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DocTree } from './DocTree';
import { docs } from '../data/seed';

describe('DocTree', () => {
  it('renders section titles and the welcome doc', () => {
    render(<DocTree docs={docs} selectedId={null} onSelect={() => {}} onCreate={() => {}} />);
    expect(screen.getByText('PRIVADOS')).toBeInTheDocument();
    expect(screen.getByText('COMPARTIDOS')).toBeInTheDocument();
    expect(screen.getByText('TODO EL EQUIPO')).toBeInTheDocument();
    expect(screen.getByText('Bienvenido a Documentos')).toBeInTheDocument();
  });

  it('shows "Vacío" for empty sections', () => {
    render(<DocTree docs={docs} selectedId={null} onSelect={() => {}} onCreate={() => {}} />);
    // Privados y Compartidos están vacíos en el seed
    expect(screen.getAllByText('Vacío').length).toBeGreaterThanOrEqual(2);
  });

  it('calls onSelect when a doc is clicked', () => {
    const onSelect = vi.fn();
    render(<DocTree docs={docs} selectedId={null} onSelect={onSelect} onCreate={() => {}} />);
    fireEvent.click(screen.getByText('Bienvenido a Documentos'));
    expect(onSelect).toHaveBeenCalledWith('d-welcome');
  });

  it('filters by the search box', () => {
    render(<DocTree docs={docs} selectedId={null} onSelect={() => {}} onCreate={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText('Buscar…'), { target: { value: 'rider' } });
    expect(screen.getByText('Plantilla de rider técnico')).toBeInTheDocument();
    expect(screen.queryByText('Bienvenido a Documentos')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/mi-trabajo/components/DocTree.test.tsx`
Expected: FAIL (componentes no existen).

- [ ] **Step 3: Escribir `DocTreeItem.tsx`**

```tsx
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TreeNode } from '../data/docs';

interface Props {
  node: TreeNode;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddChild: (parentId: string) => void;
}

export function DocTreeItem({ node, depth, selectedId, onSelect, onAddChild }: Props) {
  const { doc, children } = node;
  const selected = selectedId === doc.id;
  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 rounded-lg pr-1 text-sm text-slate-700 hover:bg-slate-50',
          selected && 'bg-slate-100 font-medium text-slate-900'
        )}
        style={{ paddingLeft: 4 + depth * 14 }}
      >
        <button
          type="button"
          onClick={() => onSelect(doc.id)}
          className="flex min-w-0 flex-1 items-center gap-1.5 py-1 text-left"
        >
          <span className="text-base leading-none">{doc.emoji}</span>
          <span className="truncate">{doc.title}</span>
        </button>
        <button
          type="button"
          aria-label={`Nuevo dentro de ${doc.title}`}
          onClick={() => onAddChild(doc.id)}
          className="grid h-6 w-6 shrink-0 place-items-center rounded text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-slate-200 hover:text-slate-500"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      {children.map((child) => (
        <DocTreeItem key={child.doc.id} node={child} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} onAddChild={onAddChild} />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Escribir `DocTree.tsx`**

```tsx
import { useMemo, useState } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import { buildTree, filterDocs, SECTIONS } from '../data/docs';
import type { DocNode, DocVisibility } from '../data/seed';
import { DocTreeItem } from './DocTreeItem';

interface Props {
  docs: DocNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: (visibility: DocVisibility, parentId: string | null) => void;
}

export function DocTree({ docs, selectedId, onSelect, onCreate }: Props) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => filterDocs(docs, query), [docs, query]);
  const tree = useMemo(() => buildTree(filtered), [filtered]);

  return (
    <div>
      <div className="mb-3 flex h-9 items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">Documentos</h2>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar…"
            className="h-8 w-32 rounded-lg border border-slate-200 bg-white pl-7 pr-2 text-xs text-slate-600 outline-none focus:border-slate-300"
          />
        </div>
      </div>

      <div className="space-y-5">
        {SECTIONS.map((section) => {
          const node = tree.find((s) => s.key === section.key)!;
          return (
            <div key={section.key}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{section.title}</span>
                <button
                  type="button"
                  aria-label={`Nuevo en ${section.title}`}
                  onClick={() => onCreate(section.key, null)}
                  className="grid h-5 w-5 place-items-center rounded text-slate-300 hover:bg-slate-100 hover:text-slate-500"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              {node.roots.length === 0 ? (
                <p className="px-1 py-0.5 text-xs text-slate-400">Vacío</p>
              ) : (
                node.roots.map((root) => (
                  <DocTreeItem key={root.doc.id} node={root} depth={0} selectedId={selectedId} onSelect={onSelect} onAddChild={(pid) => onCreate(section.key, pid)} />
                ))
              )}
            </div>
          );
        })}
      </div>

      <button type="button" className="mt-6 flex items-center gap-1.5 px-1 text-xs text-slate-400 hover:text-slate-600">
        <Trash2 className="h-3.5 w-3.5" /> Papelera
      </button>
    </div>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/features/mi-trabajo/components/DocTree.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add src/features/mi-trabajo/components/DocTree.tsx src/features/mi-trabajo/components/DocTreeItem.tsx src/features/mi-trabajo/components/DocTree.test.tsx
git commit -m "feat(fase7): DocTree + DocTreeItem (secciones, anidamiento, buscador, crear)"
```

---

### Task 4: `TasksPanel` (columna derecha)

**Files:**
- Create: `src/features/mi-trabajo/components/TasksPanel.tsx`
- Test: `src/features/mi-trabajo/components/TasksPanel.test.tsx`

**Interfaces:**
- Consumes: `DocTask`, `DocNode` (Task 2); `Card` (`@/components/ui/Card`).
- Produces: `TasksPanel({ doc, tasks }: { doc: DocNode | null; tasks: DocTask[] })`

- [ ] **Step 1: Escribir el test**

`src/features/mi-trabajo/components/TasksPanel.test.tsx`:
```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TasksPanel } from './TasksPanel';
import { docs } from '../data/seed';

describe('TasksPanel', () => {
  it('renders the "de este documento" card and the tabs', () => {
    render(<TasksPanel doc={docs[0]} tasks={[]} />);
    expect(screen.getByRole('heading', { name: 'Tareas' })).toBeInTheDocument();
    expect(screen.getByText('DE ESTE DOCUMENTO')).toBeInTheDocument();
    ['Mías', 'Creadas', 'Todas', 'Ver hechas'].forEach((t) =>
      expect(screen.getByText(t)).toBeInTheDocument()
    );
  });

  it('shows the empty state and the add input', () => {
    render(<TasksPanel doc={docs[0]} tasks={[]} />);
    expect(screen.getByText('Nada pendiente. 🎉')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tarea de este documento…')).toBeInTheDocument();
  });

  it('switches the active tab on click', () => {
    render(<TasksPanel doc={docs[0]} tasks={[]} />);
    const todas = screen.getByRole('button', { name: 'Todas' });
    fireEvent.click(todas);
    expect(todas).toHaveAttribute('aria-pressed', 'true');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/mi-trabajo/components/TasksPanel.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar `TasksPanel.tsx`**

```tsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { DocNode, DocTask } from '../data/seed';

const TABS = ['Mías', 'Creadas', 'Todas', 'Ver hechas'] as const;

interface Props {
  doc: DocNode | null;
  tasks: DocTask[];
}

export function TasksPanel({ doc, tasks }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Mías');
  const docTasks = doc ? tasks.filter((t) => t.docId === doc.id && !t.done) : [];

  return (
    <div>
      <div className="mb-3 flex h-9 items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-800">Tareas</h2>
        <button type="button" aria-label="Añadir tarea" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100">
          ＋
        </button>
      </div>

      <Card className="mb-3 border-brand-200/70 bg-brand-50/30 p-3 shadow-none">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">De este documento</span>
          <button type="button" className="text-xs font-medium text-brand-600 hover:text-brand-700">+ Tarea</button>
        </div>
        <p className="text-xs text-slate-400">
          {docTasks.length === 0 ? 'Ninguna. Lo que salga de aquí y haya que hacer, cuélgalo como tarea.' : `${docTasks.length} pendiente(s).`}
        </p>
      </Card>

      <Card className="p-3 shadow-none">
        <input
          placeholder="Tarea de este documento…"
          className="input mb-2 h-8 py-0 text-sm"
        />
        <div className="mb-2 flex items-center justify-between gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tab === t}
              onClick={() => setTab(t)}
              className={cn('rounded px-1.5 py-0.5 text-xs', tab === t ? 'font-semibold text-slate-800' : 'text-slate-400 hover:text-slate-600')}
            >
              {t}
            </button>
          ))}
        </div>
        {docTasks.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">Nada pendiente. 🎉</p>
        ) : (
          <ul className="space-y-1">
            {docTasks.map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" defaultChecked={t.done} className="accent-brand-600" />
                <span className="truncate">{t.text}</span>
                {t.dueLabel && <span className="ml-auto shrink-0 text-xs text-slate-400">{t.dueLabel}</span>}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/features/mi-trabajo/components/TasksPanel.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/mi-trabajo/components/TasksPanel.tsx src/features/mi-trabajo/components/TasksPanel.test.tsx
git commit -m "feat(fase7): TasksPanel (card de este documento + input + tabs + vacío)"
```

---

### Task 5: `DocEditor` (toolbar + canvas BlockNote)

**Files:**
- Create: `src/features/mi-trabajo/components/AssistantButton.tsx`
- Create: `src/features/mi-trabajo/components/DocEditor.tsx`
- Create: `src/styles/blocknote.css` (overrides acotados al canvas)
- Modify: `src/styles/index.css` (import de estilos BlockNote + overrides)
- Test: `src/features/mi-trabajo/components/DocEditor.test.tsx`

**Interfaces:**
- Consumes: `DocNode`, `DocVisibility` (Task 2); `docBlockNoteTheme` (Task 1).
- Produces: `DocEditor({ doc, onTitleChange, onVisibilityChange }: { doc: DocNode; onTitleChange: (id: string, title: string) => void; onVisibilityChange: (id: string, v: DocVisibility) => void })`

- [ ] **Step 1: Escribir el test (smoke — sin interacción de ProseMirror)**

`src/features/mi-trabajo/components/DocEditor.test.tsx`:
```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DocEditor } from './DocEditor';
import { docs } from '../data/seed';

describe('DocEditor toolbar', () => {
  it('renders the title input with the doc title', () => {
    render(<DocEditor doc={docs[0]} onTitleChange={() => {}} onVisibilityChange={() => {}} />);
    expect(screen.getByDisplayValue('Bienvenido a Documentos')).toBeInTheDocument();
  });

  it('renders the visibility select with the three live options', () => {
    render(<DocEditor doc={docs[0]} onTitleChange={() => {}} onVisibilityChange={() => {}} />);
    const select = screen.getByLabelText('Visibilidad') as HTMLSelectElement;
    expect([...select.options].map((o) => o.textContent)).toEqual(['Privado', 'Compartido', 'Todo el equipo']);
  });

  it('renders the Asistente button', () => {
    render(<DocEditor doc={docs[0]} onTitleChange={() => {}} onVisibilityChange={() => {}} />);
    expect(screen.getByRole('button', { name: /Asistente/ })).toBeInTheDocument();
  });

  it('calls onTitleChange when the title is edited', () => {
    const onTitleChange = vi.fn();
    render(<DocEditor doc={docs[0]} onTitleChange={onTitleChange} onVisibilityChange={() => {}} />);
    fireEvent.change(screen.getByDisplayValue('Bienvenido a Documentos'), { target: { value: 'Hola' } });
    expect(onTitleChange).toHaveBeenCalledWith('d-welcome', 'Hola');
  });
});
```

> Si `BlockNoteView` no monta en jsdom, envolver su render en el componente con un guard y, en el test, se valida solo la toolbar (BlockNote se ejercita por Playwright en Task 8). Ver Step 3.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/mi-trabajo/components/DocEditor.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar `AssistantButton.tsx`**

```tsx
import { useState } from 'react';
import { Wand2 } from 'lucide-react';

export function AssistantButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-slate-500 hover:bg-slate-100"
      >
        <Wand2 className="h-3.5 w-3.5" /> Asistente
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-10 w-64 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-500 shadow-lg">
          Selecciona un párrafo para mejorarlo, corregirlo, acortarlo, desarrollarlo o traducirlo. (Demo)
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Implementar `DocEditor.tsx`**

```tsx
import { useEffect } from 'react';
import { MoreHorizontal, Maximize2 } from 'lucide-react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import type { DocNode, DocVisibility } from '../data/seed';
import { docBlockNoteTheme } from '../editor/blocknote-theme';
import { AssistantButton } from './AssistantButton';

const VIS: { value: DocVisibility; label: string }[] = [
  { value: 'privado', label: 'Privado' },
  { value: 'compartido', label: 'Compartido' },
  { value: 'equipo', label: 'Todo el equipo' },
];

interface Props {
  doc: DocNode;
  onTitleChange: (id: string, title: string) => void;
  onVisibilityChange: (id: string, v: DocVisibility) => void;
}

export function DocEditor({ doc, onTitleChange, onVisibilityChange }: Props) {
  // Recrea el editor por doc (key en el padre garantiza remount al cambiar de doc).
  const editor = useCreateBlockNote({ initialContent: doc.content });

  // Enfoca al montar sin robar el foco de inputs de la toolbar.
  useEffect(() => { /* noop: el foco lo gestiona el usuario */ }, [doc.id]);

  return (
    <div className="flex min-w-0 flex-col">
      <div className="mb-3 flex h-9 shrink-0 items-center gap-1">
        <button type="button" className="grid h-8 w-7 place-items-center rounded-lg text-base leading-none hover:bg-slate-100">{doc.emoji}</button>
        <input
          aria-label="Título del documento"
          value={doc.title}
          onChange={(e) => onTitleChange(doc.id, e.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-semibold text-slate-800 outline-none"
        />
        <span className="shrink-0 text-xs text-slate-400">{doc.updatedLabel}</span>
        <AssistantButton />
        <select
          aria-label="Visibilidad"
          value={doc.visibility}
          onChange={(e) => onVisibilityChange(doc.id, e.target.value as DocVisibility)}
          className="h-8 cursor-pointer rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-600"
        >
          {VIS.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
        </select>
        <button type="button" aria-label="Más opciones" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><MoreHorizontal className="h-4 w-4" /></button>
        <button type="button" aria-label="Pantalla completa" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><Maximize2 className="h-4 w-4" /></button>
      </div>

      <article className="min-h-[70vh] rounded-2xl border border-slate-200/70 bg-white pb-16 pt-6">
        <BlockNoteView editor={editor} theme={docBlockNoteTheme} className="doc-canvas" />
      </article>
    </div>
  );
}
```

- [ ] **Step 5: Estilos BlockNote — import + overrides**

Crear `src/styles/blocknote.css`:
```css
/* Overrides acotados al canvas de Documentos para calcar el look del live. */
.doc-canvas .bn-editor { padding-inline: 3.5rem; }
.doc-canvas .bn-block-content[data-content-type='paragraph'] { font-size: 16px; line-height: 23.2px; color: rgb(51, 65, 85); }
.doc-canvas .bn-block-content[data-content-type='quote'] { font-style: italic; color: rgb(125, 121, 122); }
.doc-canvas .bn-block-content[data-content-type='table'] td,
.doc-canvas .bn-block-content[data-content-type='table'] th { border: 1px solid rgb(221, 221, 221); padding: 5px 10px; color: rgb(63, 63, 63); }
```

En `src/styles/index.css`, añadir al principio (antes de `@tailwind`, según convención de Vite/PostCSS los `@import` van primero):
```css
@import '@blocknote/core/fonts/inter.css';
@import '@blocknote/mantine/style.css';
@import './blocknote.css';
```

> Verificar orden con la config actual de `index.css`; si `@tailwind` ya está arriba, colocar los `@import` de terceros por encima de `@tailwind base` para no romper el bundling.

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/features/mi-trabajo/components/DocEditor.test.tsx`
Expected: PASS (4 tests). Si `BlockNoteView` lanzara en jsdom, mockear el módulo `@blocknote/mantine` en el test con `vi.mock('@blocknote/mantine', () => ({ BlockNoteView: () => null }))` y `vi.mock('@blocknote/react', ...)` para aislar la toolbar; documentar en el commit.

- [ ] **Step 7: Commit**

```bash
git add src/features/mi-trabajo/components/DocEditor.tsx src/features/mi-trabajo/components/AssistantButton.tsx src/features/mi-trabajo/components/DocEditor.test.tsx src/styles/blocknote.css src/styles/index.css
git commit -m "feat(fase7): DocEditor (toolbar + BlockNote canvas) + Asistente stub + theme CSS"
```

---

### Task 6: `MiTrabajoPage` (compone las 3 columnas)

**Files:**
- Create: `src/features/mi-trabajo/pages/MiTrabajoPage.tsx`
- Test: `src/features/mi-trabajo/pages/MiTrabajoPage.test.tsx`

**Interfaces:**
- Consumes: `DocTree` (Task 3), `TasksPanel` (Task 4), `DocEditor` (Task 5); `docs`, `tasks` (Task 2); `findDoc`, `createDoc` (Task 2).
- Produces: `MiTrabajoPage()`

- [ ] **Step 1: Escribir el test (integración)**

`src/features/mi-trabajo/pages/MiTrabajoPage.test.tsx`:
```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MiTrabajoPage } from './MiTrabajoPage';

// Aísla BlockNote para la integración (interacción real cubierta por Playwright).
vi.mock('@blocknote/react', () => ({ useCreateBlockNote: () => ({}) }));
vi.mock('@blocknote/mantine', () => ({ BlockNoteView: () => <div data-testid="bn-canvas" /> }));

describe('MiTrabajoPage', () => {
  it('renders the three columns: tree, editor toolbar, tasks', () => {
    render(<MiTrabajoPage />);
    expect(screen.getByText('Documentos')).toBeInTheDocument();       // izq
    expect(screen.getByRole('heading', { name: 'Tareas' })).toBeInTheDocument(); // der
    // editor abierto con el welcome por defecto
    expect(screen.getByDisplayValue('Bienvenido a Documentos')).toBeInTheDocument();
    expect(screen.getByTestId('bn-canvas')).toBeInTheDocument();
  });

  it('creates a new doc from a section "+" and selects it', () => {
    render(<MiTrabajoPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo en PRIVADOS' }));
    expect(screen.getByDisplayValue('Sin título')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/mi-trabajo/pages/MiTrabajoPage.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar `MiTrabajoPage.tsx`**

```tsx
import { useMemo, useState } from 'react';
import { DocTree } from '../components/DocTree';
import { DocEditor } from '../components/DocEditor';
import { TasksPanel } from '../components/TasksPanel';
import { docs as seedDocs, tasks as seedTasks, WELCOME_ID } from '../data/seed';
import { createDoc, findDoc } from '../data/docs';
import type { DocNode, DocVisibility } from '../data/seed';

export function MiTrabajoPage() {
  const [docs, setDocs] = useState<DocNode[]>(seedDocs);
  const [selectedId, setSelectedId] = useState<string>(WELCOME_ID);
  const selected = useMemo(() => findDoc(docs, selectedId) ?? null, [docs, selectedId]);

  const handleCreate = (visibility: DocVisibility, parentId: string | null) => {
    const doc = createDoc(visibility, parentId);
    setDocs((prev) => [...prev, doc]);
    setSelectedId(doc.id);
  };
  const handleTitle = (id: string, title: string) =>
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, title } : d)));
  const handleVisibility = (id: string, v: DocVisibility) =>
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, visibility: v } : d)));

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="w-full shrink-0 lg:sticky lg:top-20 lg:w-56 lg:self-start">
        <DocTree docs={docs} selectedId={selectedId} onSelect={setSelectedId} onCreate={handleCreate} />
      </aside>

      <main className="min-w-0 flex-1">
        {selected ? (
          <DocEditor key={selected.id} doc={selected} onTitleChange={handleTitle} onVisibilityChange={handleVisibility} />
        ) : (
          <div className="grid min-h-[70vh] place-items-center rounded-2xl border border-dashed border-slate-200 text-center text-sm text-slate-400">
            Documentos a la izquierda, tareas a la derecha. Abre uno o empieza a escribir.
          </div>
        )}
      </main>

      <aside className="w-full shrink-0 lg:sticky lg:top-20 lg:w-72 lg:self-start">
        <TasksPanel doc={selected} tasks={seedTasks} />
      </aside>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/features/mi-trabajo/pages/MiTrabajoPage.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/mi-trabajo/pages/MiTrabajoPage.tsx src/features/mi-trabajo/pages/MiTrabajoPage.test.tsx
git commit -m "feat(fase7): MiTrabajoPage compone 3 columnas (árbol/editor/tareas) + estado"
```

---

### Task 7: Shell + ruta + acceso desde el header

**Files:**
- Create: `src/features/modules/MiTrabajoShell.tsx`
- Modify: `src/app/router.tsx` (import + ruta `/mi-trabajo`)
- Modify: `src/components/layout/TopNav.tsx` (enlace al icono maletín → `/mi-trabajo`)
- Test: `src/features/modules/MiTrabajoShell.test.tsx`

**Interfaces:**
- Consumes: `MiTrabajoPage` (Task 6), `AppLayout` (`@/components/layout`).
- Produces: `MiTrabajoShell()`

- [ ] **Step 1: Escribir el test**

`src/features/modules/MiTrabajoShell.test.tsx`:
```tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { MiTrabajoShell } from './MiTrabajoShell';

vi.mock('@blocknote/react', () => ({ useCreateBlockNote: () => ({}) }));
vi.mock('@blocknote/mantine', () => ({ BlockNoteView: () => <div /> }));

describe('MiTrabajoShell', () => {
  it('renders the page inside the app layout', () => {
    render(<MemoryRouter><MiTrabajoShell /></MemoryRouter>);
    expect(screen.getByText('Documentos')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tareas' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/modules/MiTrabajoShell.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implementar `MiTrabajoShell.tsx`**

```tsx
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';
import { MiTrabajoPage } from '@/features/mi-trabajo/pages/MiTrabajoPage';

const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'Admin' };

export function MiTrabajoShell() {
  return (
    <AppLayout user={mockUser}>
      <MiTrabajoPage />
    </AppLayout>
  );
}
```

- [ ] **Step 4: Añadir la ruta en `router.tsx`**

Import junto a los demás shells:
```tsx
import { MiTrabajoShell } from '@/features/modules/MiTrabajoShell';
```
Ruta (junto a `/personal` y `/configuracion`):
```tsx
<Route path="/mi-trabajo" element={<MiTrabajoShell />} />
```

- [ ] **Step 5: Enlazar el icono maletín del header a `/mi-trabajo`**

En `src/components/layout/TopNav.tsx`, localizar el icono "maletín" (briefcase) del header y envolverlo/convertirlo en `Link` a `/mi-trabajo` (usar `Link` de `react-router`). Si no existiese aún el icono, añadir un `Link` con el icono `Briefcase` de lucide-react en la zona derecha del header, con `aria-label="Mi trabajo"`. Mantener el resto del header intacto.

```tsx
import { Link } from 'react-router';
import { Briefcase } from 'lucide-react';
// ...dentro de la zona de iconos del header:
<Link to="/mi-trabajo" aria-label="Mi trabajo" className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100">
  <Briefcase className="h-5 w-5" />
</Link>
```

- [ ] **Step 6: Run tests + tsc + lint + build de tipos**

Run:
```bash
npx vitest run src/features/mi-trabajo src/features/modules/MiTrabajoShell.test.tsx
npx tsc --noEmit
npm run lint
```
Expected: todos verdes (tests PASS, tsc sin errores, lint 0).

- [ ] **Step 7: Commit**

```bash
git add src/features/modules/MiTrabajoShell.tsx src/features/modules/MiTrabajoShell.test.tsx src/app/router.tsx src/components/layout/TopNav.tsx
git commit -m "feat(fase7): MiTrabajoShell + ruta /mi-trabajo + acceso desde header"
```

---

### Task 8: Verificación pixel-perfect (Playwright) + full green

**Files:**
- (sin cambios de código salvo ajustes finos de tokens si la comparación lo exige)

- [ ] **Step 1: Full test run**

Run: `npx vitest run`
Expected: toda la suite verde (los ~157 previos + los nuevos de fase7).

- [ ] **Step 2: Levantar dev server y comparar vs live**

Run (background): `npm run dev`
Abrir `http://localhost:5173/mi-trabajo`. Comparar contra `docs/references/mi-trabajo/live-landing.png` y `live-doc-open.png`:
- Columnas: izq ~224px, centro flex, der ~288px, `gap-6`.
- Toolbar: emoji + título `text-sm font-semibold` + etiqueta editado + Asistente + select visibilidad (Privado/Compartido/Todo el equipo) + kebab + fullscreen.
- Canvas: welcome doc con H1/H2, párrafos, viñetas, numeradas, checklist (la primera tachada), cita itálica, tabla con bordes, bloque de código oscuro.
- Panel Tareas: card `bg-brand-50/30` "DE ESTE DOCUMENTO" + input + tabs + "Nada pendiente. 🎉".

- [ ] **Step 3: Verificar interacción funcional del editor**

En el navegador: en una línea vacía escribir `/` → debe abrir el menú de bloques de BlockNote. Seleccionar texto → barra de formato flotante. Arrastrar el asa de un bloque → reordena. (Confirma que BlockNote es funcional, no un render estático.)

- [ ] **Step 4: Ajustes finos y commit (si aplica)**

Si algún token se desvía del live, ajustarlo y:
```bash
git add -A && git commit -m "fix(fase7): ajustes pixel-perfect tras verificación Playwright"
```

- [ ] **Step 5: Actualizar el ledger SDD** `.superpowers/sdd/progress.md` con el resultado de la verificación.

---

## Self-Review (autor)

**Cobertura del spec:**
- §2 BlockNote + deps → Task 1. ✓
- §3 ruta/shell/nav → Task 7. ✓
- §4.1 modelo de datos + welcome seed → Task 2. ✓
- §4.2 helpers → Task 2. ✓
- §5 tokens (layout/árbol/toolbar/canvas/tareas) → Tasks 3–6. ✓
- §6 comportamiento funcional (editor, árbol, tareas, visibilidad) → Tasks 5–6. ✓
- §7 fuera de alcance → respetado (panel Ayuda no aparece; IA=stub AssistantButton; papelera=entrada visual). ✓
- §8 tests → cada task trae sus tests + Task 8 verificación. ✓
- §9 deltas violeta → tema/`bg-brand-50/30`. ✓

**Placeholder scan:** sin TBD/TODO; todo el código mostrado. Welcome content transcrito verbatim del live.

**Consistencia de tipos:** `DocNode`/`DocTask`/`DocVisibility`/`TreeNode`/`TreeSection` usados igual en Tasks 2–7. Firmas `buildTree/filterDocs/createDoc/findDoc/childrenOf` coinciden entre definición (Task 2) y consumo (Tasks 3,6). `DocEditor`/`DocTree`/`TasksPanel` props consistentes con `MiTrabajoPage`.

**Riesgo aislado:** BlockNote en jsdom → mocks declarados en tests de integración (Tasks 6,7) y smoke en Task 5; interacción real por Playwright (Task 8).
