/**
 * Stub de la Fase 0: sólo el `h1` y la bajada del live.
 *
 * El cuerpo de `/management/insights` lo pinta la **Fase B**, que re-captura la pantalla
 * antes de escribirla. Registrar aquí la ruta es lo que desbloquea esa fase.
 */
export function InsightsPage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Insights</h1>
        <p className="text-sm text-slate-500">
          Estado de cada artista en streaming y redes (Songstats). Todo se calcula del histórico —
          nada se introduce a mano.
        </p>
      </div>
    </div>
  );
}
