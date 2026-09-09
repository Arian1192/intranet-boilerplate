/**
 * Stub de la Fase 0: sólo el `h1` y la bajada del live.
 *
 * El cuerpo de `/management/content` lo pinta la **Fase C**, que re-captura la pantalla
 * antes de escribirla. Registrar aquí la ruta es lo que desbloquea esa fase.
 */
export function ContentPage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Content</h1>
        <p className="text-sm text-slate-500">
          Pipeline de proyectos creativos del roster: del brief a la entrega.
        </p>
      </div>
    </div>
  );
}
