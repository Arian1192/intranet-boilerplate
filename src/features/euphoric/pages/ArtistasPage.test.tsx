import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { test, expect } from 'vitest';
import { ArtistasPage } from './ArtistasPage';

test('lists artists with kind badges', () => {
  render(
    <MemoryRouter>
      <ArtistasPage />
    </MemoryRouter>
  );
  expect(screen.getByText('Nicole Moudaber')).toBeInTheDocument();
  const row = screen.getByText('Nicole Moudaber').closest('button');
  expect(row).not.toBeNull();
  expect(row?.textContent).toContain('Externo');
});

test('opens new-artist form with social links section', async () => {
  render(
    <MemoryRouter>
      <ArtistasPage />
    </MemoryRouter>
  );
  await userEvent.click(screen.getByRole('button', { name: '+ Nuevo artista' }));
  expect(screen.getByText('Redes (URL)')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Instagram')).toBeInTheDocument();
});
