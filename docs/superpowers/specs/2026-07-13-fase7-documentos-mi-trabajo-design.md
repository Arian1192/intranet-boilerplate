# Fase 7 — Documentos (`/mi-trabajo`) · Design

**Fecha:** 2026-07-13
**Rama objetivo:** `feature/fase7-documentos` (desde `feature/fase6-crm`)
**Tipo:** Calco pixel-perfect + editor funcional (presentacional, in-memory, sin Supabase)

---

## 1. Contexto y objetivo

El live de Black Moose incorporó un módulo nuevo **Documentos / "Mi trabajo"** (`/mi-trabajo`): un
editor tipo Notion. No existe en nuestra app (no hay ruta ni nav). El objetivo es calcarlo
**pixel-perfect** y que sea **funcional visualmente** (crear/editar bloques, arrastrar, menú "/"),
sin backend — todo en memoria, como el resto de fases.

**Hallazgo técnico decisivo:** el canvas del editor original está construido con **BlockNote**
(`@blocknote/*`; las clases del DOM llevan prefijo `bn-`, p.ej. `bn-inline-content`). BlockNote es
un editor Notion-style construido sobre TipTap/ProseMirror, mantenido y compatible con React 19.
El **shell** (3 columnas, árbol, toolbar, panel Tareas) es Tailwind propio.

### Criterios de éxito
- La página `/mi-trabajo` calca el layout de 3 columnas con los tokens medidos del live.
- El editor central es BlockNote, funcional: menú "/", arrastre de bloques, barra de formato
  flotante, y todos los tipos de bloque vistos (H1/H2, párrafo, viñetas, numeradas, checklist,
  cita, tabla, bloque de código, marcas inline negrita/cursiva/subrayado/tachado/código).
- El editor abre con el doc seed "Bienvenido a Documentos" (contenido calcado del live).
- Árbol de documentos con secciones, anidamiento, selección y "crear" en memoria.
- Panel "Tareas" visual con card *de este documento*, input, tabs y estado vacío.
- Verde total: tests, lint 0, tsc limpio. Verificación Playwright vs `docs/references/mi-trabajo/`.

---

## 2. Decisión de arquitectura: BlockNote

Se evaluaron tres enfoques (ver brainstorming). **Elegido: BlockNote**, la misma librería que el
original, porque da comportamiento funcional de fábrica (slash-menu, drag, tipos de bloque, barra de
formato), garantiza paridad visual y no es deprecada (React 19 ✓). Alternativas descartadas:
extender nuestro TipTap (= reconstruir BlockNote a mano, mucho riesgo) y estático read-only
(contradice "debería andar").

### Dependencias nuevas
- `@blocknote/core` (0.51.x)
- `@blocknote/react` (0.51.x)
- `@blocknote/mantine` (0.51.x) — provee el chrome (slash-menu, toolbar, drag handle). Arrastra
  Mantine como dep transitiva; aceptado por ser el camino de paridad con el original.

Se importa el CSS de BlockNote (`@blocknote/mantine/style.css`) una vez, y se **tematiza** hacia
nuestro look slate/Inter con variables CSS (`--bn-colors-*`) y overrides en `src/styles/`, para
respetar el diseño pixel-perfect sin el look Mantine por defecto.

> Verificación previa a implementar (Task 1): montar un `<BlockNoteView>` mínimo en jsdom/vitest y
> en navegador; confirmar que el bundle compila con React 19 y que la barra "/" aparece. Si el
> render en jsdom fuese problemático, los tests del editor se limitan a smoke (presencia del
> contenedor) y la interacción funcional se valida por Playwright.

---

## 3. Ruta, nav y shell

- **Ruta nueva** en `src/app/router.tsx`: `<Route path="/mi-trabajo" element={<MiTrabajoShell />} />`
  (página única, **sin tabs de módulo** — el header solo muestra el breadcrumb "Espacios ▾", igual
  que el live).
- **`MiTrabajoShell`** (`src/features/modules/MiTrabajoShell.tsx`): usa `AppLayout` sin `module`
  (o con `module` mínimo sin tabs) y renderiza `<MiTrabajoPage/>`.
- **Acceso desde la UI**: el live entra a `/mi-trabajo` desde el icono "maletín" del header. Se
  añade el enlace al header (icono maletín) para poder navegar; si el TopNav no lo soporta aún, se
  añade de forma mínima. (Detalle a resolver en el plan; no bloqueante.)

`AppLayout` ya centra en `max-w-[1248px] px-4 py-7`. El live usa `max-w-7xl px-4 py-6` (1280px). Se
mantiene el contenedor de `AppLayout`; la página interna reproduce el `flex ... lg:flex-row gap-6`.

---

## 4. Módulo `src/features/mi-trabajo/`

Patrón "cruda" (data local, sin MockRepository), igual que CRM/Creativos.

```
src/features/mi-trabajo/
  data/
    seed.ts        # tipos + docs seed (árbol) + welcome doc (bloques BlockNote) + tareas seed
    docs.ts        # helpers puros: buildTree, findDoc, flatten, filterDocs(query)
  editor/
    blocknote-theme.ts   # tema/props de BlockNote (colores, fuente) hacia nuestro look
  components/
    DocTree.tsx          # árbol izquierdo (secciones + items anidados + crear + buscador + papelera)
    DocTreeItem.tsx      # fila de doc (emoji + título + "+", indent por nivel, selección)
    DocEditor.tsx        # centro: toolbar (emoji, título, Asistente, visibilidad, kebab, fullscreen) + BlockNoteView
    AssistantButton.tsx  # botón "≡ Asistente" + popover visual (stub, sin IA real)
    TasksPanel.tsx       # panel derecho: card "de este documento" + input + tabs + lista/vacío
  pages/
    MiTrabajoPage.tsx    # compone las 3 columnas + estado (doc seleccionado, docs, tareas)
```

### 4.1 Modelo de datos (seed, in-memory)

```ts
type DocVisibility = 'privado' | 'compartido' | 'equipo';

interface DocNode {
  id: string;
  emoji: string;          // p.ej. "📘"
  title: string;
  visibility: DocVisibility;
  parentId: string | null;
  content: Block[];       // bloques BlockNote (PartialBlock[])
  updatedLabel: string;   // texto tipo "Editado hace 2 h" (mostrado en toolbar)
}

interface DocTask {
  id: string;
  docId: string;
  text: string;
  done: boolean;
  owner: string;          // iniciales/nombre
  dueLabel?: string;      // "15 jul"
  scope: 'mias' | 'creadas' | 'todas';
}
```

Seed:
- **Welcome doc** "Bienvenido a Documentos" (visibility `equipo`), con el contenido calcado del live
  (H1 "Bienvenido", secciones H2 "Lo primero: la tecla /", "Texto", "Listas", "Citas", "Tablas",
  "Código", "El asistente de escritura", "Quién ve esto", "Lo que Notion no hacía", "Si te
  equivocas", "Ahora prueba tú"; párrafos, listas de viñetas/numeradas/checklist, cita, tabla
  Concepto/Importe/Estado, bloque de código JS). Ver `docs/references/mi-trabajo/live-doc-open.png`.
- **2 docs adicionales** vacíos/breves para poblar el árbol (secciones Privados/Compartidos vacías
  como en el live, y "Todo el equipo" con el welcome + 1 hijo anidado de ejemplo).
- **Tareas seed**: lista vacía por defecto (estado "Nada pendiente. 🎉") + 1-2 opcionales para
  demostrar la fila de tarea.

### 4.2 Helpers puros (`docs.ts`) — testeables
- `buildTree(docs): TreeSection[]` — agrupa por visibility en secciones y anida por `parentId`.
- `findDoc(docs, id)`, `childrenOf(docs, id)`.
- `filterDocs(docs, query)` — filtra por título (para el buscador de la lupa).
- `createDoc(section|parentId)` — devuelve un `DocNode` nuevo (título "Sin título") para añadir en
  memoria.

---

## 5. Tokens pixel-perfect (medidos del live)

### Layout
- Fila: `flex flex-col gap-6 lg:flex-row`.
- **Izq**: `w-full shrink-0 lg:sticky lg:top-20 lg:w-56 lg:self-start` (**224px**).
- **Centro**: `min-w-0 flex-1`.
- **Der**: `w-full shrink-0 lg:sticky lg:top-20 lg:w-72 lg:self-start` (**288px**).

### Árbol (izq)
- Cabecera: `mb-3 flex h-9 items-center justify-between`; `h2.text-sm font-semibold text-slate-800`
  "Documentos" + botón lupa `grid h-8 w-8 place-items-center rounded-lg text-slate-400`.
- Secciones: wrapper `space-y-5`; títulos `PRIVADOS / COMPARTIDOS / TODO EL EQUIPO` (uppercase,
  `text-xs`, con "+" a la derecha). Vacías → "Vacío" en `text-slate-400`.
- Item: emoji + título; anidado con indent por nivel; hover; seleccionado resaltado; "+" para crear
  hijo. Papelera al fondo de la columna (entrada pequeña).

### Toolbar del editor (centro)
- Fila `mb-3 flex h-9 shrink-0 items-center gap-1`.
- Emoji: botón `grid h-8 w-7 place-items-center rounded-lg text-base`.
- Título: `input min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-semibold text-slate-800`.
- Etiqueta editado: `span text-xs text-slate-400`.
- Asistente: `inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-slate-500`.
- Visibilidad: `select h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-600`,
  opciones **Privado / Compartido / Todo el equipo**.
- Kebab "…" y botón pantalla completa: `grid h-8 w-8 place-items-center rounded-lg`.

### Canvas (BlockNote) — tipografía objetivo
- Contenedor: `article min-h-[70vh] rounded-2xl border border-slate-200/70 bg-white` (padding
  inferior generoso, `pb-16`).
- Fuente Inter. Párrafo `16px / line-height 23.2px / color rgb(51,65,85)`.
- H1 con `letter-spacing -0.32px`, bold, tamaño grande.
- Cita: itálica, `color rgb(125,121,122)`, `padding-left 16px` (barra izquierda).
- Bloque de código: texto blanco, `padding 24px`, monospace, fondo casi negro.
- Tabla: `td border 1px solid rgb(221,221,221)`, `padding 5px 10px`, `color rgb(63,63,63)`.
- Checklist: casilla marcada tacha el texto.

### Panel Tareas (der)
- Cabecera `h2 flex items-center gap-2 text-sm font-semibold text-slate-800` "Tareas" + "＋"
  (`grid h-8 w-8 ... text-slate-400`).
- Card *de este documento*: `card mb-3 border-brand-200/70 bg-brand-50/30 p-3`, header
  "DE ESTE DOCUMENTO" + "+ Tarea".
- Card lista: `card p-3` con input `input mb-2 h-8 py-0 text-sm` (placeholder "Tarea de este
  documento…") + tabs **Mías / Creadas / Todas / Ver hechas** + vacío "Nada pendiente. 🎉".

> `card` se compone con nuestro `Card` (`rounded-xl border-slate-100 bg-white shadow-sm`) más los
> overrides medidos; `.input` ya existe como utilidad. Igual que se hizo en CRM.

---

## 6. Comportamiento funcional (in-memory)

- **Editor**: BlockNote gestiona su propio estado; al cambiar de doc se recarga `initialContent`
  desde el seed del doc seleccionado. Menú "/", arrastre, barra de formato y tipos de bloque =
  funcionalidad nativa de BlockNote. El título (input) y la visibilidad (select) actualizan el
  estado local del doc.
- **Árbol**: seleccionar un doc lo abre en el centro; "+" en sección/doc crea un `DocNode` nuevo en
  memoria (título "Sin título") y lo selecciona; buscador filtra por título.
- **Tareas**: visual; el input y las tabs cambian el estado local (sin persistir). Estado vacío por
  defecto.
- **Asistente / visibilidad / kebab / fullscreen**: `Asistente` abre un popover visual (texto de
  ejemplo, sin IA); el resto son controles visuales/no-op salvo la visibilidad que sí togglea el
  estado local.

---

## 7. Fuera de alcance (otras fases / stub)

- 🚫 **Panel "Ayuda" global** (abajo-izq, presente en todas las pantallas) → transversal; va con la
  fase **Incidencias/Support**. No se implementa aquí.
- ⏸ **Asistente IA real** → solo stub visual.
- ⏸ **Menciones `@doc`** y **restaurar desde papelera** → la papelera se muestra como entrada en el
  árbol; menciones y flujo de restore quedan diferidos (o mínimos si salen gratis con BlockNote).
- 🚫 Persistencia / Supabase.

---

## 8. Estrategia de tests (Vitest + Testing Library)

- **`docs.ts`**: unit tests de `buildTree`/`filterDocs`/`createDoc` (agrupación por visibility,
  anidamiento por parentId, filtro por título, alta en memoria).
- **`DocTree`**: renderiza secciones + items, selección invoca callback, "+" crea doc, buscador
  filtra.
- **`TasksPanel`**: card *de este documento*, tabs cambian, estado vacío "Nada pendiente. 🎉".
- **`DocEditor`**: smoke — toolbar (emoji, título editable, select visibilidad con 3 opciones,
  Asistente) presente y contenedor del editor montado. La interacción "/"/drag se valida por
  Playwright, no en jsdom (BlockNote/ProseMirror es frágil en jsdom).
- **`MiTrabajoPage`**: integración — 3 columnas presentes, abrir un doc del árbol lo muestra en el
  centro.
- Verificación final Playwright: `/mi-trabajo` vs `docs/references/mi-trabajo/` (columnas 224/flex/288,
  toolbar, bloques del welcome doc, panel Tareas). Confirmar que "/" abre el menú de bloques.

---

## 9. Deltas intencionales

- Marca **violeta** (brand) donde el live usa gris/negro (botones primarios, card de tareas
  `bg-brand-50/30` ya coincide con el live que usa su brand). Coherente con el resto de la app.
- El breadcrumb "Espacios ▾" y el header se mantienen como los nuestros.
- Controles inertes (kebab, fullscreen, "Reportar con captura" del panel global) no aplican aquí.

---

## 10. Riesgos y mitigaciones

- **BlockNote en jsdom**: posible fragilidad → tests del editor a nivel smoke; interacción por
  Playwright. Verificado en Task 1 antes de construir encima.
- **Peso de Mantine**: dep transitiva aceptada por paridad; se importa solo en el módulo.
- **Theming**: si el look por defecto se desvía, se ajusta con variables `--bn-colors-*` y overrides
  CSS acotados al canvas.
- **React 19**: peer range de BlockNote incluye `^19` ✓ (verificado: `@blocknote/react@0.51.4`).
```
