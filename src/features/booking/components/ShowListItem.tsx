import type { ShowSummary } from '@/types';

export interface ShowListItemProps {
  item: ShowSummary;
  variant?: 'list' | 'upcoming';
}

function dayBadgeClass(daysLeft: number) {
  if (daysLeft <= 10) return 'bg-orange-100 text-orange-700';
  if (daysLeft <= 30) return 'bg-yellow-100 text-yellow-700';
  return 'bg-sky-100 text-sky-700';
}

function DayBadge({ daysLeft }: { daysLeft: number }) {
  return (
    <span
      className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold leading-[16.5px] ${dayBadgeClass(daysLeft)}`}
    >
      D-{daysLeft}
    </span>
  );
}

export function ShowListItem({ item, variant = 'list' }: ShowListItemProps) {
  if (variant === 'upcoming') {
    const [day, month, year] = item.date.split(' ');
    return (
      <div className="grid grid-cols-[56px_1fr_auto] items-center gap-4 px-5 py-3">
        <div className="text-sm leading-4 text-slate-500">
          <div>{day} {month}</div>
          <div>{year}</div>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <DayBadge daysLeft={item.daysLeft} />
            <h4 className="truncate text-base font-normal leading-6 text-slate-900">{item.title}</h4>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {item.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs leading-4 text-slate-600 first:bg-sky-100 first:text-sky-700"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-3">
          <DayBadge daysLeft={item.daysLeft} />
          <h4 className="truncate text-base font-normal leading-6 text-slate-900">{item.title}</h4>
        </div>
        <div className="ml-[58px] flex flex-wrap gap-2">
          {item.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-xs leading-4 text-slate-600"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
      <span className="pt-1 text-xs leading-4 text-slate-400">{item.date}</span>
    </div>
  );
}
