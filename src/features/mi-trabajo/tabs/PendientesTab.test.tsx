import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PendientesTab } from './PendientesTab';

describe('PendientesTab', () => {
  it('muestra el inbox-zero literal del live', () => {
    render(<PendientesTab usuario="Test" />);
    expect(screen.getByText('✓')).toBeInTheDocument();
    expect(screen.getByText('No te toca nada ahora mismo')).toBeInTheDocument();
    expect(
      screen.getByText('Ni alertas, ni creatividades, ni aprobaciones. Está todo al día.')
    ).toBeInTheDocument();
  });

  it('el drawer de alta arranca cerrado y se abre con «+ Nueva tarea»', () => {
    render(<PendientesTab usuario="Test" />);
    expect(screen.queryByRole('dialog', { name: 'Nueva tarea' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '+ Nueva tarea' }));
    expect(screen.getByRole('dialog', { name: 'Nueva tarea' })).toBeInTheDocument();
  });

  it('el drawer trae los campos del live, con Media y Ninguno por defecto', () => {
    render(<PendientesTab usuario="Test" />);
    fireEvent.click(screen.getByRole('button', { name: '+ Nueva tarea' }));
    const drawer = within(screen.getByRole('dialog', { name: 'Nueva tarea' }));
    expect(drawer.getByPlaceholderText('¿Qué hay que hacer?')).toBeInTheDocument();
    expect(drawer.getByLabelText('Prioridad')).toHaveValue('Media');
    expect(drawer.getByLabelText('Fecha límite')).toHaveAttribute('type', 'date');
    expect(drawer.getByLabelText(/Vincular a/)).toHaveValue('Ninguno');
    // el usuario viene pre-asignado, como el chip «test» del live
    expect(drawer.getByRole('button', { name: 'Quitar a Test' })).toBeInTheDocument();
  });

  it('guarda una tarea en estado local y sustituye el inbox-zero', () => {
    render(<PendientesTab usuario="Test" />);
    fireEvent.click(screen.getByRole('button', { name: '+ Nueva tarea' }));
    const drawer = within(screen.getByRole('dialog', { name: 'Nueva tarea' }));
    fireEvent.change(drawer.getByPlaceholderText('¿Qué hay que hacer?'), {
      target: { value: 'Cerrar el rider de Marbella' },
    });
    fireEvent.change(drawer.getByLabelText('Prioridad'), { target: { value: 'Alta' } });
    fireEvent.click(drawer.getByRole('button', { name: 'Guardar' }));

    expect(screen.getByText('Cerrar el rider de Marbella')).toBeInTheDocument();
    expect(screen.getByText('Alta')).toBeInTheDocument();
    expect(screen.queryByText('No te toca nada ahora mismo')).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: 'Nueva tarea' })).not.toBeInTheDocument();
  });

  it('no guarda una tarea sin título', () => {
    render(<PendientesTab usuario="Test" />);
    fireEvent.click(screen.getByRole('button', { name: '+ Nueva tarea' }));
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(screen.getByRole('dialog', { name: 'Nueva tarea' })).toBeInTheDocument();
    expect(screen.getByText('No te toca nada ahora mismo')).toBeInTheDocument();
  });

  it('«✕ Cerrar» cierra el drawer sin dar de alta nada', () => {
    render(<PendientesTab usuario="Test" />);
    fireEvent.click(screen.getByRole('button', { name: '+ Nueva tarea' }));
    fireEvent.change(screen.getByPlaceholderText('¿Qué hay que hacer?'), {
      target: { value: 'Descartable' },
    });
    fireEvent.click(screen.getByRole('button', { name: '✕ Cerrar' }));
    expect(screen.queryByRole('dialog', { name: 'Nueva tarea' })).not.toBeInTheDocument();
    expect(screen.getByText('No te toca nada ahora mismo')).toBeInTheDocument();
  });
});
