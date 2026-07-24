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

  it('getShows devuelve los 14 shows del live con datos exactos', async () => {
    const repo = new MockRepository();
    const shows = await repo.getShows();
    expect(shows).toHaveLength(14);
    const s6 = shows.find((s) => s.code === 'C1-2026-006')!;
    expect(s6).toMatchObject({
      artist: 'Los Canarios', event: 'FUEGO', etapa: 'confirmed', fase: 'confirmed',
      dealType: 'Landed', fee: 3000, bf: 600, mf: 449.58, paymentStatus: 'No abonado',
      artStatus: 'Arte no subido', exception: true,
    });
    const s5 = shows.find((s) => s.code === 'C1-2026-005')!;
    expect(s5).toMatchObject({ fase: 'liquidado', etapa: 'done', venue: null, country: null, paymentStatus: 'Parcialmente abonado' });
    const s7 = shows.find((s) => s.code === 'C1-2026-007')!;
    expect(s7).toMatchObject({ fase: 'tentative', etapa: 'tentative', date: null });
    // fase por evidencia (spec §3.1)
    const fasePorCodigo = Object.fromEntries(shows.map((s) => [s.code, s.fase]));
    expect(fasePorCodigo['C1-2026-014']).toBe('liquidado');
    expect(fasePorCodigo['C1-2026-011']).toBe('confirmed');
  });

  it('returns artists', async () => {
    const repo = new MockRepository();
    const artists = await repo.getArtists();
    expect(artists.length).toBeGreaterThan(0);
  });
});
