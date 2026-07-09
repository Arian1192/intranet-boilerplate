import { test, expect } from 'vitest';
import { eur } from './format';

test('formats amounts with es grouping only from 10000', () => {
  expect(eur(0)).toBe('0,00 €');
  expect(eur(6650)).toBe('6650,00 €');
  expect(eur(2540.25)).toBe('2540,25 €');
  expect(eur(6424.6)).toBe('6424,60 €');
  expect(eur(15614.85)).toBe('15.614,85 €');
  expect(eur(14708.35)).toBe('14.708,35 €');
});
