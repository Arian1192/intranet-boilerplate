# `/perfil` — Mi perfil y Mis sesiones · Plan de implementación

> **Para agentes de trabajo:** SUB-SKILL REQUERIDO: usa `superpowers:subagent-driven-development` o
> `superpowers:executing-plans` para ejecutar este plan tarea a tarea. Los pasos usan checkbox (`- [ ]`).

**Spec:** `docs/superpowers/specs/2026-07-30-perfil-y-sesiones-design.md` — léela entera antes de la Tarea 1.
**Rama:** `feature/perfil-y-sesiones`, base `main` = `2e0ac9a`.
**Evidencia de partida:** `docs/references/barrido-2026-07-30/d-perfil.png` y el volcado de texto de
`/perfil`. **Es evidencia incompleta a propósito**: la Tarea 1 la completa.
**Baseline que hay que mantener en verde:** **252 ficheros / 998 tests** (verificado 2026-07-30 10:06).

## Restricciones globales

- **TDD estricto**: un test que falla antes de cada implementación. Un commit por tarea, mensaje en es-ES.
- **Todo inerte.** Ninguna acción de esta pantalla hace nada: `Editar perfil`, `Cambiar contraseña`,
  `Cerrar sesión`, `Cerrar las demás` y los `Cerrar` por fila. **No hay evidencia de qué hacen** (el barrido
  fue solo-lectura), así que no se inventa: se anotan como huecos.
- **No tocar `src/components/layout/TopNav.tsx`.** El enlace al perfil lo pone
  `feature/topnav-modulo-activo`.
- **No añadir un módulo `Perfil` a `MODULES`.** En el live `/perfil` no es un módulo (el desplegable dice
  `Espacios`); añadirlo rompería el test de los 12 módulos y el grid del Home.
- es-ES. Target ES2020: **nada de `Array.prototype.at()`**. Lint `--max-warnings 0`, `tsc --noEmit` limpio.

---

## Tarea 0 — Punto de partida verificado

- [ ] `git switch -c feature/perfil-y-sesiones` desde `main` (`2e0ac9a`).
- [ ] `npx vitest run` → **252 ficheros / 998 tests** verde. Pegar la salida.
- [ ] `npx tsc --noEmit` y lint → limpios.
- [ ] Sin commit.

## Tarea 1 — Recon dirigido (OBLIGATORIA, no saltar)

Esta es la pantalla con **menos evidencia dura** de la ronda: hay volcado de texto y un PNG de página
completa, pero **no** clases ni `getComputedStyle`. Sin este paso, la pantalla se implementaría a ojo.

- [ ] Login por Playwright en el live (solo lectura):
      `bookings.conceptoneagency.com`, `test@blackmoose.es` / `Concept1234`. La URL directa funciona; se
      llega también por clic en el bloque de usuario de la cabecera.
- [ ] Capturar, con el estándar de evidencia dura de este repo:
      1. `main.outerHTML` **completo, sin truncar**, a fichero. Si es grande, **trocearlo, no cortarlo**
         (el truncado a 20 000 caracteres ya nos costó una ronda entera).
      2. PNG de página completa **y** recortes a `deviceScaleFactor: 4` de: la cabecera de cada tarjeta, el
         bloque de idioma, una fila de sesión con `Cerrar` y la fila `Este dispositivo`.
      3. `getComputedStyle` de: títulos de tarjeta, bajadas, los botones (`Editar perfil`,
         `Cambiar contraseña`, `Cerrar sesión`, `Cerrar las demás`, `Cerrar`), las opciones de idioma, y una
         fila de sesión (fondo, borde, separador).
      4. Si sospechas de un color, **muéstrealo con PIL** sobre el PNG a 4×. Dos medidas independientes que
         coincidan al valor exacto = dato cerrado. No estimar a ojo.
- [ ] Contar cuántas sesiones distintas por **tipo de dispositivo** hay y anotar las IP distintas.
- [ ] Guardar todo en `docs/references/perfil/live-2026-XX-XX-*` con la **hora de captura** anotada.
- [ ] Escribir `docs/references/perfil/ours-vs-live.md` con la tabla de elementos → clase → valor computado.
- [ ] **Si algún dato no aparece en la captura, es un hueco**: se anota, no se rellena.
- [ ] Commit: `docs(perfil): recon dirigido de /perfil y Mis sesiones`.

## Tarea 2 — El seed de sesiones

- [ ] Test en `src/features/perfil/data/sesiones.test.ts`:
      1. hay **8** sesiones;
      2. **exactamente una** tiene `esteDispositivo: true`, y es **la primera**;
      3. están representados los cuatro tipos observados: `Chrome · Linux`, `Chrome · Windows`,
         `Chrome · Mac`, `Chrome · iPhone/iPad`;
      4. hay al menos **dos IP distintas** (en el live hay varias);
      5. todas tienen estado `activa`.
      Debe fallar.
- [ ] Crear el seed con **8 sesiones** y un comentario que explique **por qué 8**: el live tiene más de 100
      del usuario de pruebas, casi todas idénticas, y eso es ruido del entorno, no diseño (DD1 de la spec).
- [ ] Verde. Commit: `feat(perfil): seed de sesiones con la variedad del live`.

## Tarea 3 — Tarjeta «Mi perfil»

- [ ] Test en `src/features/perfil/pages/PerfilPage.test.tsx`:
      1. el `h1` es `Mi perfil`;
      2. la bajada es `Tu avatar y los datos de tu cuenta.`;
      3. se ven el nombre `test` y el email `test@blackmoose.es`;
      4. el avatar muestra **`T`** (una sola letra);
      5. existen los botones `Editar perfil` y `Cambiar contraseña`;
      6. existe el bloque `IDIOMA · LANGUAGE` con las opciones `🇪🇸 Español` y `🇬🇧 English` y la nota
         `Se aplica pantalla a pantalla según vamos traduciendo la intranet.`;
      7. existe el botón `Cerrar sesión`;
      8. **negativo:** ninguno de esos botones tiene `onClick` con efecto — al pulsarlos no cambia nada
         observable (son inertes).
      Debe fallar.
- [ ] Implementar con las clases del recon de la Tarea 1. **Reutilizar** `Avatar` de `src/components/ui/`
      con `initials={1}` si esa prop existe ya (la añade `feature/topnav-modulo-activo`); si no está
      fusionada, usar el `fallback` que produzca `T` y **anotar la dependencia** en el informe final.
- [ ] Verde. Commit: `feat(perfil): tarjeta Mi perfil con idioma y acciones inertes`.

## Tarea 4 — Tarjeta «Mis sesiones»

- [ ] Test en el mismo fichero:
      1. el título es `Mis sesiones` y la bajada `Dónde tienes la cuenta abierta ahora mismo.`;
      2. existe el botón `Cerrar las demás`;
      3. se pintan las 8 filas del seed, cada una con navegador · sistema, IP y `activa`;
      4. **la fila de la sesión actual lleva `Este dispositivo` y NO tiene botón `Cerrar`**;
      5. las otras 7 **sí** lo tienen — o sea, hay exactamente **7** botones `Cerrar` en la lista;
      6. **negativo:** pulsar `Cerrar` o `Cerrar las demás` no elimina ninguna fila (inerte).
      Debe fallar.
- [ ] Implementar con las clases del recon.
- [ ] Verde. Commit: `feat(perfil): tarjeta Mis sesiones con la actual marcada`.

## Tarea 5 — La ruta, sin módulo

- [ ] Test en `src/app/router.perfil.test.tsx`:
      1. navegar a `/perfil` monta `PerfilPage`;
      2. **el desplegable de la cabecera dice `Espacios`**, no `Perfil` (es el trato que da el live a las
         rutas sin módulo, igual que `/incidencias` y `/mi-trabajo`);
      3. **no** hay `<nav>` de áreas de módulo ni barra de secciones;
      4. `MODULES` sigue teniendo **12** entradas y ninguna es `perfil` (negativo explícito: añadirlo
         rompería el grid del Home).
      Debe fallar.
- [ ] Añadir la ruta en `src/app/router.tsx`. Envolver con `AppLayout` **sin** prop `module`, siguiendo el
      patrón de `MiTrabajoShell` / `IncidenciasShell`.
- [ ] Verde. Commit: `feat(perfil): ruta /perfil sin módulo`.

## Tarea 6 — Cierre y verificación

- [ ] `npx vitest run` → **≥ 252 ficheros y ≥ 998 tests**, verde. Pegar la salida literal.
- [ ] `npx tsc --noEmit` → sin salida. Pegar comando y resultado.
- [ ] Lint `--max-warnings 0` → limpio. Pegar la salida.
- [ ] `git diff --stat main` → confirmar que **no** aparece `TopNav.tsx` ni `src/lib/constants.ts`.
- [ ] Repasar la spec §3 «Qué NO entra»: nada de acciones reales, nada de i18n conectado, sin módulo nuevo,
      sin copiar 100 sesiones.
- [ ] PR sobre `main`. **`gh pr edit` está roto en este repo** (peta con `GraphQL: Projects (classic) is
      being deprecated` y **no escribe el cuerpo aunque parezca que ha funcionado**). Usar:
      `gh api -X PATCH repos/Arian1192/intranet-boilerplate/pulls/<N> -F body=@cuerpo.md`.
- [ ] Reportar al coordinador: nº de PR, las tres salidas, y **la lista de huecos**: el comportamiento real
      de las 4 acciones inertes, y la dependencia de `Avatar initials` si se resolvió a mano.
- [ ] **No fusionar.**
