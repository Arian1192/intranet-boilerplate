import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { alertRules } from './alertas';

describe('alertas data', () => {
  it('5 reglas con D-N y severidad exactos del live', () => {
    const list = alertRules();
    expect(list.map((r) => r.windowDaysBefore)).toEqual([21, 14, 10, 7, 3]);
    expect(list.map((r) => r.severity)).toEqual(['info', 'aviso', 'critica', 'aviso', 'aviso']);
  });

  it('todas activas; solo "Contrato sin subir" con email', () => {
    const list = alertRules();
    expect(list.every((r) => r.active)).toBe(true);
    const conEmail = list.filter((r) => r.alsoEmail);
    expect(conEmail).toHaveLength(1);
    expect(conEmail[0].title).toBe('Contrato sin subir');
  });
});
