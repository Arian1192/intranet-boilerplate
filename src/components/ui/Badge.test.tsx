// src/components/ui/Badge.test.tsx
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders the blue variant with the verified reference color', () => {
    render(<Badge variant="blue">Confirmado</Badge>);
    expect(screen.getByText('Confirmado')).toHaveClass('bg-blue-100', 'text-blue-700');
  });

  it('renders the amber variant', () => {
    render(<Badge variant="amber">En producción</Badge>);
    expect(screen.getByText('En producción')).toHaveClass('bg-amber-100', 'text-amber-700');
  });

  it('renders the fuchsia variant at small size', () => {
    render(<Badge variant="fuchsia" size="sm">Promotor</Badge>);
    expect(screen.getByText('Promotor')).toHaveClass('bg-fuchsia-100', 'text-fuchsia-700', 'text-[10px]');
  });

  it('renders the emerald variant', () => {
    render(<Badge variant="emerald">Activa</Badge>);
    expect(screen.getByText('Activa')).toHaveClass('bg-emerald-100', 'text-emerald-700');
  });

  it('still renders existing variants unchanged', () => {
    render(<Badge variant="warning">Legacy</Badge>);
    expect(screen.getByText('Legacy')).toHaveClass('bg-yellow-50', 'text-yellow-700');
  });

  it('renders the sky and pink variants', () => {
    render(
      <>
        <Badge variant="sky">Envío MRW</Badge>
        <Badge variant="pink" size="sm">IG · 245K</Badge>
      </>
    );
    expect(screen.getByText('Envío MRW')).toHaveClass('bg-sky-100', 'text-sky-700');
    expect(screen.getByText('IG · 245K')).toHaveClass('bg-pink-50', 'text-pink-600');
  });
});
