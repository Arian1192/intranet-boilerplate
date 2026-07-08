import { TaskList } from '@/features/booking/components';
import { useLogistics } from '../hooks/useLogistics';

export function LogisticsPage() {
  const { items, isLoading, error } = useLogistics();

  if (isLoading) {
    return <div className="py-12 text-center text-slate-500">Cargando...</div>;
  }

  if (error) {
    return <div className="py-12 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Logística</h1>
      <TaskList items={items} />
    </div>
  );
}
