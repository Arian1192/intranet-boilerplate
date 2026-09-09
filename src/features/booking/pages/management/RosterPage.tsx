/**
 * Stub de la Fase 0: sólo el `h1` y la bajada del live.
 *
 * El cuerpo de `/management/roster` lo pinta la **Fase B**, que re-captura la pantalla
 * antes de escribirla. Registrar aquí la ruta es lo que desbloquea esa fase.
 */
export function RosterPage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Roster de Management</h1>
        <p className="text-sm text-slate-500">
          Elige con qué artistas trabajáis management y de cuáles traer datos de Songstats (se paga
          por uso).
        </p>
      </div>
    </div>
  );
}
