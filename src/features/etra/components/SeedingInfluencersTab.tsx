import { useState } from 'react';
import { Input, Button } from '@/components/ui';
import { InfluencerCard } from './InfluencerCard';
import { InfluencerFormModal } from './InfluencerFormModal';
import type { Influencer } from '@/types';

export function SeedingInfluencersTab({ influencers }: { influencers: Influencer[] }) {
  const [modal, setModal] = useState<{ open: boolean; influencer?: Influencer }>({ open: false });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Input placeholder="Buscar influencer..." className="w-64" />
        <span className="text-sm text-slate-400">{influencers.length} en el directorio</span>
        <div className="ml-auto">
          <Button size="sm" onClick={() => setModal({ open: true })}>+ Añadir influencer</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {influencers.map((influencer) => (
          <InfluencerCard
            key={influencer.id}
            influencer={influencer}
            onEdit={() => setModal({ open: true, influencer })}
          />
        ))}
      </div>

      <InfluencerFormModal
        key={modal.influencer?.id ?? 'new'}
        open={modal.open}
        onClose={() => setModal({ open: false })}
        influencer={modal.influencer}
      />
    </div>
  );
}
