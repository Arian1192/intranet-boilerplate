import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConfigPageHeader } from './ConfigPageHeader';

describe('ConfigPageHeader', () => {
  it('renderiza título (h1) y subtítulo string', () => {
    render(<ConfigPageHeader title="Uso del sistema" subtitle="Qué integraciones funcionan." />);
    expect(screen.getByRole('heading', { level: 1, name: 'Uso del sistema' })).toBeInTheDocument();
    expect(screen.getByText('Qué integraciones funcionan.')).toBeInTheDocument();
  });

  it('acepta subtítulo con nodos (negritas embebidas)', () => {
    render(
      <ConfigPageHeader
        title="Festivos"
        subtitle={<><strong>Se descuentan</strong> de las vacaciones.</>}
      />
    );
    expect(screen.getByText('Se descuentan')).toBeInTheDocument();
    expect(screen.getByText('Se descuentan').tagName).toBe('STRONG');
  });
});
