import {
  CONTRATOS_MANAGEMENT,
  VACIO_CONTRATOS,
} from '@/features/booking/data/management-contratos';

/**
 * `/management/contratos` — calco del live del 2026-09-09.
 *
 * En el live la pantalla está **vacía**: tres KPI a `0` y la fila de vacío de la
 * tabla. Los KPI se derivan igualmente de los datos, que es lo que hace el live
 * y lo que hacen sus hermanas de Management; con la lista vacía dan los tres
 * ceros de la foto.
 *
 * Las clases `brand-*` no aparecen aquí porque el live tampoco las usa en esta
 * pantalla: los dos KPI que no son neutros van en `amber-600` y `rose-600`,
 * medidos en el volcado del `<main>`.
 */
export function ContratosPage() {
  const activos = CONTRATOS_MANAGEMENT.filter((c) => c.estado === 'Activo').length;
  const preaviso = CONTRATOS_MANAGEMENT.filter((c) => c.estado === 'Preaviso próximo').length;
  const vencidos = CONTRATOS_MANAGEMENT.filter((c) => c.estado === 'Vencido').length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Contratos</h1>
          <p className="text-sm text-slate-500">
            Ciclo de vida del contrato de cada artista: término, preaviso, alcance y comisión.
          </p>
        </div>
        <button type="button" className="btn-primary text-sm">
          + Nuevo contrato
        </button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Contratos activos
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-slate-800">{activos}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Preaviso próximo (≤90d)
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-amber-600">{preaviso}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Vencidos</div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-rose-600">{vencidos}</div>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
              <th className="px-3 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                Artista
              </th>
              <th className="w-[104px] px-3 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                Estado
              </th>
              <th className="w-[110px] px-3 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                Fin
              </th>
              <th className="w-[150px] px-3 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                Preaviso antes de
              </th>
              <th className="w-[180px] px-3 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                Alcance
              </th>
              <th className="w-[80px] px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                Live %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {CONTRATOS_MANAGEMENT.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  {VACIO_CONTRATOS}
                </td>
              </tr>
            ) : (
              CONTRATOS_MANAGEMENT.map((contrato) => (
                <tr key={contrato.artista} className="hover:bg-slate-50">
                  <td className="truncate px-3 py-2.5 align-middle font-medium text-slate-800">
                    {contrato.artista}
                  </td>
                  <td className="px-3 py-2.5 align-middle text-xs text-slate-500">
                    {contrato.estado}
                  </td>
                  <td className="px-3 py-2.5 align-middle text-xs text-slate-500">
                    {contrato.fin}
                  </td>
                  <td className="px-3 py-2.5 align-middle text-xs text-slate-500">
                    {contrato.preavisoAntesDe}
                  </td>
                  <td className="truncate px-3 py-2.5 align-middle text-xs text-slate-500">
                    {contrato.alcance}
                  </td>
                  <td className="px-3 py-2.5 text-right align-middle tabular-nums text-slate-700">
                    {contrato.liveComision} %
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
