import { AppLayout } from '@/components/layout';
import { Card } from '@/components/ui';
import { useDashboard } from './hooks/useDashboard';
import { ModuleGrid } from './ModuleGrid';
import { NewsFeed } from './NewsFeed';
import { UpcomingEvents } from './UpcomingEvents';
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

  const businessModules = dashboard.modules.filter((m) => m.category === 'business');
  const internalModules = dashboard.modules.filter((m) => m.category === 'internal');
  const displayName = dashboard.greeting.replace(/^Hola,\s*/, '');

  return (
    <AppLayout
      user={{
        id: '1',
        email: 'test@example.com',
        name: displayName,
        role: 'Admin',
      }}
    >
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-slate-900">
            {dashboard.greeting} 👋🏼
          </h1>
          {dashboard.birthdayNotice && (
            <p className="mt-1 text-slate-500">{dashboard.birthdayNotice}</p>
          )}
          <p className="mt-1 text-sm text-slate-400">{dashboard.weather}</p>
        </div>

        <NewsFeed items={dashboard.news} />

        <ModuleGrid modules={businessModules} title="Tus espacios" />
        <ModuleGrid modules={internalModules} title="Uso interno" />

        <UpcomingEvents events={dashboard.upcomingEvents} />
        {dashboard.reminders.length > 0 && <Reminders reminders={dashboard.reminders} />}
      </div>
    </AppLayout>
  );
}
