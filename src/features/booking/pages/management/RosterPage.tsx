import { useMemo, useState } from 'react';
import { ROSTER_MANAGEMENT } from '@/features/booking/data/management-roster';

/**
 * `/management/roster` — calco del live del 2026-09-09.
 *
 * Los interruptores y el buscador funcionan en local: el módulo sigue siendo
 * seed, no hay repositorio detrás. Los dos KPI se recalculan de los propios
 * interruptores, que es lo que hace el live (17 y 17 en la foto).
 *
 * Las clases `brand-*` van tal cual: dentro de `.apx` el violeta lo pone
 * `apx.css` con sus reglas de remapeo. Hardcodear el violeta rompería el modo
 * oscuro.
 */
export function RosterPage() {
  const [roster, setRoster] = useState(ROSTER_MANAGEMENT);
  const [busqueda, setBusqueda] = useState('');

  const enManagement = roster.filter((a) => a.management).length;
  const conSongstats = roster.filter((a) => a.songstats).length;

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return q ? roster.filter((a) => a.nombre.toLowerCase().includes(q)) : roster;
  }, [roster, busqueda]);

  const alternar = (nombre: string, campo: 'management' | 'songstats') =>
    setRoster((previo) =>
      previo.map((a) => (a.nombre === nombre ? { ...a, [campo]: !a[campo] } : a))
    );

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Roster de Management</h1>
        <p className="text-sm text-slate-500">
          Elige con qué artistas trabajáis management y de cuáles traer datos de Songstats (se paga
          por uso).
        </p>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="card p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            En Management
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-slate-800">{enManagement}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Con Songstats activo
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-brand-700">{conSongstats}</div>
          <div className="mt-0.5 text-xs text-slate-400">Solo estos hacen llamadas a la API</div>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          placeholder="Buscar artista…"
          className="input h-9 w-full max-w-xs"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <span className="ml-auto text-xs text-slate-400">
          {visibles.length} artistas del roster
        </span>
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left">
              <th className="px-3 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                Artista
              </th>
              <th className="w-[130px] px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wide text-slate-500">
                En Management
              </th>
              <th className="w-[150px] px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wide text-slate-500">
                Songstats (API)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibles.map((artista) => (
              <tr key={artista.nombre} className="hover:bg-slate-50">
                <td className="truncate px-3 py-2.5 align-middle font-medium text-slate-800">
                  {artista.nombre}
                  {artista.nota && (
                    <span className="ml-2 text-[11px] font-normal text-slate-400">
                      {artista.nota}
                    </span>
                  )}
                </td>
                {(['management', 'songstats'] as const).map((campo) => (
                  <td key={campo} className="px-3 py-2.5 text-center align-middle">
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => alternar(artista.nombre, campo)}
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                          artista[campo] ? 'bg-brand-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            artista[campo] ? 'translate-x-4' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
