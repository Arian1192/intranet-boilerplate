import { useOutletContext } from 'react-router';
import { StatCard } from '@/components/ui';
import { PublicationCard } from '../components/PublicationCard';
import type { Magazine } from '../data/types';

export function ResumenPage() {
  const magazine = useOutletContext<Magazine>();
  const { resumen } = magazine;
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="LO QUE LLEVAS TÚ" value={String(resumen.llevasTu)} />
        <StatCard label="ATRASADOS" value={String(resumen.atrasados)} />
        <StatCard label="PENDIENTES DE APROBAR" value={String(resumen.pendientes)} />
      </div>
      <h2 className="mb-3 mt-6 text-sm font-semibold text-slate-800">Publicaciones</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <PublicationCard magazine={magazine} />
      </div>
    </div>
  );
}
