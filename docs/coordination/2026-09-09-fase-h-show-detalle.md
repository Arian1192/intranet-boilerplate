# Fase H — El detalle del show

**Ejecutor:** pane `wA:pC`. **Coordinador:** `wA:p5`.
**Spec:** `/home/arian/dev/Boilerplate/docs/superpowers/specs/2026-09-09-conceptone-v3-design.md`.
**Rama:** `feature/conceptone-v3-show-detalle`, salida de `main` (`e899d3f`).
**Worktree:** `~/dev/worktrees/Boilerplate/c1-management` — el mismo, ya puesto en la rama por el coordinador.

## Por qué esta pantalla y por qué ahora

Es **la que más cosas desbloquea de toda la ronda**. Hoy `/shows/:showId` es el stub que registraste tú:

- las **243 filas de `/liquidaciones`** están inertes, y su comentario dice literal «hasta que exista esa
  pantalla»;
- `TourDetallePage` enlaza aquí **tres veces por gira**;
- y tu propia `srow` de `/shows` ya navega.

Las tres se arreglan solas el día que exista el cuerpo. Ninguna necesita que las toques.

## Lo que ya mediste, y de dónde partes

Tu evidencia `f2f-shows-detalle.{txt,png}`: el `h1` es **el nombre del propio show**
(«Milan Torne @ House of Ferns», no un título genérico), el enlace de vuelta dice «← Volver a la lista», y
el cuerpo trae **paginador `Shows filtrados 1/87` con flechas**, **conmutador de estado con los seis
segmentos**, **tareas**, **incidencias** y **bloque de dinero**.

Eso es un inventario, no un calco. **Tu primer bloque es capturar la pantalla a fondo**, con prefijo
`f2h-` y la hora anotada: DOM del `<main>` sin truncar, `innerText`, PNG `fullPage` a
`deviceScaleFactor: 2`, y **varios shows distintos** — al menos uno por fase, porque el conmutador de
segmentos y el bloque de dinero cambian con ella. Los estados vacíos son parte del calco.

## La regla de sólo lectura, con un aviso que va en serio

**El conmutador de los seis segmentos es un control de CAMBIO DE ESTADO sobre un show real de la agencia.
NO LO PULSES.** Ni para ver qué hace, ni «sólo el primero». Calca su marcado desde el DOM y déjalo
funcionando sobre nuestros datos, no sobre los suyos. Lo mismo con cualquier botón de tareas o incidencias
que escriba.

**Sí puedes:** navegar, usar el **paginador** (es navegación entre shows), y abrir el modal de un registro
que ya existe. Recuerda que `rpc/show_alertas` sale por POST al abrir el detalle: es una **lectura**, no un
incidente — compara contra la carga limpia de la ruta, no contra cero.

**Si dudas, preguntas ANTES.** Ya lo has hecho bien tres veces hoy.

## Lo que ya sabes y no hay que redescubrir

- **`apxlist` la mediste tú** y está en `apx.css` desde tu lote 1. Si el detalle usa esa capa, reutilízala.
  Y aplica **tu propia comprobación**: extrae las clases del volcado, filtra las utilidades Tailwind y cruza
  el resto contra `apx.css`. Si falta algo, **pídemelo** — `apx.css` vuelve a estar congelado ahora que
  cerraste la ampliación.
- **`router.tsx` está congelado otra vez.** La ruta ya está registrada: sustituyes el cuerpo del stub y nada
  más.
- **El track de seis segmentos:** en el live es dato real por show; nosotros pintamos la **moda medida** de
  cada fase (`trackShow.ts`). El detalle tiene que ser **coherente con la fila**: si la fila y el detalle
  dijeran cosas distintas del mismo show, sería peor que la aproximación. Reutiliza esa tabla, no escribas
  una segunda.
- **Nuestros 14 shows contra los 87 del live.** El paginador dirá `1/14`, no `1/87`. Decláralo en la PR.
  **Y ojo:** Arian ha decidido que el volumen del live SÍ se va a traer, en una tarea aparte y posterior.
  Así que **no cablees el 14 en ningún sitio**: que salga del dato, para que ese trabajo no tenga que
  deshacer el tuyo.
- **`MOSTRAR_FOTOS`** y las iniciales, igual que en la fila: nada de hotlinkear `i.scdn.co`.

## Reglas

1. **Acuse primero:** `RECIBIDO` + reformulación con tus palabras.
2. **Reporta** con `herdr agent prompt wA:p5 "FAENA 2 <HITO|PREGUNTA|BLOQUEO>: <mensaje>"` al cerrar cada
   bloque, y deja el pane `idle`.
3. **Nada se fusiona a `main` sin OK explícito** de Arian a través del coordinador. Pushea y avísame.
4. **Verificación:** `npm test`, `npx tsc --noEmit`, `npm run lint` pegados en el reporte.
   Baseline de `main`: **266 ficheros / 1174 tests**.
