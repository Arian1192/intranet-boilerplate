import { useState } from 'react';
import { Button, Card } from '@/components/ui';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import { PieceBoard } from '../components/PieceBoard';
import { StatusChip } from '../components/StatusChip';
import { pieces } from '../data/seed';
import { PRIORITY_LABEL, PRIORITY_VARIANT, pieceStatusLabel } from '../data/labels';

type PiezasFilter = 'todas' | 'mias' | 'diseno' | 'video' | 'pend-aprobar' | 'correcciones' | 'atrasadas';

const FILTER_OPTIONS: { label: string; value: PiezasFilter }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'Mías', value: 'mias' },
  { label: 'Diseño', value: 'diseno' },
  { label: 'Vídeo', value: 'video' },
  { label: 'Pend. aprobar', value: 'pend-aprobar' },
  { label: 'Correcciones', value: 'correcciones' },
  { label: 'Atrasadas', value: 'atrasadas' },
];

function PieceStatCard({
  value,
  label,
  valueClassName,
}: {
  value: string;
  label: string;
  valueClassName?: string;
}) {
  return (
    <Card className="p-4">
      <p className={cn('text-2xl font-semibold text-slate-800', valueClassName)}>{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </Card>
  );
}

function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-sm font-medium transition-colors',
        active ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 text-slate-500 hover:text-slate-700'
      )}
    >
      {children}
    </button>
  );
}

function AssigneeChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-sm font-medium transition-colors',
        active ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
      )}
    >
      {children}
    </button>
  );
}

function PiecesTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="text-xs font-medium uppercase text-slate-400">
          <tr className="border-b border-slate-100">
            <th className="px-4 py-3">Pieza</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Prioridad</th>
            <th className="px-4 py-3">Deadline</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Cliente aprob.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {pieces.map((piece) => (
            <tr key={piece.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-900">
                {piece.title} <span className="font-normal text-slate-400">v1</span>
              </td>
              <td className="px-4 py-3 text-slate-500">{piece.client}</td>
              <td className="px-4 py-3 text-slate-500">{piece.type}</td>
              <td className="px-4 py-3">
                <Badge variant={PRIORITY_VARIANT[piece.priority]}>{PRIORITY_LABEL[piece.priority]}</Badge>
              </td>
              <td className="px-4 py-3 text-slate-500">{piece.deadlineLabel}</td>
              <td className="px-4 py-3">
                <StatusChip status={pieceStatusLabel[piece.status]} />
              </td>
              <td className="px-4 py-3 text-slate-400">{piece.clientApproval}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PiezasPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<PiezasFilter>('todas');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  const toggleAssignee = (assignee: string) => {
    setSelectedAssignees((current) =>
      current.includes(assignee) ? current.filter((item) => item !== assignee) : [...current, assignee]
    );
  };

  const activeCount = pieces.length;
  const pendApprove = pieces.filter((piece) => piece.status === 'revision').length;
  const enCorrecciones = pieces.filter((piece) => piece.status === 'cambios').length;
  const atrasadas = 0;

  return (
    <div className="space-y-6" data-drawer-open={drawerOpen}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Piezas</h1>
          <p className="text-slate-500">Content creation: seguimiento de artes por estado de producción.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">Asignar a:</span>
          <AssigneeChip active={selectedAssignees.includes('Alba')} onClick={() => toggleAssignee('Alba')}>
            + Alba
          </AssigneeChip>
          <AssigneeChip active={selectedAssignees.includes('Carlos')} onClick={() => toggleAssignee('Carlos')}>
            + Carlos
          </AssigneeChip>
          <Button onClick={() => setDrawerOpen(true)}>+ Nueva pieza</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PieceStatCard value={String(activeCount)} label="Piezas activas" />
        <PieceStatCard value={String(pendApprove)} label="Pend. aprobar" valueClassName="text-amber-500" />
        <PieceStatCard value={String(enCorrecciones)} label="En correcciones" valueClassName="text-red-500" />
        <PieceStatCard value={String(atrasadas)} label="Atrasadas" valueClassName="text-red-500" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_OPTIONS.map((option) => (
            <FilterChip key={option.value} active={filter === option.value} onClick={() => setFilter(option.value)}>
              {option.label}
            </FilterChip>
          ))}
        </div>
        <p className="text-sm text-slate-400">
          Recursos: — <button type="button" className="text-brand-600 hover:underline">Editar</button>
        </p>
      </div>

      <PieceBoard pieces={pieces} />

      <PiecesTable />
    </div>
  );
}
