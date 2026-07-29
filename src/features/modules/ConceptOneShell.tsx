import { Outlet, useLocation } from 'react-router';
import { AppLayout } from '@/components/layout';
import {
  CONCEPTONE_AREAS,
  BOOKINGS_SECTIONS,
  activeArea,
  activeSection,
  showsSectionBar,
} from '@/features/booking/data/nav';
import type { User } from '@/types';

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'Admin',
};

export function ConceptOneShell() {
  const { pathname } = useLocation();

  return (
    <AppLayout
      user={mockUser}
      module={{
        name: 'ConceptOne',
        nav: {
          areas: CONCEPTONE_AREAS,
          activeArea: activeArea(pathname),
          sections: showsSectionBar(pathname) ? BOOKINGS_SECTIONS : undefined,
          activeSection: activeSection(pathname),
        },
        actionLabel: '+ Añadir show',
      }}
    >
      <Outlet />
    </AppLayout>
  );
}
