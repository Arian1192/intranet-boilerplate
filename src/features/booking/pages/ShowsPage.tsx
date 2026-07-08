import { useSearchParams } from 'react-router';
import { DataTable } from '@/features/booking/components';
import type { ShowStatus } from '@/types';
import { useShows } from '../hooks/useShows';

const validStatuses: ShowStatus[] = [
  'tentative',
  'offer',
  'confirmed',
  'contract',
  'pending-payment',
  'pending-settlement',
  'done',
];

function isShowStatus(value: string | null): value is ShowStatus {
  return value !== null && validStatuses.includes(value as ShowStatus);
}

export function ShowsPage() {
  const { shows, isLoading, error } = useShows();
  const [searchParams] = useSearchParams();
  const selectedStatus = searchParams.get('status');
  const filteredShows = isShowStatus(selectedStatus)
    ? shows.filter((show) => show.status === selectedStatus)
    : shows;

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error) {
    return <div className="py-12 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Shows</h1>
      <DataTable shows={filteredShows} />
    </div>
  );
}
