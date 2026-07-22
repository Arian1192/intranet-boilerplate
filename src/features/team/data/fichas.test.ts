import { describe, it, expect } from 'vitest';
import { fichas, companies, totalMonthlyCost, costRankingByPerson, fichaFor, filterFichas } from './fichas';

describe('fichas data', () => {
  it('has 26 fichas, 4 contratado and 22 freelance', () => {
    expect(fichas).toHaveLength(26);
    expect(fichas.filter((f) => f.employmentType === 'contratado')).toHaveLength(4);
    expect(fichas.filter((f) => f.employmentType === 'freelance')).toHaveLength(22);
  });

  it('monthly costs sum to 34.522,07 €', () => {
    const total = fichas
      .map((f) => f.monthlyCost)
      .filter((c): c is number => c !== undefined)
      .reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(34522.07, 2);
  });

  it('fichaFor returns seeded Alba Gelabert data', () => {
    const alba = fichaFor('alba-gelabert')!;
    expect(alba.hasAccount).toBe(true);
    expect(alba.active).toBe(true);
    expect(alba.birthDate).toBe('1997-07-09');
    expect(alba.vacationDaysPerYear).toBe(22);
  });

  it('companies total matches dashboard', () => {
    expect(totalMonthlyCost()).toBeCloseTo(34522.07, 2);
  });

  it('costRankingByPerson is sorted descending and excludes undefined costs', () => {
    const ranking = costRankingByPerson();
    const costs = ranking.map((r) => r.ficha.monthlyCost);
    expect(costs).not.toContain(undefined);
    for (let i = 1; i < costs.length; i += 1) {
      expect(costs[i]!).toBeLessThanOrEqual(costs[i - 1]!);
    }
    expect(ranking[0].person.name).toBe('Alberto Egea');
  });

  it('filterFichas by company and type', () => {
    const contratados = filterFichas(fichas, { type: 'contratado' });
    expect(contratados).toHaveLength(4);
    const conceptone = filterFichas(fichas, { companyId: 'conceptone' });
    expect(conceptone.length).toBeGreaterThanOrEqual(0);
  });
});
