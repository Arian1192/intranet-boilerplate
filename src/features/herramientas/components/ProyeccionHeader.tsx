import { Link } from 'react-router';
import { Button, SegmentedControl } from '@/components/ui';
import { ResponsablesChips } from './ResponsablesChips';
import type { Proyeccion, ProyeccionEstado } from '../data/types';

const ESTADO_OPTIONS: { label: string; value: ProyeccionEstado }[] = [
  { label: 'Borrador', value: 'borrador' },
  { label: 'En junta', value: 'en_junta' },
  { label: 'Aprobada', value: 'aprobada' },
  { label: 'Rechazada', value: 'rechazada' },
];

interface Props {
  proyeccion: Proyeccion;
  isDirty: boolean;
  onUpdate: (patch: Partial<Proyeccion>) => void;
  onGuardar: () => void;
}

export function ProyeccionHeader({ proyeccion, isDirty, onUpdate, onGuardar }: Props) {
  return (
    <div className="space-y-4 rounded-xl border border-slate-100 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/herramientas/proyecciones" className="text-sm text-slate-500 hover:text-slate-700">← Volver</Link>
          <span className="text-lg font-semibold text-slate-900">{proyeccion.nombre}</span>
          {/* Info "¿Cómo se calcula?" — Fase C */}
          <Button variant="ghost" size="sm" aria-label="i">i</Button>
          <span className="text-sm text-slate-400">{isDirty ? 'Cambios sin guardar' : 'Guardado'}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Botones de Fase C: visibles, sin onClick (inertes) */}
          <Button variant="secondary" size="sm">Comentarios</Button>
          <Button variant="secondary" size="sm">PDF Ventas</Button>
          <Button variant="secondary" size="sm">PDF Explotación</Button>
          <Button variant="secondary" size="sm">Excel</Button>
          <Button variant="primary" size="sm" onClick={onGuardar}>Guardar</Button>
        </div>
      </div>
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
          <div>
            <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Responsables</p>
            <ResponsablesChips
              responsables={proyeccion.responsables}
              onRemove={(id) => onUpdate({ responsables: proyeccion.responsables.filter((r) => r.id !== id) })}
            />
          </div>
        </div>
        {/* Cross-módulo, siempre inerte en este calco */}
        <Button variant="primary" size="sm">Convertir en evento →</Button>
      </div>
    </div>
  );
}
