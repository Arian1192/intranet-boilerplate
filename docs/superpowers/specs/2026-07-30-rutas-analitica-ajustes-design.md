# Las 11 rutas de analítica y ajustes que el live tiene y nosotros no · Design

**Rama sugerida:** varias (ver §5 «Troceado»). Base `main`, `2e0ac9a`.
**Depende de:** `feature/topnav-modulo-activo` — los iconos que llevan a estas rutas los declara esa rama.
Se puede empezar antes de que se fusione, pero **no se toca `TopNav.tsx` aquí**.
**Evidencia:** `docs/references/barrido-2026-07-30/` — `c1-reporte.png`, `c-mixmag-analitica.png`,
`c-mixmag-ajustes.png`, `c-tagmag-{analitica,ajustes}.png`, `c-crm-kpis.png`, `d-personal-analitica.png`,
`c1-{artistas,management-incidentes,conceptone-ajustes}.png`, `b-produccion-ajustes.png`, `out-*.json`.
**Informe de origen:** `docs/coordination/2026-07-30-barrido-informe.md` §3.

## 1. Por qué

El barrido del 2026-07-30 encontró **11 rutas** que el live sirve y nuestro router no conoce. Todas cuelgan
de los **iconos de acción** de la cabecera (`docs/superpowers/specs/2026-07-30-topnav-modulo-activo-design.md`
D6): sin ellas, esos iconos apuntan al fallback.

No son 11 pantallas nuevas: **dos son re-enrutado de paneles que ya tenemos** y **dos más salen del gemelo
de Mixmag**. El trabajo real son 5 pantallas.

## 2. Alcance: el inventario

| # | Ruta | `h1` del live | Qué hay dentro | Talla |
|---|---|---|---|---|
| 1 | `/reporte` | `Analítica` | Dashboard general · Fees por artista (Booking + Management apilados) · Por booker · Comisión generada por booker · Vista por artista | **L** |
| 2 | `/mixmag/analitica` | `Mixmag · analítica` | Mes a mes · Ritmo de publicación · Qué se publica · Mejores clientes · Qué se vende · Quién publica · Artistas más publicados | **L** |
| 3 | `/mixmag/ajustes` | `Mixmag · ajustes` | Pestañas `Tarifas · Packs · Territorios`; tarifario por canal (Web/Redes/Revista) × tipo de pieza, con `+ Tarifa`, importe en `€`, `Desactivar` y `✕` por línea | **L** |
| 4 | `/crm/kpis` | `KPIs comerciales` | 6 KPI + 3 bloques (ver §3) | **M** |
| 5 | `/personal/analitica` | `Analítica del equipo` | 4 KPI + Por empresa del grupo · Por departamento | **M** |
| 6 | `/artistas` | `Artistas` | Listado de artistas de ConceptOne | M |
| 7 | `/management/incidentes` | `Incidentes` | Listado de incidentes de management | M |
| 8 | `/tagmag/analitica` | `TAGMAG · analítica` | **Los mismos 7 bloques** que #2 | S (del gemelo) |
| 9 | `/tagmag/ajustes` | `TAGMAG · ajustes` | **La misma forma** que #3, tarifario propio | S (del gemelo) |
| 10 | `/conceptone/ajustes` | `Ajustes de ConceptOne` | **El mismo panel que `/configuracion/comisiones`** | **S (re-enrutado)** |
| 11 | `/produccion/ajustes` | `Ajustes de Producción` | **El mismo panel que `/configuracion/alertas`** | **S (re-enrutado)** |

### Los dos casos de re-enrutado (#10, #11) — hacerlos primero, son gratis

Verificado por volcado de texto: el contenido de `/conceptone/ajustes` en el live es **exactamente** el de
`/configuracion/comisiones` (bloques `Comisiones de bookers`, `Porcentaje global por defecto`,
`Exclusividad y logística de agenda`, `% de comisión por booker`), y el de `/produccion/ajustes` es el de
`/configuracion/alertas` (`Alertas de producción`).

Ya tenemos las dos pantallas: `ComisionesBookersPage` y `AlertasEventosPage`
(`src/features/configuracion/`). Lo único que cambia es el `h1` (`Ajustes de ConceptOne` /
`Ajustes de Producción` en vez del título de Configuración) y el shell que las envuelve.

→ **Se reutilizan los componentes de página**, con el título como prop. **No se duplican.**

### Los dos gemelos (#8, #9) — salen de #2 y #3

Mixmag y TAGMAG ya comparten `src/features/redaccion/RedaccionShell.tsx` y las páginas de
`contenidos`/`campanas`/`revistas`, parametrizadas por módulo. Las de analítica y ajustes se hacen igual:
**una implementación, dos rutas**. El tarifario de TAGMAG es propio (el consejo del live lo dice
explícitamente: «Son suyos: no los comparte con Mixmag»), así que el **seed** se parametriza aunque el
componente sea uno.

### Datos observados, para el seed

**`/crm/kpis`** (`h1` `KPIs comerciales`, bajada «Rendimiento de ventas: cumplimiento, conversión y embudo.»):
filtros `Todo el grupo · ConceptOne · Etra Agency` y años `2023…2027`. Seis KPI con estas etiquetas y
valores del 2026-07-30:

| KPI | Valor | Pie |
|---|---|---|
| `GANADO 2026` | `0,00 €` | `0 oportunidades` |
| `OBJETIVO 2026` | `320.000,00 €` | `0% del objetivo` |
| `FORECAST ABIERTO` | `12.000,00 €` | `Σ valor × probabilidad` |
| `WIN RATE` | `—` | `0 ganadas · 0 perdidas` |
| `CICLO DE VENTA MEDIO` | `—` | `De creación a cierre (ganadas)` |
| `PIPELINE ABIERTO` | `48.000,00 €` | `1 oportunidades` |

Bloques: `VENTAS GANADAS POR MES · 2026` (Ene…Dic, con el aviso «Selecciona una empresa para ver su embudo
por etapas.»), `POR COMERCIAL · 2026` (tabla `Comercial · Abierto · Ganado · Win`, una fila:
`Israel Cuenca · 48.000,00 € · 0,00 € · —`), `POR ORIGEN DE LEAD · 2026`.

Nótese `1 oportunidades` (sin singular) y `0% del objetivo`: son **erratas del live** y se calcan tal cual.

**`/personal/analitica`** (`h1` `Analítica del equipo`, bajada «A dónde va el coste real del equipo: por
empresa del grupo y por departamento.»): KPI `Coste real / mes 34.522,07 €`, `Coste real / año
414.264,85 €`, `Personas activas 26` con pie `4 contratado · 22 freelance`, `Coste medio 1327,77 €`.

`Por empresa del grupo` («Qué sociedad soporta el gasto.»): ConceptOne 10 personas 11.460,00 € 33% ·
Euphoric Media 7 / 8937,68 € / 26% · Mixmag Spain 8 / 6750,00 € / 20% · Etra Agency 5 / 4894,39 € / 14% ·
TAGMAG 4 / 2480,00 € / 7% · CRUDA 2 / 0,00 € / 0%.

`Por departamento` («Qué función nos cuesta cuánto.»): Redacción 4 / 4920,00 € / 14% ·
Comunicación & PR 2 / 4894,39 € / 14% · Marketing 2 / 4007,68 € / 12% · Paid Ads 1 persona / 4000,00 € / 12% ·
Booking 4 / 3600,00 € / 10% · Management 2 / … (truncado en la captura: **re-capturar al implementar**).

> ⚠️ **El resto de las pantallas (#1, #2, #3, #6, #7) NO tienen datos suficientes en este barrido.**
> Tengo su `h1`, su bajada, la lista de sus bloques y un PNG de página completa, que basta para
> dimensionar pero **no** para calcar. **Cada una exige un recon dirigido propio antes de implementarla**
> (ver §4 DD2). No inventar cifras.

## 3. Qué NO entra

- **Cualquier cambio en `TopNav.tsx`.** Los enlaces los pone `feature/topnav-modulo-activo`. Si esa rama no
  está fusionada, estas rutas se prueban navegando a mano; no se añade el icono aquí.
- **Escritura.** Todas estas pantallas son de lectura. El `+ Tarifa` y el `Desactivar` de
  `/mixmag/ajustes` se pintan **inertes**, como el resto de altas del boilerplate.
- **Inventar datos.** Para #1, #2, #3, #6 y #7 hay que re-capturar primero.
- **Unificar `/conceptone/ajustes` con `/configuracion/comisiones` en un solo componente «configurable».**
  Se **reutiliza** la página con el título como prop; no se abre un refactor de Configuración.
- **Corregir las erratas del live** (`1 oportunidades`, `0% del objetivo`). Se calcan.

## 4. Decisiones de diseño

- **DD1 — Los dos re-enrutados van primero.** `/conceptone/ajustes` y `/produccion/ajustes` son dos
  entradas de router y una prop de título. Hacerlos primero da dos rutas de las 11 en una tarde y valida el
  patrón de reutilización.
- **DD2 — Cada pantalla grande exige recon propio antes de implementarla.** El live mueve cifras a diario:
  un seed capturado hoy y escrito la semana que viene ya está mal. Cada rama re-captura la **suya** con el
  estándar de evidencia dura (HTML completo sin truncar + PNG a `deviceScaleFactor: 4` + `getComputedStyle`
  de lo que se compare) y la guarda en `docs/references/<modulo>/live-2026-XX-XX-*`.
- **DD3 — Los gemelos comparten componente y parametrizan seed.** Es el patrón que ya funciona en
  `RedaccionShell`. Escribir dos veces la misma analítica es exactamente cómo derivaron Creativos y
  Euphoric.
- **DD4 — Las erratas del live son evidencia.** `1 oportunidades` se calca. Si Arian quiere corregirlo, es
  una decisión de producto, no de calco.

## 5. Troceado recomendado

El informe marca este bloque como **L pero divisible**. Cinco ramas independientes:

| Rama | Contenido | Talla |
|---|---|---|
| `feature/rutas-ajustes-reenrutado` | #10 `/conceptone/ajustes` + #11 `/produccion/ajustes` | **S** |
| `feature/crm-kpis` | #4 `/crm/kpis` (datos completos en §2, **no** necesita recon) | **M** |
| `feature/team-analitica` | #5 `/personal/analitica` (datos casi completos; re-capturar el bloque «Por departamento», que salió truncado) | **M** |
| `feature/redaccion-analitica-ajustes` | #2, #3, #8, #9 — los cuatro de Mixmag/TAGMAG juntos, porque comparten componente | **L** |
| `feature/conceptone-reporte-artistas` | #1 `/reporte`, #6 `/artistas`, #7 `/management/incidentes` | **L** |

Las tres primeras se pueden lanzar ya. Las dos últimas necesitan su recon dirigido (DD2).

**Las cinco tocan `src/app/router.tsx`.** Es el punto de conflicto garantizado: van **en serie** en cuanto
a merge, aunque el desarrollo sea en paralelo. Quien las coordine debe fusionar de una en una y rebasar las
demás. (Esto ya nos pasó el 24-jul con ConceptOne/Team/Herramientas: está en la memoria del proyecto.)

## 6. Riesgos

- **`router.tsx` es el cuello de botella.** Cinco ramas tocándolo. Ver §5.
- **Los seeds caducan.** DD2 existe por esto. Un seed del 30-jul implementado el 5-ago no cuadrará con el
  live y parecerá un bug nuestro.
- **`/mixmag/ajustes` es más grande de lo que parece.** El tarifario cruza 3 canales × ~18 tipos de pieza,
  con estado activo/desactivado por línea. Es la pantalla más pesada de las 11: no meterla en la misma
  rama que otras dos.
- **`/reporte` y `/mixmag/analitica` son dashboards de 5 y 7 bloques.** Si hay que elegir qué recortar,
  recortar **bloques enteros** y anotarlos como huecos, nunca inventar datos para rellenar.
