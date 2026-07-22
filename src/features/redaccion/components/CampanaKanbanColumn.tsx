import type { Campaign, CampaignStage } from '../data/campanas';
import { CampaignCard } from './CampaignCard';

const CHIP: Record<'slate' | 'emerald', string> = {
  slate: 'bg-slate-100 text-slate-500',
  emerald: 'bg-emerald-100 text-emerald-700',
};

export interface CampanaKanbanColumnProps {
  stage: CampaignStage;
  items: Campaign[];
}

export function CampanaKanbanColumn({ stage, items }: CampanaKanbanColumnProps) {
  const collapsed = items.length === 0;
  if (collapsed) {
    return (
      <div data-testid="campana-column" data-collapsed="true" className="flex w-10 shrink-0 justify-center rounded-lg bg-slate-50 py-4">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 [writing-mode:vertical-rl] rotate-180">
          {stage.label}
        </span>
      </div>
    );
  }
  return (
    <div data-testid="campana-column" data-collapsed="false" className="min-w-[16rem] flex-1">
      <div className="flex items-center justify-between px-1">
        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${CHIP[stage.tone]}`}>
          {stage.label}
        </span>
        <span className="text-xs text-slate-400">{items.length}</span>
      </div>
      <div className="mt-2 space-y-2 rounded-lg bg-slate-50 p-2">
        {items.map((c) => <CampaignCard key={c.id} campaign={c} />)}
      </div>
    </div>
  );
}
