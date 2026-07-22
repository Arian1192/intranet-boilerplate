import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router';
import type { Magazine } from '../data/types';
import {
  TEAMS, statusesFor, statusesForTeam, piecesFor, filterPieces,
  countByStatus, teamCounts,
  type ContentTeam,
} from '../data/contenidos';
import { ContenidosToolbar } from '../components/ContenidosToolbar';
import { TeamGroup } from '../components/TeamGroup';
import { TeamTabs } from '../components/TeamTabs';
import { KanbanColumn } from '../components/KanbanColumn';

export function ContenidosPage() {
  const magazine = useOutletContext<Magazine>();
  const [view, setView] = useState<'panel' | 'kanban'>('panel');
  const [query, setQuery] = useState('');
  const [mine, setMine] = useState(false);
  const [scope, setScope] = useState<'todo' | 'campana' | 'organico'>('todo');
  const [teamTab, setTeamTab] = useState<ContentTeam | 'todos'>('todos');
  const [selectedStatus, setSelectedStatus] = useState<{ team: ContentTeam; statusId: string } | null>(null);

  const all = useMemo(() => piecesFor(magazine.id), [magazine.id]);
  const base = useMemo(
    () => filterPieces(all, { query, mine, scope }),
    [all, query, mine, scope]
  );

  const toggleStatus = (team: ContentTeam, statusId: string) =>
    setSelectedStatus((cur) => (cur && cur.team === team && cur.statusId === statusId ? null : { team, statusId }));

  return (
    <div className="space-y-4">
      <ContenidosToolbar
        spaceName={magazine.spaceName}
        accent={magazine.accent}
        query={query}
        onQuery={setQuery}
        mine={mine}
        onMine={setMine}
        scope={scope}
        onScope={setScope}
        view={view}
        onView={(v) => {
          setView(v);
          setSelectedStatus(null);
        }}
      />

      {view === 'panel' ? (
        <div className="space-y-4">
          {TEAMS.map((t) => {
            const statuses = statusesForTeam(magazine.id, t.id);
            const sel = selectedStatus?.team === t.id ? selectedStatus.statusId : undefined;
            const teamPieces = filterPieces(base, { team: t.id, statusId: sel });
            const teamAll = filterPieces(base, { team: t.id });
            return (
              <TeamGroup
                key={t.id}
                team={t.id}
                teamLabel={t.label.toUpperCase()}
                teamChip={t.chip}
                count={teamAll.length}
                statuses={statuses}
                counts={countByStatus(teamAll, statuses)}
                pieces={teamPieces}
                selectedStatusId={sel}
                onStatusClick={(id) => toggleStatus(t.id, id)}
              />
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          <TeamTabs counts={teamCounts(base)} active={teamTab} onSelect={setTeamTab} />
          <div className="flex gap-3 overflow-x-auto pb-4">
            {statusesFor(magazine.id).map((s) => {
              const cards = filterPieces(base, {
                statusId: s.id,
                team: teamTab === 'todos' ? undefined : teamTab,
              });
              return <KanbanColumn key={s.id} status={s} pieces={cards} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
