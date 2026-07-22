import { formatCurrency } from '@/lib/format';
import type { Campaign, CampaignStage } from '../data/campanas';

const CHIP: Record<'slate' | 'emerald', string> = {
  slate: 'bg-slate-100 text-slate-500',
  emerald: 'bg-emerald-100 text-emerald-700',
};

export interface CampaignRowProps {
  campaign: Campaign;
  stage?: CampaignStage;
}

export function CampaignRow({ campaign, stage }: CampaignRowProps) {
  const tone = stage?.tone ?? 'slate';
  const emerald = tone === 'emerald';
  return (
    <div className={`flex items-center gap-4 rounded-lg border p-4 ${emerald ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-white'}`}>
      <span className={`inline-flex shrink-0 items-center rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${CHIP[tone]}`}>
        {stage?.label ?? ''}
      </span>
      <span className="flex-1 truncate font-medium text-slate-800">{campaign.name}</span>
      <span className="shrink-0 text-sm text-slate-400">{campaign.client}</span>
      <span className="shrink-0 text-sm text-slate-400">{campaign.untilLabel}</span>
      <span className="shrink-0 font-bold text-slate-800">{formatCurrency(campaign.amount)}</span>
    </div>
  );
}
