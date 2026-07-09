import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect } from 'vitest';
import { VariableChips } from './VariableChips';

test('adds and removes chips in local state', () => {
  render(<VariableChips label="Acabados" initial={['Algodón', 'Lino']} />);
  expect(screen.getByText('Algodón')).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText('Añadir…'), { target: { value: 'Seda' } });
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  expect(screen.getByText('Seda')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Quitar Algodón' }));
  expect(screen.queryByText('Algodón')).not.toBeInTheDocument();
});
