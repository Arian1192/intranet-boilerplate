import { DataTable } from '@/features/booking/components';
import { useShows } from '../hooks/useShows';

export function ShowsPage() {
  const { shows, isLoading, error } = useShows();

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error) {
    return <div className="py-12 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Shows</h1>
      <DataTable shows={shows} />
    </div>
  );
}
