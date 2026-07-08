import { AppLayout } from '@/components/layout';
import { Card } from '@/components/ui';
import type { User } from '@/types';

export interface ModuleShellProps {
  title: string;
  description: string;
  tabs?: string[];
}

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'Admin',
};

export function ModuleShell({ title, description, tabs }: ModuleShellProps) {
  return (
    <AppLayout
      user={mockUser}
      module={{ name: title, tabs, activeTab: tabs?.[0] }}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="text-slate-500">{description}</p>
        </div>
        <Card className="p-12 text-center">
          <p className="text-slate-500">Contenido del módulo en desarrollo.</p>
          <p className="mt-2 text-sm text-slate-400">
            Esta página es un placeholder para la próxima fase.
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
