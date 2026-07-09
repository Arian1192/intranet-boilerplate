# Boilerplate Intranet — Fase 3b: Actualización UI módulo Comunicación & PR (pixel-perfect refresh)

> **Status:** Draft pending review
> **Owner:** Pi Agent + User
> **Date:** 2026-07-09

---

## 1. Goal

La web de referencia ha cambiado desde que se diseñó la Fase 3. Este spec actualiza el módulo Comunicación & PR (`/etra`) para que replique al milímetro las 16 capturas nuevas (carpeta `C:\Users\Arian\Documents\Capturas de pantalla`, accesible en WSL como `/mnt/c/Users/Arian/Documents/Capturas de pantalla`), manteniendo las dos convenciones ya pactadas:

- **Interactividad "visual + aperturas"**: los modales y paneles de creación se abren y cierran con estado local de React para poder comparar cada pantalla capturada contra la app, pero los formularios no persisten nada y los filtros son decorativos (igual que Fases 1-3). Excepción: el detalle de acción es una **ruta real nueva** con datos de fixture.
- **Neutralidad de marca**: misma estructura, cantidades, formatos e importes que las capturas, pero con nombres genéricos (ver §8). Ningún nombre real (New Era, TATTOOX, Eduard Torres, 59FIFTY, TAGMAG, Carlos Pego, Marià Casals, blackmoose, Etra) puede aparecer en el diff.

No se toca Producción ni Booking. El dashboard de Etra (`/etra`, "Resumen") no tiene captura nueva y se queda como está.

## 2. Reference material (capturas → pantalla)

| Carpeta | Pantalla |
|---|---|
| `Etra_Acciones_Pulsar_Nueva_Accion` | Kanban de Acciones con el panel inline "Nueva tarea" abierto |
| `Etra_Acciones_pulsar_en_Accion_ya_creada` | Página de detalle de acción (desglose + comentarios) |
| `Etra_Cuentas` (5) | Master-detail: tabs Acciones, Obligaciones, Cobertura, Facturación y formulario "Nueva cuenta" |
| `Etra_Seeding_Entregas` (4) | Lista de entregas + modal "Nueva entrega" en sus 3 variantes de método |
| `Etra_Seeding_Influencers` (4) | Directorio expandible + modal Nuevo/Editar influencer |
| `Etra_Seeding_Reporte` (1) | Filtros + 6 stat cards + tabla con columna Alcance |

Sin captura (se mantienen como están, solo adaptando el estilo de tabs): dashboard Resumen, Seeding→Inventario, Cuentas→tab Datos.

## 3. Cross-cutting changes

### 3.1 EtraShell — tab "Resumen"

La nav de la referencia muestra **4 tabs**: Resumen, Acciones, Seeding, Cuentas. Añadir `{ label: 'Resumen', href: '/etra' }` al principio del array `tabs` de `EtraShell` (con matching exacto/`end` para que no quede activo en las demás rutas).

### 3.2 Nuevas primitivas compartidas (`src/components/ui/`)

| Primitiva | Uso | Estilo |
|---|---|---|
| `UnderlineTabs` | sub-tabs de Seeding y tabs del detalle de cuenta | fila `flex gap-6` sobre `border-b border-slate-200`; tab `pb-2.5 text-sm font-medium -mb-px`; activo `text-brand-700 border-b-2 border-brand-600`; inactivo `text-slate-600 hover:text-slate-800`. API idéntica a `SegmentedControl` (`options`, `value`, `onChange`). |
| `Modal` | Nueva entrega, Nuevo/Editar influencer | overlay `fixed inset-0 z-50 bg-slate-900/40` centrado; panel `w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl` con título `text-lg font-semibold`; cierra con Cancelar/overlay. Sin librería. |
| `ProgressBar` | desglose de acción, obligaciones de cuenta | track `h-2 rounded-full bg-slate-200`, fill `bg-emerald-500` (tone configurable), `value`/`max`. |
| `Select` | todos los selects de formularios/filtros (hoy hand-rolled en cada página) | mismo estilo que `Input` (h-10, `border-slate-200`, `rounded-lg`, `text-sm`), soporte `label` y `children` (options). |
| `Textarea` | Notas (cuenta, entrega, influencer), comentario de acción | mismo lenguaje visual que `Input`, soporte `label`. |

Ajustes a primitivas existentes:

- **`Badge`**: nuevo variant `rose` (`bg-rose-100 text-rose-700`) para el chip "IG · 245K".
- **`SegmentedControl`**: prop opcional `fullWidth` que lo convierte en `grid` de segmentos iguales a ancho completo (switcher "Método" del modal de entrega).
- **`StatCard`**: prop opcional `caption` (texto pequeño bajo el valor: "3 piezas", "Total 0,00 €", "2 de 2 publicados") y `valueClassName` (el valor de RETORNO va en verde `text-emerald-600`).
- **`MasterDetailList`**: props opcionales `selectedId`/`onSelect` (selección controlada — necesaria porque "＋ Nueva cuenta" toma el panel derecho), slot `listTop` (contenido encima de la card de lista: botón + card de filtro), y fila seleccionada con `bg-brand-50` en vez de `bg-slate-50`. El panel de detalle pasa a alinearse arriba (`items-start`) cuando hay contenido; el empty state sigue centrado.
- **`KanbanBoard`/`KanbanColumn`**: el acento superior de la captura es más fino que el actual `border-t-4` → `border-t-2`; el contador de columna es texto plano `text-xs text-slate-400` (sin pill). Columna "Cancelada" con acento `border-t-rose-300` (verificar visualmente en la comparación final; hoy es `border-t-slate-300`).

### 3.3 Rutas

Nueva ruta anidada en `router.tsx`:

```
/etra/tareas/:actionId  →  ActionDetailPage
```

Las tarjetas del kanban se convierten en `Link` a su detalle. El botón "Crear y abrir" del panel Nueva tarea es decorativo.

## 4. Data model (types + MockRepository)

Sin métodos nuevos de repositorio: el detalle de acción se resuelve client-side con `usePrActions()` + `find(id)`; las acciones del tab Acciones de cuenta se filtran de la misma lista. Tipos ampliados en `src/types/index.ts`:

```ts
// Acciones
export type BudgetLineStatus = 'proposed' | 'pending-payment' | 'paid';
export interface ActionBudgetLine {
  id: string;
  description: string;   // "Foto / Vídeo (Ana)", "Staff", "Talent"
  amount: number;
  status: BudgetLineStatus;
}
export interface PrAction {
  // existentes: id, title, account, type, amount, status, date
  responsible?: string;        // "Sin asignar"
  commissionPct?: number;      // 20
  includedInFee?: boolean;
  budgetLines?: ActionBudgetLine[];
}

// Seeding
export type DeliveryMethod = 'mrw' | 'hand' | 'internal';
export type DeliveryStatus = 'prepared' | 'shipped' | 'delivered';
export interface Delivery {
  id: string;
  date: string;
  account: string;
  method: DeliveryMethod;
  status: DeliveryStatus;
  published: boolean;
  recipient: string;
  itemsSummary: string;   // contenido del chip: "1× Gorra Edición Limitada · 8"
  piecesCount: number;    // para la barra de stats
  cost: number;           // gasto MRW
}
// DeliveryTag desaparece: los badges se derivan de method/status/published.

export interface Influencer {
  // existentes + :
  email?: string;
}

export interface SeedingReportRow {
  // existentes + :
  reach: number | null;   // columna Alcance ("—" cuando null)
}

// Cuentas
export interface AccountObligation {
  id: string;
  label: string;      // "Notas de prensa"
  cadence: string;    // "Mensual"
  period: string;     // "2026-07"
  done: number;       // 0
  target: number;     // 4
}
export interface CoverageItem {
  id: string;
  date: string;
  title: string;
  outlet: string;     // "Prensa Digital"
  channel: string;    // "Online"
  value: number;      // 1000
}
export interface AccountBillingMonth {
  id: string;
  label: string;              // "Jul 2026"
  retainer: number;           // 5500
  commissions: number | null; // 2000 en julio, null ("—") el resto
  others: number;             // 0
}
export interface PrAccount {
  // existentes: id, name, status, manager, crmClient, contact
  signupDate?: string;
  email?: string;
  phone?: string;
  notes?: string;
  obligations: AccountObligation[];
  coverage: CoverageItem[];
  billing: {
    defaultRetainer: number;       // 5500
    defaultCommissionPct: number;  // 20
    months: AccountBillingMonth[]; // Ene 2026 … Jul 2026 (descendente en la tabla)
  };
}
```

Derivados (calculados en página, no almacenados):

- Acción: `commission = amount × commissionPct/100` (−2000), `available = amount − commission` (8000), `spent = Σ budgetLines.amount` **incluidas las propuestas** (400+140+1500+1500 = 3540, como en la captura), `remaining = available − spent` (4460). Barra: `spent/available` ≈ 44%.
- Facturación: `total mes = retainer + (commissions ?? 0) + others`; fila Total = sumas por columna (38.500 / 2000 / 0 / 40.500 €).
- Entregas (barra stats): `N entregas`, `Σ piecesCount` piezas, `Σ cost` gasto MRW, `N published` publicados, `% retorno = published / entregas con método ≠ internal`.
- Reporte: ENVÍOS = filas, piezas = Σ pieces, costes = Σ, RETORNO = % publicados ("2 de 2 publicados"), ALCANCE TOTAL = Σ reach, COSTE POR PUBLICACIÓN = (coste prod + envío) / publicados.

Fixtures de `MockRepository` actualizados para reproducir exactamente los números de las capturas (una acción de 10.000 € al 20% "en curso" con 4 líneas de gasto; 3 entregas / 4 piezas / 2 publicadas; facturación Ene–Jul 2026 con retainer 5500 y comisión 2000 en julio; obligación "Notas de prensa 0/4"; cobertura de 1000 €). Los tests de `MockRepository.fase3.test.ts` se amplían para cubrir los campos nuevos.

## 5. Pantallas — detalle pixel-perfect

### 5.1 Acciones (`/etra/tareas`)

**Cabecera**: h1 "Acciones" + subtítulo `text-sm text-slate-500` "El trabajo diario del equipo de PR. Arrastra las tarjetas para cambiar su estado." Botón "+ Nueva acción" arriba a la derecha; al pulsarlo abre el panel "Nueva tarea" (toggle, el botón no navega).

**Filtros** (fila bajo la cabecera): selects "Todas las cuentas", "Cualquier responsable", "Todos los tipos" (`Select`, ancho auto) y el checkbox "Solo mías" **dentro de un contenedor** `flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3`.

**Panel "Nueva tarea"** (Card entre filtros y kanban):
- Cabecera: "Nueva tarea" (`font-semibold`) + X de cierre a la derecha (`text-slate-400`).
- Fila 1: "Título" (input, ~2/3) + "Cuenta" (select "Selecciona...", ~1/3).
- Fila 2 (3 columnas iguales): "Tipo" (select, default "Nota de prensa"), "Responsable" (select "Sin asignar"), "Fecha límite" (`input type="date"`).
- Fila 3: checkbox marcado "Incluida en el fee" a la izquierda; botón primario "Crear y abrir" a la derecha.

**Kanban**: 4 columnas (Planificada azul / En curso ámbar / Hecha esmeralda / Cancelada rose-300), contador plano a la derecha del label, "—" centrado en columnas vacías. Tarjeta:
- Línea 1: título `font-medium` izquierda + fecha `text-xs text-slate-400` derecha.
- Línea 2: badge slate con la cuenta + tipo como **texto plano** `text-xs text-slate-500` + `· {importe}` formateado (`10.000,00 €`) cuando `amount > 0`.
- La tarjeta entera es un `Link` a `/etra/tareas/:id`.

### 5.2 Detalle de acción (`/etra/tareas/:actionId`) — página nueva

- Link superior "← Volver a acciones" (`text-sm text-slate-500`, a `/etra/tareas`).
- **Card cabecera**: título h2; debajo fila de metadatos: badge estado ("En curso" ámbar), tipo texto plano, "Responsable: Sin asignar" (label slate-400, valor slate-700), "Límite: 16 jul 2026", pill slate "Budget 10.000,00 € · 20%". Botón secundario "Modificar acción" a la derecha (decorativo).
- **Card "Desglose de la activación"**:
  - 5 cajas en fila (grid 5 cols, `rounded-xl border p-4 text-center`): Budget `10.000,00 €` (blanca) · Comisión (20%) `−2000,00 €` (blanca) · Disponible `8000,00 €` (`bg-blue-50` valor `text-blue-700`) · Gastado `−3540,00 €` (blanca) · Restante `4460,00 €` (`bg-emerald-50` valor `text-emerald-700`). Valor `font-semibold` arriba, label `text-xs text-slate-500` debajo. La etiqueta de comisión es neutral: "Comisión agencia (20%)".
  - `ProgressBar` esmeralda (3540/8000) con "Gastado 3540,00 €" a la izquierda y "Queda 4460,00 € de 8000,00 €" a la derecha (`text-xs text-slate-400`).
  - **Líneas de gasto** (una fila por `budgetLine`): descripción en input readonly-style (`font-medium`), importe alineado a la derecha + "€", select de estado **coloreado**: Abonado `bg-emerald-100 text-emerald-800`, Pendiente abonar `bg-amber-100 text-amber-800`, Propuesto blanco; icono comentario (`MessageCircle` slate-300), link "adjuntar" con icono clip (`text-slate-400 text-xs`), X de borrado.
  - **Fila de alta**: inputs "Descripción" / "0" / select "Propuesto" / "Proveedor" / "Enlace"; segunda línea input ancho "Notas internas (opcional)" + botón primario "Añadir línea".
- **Card "Comentarios"**: heading, texto vacío "Sin comentarios. Menciona a alguien con @Nombre." (`text-sm text-slate-500`), `Textarea` placeholder "Escribe un comentario... usa @Nombre para mencionar" + botón primario "Enviar" abajo a la derecha.
- Si el `:actionId` no existe en fixtures → estado vacío con el link de volver.

### 5.3 Seeding (`/etra/seeding`)

Los 4 sub-tabs pasan de `SegmentedControl` a **`UnderlineTabs`**. Inventario no cambia de contenido.

**Entregas**:
- Barra de stats (`text-sm text-slate-500`, números `font-semibold text-slate-800`): "3 entregas · 4 piezas · Gasto MRW 0,00 € · 2 publicados · 100% retorno" a la izquierda; botón primario "+ Nueva entrega" a la derecha (abre el modal).
- Card de filtros: `Select` "Todos los métodos" (estrecho) · `Select` "Todos los clientes" (flexible, notablemente ancho como en la captura) · `Select` "Todos los influencers" · `Input` "Filtrar por modelo...".
- Filas (Card por entrega):
  - Línea 1: "07 jul 2026 · Cliente A" (`text-xs text-slate-400`) + badges: método ("Uso interno" ámbar / "Envío MRW" azul), y si método ≠ interno: estado ("Entregado" esmeralda) y "Publicado" (esmeralda).
  - Línea 2: destinatario `font-medium` + icono info slate (solo si tiene email/notas) + flecha "→" `text-slate-300` + chip slate con `itemsSummary` ("1× Gorra Edición Limitada · 8").
  - Derecha: entregas internas → botón secundario "Editar" + X; envíos MRW → importe "0,00 €" (`text-sm text-slate-500`) + select de estado ("Entregado") + X.
- **Modal "Nueva entrega"** (`Modal`): switcher "Método" (`SegmentedControl fullWidth`: Envío MRW / Entrega en mano / Uso interno) que **cambia los campos visibles**:
  - Comunes: "Cliente / campaña" (input "Cliente (opcional)..."), "Piezas" (select "Referencia..." + input qty "1" + link `+ Añadir pieza` en brand), "Fecha" (date, hoy), "Notas".
  - Envío MRW: + "Influencer *" (select "Selecciona..."), "Estado" (select "Preparado"), fila Transportista ("MRW") / Tracking / Coste (€) ("0"); label Notas simple.
  - Entrega en mano: + "Influencer *", "Estado"; label "Notas (lugar / evento...)".
  - Uso interno: + "¿Quién se lo queda? *" (select "Persona del equipo..." + input "...o escribe un nombre"); sin Estado/Transportista.
  - Pie: "Crear entrega" (primario) + "Cancelar".

**Influencers**:
- Fila superior: `Input` "Buscar influencer..." (ancho fijo ~256px) · "2 en el directorio" (`text-sm text-slate-400`) · botón primario "+ Añadir influencer" a la derecha (abre modal en modo alta).
- Grid 2 columnas de cards **expandibles** (estado local por card, chevron `v`/`^` arriba a la derecha):
  - Colapsada: avatar circular con iniciales (`bg-brand-50 text-brand-700`), nombre `font-medium`, chips: "IG · 245K" (`Badge rose sm`) y "TT · 26,2K" (`Badge neutral sm`).
  - Expandida: + separador, fila email con icono sobre (`text-sm text-slate-600`), links "Editar" (brand, abre modal en modo edición) y "Eliminar" (slate-400, decorativo).
- **Modal "Nuevo influencer" / "Editar influencer"** (mismo componente, `initialValues` opcionales):
  - Círculo de foto con overlay "Hacer foto" y caption "Foto" + "Nombre *" (input, autofocus, borde brand al foco).
  - "Redes sociales" con help `text-xs text-slate-400` "Los seguidores se actualizan a mano; se guarda la fecha automáticamente." Filas dinámicas: select red (Instagram/TikTok) + input "@handle o URL" + input "Seguid." + X (en edición, precargadas con las URLs/cifras del fixture); link `+ Añadir red`.
  - Fila 3 cols: "Talla ropa" ("S/M/L...") / "Talla gorra" ("7⅜ / M-L...") / "Talla calzado" ("43...").
  - "Email" / "Teléfono" (2 cols), "Dirección de envío", "Notas".
  - Pie: "Guardar" + "Cancelar".

**Reporte**:
- Fila de filtros: "Cliente" (input "Todos los clientes..."), "Desde" (date `01/01/2026`), "Hasta" (date hoy), cada uno con label encima; botón primario "Exportar PDF" a la derecha (decorativo).
- **Stat cards** (grid 4 + 2, `StatCard`): ENVÍOS `2` caption "3 piezas" · COSTE PRODUCTO REGALADO `0,00 €` · GASTO MRW `0,00 €` caption "Total 0,00 €" · RETORNO `100%` en `text-emerald-600` caption "2 de 2 publicados" · ALCANCE TOTAL `0` · COSTE POR PUBLICACIÓN `0,00 €`.
- Tabla: columnas actuales + **"Alcance"** al final (alineada derecha, "—" cuando `reach` es null).

### 5.4 Cuentas (`/etra/cuentas`)

**Cabecera**: h1 + subtítulo "Cuentas y marcas que gestiona el equipo: acciones de PR, cobertura y facturación." (sin botón en la cabecera — el botón vive en la columna izquierda).

**Columna izquierda** (`listTop` del `MasterDetailList`):
- Botón primario **a ancho completo** "+ Nueva cuenta" (activa el modo alta en el panel derecho y deselecciona la cuenta).
- Card de filtro: label "Estado" + `Select` "Todas".
- Card de lista: filas con nombre `font-medium` + subtítulo `text-xs text-slate-400` (crmClient) + badge "Activa" esmeralda; fila seleccionada `bg-brand-50`.

**Panel derecho — modo alta ("Nueva cuenta")**, sustituye al detalle:
- Título "Nueva cuenta". Grid 2 columnas: "Nombre (marca) *" / "Cliente del CRM" (con link "Abrir CRM ↗" `text-xs text-brand-600` a la derecha del label, input "Buscar o crear cliente...", help "Busca el cliente del CRM. Si no existe, escríbelo y créalo al momento.") · "Responsable" / "Estado" (select "Activa") · "Fecha de alta" (date) / "Contacto" · "Email de contacto" / "Teléfono de contacto" · "Notas" (`Textarea` a doble columna). Pie: "Guardar" (primario) + "Cancelar" (vuelve al empty state).

**Panel derecho — detalle de cuenta**: nombre `text-lg font-semibold` + badge "Activa" a la derecha del panel; **`UnderlineTabs`** (Datos · Acciones · Obligaciones · Cobertura · Facturación):

- **Datos** (sin captura): `dl` actual ampliado con los campos nuevos (fecha de alta, email, teléfono, notas).
- **Acciones**: card-formulario: fila 1 "Título de la acción" (ancho) / "Tipo" (select "Nota de prensa") / "Fecha límite" (date); fila 2 "Responsable" (select "Sin asignar") + checkbox marcado "Incluida en fee" + botón primario "Crear" (ancho, decorativo). Debajo, lista de acciones de la cuenta (de `usePrActions` filtradas por `account`): fecha `text-xs text-slate-400` izquierda, título `font-medium` con tipo debajo, badge de estado a la derecha.
- **Obligaciones**: fila "KPIS / OBLIGACIONES" (`text-xs uppercase tracking-wide text-slate-400`) + botón secundario "Modificar obligaciones"; card por obligación: label `font-medium` izquierda, "Mensual · 2026-07" `text-xs text-slate-400` derecha; debajo `ProgressBar` (done/target) + input numérico estrecho con el valor `0` + "/ 4" (`text-sm text-slate-400`).
- **Cobertura**: card-formulario: fila 1 "Medio" / "Título" / "Tipo" (select "Online") / "Valor (€)" ("0"); fila 2 "Fecha" (date) / "Enlace" ("https://...", ancho) / botón primario "Añadir". Línea derecha "Valor total de cobertura: **1000,00 €**" (`text-xs text-slate-400`, valor `font-semibold text-slate-800`). Lista: fecha izquierda, título `font-medium` + "Prensa Digital · Online" debajo, valor "1000,00 €" + X a la derecha.
- **Facturación**:
  - Card superior: inputs "Retainer mensual (por defecto)" (`5500`) y "Comisión por budget (por defecto) %" (`20`) + botón primario "Guardar"; help de dos líneas (`text-xs text-slate-400`): "El retainer es el fee mensual pactado (se aplica cada mes activo; puedes ajustar un mes concreto en la tabla de abajo). La comisión por defecto se aplica a las acciones nuevas con budget de esta cuenta, y sigue siendo editable en cada acción."
  - Banner fórmula (`bg-slate-50 rounded-lg px-4 py-3 text-sm`): "Ingresos = **retainer** (5500,00 €/mes por defecto) + **comisiones** de acciones con budget + otros."
  - Tabla mensual (Jul 2026 → Ene 2026): cabecera MES / RETAINER / COMISIONES / OTROS / TOTAL (`text-xs uppercase text-slate-400`, fondo `bg-slate-50`); RETAINER y OTROS como inputs numéricos bordeados alineados a la derecha; COMISIONES texto ("2000,00 €" o "—"); TOTAL `font-medium` derecha. Fila **Total** con borde superior y `font-semibold` (38.500,00 € / 2000,00 € / 0,00 € / 40.500,00 €).
  - Nota al pie (`text-xs text-slate-400`): "El retainer y \"otros\" son editables por mes (otros admite negativos para restar). Las comisiones se calculan solas desde las acciones."

## 6. Architecture

```
src/features/etra/
├── components/
│   ├── NewActionPanel.tsx        # panel inline "Nueva tarea"
│   ├── ActionKanbanCard.tsx      # tarjeta con link al detalle
│   ├── ActionBreakdownCard.tsx   # desglose de la activación (cajas, barra, líneas)
│   ├── ActionCommentsCard.tsx
│   ├── DeliveryRow.tsx
│   ├── DeliveryFormModal.tsx     # "Nueva entrega", 3 variantes por método
│   ├── InfluencerCard.tsx        # expandible
│   ├── InfluencerFormModal.tsx   # alta y edición
│   ├── AccountForm.tsx           # "Nueva cuenta"
│   ├── account-tabs/
│   │   ├── AccountActionsTab.tsx
│   │   ├── AccountObligationsTab.tsx
│   │   ├── AccountCoverageTab.tsx
│   │   └── AccountBillingTab.tsx
│   └── index.ts
├── pages/
│   ├── ActionsPage.tsx           # actualizada
│   ├── ActionDetailPage.tsx      # nueva
│   ├── SeedingPage.tsx           # actualizada (UnderlineTabs + sub-vistas ricas)
│   ├── AccountsPage.tsx          # actualizada (listTop, modo alta, tabs reales)
│   └── EtraDashboardPage.tsx     # sin cambios
└── hooks/                        # sin cambios de firma
```

El tab "Datos" se queda inline en `AccountsPage` (es un `dl` corto); los otros 4 tabs tienen componente propio por tamaño.

## 7. Testing

- Smoke tests de las primitivas nuevas: `UnderlineTabs` (cambio de tab), `Modal` (render + cierre), `ProgressBar`, `Select`, `Textarea`.
- `ActionsPage`: el botón "+ Nueva acción" muestra/oculta el panel "Nueva tarea"; la tarjeta enlaza a `/etra/tareas/:id`.
- `ActionDetailPage`: renderiza los 5 importes del desglose calculados desde el fixture (10.000 / −2000 / 8000 / −3540 / 4460); id inexistente → estado vacío.
- `SeedingPage`: los tests de cambio de sub-tab existentes se adaptan a `UnderlineTabs`; abrir modal de entrega y comprobar que el switcher de método cambia los campos (Transportista solo en Envío MRW, "¿Quién se lo queda?" solo en Uso interno); card de influencer expande al click.
- `AccountsPage`: "+ Nueva cuenta" muestra el formulario y deselecciona; cada tab renderiza su contenido clave (tabla de facturación con fila Total, obligación 0/4, valor total de cobertura).
- `MockRepository.fase3.test.ts`: cubre los campos nuevos de los fixtures.
- Los tests existentes de Fase 1-3 siguen pasando (`npm run lint`, `npm run test`, `npm run build`).

## 8. Brand neutrality (mapa de sustitución)

| Real (capturas) | Genérico (fixtures) |
|---|---|
| New Era / TATTOOX | Cliente A / Cliente B |
| Eduard Torres, Marià Casals, Carlos Pego | Carlos Ruiz, María García, Ana López |
| 59FIFTY Madrid (acción) | Acción de prensa Cliente A (fixture existente, ahora con budget 10.000 €) |
| 1× 59FIFTY · 8 (chip pieza) | 1× Gorra Edición Limitada · 8 |
| Foto / Vídeo (Manel) | Foto / Vídeo (Ana) |
| TAGMAG (medio) | Prensa Digital |
| La gorra del mes (cobertura) | Mención en medios |
| "equipo de Etra" / "gestiona Etra" / "Comisión Etra" | "equipo de PR" / "gestiona el equipo" / "Comisión agencia" |
| eduardtorreshernandez@gmail.com | carlos.ruiz@example.com |
| blackmoose (wordmark) | ya cubierto por `APP_NAME` |

Importes, fechas, porcentajes, contadores y formatos se copian tal cual de las capturas.

## 9. Out of scope

- Persistencia real de formularios, drag & drop del kanban, filtros funcionales, subida de foto/adjuntos, export PDF real, @menciones funcionales.
- Módulo Producción, Booking, dashboard Resumen de Etra (sin capturas nuevas).
- Tab Datos de cuenta e Inventario de Seeding: sin captura → solo se adapta el estilo de tabs, no el contenido.

## 10. Acceptance criteria

- [ ] Nav de Etra con 4 tabs (Resumen · Acciones · Seeding · Cuentas); Resumen activo solo en `/etra`.
- [ ] `/etra/tareas` replica la captura: subtítulo, filtros (checkbox en contenedor), panel "Nueva tarea" que abre/cierra, tarjeta kanban con importe y link.
- [ ] `/etra/tareas/:id` replica la captura del detalle: cabecera con metadatos y pill de budget, 5 cajas con los importes exactos, barra de progreso, 4 líneas de gasto con selects coloreados, fila de alta y card de comentarios.
- [ ] `/etra/seeding` replica las 9 capturas: underline tabs, stats de entregas, filas ricas, modal de entrega con 3 variantes, directorio de influencers expandible con modal de alta/edición, reporte con 6 stat cards y columna Alcance.
- [ ] `/etra/cuentas` replica las 5 capturas: columna izquierda (botón + filtro + lista con subtítulo y selección morada), formulario Nueva cuenta, y los 4 tabs capturados con sus formularios, tablas y totales exactos.
- [ ] Ningún nombre real de marca/persona/medio en el diff (§8).
- [ ] `npm run lint`, `npm run test` y `npm run build` pasan.
