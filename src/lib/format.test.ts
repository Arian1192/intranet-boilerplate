import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatCurrencyPrecise } from './format';

describe('format', () => {
  it('formatCurrency redondea a 2 decimales', () => {
    expect(formatCurrency(53.89)).toMatch(/53,89/);
    expect(formatCurrency(1500)).toMatch(/1500,00/);
  });

  it('formatCurrencyPrecise muestra 4 decimales para gastos de IA', () => {
    expect(formatCurrencyPrecise(0.0154)).toMatch(/0,0154/);
    expect(formatCurrencyPrecise(0.015)).toMatch(/0,0150/);
  });
});
