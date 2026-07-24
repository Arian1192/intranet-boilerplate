import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { ArtStatus, PaymentStatus, Show, ShowStatus } from '@/types';
import { etapaLabel } from '../data/etapaLabels';

export interface ShowCardProps {
  show: Show;
}

const etapaChip: Record<ShowStatus, string> = {
  tentative: 'bg-sky-50 text-sky-700',
  offer: 'bg-sky-50 text-sky-700',
  confirmed: 'bg-blue-50 text-blue-700',
  contract: 'bg-indigo-50 text-indigo-700',
  'pending-payment': 'bg-rose-50 text-rose-700',
  'pending-settlement': 'bg-indigo-50 text-indigo-700',
  done: 'bg-green-50 text-green-700',
};

const pagoChip: Record<PaymentStatus, string> = {
  'No abonado': 'bg-slate-100 text-slate-500',
  'Parcialmente abonado': 'bg-amber-50 text-amber-700',
  'Pendiente liquidar': 'bg-indigo-50 text-indigo-700',
  Liquidado: 'bg-green-50 text-green-700',
  Incidencia: 'bg-red-50 text-red-700',
};

const arteChip: Record<ArtStatus, string> = {
  'Arte no subido': 'bg-slate-100 text-slate-500',
  'Arte pendiente': 'bg-amber-50 text-amber-700',
  'Arte subido': 'bg-green-50 text-green-700',
};

export function ShowCard({ show }: ShowCardProps) {
  const ubicacion = [show.venue, show.country].filter(Boolean).join(', ');

  return (
    <div className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0 hover:bg-slate-50/60">
      {/* Fecha + código */}
      <div className="w-24 shrink-0">
        <div className="text-sm font-medium text-slate-700">{show.date ?? '—'}</div>
        <div className="font-mono text-[11px] text-slate-400">{show.code}</div>
      </div>

      {/* Artista @ Evento + ubicación · deal */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-base font-bold text-slate-900">
          {show.artist} @ {show.event}
        </div>
        <div className="truncate text-sm text-slate-500">
          {ubicacion && <span>{ubicacion} · </span>}
          <span className="font-semibold text-slate-600">{show.dealType}</span>
        </div>
      </div>

      {/* Etapa + excepción */}
      <div className="flex w-40 shrink-0 items-center justify-end gap-2">
        <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', etapaChip[show.etapa])}>
          {etapaLabel(show.etapa)}
        </span>
        {show.exception && (
          <span className="whitespace-nowrap text-xs font-medium text-red-500">● Excepción</span>
        )}
      </div>

      {/* Fee + BF/MF */}
      <div className="w-40 shrink-0 text-right">
        <div className="text-lg font-bold text-slate-900">{formatCurrency(show.fee)}</div>
        <div className="text-[11px] text-slate-400">
          BF {formatCurrency(show.bf)} · MF {formatCurrency(show.mf)}
        </div>
      </div>

      {/* Pago + arte */}
      <div className="flex w-40 shrink-0 flex-col items-end gap-1">
        <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', pagoChip[show.paymentStatus])}>
          {show.paymentStatus}
        </span>
        <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', arteChip[show.artStatus])}>
          {show.artStatus}
        </span>
      </div>
    </div>
  );
}
