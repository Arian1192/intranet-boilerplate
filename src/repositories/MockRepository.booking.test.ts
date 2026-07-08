import { describe, it, expect } from 'vitest';
import { MockRepository } from './MockRepository';

describe('MockRepository booking', () => {
  it('returns booking dashboard with kpis and lists', async () => {
    const repo = new MockRepository();
    const data = await repo.getBookingDashboard();
    expect(data.kpis.length).toBe(7);
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
