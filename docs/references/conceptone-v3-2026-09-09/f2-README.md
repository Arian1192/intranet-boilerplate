# Evidencia `f2-` — Faena 2 (Management I y II)

Capturada el **2026-09-09 entre las 10:35 y las 10:41 CEST**, con sesión iniciada y sin escribir nada
en el live. Complementa el barrido de las 09:20-09:40: son **estados secundarios** que aquél no cubría.

Estándar del proyecto por pantalla: PNG `fullPage` a `deviceScaleFactor: 2`, `document.body.innerText`
y el `outerHTML` del `<main>` **sin truncar**. Cada volcado lleva la URL y la hora en su primera línea.

| Fichero | Qué es |
|---|---|
| `f2-management--insights--d371328b-a849-40ce-9320-dee3af5c017c.*` | La **ficha completa de un artista** (Janse), a la que se llega pulsando una fila de `/management/insights`. Es una **ruta que el inventario no tenía**: `/management/insights/:artistaId`. 12 pestañas (Overview, Audiencia, Spotify, Beatport, Shazam, YouTube, TikTok, Instagram, SoundCloud, Deezer, Tidal, Traxsource), 9 KPI y bloque `TOP TRACKS` con tres ordenaciones. **La escribe la Fase F**, no esta faena. |
| `f2-management--campanas-detalle.*` | Modal **`Editar campaña`**, abierto pulsando la fila de una campaña existente. |
| `f2-management--activaciones-detalle.*` | Modal **`Editar activación`**, ídem. |
| `f2-management--content-detalle.*` | Modal **`Editar proyecto`**, ídem, desde la tarjeta del kanban. |

Los tres modales son de la **Fase G** (`feature/conceptone-v3-management-modales`), no de esta faena.
Se guardan aquí para que esa fase no tenga que volver al live: **el live mueve cifras a diario** y una
recaptura posterior ya no cuadraría con estos números.

## Cómo se sacó, y qué no se hizo

1. **Sonda pasiva primero:** `getComputedStyle(el).cursor === 'pointer'` sobre todo lo que cuelga de
   `<main>`, para saber qué es pulsable **sin pulsar nada**. Así se vio que cada fila de Campañas,
   Activaciones y Content es un `button.text-left` que envuelve título y artista, bien separado del
   botón de estado y del aspa de borrar.
2. Sólo entonces el clic, y **sólo en ese `button`**.
3. **No se escribió nada:** ni una tecla en un campo, ni un guardado, ni los botones
   `Programada`/`En curso`/`Hecha`/`Perdida`, ni el aspa, ni ningún `+ Nuevo…` (abrir un alta puede
   crear un borrador en servidor; eso sí sería escribir).

`/management/roster` y `/management/contratos` no tienen nada pulsable: no hay evidencia que capturar.
