import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IncidenciaAvatar } from './IncidenciaAvatar';

describe('IncidenciaAvatar', () => {
  it('muestra iniciales blancas sobre el color del reportante', () => {
    render(
      <IncidenciaAvatar reporterName="Fran Hinojosa Veredas" reporterInitials="FV" reporterColor="#EA580C" />
    );
    const avatar = screen.getByLabelText('Fran Hinojosa Veredas');
    expect(avatar).toHaveTextContent('FV');
    expect(avatar).toHaveStyle({ backgroundColor: '#EA580C' });
  });

  it('fallback a silueta gris genérica con aria-label "Reportante desconocido" cuando no hay identidad', () => {
    render(<IncidenciaAvatar />);
    const avatar = screen.getByLabelText('Reportante desconocido');
    expect(avatar).toHaveClass('bg-slate-200');
    expect(avatar.querySelector('svg')).not.toBeNull();
    expect(avatar).not.toHaveTextContent(/./);
  });
});
