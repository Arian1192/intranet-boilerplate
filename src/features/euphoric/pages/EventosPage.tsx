import { useState } from 'react';
import { Badge, Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { EuphoricCalendar, TodayButton } from '../components/EuphoricCalendar';
import { EventForm } from '../components/EventForm';
import { events, todayIso } from '../data/seed';
import type { EventItem } from '../data/types';

const [TODAY_YEAR, TODAY_MONTH, TODAY_DAY] = todayIso.split('-').map(Number);

const KIND_LABEL: Record<EventItem['kind'], string> = {
  marketing: 'Marketing',
  produccion: 'Producción',
};

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function EventosCalendario({ events: visibleEvents }: { events: EventItem[] }) {
  const [year, setYear] = useState(TODAY_YEAR);
  const [month, setMonth] = useState(TODAY_MONTH - 1);

  const eventsByDate = new Map<string, EventItem[]>();
  visibleEvents.forEach((event) => {
    const list = eventsByDate.get(event.isoDate) ?? [];
    list.push(event);
    eventsByDate.set(event.isoDate, list);
  });

  const renderDay = (isoDate: string) => {
    const dayEvents = eventsByDate.get(isoDate) ?? [];
    if (dayEvents.length === 0) return null;
    return (
      <>
        {dayEvents.map((event) => (
          <div key={event.id} className="space-y-0.5 rounded-md bg-slate-50 p-1.5">
            <p className="line-clamp-2 text-[11px] font-medium text-slate-700">{event.name}</p>
            <p className="text-[10px] text-slate-400">
              {[event.account, event.city].filter(Boolean).join(' · ')}
            </p>
            <Badge variant={event.kind === 'marketing' ? 'neutral' : 'pink'} size="sm">
              {KIND_LABEL[event.kind]}
            </Badge>
          </div>
        ))}
      </>
    );
  };

  const goToMonth = (delta: number) => {
    const total = month + delta;
    const nextYear = year + Math.floor(total / 12);
    const nextMonth = ((total % 12) + 12) % 12;
    setYear(nextYear);
    setMonth(nextMonth);
  };

  return (
    <div role="region" aria-label="Calendario de eventos" className="space-y-4">
      <EuphoricCalendar
        year={year}
        month={month}
        monthLabel={`${MONTHS_ES[month]} ${year}`}
        onPrevMonth={() => goToMonth(-1)}
        onNextMonth={() => goToMonth(1)}
        headerLayout="leading"
        headerActions={
          <TodayButton
            onClick={() => {
              setYear(TODAY_YEAR);
              setMonth(TODAY_MONTH - 1);
            }}
          />
        }
        today={{ year: TODAY_YEAR, month: TODAY_MONTH - 1, day: TODAY_DAY }}
        renderDay={renderDay}
      />
      <p className="text-center text-sm text-slate-400">
        Toca un evento del calendario para editarlo, o «+ Nuevo evento».
      </p>
    </div>
  );
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

export function EventosPage() {
  const [creating, setCreating] = useState(false);
  const [accountFilter, setAccountFilter] = useState('todas');

  const accountFilters = ['todas', ...new Set(events.map((event) => event.account).filter(Boolean))];
  const visibleEvents =
    accountFilter === 'todas' ? events : events.filter((event) => event.account === accountFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Eventos</h1>
          <p className="text-slate-500">
            Base de eventos del grupo (compartida). Crea aquí los eventos de marketing; solo aparecen en
            Producción si marcas que los produce Black Moose.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>+ Nuevo evento</Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {accountFilters.map((name) => (
          <FilterChip key={name} active={accountFilter === name} onClick={() => setAccountFilter(name)}>
            {name === 'todas' ? 'Todas' : name}
          </FilterChip>
        ))}
      </div>

      {creating ? (
        <Card className="p-6">
          <EventForm onSave={() => setCreating(false)} />
        </Card>
      ) : (
        <EventosCalendario events={visibleEvents} />
      )}
    </div>
  );
}
