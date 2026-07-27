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

## Discrepancias explicadas (Tarea 10)

_(se completa al cierre)_
