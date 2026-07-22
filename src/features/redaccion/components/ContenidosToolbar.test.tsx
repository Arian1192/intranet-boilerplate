import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContenidosToolbar } from './ContenidosToolbar';

function setup(overrides = {}) {
  const props = {
    spaceName: 'Mixmag Spain', accent: '#E11D48',
    query: '', onQuery: vi.fn(),
    mine: false, onMine: vi.fn(),
    scope: 'todo' as const, onScope: vi.fn(),
    view: 'panel' as const, onView: vi.fn(),
    ...overrides,
  };
  render(<ContenidosToolbar {...props} />);
  return props;
}

describe('ContenidosToolbar', () => {
  it('muestra espacio, búsqueda, segmentos y botón inerte + Contenido', () => {
    setup();
    expect(screen.getByText('Mixmag Spain')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Buscar por título o texto/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Contenido' })).toHaveAttribute('type', 'button');
  });

  it('escribir en la búsqueda emite onQuery', async () => {
    const { onQuery } = setup();
    await userEvent.type(screen.getByPlaceholderText(/Buscar por título o texto/), 'soho');
    expect(onQuery).toHaveBeenCalled();
  });

  it('pulsar Kanban emite onView', async () => {
    const { onView } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Kanban' }));
    expect(onView).toHaveBeenCalledWith('kanban');
  });

  it('pulsar De campaña emite onScope', async () => {
    const { onScope } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'De campaña' }));
    expect(onScope).toHaveBeenCalledWith('campana');
  });
});
