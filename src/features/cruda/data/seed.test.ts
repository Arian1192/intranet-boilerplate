import { test, expect } from 'vitest';
import { orders, orderLinesTotal, lineSubtotal, products } from './seed';
import type { Order } from './types';

test('Order admite nota de portal y email de acceso concedido', () => {
  const order: Order = {
    id: 'CR99999',
    client: 'TAGMAG',
    dateLabel: '20 jul 2026',
    businessLine: 'Colección',
    status: 'Confirmado',
    amount: 0,
    headerTotal: 0,
    lines: [],
    portalNote: 'Reposición solicitada desde el portal de cliente.',
    portalEmail: 'hello@carlospego.com',
  };
  expect(order.portalNote).toBe('Reposición solicitada desde el portal de cliente.');
  expect(order.portalEmail).toBe('hello@carlospego.com');
});

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
