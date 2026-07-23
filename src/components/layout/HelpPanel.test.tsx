import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom';
import { HelpPanel } from './HelpPanel';

function renderPanel() {
  return render(
    <MemoryRouter>
      <HelpPanel />
    </MemoryRouter>
  );
}

describe('HelpPanel', () => {
  it('renderiza el panel con Enviar, Reportar con captura y Mis avisos', () => {
    renderPanel();
    expect(screen.getByText('Ayuda')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument();
    expect(screen.getByText('Reportar con captura')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Mis avisos' })).toHaveAttribute('href', '/incidencias');
  });

  it('se colapsa al pulsar cerrar', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: /Cerrar ayuda/ }));
    expect(screen.queryByRole('button', { name: 'Enviar' })).toBeNull();
  });

  it('abre el modal Reportar, envía y muestra el toast', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: 'Reportar con captura' }));
    expect(screen.getByRole('heading', { name: 'Reportar' })).toBeInTheDocument();
    // el panel de ayuda ya no está visible
    expect(screen.queryByText('Reportar con captura')).toBeNull();
    await user.type(screen.getByRole('textbox'), 'no carga la página');
    await user.click(screen.getByRole('button', { name: 'Enviar' }));
    expect(screen.queryByRole('heading', { name: 'Reportar' })).toBeNull();
    expect(screen.getByText('Gracias, hemos recibido tu incidencia.')).toBeInTheDocument();
  });

  it('Cancelar vuelve al panel de ayuda', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: 'Reportar con captura' }));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByPlaceholderText('Pregunta o cuenta qué falla…')).toBeInTheDocument();
  });
});
