import type { Magazine } from '../data/types';

export interface PublicationCardProps {
  magazine: Magazine;
}

export function PublicationCard({ magazine }: PublicationCardProps) {
  const { spaceName, region, accent, resumen } = magazine;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
        <span className="text-base font-semibold text-slate-800">{spaceName}</span>
      </div>
      <p className="mt-1 text-sm text-slate-500">{region} · con revista</p>
      <p className="mt-3">
        <span className="text-xl font-semibold text-slate-800">{resumen.enCurso}</span>
        <span className="ml-1 text-sm text-slate-500">en curso</span>
      </p>
      {resumen.revistaAbierta && (
        <p className="mt-2 text-sm text-slate-500">Revista abierta: {resumen.revistaAbierta}</p>
      )}
    </div>
  );
}
