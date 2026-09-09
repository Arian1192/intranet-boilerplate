Barrido de hojas .css por ruta — 9/9/2026, 12:34:08 CEST
Solo lectura: navegación pura, una recarga limpia por ruta. **No se pulsó nada.**

### Sobre las peticiones no-GET que registró este barrido

Salieron **7 POST**, y conviene explicarlos en vez de esconderlos, porque matizan el método que
venimos usando:

- `POST https://olbfwvqsuhcxvgonywrg.supabase.co/rest/v1/rpc/fichas_pendientes_revision`
- `POST https://olbfwvqsuhcxvgonywrg.supabase.co/rest/v1/rpc/eventos_sin_show`
- `POST https://olbfwvqsuhcxvgonywrg.supabase.co/rest/v1/rpc/cobros_pendientes`
- `POST https://olbfwvqsuhcxvgonywrg.supabase.co/rest/v1/rpc/cobros_por_factura`
- `POST https://olbfwvqsuhcxvgonywrg.supabase.co/functions/v1/holded-gastos`
- `POST https://olbfwvqsuhcxvgonywrg.supabase.co/rest/v1/rpc/cobros_pendientes`
- `POST https://olbfwvqsuhcxvgonywrg.supabase.co/rest/v1/rpc/mis_pendientes`

**No son escrituras y no las provocó ningún clic.** Son las llamadas que la propia aplicación hace al
cargar cada pantalla: en Supabase, un `rpc/` de lectura viaja por `POST`, no por `GET`. Los nombres lo
dicen solos —`fichas_pendientes_revision`, `eventos_sin_show`, `cobros_pendientes`,
`cobros_por_factura`, `mis_pendientes`— y `holded-gastos` es la función que alimenta `/gastos`.

**Lo que esto corrige de nuestro método:** «cero peticiones no-GET» vale como señal cuando se pulsa
algo en una pantalla ya cargada —que es como se ha usado hasta ahora, y ahí sigue siendo válida—, pero
**no** cuando la maniobra incluye cargar o recargar rutas: ahí el POST es el pan de cada día de la
propia app. Lo que hay que vigilar en un barrido de navegación es que no aparezca un `POST`/`PATCH`/
`DELETE` **que no estuviera ya ahí sin tocar nada**, y que ninguno apunte a una tabla de escritura.
Ninguno de estos siete lo hace.

Hoja(s) global(es), presentes en todas las rutas: index-CPwLpapT.css

| Ruta | Hoja propia | Bytes |
|---|---|---|
| `/conceptone` | — | — |
| `/shows` | `Shows-PeQdz7t2.css` | 5572 |
| `/tours` | — | — |
| `/tours/c68ade2f-5f01-4686-869c-34e744cf445a` | — | — |
| `/ofertas` | — | — |
| `/cobros` | — | — |
| `/gastos` | — | — |
| `/liquidaciones` | — | — |
| `/disponibilidad` | — | — |
| `/calendario-c1` | — | — |
| `/contactos` | — | — |
| `/conceptone/pendientes` | — | — |
| `/management/roster` | — | — |
| `/management/insights` | — | — |
| `/management/insights/d371328b-a849-40ce-9320-dee3af5c017c` | — | — |
| `/management/estrategias` | — | — |
| `/management/contratos` | — | — |
| `/management/activaciones` | — | — |
| `/management/campanas` | — | — |
| `/management/content` | — | — |
| `/management/incidentes` | — | — |
| `/management/incidentes/analitica` | — | — |
| `/artistas` | — | — |
| `/reporte` | — | — |
| `/conceptone/ajustes` | — | — |

Rutas con hoja propia: 1 de 25

## Verificación contra falsos negativos

El barrido de arriba se hizo con la caché del navegador viva, así que una hoja ya descargada podía no
volver a pedirse. Para descartar que alguna ruta tuviera hoja propia y no se viera, se repitió sobre
seis rutas representativas **con la caché desactivada** (`Network.setCacheDisabled` por CDP):

| Ruta | Hojas realmente pedidas |
|---|---|
| `/shows` | `index-CPwLpapT.css`, **`Shows-PeQdz7t2.css`** |
| `/liquidaciones` | `index-CPwLpapT.css` |
| `/tours` | `index-CPwLpapT.css` |
| `/artistas` | `index-CPwLpapT.css` |
| `/reporte` | `index-CPwLpapT.css` |
| `/conceptone` | `index-CPwLpapT.css` |

Mismo resultado. **`/shows` es la única ruta de ConceptOne con hoja propia**, y su capa ya está
copiada en `apx.css` (commit `30c53a2`).

## Qué significa

El agujero de la Fase 0 era de **una sola pantalla**, no del módulo. Ninguna de las pantallas ya
cerradas —`/tours` y `/liquidaciones` en `main`, las cinco de la Fase D, las seis de Management, ni la
ficha de artista— se está pintando con reglas que no tengamos: todas viven de la hoja global, que sí
se copió entera.
