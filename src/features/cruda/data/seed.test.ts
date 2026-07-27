import { test, expect } from 'vitest';
import { orders, orderLinesTotal, lineSubtotal, products, orderSummary, phaseAccum } from './seed';
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

test('CR00104 encabeza la lista con los datos del live', () => {
  expect(orders).toHaveLength(5);
  expect(orders[0].id).toBe('CR00104');
  const cr = orders[0];
  expect(cr.client).toBe('TAGMAG');
  expect(cr.dateLabel).toBe('20 jul 2026');
  expect(cr.businessLine).toBe('Colección');
  expect(cr.status).toBe('Confirmado');
  expect(cr.reposicion).toBe(true);
  expect(cr.amount).toBe(1650);
  expect(cr.headerTotal).toBe(1650);
  expect(cr.portalNote).toBe('Reposición solicitada desde el portal de cliente.');
  expect(cr.portalEmail).toBe('hello@carlospego.com');
  expect(cr.lines).toHaveLength(1);
  expect(cr.lines[0]).toMatchObject({
    description: '(Test) Camiseta A&F · Algodón',
    sku: '4878test02',
    size: 'M',
    color: 'Crudo',
    qty: 100,
    price: 16.5,
    discountPct: 0,
    extrasPerUnit: 0,
    extrasCount: 0,
  });
  expect(orderLinesTotal(cr.lines)).toBe(1650);
});

test('los agregados incluyen el pedido CR00104', () => {
  expect(orderSummary).toEqual({
    activeAmount: 17264.85,
    activeCount: 5,
    invoicedAmount: 2540.25,
    coleccionAmount: 17264.85,
    produccionAmount: 0,
  });
  expect(phaseAccum).toEqual([
    { status: 'Borrador', count: 2, amount: 6424.6 },
    { status: 'Confirmado', count: 2, amount: 8300 },
    { status: 'En producción', count: 0, amount: 0 },
    { status: 'Enviado', count: 0, amount: 0 },
    { status: 'Entregado', count: 0, amount: 0 },
    { status: 'Facturado', count: 1, amount: 2540.25 },
  ]);
});

test('seed has one product with three variants', () => {
  expect(products).toHaveLength(1);
  expect(products[0].variants).toHaveLength(3);
  expect(products[0].variants[2].stock).toBe(40);
});
