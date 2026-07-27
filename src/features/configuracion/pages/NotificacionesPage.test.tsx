import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificacionesPage } from './NotificacionesPage';

describe('NotificacionesPage', () => {
  it('título, 4 categorías y bloque de 11 notificaciones personales', () => {
    render(<NotificacionesPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Notificaciones' })).toBeInTheDocument();
    ['Solicitudes de vacaciones', 'Pedidos de reposición (portal)', 'Contratos firmados', 'Alertas de RRHH'].forEach((t) =>
      expect(screen.getByText(t)).toBeInTheDocument()
    );
    expect(screen.getByText('Notificaciones personales (automáticas)')).toBeInTheDocument();
    expect(screen.getByText('Cumpleaños del equipo')).toBeInTheDocument();
  });

  it('togglear un checkbox actualiza el estado local sin reventar', async () => {
    render(<NotificacionesPage />);
    const checkbox = screen.getAllByText('Alba Gelabert')[0].closest('label')!.querySelector('input')!;
    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
