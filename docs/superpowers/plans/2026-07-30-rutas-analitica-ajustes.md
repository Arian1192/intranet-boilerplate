# Las 11 rutas de analítica y ajustes · Plan de implementación

> **Para agentes de trabajo:** SUB-SKILL REQUERIDO: usa `superpowers:subagent-driven-development` o
> `superpowers:executing-plans` para ejecutar este plan tarea a tarea. Los pasos usan checkbox (`- [ ]`).

**Spec:** `docs/superpowers/specs/2026-07-30-rutas-analitica-ajustes-design.md` — léela entera antes de la
Tarea 1. Los datos de seed de `/crm/kpis` y `/personal/analitica` están en su §2.
**Base:** `main` = `2e0ac9a`. **Baseline en verde: 252 ficheros / 998 tests** (verificado 2026-07-30 10:06).

**Este plan cubre CINCO ramas.** No las ejecutes todas en la misma: mira el bloque de la que te toque.
La spec §5 dice cuál es cuál. Las cinco tocan `src/app/router.tsx`, así que **el merge va en serie**.

## Restricciones globales (para las cinco ramas)

- **TDD estricto**: un test que falla antes de cada implementación. Un commit por tarea, mensaje en es-ES.
- **No tocar `src/components/layout/TopNav.tsx`.** Los iconos que llevan a estas rutas los declara
  `feature/topnav-modulo-activo`. Aquí solo se añaden **rutas y páginas**.
- **No inventar datos.** Si el seed que necesitas no está en la spec §2, tienes que **capturarlo del live
  primero** (Tarea R, más abajo). El live es **solo lectura**:
  `bookings.conceptoneagency.com`, `test@blackmoose.es` / `Concept1234`.
- Todas estas pantallas son **de lectura**. Botones de alta (`+ Tarifa`) y de acción (`Desactivar`) se
  pintan **inertes**.
- **Las erratas del live se calcan**: `1 oportunidades`, `0% del objetivo`. No corregir.
- es-ES. Target ES2020: **nada de `Array.prototype.at()`**. Lint `--max-warnings 0`, `tsc --noEmit` limpio.

---

## Tarea R — Recon dirigido (SOLO para `feature/redaccion-analitica-ajustes` y `feature/conceptone-reporte-artistas`)

Las pantallas #1, #2, #3, #6 y #7 **no tienen datos suficientes** en el barrido del 30-jul: hay `h1`,
bajada, lista de bloques y un PNG de página completa, que sirve para dimensionar pero **no para calcar**.
Y el live mueve cifras a diario, así que un seed viejo es peor que ninguno.

- [ ] Login por Playwright en el live (hay un script reutilizable de referencia:
      `docs/references/barrido-2026-07-30/` documenta el método; el patrón es
      `goto('/login')` → rellenar email/password → esperar a salir de `/login`).
      **La navegación por URL directa funciona**: una ruta inexistente renderiza el Home conservando el nav,
      no redirige. Si te sale el Home, esa ruta no existe.
- [ ] Para **cada** pantalla de tu rama, con el estándar de evidencia dura:
      1. `main.outerHTML` **completo, sin truncar**, a fichero. (El truncado a 20 000 caracteres ya nos
         costó una ronda: si el volcado es grande, trocéalo, no lo cortes.)
      2. PNG de página completa **y** recortes a `deviceScaleFactor: 4` de lo que vayas a comparar por color.
      3. `getComputedStyle` de títulos, pastillas y bordes que vayas a calcar.
      4. Si sospechas de un color, **muéstrealo con PIL** sobre el PNG a 4×; no lo estimes a ojo. Dos
         medidas independientes que coincidan al valor exacto = dato cerrado.
- [ ] Guardar en `docs/references/<modulo>/live-2026-XX-XX-*` con la **hora de captura** anotada.
- [ ] Escribir un `ours-vs-live.md` corto con la tabla de bloques, sus cifras y sus clases.
- [ ] Commit: `docs(<modulo>): recon dirigido del live para <pantalla>`.
- [ ] **Si algo no está en la evidencia, es un hueco**: se anota y se reporta. No se rellena.

---

## RAMA A — `feature/rutas-ajustes-reenrutado` (talla S, empezar por aquí)

`/conceptone/ajustes` y `/produccion/ajustes` **no son pantallas nuevas**: el live re-expone paneles de
Configuración que ya tenemos. Solo cambia el `h1` y el shell que los envuelve.

### A1 — `/conceptone/ajustes` reutiliza `ComisionesBookersPage`

- [ ] Test en `src/app/router.conceptone.test.tsx` (créalo, o amplía el existente de configuración): al
      navegar a `/conceptone/ajustes` se monta dentro de `ConceptOneShell` (el desplegable dice
      `ConceptOne`) y el `h1` es **`Ajustes de ConceptOne`**, y se ven los cuatro bloques del live:
      `Comisiones de bookers`, `Porcentaje global por defecto`, `Exclusividad y logística de agenda`,
      `% de comisión por booker`. Debe fallar (la ruta no existe).
- [ ] Dar a `ComisionesBookersPage` una prop opcional `title?: string` con **default igual al de hoy**
      (para que `/configuracion/comisiones` no cambie ni un píxel). Test de regresión: la ruta de
      Configuración sigue mostrando su título original.
- [ ] Añadir la ruta en `src/app/router.tsx`, dentro del bloque de `ConceptOneShell`.
- [ ] Verde, incluida la regresión. Commit:
      `feat(conceptone): /conceptone/ajustes reutiliza el panel de comisiones`.

### A2 — `/produccion/ajustes` reutiliza `AlertasEventosPage`

- [ ] Mismo patrón: test que asserte `h1` = **`Ajustes de Producción`** y el bloque
      `Alertas de producción`, dentro de `ProduccionShell`. Debe fallar.
- [ ] `title?: string` con default en `AlertasEventosPage` + test de regresión de
      `/configuracion/alertas`.
- [ ] Ruta en `router.tsx` bajo `ProduccionShell`. **Ojo:** `ProduccionShell` ya tiene
      `<Route path=":eventId">`; `ajustes` debe declararse **antes** para que no lo capture el parámetro.
      Añadir un test que lo demuestre: `/produccion/ajustes` NO monta la página de evento.
- [ ] Verde. Commit: `feat(produccion): /produccion/ajustes reutiliza el panel de alertas`.

### A3 — Cierre de la rama A

- [ ] `npx vitest run` verde con **≥ 252/998**. `tsc --noEmit` y lint limpios. Pegar las tres salidas.
- [ ] Confirmar que `/configuracion/comisiones` y `/configuracion/alertas` **no han cambiado** (los dos
      tests de regresión en verde).
- [ ] PR sobre `main`. **`gh pr edit` está roto** (peta con `GraphQL: Projects (classic) is being
      deprecated`): el cuerpo se escribe con
      `gh api -X PATCH repos/Arian1192/intranet-boilerplate/pulls/<N> -F body=@cuerpo.md`.
- [ ] **No fusionar.** Avisar al coordinador de que esta rama toca `router.tsx`.

---

## RAMA B — `feature/crm-kpis` (talla M, no necesita recon)

Los datos están completos en la spec §2. Se calcan tal cual, **incluidas las erratas**.

### B1 — La página

- [ ] Test en `src/features/crm/pages/KpisPage.test.tsx`: `h1` = `KPIs comerciales`, bajada
      `Rendimiento de ventas: cumplimiento, conversión y embudo.`, y los **seis** KPI con su etiqueta,
      valor y pie exactos de la tabla de la spec §2:
      `GANADO 2026 / 0,00 € / 0 oportunidades` · `OBJETIVO 2026 / 320.000,00 € / 0% del objetivo` ·
      `FORECAST ABIERTO / 12.000,00 € / Σ valor × probabilidad` · `WIN RATE / — / 0 ganadas · 0 perdidas` ·
      `CICLO DE VENTA MEDIO / — / De creación a cierre (ganadas)` ·
      `PIPELINE ABIERTO / 48.000,00 € / 1 oportunidades`.
      **`1 oportunidades` y `0% del objetivo` van así**: son erratas del live y se calcan (DD4).
      Debe fallar.
- [ ] Test de los tres bloques: `VENTAS GANADAS POR MES · 2026` (los 12 meses `Ene`…`Dic` y el aviso
      `Selecciona una empresa para ver su embudo por etapas.`), `POR COMERCIAL · 2026` (tabla con cabeceras
      `Comercial · Abierto · Ganado · Win` y la fila `Israel Cuenca · 48.000,00 € · 0,00 € · —`),
      `POR ORIGEN DE LEAD · 2026`.
- [ ] Test de los filtros: `Todo el grupo · ConceptOne · Etra Agency` y los años `2023 2024 2025 2026 2027`.
      Inertes (o funcionales sobre el seed, si sale gratis; no es requisito).
- [ ] Implementar la página + el seed. Reutilizar los componentes de KPI/tarjeta que ya existan en
      `src/features/crm/` o en `src/components/ui/` — **hacer `grep` antes de escribir uno nuevo**.
- [ ] Verde. Commit: `feat(crm): pantalla de KPIs comerciales calcada del live`.

### B2 — La ruta

- [ ] Test en `src/app/router.crm.test.tsx`: `/crm/kpis` monta la página dentro de `CRMShell` y el
      desplegable dice `CRM`. Debe fallar.
- [ ] Ruta en `router.tsx` bajo `CRMShell`.
- [ ] Verde. Commit: `feat(crm): ruta /crm/kpis`.

### B3 — Cierre
- [ ] Igual que A3 (tests + tsc + lint + PR con `gh api`, sin fusionar).

---

## RAMA C — `feature/team-analitica` (talla M, recon parcial)

### C1 — Completar el seed que salió truncado

- [ ] El bloque `Por departamento` de `/personal/analitica` se cortó en la captura del 30-jul (llega hasta
      `Management 2 personas` y se trunca). **Re-capturar solo ese bloque** con la Tarea R.
- [ ] Los otros datos **sí** están completos en la spec §2 (los 4 KPI y las 6 filas de
      `Por empresa del grupo`): esos no hay que recapturarlos, pero **sí conviene confirmar que las cifras
      no se han movido** y, si se han movido, usar las nuevas y anotarlo.
- [ ] Commit: `docs(team): completa el recon de /personal/analitica`.

### C2 — La página

- [ ] Test en `src/features/team/pages/AnaliticaPage.test.tsx`: `h1` = `Analítica del equipo`, bajada
      `A dónde va el coste real del equipo: por empresa del grupo y por departamento.`, los 4 KPI
      (`Coste real / mes 34.522,07 €`, `Coste real / año 414.264,85 €`, `Personas activas 26` con pie
      `4 contratado · 22 freelance`, `Coste medio 1327,77 €`), y los dos bloques con sus bajadas
      (`Qué sociedad soporta el gasto.` / `Qué función nos cuesta cuánto.`) y sus filas
      `nombre · N personas · importe · % del total`. Debe fallar.
- [ ] ⚠️ Fíjate en el singular: el live escribe `1 persona` (Paid Ads) y `N personas` en el resto.
      Añadir un caso para el singular.
- [ ] Implementar. **Reutilizar** `CostDashboard` de `src/features/team/components/` si encaja
      (ya existe y tiene test); si no encaja, extenderlo de forma **aditiva** (prop nueva opcional con
      default = comportamiento actual), nunca cambiarlo para sus consumidores actuales.
- [ ] Verde. Commit: `feat(team): pantalla de analítica del equipo calcada del live`.

### C3 — La ruta
- [ ] Test: `/personal/analitica` monta dentro de `TeamShell`, desplegable `Team`. Ruta en `router.tsx`.
- [ ] Verde. Commit: `feat(team): ruta /personal/analitica`.

### C4 — Cierre
- [ ] Igual que A3.

---

## RAMA D — `feature/redaccion-analitica-ajustes` (talla L: #2, #3, #8, #9)

Mixmag y TAGMAG comparten `src/features/redaccion/RedaccionShell.tsx` y sus páginas están parametrizadas
por módulo. **Una implementación, dos rutas cada una.**

- [ ] **Tarea R obligatoria** para `/mixmag/analitica` y `/mixmag/ajustes`, y **también** para las de
      TAGMAG: el tarifario de TAGMAG es **propio** («Son suyos: no los comparte con Mixmag», dice el propio
      consejo del live), así que su seed hay que capturarlo aparte aunque el componente sea uno.
- [ ] `D1` — `/mixmag/analitica` + `/tagmag/analitica`: un componente parametrizado, 7 bloques
      (`Mes a mes`, `Ritmo de publicación`, `Qué se publica`, `Mejores clientes`, `Qué se vende`,
      `Quién publica`, `Artistas más publicados`), `h1` = `Mixmag · analítica` / `TAGMAG · analítica`.
      Test que cubra **las dos rutas** y asserte que el seed **difiere** entre ellas.
- [ ] `D2` — `/mixmag/ajustes` + `/tagmag/ajustes`: `h1` `Mixmag · ajustes` / `TAGMAG · ajustes`, bajada
      `Qué se vende, a cuánto, y en qué territorios. De aquí sale el presupuesto de una campaña, y del
      presupuesto salen los contenidos.`, pestañas `Tarifas · Packs · Territorios`, y el tarifario cruzando
      canales (`Web`, `Redes`, `Revista`) × tipos de pieza (`Artículo`, `Entrevista`, `Noticia`, `Premiere`,
      `Exclusive Mix`, `Review`, `Crónica`, `Tendencias`, `Cómo produzco`, `Tech`, `Moda`,
      `One Minute Talks`, `Portada`, `Vídeo`, `Post (IG/FB)`, `Stories`, `Nota de prensa`, `Publicidad`,
      `Sorteo`) con importe en `€`, `Desactivar` y `✕` por línea, más `+ Tarifa`. **Todo inerte.**
      ⚠️ Esta es la pantalla más pesada de las 11: si hay que recortar, se recortan **pestañas enteras**
      (`Packs`, `Territorios`) y se anotan como huecos. **Nunca** se inventan tarifas.
- [ ] `D3` — Rutas en `router.tsx` bajo **los dos** shells (`MixmagShell` y `TagmagShell`).
- [ ] Cierre igual que A3.

---

## RAMA E — `feature/conceptone-reporte-artistas` (talla L: #1, #6, #7)

- [ ] **Tarea R obligatoria** para las tres.
- [ ] `E1` — `/reporte`: `h1` = `Analítica`, cinco bloques (`Dashboard general`,
      `Fees por artista (Booking + Management apilados)`, `Por booker`,
      `Comisión generada por booker`, `Vista por artista`). Si hay que recortar, **bloques enteros**.
- [ ] `E2` — `/artistas`: `h1` = `Artistas`, listado de artistas de ConceptOne.
- [ ] `E3` — `/management/incidentes`: `h1` = `Incidentes`, listado de incidentes de management.
- [ ] `E4` — Rutas en `router.tsx`. Las tres son **rutas planas** (`/reporte`, `/artistas`) o bajo
      `/management/`, dentro del bloque de `ConceptOneShell`, igual que `/shows` y `/ofertas`.
      ⚠️ Verificar que **no** aparecen en la barra de secciones de Bookings: en el live esas tres se
      alcanzan **solo** por los iconos de la cabecera, y `activeArea()` de
      `src/features/booking/data/nav.ts` no debe marcar `Bookings` para ellas. `/management/incidentes` sí
      cae en el área `Management` por su prefijo — comprobarlo contra el live antes de decidir.
- [ ] Cierre igual que A3.

---

## Verificación final (todas las ramas)

- [ ] `npx vitest run` → **≥ 252 ficheros y ≥ 998 tests**, verde. Pegar la salida literal.
- [ ] `npx tsc --noEmit` → sin salida. Pegar comando y resultado.
- [ ] Lint `--max-warnings 0` → limpio. Pegar la salida.
- [ ] `git diff --stat main` → confirmar que **no** aparece `src/components/layout/TopNav.tsx`.
- [ ] Repasar la spec §3 «Qué NO entra»: nada de escritura, nada de datos inventados, sin refactor de
      Configuración, erratas del live intactas.
- [ ] Reportar al coordinador: nº de PR, las tres salidas, y **la lista de huecos** (bloques o pestañas que
      hayas dejado fuera, y por qué).
- [ ] **No fusionar.** Avisar de que la rama toca `router.tsx`, para que el merge vaya en serie.
