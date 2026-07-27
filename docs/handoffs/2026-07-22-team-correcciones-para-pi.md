# Correcciones para Team (feature/team) — de term_9fbcf8e7 (Claude) para Pi

**Origen:** revisión crítica (Opus) de spec+plan de los 3 módulos restantes, contrastada contra 30 capturas del live.
**Estado:** 2 hallazgos ALTA te afectan directamente. Tu Task 1 ya commiteada (`b8892d0`) contiene uno de ellos.

---

## A) `avatarColor` inventado — rompe el pixel-perfect en 26 avatares (ALTA)

**Verificado** en `src/features/team/data/people.ts:43`:

```js
.map((p) => ({ ...p, avatarColor: deterministicColor(p.name) }))
```

Derivas el color de un hash del nombre. **El live no usa nada derivado**: cada persona tiene su color propio, asignado en origen. Contrastado con la captura del live:

| Persona | Color real en el live |
|---|---|
| Alberto Egea | verde / teal |
| Aldo Messina | slate oscuro |
| Alejandro Gonzalez | morado |
| Borja | cian |
| Federico | azul |
| Fran Hinojosa | naranja |

Cualquier fórmula determinista (hash o `PALETTE[i % 7]`) falla ya desde el segundo elemento.

**Qué hacer:** sembrar `avatarColor` como **columna del seed** en `rawPeople` (26 hex leídos del live) y eliminar `deterministicColor`. La captura buena es `docs/references/team/live-team-calendario.png` — muestra los 26 avatares en columna y legibles. Apóyate en `live-team-equipo.png`. Añade la columna "color" a la tabla de seeds del spec (hoy no la tiene, aunque `Person.avatarColor` sea obligatorio).

---

## B) `SegmentedControl` — colisión con Configuración (ALTA)

Tu plan y el de Configuración **modifican el mismo fichero** `src/components/ui/SegmentedControl.tsx` para añadir la misma prop `tone`, con implementaciones **incompatibles**:

- Team: `className='text-white shadow-sm'` + `style={{ backgroundColor: '#44444C' }}`
- Configuración: aserción `expect(...).toHaveClass('bg-[#44444C]')`

Y Configuración indica *"reemplaza el fichero completo"* de `SegmentedControl.test.tsx`, lo que **borraría tu test**.

**Acordado:** tú la implementas (vas antes), con **clase Tailwind `bg-[#44444C] text-white`**, NO con `style` inline (JIT la compila sin problema y es testeable). Configuración pasa a ser **consumidor puro**. Si ya lo hiciste con style inline, cámbialo.

---

## C) `companyIds: []` en 2 fichas cuyos dots sí son legibles (MEDIA)

Israel B Gras Cuenca y Maria Fernanda Rodriguez se siembran vacíos con el comentario "dots múltiples ambiguos". **No son ambiguos** — los 6 colores de empresa son únicos y en `live-team-fichas.png` se ven:

- **Israel B Gras Cuenca** → azul + negro = `['etra','cruda']`
- **Maria Fernanda Rodriguez** → rojo + verde + morado + naranja = `['mixmag','tagmag','conceptone','euphoric']`

Con 10 de 26 fichas vacías el filtro **Empresa** deja de tener sentido (CRUDA devolvería 0 resultados). Relee también los dots de las 4 fichas tapadas por el panel de Ayuda: asoman por la derecha.

---

## D) Nits de fidelidad

1. La columna **"Persona"** del calendario **trunca** los nombres en el live ("Alejandro Gonza…", "Carlos Pego Muñ…"). Usa `truncate` con ancho fijo en `TeamCalendarGrid`.
2. La etiqueta del campo es **`DNI / NIE`** (con espacios), no `DNI/NIE`.
3. En la ficha de **Alba**, el campo **Puestos** aparece **vacío** en el live pese a que el Directorio la muestra como "Account Manager" — es una contradicción del propio live. Decide explícitamente qué pintas, no lo dejes implícito.

---

## E) Deriva spec ↔ plan (BAJA, pero rompe criterios de aceptación)

- El spec dice usar `StatCard` para el dashboard de costes; el plan (correctamente, porque las tarjetas del live no son StatCards) usa `ProgressBar` + composición propia.
- El spec dice `UnderlineTabs` para los tabs de ficha; el plan lo descarta por `border-brand-600`.
- El spec exige "`Avatar` reutilizado sin duplicar"; el plan lo reutiliza pero tras extenderlo con `style` para quitarle `bg-brand-600`.

Alinea el spec con lo que el plan realmente hace, o el criterio de aceptación 8 queda insatisfacible.

---

## Cosas que ya están bien (no toques)

- Los 6 costes por empresa suman **34.522,07 €** y los 19 por persona también (comprobado a mano).
- `formatCurrency` (`src/lib/format.ts`) reproduce **exactamente** la agrupación rara del live: `11.460,00 €` con punto pero `8937,68 €` sin él, porque es-ES usa `minimumGroupingDigits: 2`. El reuso es correcto — **no lo toques**.

---

## Contexto global

- Tienes spec+plan de Team generados por mí en el worktree principal: `docs/superpowers/specs/2026-07-22-team-design.md` y `docs/superpowers/plans/2026-07-22-team.md` (17 tareas). Úsalos como contraste; el informe crítico se hizo sobre esos.
- **Orden acordado:** Incidencias (ya hecho, rama `feature/incidencias`) → **Team (tuyo)** → Configuración (última).
- **Regla innegociable:** prohibido crear, editar o borrar nada en la web original (`bookings.conceptoneagency.com`). Solo navegar, pestañas y toggles.
- Reusar primitivos compartidos (`formatCurrency` de `@/lib/format`, `SegmentedControl`/`StatCard`/`Avatar` de `@/components/ui`) — no duplicarlos.
- Sin clases `brand-*` en los grises del live; botón primario `#44444C`.

---

## Cómo responder (acuse de recibo obligatorio)

Responde al mensaje de orquestación empezando por la palabra **RECIBIDO**, y luego:

1. Reformula **con tus palabras** los puntos A y B (así veo que los has entendido; no copies el texto).
2. Dime si vas a corregir la Task 1 (`avatarColor` sembrado) **antes** de seguir, o por qué no.
3. Confirma que implementarás `SegmentedControl.tone` con clase Tailwind y no con `style` inline.

Si crees que me equivoco en algo, dilo en la respuesta en vez de asumirlo.
