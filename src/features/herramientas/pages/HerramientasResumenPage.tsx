import { Link } from 'react-router';
import { Card } from '@/components/ui';

export function HerramientasResumenPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Utilidades del grupo</h1>
        <p className="text-slate-500">
          Calculadoras y herramientas transversales del equipo. Se irán sumando más con el tiempo.
        </p>
      </div>
      <Link to="/herramientas/proyecciones" className="block">
        <Card className="p-6 transition-shadow hover:shadow-md">
          <h2 className="text-lg font-semibold text-slate-900">Proyecciones · P&L de eventos</h2>
          <p className="mt-1 text-sm text-slate-500">
            Cuenta de explotación por aforo, ventas y gastos. Escenarios, punto de equilibrio selectivo e informes PDF/Excel.
          </p>
        </Card>
      </Link>
    </div>
  );
}
