import { describe, it, expect } from 'vitest';
import { MockRepository } from './MockRepository';

describe('MockRepository booking', () => {
  it('returns booking dashboard with 6 kpis and lists', async () => {
    const repo = new MockRepository();
    const data = await repo.getBookingDashboard();
    expect(data.kpis.length).toBe(6);
    expect(data.kpis.map((k) => k.status)).toEqual([
      'tentative', 'confirmed', 'contract', 'pending-payment', 'pending-settlement', 'done',
    ]);
    const tentative = data.kpis[0];
    expect(tentative.amount).toBeCloseTo(5679.48, 2);
    expect(tentative.count).toBe(7);
    const liquidado = data.kpis[5];
    expect(liquidado.amount).toBe(3500);
    expect(liquidado.count).toBe(2);
    expect(data.kpis.some((k) => k.status === 'offer')).toBe(false);
    expect(data.advancing.length).toBeGreaterThan(0);
    expect(data.logistics.length).toBeGreaterThan(0);
    expect(data.upcomingShows.length).toBeGreaterThan(0);
  });

  it('returns shows', async () => {
    const repo = new MockRepository();
    const shows = await repo.getShows();
    expect(shows.length).toBeGreaterThan(0);
    expect(shows[0].amount).toBeDefined();
  });

  it('returns artists', async () => {
    const repo = new MockRepository();
    const artists = await repo.getArtists();
    expect(artists.length).toBeGreaterThan(0);
  });
});
