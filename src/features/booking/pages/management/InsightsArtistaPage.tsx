import { Link } from 'react-router';

/**
 * Stub de la ficha completa de artista (`/management/insights/:artistaId`).
 *
 * Ruta que el inventario de 89 no tenía: se llega pulsando una fila de
 * `/management/insights`, y el pie de esa tabla la anuncia («Pulsa un artista
 * para su ficha completa»). Evidencia en
 * `docs/references/conceptone-v3-2026-09-09/f2-management--insights--d371328b-…`.
 *
 * El cuerpo —12 pestañas, 9 KPI y `TOP TRACKS`— lo pinta la **Fase F**, que
 * re-captura la pantalla antes de escribirla. Aquí sólo se registra la ruta,
 * para que las filas de Insights naveguen de verdad.
 */
export function InsightsArtistaPage() {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Link to="/management/insights" className="text-slate-400 hover:text-slate-600">
          ←
        </Link>
        <h1 className="text-2xl font-semibold text-slate-800">Ficha de artista</h1>
      </div>
    </div>
  );
}
