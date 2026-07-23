import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { holidays, groupByYear, filterHolidays, isPast, formatHolidayDate } from './festivos';

describe('festivos data', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-22T10:00:00'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('siembra 23 festivos 2026-2027', () => {
    expect(holidays()).toHaveLength(23);
  });

  it('groupByYear agrupa 7 en 2026 y 16 en 2027', () => {
    const groups = groupByYear(holidays());
    expect(groups.map((g) => g.year)).toEqual([2026, 2027]);
    expect(groups[0].items).toHaveLength(7);
    expect(groups[1].items).toHaveLength(16);
  });

  it('filterHolidays: con "hoy" en 2026-07-22 ninguno es pasado', () => {
    const visible = filterHolidays(holidays(), { includePast: false });
    expect(visible).toHaveLength(23);
    const withPast = filterHolidays(holidays(), { includePast: true });
    expect(withPast).toHaveLength(23);
  });

  it('isPast distingue fechas pasadas de futuras respecto a "hoy"', () => {
    expect(isPast({ id: 'x', date: '2026-01-01', name: 'x', scope: 'espana' })).toBe(true);
    expect(isPast({ id: 'y', date: '2026-08-15', name: 'y', scope: 'espana' })).toBe(false);
  });

  it('formatHolidayDate formatea "15 ago 2026"', () => {
    expect(formatHolidayDate('2026-08-15')).toBe('15 ago 2026');
    expect(formatHolidayDate('2026-09-11')).toBe('11 sept 2026');
  });

  it('es inmutable', () => {
    const a = holidays();
    a.push({ id: 'z', date: '2099-01-01', name: 'z', scope: 'espana' });
    const b = holidays();
    expect(b).toHaveLength(23);
  });
});
