import { ImageIcon } from 'lucide-react';
import { Badge, ProgressBar } from '@/components/ui';
import type { MagazineEdition } from '../data/types';

export interface EditionCardProps {
  edition: MagazineEdition;
}

export function EditionCard({ edition }: EditionCardProps) {
  return (
    <button
      type="button"
      className="overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="grid aspect-[3/4] place-items-center bg-slate-100">
        <ImageIcon className="h-8 w-8 text-slate-300" aria-hidden="true" />
      </div>
      <div className="p-3">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="min-w-0 truncate font-semibold text-slate-800">
            <span className="text-slate-400">#{edition.number} </span>
            {edition.title}
          </h3>
          <span className="shrink-0 text-xs text-slate-400">{edition.monthLabel}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="neutral">{edition.status}</Badge>
          <span className="text-xs text-slate-400">
            {edition.readyCount} de {edition.totalCount} listos
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <ProgressBar value={edition.readyCount} max={edition.totalCount} fillClassName="bg-slate-800" className="flex-1" />
          <span className="shrink-0 text-xs text-slate-400">{edition.percent}%</span>
        </div>
      </div>
    </button>
  );
}
