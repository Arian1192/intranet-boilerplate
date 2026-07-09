import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { test, expect } from 'vitest';
import { EventosPage } from './EventosPage';

test('lists events and opens the new-event form', async () => {
  render(
    <MemoryRouter>
      <EventosPage />
    </MemoryRouter>
  );
  expect(screen.getByText('Please Quiet x SIGHT')).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: '+ Nuevo evento' }));
  expect(screen.getByText('La produce Black Moose')).toBeInTheDocument();
});
