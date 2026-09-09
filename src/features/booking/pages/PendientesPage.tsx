/**
 * `/conceptone/pendientes` — el panel de atención del módulo.
 *
 * El live está hoy en inbox-zero: no hay lista, sólo el vacío. Calcado de
 * `docs/references/conceptone-v3-2026-09-09/f1-conceptone--pendientes.*`.
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

      <div className="card flex flex-col items-center px-6 py-14 text-center">
        <span
          aria-hidden="true"
          className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-xl text-emerald-600"
        >
          ✓
        </span>
        <p className="mt-4 text-base font-semibold text-slate-800">No te toca nada ahora mismo</p>
        <p className="mt-1 text-sm text-slate-500">
          Ni alertas, ni creatividades, ni aprobaciones. Está todo al día.
        </p>
      </div>
    </div>
  );
}
