import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IncidenciasPage } from './IncidenciasPage';

// Las stat-cards y las filas comparten los mismos rótulos de estado (NUEVAS,
// RESUELTAS…), así que las consultas de filtro se acotan al grupo de filtros.
const stats = () => within(screen.getByRole('group', { name: 'Filtrar por estado' }));

describe('IncidenciasPage', () => {
  it('sin filtro: título, subtítulo, 5 stats con conteos 1/1/0/2/4 y 8 filas', () => {
    render(<IncidenciasPage />);
    expect(screen.getByRole('heading', { name: 'Incidencias' })).toBeInTheDocument();
    expect(
      screen.getByText('Lo que el equipo reporta desde el panel de ayuda. Responder es lo que hace que sigan reportando.')
    ).toBeInTheDocument();
    expect(stats().getByRole('button', { name: /NUEVAS/ })).toHaveTextContent('1');
    expect(stats().getByRole('button', { name: /AUTO/ })).toHaveTextContent('1');
    expect(stats().getByRole('button', { name: /EN CURSO/ })).toHaveTextContent('0');
    expect(stats().getByRole('button', { name: /RESUELTAS/ })).toHaveTextContent('2');
    expect(stats().getByRole('button', { name: /DESCARTADAS/ })).toHaveTextContent('4');
    expect(stats().getAllByRole('button')).toHaveLength(5);
    // 5 stat-cards + 8 filas = 13 botones
    expect(screen.getAllByRole('button')).toHaveLength(13);
  });

  it('click en NUEVAS filtra a 1 fila; segundo click limpia el filtro (vuelve a 8)', async () => {
    render(<IncidenciasPage />);
    await userEvent.click(stats().getByRole('button', { name: /NUEVAS/ }));
    expect(screen.getAllByRole('button')).toHaveLength(6); // 5 stats + 1 fila
    expect(
      screen.getByText('En el apartat de contactes del Signer/Buyer molaria afegir la opcio de posar TEL')
    ).toBeInTheDocument();
    await userEvent.click(stats().getByRole('button', { name: /NUEVAS/ }));
    expect(screen.getAllByRole('button')).toHaveLength(13);
  });

  it('click en EN CURSO muestra el estado vacío "Nada en este estado."', async () => {
    render(<IncidenciasPage />);
    await userEvent.click(stats().getByRole('button', { name: /EN CURSO/ }));
    expect(screen.getByText('Nada en este estado.')).toBeInTheDocument();
  });

  it('click en DESCARTADAS filtra a las 4 filas exactas; solo un filtro activo a la vez', async () => {
    render(<IncidenciasPage />);
    await userEvent.click(stats().getByRole('button', { name: /DESCARTADAS/ }));
    expect(screen.getAllByRole('button')).toHaveLength(9); // 5 stats + 4 filas
    await userEvent.click(stats().getByRole('button', { name: /RESUELTAS/ }));
    // cambia de filtro sin acumular: 5 stats + 2 filas
    expect(screen.getAllByRole('button')).toHaveLength(7);
    expect(stats().getByRole('button', { name: /RESUELTAS/ })).toHaveAttribute('aria-pressed', 'true');
    expect(stats().getByRole('button', { name: /DESCARTADAS/ })).toHaveAttribute('aria-pressed', 'false');
  });

  it('no usa clases brand-*', () => {
    const { container } = render(<IncidenciasPage />);
    expect(container.querySelector('[class*="brand-"]')).toBeNull();
  });
});
