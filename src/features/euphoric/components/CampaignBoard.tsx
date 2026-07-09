import { Card, Badge } from '@/components/ui';
import type { BadgeProps } from '@/components/ui/Badge';
import type { Campaign, CampaignStatus } from '../data/types';
import { campaignStatusLabel } from '../data/labels';

const COLUMN_ORDER: CampaignStatus[] = ['planificada', 'en-curso', 'pausada', 'finalizada', 'cancelada'];

const COUNT_VARIANT: Record<CampaignStatus, BadgeProps['variant']> = {
  'planificada': 'neutral',
  'en-curso': 'blue',
  'pausada': 'amber',
  'finalizada': 'emerald',
  'cancelada': 'danger',
};

export function CampaignBoard({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {COLUMN_ORDER.map((status) => {
        const items = campaigns.filter((campaign) => campaign.status === status);
        return (
          <Card key={status} className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">{campaignStatusLabel[status]}</h3>
              <Badge variant={COUNT_VARIANT[status]} size="sm">
                {items.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {items.length === 0 ? (
                <p className="py-6 text-center text-slate-300">—</p>
              ) : (
                items.map((campaign) => (
                  <div key={campaign.id} className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-400">{campaign.owner}</p>
                    <p className="font-medium text-slate-900">{campaign.name}</p>
                    <p className="text-sm text-slate-500">
                      {campaign.account} · {campaign.type}
                    </p>
                    <p className="text-xs text-slate-400">
                      {campaign.startLabel} → {campaign.endLabel}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
