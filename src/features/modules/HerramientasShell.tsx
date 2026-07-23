import { Outlet } from 'react-router';
import { AppLayout } from '@/components/layout';
import { ProyeccionesProvider } from '@/features/herramientas/data/proyecciones-context';
import type { User } from '@/types';

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'Admin',
};

export function HerramientasShell() {
  const tabs = [
    { label: 'Resumen', href: '/herramientas' },
    { label: 'Proyecciones', href: '/herramientas/proyecciones' },
  ];
  return (
    <AppLayout user={mockUser} module={{ name: 'Herramientas', href: '/herramientas', tabs }}>
      <ProyeccionesProvider>
        <Outlet />
      </ProyeccionesProvider>
    </AppLayout>
  );
}
