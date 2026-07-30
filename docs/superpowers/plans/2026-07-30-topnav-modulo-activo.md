# TopNav — módulo activo, logo, iconos de acción y usuario · Plan de implementación

> **Para agentes de trabajo:** SUB-SKILL REQUERIDO: usa `superpowers:subagent-driven-development` o
> `superpowers:executing-plans` para ejecutar este plan tarea a tarea. Los pasos usan checkbox (`- [ ]`).

**Spec:** `docs/superpowers/specs/2026-07-30-topnav-modulo-activo-design.md` — léela entera antes de la Tarea 1.
**Rama:** `feature/topnav-modulo-activo`, base `main` = `2e0ac9a`.
**Evidencia:** `docs/references/barrido-2026-07-30/` (capturas del live del 2026-07-30).
**Baseline que hay que mantener en verde:** **252 ficheros / 998 tests** (`npx vitest run`, verificado
2026-07-30 09:51, 56 s).

Este plan es **autosuficiente**: todas las clases y valores del live están escritos aquí dentro. No hace
falta abrir ninguna captura salvo donde se indique explícitamente.

## Restricciones globales

- **TDD estricto**: un test que falla antes de cada implementación. Un commit por tarea, mensaje en es-ES.
- **Fidelidad al live por evidencia**, no por inferencia. Si algo no está en este plan ni en la spec, no se
  inventa: se anota como hueco y se reporta.
- es-ES. Target ES2020: **nada de `Array.prototype.at()`**. Lint `--max-warnings 0`, `tsc --noEmit` limpio.
- **Esta rama es la dueña de `src/components/layout/TopNav.tsx`.** No la comparte con nadie. Si otra rama
  lo toca, avisar al coordinador antes de seguir.
- **No** se crean pantallas nuevas. Los `href` de los iconos de acción apuntarán a rutas que aún no
  existen: **eso es correcto y está previsto** (DD2 de la spec). No añadir rutas al router.
- **No** se toca el panel de Ayuda (`HelpPanel.tsx`), ni el tablero de piezas, ni el grid del Home.
- **No** se añaden ficheros binarios (SVG/PNG de marca) al repo sin OK explícito de Arian (DD1).

---

## Tarea 0 — Punto de partida verificado

- [ ] `git switch -c feature/topnav-modulo-activo` desde `main` (`2e0ac9a`).
- [ ] `npx vitest run` → confirmar **252 ficheros / 998 tests** en verde. Pegar la salida en el informe.
- [ ] `npx tsc --noEmit` y el lint del repo → limpios.
- [ ] Guardar la lista de los tests que tocan la cabecera, que son los que van a moverse por diseño:
      `npx vitest run src/components/layout src/features/modules 2>&1 | tail -30`. Anotar cuántos son.
- [ ] Sin commit (tarea de verificación).

## Tarea 1 — `MODULES`: CRM antes de CRUDA

- [ ] En `src/lib/constants.test.ts`, añadir un test que asserte el **orden exacto** de los 12 `slug` de
      `MODULES`:
      `['conceptone','etra','produccion','euphoric','mixmag','tagmag','creativos','crm','cruda','personal','herramientas','configuracion']`.
      Debe **fallar** (hoy `cruda` va antes de `crm`).
- [ ] En `src/lib/constants.ts`, **intercambiar** el objeto de `crm` y el de `cruda` para que `crm` quede
      en 8.ª posición y `cruda` en 9.ª. **No cambiar ningún campo de los objetos** (ni `category`, ni
      `accent`, ni `shortDescription`).
- [ ] Verde. Comprobar que los tests del grid del Home siguen pasando **sin tocarlos**: el grid agrupa por
      `category`, así que su orden visible no cambia (CRUDA sigue en `workspace`, CRM en `management`).
      Si alguno falla, **parar**: significa que el grid depende del orden del array y eso hay que
      reportarlo, no parchearlo.
- [ ] Commit: `fix(nav): MODULES pone CRM antes de CRUDA, como el desplegable del live`.

## Tarea 2 — Centralizar el usuario mock y pasarlo a `test` / `admin`

Hoy `{ name: 'Test User', role: 'Admin' }` está duplicado en `src/repositories/MockRepository.ts` (×2) y
en un `const mockUser` por cada shell de `src/features/modules/` (+ `src/features/redaccion/RedaccionShell.tsx`).

- [ ] Test nuevo en `src/lib/constants.test.ts` (o un `src/lib/mock-user.test.ts`): la constante exportada
      tiene `name === 'test'` y `role === 'admin'`. Debe fallar (no existe).
- [ ] Crear la constante en `src/lib/constants.ts`:
      `export const MOCK_USER: User = { id: '1', email: 'test@blackmoose.es', name: 'test', role: 'admin' };`
      (el email del live es `test@blackmoose.es`).
- [ ] `grep -rn "Test User" src --include='*.tsx' --include='*.ts'` y sustituir **todos** los `mockUser`
      locales por `MOCK_USER` importado. Incluye `MockRepository.ts` (2 sitios), los 12 shells y
      `RedaccionShell.tsx`. **No debe quedar ninguna ocurrencia de `'Test User'` en `src/`.**
- [ ] Ajustar los tests que asserten el texto `Test User` o `TE` para que esperen `test` y `T`.
      Son los de la cabecera que anotaste en la Tarea 0.
- [ ] Verde. `grep -rn "Test User" src` debe salir vacío. Commit:
      `refactor(auth): centraliza el usuario mock y lo alinea con el live (test / admin)`.

## Tarea 3 — `Avatar`: tamaño `xs` e iniciales de una letra

Cambios **aditivos**: los defaults no se tocan, porque `Avatar` lo consumen las fichas de Team y el
organigrama, donde `TE` de dos letras sí es lo correcto.

- [ ] Test en `src/components/ui/Avatar.test.tsx` (créalo si no existe):
      1. `<Avatar fallback="test" size="xs" />` renderiza con las clases `h-8 w-8 text-[13px]`.
      2. `<Avatar fallback="Carlos Pego" initials={1} />` muestra `C`, no `CA`.
      3. **Regresión:** `<Avatar fallback="Carlos Pego" />` (sin props nuevas) sigue mostrando `CA` y
         `size="md"` sigue siendo `h-10 w-10 text-sm`.
      Los dos primeros deben fallar.
- [ ] Implementar en `src/components/ui/Avatar.tsx`:
      - añadir `xs: 'h-8 w-8 text-[13px]'` a `sizeClasses`, y `'xs'` al union de `size`;
      - añadir `initials?: 1 | 2` a `AvatarProps`, **default `2`**;
      - `const initials = fallback.slice(0, initialsProp).toUpperCase();`.
- [ ] Verde, incluida la regresión. Commit: `feat(ui): Avatar admite tamaño xs e iniciales de una letra`.

## Tarea 4 — `UserMenu`: enlace a `/perfil`, `T`, 32 px y los grises del live

- [ ] Test en `src/components/layout/UserMenu.test.tsx` (créalo si no existe), con `MemoryRouter`:
      1. es un **enlace** (`role="link"`) con `href="/perfil"`, no un `button`;
      2. el nombre se pinta con `text-sm font-medium text-slate-700`;
      3. el rol con `text-xs text-slate-400` y `capitalize`;
      4. el avatar muestra **una** letra.
      Debe fallar.
- [ ] Implementar en `src/components/layout/UserMenu.tsx`:
      - `<button>` → `<Link to="/perfil">`, **conservando** las clases
        `hidden items-center gap-3 rounded-lg px-2 py-1 hover:bg-slate-100 md:flex`;
      - nombre: `text-sm font-medium text-slate-900` → **`text-sm font-medium text-slate-700`**;
      - rol: `text-xs text-slate-500` → **`text-xs text-slate-400`** (el `capitalize` se queda);
      - `<Avatar … size="md" …>` → `size="xs"` + `initials={1}`. **`className="bg-slate-800"` se queda**
        (en el live el fondo es inline por persona, no un token: ver D7 de la spec).
- [ ] Verde. `/perfil` todavía no existe en el router: el enlace apuntará a la ruta de fallback. Es
      correcto en esta tarea.
- [ ] Commit: `feat(topnav): el bloque de usuario enlaza a /perfil con los valores del live`.

## Tarea 5 — `EspaciosDropdown`: etiqueta configurable, panel del live, sin iconos, con activo

- [ ] Test en `src/components/layout/EspaciosDropdown.test.tsx` (créalo si no existe), con `MemoryRouter`
      e `initialEntries={['/personal']}`:
      1. sin prop `label`, el botón dice `Espacios` (**regresión**);
      2. con `label="Team"`, el botón dice `Team`;
      3. al abrirlo, hay exactamente **12** enlaces, en este orden:
         `ConceptOne · Etra · Producción · Euphoric Media · Mixmag · TAGMAG · Creativos · CRM · CRUDA · Team · Herramientas · Configuración`;
      4. el panel tiene las clases
         `absolute left-0 z-50 mt-1 w-52 rounded-lg border border-slate-200 bg-white p-1 shadow-lg`;
      5. cada ítem tiene `block rounded-md px-3 py-1.5 text-sm hover:bg-slate-50`;
      6. el ítem cuyo `href` coincide con la ruta actual (`/personal`) lleva `font-semibold text-brand-700`
         y los otros `text-slate-700`;
      7. **ningún ítem contiene un `<svg>`.**
      Del 2 al 7 deben fallar.
- [ ] Implementar en `src/components/layout/EspaciosDropdown.tsx`:
      - `export function EspaciosDropdown({ label = 'Espacios' }: { label?: string })`; el botón pinta
        `{label}`;
      - quitar `opacity-70` del `<ChevronDown className="h-3.5 w-3.5">` (el live no lo tiene). **El resto
        de clases del botón no se toca**, ya coinciden con el live;
      - panel: `w-56 p-1.5 rounded-xl z-20` → `w-52 p-1 rounded-lg z-50`;
      - ítem: quitar el `<Icon>` y el `flex items-center gap-2.5`; pasar a
        `block rounded-md px-3 py-1.5 text-sm hover:bg-slate-50` + `text-slate-700`, o
        `font-semibold text-brand-700` si `useLocation().pathname` empieza por `/${m.slug}`
        (usar `matchPath` o comparación de prefijo; para `/personal` la ruta activa es `/personal*`);
      - **borrar el `import { MODULE_ICONS }`** de este fichero.
- [ ] `grep -rn "MODULE_ICONS" src` → **debe seguir usándose** en el grid del Home. Si el grep sale vacío,
      **parar y reportar**: significa que se ha quedado huérfano y hay que decidir, no borrarlo por
      iniciativa propia.
- [ ] Verde, incluida la regresión del punto 1. Commit:
      `feat(topnav): el desplegable acepta etiqueta y calca el panel del live`.

## Tarea 6 — `TopNav`: el módulo activo va en el desplegable y no se repite en el nav

- [ ] Test en `src/components/layout/TopNav.test.tsx` (amplíalo si existe):
      1. con `module={{ name: 'ConceptOne', … }}`, el botón del desplegable dice **`ConceptOne`**;
      2. sin `module`, dice **`Espacios`**;
      3. con `module={{ name: 'ConceptOne', nav: { areas: [...] } }}`, el texto `ConceptOne`
         aparece **exactamente una vez** en la cabecera (hoy sale dos: desplegable + nav);
      4. el `<nav>` de áreas **no** contiene un separador `/`.
      Del 1 al 4 deben fallar (1 y 2 fallan del todo, 3 y 4 por duplicado/separador).
- [ ] Implementar en `src/components/layout/TopNav.tsx`:
      - pasar `label={module?.name}` a `<EspaciosDropdown />`;
      - **eliminar** el bloque de las líneas ~59-68: el `<span className="mr-2 …">/</span>` y el
        `module.href ? <Link>{module.name}</Link> : <span>{module.name}</span>`;
      - el `<nav>` arranca directamente con `module.tabs` / `module.nav.areas`;
      - **conservar** el separador de fuera, entre logo y desplegable
        (`<span className="text-slate-300">/</span>`).
- [ ] Verde. Commit: `feat(topnav): el nombre del módulo vive solo en el desplegable`.
- [ ] Si tras esto **nadie** lee `ModuleHeader.href`: `grep -rn "href:" src/features/modules/`. Si está
      sin usar, eliminarlo del tipo y de los shells que lo pasan, en un commit aparte:
      `refactor(topnav): elimina ModuleHeader.href, sin consumidores`. Si sigue en uso, **dejarlo**.

## Tarea 7 — El logo: 20 px, sin wordmark

Ver **DD1** de la spec: **no se añaden los SVG del cliente al repo.** Se replica la forma.

- [ ] Test en `TopNav.test.tsx`:
      1. la cabecera **no** contiene el texto de `APP_NAME` como wordmark suelto;
      2. la marca del logo mide `h-5 w-5` y lleva `rounded-lg bg-slate-800 text-white text-[11px]`;
      3. el logo sigue siendo un enlace a `/`.
      1 y 2 deben fallar.
- [ ] Implementar en `TopNav.tsx` (líneas ~45-52):
      - la caja del logo pasa de `h-8 w-8 … text-sm` a **`h-5 w-5 … text-[11px]`**;
      - **eliminar** `<span className="text-lg font-semibold text-slate-900">{APP_NAME}</span>`;
      - el `<Link to="/">` y su `flex items-center gap-2.5` se conservan (el live usa `gap-2`; ajustar a
        `gap-2`).
- [ ] Verde. Commit: `feat(topnav): marca de 20px sin wordmark, como el live`.
- [ ] **Anotar como hueco en el informe final:** el live sirve `/logo_blackmoose.svg` en `/` y
      `/logo_antlers.svg` en el resto de rutas. Aquí se ha replicado la forma, no los assets.
      Preguntar a Arian si quiere los SVG reales.

## Tarea 8 — Los 14 iconos de acción, dentro del `<nav>`, a 16 px y sin estado activo

- [ ] Test en `TopNav.test.tsx`:
      1. dado `module={{ name:'ConceptOne', iconActions:[…4 items…] }}`, los 4 enlaces están **dentro del
         `<nav>`** de áreas (no en el grupo `ml-auto`) — asertar con
         `within(screen.getByRole('navigation', { name: /ConceptOne/ }))` o equivalente;
      2. cada uno tiene `title` **y** `aria-label` con el mismo texto;
      3. el envoltorio lleva
         `grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-800`;
      4. el icono es `h-4 w-4`;
      5. estando en la ruta del icono, **no** se le aplica ninguna clase de estado activo
         (ni `bg-slate-100`, ni `aria-current`).
      Todos deben fallar.
- [ ] Implementar en `TopNav.tsx` (líneas ~114-128):
      - **mover** el `.map` de `iconActions` desde el grupo `ml-auto` a dentro del `<nav>`, envuelto en un
        contenedor `ml-auto flex items-center gap-0.5` para que queden pegados al borde derecho del nav;
      - `NavLink` → `Link` (elimina el estado activo);
      - añadir `shrink-0` al envoltorio y `title={iconAction.label}` junto al `aria-label`;
      - el icono pasa de `h-5 w-5` a **`h-4 w-4`**.
- [ ] Verde. Commit: `feat(topnav): los iconos de acción viven dentro del nav, a 16px y sin estado activo`.

## Tarea 9 — Declarar los 14 iconos en los 8 shells

Iconos de lucide a usar: **Ajustes → `Settings`**, **Analítica → `BarChart3`**,
**Artistas → `UserRound`** (si no existe en nuestra versión de lucide, `User`),
**Incidencias → `AlertTriangle`**.

- [ ] Test en `src/features/modules/NewModuleShells.test.tsx` (ya existe) o uno por shell: para cada uno de
      los 8 módulos, los enlaces solo-icono del nav son exactamente los de esta tabla, con este
      `aria-label`. Debe fallar.

| Shell | `iconActions` (href · label) |
|---|---|
| `ConceptOneShell` | `/artistas` · `Artistas` — `/management/incidentes` · `Incidencias` — `/reporte` · `Analítica` — `/conceptone/ajustes` · `Ajustes` |
| `EuphoricShell` | `/euphoric/artistas` · `Artistas` — `/euphoric/ajustes` · `Ajustes` *(ya existen, verificar labels e iconos)* |
| `MixmagShell` | `/mixmag/analitica` · `Analítica` — `/mixmag/ajustes` · `Ajustes` |
| `TagmagShell` | `/tagmag/analitica` · `Analítica` — `/tagmag/ajustes` · `Ajustes` |
| `ProduccionShell` | `/produccion/ajustes` · `Ajustes` |
| `CrudaShell` | `/cruda/analitica` · `Analítica` *(ya existe; el label hoy es `Analítica`, verificar)* |
| `CRMShell` | `/crm/kpis` · `Analítica` |
| `TeamShell` (`/personal`) | `/personal/analitica` · `Analítica` |

- [ ] `EtraShell`, `CreativosShell`, `HerramientasShell` y `ConfigShell` **no llevan ninguno**. Añadir un
      test que lo asserte (negativo explícito): su nav no contiene enlaces sin nombre visible.
- [ ] Implementar. `MixmagShell` y `TagmagShell` comparten `RedaccionShell`: parametrizar por el prefijo
      del módulo, **no** duplicar la lista.
- [ ] Verde. Commit: `feat(nav): declara los 14 iconos de acción del live en los 8 módulos`.
- [ ] **Anotar en el informe final:** de esos 14 `href`, 11 apuntan a rutas que aún no existen. Es
      deliberado (DD2). Las crea `docs/superpowers/plans/2026-07-30-rutas-analitica-ajustes.md`.

## Tarea 10 — La fila de secciones sale del `<header>` y deja de ser sticky

Esta es la tarea con más riesgo de romper tests ajenos. Hacerla **al final** y sola.

- [ ] Correr **antes de tocar nada**: `npx vitest run src/components/layout src/features/modules src/app`
      y guardar la salida. Es la referencia para distinguir lo que se rompe por diseño de lo que se rompe
      por accidente.
- [ ] Test en `TopNav.test.tsx` (o `AppLayout.test.tsx`, donde encaje):
      1. el bloque de secciones **no** es descendiente del `<header>`;
      2. su envoltorio lleva `hidden border-b border-slate-200 bg-slate-50/70 md:block`;
      3. la fila interior lleva `mx-auto flex w-full max-w-7xl items-center gap-1 overflow-x-auto px-4 py-1.5`;
      4. la sección activa lleva `shrink-0 rounded-md px-3 py-1 text-sm font-medium bg-brand-600 text-white`
         y `aria-current="page"`;
      5. las inactivas llevan `shrink-0 rounded-md px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-200/70`;
      6. **no** queda ningún `bg-[#44444C]` en `src/` (`grep -rn "44444C" src` vacío: es literalmente
         `brand-600`).
      Todos deben fallar.
- [ ] Implementar: `TopNav` devuelve un fragmento con `<header>` seguido del bloque de secciones (o
      `AppLayout` lo renderiza; elegir lo que menos tests rompa, y decir en el commit cuál se eligió y por
      qué). Sustituir `border-t` por el envoltorio nuevo, `h-11` por `py-1.5`, `rounded-lg px-3 py-1.5`
      por `rounded-md px-3 py-1`, `bg-[#44444C]` por `bg-brand-600`, el hover por `hover:bg-slate-200/70`,
      y añadir `shrink-0` + `overflow-x-auto`.
- [ ] Verde. Los tests de ConceptOne y Euphoric·Negocio que asertaban la estructura vieja se **actualizan**
      (no se borran): siguen comprobando lo mismo, en la ubicación nueva.
- [ ] Commit: `feat(topnav): la barra de secciones sale del header sticky, como el live`.

## Tarea 11 — Cierre y verificación

- [ ] `npx vitest run` → **≥ 252 ficheros y ≥ 998 tests**, todo verde. Pegar la salida literal.
- [ ] `npx tsc --noEmit` → sin salida. Pegar el comando y el resultado.
- [ ] Lint con `--max-warnings 0` → limpio. Pegar la salida.
- [ ] `grep -rn "Test User\|44444C\|opacity-70" src` → vacío (o justificado línea a línea).
- [ ] Repasar la spec §3 «Qué NO entra» y confirmar que no se ha colado nada: ni pantallas nuevas, ni
      `/perfil`, ni `HelpPanel`, ni SVG binarios, ni cambios en el grid del Home.
- [ ] Abrir la PR sobre `main`. **Ojo:** `gh pr edit` está roto en este repo (peta con
      `GraphQL: Projects (classic) is being deprecated`). Para escribir el cuerpo:
      `gh api -X PATCH repos/Arian1192/intranet-boilerplate/pulls/<N> -F body=@cuerpo.md`.
- [ ] Reportar al coordinador: nº de PR, la salida de los tres comandos de verificación, y **la lista de
      huecos** (los SVG de marca de la Tarea 7 y las 11 rutas pendientes de la Tarea 9).
- [ ] **No fusionar.** Los merges los autoriza Arian a través del coordinador.

---

## Apéndice — valores del live, para copiar

```
BOTÓN DEL DESPLEGABLE (ya correcto, no tocar salvo el opacity-70 del chevron)
  flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-slate-600
  hover:bg-slate-100 hover:text-slate-900

PANEL DEL DESPLEGABLE
  absolute left-0 z-50 mt-1 w-52 rounded-lg border border-slate-200 bg-white p-1 shadow-lg
ÍTEM            block rounded-md px-3 py-1.5 text-sm hover:bg-slate-50 text-slate-700
ÍTEM ACTIVO     block rounded-md px-3 py-1.5 text-sm hover:bg-slate-50 font-semibold text-brand-700
                (brand-700 = #37373D, verificado contra nuestro tailwind.config)

ICONO DE ACCIÓN (envoltorio)
  grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors
  text-slate-500 hover:bg-slate-100 hover:text-slate-800
ICONO (svg)      16×16, stroke-width 1.8, shrink-0     → en React: h-4 w-4

BLOQUE DE SECCIONES (fuera del header)
  hidden border-b border-slate-200 bg-slate-50/70 md:block
FILA INTERIOR
  mx-auto flex w-full max-w-7xl items-center gap-1 overflow-x-auto px-4 py-1.5
SECCIÓN ACTIVA   shrink-0 rounded-md px-3 py-1 text-sm font-medium bg-brand-600 text-white  [aria-current=page]
SECCIÓN INACTIVA shrink-0 rounded-md px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-200/70

USUARIO
  enlace   hidden items-center gap-3 rounded-lg px-2 py-1 hover:bg-slate-100 md:flex   → href="/perfil"
  nombre   text-sm font-medium text-slate-700        (texto: "test")
  rol      text-xs capitalize text-slate-400         (texto: "admin")
  avatar   32×32, fuente 13px, UNA inicial ("T")

LOGO
  img del live: h-5 w-auto, alt="Black Moose Group"
  /  → /logo_blackmoose.svg     resto → /logo_antlers.svg
  (nosotros replicamos la forma, no los assets: ver DD1)
```
