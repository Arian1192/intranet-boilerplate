import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router';
import { FichasPage } from './FichasPage';

function renderPage(initialEntry = '/personal/fichas') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/personal/fichas" element={<FichasPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('FichasPage', () => {
  it('renders heading and export button', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Fichas del equipo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Exportar a Excel/ })).toBeInTheDocument();
  });

  it('filters by type', async () => {
    renderPage();
    const selects = screen.getAllByRole('combobox');
    await userEvent.selectOptions(selects[1], 'contratado');
    expect(screen.getAllByText(/Contratado/).length).toBeGreaterThan(0);
  });

  it('selects a person via ?p=', () => {
    renderPage('/personal/fichas?p=alba-gelabert');
    expect(screen.getByRole('heading', { name: 'Alba Gelabert' })).toBeInTheDocument();
    expect(screen.getByText('Con cuenta')).toBeInTheDocument();
  });

  it('renders cost dashboard total', () => {
    renderPage();
    expect(screen.getByText(/34\.522,07\s*€/)).toBeInTheDocument();
  });
});
