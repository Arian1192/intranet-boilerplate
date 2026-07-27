import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProyeccionEstadoCard } from './ProyeccionEstadoCard';
import { seedProyecciones } from '../data/seed';

function renderCard() {
  const onUpdate = vi.fn();
  render(<ProyeccionEstadoCard proyeccion={seedProyecciones[0]} onUpdate={onUpdate} />);
  return { onUpdate };
}

describe('ProyeccionEstadoCard', () => {
  it('renders estado activo, reunión, responsables y Convertir en evento', () => {
    renderCard();
    expect(screen.getByRole('button', { name: 'Aprobada' })).toHaveClass(/bg-white|shadow/);
    expect(screen.getByText('Jack')).toBeInTheDocument();
    expect(screen.getByText('Tony')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Convertir en evento →' })).toBeInTheDocument();
  });

  it('cambiar estado llama onUpdate', async () => {
    const { onUpdate } = renderCard();
    await userEvent.click(screen.getByRole('button', { name: 'Rechazada' }));
    expect(onUpdate).toHaveBeenCalledWith({ estado: 'rechazada' });
  });

  it('"＋ Añadir" abre el picker y añadir invoca onUpdate con el nuevo responsable', async () => {
    const { onUpdate } = renderCard();
    await userEvent.click(screen.getByRole('button', { name: '＋ Añadir' }));
    await userEvent.click(screen.getByText('Alba Gelabert'));
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        responsables: expect.arrayContaining([expect.objectContaining({ nombre: 'Alba Gelabert' })]),
      })
    );
  });

  it('quitar un responsable llama onUpdate sin ese id', async () => {
    const { onUpdate } = renderCard();
    await userEvent.click(screen.getByRole('button', { name: 'Quitar Jack' }));
    expect(onUpdate).toHaveBeenCalledWith({ responsables: [expect.objectContaining({ nombre: 'Tony' })] });
  });
});
