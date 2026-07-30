import { useState } from 'react';
import { cn } from '@/lib/utils';
import { cuentas as seed, type Cuenta, type TipoCuenta } from '../data/usuarios';

const FILTROS = ['Todos', 'Internos', 'Portales'] as const;
type Filtro = (typeof FILTROS)[number];

const COLOR_TIPO: Record<TipoCuenta, string> = {
  Admin: 'bg-brand-100 text-brand-700',
  Interno: 'bg-slate-100 text-slate-500',
  Portal: 'bg-blue-50 text-blue-600',
};

const pill = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';

export function CuentasTable({ cuentas = seed }: { cuentas?: Cuenta[] }) {
  const [filtro, setFiltro] = useState<Filtro>('Todos');
  const [soloSinFicha, setSoloSinFicha] = useState(false);

  const visibles = cuentas.filter((c) => {
    if (filtro === 'Internos' && c.tipo === 'Portal') return false;
    if (filtro === 'Portales' && c.tipo !== 'Portal') return false;
    if (soloSinFicha && c.ficha !== 'sin-ficha') return false;
    return true;
  });

  const sinFicha = cuentas.filter((c) => c.ficha === 'sin-ficha');

  return (
    <div className="mt-5">
      {sinFicha.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <p className="font-medium">
            {sinFicha.length} cuenta{sinFicha.length === 1 ? '' : 's'} usa
            {sinFicha.length === 1 ? '' : 'n'} la intranet sin ficha en Team. No salen en el
            directorio, no tienen vacaciones y no cuentan en el coste del equipo.
          </p>
          <p className="mt-1 text-amber-700">{sinFicha.map((c) => c.email).join(', ')}</p>
          <p className="mt-1 text-amber-700">
            Créales la ficha en Team → Fichas y usa «Vincular una cuenta existente» para enlazarla
            con su cuenta (no crees una cuenta nueva: la duplicarías).
          </p>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 bg-white text-xs">
            {FILTROS.map((f, i) => (
              <button
                key={f}
                type="button"
                aria-pressed={filtro === f}
                onClick={() => setFiltro(f)}
                className={cn(
                  'px-2.5 py-1.5 font-medium',
                  i > 0 && 'border-l border-slate-200',
                  filtro === f ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-50'
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-1.5 text-xs text-slate-500">
            <input
              type="checkbox"
              checked={soloSinFicha}
              onChange={(e) => setSoloSinFicha(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Sin vincular a Team
          </label>
        </div>
        <span className="text-xs text-slate-400">{visibles.length} usuarios</span>
      </div>

      <table className="mt-2 w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wide text-slate-400">
            <th className="py-1.5 text-left font-medium">Nombre</th>
            <th className="py-1.5 text-left font-medium">Email</th>
            <th className="py-1.5 text-left font-medium">Estado</th>
            <th className="py-1.5 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {visibles.map((c) => (
            <tr key={c.email} className="border-b border-slate-50">
              <td className="py-2 pr-4">
                <span className="flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-700">{c.nombre}</span>
                  <span className={cn(pill, COLOR_TIPO[c.tipo])}>{c.tipo}</span>
                  {/*
                    Una cuenta de portal es de alguien de fuera: no usa la intranet, así que la
                    ficha en Team ni aplica y el live no le pinta el badge (ni «Team» ni «Sin
                    ficha Team»). Por eso tampoco entra en el recuento del aviso ámbar. El badge
                    sí sale en las Admin: la condición es el tipo Portal, no «solo Interno».
                  */}
                  {c.tipo !== 'Portal' && (
                    <span
                      className={cn(
                        pill,
                        c.ficha === 'team'
                          ? 'bg-violet-100 text-violet-700'
                          : 'bg-amber-100 text-amber-700'
                      )}
                    >
                      {c.ficha === 'team' ? '🧑‍💼 Team' : 'Sin ficha Team'}
                    </span>
                  )}
                </span>
              </td>
              <td className="py-2 pr-4 text-slate-500">{c.email}</td>
              <td className="py-2 pr-4">
                <span
                  className={cn(
                    pill,
                    c.estado === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  )}
                >
                  {c.estado}
                </span>
              </td>
              <td className="py-2 text-right text-xs">
                <span className="inline-flex items-center gap-3">
                  {/* Reenviar la invitación solo tiene sentido si aún está pendiente. */}
                  {c.estado === 'Pendiente' && (
                    <button type="button" className="text-slate-500 hover:text-slate-700">
                      Reenviar
                    </button>
                  )}
                  <button type="button" className="text-slate-500 hover:text-slate-700">
                    Restablecer pwd
                  </button>
                  <button type="button" className="text-red-500 hover:text-red-600">
                    Desactivar
                  </button>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
