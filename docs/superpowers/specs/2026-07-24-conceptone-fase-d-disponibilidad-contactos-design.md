# ConceptOne · Recalco — Fase D (Disponibilidad + Contactos) · Design

**Fecha:** 2026-07-24
**Rama:** `feature/conceptone-recalco` (continúa sobre Fase C)
**Tipo:** Calco fiel al live, presentacional, en memoria. **Fase 4 de 4** — **cierra el módulo ConceptOne**.

---

## 1. Contexto y objetivo

Fase A dejó `/disponibilidad` y `/contactos` como stubs. Fase D construye ambas y **cierra el módulo**. Fuente: recon `scratchpad/recon-conceptone/` (`dispo-message.json`, `venues-full.json` 18 venues, `empresas-full.json` 117 empresas + PNGs).

### Criterios de éxito
- **Disponibilidad** (`/disponibilidad`): header + subtítulo + fecha + 10 chips de estilo + bloque MENSAJE (textarea con el texto literal + "N LIBRES" + Copiar funcional) + "CON SHOW ESE DÍA" (derivado del calendario por fecha).
- **Contactos** (`/contactos`): header + subtítulo + sub-tabs Venues | Empresas; Venues = buscador funcional + 18 tarjetas; Empresas = 117 filas alfabéticas.
- Seeds = evidencia exacta del live (18 venues, 117 empresas, mensaje literal).
- Se retiran los stubs `DisponibilidadStubPage`/`ContactosStubPage`.
- Verde total. **Cierre del módulo:** verificación Playwright ours-vs-live de las 5 pantallas + **PR única A+B+C+D** (§7).

---

## 2. Disponibilidad

### 2.1 Layout (captura `c1-disponibilidad.png`)
- Header "Disponibilidad" + subtítulo *"Elige una fecha (y estilo, si quieres) y comparte al instante qué artistas están libres."*
- **Fecha**: `<input type="date">` con label "Fecha", default **2026-07-24**.
- **Estilo (opcional)**: 10 chips toggle: Tech House · House · Deep House · Afro House · Melodic House & Techno · Techno · Hard Techno · Minimal / Deep Tech · Progressive House · Trance. Seleccionables (multi), **no recalculan la lista** (mock, D1).
- **MENSAJE**: encabezado "MENSAJE · **{N} LIBRES**" (N = nº de artistas del seed = 39) + `<textarea>` (readonly) con el texto del mensaje + botón **Copiar**.
- **CON SHOW ESE DÍA**: lista de los artistas con show en la fecha elegida (derivada de `calendarEvents` de Fase C); si ninguno → estado vacío **"Nadie tiene show esa fecha."**

### 2.2 Datos y comportamiento
- `data/disponibilidad.ts`: `const artistasLibres: string[]` (los 39 del recon, ver §2.3) y helper `mensajeDisponibilidad(fecha: Date): string` que compone:
  ```
  Disponibilidad para el {fecha larga es-ES}:

  • {artista}
  • {artista}
  …
  ```
  (encabezado con la fecha seleccionada — formato "24 de julio de 2026" vía `toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' })`; lista = `artistasLibres`.)
- **Fecha** (estado): al cambiarla, se actualiza el encabezado del mensaje y **"CON SHOW ESE DÍA"** (= `calendarEvents` con esa `date`, tipo show, mostrando artista · venue · ciudad · evento). El conteo "N LIBRES" y la lista de libres son fijos (seed, mock D1).
- **Copiar**: `navigator.clipboard.writeText(mensaje)` (funcional); feedback breve ("Copiado") con `aria-live`. (Si `navigator.clipboard` no está en el entorno de test, envolver en try/catch.)
- **Chips de estilo**: estado toggle local (visual), sin efecto en la lista (D1).

### 2.3 Mensaje literal (evidencia, textarea del live, 39 artistas)
Encabezado "Disponibilidad para el 24 de julio de 2026:" + línea en blanco + 39 líneas "• {artista}":
Aaron Martin · Abdon · ACA · Andrea Castells · ART NO LOGIA · Bassel Darwish · Bizza · Brenda Serna · Claudia Tejeda · DH Moon · Dhuna · Florentia · Fran Hernandez · Freddy Bello · Gaston Zani · Janse · Jose Fajardo · Koleto · LA CINTIA · Londonground · Los Canarios · Marcel BS · Marian Ariss · Milan · Nacho Scoppa · Olivia Bass · Parsa Jafari · Pau Guilera · Prophecy · Rivellino · Rubenus · Saldivar · Sebastian Ledher · Sera De Villalta · Sergio Saffe · SUMIA · Test Artist · Tomi & Kesh · Vidaloca.
(39 nombres → coincide con "39 LIBRES".)

---

## 3. Contactos

### 3.1 Layout (capturas `c1-contactos.png`, `c1-contactos-empresas.png`, `c1-venues-full.png`)
- Header "Contactos" + subtítulo *"Venues y empresas con las que trabaja ConceptOne."*
- **Sub-tabs** (funcionales, estado local): **Venues** | **Empresas y contactos**.

### 3.2 Venues
- Buscador `<input>` placeholder **"Buscar venue o ciudad…"** (funcional: filtra por `name` o `city`, case-insensitive).
- CTA **"+ Nuevo venue"** (inerte, D2).
- **18 tarjetas** (`VenueCard`): nombre (negrita) · dirección completa · "· {ciudad} · {país}" (omitir si null) · badges "📍 Ubicado" y/o "Aforo {n}" · botón editar ✎ (inerte). Modelo `Venue`.

### 3.3 Empresas y contactos
- CTA **"+ Nuevo…"** (inerte, D2).
- **117 filas** (`EmpresaRow`) en orden alfabético: nombre (mayúsculas tal cual) · "· {ciudad}" · "· {email o teléfono}" si existe · marcador "{n} contacto(s)" y/o "Sin datos de contacto". Chevron ▼ presente; **expansión inerte** (el live no se capturó expandido → no se inventa, D3).

### 3.4 Modelos y seed (`data/contactos.ts`)
```ts
export interface Venue { id: string; name: string; address: string; city: string | null; country: string | null; ubicado: boolean; aforo: number | null; }
export interface Empresa { id: string; name: string; city: string | null; email: string | null; phone: string | null; contactCount: number | null; sinDatos: boolean; }
export const venues: Venue[]     // 18, de venues-full.json (§3.5)
export const empresas: Empresa[] // 117, de empresas-full.json (transcribir del JSON del recon)
```

### 3.5 Venues (evidencia, 18) — `venues-full.json`
| name | city | country | ubicado | aforo |
|------|------|---------|---------|-------|
| Bassment | Madrid | España | sí | — |
| Boho Beer Garden | Birmingham | Reino Unido | sí | — |
| Casa del Mar | Isla Santa Catalina | USA | no | 600 |
| Cósmico @ SLS Barcelona | Barcelona | España | sí | 600 |
| Diverbosc | Cerdanyola del Vallès | España | sí | — |
| Edén Ibiza | Sant Antoni de Portmany | España | sí | — |
| el Tebo | Valparaiso | Chile | sí | 800 |
| Hangar 37 | San Bartolomé de Tirajana | España | sí | — |
| Hï | Illes Balears | España | sí | — |
| INPUT High Fidelity | Barcelona | España | sí | — |
| Ku Barcelona | Barcelona | España | sí | 1500 |
| La Fábrica | null | null | no | — |
| Mandarine Park | Buenos Aires | Argentina | no | — |
| Marina Beach Club | Valencia | España | sí | — |
| Marmarela | Alicante | España | sí | — |
| Paseo de Santiago, Torreperogil | Torreperogil | España | sí | 1000 |
| Selva Club | Palma | España | sí | — |
| Ushuaïa Ibiza Beach Hotel | Sant Jordi de ses Salines | España | sí | — |
(direcciones completas en `venues-full.json` — transcribir literal.)

Las **117 empresas** se transcriben de `empresas-full.json` (nombre, ciudad, email/teléfono, contactCount/sinDatos). Ejemplos de formato: "BAN MUSIC WORLDWIDE SL — Sin datos de contacto · 1 contacto" → `{ sinDatos: true, contactCount: 1 }`; "1A PROJECTS 1802 SL — Barcelona · oneartbarcelona@gmail.com" → `{ city:'Barcelona', email:'oneartbarcelona@gmail.com' }`.

---

## 4. Componentes (`src/features/booking/components/`)
- **Nuevos:** `DisponibilidadPage` (pág.), `EstiloChips`, `MensajeDisponibilidad` (textarea+Copiar); `ContactosPage` (pág. con sub-tabs), `VenueCard`, `EmpresaRow`.
- Reusar `@/components/ui` (`Card`, `Input`, `Button`, `Badge`). Sub-tabs con un toggle local (patrón del repo si existe `SegmentedControl`/tabs).
- Retirar `DisponibilidadStubPage` y `ContactosStubPage`; router `/disponibilidad`→`<DisponibilidadPage/>`, `/contactos`→`<ContactosPage/>`.

## 5. Decisiones / deltas conscientes
- **D1 — Disponibilidad mock** (Arian): UI fiel; el mensaje/lista de libres y el conteo son seed (evidencia del textarea); los chips de estilo y el cambio de fecha NO recalculan la lista (solo el encabezado del mensaje y "CON SHOW ESE DÍA" reaccionan). Copiar sí funciona.
- **D2 — CRUD/edición inertes**: "+ Nuevo venue", "+ Nuevo…", ✎ presentes e idénticos, sin acción (mock documentado, como exports/holds).
- **D3 — Expansión de empresas inerte**: el chevron ▼ se muestra; su contenido expandido no se capturó → no se implementa/invente (delta documentado).
- **D4 — Datos = evidencia**: 18 venues, 117 empresas, mensaje de 39 libres, todos literales del recon.

## 6. Testing (resumen; detalle en el plan)
- **Disponibilidad:** seed de 39 artistas → "39 LIBRES"; el mensaje contiene el encabezado con la fecha y "• Aaron Martin"; cambiar la fecha a 2026-07-18 hace que "CON SHOW ESE DÍA" liste a Los Canarios/Abdon (del calendario) y 2026-07-24 muestra "Nadie tiene show esa fecha."; Copiar invoca `clipboard.writeText`.
- **Contactos:** sub-tab Venues muestra 18 tarjetas; buscar "Barcelona" filtra por ciudad; Casa del Mar muestra "Aforo 600" sin "Ubicado"; La Fábrica sin badges ni ciudad. Sub-tab Empresas muestra 117 filas; "BAN MUSIC WORLDWIDE SL" muestra "Sin datos de contacto · 1 contacto".
- Regresión: resto de la app sin cambios; suite global verde.

## 7. Cierre del módulo ConceptOne (tras Fase D)
- Suite completa verde (tests, tsc, lint 0), árbol limpio. Anotar nº de tests.
- **Verificación Playwright ours-vs-live** de las 5 pantallas (Dashboard, Shows, Calendario, Disponibilidad, Contactos) a 1440px, login `test@blackmoose.es` **solo lectura**; ajustar spacing/tokens hasta coincidir (muestrear píxeles si falta un token). Fixes de fidelidad con su commit.
- **Abrir la PR única A+B+C+D** con base `feature/mixmag-tagmag`. Descripción: las 4 fases, la reestructura a rutas planas, y los deltas conscientes (mock exports N/A aquí; holds/CRUD/estilo/expansión inertes; Disponibilidad mock; seeds por evidencia). Avisar al coordinador con la URL.
