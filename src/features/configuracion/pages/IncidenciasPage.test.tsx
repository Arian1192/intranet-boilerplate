import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IncidenciasPage } from './IncidenciasPage';

describe('IncidenciasPage', () => {
  it('título, 5 contadores exactos (1/1/0/2/4) y 8 filas', () => {
    render(<IncidenciasPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Incidencias' })).toBeInTheDocument();
    expect(screen.getAllByText('NUEVAS')[0].nextSibling?.textContent).toBe('1');
    expect(screen.getAllByText('AUTO')[0].nextSibling?.textContent).toBe('1');
    expect(screen.getAllByText('EN CURSO')[0].nextSibling?.textContent).toBe('0');
    expect(screen.getAllByText('RESUELTAS')[0].nextSibling?.textContent).toBe('2');
    expect(screen.getAllByText('DESCARTADAS')[0].nextSibling?.textContent).toBe('4');
    expect(screen.getAllByText('Idea')).toHaveLength(8);
  });

  it('no usa clases brand-*', () => {
    const { container } = render(<IncidenciasPage />);
    expect(container.querySelector('[class*="brand-"]')).toBeNull();
  });
});
