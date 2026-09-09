import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { RepositoryProvider, MockRepository } from '@/repositories';
import { AppRouter } from './router';

// El detalle lee los shows del repositorio, como `/shows`, así que el router se
// monta dentro del proveedor igual que en `ShowsPage.test.tsx`.
function renderAt(path: string) {
  return render(
    <RepositoryProvider repository={new MockRepository()}>
      <MemoryRouter initialEntries={[path]}>
        <AppRouter />
      </MemoryRouter>
    </RepositoryProvider>
  );
}

describe('el detalle de show está registrado', () => {
  it('/shows/:showId pinta el show dentro de la carcasa', async () => {
    const { container } = renderAt('/shows/s06');
    // El live rotula el detalle con el nombre del propio show; medido el
    // 2026-09-09 («Milan Torne @ House of Ferns»).
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Los Canarios @ FUEGO' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '← Volver a la lista' })).toHaveAttribute(
      'href',
      '/shows'
    );
    expect(container.querySelector('.apx-side')).toBeInTheDocument();
  });

  /*
   * La razón de ser de esta ruta. Nuestro router **no tiene catch-all**, así que
   * antes de registrarla `/shows/<id>` no pintaba nada — pantalla en blanco — y
   * ya había un enlace vivo apuntando ahí desde `main`: el «Ver show» de cada
   * fila del itinerario de `TourDetallePage`.
   */
  it('con un id que no existe sigue renderizando, no se queda en blanco', async () => {
    renderAt('/shows/no-existe');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Detalle del show' })
    ).toBeInTheDocument();
  });
});
