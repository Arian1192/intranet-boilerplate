import { GROUP_COMPANIES, type CrmOrg } from './seed';
import type { Opportunity } from './pipeline';

export const RISK_OPTIONS = [3, 6, 12];

export function crossSell(orgs: CrmOrg[]) {
  const clients = orgs.filter((o) => o.roles.includes('Cliente'));
  const rows = clients
    .filter((o) => o.worksWith.length === 1)
    .map((org) => {
      const worksWith = org.worksWith[0];
      const offer = GROUP_COMPANIES.filter((c) => c !== worksWith);
      return { org, worksWith, offer };
    });
  const unassignedCount = clients.filter((o) => o.worksWith.length === 0).length;
  return { rows, unassignedCount };
}

export function atRisk(orgs: CrmOrg[], opps: Opportunity[], months: number) {
  const now = new Date('2026-07-13T00:00:00').getTime();
  const cutoff = now - months * 30 * 24 * 60 * 60 * 1000;
  const clients = orgs.filter((o) => o.roles.includes('Cliente'));
  return clients
    .map((org) => {
      const orgOpps = opps.filter((o) => o.orgId === org.id);
      const dates = orgOpps.map((o) => o.closeDate).sort();
      const last = dates.length > 0 ? dates[dates.length - 1] : null;
      return { org, lastActivity: last, companies: org.worksWith };
    })
    .filter((r) => r.lastActivity === null || new Date(r.lastActivity + 'T00:00:00').getTime() < cutoff);
}
