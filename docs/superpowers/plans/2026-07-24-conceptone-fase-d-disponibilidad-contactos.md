# ConceptOne Recalco · Fase D (Disponibilidad + Contactos) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir `/disponibilidad` (generador de mensaje mock-fiel) y `/contactos` (sub-tabs Venues 18 + Empresas 117), cerrar los stubs, y **cerrar el módulo ConceptOne** (verificación ours-vs-live + PR única A+B+C+D).

**Architecture:** Datos en `src/features/booking/data/` (`disponibilidad.ts`, `contactos.ts`); páginas `DisponibilidadPage`/`ContactosPage` con componentes `EstiloChips`/`MensajeDisponibilidad`/`VenueCard`/`EmpresaRow`; reuso de `calendarEvents` (Fase C) para "CON SHOW ESE DÍA". Seeds = evidencia de los JSON del recon. Acciones CRUD/edición/estilo/expansión inertes (mock).

**Tech Stack:** React 19, react-router 7, Tailwind, Vitest + RTL + jest-dom, TypeScript.

## Global Constraints

- Es-ES; un commit por tarea; cada tarea verde: `npx vitest run`, `npx tsc --noEmit`, `npm run lint` (0 warnings).
- Fuente de verdad: spec `docs/superpowers/specs/2026-07-24-conceptone-fase-d-disponibilidad-contactos-design.md` + JSON del recon en `/tmp/claude-1000/-home-arian-dev-Boilerplate/9b96e610-f0d5-4231-865d-5d1bf52e5b83/scratchpad/recon-conceptone/` (`dispo-message.json`, `venues-full.json`, `empresas-full.json`) + PNGs.
- **Seeds = evidencia EXACTA:** 39 artistas libres (spec §2.3), 18 venues (spec §3.5 + direcciones de `venues-full.json`), 117 empresas (transcribir TODAS de `empresas-full.json`). No inventar; no truncar.
- **Mock (spec D1-D3):** chips de estilo y lista de libres no recalculan; "+ Nuevo venue"/"+ Nuevo…"/✎ inertes; chevron ▼ de empresas inerte. **Copiar sí funciona** (`navigator.clipboard.writeText`). Buscador de Venues y sub-tabs funcionales.
- Reusar `@/components/ui`. NO tocar Fases A-C. Default fecha Disponibilidad = **2026-07-24**.

---

### Task 1: Disponibilidad (data + página + Copiar + "CON SHOW ESE DÍA")

**Files:**
- Create: `src/features/booking/data/disponibilidad.ts` + `disponibilidad.test.ts`
- Create: `src/features/booking/components/EstiloChips.tsx`, `MensajeDisponibilidad.tsx`
- Create: `src/features/booking/pages/DisponibilidadPage.tsx` + `DisponibilidadPage.test.tsx`
- Modify: `src/features/booking/pages/index.ts`, `src/features/booking/components/index.ts`, `src/app/router.tsx`
- Delete: `src/features/booking/pages/DisponibilidadStubPage.tsx`

**Interfaces:**
- `artistasLibres: string[]` (39). `mensajeDisponibilidad(fecha: Date): string`. `ESTILOS: string[]` (10). `showsEnFecha(dateISO: string)` → usa `calendarEvents` (import de `../data/calendar`) filtrando `type==='show'`.

- [ ] **Step 1: Test de datos (fallará)**
```ts
import { describe, it, expect } from 'vitest';
import { artistasLibres, mensajeDisponibilidad, ESTILOS } from './disponibilidad';

describe('disponibilidad', () => {
  it('39 artistas libres (evidencia del textarea del live)', () => {
    expect(artistasLibres).toHaveLength(39);
    expect(artistasLibres[0]).toBe('Aaron Martin');
    expect(artistasLibres).toContain('Tomi & Kesh');
  });
  it('10 estilos', () => {
    expect(ESTILOS).toHaveLength(10);
    expect(ESTILOS).toEqual(['Tech House','House','Deep House','Afro House','Melodic House & Techno','Techno','Hard Techno','Minimal / Deep Tech','Progressive House','Trance']);
  });
  it('el mensaje lleva el encabezado con la fecha y las viñetas', () => {
    const msg = mensajeDisponibilidad(new Date('2026-07-24T00:00:00'));
    expect(msg).toContain('Disponibilidad para el 24 de julio de 2026:');
    expect(msg).toContain('• Aaron Martin');
    expect(msg.trim().split('\n').filter((l) => l.startsWith('• '))).toHaveLength(39);
  });
});
```

- [ ] **Step 2: Ejecutar → falla.** Run: `npx vitest run src/features/booking/data/disponibilidad.test.ts` → FAIL.

- [ ] **Step 3: Implementar `disponibilidad.ts`** con los 39 artistas (spec §2.3, EXACTOS y en orden) y:
```ts
export const ESTILOS = ['Tech House','House','Deep House','Afro House','Melodic House & Techno','Techno','Hard Techno','Minimal / Deep Tech','Progressive House','Trance'];
export const artistasLibres = ['Aaron Martin','Abdon','ACA','Andrea Castells','ART NO LOGIA','Bassel Darwish','Bizza','Brenda Serna','Claudia Tejeda','DH Moon','Dhuna','Florentia','Fran Hernandez','Freddy Bello','Gaston Zani','Janse','Jose Fajardo','Koleto','LA CINTIA','Londonground','Los Canarios','Marcel BS','Marian Ariss','Milan','Nacho Scoppa','Olivia Bass','Parsa Jafari','Pau Guilera','Prophecy','Rivellino','Rubenus','Saldivar','Sebastian Ledher','Sera De Villalta','Sergio Saffe','SUMIA','Test Artist','Tomi & Kesh','Vidaloca'];
export function mensajeDisponibilidad(fecha: Date): string {
  const larga = fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  return `Disponibilidad para el ${larga}:\n\n` + artistasLibres.map((a) => `• ${a}`).join('\n');
}
```

- [ ] **Step 4: Ejecutar → verde.**

- [ ] **Step 5: Test de `DisponibilidadPage` (fallará)**
```tsx
it('muestra 39 LIBRES, el mensaje, y "CON SHOW ESE DÍA" reacciona a la fecha', async () => {
  render(<MemoryRouter><DisponibilidadPage /></MemoryRouter>);
  expect(screen.getByText(/39 LIBRES/)).toBeInTheDocument();
  expect(screen.getByText('Nadie tiene show esa fecha.')).toBeInTheDocument(); // 2026-07-24
  fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: '2026-07-18' } });
  expect(screen.getByText(/Los Canarios/)).toBeInTheDocument(); // shows del 18-jul (calendario)
  expect(screen.queryByText('Nadie tiene show esa fecha.')).not.toBeInTheDocument();
});
it('Copiar invoca clipboard.writeText con el mensaje', () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.assign(navigator, { clipboard: { writeText } });
  render(<MemoryRouter><DisponibilidadPage /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Copiar' }));
  expect(writeText).toHaveBeenCalledWith(expect.stringContaining('• Aaron Martin'));
});
```

- [ ] **Step 6: Ejecutar → falla.**

- [ ] **Step 7: Implementar** `EstiloChips` (10 chips toggle, estado local, sin efecto en la lista — D1), `MensajeDisponibilidad` (encabezado "MENSAJE · {n} LIBRES" + `<textarea readOnly>` con el mensaje + botón "Copiar" que hace `navigator.clipboard?.writeText(mensaje)` en try/catch + feedback `aria-live`), y `DisponibilidadPage` (header + subtítulo + `<input type="date" aria-label="Fecha">` default 2026-07-24 + `EstiloChips` + `MensajeDisponibilidad` + sección "CON SHOW ESE DÍA" que lista `calendarEvents` con esa `date` y `type==='show'`, o "Nadie tiene show esa fecha." si ninguno). El "N LIBRES" = `artistasLibres.length`.

- [ ] **Step 8: Swap del stub** en `router.tsx` (`/disponibilidad` → `<DisponibilidadPage/>`), `pages/index.ts` (exportar `DisponibilidadPage`, quitar `DisponibilidadStubPage`), borrar `DisponibilidadStubPage.tsx`, exportar los componentes nuevos.

- [ ] **Step 9: Verde total.** Run: `npx vitest run src/features/booking && npx tsc --noEmit && npm run lint` → PASS. (`grep -rn DisponibilidadStubPage src` → sin refs.)

- [ ] **Step 10: Commit** `feat(conceptone): Disponibilidad (generador de mensaje mock-fiel + CON SHOW ESE DÍA del calendario)`

---

### Task 2: Contactos — modelos + seed (18 venues + 117 empresas)

**Files:**
- Create: `src/features/booking/data/contactos.ts` + `contactos.test.ts`
- Modify: `src/types/index.ts` (si se prefiere ubicar `Venue`/`Empresa` en @/types; alternativamente exportarlos desde `contactos.ts`)

**Interfaces:** `Venue`, `Empresa` (spec §3.4), `venues: Venue[]` (18), `empresas: Empresa[]` (117).

- [ ] **Step 1: Test del seed (fallará)**
```ts
import { venues, empresas } from './contactos';
it('18 venues con badges de evidencia', () => {
  expect(venues).toHaveLength(18);
  const casa = venues.find((v) => v.name === 'Casa del Mar')!;
  expect(casa).toMatchObject({ city: 'Isla Santa Catalina', country: 'USA', ubicado: false, aforo: 600 });
  const fab = venues.find((v) => v.name === 'La Fábrica')!;
  expect(fab).toMatchObject({ city: null, country: null, ubicado: false, aforo: null });
  const ku = venues.find((v) => v.name === 'Ku Barcelona')!;
  expect(ku).toMatchObject({ ubicado: true, aforo: 1500 });
});
it('117 empresas en orden alfabético con formato de contacto', () => {
  expect(empresas).toHaveLength(117);
  expect(empresas[0].name).toBe('1A PROJECTS 1802 SL');
  const ban = empresas.find((e) => e.name === 'BAN MUSIC WORLDWIDE SL')!;
  expect(ban).toMatchObject({ sinDatos: true, contactCount: 1 });
  const primera = empresas.find((e) => e.name === '1A PROJECTS 1802 SL')!;
  expect(primera).toMatchObject({ city: 'Barcelona', email: 'oneartbarcelona@gmail.com' });
});
```

- [ ] **Step 2: Ejecutar → falla.**

- [ ] **Step 3: Implementar `contactos.ts`.**
  - Definir `Venue`/`Empresa` (spec §3.4).
  - `venues`: 18 entradas — nombre/ciudad/país/ubicado/aforo de spec §3.5, y **`address` transcrito literal de `venues-full.json`** (leer ese JSON del scratchpad; NO inventar direcciones).
  - `empresas`: **transcribir las 117 de `empresas-full.json`** (leer el JSON del scratchpad). Mapear cada entrada: `name`, `city` (o null), `email`/`phone` (según sea correo o teléfono; null si no hay), `contactCount` (de "N contacto(s)", o null), `sinDatos` (true si "Sin datos de contacto"). Mantener el orden alfabético del JSON. (NO teclear a mano 117: leer el JSON y generarlas.)

- [ ] **Step 4: Ejecutar → verde.** Run: `npx vitest run src/features/booking/data/contactos.test.ts && npx tsc --noEmit` → PASS.

- [ ] **Step 5: Commit** `feat(conceptone): datos Contactos (18 venues + 117 empresas, evidencia del live)`

---

### Task 3: Contactos — página con sub-tabs + VenueCard + EmpresaRow + buscador

**Files:**
- Create: `src/features/booking/components/VenueCard.tsx`, `EmpresaRow.tsx`
- Create: `src/features/booking/pages/ContactosPage.tsx` + `ContactosPage.test.tsx`
- Modify: `pages/index.ts`, `components/index.ts`, `router.tsx`
- Delete: `src/features/booking/pages/ContactosStubPage.tsx`

**Interfaces:** `VenueCard({ venue })`, `EmpresaRow({ empresa })`, `ContactosPage` (estado `tab: 'venues'|'empresas'` + `query` para Venues).

- [ ] **Step 1: Test (fallará)**
```tsx
it('sub-tabs; Venues 18 + buscador; Empresas 117', () => {
  render(<MemoryRouter><ContactosPage /></MemoryRouter>);
  expect(screen.getByText('Venues y empresas con las que trabaja ConceptOne.')).toBeInTheDocument();
  // Venues por defecto
  expect(screen.getByText('Casa del Mar')).toBeInTheDocument();
  expect(screen.getByText('Aforo 600')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Buscar venue o ciudad…'), { target: { value: 'Valencia' } });
  expect(screen.getByText('Marina Beach Club')).toBeInTheDocument();
  expect(screen.queryByText('Casa del Mar')).not.toBeInTheDocument();
  // cambiar a Empresas
  fireEvent.click(screen.getByRole('button', { name: 'Empresas y contactos' }));
  expect(screen.getByText('BAN MUSIC WORLDWIDE SL')).toBeInTheDocument();
  expect(screen.getByText(/Sin datos de contacto/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Ejecutar → falla.**

- [ ] **Step 3: Implementar** `VenueCard` (nombre + address + "· {city} · {country}" si no null + badges "📍 Ubicado" si `ubicado` y "Aforo {aforo}" si `aforo` + botón ✎ inerte), `EmpresaRow` (nombre + "· {city}" + "· {email||phone}" si hay + marcador "{contactCount} contacto(s)"/"Sin datos de contacto"; chevron ▼ inerte — comentar delta D3), y `ContactosPage` (header + subtítulo + sub-tabs "Venues"/"Empresas y contactos" (botones, estado `tab`); en Venues: buscador `placeholder="Buscar venue o ciudad…"` que filtra por `name`/`city` + grid de `VenueCard` + CTA "+ Nuevo venue" inerte; en Empresas: CTA "+ Nuevo…" inerte + lista de `EmpresaRow`).

- [ ] **Step 4: Swap del stub** (`router.tsx` `/contactos` → `<ContactosPage/>`, `pages/index.ts`, borrar `ContactosStubPage.tsx`).

- [ ] **Step 5: Verde total.** Run: `npx vitest run src/features/booking && npx tsc --noEmit && npm run lint` → PASS. (`grep -rn ContactosStubPage src` → sin refs.)

- [ ] **Step 6: Commit** `feat(conceptone): Contactos (sub-tabs Venues/Empresas + VenueCard + EmpresaRow + buscador)`

---

### Task 4: Cierre del módulo ConceptOne (verificación ours-vs-live + PR única)

**Files:** ninguno de producción salvo fixes de fidelidad.

- [ ] **Step 1: Suite completa verde.** Run: `npx vitest run && npx tsc --noEmit && npm run lint` → PASS, 0 warnings, `git status` limpio. Anotar nº de tests (debe superar los 334 de Fase C).

- [ ] **Step 2: Verificación Playwright ours-vs-live (formal, las 5 pantallas)**
Levantar `npm run dev`; con Playwright a 1440px, navegar en local y en `https://bookings.conceptoneagency.com` (login `test@blackmoose.es`, **SOLO LECTURA** — NO pulsar Guardar/crear/editar/borrar/Copiar/+Añadir show/+Hold) a: `/conceptone` (Dashboard 6 tiles + 4 secciones), `/shows` (14 cards + filtros + rango), `/calendario-c1` (grid julio + agenda + hold), `/disponibilidad` (mensaje + CON SHOW ESE DÍA), `/contactos` (Venues + Empresas). Comparar contra `scratchpad/recon-conceptone/*.png`. Ajustar spacing/tokens/tipografía hasta coincidir (muestrear píxeles del PNG si falta un token).

- [ ] **Step 3: Fixes de fidelidad** (si los hay) con su commit `fix(conceptone): fidelidad ours-vs-live (cierre módulo)`.

- [ ] **Step 4: Abrir la PR única A+B+C+D**
Base `feature/mixmag-tagmag`. Descripción: las 4 fases (reestructura rutas planas + dashboard financiero; Shows; Calendario; Disponibilidad+Contactos), la tabla de fidelidad, y los deltas conscientes (holds/CRUD/edición/estilo/expansión inertes; Disponibilidad mock; tiles standalone; seeds por evidencia; HOY fijo). Terminar el cuerpo con la firma de Claude Code.

- [ ] **Step 5: Avisar al coordinador (herdr)**
`herdr agent prompt w1:p1 "[w4:p1 · conceptone] HITO FINAL: módulo ConceptOne cerrado (Fases A-D), N tests verdes, verificación ours-vs-live hecha, PR única abierta: <URL>."`

---

## Notas de decisión (spec §5)
- **D1** Disponibilidad mock (lista/estilo no recalculan; Copiar sí funciona). **D2** CRUD/edición inertes. **D3** expansión de empresas inerte. **D4** seeds = evidencia (39 libres, 18 venues, 117 empresas).
- Los seeds grandes (venues addresses, 117 empresas) se GENERAN leyendo los JSON del recon (`venues-full.json`, `empresas-full.json`) — no teclear a mano; verificar contra los tests de conteo/spot-check.
```
