import { useState } from 'react';
import { Button, MonthCalendar, SegmentedControl, Select } from '@/components/ui';
import type { MonthCalendarEvent } from '@/components/ui/MonthCalendar';
import { cn } from '@/lib/utils';
import { PublicationKanban } from '../components/PublicationKanban';
import { PublicationTable } from '../components/PublicationTable';
import { events, publications } from '../data/seed';

type ContenidoView = 'calendario' | 'lista' | 'kanban';
type AccountFilter = 'todas' | 'SIGHT';

const VIEW_OPTIONS: { label: string; value: ContenidoView }[] = [
  { label: 'Calendario', value: 'calendario' },
  { label: 'Lista', value: 'lista' },
  { label: 'Kanban', value: 'kanban' },
];

const CHANNEL_OPTIONS = [
  'Todos los canales',
  'Instagram',
  'Facebook',
  'Google',
  'TikTok',
  'YouTube',
  'LinkedIn',
  'X / Twitter',
  'Otro',
];

const MONTH_LABELS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const TODAY = { year: 2026, month: 6 };

function addMonths(cursor: { year: number; month: number }, delta: number) {
  const total = cursor.year * 12 + cursor.month + delta;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

function FilterChip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
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

function CalendarioView() {
  const [cursor, setCursor] = useState(TODAY);
  const [showEvents, setShowEvents] = useState(true);

  const calendarEvents: MonthCalendarEvent[] = [
    ...publications.map((pub) => ({
      id: pub.id,
      isoDate: pub.isoDate,
      label: pub.name,
      toneClassName: 'bg-blue-50 text-blue-700',
    })),
    ...(showEvents
      ? events.map((event) => ({
          id: event.id,
          isoDate: event.isoDate,
          label: `📍 ${event.name}`,
          toneClassName: 'bg-red-50 text-red-600',
        }))
      : []),
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setShowEvents((value) => !value)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
            showEvents ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-200 text-slate-500'
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Eventos
        </button>
        <Button variant="secondary" size="sm" onClick={() => setCursor(TODAY)}>
          Hoy
        </Button>
      </div>
      <MonthCalendar
        year={cursor.year}
        month={cursor.month}
        monthLabel={`${MONTH_LABELS[cursor.month]} ${cursor.year}`}
        events={calendarEvents}
        onPrevMonth={() => setCursor((value) => addMonths(value, -1))}
        onNextMonth={() => setCursor((value) => addMonths(value, 1))}
      />
    </div>
  );
}

export function ContenidoPage() {
  const [view, setView] = useState<ContenidoView>('calendario');
  const [accountFilter, setAccountFilter] = useState<AccountFilter>('todas');
  const [channel, setChannel] = useState('Todos los canales');

  const filteredPublications = publications.filter((pub) => {
    if (accountFilter !== 'todas' && pub.account !== accountFilter) return false;
    if (channel !== 'Todos los canales' && pub.channel !== channel) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Contenido</h1>
          <p className="text-slate-500">Community management: planifica y controla el estado de las publicaciones.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {view !== 'calendario' && <Button>+ Publicación</Button>}
          <Select
            className="w-48"
            value={channel}
            onChange={(event) => setChannel(event.target.value)}
          >
            {CHANNEL_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FilterChip active={accountFilter === 'todas'} onClick={() => setAccountFilter('todas')}>
            Todas
          </FilterChip>
          <FilterChip active={accountFilter === 'SIGHT'} onClick={() => setAccountFilter('SIGHT')}>
            SIGHT
          </FilterChip>
        </div>
        <SegmentedControl options={VIEW_OPTIONS} value={view} onChange={setView} />
      </div>

      {view === 'calendario' && <CalendarioView />}
      {view === 'lista' && <PublicationTable publications={filteredPublications} />}
      {view === 'kanban' && <PublicationKanban publications={filteredPublications} />}
    </div>
  );
}
