import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import {
  STAGES, campaigns,
  stagesFor, campaignsFor, filterCampaigns,
  groupByStage, countByStage, sumByStage, campaignStats,
} from './campanas';

describe('campanas data', () => {
  it('cada revista tiene las 6 etapas del embudo en orden con buckets/tones correctos', () => {
    for (const mag of ['mixmag', 'tagmag'] as const) {
      const s = stagesFor(mag);
      expect(s.map((x) => x.label)).toEqual([
        'TENTATIVA', 'PROPUESTA ENVIADA', 'NEGOCIACIÓN', 'ACEPTADA', 'EN CURSO', 'COMPLETADA',
      ]);
      const aceptada = s.find((x) => x.label === 'ACEPTADA')!;
      expect(aceptada.bucket).toBe('ganado');
      expect(aceptada.tone).toBe('emerald');
      expect(s.find((x) => x.label === 'TENTATIVA')!.bucket).toBe('aire');
      expect(s.filter((x) => x.tone === 'emerald')).toHaveLength(1); // solo ACEPTADA
    }
  });

  it('siembra una campaña por revista (Campaña Test 1, ACEPTADA, 1500)', () => {
    for (const mag of ['mixmag', 'tagmag'] as const) {
      const c = campaignsFor(mag);
      expect(c).toHaveLength(1);
      expect(c[0].name).toBe('Campaña Test 1');
      expect(c[0].client).toBe('Cold Cloud SL');
      expect(c[0].amount).toBe(1500);
      expect(c[0].untilLabel).toBe('hasta 29 jul');
      const aceptada = stagesFor(mag).find((s) => s.label === 'ACEPTADA')!;
      expect(c[0].stageId).toBe(aceptada.id);
    }
  });

  it('campaignStats: en el aire 0, ganado 1500', () => {
    const mag = 'mixmag';
    const stats = campaignStats(campaignsFor(mag), stagesFor(mag));
    expect(stats.enElAire).toBe(0);
    expect(stats.ganado).toBe(1500);
  });

  it('countByStage y sumByStage: ACEPTADA 1 / 1500, resto 0', () => {
    const mag = 'mixmag';
    const stages = stagesFor(mag);
    const c = campaignsFor(mag);
    const aceptada = stages.find((s) => s.label === 'ACEPTADA')!.id;
    const tentativa = stages.find((s) => s.label === 'TENTATIVA')!.id;
    expect(countByStage(c, stages)[aceptada]).toBe(1);
    expect(sumByStage(c, stages)[aceptada]).toBe(1500);
    expect(countByStage(c, stages)[tentativa]).toBe(0);
    expect(sumByStage(c, stages)[tentativa]).toBe(0);
  });

  it('filterCampaigns por query (name/client) y stageId; inmutable', () => {
    const c = campaignsFor('mixmag');
    expect(filterCampaigns(c, { query: 'test' })).toHaveLength(1);
    expect(filterCampaigns(c, { query: 'cold' })).toHaveLength(1); // matchea cliente
    expect(filterCampaigns(c, { query: 'zzz' })).toHaveLength(0);
    const aceptada = stagesFor('mixmag').find((s) => s.label === 'ACEPTADA')!.id;
    expect(filterCampaigns(c, { stageId: aceptada })).toHaveLength(1);
    expect(filterCampaigns(c, {})).not.toBe(c);
  });

  it('groupByStage devuelve las etapas en orden con sus campañas', () => {
    const stages = stagesFor('mixmag');
    const groups = groupByStage(campaignsFor('mixmag'), stages);
    expect(groups.map((g) => g.stage.label)).toEqual(stages.map((s) => s.label));
    const aceptada = groups.find((g) => g.stage.label === 'ACEPTADA')!;
    expect(aceptada.items).toHaveLength(1);
  });

  it('STAGES y campaigns poblados (uso bajo noUnusedLocals)', () => {
    expect(STAGES.length).toBe(12); // 6 mixmag + 6 tagmag
    expect(campaigns.length).toBe(2);
  });
});
