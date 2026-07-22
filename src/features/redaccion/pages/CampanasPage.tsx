import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router';
import { formatCurrency } from '@/lib/format';
import type { Magazine } from '../data/types';
import {
  stagesFor, campaignsFor, filterCampaigns,
  groupByStage, countByStage, sumByStage, campaignStats,
} from '../data/campanas';
import { CampanasToolbar } from '../components/CampanasToolbar';
import { StageBox } from '../components/StageBox';
import { CampaignRow } from '../components/CampaignRow';
import { CampanaKanbanColumn } from '../components/CampanaKanbanColumn';

export function CampanasPage() {
  const magazine = useOutletContext<Magazine>();
  const [view, setView] = useState<'embudo' | 'kanban'>('embudo');
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string | undefined>(undefined);

  const stages = useMemo(() => stagesFor(magazine.id), [magazine.id]);
  const all = useMemo(() => campaignsFor(magazine.id), [magazine.id]);
  const base = useMemo(() => filterCampaigns(all, { query }), [all, query]);
  // stats, contadores y sumas derivan de `base` (post-búsqueda) → buscar filtra todo, fiel al live.
  const stats = useMemo(() => campaignStats(base, stages), [base, stages]);

  const counts = countByStage(base, stages);
  const sums = sumByStage(base, stages);
  const stageById = Object.fromEntries(stages.map((s) => [s.id, s]));

  const filtered = filterCampaigns(base, { stageId: stageFilter });
  const toggleStage = (id: string) => setStageFilter((cur) => (cur === id ? undefined : id));

  return (
    <div className="space-y-4">
      <CampanasToolbar
        query={query}
        onQuery={setQuery}
        enElAire={stats.enElAire}
        ganado={stats.ganado}
        view={view}
        onView={(v) => { setView(v); setStageFilter(undefined); }}
      />

      {view === 'embudo' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {stages.map((s) => (
              <StageBox
                key={s.id}
                label={s.label}
                count={counts[s.id] ?? 0}
                amount={sums[s.id] ? formatCurrency(sums[s.id]) : undefined}
                tone={s.tone}
                selected={stageFilter === s.id}
                onClick={() => toggleStage(s.id)}
              />
            ))}
          </div>
          <div className="space-y-2">
            {filtered.map((c) => <CampaignRow key={c.id} campaign={c} stage={stageById[c.stageId]} />)}
          </div>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {groupByStage(base, stages).map((g) => (
            <CampanaKanbanColumn key={g.stage.id} stage={g.stage} items={g.items} />
          ))}
        </div>
      )}
    </div>
  );
}
