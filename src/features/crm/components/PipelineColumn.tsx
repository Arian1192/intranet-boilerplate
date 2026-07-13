import type { PipelineStage, Opportunity } from '../data/pipeline';
import { formatEur } from '../data/pipeline';
import { OpportunityCard } from './OpportunityCard';

interface Props {
  stage: PipelineStage;
  opps: Opportunity[];
  total: number;
  stages: PipelineStage[];
  onMove: (oppId: string, dir: 1 | -1) => void;
}

export function PipelineColumn({ stage, opps, total, stages, onMove }: Props) {
  const idx = stages.findIndex((s) => s.id === stage.id);
  return (
    <div className="w-72 shrink-0">
      <div className="mb-2 flex items-center gap-2 px-1">
        <span className="font-semibold text-slate-800">{stage.name}</span>
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-slate-100 px-1.5 text-xs font-medium text-slate-500">{opps.length}</span>
        <span className="ml-auto text-xs text-slate-400">{formatEur(total)}</span>
      </div>
      {opps.length === 0 ? (
        <p className="px-1 text-sm text-slate-300">—</p>
      ) : (
        <div className="space-y-2">
          {opps.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opp={opp}
              canPrev={idx > 0}
              canNext={idx < stages.length - 1}
              onMove={(dir) => onMove(opp.id, dir)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
