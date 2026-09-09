/**
 * Stub de la Fase 0: sólo el `h1` y la bajada del live.
 *
 * El cuerpo de `/tours` lo pinta la **Fase A**, que re-captura la pantalla
 * antes de escribirla. Registrar aquí la ruta es lo que desbloquea esa fase.
 */
export function ToursPage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Tours</h1>
        <p className="text-sm text-slate-500">
          Agrupa shows de un artista en una gira: viabilidad económica (P&L), gastos de tour
          (vuelos, hospedaje, per diems) y agenda de promo.
        </p>
      </div>
    </div>
  );
}
