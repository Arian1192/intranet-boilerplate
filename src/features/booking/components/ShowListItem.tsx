import { Badge } from '@/components/ui';
import type { ShowSummary } from '@/types';

export interface ShowListItemProps {
  item: ShowSummary;
  variant?: 'list' | 'upcoming';
}

function dayBadgeClass(daysLeft: number) {
  if (daysLeft <= 10) return 'bg-orange-100 text-orange-700';
  if (daysLeft <= 30) return 'bg-amber-100 text-amber-700';
  return 'bg-sky-100 text-sky-700';
}

export function ShowListItem({ item, variant = 'list' }: ShowListItemProps) {
  if (variant === 'upcoming') {
    return (
      <button
        type="button"
        className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-slate-50"
      >
        <div className="w-16 shrink-0 text-xs text-slate-500">{item.date}</div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${dayBadgeClass(item.daysLeft)}`}
        >
          D-{item.daysLeft}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium text-slate-800">{item.title}</div>
        </div>
        {item.badges[0] && (
          <Badge variant="sky" className="shrink-0">
            {item.badges[0]}
          </Badge>
        )}
        {item.badges[1] && (
          <Badge variant="neutral" className="hidden shrink-0 sm:inline-block">
            {item.badges[1]}
          </Badge>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="flex w-full items-start gap-3 px-5 py-3 text-left hover:bg-slate-50"
    >
      <span
        className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${dayBadgeClass(item.daysLeft)}`}
      >
        D-{item.daysLeft}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium text-slate-800">{item.title}</div>
        <div className="mt-1 flex flex-wrap gap-1">
          {item.badges.map((badge) => (
            <span
              key={badge}
              className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
      <span className="shrink-0 text-xs text-slate-400">{item.date}</span>
    </button>
  );
}
