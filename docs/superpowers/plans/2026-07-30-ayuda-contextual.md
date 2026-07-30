# Panel de Ayuda contextual · Plan de implementación

> **Para agentes de trabajo:** SUB-SKILL REQUERIDO: usa `superpowers:subagent-driven-development` o
> `superpowers:executing-plans` para ejecutar este plan tarea a tarea. Los pasos usan checkbox (`- [ ]`).

**Spec:** `docs/superpowers/specs/2026-07-30-ayuda-contextual-design.md` — **léela entera antes de la
Tarea 1**; los 20 textos literales de los consejos están en su tabla D2 y son la fuente para el seed.
**Rama:** `feature/ayuda-contextual`, base `main` = `4578550`.
**Evidencia:** `docs/references/barrido-2026-07-30/ayuda-contextual-inventario.json` (los 81 conjuntos
ruta→contenido, volcados del live) y `ayuda-{team-contextual,mixmag-campanas-3tips,generico}.html`.
**Baseline que hay que mantener en verde:** **249 ficheros / 965 tests** (verificado 2026-07-30 09:51).

## Restricciones globales

- **TDD estricto**: un test que falla antes de cada implementación. Un commit por tarea, mensaje en es-ES.
- **El copy va LITERAL.** Comillas angulares `«»`, `≠`, tildes y puntuación tal cual. Si un texto no cuadra
  con el spec, la fuente de verdad es `ayuda-contextual-inventario.json`; si tampoco cuadra, **parar y
  preguntar**, no improvisar.
- es-ES. Target ES2020: **nada de `Array.prototype.at()`**. Lint `--max-warnings 0`, `tsc --noEmit` limpio.
- **No tocar `TopNav.tsx`** (lo lleva `feature/topnav-modulo-activo`), ni el tablero de piezas, ni ninguna
  página de `src/features/`. Esta rama toca **solo** `HelpPanel.tsx`, `AppLayout.tsx` (si hace falta) y el
  fichero de datos nuevo.
- **No** se implementa el envío real ni el asistente de IA. El panel sigue inerte.
- `ReportDialog` **no se toca**.

---

## Tarea 0 — Punto de partida verificado

- [ ] `git switch -c feature/ayuda-contextual` desde `main` (`4578550`).
- [ ] `npx vitest run` → **249 ficheros / 965 tests** verde. Pegar la salida.
- [ ] `npx tsc --noEmit` y lint → limpios.
- [ ] Leer `src/components/layout/HelpPanel.tsx` entero y anotar qué tests lo cubren hoy:
      `npx vitest run src/components/layout 2>&1 | tail -20`.
- [ ] Sin commit.

## Tarea 1 — El resolutor de ayuda por ruta (datos + función, sin UI)

Primero la lógica pura, que es lo que tiene reglas. La UI viene después.

- [ ] Crear `src/components/layout/help-tips.test.ts` con estos casos. Todos deben fallar (no existe el
      módulo):

  **Estructura**
  1. `HELP_TIPS` tiene exactamente **14** entradas.
  2. Cada entrada tiene `match` (`{ path: string; exact?: boolean }`), `title` (nombre del módulo) y
     `tips` (array de `{ heading, body }`) no vacío.
  3. La suma de `tips` de las 14 entradas es **20**.
  4. `GENERIC_HELP` tiene `title === 'Ayuda'` y
     `body === 'Pregunta lo que quieras de esta pantalla, o cuenta qué está fallando.'`

  **Resolución — `resolveHelp(pathname)`**
  5. Coincidencia **exacta gana sobre prefijo**:
     - `resolveHelp('/mixmag/contenidos').tips[0].heading === 'Panel para leer, kanban para arrastrar'`
     - `resolveHelp('/mixmag/campanas').tips` tiene **3** elementos
     - `resolveHelp('/shows').tips` tiene **2** elementos y `title === 'ConceptOne'`
  6. **Prefijo** cuando no hay exacta:
     - `/mixmag`, `/mixmag/revistas`, `/mixmag/analitica`, `/mixmag/ajustes` → todas el consejo
       `Tarifas y packs viven en la tuerca` de Mixmag (1 tarjeta)
     - `/personal`, `/personal/calendario`, `/personal/fichas`, `/personal/analitica`,
       `/personal/usuarios` → todas `Los accesos se dan desde la ficha`
     - `/euphoric/negocio/pipeline` → `El arte se pide a Creativos` (prefijo `/euphoric`)
  7. **Mixmag y TAGMAG no comparten el cuerpo** aunque compartan el título:
     `resolveHelp('/mixmag').tips[0].heading === resolveHelp('/tagmag').tips[0].heading` **pero**
     `resolveHelp('/mixmag').tips[0].body !== resolveHelp('/tagmag').tips[0].body`, y el de TAGMAG
     contiene `'no los comparte con Mixmag'`.
  8. **Genérico** en las 31 rutas que le tocan. Como mínimo asertar estas, una por familia:
     `/`, `/etra`, `/etra/tareas`, `/etra/cuentas`, `/configuracion`, `/configuracion/uso`,
     `/configuracion/festivos`, `/herramientas`, `/herramientas/proyecciones`, `/incidencias`, `/perfil`,
     `/ofertas`, `/cobros`, `/gastos`, `/disponibilidad`, `/calendario-c1`, `/contactos`, `/artistas`,
     `/management/estrategias`, `/management/incidentes`, `/reporte`.
     → `resolveHelp(r).tips` vacío o ausente, y `title === 'Ayuda'`.
  9. **Negativo explícito de ConceptOne** (esto es lo más fácil de «arreglar» por error): `/shows` tiene
     ayuda propia, pero `/ofertas` y `/cobros` caen al **genérico**, no al consejo de `/conceptone`.
     Las rutas planas de Bookings **no** empiezan por `/conceptone`.
 10. `resolveHelp('/conceptone')` y `resolveHelp('/conceptone/ajustes')` dan el consejo
     `El panel de atención no es una lista de tareas`.
 11. Una ruta inventada bajo un prefijo cubierto hereda: `resolveHelp('/cruda/loquesea')` →
     `El stock se descuenta al confirmar el pedido`. (El live hace esto: se resuelve por `pathname`, no por
     el componente montado.)
 12. Una ruta inventada fuera de todo prefijo → genérico: `resolveHelp('/xyz')`.

- [ ] Crear `src/components/layout/help-tips.ts` con:
      - los tipos `HelpTip { heading: string; body: string }` y
        `HelpEntry { match: { path: string; exact?: boolean }; title: string; tips: HelpTip[] }`;
      - `export const HELP_TIPS: HelpEntry[]` con las **14 entradas** de la tabla D2 de la spec,
        **copiando los textos literalmente**;
      - `export const GENERIC_HELP = { title: 'Ayuda', body: 'Pregunta lo que quieras de esta pantalla, o cuenta qué está fallando.' }`;
      - `export function resolveHelp(pathname: string)`: busca primero una entrada con `exact: true` y
        `match.path === pathname`; si no, la entrada con `match.path` que sea prefijo de `pathname` y sea
        **la más larga**; si no, `GENERIC_HELP`.
      - Prefijo = `pathname === match.path || pathname.startsWith(match.path + '/')`. **No** usar
        `startsWith(match.path)` a secas: eso haría que `/personalizado` cayera en `/personal`.
- [ ] Entradas con `exact: true`: **cuatro, y solo cuatro** —
      `/shows`, `/mixmag/contenidos`, `/mixmag/campanas`, `/tagmag/contenidos`.
      Las otras diez son prefijos.
- [ ] ⚠️ **Trampa asimétrica, verificada en el live:** `/mixmag/campanas` **tiene** consejo propio (3
      tarjetas) pero `/tagmag/campanas` **no**: hereda el prefijo `/tagmag`. Y al revés,
      `/tagmag/contenidos` tiene el suyo igual que `/mixmag/contenidos`. Los dos módulos son gemelos en
      código pero **no** en ayuda. Añadir un test explícito:
      `resolveHelp('/tagmag/campanas').tips[0].heading === 'Tarifas y packs viven en la tuerca'`.
      No «simetrizar» esto: es lo que hace el live.
- [ ] Verde los 12 grupos de casos. Commit:
      `feat(ayuda): tabla de consejos por ruta y resolutor exacta>prefijo>genérico`.

## Tarea 2 — La carcasa del panel: tres zonas, con los valores del live

- [ ] Test en `src/components/layout/HelpPanel.test.tsx` (amplíalo si existe), con `MemoryRouter`:
      1. el contenedor lleva
         `fixed bottom-4 left-4 z-40 flex max-h-[70vh] w-[22rem] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl`;
      2. hay una cabecera con `flex shrink-0 items-center justify-between border-b border-slate-100 px-3 py-2`;
      3. el icono es un `<span>` con `flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white` y el texto `?`
         (**no** un `<svg>` de lucide);
      4. el cuerpo lleva `min-h-0 flex-1 overflow-y-auto px-3 py-2.5`;
      5. el pie lleva `shrink-0 border-t border-slate-100 p-2`;
      6. la entrada de texto es un **`<textarea>`** con `rows="1"`,
         `placeholder="Pregunta o cuenta qué falla…"` y
         `max-h-24 min-h-[34px] flex-1 resize-none rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs outline-none transition focus:border-slate-400`
         (**no** un `<input>`);
      7. `Reportar con captura` y `Mis avisos` llevan `text-[11px] text-slate-400 transition hover:text-slate-700`,
         dentro de `mt-1.5 flex items-center justify-between px-0.5`.
      Todos deben fallar.
- [ ] Implementar en `src/components/layout/HelpPanel.tsx`. Quitar el `import { HelpCircle }` si deja de
      usarse en la rama desplegada (el estado plegado sí lleva un icono: ver Tarea 5).
- [ ] Verde. Commit: `feat(ayuda): la carcasa del panel se ajusta al live (3 zonas, textarea)`.

## Tarea 3 — El contenido contextual dentro del panel

- [ ] Test en `HelpPanel.test.tsx`, montando con `MemoryRouter initialEntries={[...]}`:
      1. en `/personal`: la cabecera dice **`Team`** (no `Ayuda`), y hay **una** tarjeta cuyo
         `heading` es `Los accesos se dan desde la ficha` con
         `<p class="text-xs font-medium text-slate-700">` y cuyo `body` va en
         `<p class="mt-0.5 text-xs leading-relaxed text-slate-500">`;
      2. en `/mixmag/campanas`: la cabecera dice `Mixmag` y hay **tres** tarjetas, con los tres `heading`
         en orden: `La campaña ES el presupuesto`, `Vendida ≠ publicada`, `Los packs se despliegan`;
      3. en `/mi-trabajo`: cabecera `Mi trabajo`, **tres** tarjetas;
      4. en `/ofertas` (genérico): la cabecera dice **`Ayuda`**, **no hay ninguna tarjeta**, y el copy va en
         un único `<p class="py-1 text-xs text-slate-400">` con el texto
         `Pregunta lo que quieras de esta pantalla, o cuenta qué está fallando.`;
      5. el contenedor de tarjetas lleva `space-y-2.5`.
      Todos deben fallar.
- [ ] Implementar: `HelpPanel` llama a `resolveHelp(useLocation().pathname)` y pinta título + tarjetas, o
      el párrafo genérico.
- [ ] Verde. Commit: `feat(ayuda): el panel pinta el consejo contextual de cada pantalla`.

## Tarea 4 — Enviar arranca deshabilitado

- [ ] Test en `HelpPanel.test.tsx`:
      1. con el textarea vacío, el botón `Enviar` está **`disabled`**;
      2. lleva las clases
         `h-[34px] shrink-0 rounded-lg bg-slate-800 px-2.5 text-xs font-medium text-white transition hover:bg-slate-900 disabled:opacity-30`;
      3. al escribir texto se **habilita**;
      4. con solo espacios en blanco sigue **`disabled`**.
      Deben fallar.
- [ ] Implementar con estado local y `disabled={!texto.trim()}`. **No** se implementa el envío: al pulsar no
      pasa nada (el panel sigue inerte, igual que hoy).
- [ ] Verde. Commit: `feat(ayuda): Enviar deshabilitado mientras no hay texto`.

## Tarea 5 — El plegado sobrevive a la navegación

- [ ] Test en `HelpPanel.test.tsx`:
      1. el botón de plegar tiene `title="Plegar (se queda plegado mientras navegas)"` y un `aria-label`
         accesible, con clases `rounded p-1 text-slate-300 transition hover:bg-slate-100 hover:text-slate-600`;
      2. al pulsarlo el panel se pliega y queda el botón redondo flotante;
      3. **el caso que importa:** pulsar plegar, **desmontar** el componente (`unmount()`), volver a
         montarlo → sigue **plegado**. Sin el `unmount()` el test no prueba nada (ver Riesgos de la spec).
      4. al desplegar y volver a montar → sigue **desplegado**.
      5. estado inicial en una sesión limpia (`sessionStorage` vacío) → **desplegado**.
      Deben fallar (hoy `useState(true)` se reinicia).
- [ ] Implementar con `sessionStorage`, clave `help-panel-collapsed`. **`sessionStorage`, no
      `localStorage`** (DD3 de la spec). Leer de forma defensiva: si el acceso lanza (entornos sin
      storage), caer a desplegado sin romper.
- [ ] Limpiar `sessionStorage` en el `beforeEach` del fichero de test para no arrastrar estado entre casos.
- [ ] Verde. Commit: `feat(ayuda): el panel plegado se queda plegado al navegar`.

## Tarea 6 — Cierre y verificación

- [ ] Recuento contra el spec: `HELP_TIPS` tiene **14** entradas y **20** tarjetas en total. Si no cuadra,
      **parar**: falta o sobra copy.
- [ ] Repasar los 20 textos **carácter a carácter** contra la tabla D2 de la spec, prestando atención a
      `«»`, `≠`, `—` y las tildes. Este es el fallo más probable de toda la rama.
- [ ] `npx vitest run` → **≥ 249 ficheros y ≥ 965 tests**, verde. Pegar la salida literal.
- [ ] `npx tsc --noEmit` → sin salida. Pegar comando y resultado.
- [ ] Lint `--max-warnings 0` → limpio. Pegar la salida.
- [ ] `git diff --stat main` → confirmar que **solo** se han tocado `help-tips.ts`, `help-tips.test.ts`,
      `HelpPanel.tsx`, `HelpPanel.test.tsx` y como mucho `AppLayout.tsx`. Si aparece `TopNav.tsx` o algo de
      `src/features/`, es un error de alcance: **revertirlo**.
- [ ] Repasar la spec §3 «Qué NO entra»: ni envío real, ni asistente de IA, ni cambios en `ReportDialog`.
- [ ] PR sobre `main`. **`gh pr edit` está roto en este repo** (peta con
      `GraphQL: Projects (classic) is being deprecated`). Cuerpo con:
      `gh api -X PATCH repos/Arian1192/intranet-boilerplate/pulls/<N> -F body=@cuerpo.md`.
- [ ] Reportar al coordinador: nº de PR, salida de los tres comandos, y el recuento 14/20 confirmado.
- [ ] **No fusionar.**
