import { useState } from 'react';
import { Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { formatCurrencyEs } from '../../data/format';
import { catalogServices } from '../../data/negocio';

type View = 'Presupuestos' | 'Catálogo' | 'Plantillas';
const VIEWS: View[] = ['Presupuestos', 'Catálogo', 'Plantillas'];

function EmptyMaster({ action, empty, detail }: { action: string; empty: string; detail: string }) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[400px_1fr]">
      <div className="space-y-4">
        <Button className="w-full">{action}</Button>
        <Card className="p-4">
          <p className="text-sm text-slate-400">{empty}</p>
        </Card>
      </div>
      <Card className="flex min-h-[200px] items-center justify-center p-6">
        <p className="text-slate-400">{detail}</p>
      </Card>
    </div>
  );
}

function Catalogo() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_400px]">
      <Card className="space-y-4 p-5">
        <div className="flex justify-end">
          <Button variant="secondary">+ Nuevo servicio</Button>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-slate-400">
              <th className="pb-2 pr-3">SERVICIO</th>
              <th className="pb-2 pr-3">UNIDAD</th>
              <th className="pb-2 pr-3">TARIFA EST.</th>
              <th className="pb-2 pr-3">MÍNIMA</th>
              <th className="pb-2 pr-3">COSTE</th>
              <th className="pb-2">MARGEN</th>
            </tr>
          </thead>
          <tbody>
            {catalogServices.map((service) => (
              <tr key={service.id} className="border-t border-slate-100 align-top">
                <td className="py-2 pr-3">
                  <p className="font-medium text-slate-900">
                    {service.name}
                    <span className="font-normal text-slate-400"> · {service.department}</span>
                  </p>
                  <p className="text-xs text-slate-400">{service.detail}</p>
                </td>
                <td className="py-2 pr-3 text-slate-500">{service.unit}</td>
                <td className="py-2 pr-3 tabular-nums text-slate-700">{formatCurrencyEs(service.rate)}</td>
                <td className="py-2 pr-3 tabular-nums text-slate-700">{formatCurrencyEs(service.minimum)}</td>
                <td className="py-2 pr-3 tabular-nums text-slate-700">{formatCurrencyEs(service.cost)}</td>
                <td className="py-2 tabular-nums text-emerald-600">
                  {formatCurrencyEs(service.rate - service.cost)} ·{' '}
                  {service.rate > 0 ? Math.round(((service.rate - service.cost) / service.rate) * 100) : 0}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="flex min-h-[200px] items-center justify-center p-6">
        <p className="text-slate-400">Selecciona un servicio o crea uno nuevo.</p>
      </Card>
    </div>
  );
}

export function PresupuestosPage() {
  const [view, setView] = useState<View>('Presupuestos');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Presupuestos</h1>
        <p className="text-slate-500">Propuestas comerciales, catálogo de servicios y biblioteca de plantillas.</p>
      </div>

      <div role="group" aria-label="Vistas de presupuestos" className="flex items-center gap-6 border-b border-slate-200">
        {VIEWS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setView(option)}
            className={cn(
              '-mb-px border-b-2 pb-2.5 text-sm font-medium transition-colors',
              view === option
                ? 'border-slate-800 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {view === 'Presupuestos' && (
        <EmptyMaster
          action="+ Nuevo presupuesto"
          empty="Sin presupuestos."
          detail="Selecciona un presupuesto o crea uno nuevo."
        />
      )}
      {view === 'Catálogo' && <Catalogo />}
      {view === 'Plantillas' && (
        <EmptyMaster
          action="+ Nueva plantilla"
          empty="Sin plantillas."
          detail="Selecciona una plantilla o crea una nueva."
        />
      )}
    </div>
  );
}
