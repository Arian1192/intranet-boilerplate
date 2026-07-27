# Configuración — ours-vs-live (1440px)

Capturas generadas para PR #11 en `docs/references/configuracion/`.

- **Viewport/ancho:** 1440px (`deviceScaleFactor=1`).
- **Local:** `http://127.0.0.1:5183/configuracion...` sobre la rama `feature/configuracion`.
- **Live:** `https://bookings.conceptoneagency.com/configuracion...` con navegación de solo lectura. No se pulsaron acciones de crear/editar/borrar/guardar; solo login, navegación y captura.
- **Comparación:** RMS y % de píxeles cambiados calculados sobre el área común de cada par `ours-*.png` / `live-*.png`.

| Vista | Ruta | Ours | Live | RMS | Px cambiados |
|---|---|---:|---:|---:|---:|
| Plantillas de correo | `/configuracion` | `ours-plantillas-correo.png` (1440x3953) | `live-plantillas-correo.png` (1440x4181) | 11.53% | 10.31% |
| Uso y coste | `/configuracion/uso` | `ours-uso.png` (1440x1200) | `live-uso.png` (1440x1726) | 13.15% | 11.17% |
| Incidencias | `/configuracion/incidencias` | `ours-incidencias.png` (1440x1200) | `live-incidencias.png` (1440x1200) | 12.23% | 9.22% |
| Documentos (tipografía) | `/configuracion/documentos` | `ours-documentos.png` (1440x1200) | `live-documentos.png` (1440x1200) | 14.94% | 12.65% |
| Notificaciones | `/configuracion/notificaciones` | `ours-notificaciones.png` (1440x3073) | `live-notificaciones.png` (1440x3523) | 9.66% | 7.77% |
| Comisiones de bookers | `/configuracion/comisiones` | `ours-comisiones.png` (1440x1554) | `live-comisiones.png` (1440x1601) | 10.37% | 7.29% |
| Control de comisiones | `/configuracion/comisiones-pagos` | `ours-comisiones-pagos.png` (1440x1200) | `live-comisiones-pagos.png` (1440x1200) | 9.44% | 4.91% |
| Contratos | `/configuracion/contratos` | `ours-contratos.png` (1440x1200) | `live-contratos.png` (1440x1200) | 8.51% | 4.02% |
| Alertas de eventos | `/configuracion/alertas` | `ours-alertas.png` (1440x1200) | `live-alertas.png` (1440x1200) | 10.99% | 8.54% |
| RRHH (coste y avisos) | `/configuracion/rrhh` | `ours-rrhh.png` (1440x1726) | `live-rrhh.png` (1440x1586) | 10.85% | 8.37% |
| Festivos | `/configuracion/festivos` | `ours-festivos.png` (1440x1804) | `live-festivos.png` (1440x1526) | 10.99% | 9.61% |

## Observaciones

- La vista **Configuración → Incidencias** ya no reimplementa filas/filtros: usa `IncidenciaStatFilter`, `IncidenciaList` e `IncidenciaDetailDialog` de `@/features/incidencias`, por lo que conserva la presentación compartida (badge `rose` para nuevas, clip de adjunto, avatar compartido y detalle modal).
- Las diferencias visibles restantes se concentran en datos/entorno: live tiene datos actuales distintos en Incidencias (12 filas; conteos 2/1/1/6/2) frente al seed local compartido por `listIncidencias` (8 filas; conteos 1/1/0/2/4), además de usuario/logo de entorno.
- Las alturas distintas en páginas largas reflejan diferencias de contenido live vs seed local; las capturas locales y live mantienen el ancho de 1440px.

## Artefactos auxiliares

- `comparison-metrics.json`: métricas de comparación en JSON.
- `ours-capture-manifest.json` / `live-capture-manifest.json`: manifiestos con rutas, dimensiones y timestamp de captura.
