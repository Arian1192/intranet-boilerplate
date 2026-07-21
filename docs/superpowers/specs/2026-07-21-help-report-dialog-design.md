# Panel Ayuda — Modal "Reportar con captura" · Design

**Fecha:** 2026-07-21
**Rama objetivo:** `feature/home-v2` (continúa la fase Home v2)
**Tipo:** Calco **100% fiel** al live (pixel-perfect). Presentacional con interactividad local (sin backend de Incidencias, que es fase posterior).

---

## 1. Contexto y objetivo

En la fase Home v2 se creó el `HelpPanel` global (abajo-izquierda) con el botón **"Reportar con captura"** inerte. Este mini-incremento lo hace funcional: al pulsarlo se abre el modal **"Reportar"** del live.

Hecho clave verificado en el live (login demo, Playwright): **el modal se ancla en el MISMO sitio que el panel Ayuda** (abajo-izquierda, `fixed bottom-4 left-4`, ~480px de ancho), NO centrado, y **atenúa la página con un backdrop**. Por tanto NO se usa el `Modal` centrado existente (`src/components/ui/Modal.tsx`).

Referencias: `docs/references/home-v2/live-reportar-modal.png` (modal abierto) + `live-reportar-computed.json` (tokens computados). Capturas del usuario confirman las dos pestañas ("Algo falla" / "Una idea") con placeholders distintos.

### Criterios de éxito
- Al pulsar "Reportar con captura" en el `HelpPanel`, el panel se reemplaza in situ (abajo-izq) por el modal "Reportar" con backdrop atenuando el resto.
- Toggle "Algo falla" | "Una idea" funcional: cambia el placeholder del textarea.
- Textarea con estado local; "Enviar" deshabilitado si está vacío, habilitado con texto.
- "Enviar" (con texto) → cierra el modal y muestra un **toast** efímero de confirmación; sin persistir nada.
- "Cancelar" o clic en el backdrop → vuelve al `HelpPanel` normal.
- "Añadir captura" inerte (la captura real es API de navegador/backend, fuera de alcance).
- Tokens exactos del §3. Verde total (tests, lint 0, tsc). Verificación Playwright ours↔live.

---

## 2. Arquitectura

- **`HelpPanel`** (`src/components/layout/HelpPanel.tsx`) gana un estado de vista. Estados relevantes:
  - `open` (ya existe): panel visible vs launcher redondo.
  - `reporting: boolean` (nuevo): cuando `true`, en vez del panel se renderiza `<ReportDialog>`.
  - `sent: boolean` (nuevo): cuando `true`, muestra el toast efímero; se auto-desactiva a los ~3 s con `setTimeout`.
  - "Reportar con captura" → `setReporting(true)`. `ReportDialog.onCancel` → `setReporting(false)`. `ReportDialog.onSend` → `setReporting(false)` + `setSent(true)`.
- **`ReportDialog`** (nuevo, `src/components/layout/ReportDialog.tsx`): componente presentacional autocontenido con estado local (pestaña activa + texto). Props: `{ onCancel: () => void; onSend: () => void }`. Renderiza el backdrop + la card anclada abajo-izq. `onSend` solo se invoca si hay texto.
- **Toast**: elemento fijo mínimo (sin librería) renderizado por `HelpPanel` cuando `sent`. Texto: "Gracias, hemos recibido tu incidencia." Auto-descarte con `setTimeout(…, 3000)` limpiado en cleanup.

Decisión: `ReportDialog` es un componente propio (no un modo dentro de HelpPanel) para mantener cada archivo con una responsabilidad y poder testearlo aislado. HelpPanel solo orquesta el estado y el toast.

---

## 3. Tokens exactos del live (pixel-perfect)

Medidos con `getComputedStyle` (viewport 1440×900, deviceScaleFactor 2).

### Backdrop + card
- Backdrop: overlay `fixed inset-0 z-40 bg-slate-900/40` (atenúa la página; clic cierra). La card va por encima (`z-50`).
- Card: `fixed bottom-4 left-4 w-[480px] rounded-xl bg-white p-5 shadow-2xl` (medido: white, radius 12px, shadow `0 25px 50px -12px rgba(0,0,0,.25)` = `shadow-2xl`, ancho 480px).

### Header (fila)
- Título "Reportar": `text-sm font-semibold text-slate-800` (14px / 600 / #1e293b).
- **Segmented control** (derecha): contenedor `inline-flex items-center` **sin fondo** (track transparente, medido). Cada opción `rounded-md px-2 py-0.5 text-xs font-medium`:
  - Activa: `bg-slate-100 text-slate-800` (medido: `bg #f1f5f9`, texto `#1e293b`, 12px/500, radius 6px, padding `2px 8px`). Solo la pestaña activa lleva fondo.
  - Inactiva: `text-slate-400` (transparente, #94a3b8).

### Textarea
- `w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400`, ~5 filas (`rows={5}`), `resize-none`, foco `focus:outline-none focus:ring-2 focus:ring-slate-200`.
- Placeholder por pestaña: **Algo falla** → "Qué esperabas que pasara y qué ha pasado…"; **Una idea** → "Qué se podría hacer mejor…".

### Zona adjuntar (inerte)
- `mt-3 rounded-lg border border-dashed border-slate-300 py-2.5 text-center text-sm` (medido: dashed #cbd5e1, radius 8px, padding `10px 0`).
- Texto: "**Añadir captura**" (`font-medium text-slate-600`) + " · o pega una con ⌘V" (`text-slate-400`).

### Ayuda
- `mt-3 text-[11px] text-slate-400` (medido: 11px / #94a3b8): "Se adjuntan solos la página, el navegador, el tamaño de ventana y los últimos errores."

### Footer
- `mt-4 flex items-center justify-end gap-2`.
- "Cancelar": `rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100` (medido: transparente, texto #475569).
- "Enviar": `rounded-lg px-3 py-2 text-sm font-medium text-white` con `bg-slate-800 hover:bg-slate-900` habilitado / `bg-slate-200 text-slate-400 cursor-not-allowed` deshabilitado (medido habilitado: #1e293b, texto blanco, radius 8px).

### Toast
- `fixed bottom-4 left-4 z-50 rounded-lg bg-slate-800 px-4 py-2.5 text-sm text-white shadow-lg` (mismo anclaje que el panel; presentacional, no hay medida del live para esto → se sigue la colorimetría fiel slate). Texto: "Gracias, hemos recibido tu incidencia."

---

## 4. Interactividad (estado local, sin backend)

- `ReportDialog` estado local: `tab: 'bug' | 'idea'` (default `'bug'` = "Algo falla"), `text: string`.
- Toggle actualiza `tab` → cambia placeholder. Textarea controla `text`.
- "Enviar": `disabled={text.trim() === ''}`. Con texto, `onClick` llama `onSend()` (que en HelpPanel cierra el modal y dispara el toast). No se persiste ni se limpia estado global.
- "Añadir captura": `type="button"` sin `onClick` (inerte).
- "Cancelar" y backdrop: `onCancel()`.
- Toast: HelpPanel `useEffect`/`setTimeout(3000)` para ocultar; limpiar el timeout en cleanup para evitar fugas.

---

## 5. Archivos afectados

| Archivo | Cambio |
|---|---|
| `src/components/layout/ReportDialog.tsx` | **Nuevo** — backdrop + card abajo-izq, toggle, textarea, adjuntar (inerte), ayuda, footer. Props `{ onCancel, onSend }`. |
| `src/components/layout/HelpPanel.tsx` | Estado `reporting`/`sent`; "Reportar con captura" abre `ReportDialog`; render del toast efímero. |
| `src/components/layout/index.ts` | Export de `ReportDialog`. |
| `src/components/layout/ReportDialog.test.tsx` | **Nuevo** — tests (ver §6). |
| `src/components/layout/HelpPanel.test.tsx` | Ampliar: abrir Reportar, Enviar dispara toast, Cancelar vuelve. |

---

## 6. Testing

- **`ReportDialog`** (Vitest + RTL + user-event):
  - Renderiza título "Reportar", ambas pestañas, textarea, "Añadir captura", texto de ayuda, "Cancelar" y "Enviar".
  - "Enviar" está `disabled` inicialmente (textarea vacío); al escribir se habilita.
  - Al pulsar "Una idea", el placeholder del textarea pasa a "Qué se podría hacer mejor…"; con "Algo falla" es "Qué esperabas que pasara y qué ha pasado…".
  - Con texto, click en "Enviar" invoca `onSend`; click en "Cancelar" invoca `onCancel`; click en el backdrop invoca `onCancel`.
  - "Añadir captura" no tiene handler que rompa (inerte).
- **`HelpPanel`** (ampliación):
  - "Reportar con captura" muestra el `ReportDialog` (título "Reportar") y oculta el panel.
  - Tras escribir y "Enviar": el modal desaparece y aparece el toast "Gracias, hemos recibido tu incidencia."
  - "Cancelar" vuelve al panel (input "Pregunta o cuenta qué falla…" visible de nuevo).
- Gate: `npm test` verde, `npm run lint` 0, `npx tsc --noEmit` limpio. Verificación Playwright ours↔live contra `live-reportar-modal.png`.

---

## 7. Deltas intencionales / fuera de alcance

- Sin backend: "Enviar" no crea ninguna incidencia real (no hay CREATE/EDIT/DELETE); solo toast de confirmación asumido.
- "Añadir captura" no captura pantalla (API de navegador/backend) — inerte.
- La bandeja `/incidencias` (que alimenta este reporte) es una fase posterior.
- El toast no tiene referencia medida en el live; se implementa con la colorimetría fiel slate.
