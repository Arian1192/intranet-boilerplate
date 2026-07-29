# Creativos — ours vs live (2026-07-27)

Evidencia del live: `live-2026-07-27-*` (recon en solo lectura, 1440px, full-page).
Rama: `feature/recalco-creativos`.

## Hallazgos del diff dirigido (Tarea 1)

Comparación hecha con `live-2026-07-27-21-tablero.png` y `live-2026-07-27-22-calendario.png`
abiertas (recortes ampliados x3 sobre las tres tarjetas del kanban, la columna DEADLINE de la
tabla, la fila del toggle y las celdas del calendario), contra `src/features/creativos/`.

### P1 — ¿La tarjeta del kanban muestra badge de prioridad?

**No.** Confirmado en la imagen: ninguna de las tres tarjetas pinta `Alta`/`Media`/`Baja`.
La fila inferior de la tarjeta es únicamente `[badge de deadline] ☑ hechos/total`.
**La spec (D4) acierta.**

Hallazgos adicionales sobre la tarjeta, visibles en la misma imagen:

- El **deadline es un badge** (pill con fondo), no texto suelto, y **no lleva el emoji `📅`**
  que sí pinta `PieceCard.tsx` hoy.
- La tarjeta **no tiene tratamiento de borde rojo** cuando está atrasada: las tres comparten
  `border border-slate-200` (confirmado también en `live-2026-07-27-20-board-structure.json`,
  donde las tres tarjetas tienen la clase idéntica). Ours hoy pinta `border-red-300 ring-1
  ring-red-100` en las atrasadas: eso **no existe en el live**.
- El bloque `avatar + nombre` va dentro de una **píldora de fondo claro** (`rounded-full`,
  gris muy claro), no suelto sobre el fondo de la tarjeta.

### P2 — ¿El badge de deadline sale rojo en las 3 tarjetas, incluida la `Aprobado`?

**No. CONTRADICE LA SPEC (DD1).** La spec dice: *"el recon lo vio rojo también en la tarjeta
Aprobada"*. La imagen desmiente eso:

| Creatividad | Estado | Badge de deadline en la tarjeta | Badge de deadline en la tabla |
|---|---|---|---|
| Video Pomo 26/07 (23 jul) | Briefing | **rosa** (fondo rosa claro, texto rojo) | **rosa** |
| Pack Sold Out (10 jul) | En producción | **rosa** | **rosa** |
| Flyer Claptone 02/08 (22 jul) | Aprobado | **gris pizarra** | **gris pizarra** |

Consecuencia: la regla del badge y la del stat `Atrasadas` **son la misma**
(`vencido && status !== 'Aprobado'`), no dos reglas distintas como temía DD1. El apartado
"si divergen, documentar la regla de cada uno por separado" queda sin efecto: no divergen.
Se implementa una sola regla, materializada en el flag `isOverdue` del seed.

Hallazgo adicional derivado: en el live **la columna DEADLINE de la tabla también es un badge**
con la misma regla de color. Ours hoy la pinta como texto plano `text-sm text-slate-600`.
No estaba enumerado en los siete deltas de la spec, pero está en la evidencia y es una
divergencia visible; se corrige (queda anotado en "Discrepancias" más abajo).

### P3 — ¿El avatar de Carlos es foto o iniciales? ¿Y el de Alba?

- **Alba: iniciales.** `AG` en blanco sobre un círculo **verde** sólido.
- **Carlos: foto.** Es una imagen real (retrato recortado en círculo), no iniciales.

Esto es dato de entorno (los usuarios del live tienen avatar subido y color de iniciales
asignado por usuario). Por **DD3** de la spec ("igual con los avatares": brand/entorno propio,
no se tocan), ours mantiene su avatar de iniciales monocromo. Queda como discrepancia
consciente, no como bug.

### Hallazgo fuera de las tres preguntas: el `🎬` NO depende del tipo

La spec (D4) y el paso 3 de la Tarea 5 asumen que `🎬` precede al título cuando el tipo es
`Vídeo`. **La imagen lo desmiente por dos motivos:**

1. **Posición**: el `🎬` no precede al título. Está al **extremo derecho de la fila del
   responsable** (misma línea que `AG Alba`, alineado a la derecha de la tarjeta). En el
   volcado de texto aparece detrás de `Alba` precisamente por eso — el volcado es orden de
   DOM, no posición.
2. **Regla**: `Flyer Claptone 02/08` **también es de tipo `Vídeo`** (`SIGHT · Vídeo · v1`, y
   la tabla lo confirma) y **no lleva `🎬`**. La única tarjeta que lo lleva es
   `Video Pomo 26/07`. Por tanto `tipo === 'Vídeo' → 🎬` es **falso**.

No hay en toda la evidencia del 27-jul ningún dato que permita derivar la regla real (¿marca
de campaña? ¿de evento vinculado? ¿icono libre por creatividad?). **No se inventa la regla.**
Se modela como un campo opcional por creatividad (`icon?: string`) sembrado solo en
`Video Pomo 26/07`, que reproduce el live literalmente sin postular una semántica que la
evidencia no soporta. Queda anotado como **hueco pendiente de recon**.

---

## Verificación ours-vs-live (Tarea 10)

Capturas de ours con Playwright a 1440×1000, `fullPage`, sobre `vite dev`:
`ours-2026-07-29-tablero.png` y `ours-2026-07-29-calendario.png` (+ sus volcados `.txt`).

> Desviación consciente del plan: el plan pedía nombrarlas `ours-2026-07-27-*`. Se capturaron el
> **29-jul**, así que llevan esa fecha; el live contra el que se comparan sigue siendo el del
> **27-jul** (`live-2026-07-27-*`), que es la evidencia congelada de este recalco.

Comparación píxel a píxel sobre el solape (recorte al alto menor; el resto de la página es fondo vacío):

| Vista | ours | live | RMS | px cambiados (>12/255) |
|---|---|---|---|---|
| Tablero | 1440×1000 | 1440×900 | **15,19** | 114.354 / 1.296.000 = **8,82 %** |
| Calendario | 1440×1162 | 1440×1044 | **10,61** | 89.409 / 1.503.360 = **5,95 %** |

Consola del navegador: **0 errores y 0 warnings** en ambas vistas.

### Discrepancias explicadas

Ninguna queda sin explicar. Por orden de peso en el diff:

1. **Panel de Ayuda (entorno / cromo global).** Es la banda que más píxeles mueve (y ≈ 690-880 en
   Tablero; y ≈ 810-980 en Calendario). El live pinta el panel **con copy propio del módulo**
   ("Tu cola son los encargos, no los mensajes…"); el nuestro es el **panel inerte global** decidido
   en el recalco del Home v2. Fuera del alcance de esta rama.
2. **Cromo de cabecera (entorno).** Logo de asta + `Creativos ▾` y usuario `test / Admin / T` en el
   live, contra `I Intranet / Espacios / Creativos` y `Test User / Admin / TE` en ours. Es el usuario
   y la marca del boilerplate, no el módulo.
3. **`+ Maf` (delta deliberado y posterior a la evidencia).** Ours pinta un tercer atajo que la
   captura del 27-jul no tiene: el live lo añadió entre el 27 y el 29 de julio. Evidencia del
   barrido del 29-jul (`title="Nueva creatividad para Maf"`). Desplaza el botón primario ~136 px a
   la izquierda, y con él toda la fila.
4. **Color de marca en botón primario y chip activo (delta consciente, restricción del plan).** El
   live pinta `+ Nueva creatividad` y el chip `Todas` en `slate-900`; ours los pinta en el morado de
   marca (`variant="primary"`). El plan lo fija explícitamente: *"El botón primario sigue usando
   `variant="primary"` … No se pasa a oscuro."*
5. **Avatares (hueco de datos, ya anotado en P3).** El live usa **foto real** para Carlos y una
   píldora `AG` verde para Alba; ours usa iniciales sobre gris (`C`, `A`). No tenemos las imágenes
   del live ni forma de obtenerlas en solo lectura sin descargar material de personas reales.
6. **Truncado del título largo en la tarjeta del kanban.** El live corta
   `Pack Sold Out · Pack Sold …` con elipsis; en ours el título cabe entero porque nuestra tarjeta
   queda ~9 px más ancha. Nit de anchura de columna, no de contenido.
7. **El calendario de ours va dentro de una `Card`.** El live pinta la rejilla y su cabecera
   (`← → Julio 2026 Hoy`) **directamente sobre el fondo de la página**; ours reutiliza
   `EuphoricCalendar`, que ya viene envuelto en `Card` (borde + padding). Reutilizar en vez de
   copiar era un requisito explícito de la Tarea 9, así que el marco se acepta como coste de la
   reutilización. Desplaza toda la rejilla ~14 px a la derecha y ~19 px hacia abajo.
8. **Marca de "hoy".** Ours pinta el 29 con círculo morado (la captura es del 29-jul). En la del
   live, el 27 cae **detrás del panel de Ayuda**, así que la evidencia no permite comparar ese
   tratamiento. Queda como hueco.
9. **Desplazamiento vertical acumulado de 1-2 px** en todo lo que va por debajo de la fila de
   filtros (métricas de texto del entorno de captura). No hay diferencia estructural.

### Delta observado el 29-jul que **no** se ha incorporado

El `title` del atajo de Alba pasó de `Nueva creatividad para Alba Gelabert` (27-jul) a
`Nueva creatividad para Alba G` (29-jul). **Se mantiene `Alba Gelabert`**: es lo que sigue diciendo
la ficha de esa persona en el módulo Team del live hoy mismo, y coincide con nuestro seed. Cambiarlo
dejaría el nombre inconsistente entre Creativos y Team dentro de nuestra propia app. Queda anotado
para que lo decida Arian.
