import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportDialog } from './ReportDialog';

function setup() {
  const onCancel = vi.fn();
  const onSend = vi.fn();
  render(<ReportDialog onCancel={onCancel} onSend={onSend} />);
  return { onCancel, onSend };
}

describe('ReportDialog', () => {
  it('renderiza título, pestañas, textarea, adjuntar, ayuda y botones', () => {
    setup();
    expect(screen.getByRole('heading', { name: 'Reportar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Algo falla' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Una idea' })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Añadir captura')).toBeInTheDocument();
    expect(screen.getByText(/Se adjuntan solos/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument();
  });

  it('Enviar está deshabilitado sin texto y se habilita al escribir', async () => {
    const user = userEvent.setup();
    const { onSend } = setup();
    const enviar = screen.getByRole('button', { name: 'Enviar' });
    expect(enviar).toBeDisabled();
    await user.type(screen.getByRole('textbox'), 'algo va mal');
    expect(enviar).toBeEnabled();
    await user.click(enviar);
    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it('el placeholder cambia según la pestaña', async () => {
    const user = userEvent.setup();
    setup();
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'placeholder',
      'Qué esperabas que pasara y qué ha pasado…'
    );
    await user.click(screen.getByRole('button', { name: 'Una idea' }));
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'placeholder',
      'Qué se podría hacer mejor…'
    );
  });

  it('Cancelar y el backdrop invocan onCancel', async () => {
    const user = userEvent.setup();
    const { onCancel } = setup();
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onCancel).toHaveBeenCalledTimes(2);
  });
});
