/**
 * Stub de la Fase 0: sólo el `h1` y la bajada del live.
 *
 * El cuerpo de `/management/campanas` lo pinta la **Fase C**, que re-captura la pantalla
 * antes de escribirla. Registrar aquí la ruta es lo que desbloquea esa fase.
 */
export function CampanasPage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Campañas</h1>
        <p className="text-sm text-slate-500">
          Inversión en marketing por canal. La del artista es la que cuenta para el retorno.
        </p>
      </div>
    </div>
  );
}
