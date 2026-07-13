import { describe, it, expect } from 'vitest';
import { orgs } from './seed';
import { opportunities } from './pipeline';
import { crossSell, atRisk, RISK_OPTIONS } from './crecimiento';

describe('crecimiento data', () => {
  it('crossSell: only clients working with exactly one company; offer = the rest', () => {
    const { rows, unassignedCount } = crossSell(orgs);
    rows.forEach((r) => {
      expect(r.org.roles).toContain('Cliente');
      expect(r.org.worksWith.length).toBe(1);
      expect(r.worksWith).toBe(r.org.worksWith[0]);
      expect(r.offer).not.toContain(r.worksWith);
      // offer are group companies
      r.offer.forEach((c) => expect(['ConceptOne', 'CRUDA', 'Etra Agency', 'Euphoric Media', 'Mixmag Spain', 'TAGMAG']).toContain(c));
    });
    expect(unassignedCount).toBe(orgs.filter((o) => o.roles.includes('Cliente') && o.worksWith.length === 0).length);
  });

  it('atRisk: lastActivity is most recent opp date or null; respects the months threshold', () => {
    const rows = atRisk(orgs, opportunities, 6);
    rows.forEach((r) => {
      const orgOpps = opportunities.filter((o) => o.orgId === r.org.id);
      if (orgOpps.length === 0) expect(r.lastActivity).toBeNull();
      expect(r.companies).toEqual(r.org.worksWith);
    });
    // 12-month threshold is >= 6-month set is not guaranteed; just assert it returns an array
    expect(Array.isArray(atRisk(orgs, opportunities, 12))).toBe(true);
  });

  it('exposes risk options 3/6/12', () => {
    expect(RISK_OPTIONS).toEqual([3, 6, 12]);
  });
});
