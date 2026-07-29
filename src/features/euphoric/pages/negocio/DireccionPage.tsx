import { Card } from '@/components/ui';
import { formatCurrencyEs } from '../../data/format';
import {
  businessAlerts,
  departmentCost,
  direccion,
  referenceHoursPerMonth,
  teamLoad,
} from '../../data/negocio';
import type { Dedication } from '../../data/types';

function Kpi({ label, value, caption, valueClassName }: {
  label: string;
  value: string;
  caption?: string;
  valueClassName?: string;
}) {
  return (
    <Card className="p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-2xl font-semibold ${valueClassName ?? 'text-slate-800'}`}>{value}</p>
      {caption && <p className="mt-0.5 text-xs text-slate-400">{caption}</p>}
    </Card>
  );
}

function DedicationList({ items }: { items: Dedication[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-700">{item.label}</span>
            <span className="text-slate-500">{`${item.hoursPerMonth} h/mes · ${formatCurrencyEs(item.cost)}`}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100">
            <div
              className="h-1.5 rounded-full bg-emerald-500"
              style={{ width: `${Math.min((item.hoursPerMonth / referenceHoursPerMonth) * 100, 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function DireccionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dirección · Euphoric</h1>
        <p className="text-slate-500">
          Estado del negocio de un vistazo: ingresos, cartera, salud de clientes y alertas del día.
        </p>
      </div>

      <div role="region" aria-label="Indicadores de dirección" className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Kpi
            label="FACTURACIÓN MENSUAL (MRR)"
            value={formatCurrencyEs(direccion.mrr)}
            valueClassName="text-[#db2777]"
          />
          <Kpi
            label="BENEFICIO ESTIMADO"
            value={formatCurrencyEs(direccion.mrr - direccion.hoursCost)}
            caption={`Coste horas ${formatCurrencyEs(direccion.hoursCost)}`}
          />
          <Kpi
            label="CLIENTES ACTIVOS"
            value={String(direccion.activeClients)}
            caption={`de ${direccion.totalAccounts} cuentas`}
          />
          <Kpi
            label="LEADS EN PIPELINE"
            value={String(direccion.leadsInPipeline)}
            caption={`Forecast ${formatCurrencyEs(direccion.forecast)}`}
          />
          <Kpi label="HORAS DEL MES" value={`${direccion.monthHours.toFixed(1)} h`} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label="CAMPAÑAS ACTIVAS" value={String(direccion.activeCampaigns)} />
          <Kpi label="CAMPAÑAS PENDIENTES" value={String(direccion.pendingCampaigns)} />
          <Kpi
            label="COBROS PENDIENTES"
            value={String(direccion.pendingPayments)}
            caption="pendiente / retraso"
          />
          <Kpi label="INCIDENCIAS ABIERTAS" value={String(direccion.openIncidents)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="space-y-3 p-5">
          <h3 className="text-sm font-semibold text-slate-800">
            Carga del equipo <span className="font-normal text-slate-400">— dedicación asignada</span>
          </h3>
          <DedicationList items={teamLoad} />
          <p className="text-xs text-slate-400">
            Carga sobre una jornada de referencia de {referenceHoursPerMonth} h/mes. Suma la dedicación de todos los
            servicios activos.
          </p>
        </Card>
        <Card className="space-y-3 p-5">
          <h3 className="text-sm font-semibold text-slate-800">
            Coste por departamento <span className="font-normal text-slate-400">— estimado mensual</span>
          </h3>
          <ul className="space-y-2">
            {departmentCost.map((item) => (
              <li key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{item.label}</span>
                <span className="text-slate-500">{`${item.hoursPerMonth} h/mes · ${formatCurrencyEs(item.cost)}`}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card role="region" aria-label="Salud de la cartera" className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wide text-slate-400">SALUD DE LA CARTERA</p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {direccion.healthy}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {direccion.atRisk}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                {direccion.critical}
              </span>
            </div>
          </div>
          <p className="py-10 text-center text-sm text-slate-400">Toda la cartera está sana.</p>
        </Card>

        <Card role="region" aria-label="Alertas" className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wide text-slate-400">ALERTAS</p>
            <span className="text-xs text-slate-400">{businessAlerts.length}</span>
          </div>
          <ul className="mt-3 space-y-2">
            {businessAlerts.map((alert) => (
              <li key={alert.id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">{alert.account}</p>
                  <p className="text-sm text-slate-500">{alert.message}</p>
                </div>
                <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                  {alert.tag}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
