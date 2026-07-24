import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContactosPage } from './ContactosPage';

describe('ContactosPage', () => {
  it('sub-tabs; Venues (18) con buscador; Empresas (117)', () => {
    render(<ContactosPage />);
    expect(screen.getByText('Venues y empresas con las que trabaja ConceptOne.')).toBeInTheDocument();

    // Venues por defecto: Casa del Mar muestra "Aforo 600" y NO "Ubicado"
    const casa = within(screen.getByRole('group', { name: 'Casa del Mar' }));
    expect(casa.getByText('Aforo 600')).toBeInTheDocument();
    expect(casa.queryByText(/Ubicado/)).not.toBeInTheDocument();
    // La Fábrica: sin badges ni ciudad
    const fab = within(screen.getByRole('group', { name: 'La Fábrica' }));
    expect(fab.queryByText(/Ubicado/)).not.toBeInTheDocument();
    expect(fab.queryByText(/Aforo/)).not.toBeInTheDocument();

    // buscador funcional (por ciudad)
    fireEvent.change(screen.getByPlaceholderText('Buscar venue o ciudad…'), { target: { value: 'Valencia' } });
    expect(screen.getByText('Marina Beach Club')).toBeInTheDocument();
    expect(screen.queryByText('Casa del Mar')).not.toBeInTheDocument();

    // sub-tab Empresas
    fireEvent.click(screen.getByRole('button', { name: 'Empresas y contactos' }));
    expect(screen.getByText('BAN MUSIC WORLDWIDE SL')).toBeInTheDocument();
    expect(screen.getAllByText(/Sin datos de contacto/).length).toBeGreaterThan(0);
    expect(screen.getByText('1A PROJECTS 1802 SL')).toBeInTheDocument();
    // 117 filas
    expect(screen.getAllByRole('listitem')).toHaveLength(117);
  });
});
