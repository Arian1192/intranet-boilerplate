import { useState } from 'react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { EuphoricCalendar, TodayButton } from '../components/EuphoricCalendar';
import { accounts, agendaEntries, events, pieces, publications, todayIso } from '../data/seed';
import type { AgendaEntryKind } from '../data/types';

type Layer = 'Agenda' | 'Publicaciones' | 'Creatividades' | 'Eventos';

const LAYERS: { id: Layer; dot: string; pill: string }[] = [
  { id: 'Agenda', dot: 'bg-cyan-500', pill: 'border-cyan-200 bg-cyan-50 text-cyan-700' },
  { id: 'Publicaciones', dot: 'bg-indigo-500', pill: 'border-indigo-200 bg-indigo-50 text-indigo-700' },
  { id: 'Creatividades', dot: 'bg-fuchsia-500', pill: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700' },
  { id: 'Eventos', dot: 'bg-rose-500', pill: 'border-rose-200 bg-rose-50 text-rose-600' },
];

const ENTRY_KINDS: { kind: AgendaEntryKind; dot: string }[] = [
  { kind: 'Reunión', dot: 'bg-cyan-400' },
  { kind: 'Lanzamiento', dot: 'bg-violet-400' },
  { kind: 'Grabación', dot: 'bg-amber-400' },
  { kind: 'Entrega', dot: 'bg-emerald-400' },
  { kind: 'Renovación', dot: 'bg-rose-400' },
  { kind: 'Otro', dot: 'bg-slate-300' },
];

const MONTH_LABELS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const [TODAY_YEAR, TODAY_MONTH, TODAY_DAY] = todayIso.split('-').map(Number);

function addMonths(cursor: { year: number; month: number }, delta: number) {
  const total = cursor.year * 12 + cursor.month + delta;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

function Chip({ active, onClick, className, children }: {
  active: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors',
        active ? className ?? 'border-slate-300 bg-white text-slate-800' : 'border-slate-200 bg-white text-slate-400'
      )}
    >
      {children}
    </button>
  );
}

export function AgendaPage() {
  const [cursor, setCursor] = useState({ year: TODAY_YEAR, month: TODAY_MONTH - 1 });
  const [activeLayers, setActiveLayers] = useState<Layer[]>(LAYERS.map((layer) => layer.id));
  const [accountFilter, setAccountFilter] = useState('todas');

  const accountFilters = ['todas', ...accounts.filter((account) => account.status === 'Activa').map((a) => a.name)];
  const matchesAccount = (account: string) => accountFilter === 'todas' || account === accountFilter;

  const toggleLayer = (layer: Layer) =>
    setActiveLayers((current) =>
      current.includes(layer) ? current.filter((item) => item !== layer) : [...current, layer]
    );

  const renderDay = (isoDate: string) => {
    const items: React.ReactNode[] = [];

    if (activeLayers.includes('Agenda')) {
      agendaEntries
        .filter((entry) => entry.isoDate === isoDate && matchesAccount(entry.account))
        .forEach((entry) => {
          items.push(
            <p key={entry.id} className="truncate rounded border border-cyan-200 bg-cyan-50 px-1.5 py-0.5 text-[11px] text-cyan-700">
              <span className="font-medium">{entry.time}</span> {entry.title}
            </p>
          );
        });
    }
    if (activeLayers.includes('Publicaciones')) {
      publications
        .filter((publication) => publication.isoDate === isoDate && matchesAccount(publication.account))
        .forEach((publication) => {
          items.push(
            <p key={publication.id} className="truncate rounded border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 text-[11px] text-indigo-700">
              {publication.name}
            </p>
          );
        });
    }
    if (activeLayers.includes('Creatividades')) {
      pieces
        .filter((piece) => piece.isoDeadline === isoDate && matchesAccount(piece.client))
        .forEach((piece) => {
          items.push(
            <p key={piece.id} className="truncate rounded border border-fuchsia-200 bg-fuchsia-50 px-1.5 py-0.5 text-[11px] text-fuchsia-700">
              {piece.title}
            </p>
          );
        });
    }
    if (activeLayers.includes('Eventos')) {
      events
        .filter((event) => event.isoDate === isoDate && (accountFilter === 'todas' || event.account === accountFilter))
        .forEach((event) => {
          items.push(
            <p key={event.id} className="truncate rounded border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[11px] text-rose-600">
              {event.name}
            </p>
          );
        });
    }

    return items.length === 0 ? null : <>{items}</>;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Agenda · Euphoric</h1>
          <p className="text-slate-500">Todo en un solo calendario: reuniones, publicaciones, deadlines y eventos.</p>
        </div>
        <Button>+ Entrada</Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Capas de la agenda" className="flex flex-wrap items-center gap-2">
          {LAYERS.map((layer) => (
            <Chip
              key={layer.id}
              active={activeLayers.includes(layer.id)}
              className={layer.pill}
              onClick={() => toggleLayer(layer.id)}
            >
              <span className={cn('h-1.5 w-1.5 rounded-full', layer.dot)} />
              {layer.id}
            </Chip>
          ))}
        </div>
        <div role="group" aria-label="Filtro de cuenta" className="flex flex-wrap items-center gap-2">
          {accountFilters.map((name) => (
            <Chip key={name} active={accountFilter === name} onClick={() => setAccountFilter(name)}>
              {name === 'todas' ? 'Todas' : name}
            </Chip>
          ))}
        </div>
      </div>

      <div role="region" aria-label="Agenda unificada">
        <EuphoricCalendar
          year={cursor.year}
          month={cursor.month}
          monthLabel={`${MONTH_LABELS[cursor.month]} ${cursor.year}`}
          onPrevMonth={() => setCursor((value) => addMonths(value, -1))}
          onNextMonth={() => setCursor((value) => addMonths(value, 1))}
          headerLayout="leading"
          headerActions={<TodayButton onClick={() => setCursor({ year: TODAY_YEAR, month: TODAY_MONTH - 1 })} />}
          today={{ year: TODAY_YEAR, month: TODAY_MONTH - 1, day: TODAY_DAY }}
          renderDay={renderDay}
        />
      </div>

      <div
        role="region"
        aria-label="Leyenda de la agenda"
        className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500"
      >
        <span className="font-medium text-slate-600">Agenda:</span>
        {ENTRY_KINDS.map((entry) => (
          <span key={entry.kind} className="inline-flex items-center gap-1.5">
            <span className={cn('h-2.5 w-2.5 rounded-sm', entry.dot)} />
            {entry.kind}
          </span>
        ))}
        <span className="ml-2 font-medium text-slate-600">Capas:</span>
        {LAYERS.filter((layer) => layer.id !== 'Agenda').map((layer) => (
          <span key={layer.id} className="inline-flex items-center gap-1.5">
            <span className={cn('h-2.5 w-2.5 rounded-sm', layer.dot)} />
            {layer.id}
          </span>
        ))}
      </div>
    </div>
  );
}
