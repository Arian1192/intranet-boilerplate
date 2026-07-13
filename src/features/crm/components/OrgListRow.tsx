import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { CrmOrg } from '../data/seed';

export interface OrgListRowProps {
  org: CrmOrg;
  selected: boolean;
  onSelect: () => void;
}

export function OrgListRow({ org, selected, onSelect }: OrgListRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-slate-50',
        selected && 'bg-slate-50',
      )}
    >
      <span className="min-w-0">
        <span className="block truncate font-medium text-slate-800">{org.name}</span>
        {org.nif && <span className="block truncate text-xs text-slate-400">{org.nif}</span>}
      </span>
      {org.roles[0] && (
        <Badge variant="neutral" className="shrink-0">
          {org.roles[0]}
        </Badge>
      )}
    </button>
  );
}
