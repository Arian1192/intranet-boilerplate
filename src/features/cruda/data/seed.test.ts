import { test, expect } from 'vitest';
import { orders, orderLinesTotal, lineSubtotal, products } from './seed';

test('CR00103 line subtotals and total match the reference', () => {
  const cr = orders.find((o) => o.id === 'CR00103')!;
  expect(cr.lines.map((l) => lineSubtotal(l))).toEqual([1900, 3800, 950]);
  expect(orderLinesTotal(cr.lines)).toBe(6650);
});

test('seed has one product with three variants', () => {
  expect(products).toHaveLength(1);
  expect(products[0].variants).toHaveLength(3);
  expect(products[0].variants[2].stock).toBe(40);
});
