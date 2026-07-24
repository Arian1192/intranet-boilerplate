import { describe, it, expect } from 'vitest';
import { calendarEvents, eventsForMonth, eventsForDay } from './calendar';

describe('calendar seed (evidencia del live Jul-Sept 2026)', () => {
  it('tiene 16 eventos: 15 shows + 1 hold', () => {
    expect(calendarEvents).toHaveLength(16);
    expect(calendarEvents.filter((e) => e.type === 'hold')).toHaveLength(1);
  });
  it('el hold es Test Artist / Dentista / etapa confirmed el 2026-07-23', () => {
    const hold = calendarEvents.find((e) => e.type === 'hold')!;
    expect(hold).toMatchObject({ date: '2026-07-23', artist: 'Test Artist', holdTitle: 'Dentista', etapa: 'confirmed' });
  });
  it('conserva las grafías literales del live (Marmarela/Mamarela)', () => {
    const e = calendarEvents.find((x) => x.date === '2026-08-02')!;
    expect(e).toMatchObject({ venue: 'Marmarela', event: 'Mamarela', city: 'Alicante' });
  });
  it('Brenda Serna 4-sept sin venue/ciudad', () => {
    const e = calendarEvents.find((x) => x.date === '2026-09-04')!;
    expect(e).toMatchObject({ artist: 'Brenda Serna', venue: null, city: null, event: 'Alcazar de San Juan', paymentStatus: 'Parcialmente abonado' });
  });
  it('eventsForMonth(2026, 6) [julio] devuelve 8 eventos', () => {
    expect(eventsForMonth(2026, 6)).toHaveLength(8);
  });
  it('eventsForMonth(2026, 5) [junio] está vacío', () => {
    expect(eventsForMonth(2026, 5)).toHaveLength(0);
  });
  it('eventsForDay agrupa el 18-jul (2 shows) y el 26-jul (2 shows)', () => {
    expect(eventsForDay('2026-07-18')).toHaveLength(2);
    expect(eventsForDay('2026-07-26')).toHaveLength(2);
  });
});
