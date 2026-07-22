import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CampanasToolbar } from './CampanasToolbar';

function setup(overrides = {}) {
  const props = {
    query: '', onQuery: vi.fn(),
    enElAire: 0, ganado: 1500,
    view: 'embudo' as const, onView: vi.fn(),
    ...overrides,
  };
  render(<CampanasToolbar {...props} />);
  return props;
}

describe('CampanasToolbar', () => {
  it('muestra buscador, stats formateadas y botón inerte + Campaña', () => {
    setup();
    expect(screen.getByPlaceholderText(/Buscar campaña o anuncian/)).toBeInTheDocument();
    expect(screen.getByText('En el aire')).toBeInTheDocument();
    expect(screen.getByText('Ganado')).toBeInTheDocument();
    expect(screen.getByText(/1\.?500,00/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Campaña' })).toHaveAttribute('type', 'button');
  });

  it('escribir en el buscador emite onQuery', async () => {
    const { onQuery } = setup();
    await userEvent.type(screen.getByPlaceholderText(/Buscar campaña o anuncian/), 'test');
    expect(onQuery).toHaveBeenCalled();
  });

  it('pulsar Kanban emite onView', async () => {
    const { onView } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Kanban' }));
    expect(onView).toHaveBeenCalledWith('kanban');
  });
});
