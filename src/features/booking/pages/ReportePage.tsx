/**
 * Stub de la Fase 0: sólo el `h1` y la bajada del live.
 *
 * El cuerpo de `/reporte` lo pinta la **Fase D**, que re-captura la pantalla
 * antes de escribirla. Registrar aquí la ruta es lo que desbloquea esa fase.
 */
export function ReportePage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Analítica</h1>
        <p className="text-sm text-slate-500">
          Uso interno · fees, agentes y comisiones. Importes en EUR.
        </p>
      </div>
    </div>
  );
}
