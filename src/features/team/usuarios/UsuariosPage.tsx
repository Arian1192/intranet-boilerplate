import { useState } from 'react';
import { BLOQUES_MATRIZ, PLANTILLAS, cuentas } from './data/usuarios';
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
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Usuarios</h1>
        <p className="text-sm text-slate-500">
          Alta, permisos y estado de los usuarios de la intranet del grupo.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Usuarios de la intranet
        </h2>
        <p className="text-xs text-slate-400">
          Alta por invitación, permisos por usuario y desactivación (sin borrado).
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input type="email" placeholder="email@dominio.com" className="input max-w-xs" />
          <input type="text" placeholder="Nombre (obligatorio)" className="input max-w-xs" />
          <button
            type="button"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Invitar
          </button>
        </div>

        <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
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
          <>
            <div className="mt-4 rounded-lg bg-slate-50 p-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Para empezar rápido
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {PLANTILLAS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setActivos((prev) => aplicarPlantilla(prev, p))}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    {p}
                  </button>
                ))}
                <select
                  aria-label="Copiar permisos de…"
                  defaultValue=""
                  className="select w-48 text-xs"
                >
                  <option value="">Copiar permisos de…</option>
                  {cuentas.map((c) => (
                    <option key={c.email}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Son sellos, no roles: marcan casillas y desaparecen. Nada queda atado a la plantilla
                — después se toca una a una. Aplicar una plantilla reemplaza lo que hubiera de
                ConceptOne (si solo sumara, un ex-booker se quedaría viendo los fees).
              </p>
            </div>

            {BLOQUES_MATRIZ.map((bloque) => (
              <MatrizPermisos key={bloque.titulo} bloque={bloque} activos={activos} onToggle={toggle} />
            ))}

            <CajasPermisos activos={activos} onToggle={toggle} />
          </>
        )}
      </div>

      <CuentasTable />
    </div>
  );
}
