import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventAlertRuleCard } from './EventAlertRuleCard';
import { alertRules } from '../data/alertas';

const rule = alertRules().find((r) => r.id === 'alerta-contrato')!;

describe('EventAlertRuleCard', () => {
  it('muestra título, desc, checkbox Activa, D-N, severidad y email', () => {
    render(
      <EventAlertRuleCard
        rule={rule}
        onToggleActive={() => {}}
        onWindowChange={() => {}}
        onSeverityChange={() => {}}
        onToggleEmail={() => {}}
      />
    );
    expect(screen.getByText('Contrato sin subir')).toBeInTheDocument();
    expect(screen.getByText('No hay ningún documento de tipo Contrato en el evento.')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Activa' })).toBeChecked();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('critica');
    expect(screen.getByRole('checkbox', { name: 'Avisar también por email' })).toBeChecked();
  });

  it('propaga los cuatro controles editables', async () => {
    const onToggleActive = vi.fn();
    const onWindowChange = vi.fn();
    const onSeverityChange = vi.fn();
    const onToggleEmail = vi.fn();
    render(
      <EventAlertRuleCard
        rule={rule}
        onToggleActive={onToggleActive}
        onWindowChange={onWindowChange}
        onSeverityChange={onSeverityChange}
        onToggleEmail={onToggleEmail}
      />
    );

    await userEvent.click(screen.getByRole('checkbox', { name: 'Activa' }));
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '12' } });
    await userEvent.selectOptions(screen.getByRole('combobox'), 'aviso');
    await userEvent.click(screen.getByRole('checkbox', { name: 'Avisar también por email' }));

    expect(onToggleActive).toHaveBeenCalledTimes(1);
    expect(onWindowChange).toHaveBeenLastCalledWith(12);
    expect(onSeverityChange).toHaveBeenCalledWith('aviso');
    expect(onToggleEmail).toHaveBeenCalledTimes(1);
  });
});
