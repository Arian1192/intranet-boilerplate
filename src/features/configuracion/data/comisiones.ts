export interface CommissionSettings {
  globalPercent: number;
  exclusivityWindowDays: number;
  exclusivityRadiusKm: number;
  logisticJumpKm: number;
}

export interface BookerCommission {
  bookerName: string;
  percent: number;
}

export interface CommissionLedgerTotals {
  devengadoTotal: number;
  abonado: number;
  pendienteDeAbonar: number;
}

const SETTINGS: CommissionSettings = { globalPercent: 25, exclusivityWindowDays: 30, exclusivityRadiusKm: 100, logisticJumpKm: 600 };

const BOOKERS = [
  'Alba Gelabert', 'Aldo Messina', 'Alex González', 'Carlos Pego', 'Fran Hinojosa Veredas',
  'Israel Cuenca', 'Jack Howell', 'Jassi Gonzalez Montes', 'Joe Coe', 'Juan (Staff Level Test)',
  'Oscar Buch', 'Sadkiel', 'test', 'Tony Carrerira', 'Yenifer Bernardo',
];

const BOOKER_COMMISSIONS: BookerCommission[] = BOOKERS.map((bookerName) => ({ bookerName, percent: 25 }));

const LEDGER_TOTALS: CommissionLedgerTotals = { devengadoTotal: 0, abonado: 0, pendienteDeAbonar: 0 };

export function commissionSettings(): CommissionSettings {
  return { ...SETTINGS };
}

export function bookerCommissions(): BookerCommission[] {
  return BOOKER_COMMISSIONS.map((b) => ({ ...b }));
}

export function ledgerTotals(): CommissionLedgerTotals {
  return { ...LEDGER_TOTALS };
}
