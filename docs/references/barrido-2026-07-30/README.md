# Evidencia del barrido del live — 2026-07-30

**Capturado:** entre las **09:05 y las 10:15 CEST del 2026-07-30**, viewport 1440×1000 (algunas a 1440×1100),
Playwright/Chromium sobre `bookings.conceptoneagency.com` con `test@blackmoose.es`. **Solo lectura.**
**Informe que sale de aquí:** `docs/coordination/2026-07-30-barrido-informe.md`.

> **El calco se fija a la foto.** Las cifras de estas capturas son las de esa hora; el live mueve números
> en horas. Si vas a implementar una pantalla concreta, **re-captúrala**.

## Cobertura

**70 rutas reales** del live recorridas, más 12 rutas inventadas para verificar el comportamiento del
catch-all. 77 PNG de página completa + 17 volcados HTML/JSON.

Los PNG llevan prefijo según la pasada en que se capturaron: `c1-` ConceptOne, `b-` Etra/Producción/Euphoric,
`c-` Mixmag/TAGMAG/Creativos/CRUDA/CRM, `d-` Team/Herramientas/Configuración/Incidencias/Mi-trabajo/Perfil.
(Una primera pasada `roots-*` se eliminó al quedar superseded por estas, que usan un extractor mejor.)

## Volcados estructurados — empieza por aquí

| Fichero | Qué contiene | Usado en |
|---|---|---|
| `ayuda-contextual-inventario.json` | **Los 81 conjuntos ruta → contenido del panel de Ayuda**, con cabecera y tarjetas separadas. La fuente de verdad del copy. | Informe §2.2, spec `2026-07-30-ayuda-contextual-design.md` |
| `icon-actions.json` | Los **14 enlaces solo-icono** de los 8 módulos, con `href`, `title`/`aria-label`, clases y el **SVG completo** de cada icono | Informe §2.3, spec del TopNav D6 |
| `logo-y-secciones.json` | El `src` del logo **por ruta** (los dos SVG) y la fila de secciones de cada módulo con sus clases | Informe §2.1 D5, §2.1 D8 |
| `colores-y-navs.json` | La **rampa `brand` del live** sondeada stop a stop, los paneles con acento de `/conceptone`, la fila de secciones y el logo | Informe §0.b, arreglo suelto 4 |
| `topnav-dropdown-{conceptone,team,home}.{html,json}` | El desplegable **abierto** en tres rutas distintas: etiqueta cerrada, los 12 ítems, el ítem activo y el HTML del panel | Informe §2.1 D1–D2 |
| `ayuda-{team-contextual,mixmag-campanas-3tips,generico}.{html,json}` | El panel de Ayuda en sus tres formas (1 tarjeta / 3 tarjetas / genérico) con `getComputedStyle` hoja por hoja | Informe §2.2 D3 |
| `conceptone-secciones-row.html` | La fila `Dashboard · Shows · Ofertas · Cobros · Gastos · Disponibilidad` con sus clases | Arreglo suelto 4 |

## Lo que se comprobó y NO era un delta

Negativos explícitos, para que nadie los reabra:

- **La rampa `brand` sigue siendo carbón** y coincide con nuestro `tailwind.config.js` en los 7 stops que
  el live compila (`50 · 100 · 400 · 500 · 600 · 700 · 800`). Los `200`/`300`/`900` el live no los usa, así
  que no hay nada que medir. → `colores-y-navs.json`
- **No estamos tiñendo títulos de `brand-600`.** De las 40 combinaciones de `uppercase tracking` en `src/`,
  21 ya son `text-slate-400` y las 2 excepciones de booking (`text-rose-700` en «Fichas a revisar»,
  `text-violet-700` en «Posibles gigs») están **verificadas correctas** contra el live.
  → `colores-y-navs.json`, clave `panelesAcento`
- **Nada ha desaparecido del live.** Todos los deltas son cosas que el live tiene y nosotros no, o detalles
  de maquetado. No hay que borrar ninguna pantalla.
- **`/personal/usuarios` NO está en el sub-nav de Team.** Se llega desde
  `Configuración > SISTEMA > Cuentas (auditoría)`. → `d-configuracion.png`, `logo-y-secciones.json`

## El gotcha de la navegación, resuelto

Los briefs anteriores decían que «la URL directa rebota a Home». **No es eso.** Las 70 rutas reales
responden por URL directa sin redirigir. Lo que pasa es que una ruta **inexistente** renderiza el contenido
del Home (`h1` = `Hola, test 👋🏼`) **conservando el nav y el desplegable del módulo**: es un catch-all que
pinta el dashboard, no un `redirect`.

Verificado en `/etra/ajustes`, `/crm/ajustes`, `/creativos/analitica`, `/personal/ajustes`,
`/cruda/ajustes` y `/herramientas/ajustes` — las seis salen con el Home dentro del nav de su módulo.

**Consecuencia práctica:** se puede barrer por URL, y «me sale el Home» es la señal de que esa ruta **no
existe**, no de que la navegación esté rota.

## Evidencia relacionada, en otras carpetas

| Carpeta | Qué es |
|---|---|
| `docs/references/config-usuarios/` | Las **11 cajas de permisos** de `/personal/usuarios`: `main.outerHTML` íntegro (52 754 bytes), el subárbol del grid, y el título muestreado con PIL a `deviceScaleFactor: 4` → `#94A3B8` = `slate-400` |
| `docs/references/tablero-piezas-2026-07-30/` | La prueba de que `/creativos` y `/euphoric/piezas` son **la misma pantalla**: los dos `main` byte-idénticos tras normalizar H1 y bajada, y 7 recortes a 4× con el mismo SHA-256 |
