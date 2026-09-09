# Evidencia `f3-` — la ficha de artista de Insights (Faena 3, Fase F)

Captura de `/management/insights/:artistaId` del live, **2026-09-09 entre las 12:16 y las 12:24
CEST**. Cubre lo que la evidencia anterior no tenía: el volcado `f2-management--insights--d371328b…`
sólo traía la pestaña `Overview` de un artista.

## Qué hay aquí

| | |
|---|---|
| **Artistas** | 5: `janse` (`En declive`), `londonground` (`Estable`, el caso máximo de 14 pestañas), `dhmoon` (`Escalando`), `marcelbs` (`Creciendo`), `ledher` (el estado de fallo) |
| **Volcados** | `.txt` (innerText del `<main>`) y `.main.html` (**DOM sin truncar**) de **cada pestaña de cada artista**, más las tres ordenaciones de `TOP TRACKS`: 55 pares |
| **PNG** | 13, `fullPage` a `deviceScaleFactor: 2` |
| **Hora** | estampada en la primera línea de cada volcado |

Cada fichero se llama `f3-insights--<artista>--<NN>-<pestaña>`, donde `NN` es la posición de la
pestaña en **esa** ficha (no es fija entre artistas: ver más abajo).

### Por qué sólo 13 PNG

Se dejaron **los que sostienen una decisión**, no uno por pestaña: los cinco `Overview` (uno por
chip de estado), el mapa de `Audiencia`, las dos ordenaciones alternativas de `TOP TRACKS`, el
`Spotify` de Janse (la pestaña de plataforma más rica), su `Traxsource` (el caso sin gráfico), y de
Londonground `Apple Music`, `Amazon` y `Beatport` (las pestañas que ningún otro artista trae, y el
único `CHARTS RECIENTES` capturado). El resto de pestañas está descrito en los `.txt` y `.main.html`,
que es lo que se relee. Los 15 MB de PNG completos habrían sido cuatro veces la evidencia útil.

### Lo que NO está aquí, y cómo recuperarlo

**El volcado de origen.** Toda la pantalla la alimenta **una sola lectura**:

```
GET /rest/v1/artist_songstats?select=*&artista_id=eq.<uuid>
```

Devuelve el JSON de Songstats entero: entre **0,7 y 2,9 MB por artista**, hasta 12.420 puntos de
serie. No se guarda en el repo por peso; se vuelve a pedir navegando a la ficha con un listener de
respuestas. Los UUID de los 17 artistas del roster están en `f3-00-artistas.json`.

## Sólo lectura: lo que se hizo y lo que no

Se navegó, se pulsaron **pestañas** y **conmutadores de vista** (las 3 ordenaciones de `TOP TRACKS`,
los 5 rangos del gráfico, el `Actual`/`Pico` del mapa). **No se pulsó `Sincronizar`** —es una acción
sobre un servicio externo—, no se tecleó en ningún campo, no se abrió ningún alta.

Listener de red **antes de cada clic**. En las **278 peticiones** de todas las pasadas, **cero
peticiones que no fueran `GET`**, incluidas las cargas de ruta. Merece la pena decirlo así de
explícito porque en este proyecto la señal «cero no-`GET`» tiene un matiz: en Supabase un `rpc/` de
**lectura** viaja por `POST`, así que en otras pantallas cargar una ruta sí produce `POST` inocentes.
**En ésta no hay ninguno**: la ficha se sirve de un `GET` y los conmutadores no tocan la red
(medido: 0 peticiones al cambiar de rango o de modo del mapa).

## Negativos explícitos (comprobado, y NO pasa)

- **Las pestañas no cambian la URL** ni sobreviven a una recarga: son estado de cliente. No es
  deep-linkable, al contrario que `/tours/:tourId`.
- **Los conmutadores no piden datos.** Cambiar de rango, de ordenación o de `Actual`/`Pico` no
  genera ni una petición: todo estaba ya en la respuesta inicial.
- **El mapamundi no cambia con el artista.** Los 292 trazados de país son **byte a byte idénticos**
  en los tres artistas comprobados (`sha256` de la concatenación:
  `a9de46d1336ae2dbfaf847a3f559fb8187e307fded506eca9461076dad40c008`).
- **No hay ninguna clase `apx` sin definir.** De las 132 clases distintas que usa la pantalla, 24
  aparecen en `apx.css` y las 108 restantes son utilidades Tailwind, verificadas una a una. Las
  únicas `apx` de verdad son `card`, `btn-primary` y `btn-secondary`, las tres ya definidas.

## Hallazgos que corrigen el spec

1. **No son 12 pestañas: son hasta 14, y dependen del artista.** Orden canónico medido —`Overview`,
   `Audiencia`, `Spotify`, `Beatport`, `Shazam`, `YouTube`, `TikTok`, `Instagram`, `SoundCloud`,
   `Apple Music`, `Amazon`, `Deezer`, `Tidal`, `Traxsource`— y cada artista muestra una
   **subsecuencia**: Londonground 14, Janse 12, DH Moon 12, Marcel BS 6, Sebastian Ledher 1. El «12»
   del spec era el dato de Janse.
2. **La regla de qué pestaña aparece** es que **alguno de los KPI que esa pestaña pinta valga
   distinto de cero**. Cuidado, porque la regla que parece a simple vista —«esa fuente tiene
   histórico»— es **falsa**, y yo mismo la di por buena antes de comprobarla: Marcel BS tiene 731
   puntos de Beatport y no trae la pestaña; DH Moon tiene 230 de Amazon y tampoco. Verificado en los
   **48 pares** artista-plataforma.
3. **`Overview` tiene tres bloques**, no uno: `TOP TRACKS`, `HITOS RECIENTES` y **`RELEASES`**. Los
   dos últimos no estaban en el spec.
4. **Las tres ordenaciones de `TOP TRACKS` cambian el conjunto**, no el orden: Janse da 8 pistas por
   `Streams`, 12 por `Popularidad` y 14 por `Playlist reach`.
5. **El sexto estado del listado era un fallo, no un estado.** La sincronización de Sebastian Ledher
   con Songstats devolvió **`HTTP 429`** —está literal en el origen— y el live pinta ese fallo como
   `—` en los nueve KPI, «Sin datos.» en los bloques y una sola pestaña. Eso explica el chip
   `Sin datos` que la Faena 2 vio en `/management/insights` y que no está entre los cinco filtros.
6. **Sin serie no hay tarjeta de gráfico.** `Traxsource` no era un caso especial: es esta regla.
7. **La deriva de cifras tenía causa, y no era ruido.** El `Songstats · actualizado` de Janse pasó de
   `2/9/2026` a `9/9/2026` entre la captura de la Faena 2 y ésta: su fila se **re-sincronizó de
   verdad** durante la ronda, y por eso sus números se movieron mientras los otros cuatro artistas
   —todos en `2/9/2026`— no se movieron nada.

## Lo que quedó medido al detalle

- **Los 9 KPI de `Overview`** son fijos: mismas etiquetas y mismo orden en los 17 artistas.
- **Recortes de lista:** `TOP TRACKS` 15 · `HITOS RECIENTES` 18 · `RELEASES` 24 ·
  `TOP PLAYLISTS` 14 · tabla de ciudades 25 · barras de país 12.
- **Los 5 chips de estado**, con su clase exacta y su punto: `En declive` rose, `Estable` amber,
  `Escalando` emerald, `Creciendo` **violet de Tailwind** (no el acento `apx`), fallo en slate.
- **El color del gráfico de cada plataforma:** Spotify `#1DB954`, Beatport `#01FF95`, Shazam
  `#0088FF`, YouTube `#FF0000`, TikTok `#000000`, Instagram `#E1306C`, SoundCloud `#FF5500`,
  Apple Music `#FA243C`, Amazon `#FF9900`, Deezer `#A238FF`, Tidal `#00FFFF`.
- **La geometría del gráfico**, reproducida punto por punto en 33 de 33 gráficos: caja 640×240,
  margen 4, `x` a partes iguales, `y` normalizada entre el mínimo y el máximo de la ventana.
- **El formateador de cifras** (`<1000` entero, luego `K`, luego `M`, un decimal, `.0` recortado),
  deducido de 24 pares crudo↔pantalla y sin excepciones.
- **El punto de color de un hito** va por fuente y sólo `radio` se sale del gris: `#7D818C` frente a
  `#94A3B8`.

## Límites declarados

- **`Inactivo` no se pudo medir:** hoy no hay ningún artista en ese estado en el roster del live.
- **Cuatro KPI salen `—` en los cinco artistas porque el origen no trae el campo**, no porque valgan
  cero: `Releases charteados` (Beatport), `Playlist reach` (Apple Music), y `Followers` y `Views`
  (YouTube).
- **La segunda línea de `RELEASES` es `—` en los cinco** y el origen no trae ningún campo de sello:
  no se dedujo qué es.
- `Charts` de Amazon y Tidal y `Followers` de TikTok valen cero en los cinco, así que su campo de
  origen **no se pudo aislar por valor**; se usa el de sus hermanas inequívocas.

**Y un límite que resultó no serlo.** La proyección de las burbujas del mapa se dio por «nuestra» al
principio —del volcado sólo se leen las coordenadas ya proyectadas— pero contrastándolas contra las
`city_lat`/`city_lng` del origen salió **exacta**: equirectangular sobre el `viewBox` de 1000×500, y
radio `3 + 26·√(v/máximo)`. Verificado en las **137 burbujas** de los cuatro artistas con audiencia,
con desviación **cero**. Se deja anotado porque el primer instinto —declararlo como inventado— habría
metido en el calco una geometría aproximada teniendo la buena al alcance.

## Y una advertencia sobre las cifras

**El live las mueve en horas.** Durante este mismo recon, el oyentes-mensuales de Janse pasó de
`136K` a `126.7K` en 23 minutos — porque su fila se re-sincronizó de verdad (punto 7 de arriba). Por eso cada artista se capturó en **una sola pasada** —origen y
DOM en el mismo instante— y por eso los tests del calco van contra reglas y literales, nunca contra
una cifra que se mueva. Cualquier comparación posterior contra el live dará números distintos sin que
nada esté roto.
