# Mini fase — Home real: Novedades (calco pixel-perfect)

**Fecha:** 2026-07-09
**Rama:** `feature/fase3-comunicacion-produccion`
**Objetivo:** Adaptar el bloque **Novedades** del dashboard para que sea un calco 100 % fiel de la home real de la web de referencia (blackmoose). Tres cambios: (1) recolor + separación de las cards de novedad, (2) formulario inline "Nueva novedad" montado en el propio home (sin modal), (3) expandir/colapsar cada card con contenido y enlaces Editar/Eliminar.

**Restricción invariable:** todo es **presentacional**. Nada persiste ni llama al repositorio con mutaciones. `Publicar`, `Cancelar`, `Editar` y `Eliminar` solo manipulan estado de UI local. No se crea/edita/borra ningún dato bajo ningún concepto.

---

## Referencia de color y tipografía (medido de las capturas, pixel-perfect)

Valores extraídos por muestreo de píxeles de las 3 capturas (`home` expandida, colapsada, formulario). Factor de escala de captura ≈ 1.16× (calibrado con el saludo `text-3xl`).

### Cards de novedad (delta principal de color)

| Elemento | Hex medido | Token / clase |
|----------|-----------|---------------|
| Fondo card novedad | `#F7F6FC` | **nuevo token** `news-card` → `bg-news-card` |
| Borde card novedad | `#EEE3F6` | **nuevo token** `news-border` → `border-news-border` |
| Fondo de página | `#F8FAFC` | `slate-50` (sin cambio) |

> Estos valores **no** coinciden con `brand-50` (`#F7F3FB`) ni `brand-100` (`#EDE9FE`) — el borde `#EEE3F6` es el que da el matiz "rosáceo/lila" que distingue la card. Se añaden tokens dedicados en `tailwind.config.js` para no hardcodear y mantener el calco exacto.

### Texto

| Elemento | Hex medido | Clase |
|----------|-----------|-------|
| Label "NOVEDADES" | `#94A3B8` | `text-slate-400` uppercase tracking-wider (sin cambio) |
| Autor | `#475569` | `text-slate-700` (sin cambio) |
| Meta (ámbito · fecha) | `#64748B` | `text-slate-500` (sin cambio) |
| Título novedad | `#1E293B` | `text-slate-800` **+ `font-semibold`** (antes `font-normal`) |
| Contenido (expandido) | `#475569` | `text-slate-600 leading-relaxed` |
| Editar / Eliminar | `#94A3B8` | `text-slate-400 hover:text-slate-600` |

### Formulario

| Elemento | Hex medido | Clase |
|----------|-----------|-------|
| Card contenedor del form | blanco, borde `#E2E8F0` | `bg-white border-slate-200 rounded-xl shadow-sm` |
| Borde de inputs/select/textarea | `#CBD5E1` | `border-slate-300` (override sobre el default `slate-200` del componente) |
| Panel "¿Cuándo se publica?" | borde `#E2E8F0` | `border-slate-200 rounded-lg` |
| Track del SegmentedControl | `#F1F5F9` | `bg-slate-100` (ya coincide) |
| Segmento activo | `#FFFFFF` | `bg-white shadow-sm` (ya coincide) |
| Segmento inactivo (texto) | `#64748B` | `text-slate-500` (ya coincide) |
| Checkbox marcado (accent) | `#0075FF` | `accent-[#0075FF]` |
| Botón "Publicar" | `#773C9F` / texto blanco | `Button variant="primary"` (brand-600, ya coincide) |
| Botón "Cancelar" | blanco, borde `slate-200` | `Button variant="secondary"` (ya coincide) |

Tipografía: se mantiene el stack y la escala ya establecidos en el proyecto (system font). Único cambio de peso: título de novedad → `font-semibold`.

---

## Arquitectura de componentes

Se refactoriza `src/features/dashboard/NewsFeed.tsx` y se añaden dos componentes hermanos en la misma carpeta. Boundaries claros y testeables por separado.

### `NewsFeed.tsx` (contenedor — refactor)
- Header: label "NOVEDADES" + botón "+".
- Estado local `showForm: boolean`. El "+" hace toggle.
- Si `showForm`, monta `<NewsForm onClose={() => setShowForm(false)} />` **entre** el header y la lista (inline, no modal).
- Renderiza la lista como **una `NewsCard` por item, separadas** con `space-y-3` (ya no un único `Card` con `divide-y`).
- Props sin cambios: `{ items: NewsItem[] }`.

### `NewsCard.tsx` (nuevo — card individual)
- Props: `{ item: NewsItem }`.
- Contenedor: `rounded-xl border border-news-border bg-news-card` con padding `p-5`.
- Estado local `expanded: boolean` (por card).
- **Colapsada:** fila meta (avatar inicial + autor → ámbito · fecha + badge `scheduledFor` opcional) + título (`font-semibold`) + chevron `ChevronDown` a la derecha.
- **Expandida:** añade párrafo `item.content` (`text-slate-600 leading-relaxed`) y, en una fila inferior: a la izquierda el botón de acción (`item.actionLabel`, si existe, `Button primary sm`), a la derecha los enlaces **Editar** / **Eliminar** (`text-xs text-slate-400`, presentacionales, `onClick` no-op). El chevron pasa a `ChevronUp`.
- Editar/Eliminar y el chevron no navegan ni mutan; solo alternan estado o son no-ops.

### `NewsForm.tsx` (nuevo — formulario inline presentacional)
- Props: `{ onClose: () => void }`.
- Contenedor `Card` blanco (`border-slate-200`), padding `p-5`/`p-6`.
- Estado local para todos los campos (controlados) — nunca sale del componente.
- Campos, en orden vertical:
  1. `Título` — `Input` (`border-slate-300`).
  2. `Contenido` — `Textarea` (`border-slate-300`).
  3. `Ámbito` — `Select` con opciones (`Todo el grupo` por defecto, más opciones plausibles de espacios).
  4. Grid `md:grid-cols-2`: `Enlace del botón (opcional)` (`Input` placeholder `https://...`) + `Texto del botón` (`Input` placeholder `Ej.: Confirmar asistencia`).
  5. Panel `¿Cuándo se publica?` (`rounded-lg border border-slate-200 p-4`):
     - `SegmentedControl` fullWidth, opciones `Ahora` | `Programar` | `Borrador` (estado local, default `Ahora`).
     - Checkbox 1 (marcado por defecto): "Notificar a todo el equipo" + `(campanita)` en `text-slate-400`.
     - Checkbox 2: "Enviar también por email" + `(para novedades importantes)` en `text-slate-400`.
     - Checkboxes nativos con `accent-[#0075FF]`.
  6. Fila de acciones (`mt-5 flex gap-3`): `Publicar` (`Button primary`) + `Cancelar` (`Button secondary`).
- `Publicar` y `Cancelar` llaman ambos a `onClose()`. **No** persisten nada.

---

## Datos

- `src/types/index.ts`: `NewsItem` gana campo opcional `content?: string`. Sin otros cambios de contrato; adaptadores REST/Supabase intactos.
- `src/repositories/MockRepository.ts`: añadir `content` a los items existentes (`news-1`, `news-2`) con texto de ejemplo coherente (2–4 frases), para poder ver el estado expandido.

---

## Estilo / tokens

`tailwind.config.js` — extender `colors` con:

```js
news: {
  card: '#F7F6FC',
  border: '#EEE3F6',
},
```

Uso: `bg-news-card`, `border-news-border`. (Nota: Tailwind mapea `news.card` → `bg-news-card` y `news.border` → `border-news-border`.)

---

## Comportamiento / interacción

- "+" abre/cierra el formulario inline (toggle). Con el form abierto, `Cancelar` o `Publicar` lo cierran.
- Cada `NewsCard` expande/colapsa de forma independiente.
- Ninguna acción realiza navegación real ni mutación de datos.

---

## Testing

Siguiendo la convención del repo (tests ligeros de render/interacción con Testing Library):

- `NewsFeed.test.tsx`: (1) el "+" muestra/oculta el formulario; (2) renderiza una card por item.
- `NewsCard.test.tsx`: el chevron alterna el contenido expandido (aparece `content` + Editar/Eliminar).
- `NewsForm.test.tsx`: `Cancelar` invoca `onClose`; los campos son editables.

No se testea persistencia (no existe).

---

## Fuera de alcance

- Persistencia real, validación de formulario, subida de adjuntos.
- Programación real de publicación / envío de emails / notificaciones.
- Edición o borrado real de novedades.
- Cambios en otros bloques del dashboard (espacios, eventos, recordatorios).
