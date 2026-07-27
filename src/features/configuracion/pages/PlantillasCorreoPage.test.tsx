import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlantillasCorreoPage } from './PlantillasCorreoPage';

const flush = () => new Promise((r) => setTimeout(r, 50));

describe('PlantillasCorreoPage', () => {
  it('renderiza título, las 6 plantillas y el pie de página', async () => {
    render(<PlantillasCorreoPage />);
    await flush();
    expect(screen.getByRole('heading', { level: 1, name: 'Plantillas de correo' })).toBeInTheDocument();
    ['invitacion_portal', 'invitacion_usuario', 'liquidacion_show', 'reset_password', 'vacaciones_aprobada', 'vacaciones_rechazada'].forEach((slug) =>
      expect(screen.getByText(slug)).toBeInTheDocument()
    );
    expect(screen.getByText(/no-reply@blackmoose\.es/)).toBeInTheDocument();
  });
});
