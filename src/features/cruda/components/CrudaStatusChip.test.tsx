import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import { CrudaStatusChip } from './CrudaStatusChip';

test('renders status text with the exact palette classes', () => {
  const { rerender } = render(<CrudaStatusChip status="Confirmado" />);
  expect(screen.getByText('Confirmado').className).toContain('bg-blue-100');
  expect(screen.getByText('Confirmado').className).toContain('text-blue-700');

  rerender(<CrudaStatusChip status="Enviado" />);
  expect(screen.getByText('Enviado').className).toContain('bg-indigo-100');

  rerender(<CrudaStatusChip status="Facturado" />);
  const facturado = screen.getByText('Facturado');
  expect(facturado.className).toContain('bg-emerald-600');
  expect(facturado.className).toContain('text-white');
});
