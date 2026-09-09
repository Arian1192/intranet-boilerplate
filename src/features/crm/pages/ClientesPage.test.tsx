import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ClientesPage } from './ClientesPage';
import { orgs } from '../data/seed';

describe('ClientesPage', () => {
  /*
   * Medido en el live el 2026-09-09 en `/crm` —que es la ruta de verdad; la
   * nuestra, `/crm/clientes`, cae en su catch-all—: la pantalla NO lista las
   * organizaciones de entrada. Arranca vacía, con un aviso de buscar-primero y
   * el total del CRM debajo. Antes las listábamos todas: era un fallo nuestro.
   */
  it('arranca vacía, en modo buscar-primero, con el total del CRM', () => {
    render(<ClientesPage />);
    expect(
      screen.getByText('Busca por nombre, NIF o contacto, o usa los filtros.')
    ).toBeInTheDocument();
    expect(screen.getByText(`${orgs.length} organizaciones en el CRM`)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /BMG/ })).not.toBeInTheDocument();
  });

  it('al buscar aparece la lista, y al vaciar vuelve al aviso', () => {
    render(<ClientesPage />);
    const buscador = screen.getByPlaceholderText('Buscar por empresa, NIF o contacto…');
    fireEvent.change(buscador, { target: { value: 'BMG' } });
    expect(screen.getByRole('button', { name: /BMG/ })).toBeInTheDocument();
    expect(
      screen.queryByText('Busca por nombre, NIF o contacto, o usa los filtros.')
    ).not.toBeInTheDocument();

    fireEvent.change(buscador, { target: { value: '' } });
    expect(
      screen.getByText('Busca por nombre, NIF o contacto, o usa los filtros.')
    ).toBeInTheDocument();
  });

  it('usar un filtro también puebla la lista, sin escribir nada', () => {
    render(<ClientesPage />);
    fireEvent.change(screen.getByDisplayValue('Todos'), { target: { value: 'Clientes' } });
    expect(
      screen.queryByText('Busca por nombre, NIF o contacto, o usa los filtros.')
    ).not.toBeInTheDocument();
  });

  it('el botón de alta usa la clase btn-primary, como el live', () => {
    render(<ClientesPage />);
    expect(screen.getByRole('button', { name: /Nueva organización/ })).toHaveClass('btn-primary');
  });

  it('renders header, list, empty detail, and filters by search', () => {
    render(<ClientesPage />);
    expect(screen.getByRole('heading', { name: 'Clientes', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Selecciona una organización o crea una nueva.')).toBeInTheDocument();
    // list has multiple orgs; search narrows to BMG
    fireEvent.change(screen.getByPlaceholderText('Buscar por empresa, NIF o contacto…'), {
      target: { value: 'BMG' },
    });
    expect(screen.getByRole('button', { name: /BMG/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Foot District/ })).not.toBeInTheDocument();
  });

  it('selects an org to show its detail', () => {
    render(<ClientesPage />);
    fireEvent.change(screen.getByPlaceholderText('Buscar por empresa, NIF o contacto…'), {
      target: { value: 'BMG' },
    });
    fireEvent.click(screen.getByRole('button', { name: /BMG/ }));
    expect(screen.getByRole('heading', { name: 'BMG' })).toBeInTheDocument();
    expect(screen.getByText('PERSONAS DE CONTACTO')).toBeInTheDocument();
  });

  it('opens the Nueva organización form and closes it', () => {
    render(<ClientesPage />);
    fireEvent.click(screen.getByRole('button', { name: /Nueva organización/ }));
    expect(screen.getByText('Trabaja con (empresas del grupo)')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.getByText('Selecciona una organización o crea una nueva.')).toBeInTheDocument();
  });
});
