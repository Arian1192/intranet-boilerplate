import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TeamTabs } from './TeamTabs';

describe('TeamTabs', () => {
  const counts = { todos: 6, redes: 2, web: 2, revista: 2 };

  it('muestra los 4 tabs con sus contadores y marca el activo', () => {
    render(<TeamTabs counts={counts} active="todos" onSelect={() => {}} />);
    expect(screen.getByRole('button', { name: /Todos/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Redes/ })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('dispara onSelect con el equipo pulsado', async () => {
    const onSelect = vi.fn();
    render(<TeamTabs counts={counts} active="todos" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /Revista/ }));
    expect(onSelect).toHaveBeenCalledWith('revista');
  });
});
