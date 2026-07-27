import { useState } from 'react';
import { Button, SegmentedControl } from '@/components/ui';
import { ResponsablesChips } from './ResponsablesChips';
import { ResponsablesPicker } from './ResponsablesPicker';
import type { Proyeccion, ProyeccionEstado, Responsable } from '../data/types';

const ESTADO_OPTIONS: { label: string; value: ProyeccionEstado }[] = [
  { label: 'Borrador', value: 'borrador' },
  { label: 'En junta', value: 'en_junta' },
  { label: 'Aprobada', value: 'aprobada' },
  { label: 'Rechazada', value: 'rechazada' },
];

interface Props {
  proyeccion: Proyeccion;
  onUpdate: (patch: Partial<Proyeccion>) => void;
}

/**
 * Tarjeta ESTADO / REUNIÓN / RESPONSABLES / Convertir en evento del detalle. Va en una
 * `Card` (a diferencia de la toolbar, que flota). Gestiona la apertura del picker de
 * responsables.
 */
export function ProyeccionEstadoCard({ proyeccion, onUpdate }: Props) {
  const [pickerAbierto, setPickerAbierto] = useState(false);

  const anadirResponsable = (persona: Responsable) => {
    if (proyeccion.responsables.some((r) => r.id === persona.id)) return;
    onUpdate({ responsables: [...proyeccion.responsables, persona] });
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Estado</p>
            <SegmentedControl options={ESTADO_OPTIONS} value={proyeccion.estado} onChange={(estado) => onUpdate({ estado })} />
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Reunión</p>
            <input
              type="date"
              aria-label="Reunión"
              value={proyeccion.reunionFecha}
              onChange={(e) => onUpdate({ reunionFecha: e.target.value })}
              className="h-9 rounded-lg border border-slate-200 px-2 text-sm"
            />
          </div>
          <div className="relative">
            <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Responsables</p>
            <ResponsablesChips
              responsables={proyeccion.responsables}
              onRemove={(id) => onUpdate({ responsables: proyeccion.responsables.filter((r) => r.id !== id) })}
              onAnadir={() => setPickerAbierto((o) => !o)}
            />
            {pickerAbierto && (
              <ResponsablesPicker
                asignados={proyeccion.responsables}
                onAdd={(persona) => { anadirResponsable(persona); setPickerAbierto(false); }}
                onClose={() => setPickerAbierto(false)}
              />
            )}
          </div>
        </div>
        {/* Cross-módulo, siempre inerte en este calco */}
        <Button variant="primary" size="sm">Convertir en evento →</Button>
      </div>
    </div>
  );
}
