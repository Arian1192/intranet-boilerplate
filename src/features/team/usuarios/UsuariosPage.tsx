import { useState } from 'react';
import { AYUDA_PLANTILLA, BLOQUES_MATRIZ, PLANTILLAS, cuentas } from './data/usuarios';
import { alternar, aplicarPlantilla, type ClavePermiso } from './lib/permisos';
import { MatrizPermisos } from './components/MatrizPermisos';
import { CajasPermisos } from './components/CajasPermisos';
import { CuentasTable } from './components/CuentasTable';

export function UsuariosPage() {
  const [admin, setAdmin] = useState(false);
  const [activos, setActivos] = useState<Set<ClavePermiso>>(new Set());

  const toggle = (k: ClavePermiso) => setActivos((prev) => alternar(prev, k));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Usuarios</h1>
        <p className="text-sm text-slate-500">
          Alta, permisos y estado de los usuarios de la intranet del grupo.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Usuarios de la intranet
        </h2>
        <p className="mb-4 text-xs text-slate-400">
          Alta por invitación, permisos por usuario y desactivación (sin borrado).
        </p>

        {/* El live mete el alta y todo el editor de permisos dentro de una misma caja punteada. */}
        <div className="mb-5 space-y-3 rounded-lg border border-dashed border-slate-300 p-3">
          <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <input type="email" placeholder="email@dominio.com" className="input" />
            <input type="text" placeholder="Nombre (obligatorio)" className="input" />
            <button
              type="button"
              className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Invitar
            </button>
          </div>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700">
              <input
                type="checkbox"
                checked={admin}
                onChange={(e) => setAdmin(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              Administrador (acceso total)
            </label>

            {/* Con acceso total no hay nada que afinar: el live esconde la matriz entera. */}
            {!admin && (
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Para empezar rápido
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {PLANTILLAS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        title={AYUDA_PLANTILLA[p]}
                        onClick={() => setActivos((prev) => aplicarPlantilla(prev, p))}
                        className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                      >
                        {p}
                      </button>
                    ))}
                    <select
                      aria-label="Copiar permisos de…"
                      defaultValue=""
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600"
                    >
                      <option value="">Copiar permisos de…</option>
                      {cuentas.map((c) => (
                        <option key={c.email}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    Son <strong>sellos, no roles</strong>: marcan casillas y desaparecen. Nada queda
                    atado a la plantilla — después se toca una a una. Aplicar una plantilla{' '}
                    <strong>reemplaza</strong> lo que hubiera de ConceptOne (si solo sumara, un
                    ex-booker se quedaría viendo los fees).
                  </p>
                </div>

                {BLOQUES_MATRIZ.map((bloque) => (
                  <MatrizPermisos
                    key={bloque.titulo}
                    bloque={bloque}
                    activos={activos}
                    onToggle={toggle}
                  />
                ))}

                <CajasPermisos activos={activos} onToggle={toggle} />
              </div>
            )}
          </div>
        </div>

      </section>

      <CuentasTable />
    </div>
  );
}
