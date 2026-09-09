/**
 * Stub de la Fase 0: sólo el `h1` y la bajada del live.
 *
 * El cuerpo de `/conceptone/pendientes` lo pinta la **Fase A**, que re-captura la pantalla
 * antes de escribirla. Registrar aquí la ruta es lo que desbloquea esa fase.
 */
export function PendientesPage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Pendientes</h1>
        <p className="text-sm text-slate-500">
          Lo que te toca en ConceptOne: alertas de shows, arte por aprobar, liquidaciones y tus
          tareas.
        </p>
      </div>
    </div>
  );
}
