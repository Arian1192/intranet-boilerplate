# Configuración — ours-vs-live (1440px)

Capturas generadas para PR #11 en `docs/references/configuracion/`.

- **Viewport/ancho:** 1440px (`deviceScaleFactor=1`).
- **Local:** `http://127.0.0.1:5183/configuracion...` sobre la rama `feature/configuracion`.
- **Live:** `https://bookings.conceptoneagency.com/configuracion...` con navegación de solo lectura. No se pulsaron acciones de crear/editar/borrar/guardar; solo login, navegación y captura.
- **Comparación:** RMS y % de píxeles cambiados calculados sobre el área común de cada par `ours-*.png` / `live-*.png`.

| Vista | Ruta | Ours | Live | RMS | Px cambiados |
|---|---|---:|---:|---:|---:|
| Plantillas de correo | `/configuracion` | `ours-plantillas-correo.png` (1440x3953) | `live-plantillas-correo.png` (1440x4181) | 11.53% | 10.31% |
| Uso y coste | `/configuracion/uso` | `ours-uso.png` (1440x1821) | `live-uso.png` (1440x1726) | 12.45% | 10.55% |
| Incidencias | `/configuracion/incidencias` | `ours-incidencias.png` (1440x1200) | `live-incidencias.png` (1440x1200) | 12.23% | 9.22% |
| Documentos (tipografía) | `/configuracion/documentos` | `ours-documentos.png` (1440x1200) | `live-documentos.png` (1440x1200) | 14.39% | 12.09% |
| Notificaciones | `/configuracion/notificaciones` | `ours-notificaciones.png` (1440x3073) | `live-notificaciones.png` (1440x3523) | 9.66% | 7.77% |
| Comisiones de bookers | `/configuracion/comisiones` | `ours-comisiones.png` (1440x1554) | `live-comisiones.png` (1440x1601) | 10.37% | 7.29% |
| Control de comisiones | `/configuracion/comisiones-pagos` | `ours-comisiones-pagos.png` (1440x1200) | `live-comisiones-pagos.png` (1440x1200) | 9.44% | 4.91% |
| Contratos | `/configuracion/contratos` | `ours-contratos.png` (1440x1200) | `live-contratos.png` (1440x1200) | 8.51% | 4.02% |
| Alertas de eventos | `/configuracion/alertas` | `ours-alertas.png` (1440x1200) | `live-alertas.png` (1440x1200) | 10.99% | 8.54% |
| RRHH (coste y avisos) | `/configuracion/rrhh` | `ours-rrhh.png` (1440x1726) | `live-rrhh.png` (1440x1586) | 10.85% | 8.37% |
| Festivos | `/configuracion/festivos` | `ours-festivos.png` (1440x1804) | `live-festivos.png` (1440x1526) | 10.99% | 9.61% |

## Observaciones

- La vista **Configuración → Incidencias** ya no reimplementa filas/filtros: usa `IncidenciaStatFilter`, `IncidenciaList` e `IncidenciaDetailDialog` de `@/features/incidencias`, por lo que conserva la presentación compartida (badge `rose` para nuevas, clip de adjunto, avatar compartido y detalle modal). La diferencia visual principal es de datos live: 12 filas y conteos 2/1/1/6/2 frente al seed local compartido por `listIncidencias` (8 filas y conteos 1/1/0/2/4), más shell/usuario de entorno.
- Tras revisar los pares de RMS alto, se corrigieron divergencias estructurales en **Documentos** (grid de dos columnas y valores tipográficos live: 16 px, 1,35, 3 px, 1,75x, 1,40x, 1,15x, 1,12) y **Uso** (datos/estructura live: 7 integraciones, errores, subfilas, último fallos y 2 avisos). Quedan alineados layout de contenido, tokens de color y estructura de tarjetas/listas.
- Las diferencias visibles restantes se concentran en datos/entorno y shell: logo/nombre de intranet vs live, usuario/avatar, icono del widget de ayuda y datos dinámicos live. Las alturas distintas en páginas largas reflejan diferencias de contenido live vs seed local o envoltura de texto; las capturas locales y live mantienen el ancho de 1440px.

## Artefactos auxiliares

- `comparison-metrics.json`: métricas de comparación en JSON.
- `ours-capture-manifest.json` / `live-capture-manifest.json`: manifiestos con rutas, dimensiones y timestamp de captura.
