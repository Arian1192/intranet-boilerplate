import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CalendarioPage } from './CalendarioPage';

describe('CalendarioPage', () => {
  it('muestra header, subtítulo, "+ Hold", julio 2026 por defecto y un chip', () => {
    render(<CalendarioPage />);
    expect(screen.getByRole('heading', { name: 'Calendario' })).toBeInTheDocument();
    expect(
      screen.getByText('Shows y holds de artista en un solo sitio. Un hold puede subir a show sin duplicar.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Hold' })).toBeInTheDocument();
    expect(screen.getByText('Julio 2026')).toBeInTheDocument();
    expect(screen.getByText(/Bizza · Illes Balears/)).toBeInTheDocument();
  });

  it('navega a agosto con "siguiente" y muestra un evento de agosto', () => {
    render(<CalendarioPage />);
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));
    expect(screen.getByText('Agosto 2026')).toBeInTheDocument();
    expect(screen.getByText(/Milan · Isla Santa Catalina/)).toBeInTheDocument();
    // volver a julio
    fireEvent.click(screen.getByRole('button', { name: /anterior/i }));
    expect(screen.getByText('Julio 2026')).toBeInTheDocument();
  });
});
