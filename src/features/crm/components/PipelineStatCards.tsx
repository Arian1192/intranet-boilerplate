import { formatEur, type pipelineStats } from '../data/pipeline';

type Stats = ReturnType<typeof pipelineStats>;

function StatCard({ label, value, sub, valueClass }: { label: string; value: string; sub: string; valueClass?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${valueClass ?? 'text-slate-800'}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-400">{sub}</p>
    </div>
  );
}

export function PipelineStatCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="PIPELINE ABIERTO" value={formatEur(stats.openTotal)} sub={`${stats.openCount} oportunidades`} />
      <StatCard label="FORECAST PONDERADO" value={formatEur(stats.forecast)} sub="Σ valor × probabilidad" />
      <StatCard label="GANADAS" value={formatEur(stats.wonTotal)} sub={`${stats.wonCount} cerradas`} valueClass="text-emerald-600" />
    </div>
  );
}
