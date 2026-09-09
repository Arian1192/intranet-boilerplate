import { Outlet } from 'react-router';
import { ApxRail } from '@/features/booking/shell/ApxRail';
import { ApxShell } from '@/features/booking/shell/ApxShell';
import type { User } from '@/types';

// El live entra con la cuenta `test`, rol `admin`, y así se rotula el perfil del
// pie del rail.
const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'test',
  role: 'admin',
};

/**
 * ConceptOne ya no cuelga del `AppLayout` compartido: tiene carcasa propia.
 *
 * El rail flota (`position: fixed`) y `.apx-shift` guarda el margen de 58 px, de
 * modo que el contenido no se re-maqueta cuando el rail se expande al hover.
 * Las clases del `<main>` son las del live (`conceptone.main.html`).
 */
export function ConceptOneShell() {
  return (
    <ApxShell>
      <ApxRail user={mockUser} />
      <div className="apx-shift">
        <main className="mx-auto w-full max-w-7xl flex-1 px-2 py-4 sm:px-4 sm:py-6">
          <Outlet />
        </main>
      </div>
    </ApxShell>
  );
}
