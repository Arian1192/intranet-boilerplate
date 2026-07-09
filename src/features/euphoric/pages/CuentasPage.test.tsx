import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { test, expect } from 'vitest';
import { CuentasPage } from './CuentasPage';

test('lists accounts and opens new-account form', async () => {
  render(
    <MemoryRouter>
      <CuentasPage />
    </MemoryRouter>
  );
  expect(screen.getByText('SIGHT')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: '+ Nueva cuenta' }));
  expect(screen.getByText('Cuenta interna del grupo (no es cliente externo)')).toBeInTheDocument();
});
