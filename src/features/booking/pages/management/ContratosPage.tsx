/**
 * Stub de la Fase 0: sólo el `h1` y la bajada del live.
 *
 * El cuerpo de `/management/contratos` lo pinta la **Fase C**, que re-captura la pantalla
 * antes de escribirla. Registrar aquí la ruta es lo que desbloquea esa fase.
 */
export function ContratosPage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Contratos</h1>
        <p className="text-sm text-slate-500">
          Ciclo de vida del contrato de cada artista: término, preaviso, alcance y comisión.
        </p>
      </div>
    </div>
  );
}
