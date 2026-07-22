import { formatCurrency } from '@/lib/format';
import type { Campaign } from '../data/campanas';

export interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="font-medium text-slate-800">{campaign.name}</p>
      <p className="text-sm text-slate-400">{campaign.client}</p>
      <p className="mt-2 font-bold text-slate-800">{formatCurrency(campaign.amount)}</p>
      <p className="text-sm text-slate-400">{campaign.untilLabel}</p>
    </div>
  );
}
