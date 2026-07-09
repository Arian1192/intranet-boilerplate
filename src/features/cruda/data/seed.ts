import type {
  Order,
  OrderLine,
  Product,
  Extra,
  ProductVariables,
  PhaseAccum,
  OrderSummary,
  OrderStatus,
  MonthSales,
} from './types';

export const ORDER_STATUSES: OrderStatus[] = [
  'Borrador',
  'Confirmado',
  'En producción',
  'Enviado',
  'Entregado',
  'Facturado',
  'Cancelado',
];

export const collections: string[] = ['Top Sales'];

export const variables: ProductVariables = {
  finishes: ['Algodón', 'Ripstop', 'Lino'],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  colors: ['Crudo', 'Azul'],
};

export const products: Product[] = [
  {
    id: 'p1',
    name: '(Test) Camiseta A&F',
    collection: 'Top Sales',
    type: 'variantes',
    active: true,
    notes: '',
    soldUnits: 860,
    soldValue: 14708.35,
    variants: [
      { id: 'v1', sku: '4878test01', finish: 'Algodón', size: 'S', color: 'Crudo', price: 16.5, cost: 8, pvp: 41.03, multiplier: 2.49, stock: 150, min: 50 },
      { id: 'v2', sku: '4878test02', finish: 'Algodón', size: 'M', color: 'Crudo', price: 16.5, cost: 8, pvp: 45, multiplier: 2.73, stock: 150, min: 50 },
      { id: 'v3', sku: '4878test03', finish: 'Algodón', size: 'L', color: 'Crudo', price: 16.5, cost: 8, pvp: 45, multiplier: 2.73, stock: 40, min: 50 },
    ],
  },
];

export const extras: Extra[] = [
  { id: 'e1', name: 'Bolsa Cierre Zip', type: 'Packaging', mode: 'Por unidad (× prendas)', price: 0.7 },
  { id: 'e2', name: 'Bordado', type: 'Personalización', mode: 'Por unidad (× prendas)', price: 2.5 },
  { id: 'e3', name: 'Etiqueta Bordada Personalizada', type: 'Etiqueta', mode: 'Por unidad (× prendas)', price: 0.15 },
];

const cr00103Lines: OrderLine[] = [
  { id: 'l1', description: '(Test) Camiseta A&F · Algodón', sku: '4878test01', size: 'S', color: 'Crudo', qty: 100, price: 16.5, discountPct: 0, pvp: 45, multiplier: 2.73, extrasPerUnit: 2.5, extrasCount: 1 },
  { id: 'l2', description: '(Test) Camiseta A&F · Algodón', sku: '4878test02', size: 'M', color: 'Crudo', qty: 200, price: 16.5, discountPct: 0, pvp: 45, multiplier: 2.73, extrasPerUnit: 2.5, extrasCount: 1 },
  { id: 'l3', description: '(Test) Camiseta A&F · Algodón', sku: '4878test03', size: 'L', color: 'Crudo', qty: 50, price: 16.5, discountPct: 0, pvp: 45, multiplier: 2.73, extrasPerUnit: 2.5, extrasCount: 1 },
];

export const orders: Order[] = [
  { id: 'CR00103', client: 'New Era', dateLabel: '07 jul 2026', businessLine: 'Colección', status: 'Confirmado', amount: 6650, headerTotal: 5782.5, responsible: 'Israel Cuenca', lines: cr00103Lines },
  { id: 'CR00102', client: 'TAGMAG', dateLabel: '06 jul 2026', businessLine: 'Colección', status: 'Borrador', reposicion: true, amount: 3730, headerTotal: 3730, lines: [] },
  { id: 'CR00101', client: 'TAGMAG', dateLabel: '06 jul 2026', businessLine: 'Colección', status: 'Facturado', amount: 2540.25, headerTotal: 2540.25, lines: [] },
  { id: 'CR00100', client: 'Sin cliente', dateLabel: '06 jul 2026', businessLine: 'Colección', status: 'Borrador', amount: 2694.6, headerTotal: 2694.6, lines: [] },
];

export const orderSummary: OrderSummary = {
  activeAmount: 15614.85,
  activeCount: 4,
  invoicedAmount: 2540.25,
  coleccionAmount: 15614.85,
  produccionAmount: 0,
};

export const phaseAccum: PhaseAccum[] = [
  { status: 'Borrador', count: 2, amount: 6424.6 },
  { status: 'Confirmado', count: 1, amount: 6650 },
  { status: 'En producción', count: 0, amount: 0 },
  { status: 'Enviado', count: 0, amount: 0 },
  { status: 'Entregado', count: 0, amount: 0 },
  { status: 'Facturado', count: 1, amount: 2540.25 },
];

const emptyYear: MonthSales[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map(
  (label) => ({ label, value: 0 })
);

export const salesByYear: Record<number, MonthSales[]> = {
  2026: emptyYear.map((m) => (m.label === 'Jul' ? { ...m, value: 2540.25 } : m)),
};

export function salesForYear(year: number): MonthSales[] {
  return salesByYear[year] ?? emptyYear;
}

/** Net unit price after discount (Neto €). */
export function lineNetUnit(l: OrderLine): number {
  return Math.round(l.price * (1 - l.discountPct / 100) * 100) / 100;
}

/** Line subtotal = qty × (net unit + extras per unit). */
export function lineSubtotal(l: OrderLine): number {
  return Math.round(l.qty * (lineNetUnit(l) + l.extrasPerUnit) * 100) / 100;
}

export function orderLinesTotal(lines: OrderLine[]): number {
  return Math.round(lines.reduce((sum, l) => sum + lineSubtotal(l), 0) * 100) / 100;
}
