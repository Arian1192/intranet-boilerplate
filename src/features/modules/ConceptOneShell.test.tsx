import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { ConceptOneShell } from './ConceptOneShell';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ConceptOneShell />
    </MemoryRouter>
  );
}

describe('ConceptOneShell — navegación de 2 niveles', () => {
  it('muestra el nombre del módulo y las 4 áreas de nivel 1', () => {
    renderAt('/conceptone');
    expect(screen.getByText('ConceptOne')).toBeInTheDocument();
    for (const [label, href] of [
      ['Bookings', '/conceptone'],
      ['Management', '/management/estrategias'],
      ['Calendario', '/calendario-c1'],
      ['Contactos', '/contactos'],
    ]) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', href);
    }
  });

  it('muestra las 6 secciones de Bookings con sus hrefs', () => {
    renderAt('/conceptone');
    const secciones = screen.getByRole('navigation', { name: 'Secciones de ConceptOne' });
    for (const [label, href] of [
      ['Dashboard', '/conceptone'],
      ['Shows', '/shows'],
      ['Ofertas', '/ofertas'],
      ['Cobros', '/cobros'],
      ['Gastos', '/gastos'],
      ['Disponibilidad', '/disponibilidad'],
    ]) {
      const link = within(secciones).getByRole('link', { name: label });
      expect(link).toHaveAttribute('href', href);
    }
  });

  it('mantiene Bookings activa en cualquier sección y marca la sección actual', () => {
    renderAt('/cobros');
    expect(screen.getByRole('link', { name: 'Bookings' })).toHaveAttribute('aria-current', 'page');
    const secciones = screen.getByRole('navigation', { name: 'Secciones de ConceptOne' });
    expect(within(secciones).getByRole('link', { name: 'Cobros' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(within(secciones).getByRole('link', { name: 'Gastos' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('oculta la barra de secciones fuera de Bookings', () => {
    renderAt('/management/estrategias');
    expect(screen.queryByRole('navigation', { name: 'Secciones de ConceptOne' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Ofertas' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Management' })).toHaveAttribute('aria-current', 'page');
  });

  it.each([
    ['/calendario-c1', 'Calendario'],
    ['/contactos', 'Contactos'],
  ])('%s activa el área %s sin sub-nav', (path, area) => {
    renderAt(path);
    expect(screen.getByRole('link', { name: area })).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('navigation', { name: 'Secciones de ConceptOne' })).toBeNull();
  });

  it('conserva el botón + Añadir show', () => {
    renderAt('/conceptone');
    expect(screen.getByRole('button', { name: '+ Añadir show' })).toBeInTheDocument();
  });
});
