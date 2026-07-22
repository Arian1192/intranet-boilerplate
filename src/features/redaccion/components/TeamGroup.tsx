import type { ContentPiece, ContentStatus, ContentTeam } from '../data/contenidos';
import { StatusBox } from './StatusBox';
import { ContentRow } from './ContentRow';

export interface TeamGroupProps {
  team: ContentTeam;
  teamLabel: string;
  teamChip: string;
  count: number;
  statuses: ContentStatus[];
  counts: Record<string, number>;
  pieces: ContentPiece[];
  selectedStatusId?: string;
  onStatusClick?: (id: string) => void;
}

export function TeamGroup({ teamLabel, teamChip, count, statuses, counts, pieces, selectedStatusId, onStatusClick }: TeamGroupProps) {
  const statusById = Object.fromEntries(statuses.map((s) => [s.id, s]));
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${teamChip}`}>
            {teamLabel}
          </span>
          <span className="text-sm text-slate-400">{count}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <StatusBox
              key={s.id}
              label={s.label}
              count={counts[s.id] ?? 0}
              tone={s.tone}
              selected={selectedStatusId === s.id}
              onClick={onStatusClick ? () => onStatusClick(s.id) : undefined}
            />
          ))}
        </div>
      </div>
      <div className="mt-3">
        {pieces.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">Nada pendiente en este canal.</p>
        ) : (
          pieces.map((p) => <ContentRow key={p.id} piece={p} status={statusById[p.statusId]} />)
        )}
      </div>
    </section>
  );
}
