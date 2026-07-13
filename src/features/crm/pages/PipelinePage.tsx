import { useMemo, useState } from 'react';
import { Button } from '@/components/ui';
import { GROUP_COMPANIES } from '../data/seed';
import {
  opportunities as seedOpps, opportunitiesFor, stagesFor, pipelineStats, moveOpportunity,
  type Opportunity,
} from '../data/pipeline';
import { PipelineStatCards } from '../components/PipelineStatCards';
import { PipelineBoard } from '../components/PipelineBoard';

export function PipelinePage() {
  const [company, setCompany] = useState('ConceptOne');
  const [opps, setOpps] = useState<Opportunity[]>(seedOpps);

  const companyOpps = useMemo(() => opportunitiesFor(opps, company), [opps, company]);
  const stats = useMemo(() => pipelineStats(companyOpps, stagesFor(company)), [companyOpps, company]);

  const handleMove = (oppId: string, dir: 1 | -1) =>
    setOpps((prev) => moveOpportunity(prev, oppId, dir, stagesFor(company)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-800">Pipeline de ventas</h1>
          <p className="text-sm text-slate-500">Oportunidades por etapa. Cada empresa del grupo tiene su propio embudo.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            aria-label="Empresa"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:border-brand-400 focus:outline-none"
          >
            {GROUP_COMPANIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <Button variant="secondary">Etapas</Button>
          <Button variant="primary">+ Oportunidad</Button>
        </div>
      </div>

      <PipelineStatCards stats={stats} />
      <PipelineBoard company={company} opps={companyOpps} onMove={handleMove} />
    </div>
  );
}
