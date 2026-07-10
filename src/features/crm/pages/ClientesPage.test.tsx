import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ClientesPage } from './ClientesPage';

describe('ClientesPage', () => {
  it('renders header, list, empty detail, and filters by search', () => {
    render(<ClientesPage />);
    expect(screen.getByRole('heading', { name: 'Clientes', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Selecciona una organización o crea una nueva.')).toBeInTheDocument();
    // list has multiple orgs; search narrows to BMG
    fireEvent.change(screen.getByPlaceholderText('Busca por empresa, NIF o contacto…'), { target: { value: 'BMG' } });
    expect(screen.getByRole('button', { name: /BMG/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Foot District/ })).not.toBeInTheDocument();
  });

  it('selects an org to show its detail', () => {
    render(<ClientesPage />);
    fireEvent.change(screen.getByPlaceholderText('Busca por empresa, NIF o contacto…'), { target: { value: 'BMG' } });
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
