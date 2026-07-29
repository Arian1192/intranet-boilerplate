import { Link } from 'react-router';
import { StatCard, Card } from '@/components/ui';
import { StatusChip } from '../components/StatusChip';
import { accounts, campaigns, publications, todayIso } from '../data/seed';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function isWithinNextWeek(isoDate: string) {
  const today = new Date(todayIso).getTime();
  const date = new Date(isoDate).getTime();
  return date >= today && date <= today + WEEK_MS;
}

export function ResumenPage() {
  const activeAccounts = accounts.filter((account) => account.status === 'Activa');
  const runningCampaigns = campaigns.filter((campaign) => campaign.status === 'en-curso');
  const upcoming = publications
    .filter((publication) => isWithinNextWeek(publication.isoDate))
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Euphoric Media</h1>
        <p className="text-slate-500">Marketing del grupo: cuentas, campañas y calendario de contenido.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link to="/euphoric/cuentas">
          <StatCard
            label="CUENTAS ACTIVAS"
            value={String(activeAccounts.length)}
            caption={`de ${accounts.length}`}
          />
        </Link>
        <StatCard label="CAMPAÑAS EN CURSO" value={String(runningCampaigns.length)} />
        <StatCard label="PUBLICACIONES (7 DÍAS)" value={String(upcoming.length)} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Campañas en curso</p>
          {runningCampaigns.length === 0 ? (
            <p className="mt-6 text-center text-sm text-slate-400">No hay campañas en curso.</p>
          ) : (
            runningCampaigns.map((campaign) => (
              <Link
                key={campaign.id}
                to="/euphoric/campanas"
                className="mt-3 flex items-center justify-between rounded-lg border border-slate-100 p-3"
              >
                <div>
                  <p className="font-medium text-slate-900">{campaign.name}</p>
                  <p className="text-sm text-slate-500">
                    {campaign.account} · hasta {campaign.endLabel}
                  </p>
                </div>
                <StatusChip status="En curso" />
              </Link>
            ))
          )}
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Próximas publicaciones</p>
          {upcoming.length === 0 ? (
            <p className="mt-6 text-center text-sm text-slate-400">No hay publicaciones próximas.</p>
          ) : (
            upcoming.map((publication) => (
              <Link
                key={publication.id}
                to="/euphoric/calendario"
                className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-3"
              >
                <div>
                  <p className="font-medium text-slate-900">{publication.name}</p>
                  <p className="text-sm text-slate-500">
                    {publication.dateLabel} · {publication.channel} · {publication.account}
                  </p>
                </div>
                <StatusChip status={publication.status} />
              </Link>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
