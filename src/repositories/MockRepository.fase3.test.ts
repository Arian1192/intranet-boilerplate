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

  it('returns PR actions across multiple statuses', async () => {
    const repo = new MockRepository();
    const actions = await repo.getPrActions();
    const statuses = new Set(actions.map((action) => action.status));
    expect(statuses.size).toBeGreaterThan(1);
  });

  it('returns inventory, deliveries, influencers, seeding report, and accounts', async () => {
    const repo = new MockRepository();
    expect((await repo.getInventory()).length).toBeGreaterThan(0);
    expect((await repo.getDeliveries()).length).toBeGreaterThan(0);
    expect((await repo.getInfluencers()).length).toBeGreaterThan(0);
    expect((await repo.getSeedingReport()).length).toBeGreaterThan(0);
    expect((await repo.getPrAccounts()).length).toBeGreaterThan(0);
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
