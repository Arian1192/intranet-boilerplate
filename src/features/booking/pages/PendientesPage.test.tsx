import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PendientesPage } from './PendientesPage';

describe('PendientesPage', () => {
  it('calca cabecera y bajada del live', () => {
    render(<PendientesPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Pendientes' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Lo que te toca en ConceptOne: alertas de shows, arte por aprobar, liquidaciones y tus tareas.'
      )
    ).toBeInTheDocument();
  });

  it('pinta el inbox-zero con los dos textos literales del live', () => {
    render(<PendientesPage />);
    expect(screen.getByText('No te toca nada ahora mismo')).toBeInTheDocument();
    expect(
      screen.getByText('Ni alertas, ni creatividades, ni aprobaciones. Está todo al día.')
    ).toBeInTheDocument();
  });
});
