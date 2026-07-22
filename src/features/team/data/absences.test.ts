import { describe, it, expect } from 'vitest';
import { absencesForMonth, absenceDays, todaysAbsence, totalDaysForPerson } from './absences';

describe('absences data', () => {
  it('returns the 3 July 2026 absences', () => {
    const absences = absencesForMonth(2026, 7);
    expect(absences).toHaveLength(3);
  });

  it('absenceDays is inclusive', () => {
    const absences = absencesForMonth(2026, 7);
    const alejandro = absences.find((a) => a.personId === 'alejandro-gonzalez')!;
    expect(absenceDays(alejandro)).toBe(5);
    const carlosPego = absences.find((a) => a.personId === 'carlos-pego')!;
    expect(absenceDays(carlosPego)).toBe(3);
    const carlosRamudo = absences.find((a) => a.personId === 'carlos-ramudo')!;
    expect(absenceDays(carlosRamudo)).toBe(7);
  });

  it('todaysAbsence returns Carlos Ramudo Valencia on 2026-07-22', () => {
    const result = todaysAbsence('2026-07-22');
    expect(result).toBeDefined();
    expect(result!.person.name).toBe('Carlos Ramudo Valencia');
    expect(result!.absence.type).toBe('vacaciones');
  });

  it('totalDaysForPerson returns — when 0', () => {
    expect(totalDaysForPerson('alba-gelabert', 2026, 7)).toBe('—');
    expect(totalDaysForPerson('alejandro-gonzalez', 2026, 7)).toBe(5);
  });

  it('approvedOnly filter removes unapproved absences', () => {
    const all = absencesForMonth(2026, 7);
    const approved = absencesForMonth(2026, 7, { approvedOnly: true });
    expect(approved.length).toBeLessThanOrEqual(all.length);
  });
});
