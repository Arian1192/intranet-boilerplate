import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { RepositoryProvider, MockRepository } from '@/repositories';
import { BookingDashboardPage } from './BookingDashboardPage';

async function renderDashboard() {
  render(
    <RepositoryProvider repository={new MockRepository()}>
      <MemoryRouter>
        <BookingDashboardPage />
      </MemoryRouter>
    </RepositoryProvider>
  );
  await screen.findByRole('heading', { level: 1, name: 'Dashboard' });
}

describe('BookingDashboardPage — v2 del live', () => {
  it('muestra los 6 KPIs con los importes y contadores del live', async () => {
    await renderDashboard();
    // Las etiquetas van en caja normal en el DOM y en mayúsculas por CSS,
    // como en el live; cada tile se localiza por su title.
    const esperado: [string, string, string][] = [
      ['Tentative', '11.433,78 €', '12 shows'],
      ['Confirmado', '11.100,00 €', '9 shows'],
      ['Contrato', '0,00 €', '0 shows'],
      ['Pendiente cobro', '800,00 €', '1 show'],
      ['Pendiente liquidar', '6150,00 €', '6 shows'],
      ['Liquidado', '1000,00 €', '1 show'],
    ];
    for (const [label, importe, shows] of esperado) {
      const tarjeta = screen.getByTitle(`Ver shows en ${label}`);
      expect(within(tarjeta).getByText(importe)).toBeInTheDocument();
      expect(within(tarjeta).getByText(shows)).toBeInTheDocument();
    }
  });

  it('trae el aviso de fichas a revisar con los cuatro contadores', async () => {
    await renderDashboard();
    expect(screen.getByText('📋 Fichas a revisar')).toBeInTheDocument();
    expect(
      screen.getByText('40 artistas con datos pendientes · 111 datos · 50 documentos · 33 bios')
    ).toBeInTheDocument();
  });

  it('trae los 5 posibles gigs del Google Calendar con sus acciones', async () => {
    await renderDashboard();
    expect(screen.getByText('📅 Posibles gigs en calendario')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Fechas que el artista tiene en su Google Calendar y aún no son shows. Decide si perseguirlas.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Tentative - Playa de las Américas - Papagayo Tenerife')
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Upgrade a Show →' })).toHaveLength(5);
    expect(screen.getAllByRole('button', { name: 'Ignorar' })).toHaveLength(5);
  });

  it('advancing y logística traen los 5 shows de cada lista', async () => {
    await renderDashboard();
    expect(screen.getByText('Advancing').closest('div')!.parentElement!).toHaveTextContent('5');
    expect(screen.getByText('Logística').closest('div')!.parentElement!).toHaveTextContent('5');
    expect(screen.getAllByText('ART NO LOGIA @ Jiwa')).toHaveLength(2);
  });

  it('próximos shows lista los 10 del live con localización y chapas', async () => {
    await renderDashboard();
    const fila = screen.getByText('Sera De Villalta @ Stackt Market').closest('button')!;
    expect(within(fila).getByText('Toronto, Canadá')).toBeInTheDocument();
    expect(within(fila).getByText('D-31')).toBeInTheDocument();
    expect(within(fila).getByText('Tentative')).toBeInTheDocument();
    expect(within(fila).getByText('Sin liquidar')).toBeInTheDocument();
    expect(screen.getByText('Sergio Saffe @ el Tebo')).toBeInTheDocument();
  });

  it('notas urgentes sigue vacío', async () => {
    await renderDashboard();
    expect(screen.getByText('Sin notas pendientes.')).toBeInTheDocument();
  });
});
