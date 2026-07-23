import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IncidentCountPill } from './IncidentCountPill';

describe('IncidentCountPill', () => {
  it('con count>0 y tone coloreado: chip con color y número oscuro', () => {
    const { container } = render(<IncidentCountPill label="RESUELTAS" count={2} tone="emerald" />);
    expect(screen.getByText('RESUELTAS')).toHaveClass('bg-emerald-100');
    expect(screen.getByText('2')).toHaveClass('text-slate-800');
    expect(container.firstChild).not.toHaveClass('opacity-60');
  });

  it('con count=0 (EN CURSO): se atenúa visualmente, aunque el tone sea neutral', () => {
    const { container } = render(<IncidentCountPill label="EN CURSO" count={0} tone="neutral" />);
    expect(screen.getByText('0')).toHaveClass('text-slate-300');
    expect(container.firstChild).toHaveClass('opacity-60');
  });

  it('DESCARTADAS con count>0 y tone neutral: no se atenúa aunque el label no lleve chip de color', () => {
    const { container } = render(<IncidentCountPill label="DESCARTADAS" count={4} tone="neutral" />);
    expect(container.firstChild).not.toHaveClass('opacity-60');
    expect(screen.getByText('4')).toHaveClass('text-slate-800');
  });
});
