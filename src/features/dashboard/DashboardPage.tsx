import { AppLayout } from '@/components/layout';
import { Card } from '@/components/ui';
import { useDashboard } from './hooks/useDashboard';
import { ModuleGrid } from './ModuleGrid';
import { InboxZero } from './InboxZero';
import { NewsFeed } from './NewsFeed';
import { Reminders } from './Reminders';

const loadingUser = { id: '1', email: '', name: 'Cargando...', role: '' };
const errorUser = { id: '1', email: '', name: 'Error', role: '' };

export function DashboardPage() {
  const { dashboard, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <AppLayout user={loadingUser}>
        <div className="flex h-64 items-center justify-center text-slate-500">
          Cargando...
        </div>
      </AppLayout>
    );
  }

  if (error || !dashboard) {
    return (
      <AppLayout user={errorUser}>
        <Card className="p-6 text-red-600">Error: {error || 'No data'}</Card>
      </AppLayout>
    );
  }

  const workspace = dashboard.modules.filter((m) => m.category === 'workspace');
  const management = dashboard.modules.filter((m) => m.category === 'management');
  const tools = dashboard.modules.filter((m) => m.category === 'tools');
  const displayName = dashboard.greeting.replace(/^Hola,\s*/, '');

  return (
    <AppLayout user={{ id: '1', email: 'test@example.com', name: displayName, role: 'Admin' }}>
      <div className="space-y-8">
        <div className="mt-2 mb-6 text-center">
          <h1 className="text-3xl font-semibold text-slate-800">{dashboard.greeting} 👋🏼</h1>
          {dashboard.festivoNotice && (
            <p className="mt-1 text-sm text-slate-500">{dashboard.festivoNotice}</p>
          )}
          <p className="mt-1 text-xs text-slate-400">{dashboard.weather}</p>
        </div>

        <div className="space-y-6">
          <ModuleGrid title="Espacios de trabajo" modules={workspace} />
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <ModuleGrid title="Gestión interna" modules={management} />
            <ModuleGrid title="Herramientas y ajustes" modules={tools} />
          </div>
        </div>

        {dashboard.reminders.length > 0 ? (
          <Reminders reminders={dashboard.reminders} />
        ) : (
          <InboxZero />
        )}

        <div className="max-w-2xl">
          <NewsFeed items={dashboard.news} />
        </div>
      </div>
    </AppLayout>
  );
}
