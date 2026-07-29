import { useState } from 'react';
import { Button, Card, SegmentedControl } from '@/components/ui';
import { cn } from '@/lib/utils';
import { EuphoricCalendar, TodayButton } from '../components/EuphoricCalendar';
import { PieceBoard } from '../components/PieceBoard';
import { PieceDrawer } from '../components/PieceDrawer';
import { StatusChip } from '../components/StatusChip';
import { pieces, todayIso } from '../data/seed';
import { pieceStatusLabel } from '../data/labels';
import type { Piece } from '../data/types';

type PiezasFilter = 'todas' | 'mias' | 'diseno' | 'video' | 'pend-aprobar' | 'correcciones' | 'atrasadas';
type PiezasView = 'tablero' | 'calendario';

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

function PiecesTable({ pieces: visiblePieces }: { pieces: Piece[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="text-xs font-medium text-slate-400">
          <tr className="border-b border-slate-100">
            <th className="px-4 py-3">CREATIVIDAD</th>
            <th className="px-4 py-3">CLIENTE</th>
            <th className="px-4 py-3">TIPO</th>
            <th className="px-4 py-3">DEADLINE</th>
            <th className="px-4 py-3">ESTADO</th>
            <th className="px-4 py-3">CLIENTE APROB.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {visiblePieces.map((piece) => (
            <tr key={piece.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-900">
                {piece.title} <span className="font-normal text-slate-400">{piece.version}</span>
              </td>
              <td className="px-4 py-3 text-slate-500">{piece.client}</td>
              <td className="px-4 py-3 text-slate-500">{piece.type}</td>
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

const ASSIGNEES = ['Alba', 'Carlos', 'Maf'];
const VIEW_OPTIONS: { label: string; value: PiezasView }[] = [
  { label: 'Tablero', value: 'tablero' },
  { label: 'Calendario', value: 'calendario' },
];

const MONTH_LABELS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const [TODAY_YEAR, TODAY_MONTH, TODAY_DAY] = todayIso.split('-').map(Number);
const TODAY = { year: TODAY_YEAR, month: TODAY_MONTH - 1 };

function addMonths(cursor: { year: number; month: number }, delta: number) {
  const total = cursor.year * 12 + cursor.month + delta;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

function isOverdue(piece: Piece) {
  return piece.isoDeadline !== '' && piece.isoDeadline < todayIso && piece.status !== 'aprobado';
}

function matchesFilter(piece: Piece, filter: PiezasFilter) {
  switch (filter) {
    case 'mias':
      return piece.owner === 'Alba';
    case 'diseno':
      return piece.type === 'Estático';
    case 'video':
      return piece.type === 'Vídeo';
    case 'pend-aprobar':
      return piece.status === 'revision';
    case 'correcciones':
      return piece.status === 'cambios';
    case 'atrasadas':
      return isOverdue(piece);
    default:
      return true;
  }
}

function PiecesCalendar({ pieces: visiblePieces }: { pieces: Piece[] }) {
  const [cursor, setCursor] = useState(TODAY);
  const withoutDeadline = visiblePieces.filter((piece) => piece.isoDeadline === '').length;

  const renderDay = (isoDate: string) => {
    const dayPieces = visiblePieces.filter((piece) => piece.isoDeadline === isoDate);
    if (dayPieces.length === 0) return null;
    return (
      <>
        {dayPieces.map((piece) => (
          <p key={piece.id} className="truncate rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">
            {piece.title}
          </p>
        ))}
      </>
    );
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-400">{withoutDeadline} sin deadline</p>
      <EuphoricCalendar
        year={cursor.year}
        month={cursor.month}
        monthLabel={`${MONTH_LABELS[cursor.month]} ${cursor.year}`}
        onPrevMonth={() => setCursor((value) => addMonths(value, -1))}
        onNextMonth={() => setCursor((value) => addMonths(value, 1))}
        headerLayout="leading"
        headerActions={<TodayButton onClick={() => setCursor(TODAY)} />}
        today={{ year: TODAY.year, month: TODAY.month, day: TODAY_DAY }}
        renderDay={renderDay}
      />
    </div>
  );
}

export function PiezasPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<PiezasFilter>('todas');
  const [view, setView] = useState<PiezasView>('tablero');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  const toggleAssignee = (assignee: string) => {
    setSelectedAssignees((current) =>
      current.includes(assignee) ? current.filter((item) => item !== assignee) : [...current, assignee]
    );
  };

  const visiblePieces = pieces.filter((piece) => matchesFilter(piece, filter));
  const activeCount = pieces.filter((piece) => piece.status !== 'aprobado').length;
  const pendApprove = pieces.filter((piece) => piece.status === 'revision').length;
  const enCorrecciones = pieces.filter((piece) => piece.status === 'cambios').length;
  const atrasadas = pieces.filter(isOverdue).length;

  return (
    <div className="space-y-6" data-drawer-open={drawerOpen}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Creatividades</h1>
          <p className="text-slate-500">Content creation: seguimiento de artes por estado de producción.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">Asignar a:</span>
          {ASSIGNEES.map((assignee) => (
            <AssigneeChip
              key={assignee}
              active={selectedAssignees.includes(assignee)}
              onClick={() => toggleAssignee(assignee)}
            >
              + {assignee}
            </AssigneeChip>
          ))}
          <Button onClick={() => setDrawerOpen(true)}>+ Nueva creatividad</Button>
        </div>
      </div>

      <div
        role="region"
        aria-label="Indicadores de creatividades"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <PieceStatCard value={String(activeCount)} label="Creatividades activas" />
        <PieceStatCard value={String(pendApprove)} label="Pend. aprobar" valueClassName="text-amber-500" />
        <PieceStatCard value={String(enCorrecciones)} label="En correcciones" valueClassName="text-red-500" />
        <PieceStatCard value={String(atrasadas)} label="Atrasadas" valueClassName="text-red-500" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl options={VIEW_OPTIONS} value={view} onChange={setView} />
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

      {view === 'tablero' ? <PieceBoard pieces={visiblePieces} /> : <PiecesCalendar pieces={visiblePieces} />}

      <PiecesTable pieces={visiblePieces} />

      <PieceDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
