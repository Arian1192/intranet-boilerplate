# `/perfil` — Mi perfil y Mis sesiones · Design

**Rama sugerida:** `feature/perfil-y-sesiones` (base `main`, `2e0ac9a`) · **PR:** una sola al cierre.
**Ficheros:** `src/features/perfil/` (nuevo), `src/app/router.tsx`.
**Depende de:** `feature/topnav-modulo-activo` sólo para el **enlace** (el bloque de usuario del TopNav pasa
a `<Link to="/perfil">`). Se puede desarrollar en paralelo; navegando a mano funciona igual.
**Evidencia:** `docs/references/barrido-2026-07-30/d-perfil.png` y el volcado de texto en
`out-d.json` (clave `/perfil`).
**Informe de origen:** `docs/coordination/2026-07-30-barrido-informe.md` §2.4.

## 1. Por qué

Es una **pantalla entera** que el live tiene y nosotros no. Es el destino del bloque de usuario de la
cabecera: en el live ese bloque es un `<a href="/perfil">`, y en cuanto se fusione el trabajo del TopNav
tendremos un enlace que lleva al fallback.

## 2. Alcance

Ruta `/perfil`. **Sin módulo**: el desplegable de la cabecera dice `Espacios` (no `Perfil`), no hay
`<nav>` de áreas ni barra de secciones, y el panel de Ayuda muestra el **genérico**. Es el mismo trato que
el live da a `/incidencias` y `/mi-trabajo`.

Dos tarjetas, en este orden.

### D1 — Tarjeta «Mi perfil»

- Título `Mi perfil` (es el `h1` de la pantalla).
- Bajada: `Tu avatar y los datos de tu cuenta.`
- Avatar grande con la inicial (`T` para el usuario `test`), el nombre (`test`) y el email
  (`test@blackmoose.es`).
- Dos acciones: `Editar perfil` y `Cambiar contraseña`.
- Bloque `IDIOMA · LANGUAGE` con dos opciones: `🇪🇸 Español` y `🇬🇧 English`, y debajo la nota
  `Se aplica pantalla a pantalla según vamos traduciendo la intranet.`
- Acción `Cerrar sesión`.

### D2 — Tarjeta «Mis sesiones»

- Título `Mis sesiones`.
- Bajada: `Dónde tienes la cuenta abierta ahora mismo.`
- Acción `Cerrar las demás`, alineada con el título.
- Lista de sesiones. Cada fila: navegador y sistema (`Chrome · Linux`, `Chrome · Mac`, `Chrome · Windows`,
  `Chrome · iPhone/iPad`), la IP, el estado `activa`, un `—`, y un botón `Cerrar`.
- **La sesión actual** se marca `Este dispositivo` y **no tiene botón `Cerrar`**. Es la primera de la lista.

En el live la lista es larguísima (más de 100 sesiones del usuario de pruebas, casi todas
`Chrome · Linux` con la misma IP). **Eso es ruido del entorno de pruebas, no diseño.**

**Decisión (DD1):** el seed lleva **8 sesiones** que cubren la variedad observada — la actual
(`Chrome · Linux`, `Este dispositivo`), tres `Chrome · Linux` con la misma IP, una `Chrome · Windows`, una
`Chrome · Mac` con IP distinta, una `Chrome · Mac` con otra IP, y una `Chrome · iPhone/iPad`. Suficiente
para ejercitar todos los casos de render sin copiar 100 filas idénticas.

## 3. Qué NO entra

- **Cualquier acción real.** `Editar perfil`, `Cambiar contraseña`, `Cerrar sesión`, `Cerrar las demás` y
  los `Cerrar` por fila se pintan **inertes**, como el resto de altas del boilerplate. En el live son
  acciones de escritura y el barrido fue solo-lectura: **no hay evidencia de qué hacen**.
- **Cambiar el idioma de verdad.** El selector es un control visual; no se conecta i18n. La propia nota del
  live («Se aplica pantalla a pantalla según vamos traduciendo la intranet») dice que allí tampoco está
  terminado.
- **Tocar `TopNav.tsx`.** El enlace lo pone `feature/topnav-modulo-activo`.
- **Copiar las 100+ sesiones** del entorno de pruebas (DD1).
- **Añadir un módulo `Perfil` a `MODULES`.** En el live `/perfil` no es un módulo: el desplegable dice
  `Espacios`. Añadirlo rompería el test de los 12 módulos y el grid del Home.

## 4. Decisiones de diseño

- **DD1 — 8 sesiones en el seed, no 100.** La lista larga del live es ruido del usuario de pruebas. Se
  cubren los cuatro tipos de dispositivo observados y los dos casos de render (con y sin botón `Cerrar`).
  Se anota en el seed por qué son 8.
- **DD2 — `/perfil` va sin módulo.** Sin `module` en `AppLayout`, igual que `MiTrabajoShell` e
  `IncidenciasShell`. Así el desplegable cae a `Espacios` y la Ayuda al genérico **sin código extra**, que
  es exactamente lo que hace el live.
- **DD3 — Todo inerte y explícito.** No hay evidencia del comportamiento de ninguna acción, así que no se
  inventa. Se anotan como huecos en el informe.
- **DD4 — Reutilizar `Avatar`.** Con `initials={1}` si esa prop ya existe (la añade
  `feature/topnav-modulo-activo`); si esa rama no está fusionada, usar `size="lg"` con el `fallback` que
  produzca `T` y anotar la dependencia.

## 5. Riesgos

- **Es la pantalla con menos evidencia dura de la ronda.** Tengo el volcado de texto completo y un PNG de
  página completa, pero **no** clases ni `getComputedStyle` de sus elementos. Antes de calcar el maquetado
  hay que hacer un **recon dirigido** (HTML completo sin truncar + `getComputedStyle` de tarjetas, botones y
  filas). Sin eso, esta pantalla se implementaría a ojo, que es justo lo que este repo no hace.
- **El `Avatar` con `initials`** depende de otra rama. Si se desarrolla antes, hay que apañarlo y anotarlo.
- **La lista de sesiones puede crecer sin control** si alguien decide calcar el live literalmente. DD1 está
  para evitarlo.
