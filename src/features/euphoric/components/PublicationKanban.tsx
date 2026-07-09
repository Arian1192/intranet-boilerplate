import { Card, Badge } from '@/components/ui';
import type { BadgeProps } from '@/components/ui/Badge';
import type { Publication, PublicationKanbanColumn } from '../data/types';

const APPROVAL_VARIANT: Record<string, BadgeProps['variant']> = {
  Aprobado: 'success',
  Pendiente: 'warning',
};

const COLUMNS: { id: PublicationKanbanColumn; label: string; subtitle: string }[] = [
  { id: 'falta-copy', label: 'Falta copy', subtitle: 'Sin texto todavía' },
  { id: 'falta-arte', label: 'Falta arte', subtitle: 'Texto pendiente' },
  { id: 'falta-aprobacion', label: 'Falta aprobación', subtitle: 'Todo aprobado' },
  { id: 'listo', label: 'Listo para programar', subtitle: 'Vacío' },
  { id: 'programado', label: 'Programado', subtitle: 'Vacío' },
  { id: 'publicado', label: 'Publicado', subtitle: 'Vacío' },
];

export function PublicationKanban({ publications }: { publications: Publication[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {COLUMNS.map((column) => {
        const items = publications.filter((pub) => pub.kanbanColumn === column.id);
        return (
          <Card key={column.id} className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">{column.label}</h3>
              <Badge variant="neutral" size="sm">
                {items.length}
              </Badge>
            </div>
            <p className="mb-3 text-xs text-slate-400">{column.subtitle}</p>
            <div className="space-y-3">
              {items.map((pub) => (
                <div key={pub.id} className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                  <p className="text-xs text-slate-400">Sin asignar</p>
                  <p className="font-medium text-slate-900">{pub.name}</p>
                  <p className="text-sm text-slate-500">
                    {pub.isoDate} · {pub.channel} · {pub.account}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge variant={APPROVAL_VARIANT[pub.textApproval] ?? 'neutral'} size="sm">
                      T: {pub.textApproval}
                    </Badge>
                    <Badge variant={APPROVAL_VARIANT[pub.imageApproval] ?? 'neutral'} size="sm">
                      I: {pub.imageApproval}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
