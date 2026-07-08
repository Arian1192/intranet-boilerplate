import { Badge } from './Badge';
import type { BadgeProps } from './Badge';

export interface ActivityListItemProps {
  date: string;
  title: string;
  meta?: string;
  badge?: { label: string; variant: BadgeProps['variant'] };
}

export function ActivityListItem({ date, title, meta, badge }: ActivityListItemProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{date}</p>
        <h4 className="truncate text-base font-medium text-slate-700">{title}</h4>
        {meta && <p className="text-xs text-slate-400">{meta}</p>}
      </div>
      {badge && (
        <Badge variant={badge.variant} className="shrink-0">
          {badge.label}
        </Badge>
      )}
    </div>
  );
}
