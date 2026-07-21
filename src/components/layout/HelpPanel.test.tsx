import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { HelpPanel } from './HelpPanel';

describe('HelpPanel', () => {
  it('renderiza el panel con Enviar, Reportar con captura y Mis avisos', () => {
    render(<HelpPanel />);
    expect(screen.getByText('Ayuda')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument();
    expect(screen.getByText('Reportar con captura')).toBeInTheDocument();
    expect(screen.getByText('Mis avisos')).toBeInTheDocument();
  });

  it('se colapsa al pulsar cerrar', async () => {
    const user = userEvent.setup();
    render(<HelpPanel />);
    await user.click(screen.getByRole('button', { name: /Cerrar ayuda/ }));
    expect(screen.queryByRole('button', { name: 'Enviar' })).toBeNull();
  });
});
