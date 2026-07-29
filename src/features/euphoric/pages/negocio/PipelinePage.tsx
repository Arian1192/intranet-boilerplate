import { Button, Card } from '@/components/ui';
import { formatCurrencyEs } from '../../data/format';
import { leads, pipelineTotals } from '../../data/negocio';
import type { LeadStage } from '../../data/types';

const COLUMNS: { stage: LeadStage; label: string }[] = [
  { stage: 'frio', label: 'Frío · <30%' },
  { stage: 'templado', label: 'Templado · 30–70%' },
  { stage: 'caliente', label: 'Caliente · >70%' },
];

export function PipelinePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Pipeline · Euphoric</h1>
          <p className="text-slate-500">Oportunidades comerciales en curso. Arrastra un lead a Activo cuando cierres.</p>
        </div>
        <Button>+ Nuevo lead</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-slate-500">LEADS EN PIPELINE</p>
          <p className="text-2xl font-semibold text-slate-800">{pipelineTotals.leads}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500">VALOR TOTAL</p>
          <p className="text-2xl font-semibold text-slate-800">{formatCurrencyEs(pipelineTotals.value)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500">FORECAST PONDERADO</p>
          <p className="text-2xl font-semibold text-[#db2777]">{formatCurrencyEs(pipelineTotals.forecast)}</p>
          <p className="mt-0.5 text-xs text-slate-400">Σ valor × probabilidad</p>
        </Card>
      </div>

      <div role="region" aria-label="Tablero de leads" className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {COLUMNS.map((column) => {
          const items = leads.filter((lead) => lead.stage === column.stage);
          const value = items.reduce((total, lead) => total + lead.value, 0);
          const forecast = items.reduce((total, lead) => total + (lead.value * lead.probability) / 100, 0);
          return (
            <Card key={column.stage} className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">{column.label}</h3>
                <span className="text-sm text-slate-400">{items.length}</span>
              </div>
              <p className="text-xs text-slate-400">
                Valor {formatCurrencyEs(value)} · Forecast {formatCurrencyEs(forecast)}
              </p>
              {items.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-300">Sin leads</p>
              ) : (
                items.map((lead) => (
                  <div key={lead.id} className="space-y-2 rounded-lg border border-slate-100 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-slate-900">{lead.name}</p>
                      <span className="text-sm text-slate-500">{lead.probability}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{formatCurrencyEs(lead.value)}</span>
                      <span className="text-slate-400">≈ {formatCurrencyEs((lead.value * lead.probability) / 100)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                          {lead.ownerInitials}
                        </span>
                        {lead.owner}
                      </span>
                      <span>{lead.closeDateLabel}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <button type="button" className="text-sm text-slate-500 hover:text-slate-700">
                        Editar
                      </button>
                      <button type="button" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                        → Convertir a Activo
                      </button>
                    </div>
                  </div>
                ))
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
