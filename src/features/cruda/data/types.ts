export type OrderStatus =
  | 'Borrador'
  | 'Confirmado'
  | 'En producción'
  | 'Enviado'
  | 'Entregado'
  | 'Facturado'
  | 'Cancelado'
  | 'Anulado';

export type BusinessLine = 'Colección' | 'Producción';

export interface OrderLine {
  id: string;
  description: string;
  sku: string;
  size: string; // Talla
  color: string;
  qty: number; // Cant.
  price: number; // Precio € (unit, pre-discount)
  discountPct: number; // Dto %
  pvp: number; // PVP € (informative)
  multiplier: number; // × (informative)
  extrasPerUnit: number; // € per unit added by line extras
  extrasCount: number; // count shown in "Extras (n)"
}

export interface Order {
  id: string; // 'CR00103'
  client: string; // 'New Era' | 'Sin cliente'
  dateLabel: string; // '07 jul 2026'
  businessLine: BusinessLine;
  status: OrderStatus;
  reposicion?: boolean;
  amount: number; // amount shown in the list row
  headerTotal: number; // total shown in the detail header (may differ from lines total)
  responsible?: string;
  lines: OrderLine[];
}

export interface Variant {
  id: string;
  sku: string;
  finish: string; // Acabado
  size: string;
  color: string;
  price: number;
  cost: number;
  pvp: number;
  multiplier: number;
  stock: number;
  min: number;
}

export interface Product {
  id: string;
  name: string;
  collection: string; // 'Top Sales' | 'Sin colección'
  type: 'variantes' | 'unico';
  active: boolean;
  notes: string;
  variants: Variant[];
  soldUnits: number;
  soldValue: number;
}

export interface Extra {
  id: string;
  name: string;
  type: string; // 'Packaging' | 'Personalización' | 'Etiqueta'
  mode: string; // 'Por unidad (× prendas)'
  price: number;
}

export interface ProductVariables {
  finishes: string[]; // Acabados
  sizes: string[]; // Tallas
  colors: string[]; // Colores
}

export interface PhaseAccum {
  status: OrderStatus;
  count: number;
  amount: number;
}

export interface OrderSummary {
  activeAmount: number; // En curso (activos)
  activeCount: number;
  invoicedAmount: number; // Facturado
  coleccionAmount: number;
  produccionAmount: number;
}

export interface MonthSales {
  label: string; // 'Ene' ... 'Dic'
  value: number;
}
