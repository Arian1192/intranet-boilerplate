# RichTextEditor funcional (compartido) · 2026-07-10

## Contexto

Hay dos drawers "Nueva pieza" con un editor de "Brief" cuya **toolbar es inerte**:
1. **Creativos** — `src/features/creativos/components/drawer/BriefEditor.tsx`: `contenteditable` + toolbar sin `onClick`.
2. **Euphoric** — `src/features/euphoric/components/PieceDrawer.tsx` (`BriefToolbar` + un `<Textarea>` plano). Montado en `PiezasPage`.

El usuario quiere que el formato **funcione visualmente** (aunque no haya Supabase). Ambos editores son casi idénticos y comparten el mismo placeholder → se unifican en un primitivo.

## Decisiones (confirmadas)

- **Enfoque:** `document.execCommand` sobre un `contenteditable` (cero dependencias; deprecado pero soportado en todos los navegadores — estándar para un calco sin backend).
- **Arquitectura:** un primitivo compartido **`RichTextEditor`** en `src/components/ui/`, usado por el drawer de Creativos y por el `PieceDrawer` de Euphoric.
- **Rama:** `feature/creativos-functional-editor` (desde `feature/creativos-nueva-pieza-drawer`); PR sobre esa rama.

## `RichTextEditor` (nuevo, `src/components/ui/RichTextEditor.tsx`)

Basado en el markup del `BriefEditor` de Creativos (el calco fiel del live), con la toolbar **funcional**.

```tsx
export interface RichTextEditorProps {
  placeholder?: string;
  className?: string;
}
```

- Body: `contenteditable` (`suppressContentEditableWarning`, `data-placeholder`, placeholder vía `[&:empty]:before:content-[attr(data-placeholder)]`). `placeholder` por defecto: `"Qué necesita la pieza: mensaje, formato, maquetación, referencias…"`.
- Toolbar (misma que el BriefEditor de Creativos): **B / i / U / S**, divisor, 3 tamaños **A** (`text-[11px]` / `text-sm` / `text-base`), divisor, **✕** (limpiar). Cada botón conserva su `title` + `aria-label`.
- **Funcionalidad** (execCommand):
  - Para no perder la selección al pulsar, cada botón usa `onMouseDown={(e) => e.preventDefault()}` (evita robar foco al `contenteditable`) y ejecuta en `onClick`:
    - B → `document.execCommand('bold')`
    - i → `document.execCommand('italic')`
    - U → `document.execCommand('underline')`
    - S → `document.execCommand('strikeThrough')`
    - A pequeña/normal/grande → `document.execCommand('fontSize', false, '2' | '3' | '5')`
    - ✕ → `document.execCommand('removeFormat')`
  - Un helper interno `exec(command, value?)` centraliza la llamada.
- Presentacional: sin `value`/`onChange` (no hay persistencia); el contenido vive en el DOM del `contenteditable`.

## Consumidores

### Creativos
- `NuevaPiezaDrawer.tsx`: sustituir `<BriefEditor />` por `<RichTextEditor />` (import desde `@/components/ui`).
- Eliminar `src/features/creativos/components/drawer/BriefEditor.tsx` y su test; el nuevo `RichTextEditor` los reemplaza (el markup es equivalente). El comportamiento visible del drawer no cambia salvo que la toolbar **ahora formatea**.

### Euphoric
- `PieceDrawer.tsx`: en el bloque "Brief" (líneas ~264-271), sustituir `<BriefToolbar />` + `<Textarea … />` por `<RichTextEditor />`. Eliminar la función local `BriefToolbar` y la constante `TOOLBAR_TEXT_BUTTONS` (quedan sin uso). Mantener el import de `Textarea` (lo usa "Notas"). El placeholder del Brief pasa a proveerlo `RichTextEditor` (mismo texto).
- **Delta visual intencional:** la toolbar del Brief de Euphoric pasa a la variante unificada (la de Creativos). Es coherente con que en el live es el mismo drawer de "piezas".

## Testing

- `RichTextEditor.test.tsx` (nuevo): 
  - Renderiza toolbar (B/i/U/S, 3 tamaños, ✕) + `contenteditable` con el placeholder por defecto y uno custom.
  - Formato funcional: con `document.execCommand = vi.fn()` (jsdom no lo implementa), pulsar **B** llama `execCommand('bold')`; **i**→`italic`; **S**→`strikeThrough`; una **A** → `execCommand('fontSize', false, '<n>')`; **✕** → `removeFormat`.
  - Los botones no roben el foco: verificar que llevan handler de `onMouseDown` (o, más robusto, que tras click el `execCommand` fue llamado — cubierto arriba).
- Ajustar `BriefEditor.test.tsx` → se elimina junto al componente; su cobertura la asume `RichTextEditor.test.tsx`.
- `PieceDrawer.test.tsx`: sigue verde sin cambios (no asegura sobre la toolbar; comprueba "Nueva pieza", placeholder de Nombre y Cerrar). Verificar.
- `npm run lint` (max-warnings 0), `npx tsc --noEmit`, `npm test` en verde.

## Verificación

Abrir ambos drawers en `npm run dev`: `/creativos` → "+ Nueva pieza" y Euphoric Media → Piezas → "+ Nueva pieza". Escribir texto en el Brief, seleccionarlo y pulsar **B/i/U/S** y los tamaños → el texto cambia de formato visualmente; **✕** limpia. Captura Playwright con texto formateado como evidencia.

## Riesgos / notas

- `execCommand` está deprecado; aceptado para el calco (sin dependencia). Si en el futuro se conecta a Supabase con contenido persistente, se migraría a una librería (TipTap/Lexical) — fuera de alcance.
- jsdom no implementa `execCommand`: los tests lo mockean (`document.execCommand = vi.fn()`), verificando el cableado, no el resultado del navegador.
- El swap en Euphoric unifica el look de su toolbar con el de Creativos (delta visual asumido).
