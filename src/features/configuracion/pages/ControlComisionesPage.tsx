import { Card, StatCard } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { ledgerTotals } from '../data/comisiones';

export function ControlComisionesPage() {
  const totals = ledgerTotals();
  return (
    <div className="space-y-4">
      <ConfigPageHeader
        title="Control de comisiones"
        subtitle={
          <>
            Comisión <strong className="font-semibold text-slate-700">devengada</strong> = suma de comisiones de
            shows <strong className="font-semibold text-slate-700">liquidados</strong> donde el booker es oficial u
            origen. Registra aquí los <strong className="font-semibold text-slate-700">abonos</strong>; el pendiente
            se actualiza solo. Importes en EUR.
          </>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="DEVENGADO TOTAL" value={formatCurrency(totals.devengadoTotal)} />
        <StatCard label="ABONADO" value={formatCurrency(totals.abonado)} valueClassName="text-emerald-600" />
        <StatCard label="PENDIENTE DE ABONAR" value={formatCurrency(totals.pendienteDeAbonar)} valueClassName="text-red-600" />
      </div>
      <Card className="p-0">
        <h3 className="border-b border-slate-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Por booker
        </h3>
        <p className="px-5 py-8 text-center text-sm text-slate-400">Aún no hay comisiones devengadas ni abonos.</p>
      </Card>
    </div>
  );
}
