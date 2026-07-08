import { useState } from 'react';
import { SegmentedControl, Badge, KanbanBoard, KanbanCard, MonthCalendar, Input } from '@/components/ui';
import { useProductionEvents } from '../hooks/useProductionEvents';
import type { ProductionEvent, EventStatus } from '@/types';

type EventsView = 'listado' | 'calendario' | 'kanban';

const VIEW_OPTIONS: { label: string; value: EventsView }[] = [
  { label: 'Listado', value: 'listado' },
  { label: 'Calendario', value: 'calendario' },
  { label: 'Kanban', value: 'kanban' },
];

const STATUS_LABEL: Record<EventStatus, string> = {
  idea: 'Idea',
  confirmed: 'Confirmado',
  'in-production': 'En producción',
  'in-progress': 'En curso',
  closed: 'Cerrado',
};

const STATUS_BADGE_VARIANT: Record<EventStatus, 'neutral' | 'blue' | 'amber'> = {
  idea: 'neutral',
  confirmed: 'blue',
  'in-production': 'amber',
  'in-progress': 'amber',
  closed: 'neutral',
};

const KANBAN_COLUMNS: { id: EventStatus; accentClassName: string }[] = [
  { id: 'idea', accentClassName: 'border-t-slate-300' },
  { id: 'confirmed', accentClassName: 'border-t-blue-400' },
  { id: 'in-production', accentClassName: 'border-t-amber-400' },
  { id: 'in-progress', accentClassName: 'border-t-indigo-400' },
  { id: 'closed', accentClassName: 'border-t-emerald-400' },
];

const MONTH_TONE: Record<EventStatus, string> = {
  idea: 'bg-slate-100 text-slate-600',
  confirmed: 'bg-blue-100 text-blue-700',
  'in-production': 'bg-amber-100 text-amber-700',
  'in-progress': 'bg-indigo-100 text-indigo-700',
  closed: 'bg-emerald-100 text-emerald-700',
};

function EventRow({ event }: { event: ProductionEvent }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="text-lg">{event.icon}</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-base font-medium text-slate-700">{event.title}</h4>
            {event.isHome && (
              <Badge variant="amber" size="sm">
                ★ Home
              </Badge>
            )}
            {event.role === 'promoter' && (
              <Badge variant="fuchsia" size="sm">
                Promotor
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {event.date} · {event.time} · {event.venue}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {event.businessLines.map((line) => (
          <span key={line} className="text-xs text-slate-600">
            {line}
          </span>
        ))}
        <Badge variant={STATUS_BADGE_VARIANT[event.status]}>{STATUS_LABEL[event.status]}</Badge>
      </div>
    </div>
  );
}

export function EventsPage() {
  const { data, isLoading, error } = useProductionEvents();
  const [view, setView] = useState<EventsView>('listado');
  const [monthOffset, setMonthOffset] = useState(0);

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error || !data) {
    return <div className="py-12 text-center text-red-600">Error: {error || 'No data'}</div>;
  }

  const baseDate = new Date(2026, 6, 1); // Julio 2026, matches fixture dates
  const viewDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1);
  const monthLabel = viewDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  const calendarEvents = data.map((event) => ({
    id: event.id,
    isoDate: event.isoDate,
    label: event.title,
    toneClassName: MONTH_TONE[event.status],
  }));

  const kanbanColumns = KANBAN_COLUMNS.map((column) => {
    const items = data.filter((event) => event.status === column.id);
    return {
      id: column.id,
      label: STATUS_LABEL[column.id],
      accentClassName: column.accentClassName,
      count: items.length,
      children:
        items.length > 0 ? (
          <>
            {items.map((event) => (
              <KanbanCard key={event.id}>
                <p className="font-medium text-slate-800">
                  {event.icon} {event.title}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {event.date} · {event.time}
                </p>
                <p className="text-xs text-slate-400">{event.venue}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {event.businessLines.map((line) => (
                    <Badge key={line} variant="neutral" size="sm">
                      {line}
                    </Badge>
                  ))}
                </div>
              </KanbanCard>
            ))}
          </>
        ) : undefined,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Eventos</h1>
          <p className="text-sm text-slate-500">Base de datos de eventos y producciones del grupo.</p>
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
        >
          + Nuevo evento
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl options={VIEW_OPTIONS} value={view} onChange={setView} />
        <Input placeholder="Buscar..." className="max-w-xs" />
        <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800">
          <option>Todos los tipos</option>
        </select>
        <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800">
          <option>Todas las líneas</option>
        </select>
      </div>

      {view === 'listado' && (
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white shadow-sm">
          {data.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </div>
      )}

      {view === 'calendario' && (
        <MonthCalendar
          year={viewDate.getFullYear()}
          month={viewDate.getMonth()}
          monthLabel={monthLabel}
          events={calendarEvents}
          onPrevMonth={() => setMonthOffset((offset) => offset - 1)}
          onNextMonth={() => setMonthOffset((offset) => offset + 1)}
        />
      )}

      {view === 'kanban' && <KanbanBoard columns={kanbanColumns} />}
    </div>
  );
}
