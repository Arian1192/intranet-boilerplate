import { useState } from 'react';
import { Card } from './Card';
import { cn } from '@/lib/utils';

export interface MasterDetailListProps<T extends { id: string }> {
  items: T[];
  renderRow: (item: T, isSelected: boolean) => React.ReactNode;
  renderDetail: (item: T) => React.ReactNode;
  emptyState?: string;
  className?: string;
  /** Controlled selection. When omitted, selection is internal state. */
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  /** Rendered above the list card in the left column (e.g. a create button + filters). */
  listTop?: React.ReactNode;
  /** When provided, replaces the right panel entirely (e.g. a creation form). */
  detailOverride?: React.ReactNode;
}

export function MasterDetailList<T extends { id: string }>({
  items,
  renderRow,
  renderDetail,
  emptyState = 'Selecciona un elemento o crea uno nuevo.',
  className,
  selectedId: controlledSelectedId,
  onSelect,
  listTop,
  detailOverride,
}: MasterDetailListProps<T>) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const selectedId = controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId;
  const selected = items.find((item) => item.id === selectedId) ?? null;

  const handleSelect = (id: string) => {
    onSelect?.(id);
    if (controlledSelectedId === undefined) setInternalSelectedId(id);
  };

  return (
    <div className={cn('grid items-start gap-6 lg:grid-cols-[400px_1fr]', className)}>
      <div className="space-y-4">
        {listTop}
        <Card className="divide-y divide-slate-100 p-0">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={cn(
                'block w-full px-4 py-3 text-left transition-colors hover:bg-slate-50',
                selectedId === item.id && 'bg-brand-50/60'
              )}
            >
              {renderRow(item, selectedId === item.id)}
            </button>
          ))}
        </Card>
      </div>
      {detailOverride ? (
        <Card className="p-6">{detailOverride}</Card>
      ) : selected ? (
        <Card className="p-6">{renderDetail(selected)}</Card>
      ) : (
        <Card className="flex min-h-[200px] items-center justify-center p-6">
          <p className="text-slate-400">{emptyState}</p>
        </Card>
      )}
    </div>
  );
}
