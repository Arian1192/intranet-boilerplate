import { Outlet } from 'react-router';
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';
import { ConfiguracionSidebar } from './components/ConfiguracionSidebar';

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'Admin',
};

export function ConfiguracionShell() {
  return (
    <AppLayout user={mockUser} module={{ name: 'Configuración', href: '/configuracion' }}>
      <div className="flex items-start gap-8">
        <ConfiguracionSidebar />
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </AppLayout>
  );
}
