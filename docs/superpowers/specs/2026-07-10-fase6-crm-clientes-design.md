# Fase 6a — CRM · Clientes (calco pixel-perfect) · 2026-07-10

## Contexto

El módulo **CRM** (`/crm`) de la intranet de referencia es un stub en nuestra app
(`CRMShell` = `ModuleShell`). El CRM real del live tiene 3 tabs: **Clientes · Pipeline ·
Crecimiento**. Esta fase (6a) implementa **solo la tab Clientes**; Pipeline y Crecimiento
quedan para fases siguientes.

Referencia capturada el 2026-07-10 (login demo, sin crear/editar/borrar nada) en
`docs/references/crm/`:
- `live-clientes-list.png` — lista de organizaciones (tras buscar).
- `live-clientes-detail.png` — organización seleccionada (detalle + contactos + portal).
- `live-clientes-nueva-org-form.png` — formulario "Nueva organización".
- `live-pipeline.png`, `live-crecimiento.png` — contexto de las otras tabs (futuras fases).

Restricción del proyecto: **todo presentacional, sin persistencia** — mock estático; el
buscador y los filtros funcionan en cliente; el resto de controles (`Modificar`, `+ Añadir
persona/dirección`, `Invitar`, `Guardar`/`Cancelar` de la ficha) son inertes.

## Decisiones (confirmadas)

- **Alcance:** solo la tab **Clientes** (master-detail de organizaciones + buscador +
  filtros + panel de detalle con contactos/direcciones/portal + formulario "Nueva
  organización"). Pipeline y Crecimiento: fases posteriores.
- **Rama:** `feature/fase6-crm` (desde `feature/creativos-functional-editor`); PR sobre
  `feature/creativos-functional-editor`.
- **Interactividad:** buscador (por nombre/NIF/contacto) y filtros (Tipo, Empresa del
  grupo) **funcionan** (filtrado en cliente). Seleccionar una org muestra su detalle.
  `+ Nueva organización` abre el formulario (en el panel derecho); `Cancelar`/`Guardar`
  cierran el formulario (sin persistir). Resto inerte.
- **Marca:** brand violeta (botón `+ Nueva organización` = `Button variant="primary"`;
  fila seleccionada `bg-brand-50/60`). El live usa gris.

## Estructura (ruta `/crm`, tab "Clientes")

Shell real (patrón cruda): `AppLayout` con `module={{ name:'CRM', href:'/crm', tabs:[
Clientes, Pipeline, Crecimiento] }}` + `<Outlet/>`. Rutas: `/crm` index → `ClientesPage`;
`pipeline` y `crecimiento` → placeholders "Próximamente" (o stubs mínimos) hasta su fase.

`ClientesPage` = header + un **`MasterDetailList`** (ya existe en `@/components/ui`, encaja
1:1): `grid gap-6 lg:grid-cols-[400px_1fr]`.

### Header
- `h1` "Clientes" (`text-2xl font-semibold text-slate-800`) + `p` subtítulo "CRM del
  grupo: organizaciones (clientes, proveedores, leads) y sus contactos." (`text-sm
  text-slate-500`).

### Columna izquierda (400px) — `listTop` + lista
1. Botón `+ Nueva organización`: `Button variant="primary"` a ancho completo (`w-full
   mb-3`), abre el formulario en el panel derecho.
2. Card de filtros (`Card p-3 space-y-3` o similar): 
   - `input` buscador, placeholder "Busca por empresa, NIF o contacto…".
   - `select` **Tipo**: Todos / Clientes / Proveedores / Leads.
   - `select` **Empresa**: Cualquier empresa del grupo / Trabaja con ConceptOne / … /
     TAGMAG.
3. Lista de organizaciones (`MasterDetailList` items): cada fila (`renderRow`) = nombre
   (`font-medium text-slate-800`), NIF debajo (`text-xs text-slate-400`), y un badge de
   tipo a la derecha (Cliente/Proveedor/Lead). Fila seleccionada `bg-brand-50/60` (lo
   aporta `MasterDetailList`).
   - Estado vacío (sin búsqueda/coincidencias): el mock arranca mostrando todas o un
     empty "Busca por nombre, NIF o contacto, o usa los filtros. · N organizaciones en el
     CRM". (Decisión: mostrar la lista filtrada directamente; si el filtro deja 0, empty.)

### Panel derecho — 3 estados
`MasterDetailList` da el estado vacío (`emptyState="Selecciona una organización o crea una
nueva."`), el detalle (`renderDetail`) y el override del formulario (`detailOverride`
cuando `+ Nueva organización` está activo).

**a) Detalle de organización** (`renderDetail`, apilado `space-y-6`):
- **Card ficha:** cabecera con el nombre (`text-lg font-semibold text-slate-800`) y
  botón `Modificar` (`Button variant="secondary"`, arriba-derecha, inerte). Debajo:
  badge de tipo (pill) + "Empresa"/"Persona" (texto) + "NIF: …"; "Razón social: …"
  (`text-slate-500`); email; dirección (una línea); "Trabaja con:" + chips de empresas
  (Badge `blue`/brand).
- **Card PERSONAS DE CONTACTO:** header uppercase (`text-sm font-semibold uppercase
  tracking-wide text-slate-400`) + `+ Añadir persona` (`Button variant="secondary" size
  sm`, inerte). Cuerpo: lista de contactos o "Sin personas de contacto." (`text-sm
  text-slate-400`).
- **Card DIRECCIONES DE ENVÍO:** igual patrón + `+ Añadir dirección` / "Sin direcciones
  de envío."
- **Card PORTAL DE REPOSICIONES (CRUDA):** header + descripción + `input`
  (placeholder "email@cliente.com") + `Invitar` (`Button variant="secondary"`, inerte) +
  helper "Se le enviará un email…".

**b) Formulario "Nueva organización"** (`detailOverride`): una Card con el formulario
`grid gap-4 sm:grid-cols-2` (usa `.label/.input/.select`):
- Nombre / Razón social * (col-span-2? — en el live es 1 col: **Nombre/Razón social** |
  **Nombre comercial**) → grid 2-col: Nombre/Razón social* | Nombre comercial.
- NIF | Identificación VAT.
- Fila de tipo (col-span-2): radios **Empresa/Persona** + separador + checkboxes
  **Cliente/Proveedor/Lead** (Cliente marcado por defecto). Usar inputs nativos
  `radio`/`checkbox` con `accent-brand-600`.
- Email | Website.
- Teléfono | Móvil.
- **Buscar dirección en Google** (col-span-2): `input`, placeholder "Escribe la dirección
  y elige un resultado…" (inerte, sin autocomplete real).
- Dirección (col-span-2).
- Población | Código postal.
- Provincia | País (`select` con lista de países; España por defecto).
- **Trabaja con (empresas del grupo)** (col-span-2): chips toggle
  (`SegmentedButtons` multi) ConceptOne/CRUDA/Etra Agency/Euphoric Media/Mixmag
  Spain/TAGMAG + helper "Marca todas las empresas del grupo que dan servicio a este
  cliente.".
- Responsable ("Asignar" chip inerte, igual que el drawer de Creativos) | Referencia
  interna (`input`).
- Notas (col-span-2): `textarea class="input"`.
- **▸ Datos fiscales / facturación** (col-span-2): sección colapsable (estado local
  abierto/cerrado; contenido mínimo o placeholder — el live la muestra colapsada).
- Footer: `Guardar` (`Button variant="primary"`) + `Cancelar` (`Button
  variant="secondary"`), ambos cierran el formulario (sin persistir).

## Datos (mock, local `data/seed.ts` como cruda/creativos)

Tipo `CrmOrg`:
```ts
type OrgKind = 'Empresa' | 'Persona';
type OrgRole = 'Cliente' | 'Proveedor' | 'Lead';
interface CrmContact { id: string; name: string; role?: string; email?: string; phone?: string; }
interface CrmOrg {
  id: string;
  name: string;            // "BMG"
  legalName?: string;      // "BMG RIGHTS MANAGEMENT..."
  tradeName?: string;
  nif?: string;            // "B64730187"
  vat?: string;
  kind: OrgKind;
  roles: OrgRole[];        // ['Cliente']
  email?: string;
  website?: string;
  phone?: string;
  mobile?: string;
  address?: string;        // "C/ O'DONNELL 10 1º IZQ, Madrid, 28009, Madrid, España"
  worksWith: string[];     // ['Etra Agency']
  contacts: CrmContact[];
  shippingAddresses: string[];
}
```
Seed: ~10-14 organizaciones variadas (Clientes/Proveedores/Leads, con y sin contactos),
incluyendo BMG (Cliente, trabaja con Etra) para calcar el detalle. Empresas del grupo:
ConceptOne, CRUDA, Etra Agency, Euphoric Media, Mixmag Spain, TAGMAG.

Helpers puros (testeables): `filterOrgs(orgs, { query, role, worksWith })`.

## Unidades y límites

- `CRMShell` (real: AppLayout + tabs + Outlet).
- `ClientesPage` — compone header + MasterDetailList; estado: búsqueda, filtros, selección,
  modo "nueva org".
- `OrgListRow` — fila de la lista (nombre/NIF/badge).
- `OrgDetail` — panel de detalle (ficha + contactos + direcciones + portal).
- `OrgForm` — formulario "Nueva organización".
- `data/seed.ts` + `data/crm.ts` (tipos, seed, `filterOrgs`, constantes de empresas/roles).
- Router: `/crm` anidado con index `ClientesPage` + placeholders Pipeline/Crecimiento.

## Testing

- `filterOrgs`: por query (nombre/NIF/contacto), por rol (Cliente/Proveedor/Lead), por
  empresa ("trabaja con").
- `OrgListRow` / `OrgDetail`: render de campos, badges, secciones vacías ("Sin personas…").
- `OrgForm`: render de todos los campos; `Cliente` marcado por defecto; toggle de chips
  "Trabaja con"; colapsable "Datos fiscales"; `Cancelar`/`Guardar` llaman al callback de
  cierre.
- `ClientesPage`: buscar filtra la lista; seleccionar muestra el detalle; `+ Nueva
  organización` muestra el formulario; `Cancelar` vuelve al estado previo.
- `npm run lint` (max-warnings 0), `npx tsc --noEmit`, `npm test` en verde.

## Verificación (pixel-perfect)

`npm run dev` → `/crm`: contrastar contra `docs/references/crm/` — lista (nombre/NIF/badge),
detalle (ficha + 3 secciones), formulario "Nueva organización" (2 columnas, radios/checks,
chips "Trabaja con", colapsable, Guardar/Cancelar). Probar búsqueda y filtros.

## Riesgos / deltas intencionales

- Brand violeta (Nueva organización, fila seleccionada) vs gris del live.
- Sin Google Places real: "Buscar dirección" es un input inerte.
- Pipeline y Crecimiento: fuera de alcance (placeholders "Próximamente").
- La ficha de detalle muestra secciones de contactos/direcciones normalmente vacías en el
  mock (como el live con BMG); se puede sembrar alguna org con contactos para enseñar el
  estado con datos.
