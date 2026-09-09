# Faena 3 · Fase F — La ficha de artista de Insights

**Ejecutor:** pane nuevo. **Coordinador:** `wA:p5`.
**Spec:** `/home/arian/dev/Boilerplate/docs/superpowers/specs/2026-09-09-conceptone-v3-design.md`
— **§3.2** (la ruta 15 y la regla de sólo-lectura afinada) y **§5** (fila F).
**Rama:** `feature/conceptone-v3-insights-ficha`, salida de `main` (`e899d3f`).
**Worktree:** `~/dev/worktrees/Boilerplate/c1-ficha` — nuevo, con `node_modules` enlazado.

## Qué es

`/management/insights/:artistaId`. Se llega pulsando una fila de `/management/insights`, cuyo pie lo
anuncia literal: «Pulsa un artista para su ficha completa». **La ruta ya existe en `router.tsx`
apuntando a un stub** (`src/features/booking/pages/management/InsightsArtistaPage.tsx`, un `h1` y la
flecha de volver). Tú sustituyes el cuerpo. **No toques `router.tsx`**, ni `nav.ts`, ni `shell/`, ni
`apx.css`: siguen congelados. Y **no toques `src/styles/index.css`** sin pedírmelo: la Faena 2 le está
añadiendo la base de `.btn-secondary` ahora mismo y es el fichero donde chocaríais.

Es **talla L**: la pantalla más grande de la ronda. Ve por partes y reporta al cerrar cada una.

## Lo que ya está medido

`docs/references/conceptone-v3-2026-09-09/f2-management--insights--d371328b-a849-40ce-9320-dee3af5c017c.{txt,main.html,png}`
(capturado 2026-09-09T08:35 UTC, artista **Janse**). Trae el DOM del `<main>` sin truncar y 218 líneas
de `innerText`. De ahí sale ya:

- **Cabecera:** flecha de volver, nombre, chip de estado (`En declive`), `Songstats · actualizado
  2/9/2026` y botón `Sincronizar`.
- **12 pestañas:** `Overview`, `Audiencia`, `Spotify`, `Beatport`, `Shazam`, `YouTube`, `TikTok`,
  `Instagram`, `SoundCloud`, `Deezer`, `Tidal`, `Traxsource`.
- **9 KPI:** `OYENTES SPOTIFY` 137.1K · `FOLLOWERS SPOTIFY` 289 · `STREAMS` 9.7M · `POPULARIDAD` 41 ·
  `PLAYLIST REACH` 2M · `CHARTS` 0 · `YOUTUBE SUBS` 3 · `INSTAGRAM` 4K · `TIKTOK` 0.
- **`TOP TRACKS`** con tres ordenaciones (`Streams`, `Popularidad`, `Playlist reach`) y 8 pistas.
- **`HITOS RECIENTES`** — que el spec **no menciona**: mídelo y dilo en la PR.

**Ese volcado es sólo la pestaña `Overview`.** Las otras once existen en el DOM sólo al pulsarlas, igual
que pasó con `.dd-menu` y `.dp-pop`.

## Lo que tienes que capturar tú

1. **Las 11 pestañas restantes.** Pulsar una pestaña es **navegación, no escritura**: permitido. De cada
   una, `innerText` y DOM del `<main>` **sin truncar**, más PNG `fullPage` a `deviceScaleFactor: 2`.
   Prefijo `f3-`, **hora anotada en la primera línea** de cada volcado.
2. **Las tres ordenaciones de `TOP TRACKS`.** Son conmutadores de vista, no formularios: permitido.
3. **Un segundo artista, como mínimo.** Con uno solo no sabes qué es dato y qué es plantilla: no sabrás
   si «En declive» es un chip de cinco estados o una cadena, ni qué pasa cuando un KPI viene a cero o
   una pestaña viene vacía. **Los estados vacíos son parte del calco.**
4. **Cómo se comporta `Sincronizar`.** **NO lo pulses**: es un botón de acción sobre un servicio externo.
   Calca su aspecto y déjalo inerte, como hacemos con los exports.

## Reglas de sólo lectura (§3.2 del spec)

- **Sonda pasiva primero:** `getComputedStyle` sobre lo que cuelga de `main` para localizar el elemento
  exacto antes de pulsar nada.
- **Permitido:** navegar, pulsar pestañas y conmutadores de vista, abrir un modal de un registro que ya
  existe.
- **Nunca:** teclear en un campo, guardar, `Sincronizar`, botones de cambio de estado ni aspas de
  borrado. **Y no abras formularios de alta (`+ Nuevo…`)**: el servidor podría crear un borrador.
- **Instrumenta antes de asumir.** El método de la casa: listener de red **antes** de pulsar algo que no
  sea un enlace, y comprobar que el valor no cambia. Si sale una petición que no esperabas, **para y
  pregunta**.
- **Si dudas, preguntas ANTES, no después.**

## Lo que ya sabemos y no hay que redescubrir

- **`brand-*` se escribe tal cual.** Dentro de `.apx` el violeta lo pone `apx.css`. Hardcodearlo rompe
  el modo oscuro.
- **Los literales del live mandan sobre los correctos.** Medido: el live escribe «1 artistas del roster»
  sin declinar. Si algo está mal escrito, se calca y se blinda con un test.
- **Los contadores no son uniformes:** en `/management/{campanas,activaciones,content,roster}` cuentan
  **lo filtrado**; en `/management/insights` cuentan el conjunto. **No lo supongas aquí: mídelo.**
- **`ApxDd`** (`src/features/booking/components/ApxDd.tsx`) es el desplegable compartido, importado por
  ruta directa. Si te hace falta uno, reutilízalo. Pero los modales de Management usan **`select`
  nativo**: mira qué usa tu pantalla antes de elegir.
- **Una pantalla = un fichero de página + un fichero de datos propio.** Sin ampliar barrels.
- **Las cifras del live se mueven a diario.** Fija las de tu captura y dilo en la PR.

## Reglas de la ronda

1. **Acuse primero:** `RECIBIDO` + reformulación con tus palabras.
2. **Reporta** con `herdr agent prompt wA:p5 "FAENA 3 <HITO|PREGUNTA|BLOQUEO>: <mensaje>"` al cerrar cada
   bloque, y deja el pane `idle`.
3. **Nada se fusiona a `main` sin OK explícito** de Arian a través del coordinador. Pushea y avísame: la
   PR la abro yo.
4. **Verificación:** `npm test`, `npx tsc --noEmit`, `npm run lint` pegados en el reporte.
   Baseline de `main`: **266 ficheros / 1174 tests**.
