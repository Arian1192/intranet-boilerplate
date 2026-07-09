import { useState } from 'react';
import { Badge, Button, Input, MasterDetailList, SegmentedControl } from '@/components/ui';
import { EuphoricCalendar, EventPill } from '../components/EuphoricCalendar';
import { EventForm } from '../components/EventForm';
import { events } from '../data/seed';
import type { EventItem } from '../data/types';

type EventosView = 'lista' | 'calendario';

const VIEW_OPTIONS: { label: string; value: EventosView }[] = [
  { label: 'Lista', value: 'lista' },
  { label: 'Calendario', value: 'calendario' },
];

const KIND_LABEL: Record<EventItem['kind'], string> = {
  marketing: 'Marketing',
  produccion: 'Producción',
};

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

interface EventosListaProps {
  creating: boolean;
  onCreatingChange: (creating: boolean) => void;
}

function EventosLista({ creating, onCreatingChange }: EventosListaProps) {
  const [search, setSearch] = useState('');
  const filtered = events.filter((event) => event.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <MasterDetailList
      items={filtered}
      emptyState="Selecciona un evento o crea uno nuevo."
      detailOverride={creating ? <EventForm onSave={() => onCreatingChange(false)} /> : undefined}
      listTop={
        <Input
          placeholder="Buscar evento…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      }
      renderRow={(event) => (
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium text-slate-900">{event.name}</p>
            <p className="text-sm text-slate-500">
              {event.dateLabel} · {event.city}
              {event.euphoricCount !== undefined && ` · ${event.euphoricCount} en Euphoric`}
            </p>
          </div>
          <Badge variant={event.kind === 'marketing' ? 'neutral' : 'pink'}>{KIND_LABEL[event.kind]}</Badge>
        </div>
      )}
      renderDetail={(event) => (
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{event.name}</h2>
          <p className="text-sm text-slate-500">
            {event.dateLabel} · {event.city}
          </p>
        </div>
      )}
    />
  );
}

function EventosCalendario() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(6); // Julio 2026 (0-indexed)

  const eventsByDate = new Map<string, EventItem[]>();
  events.forEach((event) => {
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
          <EventPill key={event.id} name={event.name} tone={event.kind === 'marketing' ? 'violet' : 'rose'} />
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
    <div className="space-y-4">
      <EuphoricCalendar
        year={year}
        month={month}
        monthLabel={`${MONTHS_ES[month]} ${year}`}
        onPrevMonth={() => goToMonth(-1)}
        onNextMonth={() => goToMonth(1)}
        today={{ year: 2026, month: 6, day: 9 }}
        renderDay={renderDay}
      />
      <p className="text-center text-sm text-slate-400">
        Toca un evento del calendario para editarlo, o «+ Nuevo evento».
      </p>
    </div>
  );
}

export function EventosPage() {
  const [view, setView] = useState<EventosView>('lista');
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Eventos</h1>
        <p className="text-slate-500">
          Base de eventos del grupo (compartida). Crea aquí los eventos de marketing; solo aparecen en
          Producción si marcas que los produce Black Moose.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <SegmentedControl options={VIEW_OPTIONS} value={view} onChange={setView} />
        <Button
          onClick={() => {
            setCreating(true);
            setView('lista');
          }}
        >
          + Nuevo evento
        </Button>
      </div>

      {view === 'lista' ? (
        <EventosLista creating={creating} onCreatingChange={setCreating} />
      ) : (
        <EventosCalendario />
      )}
    </div>
  );
}
