import { useState } from 'react';
import { ChevronDown, ChevronUp, Mail } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import type { Influencer } from '@/types';

function formatFollowers(count: number): string {
  const thousands = count / 1000;
  const rounded = Number.isInteger(thousands) ? String(thousands) : thousands.toFixed(1).replace('.', ',');
  return `${rounded}K`;
}

export function InfluencerCard({
  influencer,
  onEdit,
}: {
  influencer: Influencer;
  onEdit: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-medium text-brand-700">
          {influencer.initials}
        </div>
        <div className="flex-1">
          <p className="font-medium text-slate-800">{influencer.name}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {influencer.instagramFollowers !== undefined && (
              <Badge variant="pink" size="sm">IG · {formatFollowers(influencer.instagramFollowers)}</Badge>
            )}
            {influencer.tiktokFollowers !== undefined && (
              <Badge variant="neutral" size="sm">TT · {formatFollowers(influencer.tiktokFollowers)}</Badge>
            )}
          </div>
        </div>
        <button
          type="button"
          aria-label={`Expandir ${influencer.name}`}
          onClick={() => setExpanded((open) => !open)}
          className="text-slate-300 hover:text-slate-500"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
          {influencer.email && (
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="h-3.5 w-3.5 text-slate-300" />
              {influencer.email}
            </p>
          )}
          <div className="flex gap-3 text-sm">
            <button type="button" onClick={onEdit} className="font-medium text-brand-600 hover:text-brand-700">
              Editar
            </button>
            <button type="button" className="text-slate-400 hover:text-slate-600">
              Eliminar
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
