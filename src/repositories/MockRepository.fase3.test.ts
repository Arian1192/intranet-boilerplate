import { describe, it, expect } from 'vitest';
import { MockRepository } from './MockRepository';

describe('MockRepository — Comunicación & PR', () => {
  it('returns the PR dashboard with kpis and activity lists', async () => {
    const repo = new MockRepository();
    const data = await repo.getPrDashboard();
    expect(data.activeAccounts).toBe(2);
    expect(data.upcomingActions.length).toBeGreaterThan(0);
    expect(data.recentCoverage.length).toBeGreaterThan(0);
  });

  it('returns the capture-exact in-progress action with budget lines summing 3540', async () => {
    const repo = new MockRepository();
    const actions = await repo.getPrActions();
    expect(actions).toHaveLength(1);
    const [action] = actions;
    expect(action.status).toBe('in-progress');
    expect(action.amount).toBe(10000);
    expect(action.commissionPct).toBe(20);
    const spent = (action.budgetLines ?? []).reduce((sum, line) => sum + line.amount, 0);
    expect(spent).toBe(3540);
  });

  it('returns 3 deliveries with 4 pieces and 2 published MRW shipments', async () => {
    const repo = new MockRepository();
    const deliveries = await repo.getDeliveries();
    expect(deliveries).toHaveLength(3);
    expect(deliveries.reduce((sum, d) => sum + d.piecesCount, 0)).toBe(4);
    expect(deliveries.filter((d) => d.published)).toHaveLength(2);
    expect(deliveries.filter((d) => d.method === 'internal')).toHaveLength(1);
  });

  it('returns accounts with obligations, coverage and monthly billing', async () => {
    const repo = new MockRepository();
    const [account] = await repo.getPrAccounts();
    expect(account.obligations[0]).toMatchObject({ label: 'Notas de prensa', done: 0, target: 4 });
    expect(account.coverage[0].value).toBe(1000);
    expect(account.billing.defaultRetainer).toBe(5500);
    expect(account.billing.months).toHaveLength(7);
    const retainerTotal = account.billing.months.reduce((sum, m) => sum + m.retainer, 0);
    expect(retainerTotal).toBe(38500);
  });

  it('returns inventory, influencers and a seeding report with reach', async () => {
    const repo = new MockRepository();
    expect((await repo.getInventory()).length).toBeGreaterThan(0);
    const influencers = await repo.getInfluencers();
    expect(influencers[0].email).toBeTruthy();
    const report = await repo.getSeedingReport();
    expect(report.length).toBeGreaterThan(0);
    expect(report[0]).toHaveProperty('reach');
  });
});

describe('MockRepository — Producción', () => {
  it('returns production events with distinct statuses', async () => {
    const repo = new MockRepository();
    const events = await repo.getProductionEvents();
    expect(events.length).toBeGreaterThan(0);
    expect(events[0].isoDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
