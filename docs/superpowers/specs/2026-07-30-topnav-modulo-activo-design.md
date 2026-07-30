# TopNav — el desplegable es el módulo activo, logo por ruta e iconos de acción · Design

**Rama sugerida:** `feature/topnav-modulo-activo` (base `main`, `2e0ac9a`) · **PR:** una sola al cierre.
**Ficheros:** `src/components/layout/{TopNav,EspaciosDropdown,UserMenu}.tsx`, `src/lib/constants.ts`,
`src/lib/icons.ts`, `src/components/ui/Avatar.tsx`, los 12 `*Shell.tsx` de `src/features/modules/`
(+ `RedaccionShell`), `src/features/booking/data/nav.ts`.
**Evidencia:** `docs/references/barrido-2026-07-30/` —
`topnav-dropdown-{conceptone,team,home}.{png,html,json}`, `logo-y-secciones.json`,
`icon-actions.json`, `colores-y-navs.json`, `home-landing.png`.
**Informe de origen:** `docs/coordination/2026-07-30-barrido-informe.md` §2.1, §2.3 y arreglos 1 y 4.

## 1. Por qué

Es el único delta que se ve en **todas** las pantallas, y además es el **cuello de botella** de la ronda:
las 11 rutas nuevas que el live tiene y nosotros no (`/reporte`, `/crm/kpis`, `/personal/analitica`,
`/mixmag/ajustes`…) **cuelgan de los iconos de esta cabecera**. Sin esto, esas pantallas no tendrían
por dónde entrarse.

El follow-up (a) que arrastrábamos sin resolver desde el 27-jul queda **confirmado como delta real**,
no falsa alarma.

## 2. Alcance

### D1 — La etiqueta del desplegable es el nombre del módulo activo

En el live el botón del desplegable rotula **el nombre del módulo activo**, y solo cae a `Espacios` en
las cuatro rutas que no pertenecen a ningún módulo: `/`, `/incidencias`, `/mi-trabajo`, `/perfil`.

Verificado abierto en tres rutas (`/conceptone` → `ConceptOne`, `/personal` → `Team`, `/` → `Espacios`).

El botón **ya tiene las clases correctas** y no se toca:
```
flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-slate-600
hover:bg-slate-100 hover:text-slate-900
```
El chevron del live es un SVG de 14×14 con `stroke-width="2.5"`; el nuestro es `<ChevronDown className="h-3.5 w-3.5 opacity-70">` (14 px). **Se deja el nuestro**: mismo tamaño renderizado y es el icono de la librería que ya usamos. El `opacity-70` sí se quita, el live no lo tiene.

`EspaciosDropdown` pasa a aceptar `label?: string` (default `'Espacios'`). Quien lo sabe es `TopNav`,
que ya recibe `module?: ModuleHeader` con `module.name`.

### D2 — El panel del desplegable: 12 módulos, plano, sin iconos, con activo

Marcado literal del live:
```html
<div class="absolute left-0 z-50 mt-1 w-52 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
  <a class="block rounded-md px-3 py-1.5 text-sm hover:bg-slate-50 text-slate-700" href="/conceptone">ConceptOne</a>
  …
  <a class="block rounded-md px-3 py-1.5 text-sm hover:bg-slate-50 font-semibold text-brand-700" href="/personal">Team</a>
</div>
```

| | Live | Nosotros hoy |
|---|---|---|
| Panel | `w-52 p-1 rounded-lg z-50` | `w-56 p-1.5 rounded-xl z-20` |
| Ítem | `block rounded-md px-3 py-1.5 text-sm text-slate-700` | `flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-slate-700` |
| Iconos | **no** | sí, `MODULE_ICONS` a `h-4 w-4 text-slate-500` |
| Ítem activo | `font-semibold text-brand-700` | no existe |

Se adoptan los valores del live en los cuatro. **Los iconos desaparecen del desplegable.**
`MODULE_ICONS` **no se borra**: lo consume el grid del Home (`src/features/dashboard/`) — comprobar con
`grep` antes de tocar nada.

El `<button>` invisible de cierre por clic-fuera (`fixed inset-0 z-10`) se conserva: es nuestro, el live
usa otro mecanismo y esto no se ve.

### D3 — `MODULES`: CRM antes de CRUDA

El desplegable del live lista **CRM en 8.ª posición y CRUDA en 9.ª**; nuestro `MODULES` los tiene al
revés. El grid del Home del live coincide con el nuestro (CRUDA en «Espacios de trabajo», CRM en
«Gestión interna») **porque el grid agrupa por `category`** y el desplegable renderiza el array plano.

→ Basta **intercambiar las dos entradas** en `src/lib/constants.ts`. El Home no se mueve.
`src/lib/constants.test.ts` fija longitud (12) y categorías, no el orden: verificar que sigue verde.

Orden final esperado del desplegable:
`ConceptOne · Etra · Producción · Euphoric Media · Mixmag · TAGMAG · Creativos · CRM · CRUDA · Team · Herramientas · Configuración`

### D4 — El nombre del módulo NO se repite en el nav

`TopNav.tsx:59-68` pinta `/ {module.name}` (como `<Link>` o `<span>`) antes de las áreas.
**En el live eso no existe**: el nombre del módulo vive **solo** en el desplegable, y el `<nav>` arranca
directamente con las áreas.

Se elimina ese bloque, y con él el separador `<span className="mr-2 …">/</span>` de dentro del nav.
El separador `/` que **sí** se queda es el de fuera, entre el logo y el desplegable
(`<span className="text-slate-300">/</span>`, ya lo tenemos y el live lo tiene igual).

`ModuleHeader.href` se queda en el tipo (lo usan los shells) pero deja de renderizarse aquí; si tras el
cambio ningún consumidor lo lee, se elimina del tipo y de los shells que lo pasan.

### D5 — El logo cambia por ruta

| Ruta | `src` del live |
|---|---|
| `/` (Home) | `/logo_blackmoose.svg` |
| **todas** las demás | `/logo_antlers.svg` |

Los dos con `class="h-5 w-auto"` y `alt="Black Moose Group"`. **El live no tiene wordmark de texto.**

Nosotros pintamos siempre `<div className="h-8 w-8 … rounded-lg bg-slate-800 …">{APP_NAME.charAt(0)}</div>`
más `<span>{APP_NAME}</span>`.

**Decisión de diseño (DD1):** este es un boilerplate, **no** puede depender de dos SVG de marca de un
cliente. Se replica la **forma** (una sola marca de 20 px de alto, sin texto al lado, que cambia entre
Home y módulo) sin copiar los assets:

- Se mantiene la caja `rounded-lg bg-slate-800 text-white` con la inicial de `APP_NAME`, pero a
  **`h-5 w-5`** con `text-[11px]` (el live mide 20 px de alto, nosotros 32).
- **Se elimina el `<span>{APP_NAME}</span>`** del TopNav: el live no lo tiene y es lo que más ruido mete.
- La variación Home/módulo se implementa como **una prop, no como dos imágenes**: en Home la caja usa
  `APP_NAME` completo si cabe en el ancho (`APP_SHORT_NAME` ya existe en `constants.ts` para esto), y en
  módulo la inicial. Si el ancho no da, la inicial en los dos casos y se anota como hueco.

Si Arian prefiere meter los dos SVG reales, es un cambio de un fichero sobre esta base. **Preguntar antes
de añadir binarios al repo.**

### D6 — Los 14 iconos de acción, dentro del `<nav>`

El live mete enlaces **solo-icono** dentro del propio `<nav>`, alineados a su borde derecho, en **8 de
los 12 módulos**:

| Módulo | `href` · `title`/`aria-label` |
|---|---|
| ConceptOne | `/artistas` Artistas · `/management/incidentes` Incidencias · `/reporte` Analítica · `/conceptone/ajustes` Ajustes |
| Euphoric | `/euphoric/artistas` Artistas · `/euphoric/ajustes` Ajustes |
| Mixmag | `/mixmag/analitica` Analítica · `/mixmag/ajustes` Ajustes |
| TAGMAG | `/tagmag/analitica` Analítica · `/tagmag/ajustes` Ajustes |
| Producción | `/produccion/ajustes` Ajustes |
| CRUDA | `/cruda/analitica` Analítica |
| CRM | `/crm/kpis` Analítica |
| Team | `/personal/analitica` Analítica |
| Etra · Creativos · Herramientas · Configuración | **ninguno** |

Envoltorio, idéntico en los 14:
```
grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors
text-slate-500 hover:bg-slate-100 hover:text-slate-800
```
SVG de **16×16**, `stroke-width="1.8"`, `class="shrink-0"`. **Sin estado activo**: solo `hover`.

| Icono | Equivalente lucide | Nota |
|---|---|---|
| Ajustes | `Settings` | trazado idéntico al de lucide |
| Analítica | `BarChart3` | el del live usa `<rect>`, lucide usa `<path>`; visualmente equivalente, **se usa el de lucide** |
| Artistas | `User` / `UserRound` | el del live es más ancho que `User`; se usa `UserRound` si existe en nuestra versión de lucide, si no `User` |
| Incidencias | `AlertTriangle` | equivalente |

Cambios frente a lo nuestro (`TopNav.tsx:114-128`):
1. Se **mueven** del grupo `ml-auto` a dentro del `<nav>`, empujados con `ml-auto` dentro del nav.
2. El icono baja de `h-5 w-5` (20 px) a **`h-4 w-4`** (16 px).
3. Se **quita el estado activo** (`isActive ? 'bg-slate-100 text-slate-800'`): `NavLink` → `Link`.
4. Se añade `shrink-0` al envoltorio.
5. Se añade `title` además de `aria-label` (el live tiene los dos, con el mismo texto).

`iconActions` sube de 3 iconos en 2 módulos a **14 en 8 módulos**. Los `href` que **aún no existen en
nuestro router** (todos menos `/cruda/analitica`, `/euphoric/artistas`, `/euphoric/ajustes`) apuntarán a
rutas sin definir hasta que se ejecute el plan de `2026-07-30-rutas-analitica-ajustes`. **Eso es
aceptable y está previsto**: nuestro router hace fallback, igual que el live. Lo que **no** se hace es
inventar las pantallas aquí.

### D7 — Usuario: `test`, inicial de una letra, 32 px, enlace a `/perfil`

| | Live | Nosotros |
|---|---|---|
| Nombre | `test` | `Test User` |
| Rol | `admin` + `capitalize` | `Admin` + `capitalize` |
| Inicial | `T` (**una**) | `TE` (`Avatar` hace `slice(0, 2)`) |
| Avatar | 32 px, fuente 13 px | `size="md"` = 40 px |
| Fondo | `background-color` **inline** por persona | `bg-slate-800` |
| Elemento | `<a href="/perfil">` | `<button>` sin destino |

Cambios:
1. **El seed pasa a `name: 'test'`, `role: 'admin'`.** Está duplicado en ~10 sitios
   (`MockRepository.ts` ×2 y un `mockUser` por shell): se extrae a **una** constante exportada y los
   shells la importan. Esto elimina la duplicación que hace que un cambio de seed toque 10 ficheros.
2. **`Avatar` gana `size="xs"` = `h-8 w-8 text-[13px]`** (32 px, la medida del live). Aditivo: los tamaños
   existentes no se tocan.
3. **`Avatar` gana `initials?: 1 | 2`** (default `2`, comportamiento actual). `UserMenu` pasa `1`.
   No se cambia el default: `Avatar` lo usan las fichas de Team y ahí `TE` sí es lo correcto.
4. `UserMenu` pasa de `<button>` a `<Link to="/perfil">`, conservando las clases
   (`hidden items-center gap-3 rounded-lg px-2 py-1 hover:bg-slate-100 md:flex`).
5. El nombre baja de `text-sm font-medium text-slate-900` a **`text-sm font-medium text-slate-700`** y el
   rol de `text-xs text-slate-500` a **`text-xs text-slate-400`** (valores del live).

**El fondo del avatar no se toca.** En el live es un `style` inline por persona (`rgb(79,70,229)` para
`test`) y los avatares del equipo son imágenes reales servidas desde Supabase Storage: es **color por
usuario, no un token de tema**. `bg-slate-800` se queda como default del boilerplate.

### D8 — La fila de secciones de ConceptOne no es sticky

En el live esa fila vive **fuera** del `<header>`:
```html
<div class="hidden border-b border-slate-200 bg-slate-50/70 md:block">
  <div class="mx-auto flex w-full max-w-7xl items-center gap-1 overflow-x-auto px-4 py-1.5"> … </div>
</div>
```
Como está fuera del header sticky, **se va con el scroll**. La nuestra está **dentro** del header
(`TopNav.tsx:145-176`) con `border-t` y sin fondo, así que se queda pegada.

| | Live | Nosotros |
|---|---|---|
| Ubicación | hermano posterior del `<header>` | dentro del `<header>` |
| Envoltorio | `hidden border-b border-slate-200 bg-slate-50/70 md:block` | `border-t border-slate-200` |
| Fila | `mx-auto flex w-full max-w-7xl items-center gap-1 overflow-x-auto px-4 py-1.5` | `mx-auto flex h-11 max-w-7xl items-center gap-1 px-4` |
| Pastilla activa | `shrink-0 rounded-md px-3 py-1 text-sm font-medium bg-brand-600 text-white` + `aria-current="page"` | `rounded-lg px-3 py-1.5 … bg-[#44444C] text-white` |
| Inactiva | `shrink-0 rounded-md px-3 py-1 … text-slate-600 hover:bg-slate-200/70` | `rounded-lg px-3 py-1.5 … text-slate-600 hover:bg-slate-100 hover:text-slate-900` |

Se adoptan los valores del live. Nótese que **`bg-[#44444C]` es exactamente `brand-600`**: se sustituye
por el token, que es lo que usa el live. Esto obliga a **sacar el bloque de secciones fuera del
`<header>`**, así que `TopNav` pasa a devolver un fragmento con `<header>` + el bloque de secciones, o
bien `AppLayout` renderiza el bloque. Elegir lo que menos rompa `AppLayout.test.tsx`.

## 3. Qué NO entra

- **Las 11 pantallas nuevas** de `/reporte`, `/crm/kpis`, etc. Aquí solo se añaden los **enlaces**.
  Van en `2026-07-30-rutas-analitica-ajustes`.
- **`/perfil`.** Aquí solo se añade el enlace del bloque de usuario. Va en
  `2026-07-30-perfil-y-sesiones`.
- **El panel de Ayuda.** Va en `2026-07-30-ayuda-contextual`.
- **Añadir los SVG de marca reales al repo** (ver DD1): requiere OK explícito de Arian.
- **Tocar `Badge`, `MODULE_ICONS` o los acentos de `MODULES`.** El grid del Home no se toca en absoluto.
- **El fondo del avatar** (D7): es color por usuario en el live, no un token.

## 4. Decisiones de diseño

- **DD1 — No copiamos los SVG del cliente.** Se replica la forma (marca de 20 px, sin wordmark, que varía
  entre Home y módulo) con la caja de inicial que ya tenemos. Un boilerplate no depende de la marca de un
  cliente. Preguntar antes de meter binarios.
- **DD2 — `iconActions` apuntará a rutas que aún no existen.** Es deliberado: el live hace lo mismo con su
  catch-all, y separar «cabecera» de «pantallas» permite paralelizar. Se documenta en el plan.
- **DD3 — `Avatar` se extiende, no se cambia.** `size="xs"` e `initials` son aditivos con default igual al
  comportamiento actual, porque `Avatar` lo consumen las fichas de Team y el organigrama.
- **DD4 — El seed de usuario se centraliza.** Cambiar `Test User` → `test` en 10 sitios a mano es la
  clase de duplicación que ya nos costó una ronda. Se extrae a una constante en el mismo cambio.
- **DD5 — El chevron y el cierre por clic-fuera se quedan como están.** No se ven y ya funcionan.

## 5. Riesgos

- **`TopNav.tsx` es el fichero más compartido del repo.** Cualquier otra rama que lo toque va a
  conflictar. Por eso el informe recomienda meter aquí también los arreglos sueltos de cabecera, y que
  esta rama **no** se solape con la del tablero de piezas ni con la de Ayuda.
- **Sacar el bloque de secciones fuera del `<header>`** cambia la estructura que asertan
  `AppLayout.test.tsx` y los tests de shells con `nav.sections` (ConceptOne y Euphoric·Negocio).
  Correr esos tests **antes** de tocar, para saber qué se rompe por diseño y qué por accidente.
- **El desplegable pierde los iconos**, que es visualmente llamativo. Está respaldado por el HTML literal
  del live (`topnav-dropdown-team.html`): no es una simplificación nuestra.
