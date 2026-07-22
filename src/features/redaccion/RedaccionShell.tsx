import { Outlet } from 'react-router';
import { AppLayout } from '@/components/layout';
import type { Magazine } from './data/types';
import type { User } from '@/types';

const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'Admin' };

export function RedaccionShell({ magazine }: { magazine: Magazine }) {
  const tabs = [
    { label: 'Resumen', href: magazine.basePath },
    { label: 'Contenidos', href: `${magazine.basePath}/contenidos` },
    { label: 'Campañas', href: `${magazine.basePath}/campanas` },
    { label: 'Revistas', href: `${magazine.basePath}/revistas` },
  ];
  return (
    <AppLayout user={mockUser} module={{ name: magazine.name, href: magazine.basePath, tabs }}>
      <Outlet context={magazine} />
    </AppLayout>
  );
}
