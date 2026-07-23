import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { hrSettings, departments, DEPARTMENT_COLORS } from './rrhh';

describe('rrhh data', () => {
  it('hrSettings exacto del live', () => {
    const s = hrSettings();
    expect(s.ssEmployerPercent).toBe(31.5);
    expect(s.workingDaysPerMonth).toBe(21);
    expect(s.hoursPerMonth).toBe(160);
    expect(s.freelanceVatPercent).toBe(21);
    expect(s.freelanceIrpfPercent).toBe(15);
    expect(s.contractEndNoticeDays).toEqual([60, 30, 15]);
    expect(s.probationEndNoticeDays).toEqual([15, 7]);
    expect(s.salaryReviewNoticeDays).toEqual([30]);
    expect(s.notifyBirthdays).toBe(true);
  });

  it('12 departamentos, todos activos, colores exactos', () => {
    const list = departments();
    expect(list).toHaveLength(12);
    expect(list.every((d) => d.active)).toBe(true);
    expect(list.find((d) => d.name === 'Board')!.color).toBe('amber');
    expect(list.find((d) => d.name === 'Redacción')!.color).toBe('cyan');
    expect(list.find((d) => d.name === 'Vídeo')!.color).toBe('red');
  });

  it('8 colores disponibles para "Nuevo departamento"', () => {
    expect(DEPARTMENT_COLORS).toHaveLength(8);
  });

  it('es inmutable', () => {
    const a = hrSettings();
    a.contractEndNoticeDays.push(1);
    const b = hrSettings();
    expect(b.contractEndNoticeDays).toEqual([60, 30, 15]);
  });
});
