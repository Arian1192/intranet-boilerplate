import type { PaymentStatus, ShowFase, ShowStatus } from '@/types';
import { artistasDisponibles } from '../data/artistas';

export interface ShowsFiltros {
  etapa: ShowStatus | '';
  fase: ShowFase | '';
  pago: PaymentStatus | '';
  artista: string;
}

export interface FiltrosDrawerProps {
  abierto: boolean;
  filtros: ShowsFiltros;
  onChange: (filtros: ShowsFiltros) => void;
  onClose: () => void;
}

const etapaOpciones: { value: ShowStatus | ''; label: string }[] = [
  { value: '', label: 'Todas las etapas' },
  { value: 'tentative', label: 'Tentative' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'contract', label: 'Contrato' },
  { value: 'pending-payment', label: 'Pendiente cobro' },
  { value: 'pending-settlement', label: 'Pendiente liquidar' },
  { value: 'done', label: 'Liquidado' },
];

const faseOpciones: { value: ShowFase | ''; label: string }[] = [
  { value: '', label: 'Todas las fases' },
  { value: 'tentative', label: 'Tentative' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'contract', label: 'Contrato' },
  { value: 'pagos', label: 'Pagos' },
  { value: 'liquidacion', label: 'Liquidación' },
  { value: 'liquidado', label: 'Liquidado' },
  { value: 'cancelado', label: 'Cancelado' },
];

const pagoOpciones: { value: PaymentStatus | ''; label: string }[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'No abonado', label: 'No abonado' },
  { value: 'Parcialmente abonado', label: 'Parcialmente abonado' },
  { value: 'Pendiente liquidar', label: 'Pendiente liquidar' },
  { value: 'Liquidado', label: 'Liquidado' },
  { value: 'Incidencia', label: 'Incidencia' },
];

function Campo({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        {children}
      </select>
    </div>
  );
}

export function FiltrosDrawer({ abierto, filtros, onChange, onClose }: FiltrosDrawerProps) {
  if (!abierto) return null;

  return (
    <div role="presentation" onClick={onClose} className="fixed inset-0 z-50 bg-slate-900/40">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filtros"
        onClick={(event) => event.stopPropagation()}
        className="fixed right-0 top-0 flex h-full w-full max-w-[380px] flex-col bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-900">Filtros</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel"
            className="text-xl text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <Campo id="filtro-etapa" label="Etapa" value={filtros.etapa} onChange={(v) => onChange({ ...filtros, etapa: v as ShowStatus | '' })}>
            {etapaOpciones.map((o) => (
              <option key={o.label} value={o.value}>{o.label}</option>
            ))}
          </Campo>
          <Campo id="filtro-fase" label="Fase" value={filtros.fase} onChange={(v) => onChange({ ...filtros, fase: v as ShowFase | '' })}>
            {faseOpciones.map((o) => (
              <option key={o.label} value={o.value}>{o.label}</option>
            ))}
          </Campo>
          <Campo id="filtro-pago" label="Estado de pago" value={filtros.pago} onChange={(v) => onChange({ ...filtros, pago: v as PaymentStatus | '' })}>
            {pagoOpciones.map((o) => (
              <option key={o.label} value={o.value}>{o.label}</option>
            ))}
          </Campo>
          <Campo id="filtro-artista" label="Artista" value={filtros.artista} onChange={(v) => onChange({ ...filtros, artista: v })}>
            <option value="">Todos los artistas</option>
            {artistasDisponibles.map((nombre) => (
              <option key={nombre} value={nombre}>{nombre}</option>
            ))}
          </Campo>
        </div>
      </div>
    </div>
  );
}
