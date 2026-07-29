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
    // Cifras del barrido del live (29 jul 2026).
    expect(data.kpis.map((k) => [k.amount, k.count])).toEqual([
      [11433.78, 12],
      [11100, 9],
      [0, 0],
      [800, 1],
      [6150, 6],
      [1000, 1],
    ]);
    expect(data.kpis.some((k) => k.status === 'offer')).toBe(false);
    expect(data.advancing).toHaveLength(5);
    expect(data.logistics).toHaveLength(5);
    expect(data.upcomingShows).toHaveLength(10);
  });

  it('el panel de atención trae fichas a revisar y los posibles gigs del live', async () => {
    const repo = new MockRepository();
    const data = await repo.getBookingDashboard();
    expect(data.fichasRevisar).toEqual({ artistas: 40, datos: 111, documentos: 50, bios: 33 });
    expect(data.posiblesGigs).toHaveLength(5);
    expect(data.posiblesGigs.every((gig) => gig.artista === 'Bizza')).toBe(true);
    expect(data.posiblesGigs[0].titulo).toBe(
      'Tentative - Playa de las Américas - Papagayo Tenerife'
    );
    expect(data.posiblesGigs[4].fecha).toBe('31 oct 2026');
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
