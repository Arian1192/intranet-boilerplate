import { Link } from 'react-router';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Proyeccion } from '../data/types';

interface Props {
  proyeccion: Proyeccion;
  isDirty: boolean;
  comentariosAbierto: boolean;
  infoAbierta: boolean;
  onGuardar: () => void;
  onToggleComentarios: () => void;
  onToggleInfo: () => void;
}

/**
 * Barra de herramientas del detalle. Fiel al live: FLOTA sobre el fondo (sin tarjeta),
 * a diferencia de la tarjeta ESTADO/RESPONSABLES (`ProyeccionEstadoCard`). El panel de
 * Comentarios se inserta entre ambas (lo gestiona `ProyeccionDetailPage`).
 */
export function ProyeccionToolbar({
  proyeccion, isDirty, comentariosAbierto, infoAbierta, onGuardar, onToggleComentarios, onToggleInfo,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Link to="/herramientas/proyecciones" className="text-sm text-slate-500 hover:text-slate-700">← Volver</Link>
        <span className="text-lg font-semibold text-slate-900">{proyeccion.nombre}</span>
        <button
          type="button"
          aria-label="i"
          aria-pressed={infoAbierta}
          onClick={onToggleInfo}
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
            infoAbierta ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          )}
        >
          i
        </button>
        <span className="text-sm text-slate-400">{isDirty ? 'Cambios sin guardar' : 'Guardado'}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          aria-pressed={comentariosAbierto}
          onClick={onToggleComentarios}
        >
          Comentarios
        </Button>
        {/* Exports en mock (D5): botones fieles al live pero INERTES; sin generar fichero ni
            aviso. El live no muestra ningún feedback al pulsarlos. Ver spec Fase C §7. */}
        <Button variant="secondary" size="sm">PDF Ventas</Button>
        <Button variant="secondary" size="sm">PDF Explotación</Button>
        <Button variant="secondary" size="sm">Excel</Button>
        <Button variant="primary" size="sm" onClick={onGuardar}>Guardar</Button>
      </div>
    </div>
  );
}
