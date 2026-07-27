import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EscenarioSelector } from './EscenarioSelector';
import { seedProyecciones } from '../data/seed';

const ajustes = seedProyecciones[0].ajustesEscenarios;

describe('EscenarioSelector', () => {
  it('renders los 3 botones con el multiplicador en vivo y marca el activo', () => {
    render(<EscenarioSelector ajustes={ajustes} value="base" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Pesimista · 50%' })).toBeInTheDocument();
    const base = screen.getByRole('button', { name: 'Base · 75%' });
    expect(base).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Optimista · 100%' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('Ves el resultado por acuerdo.')).toBeInTheDocument();
  });

  it('clicar un escenario llama onChange con el valor correcto', async () => {
    const onChange = vi.fn();
    render(<EscenarioSelector ajustes={ajustes} value="base" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Pesimista · 50%' }));
    expect(onChange).toHaveBeenCalledWith('pesimista');
  });
});
