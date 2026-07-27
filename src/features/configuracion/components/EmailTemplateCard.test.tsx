import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmailTemplateCard } from './EmailTemplateCard';
import { templates } from '../data/plantillasCorreo';

const flush = () => new Promise((r) => setTimeout(r, 50));
const template = templates()[0]; // invitacion_portal

describe('EmailTemplateCard', () => {
  it('muestra título, descripción, slug y campos con los valores del seed', async () => {
    render(<EmailTemplateCard template={template} />);
    await flush();
    expect(screen.getByText('Bienvenida — portal de cliente')).toBeInTheDocument();
    expect(screen.getByText('Invitación a un cliente al portal de reposiciones (CRUDA).')).toBeInTheDocument();
    expect(screen.getByText('invitacion_portal')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Acceso a tu portal de cliente · CRUDA by Black Moose Group')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Crear mi contraseña')).toBeInTheDocument();
    expect(screen.getByDisplayValue('{{link}}')).toBeInTheDocument();
    expect(screen.getByText('{{nombre}}')).toBeInTheDocument();
  });

  it('Guardar arranca deshabilitado con "Sin cambios"; editar Asunto lo habilita y cambia el texto', async () => {
    render(<EmailTemplateCard template={template} />);
    await flush();
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeDisabled();
    expect(screen.getByText('Sin cambios')).toBeInTheDocument();

    await userEvent.type(screen.getByDisplayValue('Acceso a tu portal de cliente · CRUDA by Black Moose Group'), '!');

    expect(screen.getByRole('button', { name: 'Guardar' })).toBeEnabled();
    expect(screen.getByText('Cambios sin guardar')).toBeInTheDocument();
  });

  it('Editar y Vista previa son inertes (type=button, sin acción real)', async () => {
    render(<EmailTemplateCard template={template} />);
    await flush();
    expect(screen.getByRole('button', { name: 'Editar' })).toHaveAttribute('type', 'button');
    expect(screen.getByRole('button', { name: 'Vista previa' })).toHaveAttribute('type', 'button');
  });
});
