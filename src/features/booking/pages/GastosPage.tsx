import { StatCard } from '@/components/ui';
import {
  gastosKpis,
  formatImporte,
  CARGANDO_MOVIMIENTOS,
  MENSAJE_CARGANDO,
  movimientos,
} from '../data/gastos';

export function GastosPage() {
  const kpis = gastosKpis();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800">Gastos</h1>
      <p className="text-sm text-slate-500">
        Salidas de las cuentas de Holded (banco, PayPal, Stripe). Concilia cada movimiento con un
        show: gasto de la agencia o liquidación al artista. Últimos 120 días.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="GASTO SIN ASIGNAR"
          value={formatImporte(kpis.sinAsignarImporte)}
          valueClassName="text-rose-600"
          caption={`${kpis.sinAsignarMovimientos} movimiento(s)`}
        />
        <StatCard label="MOVIMIENTOS (TOTAL)" value={String(kpis.movimientosTotal)} />
        <StatCard label="CUENTAS" value={String(kpis.cuentas)} />
      </div>

      {CARGANDO_MOVIMIENTOS ? (
        <p className="py-16 text-center text-slate-400">{MENSAJE_CARGANDO}</p>
      ) : movimientos.length === 0 ? (
        <p className="py-16 text-center text-slate-400">No hay movimientos en los últimos 120 días.</p>
      ) : null}
    </div>
  );
}
