import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UsuariosPage } from './UsuariosPage';
import { PERMISOS_PLANTILLA } from './data/usuarios';

const marcadas = () =>
  screen.getAllByRole('checkbox').filter((c) => (c as HTMLInputElement).checked);

describe('UsuariosPage — calco de /personal/usuarios', () => {
  it('trae la cabecera del live', () => {
    render(<UsuariosPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Usuarios' })).toBeInTheDocument();
    expect(
      screen.getByText('Alta, permisos y estado de los usuarios de la intranet del grupo.')
    ).toBeInTheDocument();
  });

  it('trae la fila de invitación y el checkbox de administrador', () => {
    render(<UsuariosPage />);
    expect(screen.getByPlaceholderText('email@dominio.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nombre (obligatorio)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Invitar' })).toBeInTheDocument();
    expect(screen.getByLabelText('Administrador (acceso total)')).toBeInTheDocument();
  });

  it('pinta los 4 bloques de la matriz con sus columnas', () => {
    render(<UsuariosPage />);
    for (const t of [
      'CONCEPTONE · NAVEGACIÓN',
      'CONCEPTONE · FICHA DE SHOW',
      'CONCEPTONE · FICHA DE ARTISTA',
      'CONCEPTONE · MANAGEMENT',
    ]) {
      expect(screen.getByRole('heading', { name: t })).toBeInTheDocument();
    }
    expect(screen.getAllByRole('columnheader', { name: 'Sección' })).toHaveLength(4);
  });

  it('los permisos que no aplican salen como «—», no como casilla', () => {
    render(<UsuariosPage />);
    expect(screen.getByLabelText('Dashboard · Ver')).toBeInTheDocument();
    expect(screen.queryByLabelText('Dashboard · Editar')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Eliminar shows · Editar')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Cobros · Editar')).toBeInTheDocument();
  });

  it('pinta las 11 cajas de permisos por módulo', () => {
    render(<UsuariosPage />);
    for (const t of ['ETRA AGENCY', 'TEAM · RRHH Y USUARIOS', 'MIXMAG', 'BLACK MOOSE · GRUPO']) {
      expect(screen.getByRole('heading', { name: t })).toBeInTheDocument();
    }
    expect(screen.getByLabelText('Escribir novedades del grupo')).toBeInTheDocument();
  });

  it('arranca sin ninguna casilla de permiso marcada, como el alta del live', () => {
    render(<UsuariosPage />);
    expect(marcadas()).toHaveLength(0);
  });

  it('una casilla se marca y se desmarca', () => {
    render(<UsuariosPage />);
    const cb = screen.getByLabelText('Shows · Ver');
    fireEvent.click(cb);
    expect(cb).toBeChecked();
    fireEvent.click(cb);
    expect(cb).not.toBeChecked();
  });

  it('una plantilla marca exactamente lo que marca en el live', () => {
    render(<UsuariosPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Marketing' }));
    expect(marcadas()).toHaveLength(PERMISOS_PLANTILLA['Marketing'].length);
    expect(screen.getByLabelText('Artwork · Editar')).toBeChecked();
    expect(screen.getByLabelText('Ficha artista · Editar')).toBeChecked();
  });

  it('aplicar otra plantilla REEMPLAZA la anterior, no suma', () => {
    render(<UsuariosPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Booker' }));
    expect(screen.getByLabelText('Oferta · Editar')).toBeChecked();

    fireEvent.click(screen.getByRole('button', { name: 'Marketing' }));
    // un ex-booker no se queda viendo los fees
    expect(screen.getByLabelText('Oferta · Editar')).not.toBeChecked();
    expect(marcadas()).toHaveLength(PERMISOS_PLANTILLA['Marketing'].length);
  });

  it('marcar «Administrador (acceso total)» esconde la matriz entera', () => {
    render(<UsuariosPage />);
    expect(screen.getByRole('heading', { name: 'CONCEPTONE · NAVEGACIÓN' })).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Administrador (acceso total)'));

    expect(screen.queryByRole('heading', { name: 'CONCEPTONE · NAVEGACIÓN' })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Shows · Ver')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Booker' })).not.toBeInTheDocument();
    // la tabla de cuentas sigue estando
    expect(screen.getByRole('columnheader', { name: 'Email' })).toBeInTheDocument();
  });

  it('trae el select «Copiar permisos de…» con las cuentas', () => {
    render(<UsuariosPage />);
    const select = screen.getByLabelText('Copiar permisos de…');
    expect(within(select).getByRole('option', { name: 'Carlos Pego' })).toBeInTheDocument();
  });
});

describe('UsuariosPage — tabla de cuentas', () => {
  it('lista las 20 cuentas del live con su contador', () => {
    render(<UsuariosPage />);
    expect(screen.getByText('20 usuarios')).toBeInTheDocument();
    expect(screen.getByText('maf@blackmoose.es')).toBeInTheDocument();
    expect(screen.getByText('carlos@blackmoose.es')).toBeInTheDocument();
  });

  it('avisa de la cuenta sin ficha en Team', () => {
    render(<UsuariosPage />);
    expect(screen.getByText(/1 cuenta usa la intranet sin ficha en Team/)).toBeInTheDocument();
    // el email sale dos veces: en el aviso ámbar y en su fila de la tabla
    expect(screen.getAllByText('test@blackmoose.es')).toHaveLength(2);
    expect(screen.getByText(/Créales la ficha en Team → Fichas/)).toBeInTheDocument();
  });

  it('«Reenviar» solo aparece en las cuentas pendientes', () => {
    render(<UsuariosPage />);
    expect(screen.getAllByRole('button', { name: 'Reenviar' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: 'Restablecer pwd' })).toHaveLength(20);
  });

  it('el filtro Portales deja solo las cuentas de portal', () => {
    render(<UsuariosPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Portales' }));
    expect(screen.getByText('2 usuarios')).toBeInTheDocument();
    expect(screen.getByText('gelabertalba@gmail.com')).toBeInTheDocument();
    expect(screen.queryByText('maf@blackmoose.es')).not.toBeInTheDocument();
  });

  it('el filtro Internos excluye los portales', () => {
    render(<UsuariosPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Internos' }));
    expect(screen.getByText('18 usuarios')).toBeInTheDocument();
    expect(screen.queryByText('hello@carlospego.com')).not.toBeInTheDocument();
  });

  it('«Sin vincular a Team» deja solo la cuenta huérfana', () => {
    render(<UsuariosPage />);
    fireEvent.click(screen.getByLabelText('Sin vincular a Team'));
    expect(screen.getByText('1 usuarios')).toBeInTheDocument();
    expect(screen.getAllByText('Sin ficha Team')).toHaveLength(1);
  });
});
