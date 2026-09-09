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
    // El recuento va pegado al importe («· 12»), no en una línea aparte
    // diciendo «12 shows»: recalco del 2026-09-09.
    const esperado: [string, string, string][] = [
      ['Tentative', '11.433,78 €', '· 12'],
      ['Confirmado', '11.100,00 €', '· 9'],
      ['Contrato', '0,00 €', '· 0'],
      ['Pendiente cobro', '800,00 €', '· 1'],
      ['Pendiente liquidar', '6150,00 €', '· 6'],
      // El live llama «Cerrado» a esta etapa; ver `etapaLabels.ts`.
      ['Cerrado', '1000,00 €', '· 1'],
    ];
    for (const [label, importe, shows] of esperado) {
      const tarjeta = screen.getByTitle(`Ver shows en ${label}`);
      expect(within(tarjeta).getByText(importe)).toBeInTheDocument();
      expect(within(tarjeta).getByText(shows)).toBeInTheDocument();
    }
  });

  it('trae el aviso de fichas a revisar con los cuatro contadores', async () => {
    await renderDashboard();
    // Sin emoji: los seis `h2` del live van en texto pelado.
    expect(screen.getByText('Fichas a revisar')).toBeInTheDocument();
    expect(
      screen.getByText('40 artistas con datos pendientes · 111 datos · 50 documentos · 33 bios')
    ).toBeInTheDocument();
  });

  it('trae los 5 posibles gigs del Google Calendar con sus acciones', async () => {
    await renderDashboard();
    expect(screen.getByText('Posibles gigs en calendario')).toBeInTheDocument();
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

  // El bloque «Próximos shows» que fijaba este test **ya no está en el live**:
  // recalco del 2026-09-09, sus secciones son Novedades, Advancing, Logística,
  // Notas urgentes, Fichas a revisar y Posibles gigs, y ninguna más. El test se
  // da la vuelta en vez de borrarse, para que nadie lo reponga por inercia.
  it('ya no pinta el bloque «Próximos shows», que el live retiró', async () => {
    await renderDashboard();
    expect(screen.queryByText('Próximos shows')).not.toBeInTheDocument();
    expect(screen.queryByText('Sera De Villalta @ Stackt Market')).not.toBeInTheDocument();
  });

  it('las secciones van en el orden del live', async () => {
    await renderDashboard();
    const titulos = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(titulos).toEqual([
      'Novedades',
      'Advancing',
      'Logística',
      'Notas urgentes',
      'Fichas a revisar',
      'Posibles gigs en calendario',
    ]);
  });

  it('la cabecera trae el enlace a todos los shows', async () => {
    await renderDashboard();
    const boton = screen.getByRole('button', { name: /Ir a todos los shows/ });
    expect(boton).toBeInTheDocument();
  });

  it('el feed de Novedades trae los 15 eventos de la captura', async () => {
    await renderDashboard();
    expect(
      screen.getByText('Lo que hacen los promotores con sus correos y contratos')
    ).toBeInTheDocument();
    expect(screen.getAllByText(/C1-2026-\d{3}$/, { exact: false })).toHaveLength(15);
    // Los tres formatos de fecha del live, tal cual.
    expect(screen.getAllByText(/^hoy a las 04:02 · C1-2026-158$/)).toHaveLength(4);
    expect(screen.getByText('ayer a las 22:44 · C1-2026-181')).toBeInTheDocument();
    // Dos eventos comparten ese sello: el live repite hora y referencia.
    expect(screen.getAllByText('7/9 a las 20:54 · C1-2026-138')).toHaveLength(2);
  });

  it('los KPI escriben el recuento pegado al importe, como el live', async () => {
    await renderDashboard();
    const tarjeta = screen.getByTitle('Ver shows en Tentative');
    expect(within(tarjeta).getByText('· 12')).toBeInTheDocument();
    expect(within(tarjeta).queryByText('12 shows')).not.toBeInTheDocument();
  });

  it('notas urgentes sigue vacío', async () => {
    await renderDashboard();
    expect(screen.getByText('Sin notas pendientes.')).toBeInTheDocument();
  });
});
