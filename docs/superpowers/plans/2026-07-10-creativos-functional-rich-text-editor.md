# RichTextEditor funcional (TipTap) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hacer funcional el editor de Brief (bold/italic/underline/tachado/tamaños/limpiar) con TipTap (headless, no deprecado), en un primitivo compartido usado por los drawers de Creativos y Euphoric, manteniendo el diseño pixel-perfect.

**Architecture:** Un componente `RichTextEditor` en `components/ui/` monta un editor TipTap v3 (StarterKit + TextStyle/FontSize + Placeholder) y conserva EXACTAMENTE nuestra toolbar del calco; los botones llaman a comandos del editor. Se sustituye el `BriefEditor` inerte de Creativos y el `BriefToolbar`+`Textarea` de Euphoric por este primitivo.

**Tech Stack:** React 19, TipTap v3 (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-text-style`, `@tiptap/extension-placeholder`), Tailwind 3, Vitest + Testing Library.

## Global Constraints

- **Presentational, sin persistencia.** El editor formatea visualmente; no hay `value`/`onChange` ni backend.
- **Sin código deprecado** (nada de `document.execCommand`). **Diseño pixel-perfect**: la toolbar y el contenedor son idénticos al `BriefEditor` de Creativos; el área editable recibe las clases originales del cuerpo (`min-h-[90px] px-3 py-2 text-sm leading-snug outline-none`).
- Dependencias TipTap **ya instaladas** (v3.27.x) — no reinstalar. **StarterKit v3 ya incluye Underline** (no añadir el paquete underline). `FontSize` viene de `@tiptap/extension-text-style` y requiere `TextStyle`.
- Repo enforcea `npm run lint --max-warnings 0`, `npx tsc --noEmit`, `npm test` en verde. **Salida de tests pristina** (verificado: montar TipTap no genera warnings de act()).
- Placeholder por defecto: `"Qué necesita la pieza: mensaje, formato, maquetación, referencias…"`.

---

### Task 1: `RichTextEditor` (TipTap) + export + CSS del placeholder

**Files:**
- Create: `src/components/ui/RichTextEditor.tsx`
- Modify: `src/components/ui/index.ts` (export)
- Modify: `src/styles/index.css` (regla del placeholder de ProseMirror)
- Test: `src/components/ui/RichTextEditor.test.tsx`

**Interfaces:**
- Produces: `RichTextEditor({ placeholder?, className? }: { placeholder?: string; className?: string })`, exportado desde `@/components/ui`.

- [ ] **Step 1: Test (debe fallar)**

Crear `src/components/ui/RichTextEditor.test.tsx`:

```tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
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
});
```

- [ ] **Step 2: Ejecutar y ver fallar**

Run: `npx vitest run src/components/ui/RichTextEditor.test.tsx`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar el componente**

Crear `src/components/ui/RichTextEditor.tsx`:

```tsx
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@/lib/utils';

const DEFAULT_PLACEHOLDER = 'Qué necesita la pieza: mensaje, formato, maquetación, referencias…';
const toolBtn = 'grid h-7 min-w-[28px] place-items-center rounded px-1 text-slate-600 hover:bg-slate-100';

export interface RichTextEditorProps {
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ placeholder = DEFAULT_PLACEHOLDER, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontSize, Placeholder.configure({ placeholder })],
    content: '',
    editorProps: {
      attributes: { class: 'min-h-[90px] px-3 py-2 text-sm leading-snug outline-none' },
    },
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

- [ ] **Step 4: Export en el barrel**

En `src/components/ui/index.ts`, añadir:

```ts
export * from './RichTextEditor';
```

- [ ] **Step 5: CSS del placeholder de ProseMirror**

En `src/styles/index.css`, añadir al final (regla plana, fuera de `@layer`):

```css
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: rgb(148 163 184);
  float: left;
  height: 0;
  pointer-events: none;
}
```

- [ ] **Step 6: Ejecutar test + tsc + lint**

Run: `npx vitest run src/components/ui/RichTextEditor.test.tsx && npx tsc --noEmit && npm run lint`
Expected: test PASS; tsc sin errores; lint 0 warnings.
Nota: si `tsc` no resuelve `toggleUnderline`/`setFontSize`, es porque falta cargar la augmentación de tipos; TipTap v3 la aporta al importar `StarterKit` (incluye Underline) y `FontSize`. Si aún fallara, reportar BLOCKED con el error exacto (no castear a `any` sin acordarlo).

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/RichTextEditor.tsx src/components/ui/RichTextEditor.test.tsx src/components/ui/index.ts src/styles/index.css
git commit -m "feat(ui): functional RichTextEditor (TipTap, headless) with pixel-perfect toolbar"
```

---

### Task 2: Migrar Creativos a `RichTextEditor`

**Files:**
- Modify: `src/features/creativos/components/NuevaPiezaDrawer.tsx`
- Delete: `src/features/creativos/components/drawer/BriefEditor.tsx`
- Delete: `src/features/creativos/components/drawer/BriefEditor.test.tsx`

**Interfaces:**
- Consumes: `RichTextEditor` de `@/components/ui` (Task 1).

- [ ] **Step 1: Sustituir el import y el uso en el drawer**

En `src/features/creativos/components/NuevaPiezaDrawer.tsx`:
(a) eliminar `import { BriefEditor } from './drawer/BriefEditor';`
(b) añadir `RichTextEditor` al import existente de `@/components/ui` (junto a `Badge, Button`), quedando: `import { Badge, Button, RichTextEditor } from '@/components/ui';`
(c) sustituir `<BriefEditor />` por `<RichTextEditor />` en el bloque Brief.

- [ ] **Step 2: Borrar el componente inerte y su test**

```bash
git rm src/features/creativos/components/drawer/BriefEditor.tsx src/features/creativos/components/drawer/BriefEditor.test.tsx
```

- [ ] **Step 3: Ejecutar tests del drawer + gate**

Run: `npx vitest run src/features/creativos/components/NuevaPiezaDrawer.test.tsx && npx tsc --noEmit && npm run lint`
Expected: NuevaPiezaDrawer 4/4 PASS (no dependían de `BriefEditor`); tsc/lint limpios.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(creativos): use functional RichTextEditor in NuevaPiezaDrawer (drop inert BriefEditor)"
```

---

### Task 3: Migrar Euphoric `PieceDrawer` a `RichTextEditor`

**Files:**
- Modify: `src/features/euphoric/components/PieceDrawer.tsx`

**Interfaces:**
- Consumes: `RichTextEditor` de `@/components/ui` (Task 1).

- [ ] **Step 1: Reemplazar el bloque Brief**

En `src/features/euphoric/components/PieceDrawer.tsx`:
(a) añadir `RichTextEditor` al import de `@/components/ui` (queda `import { Badge, Button, Input, RichTextEditor, Select, Textarea } from '@/components/ui';`). **Mantener `Textarea`** (lo usa "Notas").
(b) en el bloque Brief, reemplazar:

```tsx
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-700">Brief</p>
            <BriefToolbar />
            <Textarea
              className="rounded-t-none"
              placeholder="Qué necesita la pieza: mensaje, formato, maquetación, referencias…"
            />
          </div>
```

por:

```tsx
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-700">Brief</p>
            <RichTextEditor />
          </div>
```

(c) eliminar la función local `BriefToolbar` (líneas ~90-128) y la constante `TOOLBAR_TEXT_BUTTONS` (línea ~88), que quedan sin uso.

- [ ] **Step 2: Ejecutar tests + gate**

Run: `npx vitest run src/features/euphoric/components/PieceDrawer.test.tsx && npx tsc --noEmit && npm run lint`
Expected: PieceDrawer tests PASS (comprueban "Nueva pieza", placeholder de Nombre y Cerrar — no la toolbar); tsc sin errores (sin variables/función sin usar); lint 0 warnings.

- [ ] **Step 3: Commit**

```bash
git add src/features/euphoric/components/PieceDrawer.tsx
git commit -m "feat(euphoric): use functional RichTextEditor in PieceDrawer (drop inert BriefToolbar+Textarea)"
```

---

### Task 4: Verificación funcional + pixel-perfect

**Files:** ninguno (solo verificación; capturas al scratchpad).

- [ ] **Step 1: Suite completa** — `npx tsc --noEmit && npm run lint && npm test` en verde.
- [ ] **Step 2: Dev server** (si no está): `npm run dev` → `http://localhost:5173/`.
- [ ] **Step 3: Verificar en navegador (Playwright, chromium de caché, 1440×1000, dSF 2)** en AMBOS drawers:
  - `/creativos` → "+ Nueva pieza" → en el Brief: escribir texto, seleccionarlo, pulsar **B** y comprobar que el HTML del editor contiene `<strong>` (o el texto en negrita); repetir con **i** (`<em>`), **U** (`<u>`), **S** (`<s>`), una **A** (`<span style="font-size:…">`); **✕** limpia. Capturar.
  - Euphoric Media → Piezas → "+ Nueva pieza" → mismo check.
- [ ] **Step 4: Pixel-perfect** — contrastar la toolbar/editor contra el calco previo (`docs/references/creativos/live-nueva-pieza-drawer.png`): la toolbar y el contenedor deben verse idénticos al `BriefEditor` anterior.
- [ ] **Step 5: Actualizar memoria** ([[fase5-creativos-status]]): editor de Brief hecho funcional con TipTap (primitivo compartido `RichTextEditor`), rama `feature/creativos-functional-editor`, PR sobre `feature/creativos-nueva-pieza-drawer`.

---

## Notas de auto-revisión (cobertura del spec)

- Primitivo TipTap funcional + placeholder + pixel-perfect → Task 1. Migración Creativos (drop BriefEditor) → Task 2. Migración Euphoric (drop BriefToolbar+Textarea, keep Textarea de Notas) → Task 3. Verificación funcional en ambos + pixel-perfect → Task 4.
- Deps ya instaladas; StarterKit v3 incluye Underline (no duplicar); FontSize desde text-style con TextStyle.
- Sin placeholders: código literal en cada step. Sin `execCommand`.
- Consistencia: `RichTextEditor` (Task 1) consumido por Tasks 2 y 3 con la misma firma; se elimina `BriefEditor` y sus consumidores se actualizan.
- Deltas intencionales: la toolbar del Brief de Euphoric se unifica con la de Creativos.
