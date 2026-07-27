import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { contractTemplates } from './contratos';

describe('contratos data', () => {
  it('exactamente 2 plantillas, ES y EN', () => {
    const list = contractTemplates();
    expect(list).toHaveLength(2);
    expect(list.map((t) => t.langCode)).toEqual(['ES', 'EN']);
    expect(list[0].name).toBe('Contrato estándar (ES)');
    expect(list[1].name).toBe('Booking Agreement (EN)');
  });
});
