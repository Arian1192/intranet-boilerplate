import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Opportunity } from '../data/pipeline';
import { formatEur, formatDate } from '../data/pipeline';

interface Props {
  opp: Opportunity;
  canPrev: boolean;
  canNext: boolean;
  onMove: (dir: 1 | -1) => void;
}

export function OpportunityCard({ opp, canPrev, canNext, onMove }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <p className="font-medium text-slate-800">{opp.orgName}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="font-bold text-slate-800">{formatEur(opp.amount)}</span>
        <span
          className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full text-[9px] font-semibold text-white"
          style={{ backgroundColor: opp.ownerColor }}
          title={opp.ownerInitials}
        >
          {opp.ownerInitials}
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-400">Cierre: {formatDate(opp.closeDate)}</p>
      {opp.note && <p className="mt-0.5 truncate text-xs text-slate-400">↳ {opp.note}</p>}
      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-400">
        <button
          type="button"
          aria-label="Mover a etapa anterior"
          disabled={!canPrev}
          onClick={() => onMove(-1)}
          className="grid h-6 w-6 place-items-center rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span>Mover</span>
        <button
          type="button"
          aria-label="Mover a etapa siguiente"
          disabled={!canNext}
          onClick={() => onMove(1)}
          className="grid h-6 w-6 place-items-center rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
