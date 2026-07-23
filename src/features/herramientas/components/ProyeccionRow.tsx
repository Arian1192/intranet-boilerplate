import { Link } from 'react-router';
import { Badge, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/format';
import { calcularResultadoAcuerdo } from '../data/calculos-acuerdo';
import { calcularBrutosEscenario } from '../data/calculos-escenarios';
import type { Proyeccion, ProyeccionEstado } from '../data/types';

const ESTADO_LABEL: Record<ProyeccionEstado, string> = {
  borrador: 'Borrador',
  en_junta: 'En junta',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
};

const ESTADO_VARIANT: Record<ProyeccionEstado, 'neutral' | 'info' | 'success' | 'danger'> = {
  borrador: 'neutral',
  en_junta: 'info',
  aprobada: 'success',
  rechazada: 'danger',
};

interface Props {
  proyeccion: Proyeccion;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProyeccionRow({ proyeccion, onDuplicate, onDelete }: Props) {
  const resultado = calcularResultadoAcuerdo(
    proyeccion.acuerdo,
    calcularBrutosEscenario(proyeccion, 'base'),
    proyeccion.eventoAforo,
    proyeccion.gastos
  );

  return (
    <div className="group flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-4 last:border-0">
      <Link to={`/herramientas/proyecciones/${proyeccion.id}`} className="flex flex-1 items-center gap-3">
        <span className="font-semibold text-slate-900">{proyeccion.nombre}</span>
        {proyeccion.resultadoReal && <Badge variant="sky">Real</Badge>}
        <Badge variant={ESTADO_VARIANT[proyeccion.estado]}>{ESTADO_LABEL[proyeccion.estado]}</Badge>
        <span className="text-sm text-slate-400">
          {proyeccion.eventoAforo.fecha || 'sin fecha'} · actualizado {proyeccion.actualizadoEn ?? '—'}
        </span>
      </Link>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xs text-slate-400">PREVISIÓN</p>
          <p className="font-semibold text-emerald-600">{formatCurrency(resultado.beneficioPorAcuerdo)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">REAL</p>
          <p className={cn('font-semibold', (proyeccion.resultadoReal?.beneficioNeto ?? 0) < 0 ? 'text-red-600' : 'text-emerald-600')}>
            {proyeccion.resultadoReal ? formatCurrency(proyeccion.resultadoReal.beneficioNeto) : '—'}
          </p>
        </div>
        <div className="hidden items-center gap-2 group-hover:flex">
          <Button variant="secondary" size="sm" onClick={() => onDuplicate(proyeccion.id)}>Duplicar</Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(proyeccion.id)}>Borrar</Button>
        </div>
      </div>
    </div>
  );
}
