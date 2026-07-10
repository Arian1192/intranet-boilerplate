# RichTextEditor funcional (compartido, TipTap) · 2026-07-10

## Contexto

Hay dos drawers "Nueva pieza" con un editor de "Brief" cuya **toolbar es inerte**:
1. **Creativos** — `src/features/creativos/components/drawer/BriefEditor.tsx`: `contenteditable` + toolbar sin `onClick`.
2. **Euphoric** — `src/features/euphoric/components/PieceDrawer.tsx` (`BriefToolbar` + un `<Textarea>` plano). Montado en `PiezasPage`.

El usuario quiere que el formato **funcione de verdad**, **sin código deprecado** y **manteniendo el diseño pixel-perfect**. Ambos editores son casi idénticos y comparten placeholder → se unifican en un primitivo.

## Decisiones (confirmadas)

- **Enfoque:** **TipTap v3** (sobre ProseMirror), **headless** — conservamos exactamente nuestra toolbar y contenedor (pixel-perfect) y cableamos los botones a comandos del editor. **No** usamos `document.execCommand` (deprecado).
- **Arquitectura:** primitivo compartido **`RichTextEditor`** en `src/components/ui/`, usado por el drawer de Creativos y por el `PieceDrawer` de Euphoric.
- **Rama:** `feature/creativos-functional-editor` (desde `feature/creativos-nueva-pieza-drawer`); PR sobre esa rama.

## Dependencias (ya instaladas y validadas)

`@tiptap/react`, `@tiptap/core`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-text-style`, `@tiptap/extension-placeholder` (v3.27.x). Compatibles con React 19; **TipTap monta en jsdom** (smoke-test verificado).

Notas de extensiones:
- **StarterKit v3 ya incluye `Underline`** (y bold/italic/strike/…), así que **no** se añade el paquete underline por separado (evita duplicar la extensión).
- **`FontSize`** vive en `@tiptap/extension-text-style` y requiere **`TextStyle`** (ambos se registran).
- **`Placeholder`** para el texto de ayuda cuando está vacío.

## `RichTextEditor` (nuevo, `src/components/ui/RichTextEditor.tsx`)

Markup idéntico al `BriefEditor` de Creativos (calco fiel del live), con la toolbar **funcional** vía TipTap.

```tsx
export interface RichTextEditorProps {
  placeholder?: string;   // default: "Qué necesita la pieza: mensaje, formato, maquetación, referencias…"
  className?: string;     // clases del contenedor externo (opcional)
}
```

Estructura:
- Contenedor: `overflow-hidden rounded-lg border border-slate-300 focus-within:border-brand-400`.
- **Toolbar** (misma que el BriefEditor de Creativos, `flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-1.5 py-1`): **B / i / U / S**, divisor, 3 tamaños **A** (`text-[11px]` / `text-sm` / `text-base`), divisor, **✕**. Cada botón: `type="button"`, `title` + `aria-label`, clase `grid h-7 min-w-[28px] place-items-center rounded px-1 text-slate-600 hover:bg-slate-100`.
- **Editor:** `<EditorContent editor={editor} />`. El área editable recibe las clases del cuerpo original vía `editorProps.attributes.class`: `min-h-[90px] px-3 py-2 text-sm leading-snug outline-none`.

Editor (`useEditor`):
```tsx
const editor = useEditor({
  extensions: [
    StarterKit,                    // incluye bold/italic/strike/underline + core + history
    TextStyle,
    FontSize,
    Placeholder.configure({ placeholder }),
  ],
  content: '',
  editorProps: {
    attributes: { class: 'min-h-[90px] px-3 py-2 text-sm leading-snug outline-none' },
  },
});
```

Handlers de la toolbar (no roban el foco — los botones usan `onMouseDown={(e) => e.preventDefault()}` y ejecutan en `onClick`):
- **B** → `editor.chain().focus().toggleBold().run()`
- **i** → `toggleItalic()`
- **U** → `toggleUnderline()`
- **S** → `toggleStrike()`
- **A** pequeña/normal/grande → `editor.chain().focus().setFontSize('12px' | '15px' | '20px').run()`
- **✕** → `editor.chain().focus().unsetAllMarks().run()` (limpia bold/italic/underline/strike y el fontSize, que es un mark de TextStyle)

Guardas: si `!editor` (primer render antes del efecto de `useEditor`), la toolbar se renderiza igual pero los handlers hacen `editor?.chain()...` (no-op si aún no montó).

Estado activo (opcional, mejora fidelidad): un botón puede marcarse activo con `editor?.isActive('bold')` → añadir `bg-slate-200` cuando activo. No es obligatorio para el calco; se puede incluir si es barato.

Presentacional: sin `value`/`onChange` ni persistencia; el contenido vive en el editor.

### Placeholder (CSS)

`Placeholder` marca el primer párrafo vacío con `is-editor-empty` y `data-placeholder`. Añadir en `src/styles/index.css`:

```css
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  @apply text-slate-400;
  float: left;
  height: 0;
  pointer-events: none;
}
```

(Color `slate-400` = mismo placeholder del calco.)

## Consumidores

### Creativos
- `NuevaPiezaDrawer.tsx`: sustituir `<BriefEditor />` por `<RichTextEditor />` (import desde `@/components/ui`).
- Eliminar `src/features/creativos/components/drawer/BriefEditor.tsx` y su test (los reemplaza `RichTextEditor`). El drawer se ve igual, pero la toolbar **ahora formatea**.

### Euphoric
- `PieceDrawer.tsx`, bloque "Brief" (~líneas 264-271): sustituir `<BriefToolbar />` + `<Textarea … />` por `<RichTextEditor />`. Eliminar la función local `BriefToolbar` y la constante `TOOLBAR_TEXT_BUTTONS` (sin uso). **Mantener** el import de `Textarea` (lo usa "Notas", línea ~305). El placeholder lo provee `RichTextEditor` (mismo texto).
- **Delta visual intencional:** la toolbar del Brief de Euphoric pasa a la variante unificada (la de Creativos). Coherente con que en el live es el mismo drawer de "piezas".

## Testing

- `RichTextEditor.test.tsx` (nuevo):
  - Renderiza la toolbar (B/i/U/S por su nombre accesible, 3 tamaños, ✕) y una región editable (`.ProseMirror` / `[contenteditable="true"]`).
  - Placeholder: pasa uno custom y se refleja en `data-placeholder` del párrafo vacío (o en el atributo configurado).
  - (TipTap monta en jsdom — verificado.) El formato real (toggle de marks con selección) es difícil de dirigir en jsdom; la verificación funcional se hace por Playwright en navegador real (paso de Verificación). Los tests unitarios cubren render + presencia + que pulsar un botón no lanza.
- Eliminar `BriefEditor.test.tsx` junto al componente; su cobertura la asume `RichTextEditor.test.tsx`.
- `PieceDrawer.test.tsx`: verificar que sigue en verde (no asegura sobre la toolbar; comprueba "Nueva pieza", placeholder de Nombre y Cerrar).
- `NuevaPiezaDrawer.test.tsx`: verificar que sigue en verde (usa el drawer completo; el Brief cambia de `BriefEditor` a `RichTextEditor`, mismo rol visible).
- `npm run lint` (max-warnings 0), `npx tsc --noEmit`, `npm test` en verde.

## Verificación (funcional, pixel-perfect)

`npm run dev` → abrir ambos drawers (`/creativos` → "+ Nueva pieza"; Euphoric Media → Piezas → "+ Nueva pieza"). Con Playwright: escribir texto en el Brief, seleccionarlo, pulsar **B/i/U/S** y una **A**, y confirmar que el HTML del editor pasa a `<strong>`/`<em>`/`<u>`/`<s>`/`<span style="font-size…">`; **✕** limpia. Contrastar el look de la toolbar/editor contra el calco (debe ser idéntico al `BriefEditor` anterior). Captura como evidencia.

## Riesgos / notas

- Nuevas dependencias (TipTap): peso de bundle asumido a cambio de un editor real y **no deprecado**. Headless → **diseño pixel-perfect intacto** (nuestra toolbar y contenedor no cambian; TipTap solo aporta el motor + el área editable, a la que aplicamos las clases originales).
- jsdom no dirige bien las transacciones/selección de ProseMirror: el formato real se valida en navegador (Playwright), no en unit tests.
- El swap en Euphoric unifica el look de su toolbar con el de Creativos (delta visual asumido).
- `npm audit` reporta vulnerabilidades preexistentes/transitivas; fuera de alcance de esta fase.
