# `/personal/usuarios` — las 11 cajas de permisos por módulo (evidencia del live)

**Capturado:** 2026-07-30, ~09:2x CEST · viewport 1440×1100 · Playwright/Chromium
**Ruta:** `/personal/usuarios`, alcanzada **por clic** desde `Configuración > SISTEMA > "Cuentas (auditoría)"`
(verificado: el clic aterriza en `/personal/usuarios`; la URL directa también funciona hoy).
**Encargo:** el volcado DOM anterior se truncaba a 20 000 caracteres y no llegaba a estas cajas.
Este volcado **no está truncado** (`main` completo = 52 754 bytes).

## Ficheros de evidencia

| Fichero | Qué es |
|---|---|
| `live-usuarios-full.png` | Pantalla completa (`fullPage`) |
| `live-usuarios-permisos-grid.png` | Recorte de **solo** el grid de las 11 cajas |
| `live-usuarios-permisos-caja1.png` | Recorte de la caja «Etra Agency» |
| `live-usuarios-titulo-caja-4x.png` | Título «Etra Agency» a `deviceScaleFactor: 4` (para muestreo de píxel) |
| `live-usuarios-main.html` | `main.outerHTML` **íntegro**, sin truncar |
| `live-usuarios-permisos-grid.html` | Solo el subárbol del grid de permisos (11 370 bytes) |
| `live-usuarios-upper-labels.json` | Todas las etiquetas en mayúsculas de la pantalla con su `getComputedStyle` |

## RESPUESTA AL ENCARGO: el color de los títulos es `slate-400`, NO `brand-600`

Dos medidas independientes coinciden:

1. **Clase + estilo computado** (`getComputedStyle`) de los 11 títulos:
   ```
   class = "mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400"
   color = rgb(148, 163, 184)   font-size = 12px   font-weight = 600
   letter-spacing = 0.3px       text-transform = uppercase
   ```
2. **Muestreo de píxel con PIL** sobre `live-usuarios-titulo-caja-4x.png` (1040×64):
   el píxel más oscuro del glifo es exactamente **`#94A3B8` = `slate-400`**
   (5 173 píxeles con ese valor exacto; fondo `(251,252,253)`).

Es el **mismo** `slate-400` que ya se confirmó para los títulos de los bloques de matriz
(`ConceptOne · Navegación`, `ConceptOne · Ficha de show`, …), que usan
`text-xs font-semibold uppercase tracking-wide text-slate-400` dentro de `border-b border-slate-100 px-3 py-2`.

> **Acción para la PR #21:** cambiar el título de estas 11 cajas de `brand-600` a `text-slate-400`.
> **Ojo — `brand-600` sí es correcto en esta pantalla, pero en otro sitio:** los `input[type=checkbox]`
> del live llevan `text-brand-600 focus:ring-brand-500`. No los toques.

## Maquetado exacto

### Contenedor del grid
```html
<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
```
A 1440 px de viewport se renderiza en **4 columnas** de 260 px (filas de 4 + 4 + 3).

### Una caja (patrón idéntico en las 11)
```html
<div class="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
  <div class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Etra Agency</div>
  <div class="space-y-1.5">
    <label class="flex cursor-pointer items-start gap-2 text-sm text-slate-700">
      <input type="checkbox" class="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500">
      Ver Etra (cuentas, acciones, cobertura)
    </label>
    <!-- … una <label> por permiso … -->
  </div>
</div>
```

**Inventario completo de clases dentro del grid** (son solo 6, no hay nada más):
- `grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- `rounded-lg border border-slate-200 bg-slate-50/50 p-3`
- `mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400`
- `space-y-1.5`
- `flex cursor-pointer items-start gap-2 text-sm text-slate-700`
- `mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500`

Colores muestreados en `live-usuarios-permisos-caja1.png` (286×326):
fondo `(251,252,253)` = `slate-50/50` sobre blanco · borde `(226,232,240)` = `slate-200` ·
texto del permiso `(51,65,85)` = `slate-700`. Todo cuadra con las clases.

## Las 11 cajas, en el orden exacto del DOM, con sus permisos

| # | Título de la caja | Nº | Permisos (texto literal del live) |
|---|---|---|---|
| 1 | Etra Agency | 7 | Ver Etra (cuentas, acciones, cobertura) · Gestionar tareas (crear/editar acciones) · Editar Etra (cuentas, cobertura, obligaciones) · Ver facturación / retainer · Editar facturación / retainer · Ver Seeding (inventario, envíos, influencers) · Editar Seeding (inventario, envíos, influencers) |
| 2 | Team · RRHH y usuarios | 6 | Ver Team (equipo del grupo) · Editar personas, empresas y horas · Ver condiciones económicas · Editar condiciones económicas · Aprobar / rechazar vacaciones · Gestionar usuarios de la intranet |
| 3 | CRM · Clientes | 5 | Ver CRM (clientes y contactos) · Editar CRM (clientes y contactos) · Ver pipeline de ventas · Gestionar pipeline (oportunidades, etapas, objetivos) · Ver KPIs comerciales |
| 4 | CRUDA · Ropa / merch | 2 | Ver CRUDA (pedidos y catálogo) · Editar CRUDA (pedidos, catálogo) |
| 5 | Producción · Eventos | 2 | Ver Producción (eventos, vídeo, foto) · Editar Producción (eventos, tareas, presupuesto) |
| 6 | Euphoric Media · Marketing | 2 | Ver Euphoric (cuentas, campañas, calendario) · Editar Euphoric (cuentas, campañas, contenido) |
| 7 | Creativos · Diseño | 2 | Ver Creativos (tablero de piezas) · Editar Creativos (piezas, estados, adjuntos) |
| 8 | Mixmag | 4 | Ver Mixmag (contenidos, revistas) · Editar Mixmag (escribir, maquetar, producir) · PUBLICAR en Mixmag (web, revista, redes) · Ver campañas de anunciantes e importes |
| 9 | TAGMAG | 4 | Ver TAGMAG (contenidos, revistas) · Editar TAGMAG (escribir, maquetar, producir) · PUBLICAR en TAGMAG · Ver tarifas, campañas e importes |
| 10 | Herramientas · Utilidades | 2 | Ver Proyecciones (P&L de eventos) · Crear y editar proyecciones |
| 11 | Black Moose · Grupo | 1 | Escribir novedades del grupo |

**Total: 37 permisos en 11 cajas.** Nótese que «PUBLICAR» va en mayúsculas en el copy del live
(cajas 8 y 9) — es parte del texto, no un estilo.

## Otros dos títulos de la misma pantalla (por si sirven de contraste)

| Elemento | Clase | Color computado |
|---|---|---|
| «Usuarios de la intranet» (cabecera de `section.card p-5`) | `mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500` | `rgb(100,116,139)` = `slate-500` |
| «Para empezar rápido» (dentro de `rounded-lg border border-slate-200 bg-slate-50 p-3`) | `text-xs font-semibold uppercase tracking-wide text-slate-400` | `rgb(148,163,184)` = `slate-400` |

Es decir: **`slate-500` a nivel de tarjeta, `slate-400` para todo subtítulo interno.**
Ningún título de esta pantalla usa `brand-600`.

## Nota de estado

En la captura **ningún checkbox aparece `checked`** (0 ocurrencias de `checked` en el HTML del grid):
el editor de permisos se renderiza todo desmarcado con la vista tal cual carga. Si la PR #21 asume
un estado inicial marcado, eso es un delta aparte que habría que verificar seleccionando un usuario
concreto — no lo he hecho porque implicaría interacción de escritura.
