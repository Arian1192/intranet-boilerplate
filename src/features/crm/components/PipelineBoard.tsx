import { stagesFor, groupByStage, type Opportunity } from '../data/pipeline';
import { PipelineColumn } from './PipelineColumn';

interface Props {
  company: string;
  opps: Opportunity[];
  onMove: (oppId: string, dir: 1 | -1) => void;
}

export function PipelineBoard({ company, opps, onMove }: Props) {
  const stages = stagesFor(company);
  if (stages.length === 0) {
    return (
      <div className="grid place-items-center gap-3 rounded-2xl border border-dashed border-slate-200 py-16 text-center">
        <p className="text-sm text-slate-500">{company} no tiene etapas configuradas todavía.</p>
        <button type="button" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Configurar etapas
        </button>
      </div>
    );
  }
  const groups = groupByStage(opps, stages);
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {groups.map(({ stage, opps: stageOpps, total }) => (
        <PipelineColumn key={stage.id} stage={stage} opps={stageOpps} total={total} stages={stages} onMove={onMove} />
      ))}
    </div>
  );
}
