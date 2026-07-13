import { describe, it, expect } from 'vitest';
import {
  STAGES, opportunities, COMPANIES_WITH_PIPELINE,
  stagesFor, opportunitiesFor, groupByStage, pipelineStats, moveOpportunity,
  formatEur,
} from './pipeline';

describe('pipeline data', () => {
  it('has the exact ConceptOne and Etra stages in order', () => {
    // STAGES is the flat source of truth stagesFor() derives from; assert it's populated
    // (also keeps the import "used" under noUnusedLocals).
    expect(STAGES.length).toBeGreaterThan(0);
    expect(stagesFor('ConceptOne').map((s) => s.name)).toEqual([
      'Interés', 'Oferta enviada', 'Confirmando fecha', 'Contratado', 'Caído',
    ]);
    expect(stagesFor('Etra Agency').map((s) => s.name)).toEqual([
      'Nuevo', 'Contactado', 'Cualificado', 'Propuesta', 'Negociación', 'Ganada', 'Perdida',
    ]);
  });

  it('marks only ConceptOne+Etra as companies with a pipeline', () => {
    expect(COMPANIES_WITH_PIPELINE).toEqual(['ConceptOne', 'Etra Agency']);
    expect(stagesFor('CRUDA')).toEqual([]);
  });

  it('marks won/lost terminal stages', () => {
    const c1 = stagesFor('ConceptOne');
    expect(c1.find((s) => s.name === 'Contratado')?.outcome).toBe('won');
    expect(c1.find((s) => s.name === 'Caído')?.outcome).toBe('lost');
  });

  it('groupByStage buckets opportunities and sums totals', () => {
    const stages = stagesFor('Etra Agency');
    const opps = opportunitiesFor(opportunities, 'Etra Agency');
    const groups = groupByStage(opps, stages);
    expect(groups.map((g) => g.stage.name)).toEqual(stages.map((s) => s.name));
    const perStage = groups.reduce((acc, g) => acc + g.opps.length, 0);
    expect(perStage).toBe(opps.length);
    groups.forEach((g) => {
      expect(g.total).toBe(g.opps.reduce((a, o) => a + o.amount, 0));
    });
  });

  it('pipelineStats: open excludes won/lost; forecast = Σ amount×probability', () => {
    const stages = stagesFor('Etra Agency');
    const opps = opportunitiesFor(opportunities, 'Etra Agency');
    const stats = pipelineStats(opps, stages);
    // recompute expectation independently
    const stageById = Object.fromEntries(stages.map((s) => [s.id, s]));
    const open = opps.filter((o) => !stageById[o.stageId]?.outcome);
    expect(stats.openCount).toBe(open.length);
    expect(stats.openTotal).toBe(open.reduce((a, o) => a + o.amount, 0));
    const forecast = open.reduce((a, o) => a + o.amount * (stageById[o.stageId]?.probability ?? 0), 0);
    expect(stats.forecast).toBeCloseTo(forecast, 2);
    const won = opps.filter((o) => stageById[o.stageId]?.outcome === 'won');
    expect(stats.wonCount).toBe(won.length);
  });

  it('moveOpportunity advances/retreats a stage and clamps at the ends', () => {
    const stages = stagesFor('ConceptOne');
    const opps = opportunitiesFor(opportunities, 'ConceptOne');
    const first = opps[0];
    const firstStageIdx = stages.findIndex((s) => s.id === first.stageId);
    const moved = moveOpportunity(opps, first.id, 1, stages);
    const movedOpp = moved.find((o) => o.id === first.id)!;
    expect(movedOpp.stageId).toBe(stages[Math.min(firstStageIdx + 1, stages.length - 1)].id);
    // clamp: move to stage 0 then back once more stays at 0
    const atStart = moveOpportunity(opps.map((o) => o.id === first.id ? { ...o, stageId: stages[0].id } : o), first.id, -1, stages);
    expect(atStart.find((o) => o.id === first.id)!.stageId).toBe(stages[0].id);
    // immutability
    expect(moved).not.toBe(opps);
  });

  it('formatEur uses es-ES currency', () => {
    expect(formatEur(48000).replace(/\u00A0/g, ' ')).toBe('48.000,00 €');
  });
});
