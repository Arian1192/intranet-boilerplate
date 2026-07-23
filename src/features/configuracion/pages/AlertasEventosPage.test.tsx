import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlertasEventosPage } from './AlertasEventosPage';

describe('AlertasEventosPage', () => {
  it('título real, 5 reglas exactas y Evaluar ahora inerte', () => {
    const { container } = render(<AlertasEventosPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Alertas de producción' })).toBeInTheDocument();
    expect(screen.getByText('Presupuesto sin definir')).toBeInTheDocument();
    expect(screen.getByText('Tareas de producción pendientes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Evaluar ahora' })).toHaveAttribute('type', 'button');
    expect(screen.getAllByRole('checkbox', { name: 'Activa' })).toHaveLength(5);
    expect(screen.getAllByRole('spinbutton').map((input) => (input as HTMLInputElement).value)).toEqual([
      '21', '14', '10', '7', '3',
    ]);
    expect(container.querySelector('[class*="brand-"]')).toBeNull();
  });

  it('mantiene las severidades/email del seed y actualiza controles en memoria', async () => {
    render(<AlertasEventosPage />);
    expect(screen.getAllByRole('combobox').map((select) => (select as HTMLSelectElement).value)).toEqual([
      'info', 'aviso', 'critica', 'aviso', 'aviso',
    ]);
    const emailChecks = screen.getAllByRole('checkbox', { name: 'Avisar también por email' });
    expect(emailChecks.filter((item) => (item as HTMLInputElement).checked)).toHaveLength(1);

    const activeChecks = screen.getAllByRole('checkbox', { name: 'Activa' });
    await userEvent.click(activeChecks[0]);
    expect(activeChecks[0]).not.toBeChecked();

    await userEvent.selectOptions(screen.getAllByRole('combobox')[0], 'critica');
    expect(screen.getAllByRole('combobox')[0]).toHaveValue('critica');
  });
});
