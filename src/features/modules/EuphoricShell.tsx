import { Outlet } from 'react-router';
import { Settings, Users } from 'lucide-react';
import { AppLayout } from '@/components/layout';
import type { User } from '@/types';

const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'Admin' };

const tabs = [
  { label: 'Cuentas', href: '/euphoric/cuentas' },
  { label: 'Campañas', href: '/euphoric/campanas' },
  { label: 'Publicaciones', href: '/euphoric/calendario' },
  { label: 'Creatividades', href: '/euphoric/piezas' },
  { label: 'Eventos', href: '/euphoric/eventos' },
  { label: 'Agenda', href: '/euphoric/agenda' },
  { label: 'Negocio', href: '/euphoric/negocio' },
];

export function EuphoricShell() {
  return (
    <AppLayout
      user={mockUser}
      module={{
        name: 'Euphoric Media',
        href: '/euphoric',
        tabs,
        iconActions: [
          { icon: Users, href: '/euphoric/artistas', label: 'Artistas' },
          { icon: Settings, href: '/euphoric/ajustes', label: 'Ajustes' },
        ],
      }}
    >
      <Outlet />
    </AppLayout>
  );
}
