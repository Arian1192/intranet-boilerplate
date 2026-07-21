import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { RepositoryProvider, MockRepository } from '@/repositories';
import { DashboardPage } from './DashboardPage';

function renderHome() {
  return render(
    <RepositoryProvider repository={new MockRepository()}>
      <MemoryRouter><DashboardPage /></MemoryRouter>
    </RepositoryProvider>
  );
}

describe('DashboardPage (home v2)', () => {
  it('muestra hero con festivo y clima, los 3 grupos, inbox-zero y novedades', async () => {
    renderHome();
    expect(await screen.findByRole('heading', { name: /Hola, Test/ })).toBeInTheDocument();
    expect(screen.getByText(/festivo/i)).toBeInTheDocument();
    expect(screen.getByText(/Barcelona/)).toBeInTheDocument();
    expect(screen.getByText('Espacios de trabajo')).toBeInTheDocument();
    expect(screen.getByText('Gestión interna')).toBeInTheDocument();
    expect(screen.getByText('Herramientas y ajustes')).toBeInTheDocument();
    expect(screen.getByText('No te toca nada ahora mismo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Mixmag/ })).toHaveAttribute('href', '/mixmag');
  });
});
