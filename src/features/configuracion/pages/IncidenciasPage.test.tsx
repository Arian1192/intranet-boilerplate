import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IncidenciasPage } from './IncidenciasPage';

const stats = () => within(screen.getByRole('group', { name: 'Filtrar por estado' }));

describe('IncidenciasPage', () => {
  it('reusa los filtros y la lista reales de incidencias con los conteos de Configuración', async () => {
    const { container } = render(<IncidenciasPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Incidencias' })).toBeInTheDocument();
    expect(stats().getByRole('button', { name: /NUEVAS/ })).toHaveTextContent('1');
    expect(stats().getByRole('button', { name: /AUTO/ })).toHaveTextContent('1');
    expect(stats().getByRole('button', { name: /EN CURSO/ })).toHaveTextContent('0');
    expect(stats().getByRole('button', { name: /RESUELTAS/ })).toHaveTextContent('2');
    expect(stats().getByRole('button', { name: /DESCARTADAS/ })).toHaveTextContent('4');
    expect(container.querySelector('.bg-red-100')).toBeNull();
    expect(container.querySelector('.bg-rose-100')).not.toBeNull();
    expect(screen.getAllByText('📎')).toHaveLength(4);

    await userEvent.click(stats().getByRole('button', { name: /NUEVAS/ }));
    expect(stats().getByRole('button', { name: /NUEVAS/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('En el apartat de contactes del Signer/Buyer molaria afegir la opcio de posar TEL')).toBeInTheDocument();
    expect(screen.queryByText('Me gustaría hacer la solicitud de 2 cosas:')).toBeNull();
  });

  it('abre el detalle real al pulsar una fila de Configuración', async () => {
    render(<IncidenciasPage />);

    await userEvent.click(screen.getByRole('button', { name: /En el apartat de contactes/ }));

    const dialog = screen.getByRole('dialog', { name: 'Detalle de la incidencia' });
    expect(within(dialog).getByText('Contexto técnico')).toBeInTheDocument();
    expect(within(dialog).getByRole('textbox', { name: 'Respuesta' })).toBeInTheDocument();

    await userEvent.click(within(dialog).getByRole('button', { name: 'Cerrar' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('no usa clases brand-*', () => {
    const { container } = render(<IncidenciasPage />);
    expect(container.querySelector('[class*="brand-"]')).toBeNull();
  });
});
