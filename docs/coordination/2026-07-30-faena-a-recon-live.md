# Faena A — Recon del live 2026-07-30 + specs de la próxima ronda

**Ejecutor:** Claude en pane `wA:pC`. **Coordinador:** `wA:p5`.
**Reportas con:** `herdr agent prompt wA:p5 "FAENA A HITO: <mensaje>"`.
**Regla de oro:** el live es **SOLO LECTURA**. `bookings.conceptoneagency.com` — `test@blackmoose.es` / `Concept1234`.
Navega **por clic** dentro de la SPA (la URL directa rebota a Home).

## Por qué existe esta faena

`main` ya contiene TODOS los módulos y está verde (249 ficheros / 965 tests). El último barrido del live fue el
**2026-07-29** y el live **deriva a diario** (el 29-jul aparecieron de golpe ConceptOne v2, Mi-trabajo v2 y el
re-tema de marca a carbón). Sin un barrido fresco, la próxima ronda de trabajo es adivinación.

Tu salida **no es código de producción**: es **evidencia + un informe de deltas + los specs/planes** que el
coordinador repartirá después.

## Alcance

- **Trabaja en el repo principal** `/home/arian/dev/Boilerplate` sobre una rama nueva `docs/barrido-2026-07-30`.
  Solo añades ficheros bajo `docs/`. **No toques `src/`.**
- No hace falta worktree: no compites por ficheros con nadie.

## Plan

### Fase A0 — Acuse
Responde `RECIBIDO` + reformula la faena con tus palabras antes de tocar nada.

### Fase A1 — Preparar terreno
1. `git fetch && git switch -c docs/barrido-2026-07-30 origin/main`.
2. Crea `docs/references/barrido-2026-07-30/`.
3. Lee el barrido anterior para saber contra qué comparas: `docs/coordination/2026-07-29-cierre-brief.md`
   y la evidencia de `docs/references/` del 29-jul (busca con `ls docs/references/`).

### Fase A2 — Barrido read-only del live (el grueso)
Recorre **por clic** y captura evidencia (PNG + notas) de cada módulo, comparándolo contra lo que hay hoy en `main`:

`Home` · `ConceptOne` (áreas + secciones de Bookings) · `Euphoric` · `CRUDA` · `Creativos` · `CRM` ·
`Mixmag` · `TAGMAG` · `Incidencias` · `Herramientas` · `Team` (`/personal`) · `Configuración` ·
`Mi trabajo` (4 pestañas) · panel de **Ayuda** global.

En cada módulo busca específicamente:
- **Rutas/sub-navs nuevas o renombradas** (es el delta más frecuente y el más caro de detectar tarde).
- **Vistas nuevas** o vistas que cambiaron de forma (tabla → tarjetas, etc.).
- **Copy, etiquetas y cifras** que no cuadren con nuestro seed.
- **Color/tema**: el live re-tematizó `brand` a carbón el 29-jul; comprueba que no ha vuelto a moverse.
  Si sospechas de un color, **muestrea el PNG con PIL** — no lo estimes a ojo.

Guarda cada captura como `docs/references/barrido-2026-07-30/<modulo>-<vista>.png` y anota la hora de captura:
el live cambia cifras en horas, así que el calco se fija a **la foto**, no a "lo último que vi".

### Fase A3 — Follow-up (a): el dropdown del TopNav
Confirma o descarta el delta pendiente: en el live, ¿la barra superior usa el **nombre del módulo activo** como
dropdown, en vez de nuestro "Intranet / Espacios" (`src/components/layout/TopNav.tsx`)?
Captura el desplegable **abierto** en al menos dos módulos distintos y documenta qué lista exactamente.
Veredicto explícito: **delta real** (y entonces qué hay que cambiar) o **falsa alarma**.

### Fase A4 — Informe de deltas
Escribe `docs/coordination/2026-07-30-barrido-informe.md` con:
- Tabla `Módulo | Estado (sin cambios / 🟡 menor / 🔴 estructural) | Delta | Evidencia`.
- Para cada delta: qué hay en el live, qué tenemos nosotros, y **ficheros nuestros afectados**.
- Un cierre con la **prioridad recomendada** y una estimación gruesa (S/M/L) por delta.

### Fase A5 — Specs y planes de lo que salga
Para **cada delta 🔴 o 🟡 relevante**, escribe el par de documentos que usa este repo:
- Spec de diseño en `docs/superpowers/specs/2026-07-30-<slug>-design.md` — qué es, cómo se ve, qué datos, qué NO entra.
- Plan de ejecución en `docs/superpowers/plans/2026-07-30-<slug>.md` — tareas numeradas, cada una con su
  verificación (test que debe pasar), en orden ejecutable por otro agente sin más contexto.
Si un delta es trivial (< 30 min), no le hagas spec: mételo en una sección "Arreglos sueltos" del informe.

### Fase A6 — Entrega
1. Commit y push de la rama `docs/barrido-2026-07-30`.
2. `gh pr create --base main` (título: `docs: barrido del live 2026-07-30 + specs de la siguiente ronda`).
3. Reporta al coordinador: nº de PR, tabla-resumen de deltas y tu recomendación de prioridad.
   **No fusiones.**

## Reglas
- Reporta al cerrar **cada fase** (A2 puede reportar por bloques de módulos si es larga) y quédate `idle`.
- Si el live pide una acción que **escribe** (guardar, borrar, enviar), **no la hagas** — documenta que existe y sigue.
- Si algo no cuadra con el barrido del 29-jul, dilo aunque parezca menor: los 🔴 de esa fecha empezaron como "un tab raro".
- Si te bloqueas > 15 min en algo, reporta `FAENA A BLOQUEO:` en vez de insistir.
