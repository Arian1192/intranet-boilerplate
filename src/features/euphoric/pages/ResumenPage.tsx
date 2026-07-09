import { Link } from 'react-router';
import { StatCard, Card } from '@/components/ui';
import { StatusChip } from '../components/StatusChip';
import { accounts, campaigns, publications } from '../data/seed';

export function ResumenPage() {
  const cmp = campaigns[0];
  const pub = publications[0];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Euphoric Media</h1>
        <p className="text-slate-500">Marketing del grupo: cuentas, campañas y calendario de contenido.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link to="/euphoric/cuentas"><StatCard label="Cuentas activas" value={`${accounts.length}`} caption="de 1" /></Link>
        <StatCard label="Campañas en curso" value="1" />
        <StatCard label="Publicaciones (7 días)" value="1" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Campañas en curso</p>
          <Link to="/euphoric/campanas" className="mt-3 flex items-center justify-between rounded-lg border border-slate-100 p-3">
            <div>
              <p className="font-medium text-slate-900">{cmp.name}</p>
              <p className="text-sm text-slate-500">{cmp.account} · hasta {cmp.endLabel}</p>
            </div>
            <StatusChip status="En curso" />
          </Link>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Próximas publicaciones</p>
          <Link to="/euphoric/calendario" className="mt-3 flex items-center justify-between rounded-lg border border-slate-100 p-3">
            <div>
              <p className="font-medium text-slate-900">{pub.name}</p>
              <p className="text-sm text-slate-500">{pub.dateLabel} · {pub.channel} · {pub.account}</p>
            </div>
            <StatusChip status="En producción" />
          </Link>
        </Card>
      </div>
      <p className="text-sm text-slate-400">Campañas y calendario de contenido se gestionan en las siguientes fases del espacio.</p>
    </div>
  );
}
