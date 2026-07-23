import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CollapsibleSection } from './CollapsibleSection';

describe('CollapsibleSection', () => {
  it('arranca colapsado por defecto, muestra el resumen, y expande al clicar el título', async () => {
    render(
      <CollapsibleSection title="Ajustes de escenarios y breakeven" summary="Base 75% · BE 77%">
        <p>contenido interior</p>
      </CollapsibleSection>
    );
    expect(screen.getByText('Base 75% · BE 77%')).toBeInTheDocument();
    expect(screen.queryByText('contenido interior')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Ajustes de escenarios y breakeven/ }));
    expect(screen.getByText('contenido interior')).toBeInTheDocument();
  });

  it('defaultOpen=true arranca expandido', () => {
    render(<CollapsibleSection title="X">contenido</CollapsibleSection>);
    expect(screen.queryByText('contenido')).not.toBeInTheDocument();
  });

  it('defaultOpen=true arranca expandido de verdad', () => {
    render(<CollapsibleSection title="X" defaultOpen>contenido</CollapsibleSection>);
    expect(screen.getByText('contenido')).toBeInTheDocument();
  });
});
