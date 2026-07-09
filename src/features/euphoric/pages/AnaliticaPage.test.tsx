import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, test } from 'vitest';
import { AnaliticaPage } from './AnaliticaPage';

describe('AnaliticaPage', () => {
  test('renders analytics KPIs and tables', () => {
    render(
      <MemoryRouter>
        <AnaliticaPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Analítica' })).toBeInTheDocument();
    expect(screen.getByText('MRR (RETAINERS ACTIVOS)')).toBeInTheDocument();
    expect(screen.getAllByText('800,00 €').length).toBeGreaterThan(0);
    expect(screen.getByText('CONTENIDO POR CANAL')).toBeInTheDocument();
  });
});
