import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import { PhaseAccumCards } from './PhaseAccumCards';
import { CrudaStatusChip } from './CrudaStatusChip';
import { phaseAccum } from '../data/seed';
import type { OrderStatus } from '../data/types';

/** Renderiza el chip canónico aparte para comparar clases sin duplicar el mapa de colores. */
function renderChip(status: string) {
  const host = document.createElement('div');
  return render(<CrudaStatusChip status={status as OrderStatus} />, { container: document.body.appendChild(host) });
}

test('renders a card per phase with count and amount', () => {
  render(<PhaseAccumCards items={phaseAccum} />);
  expect(screen.getByText('Borrador')).toBeInTheDocument();
  expect(screen.getByText('6424,60 €')).toBeInTheDocument();
  expect(screen.getByText('8300,00 €')).toBeInTheDocument();
  // count badges: Borrador (2) and Confirmado (2)
  expect(screen.getAllByText('2')).toHaveLength(2);
});

test('el nombre de la fase es un chip de estado, como en el live', () => {
  render(<PhaseAccumCards items={phaseAccum} />);
  // mismas clases que CrudaStatusChip: no se duplica el mapa de colores
  const chip = (status: string) => {
    const { container } = renderChip(status);
    return container.firstElementChild!.className;
  };
  expect(screen.getByText('Borrador').className).toBe(chip('Borrador'));
  expect(screen.getByText('Confirmado').className).toBe(chip('Confirmado'));
  expect(screen.getByText('En producción').className).toBe(chip('En producción'));
  expect(screen.getByText('Enviado').className).toBe(chip('Enviado'));
  expect(screen.getByText('Entregado').className).toBe(chip('Entregado'));
  expect(screen.getByText('Facturado').className).toBe(chip('Facturado'));
});
