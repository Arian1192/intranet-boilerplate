import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { RepositoryProvider, MockRepository } from '@/repositories';
import { ShowsPage } from './ShowsPage';

function renderShows(path = '/shows') {
  return render(
    <RepositoryProvider repository={new MockRepository()}>
      <MemoryRouter initialEntries={[path]}>
        <ShowsPage />
      </MemoryRouter>
    </RepositoryProvider>
  );
}

describe('ShowsPage', () => {
  it('renderiza los 14 shows del live', async () => {
    renderShows();
    expect(await screen.findByText('C1-2026-006')).toBeInTheDocument();
    expect(screen.getByText('14 shows')).toBeInTheDocument();
    expect(screen.getByText('C1-2026-007')).toBeInTheDocument();
  });

  it('el deep-link ?status=confirmed muestra solo los shows de etapa confirmada', async () => {
    renderShows('/shows?status=confirmed');
    expect(await screen.findByText('6 shows')).toBeInTheDocument();
    expect(screen.getByText('C1-2026-006')).toBeInTheDocument();
    expect(screen.queryByText('C1-2026-012')).not.toBeInTheDocument(); // tentative queda fuera
  });

  it('el buscador filtra por artista/evento/venue', async () => {
    renderShows();
    await screen.findByText('C1-2026-006');
    fireEvent.change(screen.getByPlaceholderText('Buscar artista, evento, venue…'), { target: { value: 'Florentia' } });
    expect(screen.getByText('1 show')).toBeInTheDocument();
    expect(screen.getByText('C1-2026-014')).toBeInTheDocument();
    expect(screen.queryByText('C1-2026-006')).not.toBeInTheDocument();
  });
});
