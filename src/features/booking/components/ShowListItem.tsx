import { Badge } from '@/components/ui';
import type { ShowSummary } from '@/types';

export interface ShowListItemProps {
  item: ShowSummary;
}

export function ShowListItem({ item }: ShowListItemProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <Badge variant="warning" className="rounded-md px-1.5 py-0.5 text-[10px] font-bold">
            D-{item.daysLeft}
          </Badge>
          <h4 className="font-normal text-slate-900">{item.title}</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-md border border-slate-100 bg-slate-50 px-2 py-0.5 text-xs text-slate-600"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
      <span className="text-xs text-slate-400">{item.date}</span>
    </div>
  );
}
