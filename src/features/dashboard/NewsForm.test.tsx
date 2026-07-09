import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NewsForm } from './NewsForm';

describe('NewsForm', () => {
  it('renders the timing segmented control and publish timing options', () => {
    render(<NewsForm onClose={() => {}} />);
    expect(screen.getByText('¿Cuándo se publica?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ahora' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Programar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Borrador' })).toBeInTheDocument();
  });

  it('calls onClose when the submit or Cancelar button is clicked', () => {
    const onClose = vi.fn();
    render(<NewsForm onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('adapts the panel fields and submit label to the selected timing', () => {
    const { container } = render(<NewsForm onClose={() => {}} />);
    // Ahora (default)
    expect(screen.getByRole('button', { name: 'Publicar' })).toBeInTheDocument();
    expect(screen.getByText(/Notificar a todo el equipo/)).toBeInTheDocument();
    expect(container.querySelector('input[type="datetime-local"]')).toBeNull();

    // Borrador: sin checkboxes, helper de borrador, botón "Guardar borrador"
    fireEvent.click(screen.getByRole('button', { name: 'Borrador' }));
    expect(screen.getByRole('button', { name: 'Guardar borrador' })).toBeInTheDocument();
    expect(screen.queryByText(/Notificar a todo el equipo/)).not.toBeInTheDocument();
    expect(
      screen.getByText('Se guarda sin publicar. No avisa a nadie hasta que lo publiques.')
    ).toBeInTheDocument();

    // Programar: input datetime + helper + checkboxes
    fireEvent.click(screen.getByRole('button', { name: 'Programar' }));
    expect(container.querySelector('input[type="datetime-local"]')).not.toBeNull();
    expect(
      screen.getByText('Hora de Barcelona. Se publicará y avisará sola en ese momento.')
    ).toBeInTheDocument();
    expect(screen.getByText(/Notificar a todo el equipo/)).toBeInTheDocument();
  });
});
