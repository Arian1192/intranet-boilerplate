import { useState } from 'react';
import { Card } from './Card';
import { cn } from '@/lib/utils';

export interface MasterDetailListProps<T extends { id: string }> {
  items: T[];
  renderRow: (item: T, isSelected: boolean) => React.ReactNode;
  renderDetail: (item: T) => React.ReactNode;
  emptyState?: string;
  className?: string;
}

export function MasterDetailList<T extends { id: string }>({
  items,
  renderRow,
  renderDetail,
  emptyState = 'Selecciona un elemento o crea uno nuevo.',
  className,
}: MasterDetailListProps<T>) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = items.find((item) => item.id === selectedId) ?? null;

  return (
    <div className={cn('grid gap-6 lg:grid-cols-[320px_1fr]', className)}>
      <Card className="divide-y divide-slate-100 p-0">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedId(item.id)}
            className={cn(
              'block w-full px-4 py-3 text-left transition-colors hover:bg-slate-50',
              selectedId === item.id && 'bg-slate-50'
            )}
          >
            {renderRow(item, selectedId === item.id)}
          </button>
        ))}
      </Card>
      <Card className="flex min-h-[200px] items-center justify-center p-6">
        {selected ? <div className="w-full">{renderDetail(selected)}</div> : (
          <p className="text-slate-400">{emptyState}</p>
        )}
      </Card>
    </div>
  );
}
