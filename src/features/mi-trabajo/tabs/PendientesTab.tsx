import { useState } from 'react';
import { NuevaTareaDrawer, type NuevaTarea } from '../components/NuevaTareaDrawer';

export interface PendientesTabProps {
  /** Nombre del usuario, para pre-asignarlo en el drawer de alta. */
  usuario: string;
}

export function PendientesTab({ usuario }: PendientesTabProps) {
  const [abierto, setAbierto] = useState(false);
  const [tareas, setTareas] = useState<NuevaTarea[]>([]);

  const alta = (tarea: NuevaTarea) => {
    setTareas((prev) => [...prev, tarea]);
    setAbierto(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          + Nueva tarea
        </button>
      </div>

      {tareas.length === 0 ? (
        <div className="grid place-items-center rounded-xl border border-slate-200 bg-white px-6 py-10 text-center">
          <div>
            <span className="text-2xl">✓</span>
            <p className="mt-2 text-sm font-medium text-slate-700">No te toca nada ahora mismo</p>
            <p className="mt-0.5 text-xs text-slate-400">
              Ni alertas, ni creatividades, ni aprobaciones. Está todo al día.
            </p>
          </div>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {tareas.map((tarea, i) => (
            <li key={i} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  {tarea.prioridad}
                </span>
                <h3 className="text-sm font-semibold text-slate-800">{tarea.titulo}</h3>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                {tarea.fechaLimite && <span>{tarea.fechaLimite}</span>}
                {tarea.vinculo !== 'Ninguno' && <span>· {tarea.vinculo}</span>}
                {tarea.asignados.length > 0 && <span>· {tarea.asignados.join(', ')}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}

      <NuevaTareaDrawer open={abierto} onClose={() => setAbierto(false)} onSave={alta} usuario={usuario} />
    </div>
  );
}
