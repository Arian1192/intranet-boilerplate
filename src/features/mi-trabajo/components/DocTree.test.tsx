import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DocTree } from './DocTree';
import { docs } from '../data/seed';

describe('DocTree', () => {
  it('renders section titles and the welcome doc', () => {
    render(<DocTree docs={docs} selectedId={null} onSelect={() => {}} onCreate={() => {}} />);
    expect(screen.getByText('PRIVADOS')).toBeInTheDocument();
    expect(screen.getByText('COMPARTIDOS')).toBeInTheDocument();
    expect(screen.getByText('TODO EL EQUIPO')).toBeInTheDocument();
    expect(screen.getByText('Bienvenido a Documentos')).toBeInTheDocument();
  });

  it('shows "Vacío" for empty sections', () => {
    render(<DocTree docs={docs} selectedId={null} onSelect={() => {}} onCreate={() => {}} />);
    // Privados y Compartidos están vacíos en el seed
    expect(screen.getAllByText('Vacío').length).toBeGreaterThanOrEqual(2);
  });

  it('calls onSelect when a doc is clicked', () => {
    const onSelect = vi.fn();
    render(<DocTree docs={docs} selectedId={null} onSelect={onSelect} onCreate={() => {}} />);
    fireEvent.click(screen.getByText('Bienvenido a Documentos'));
    expect(onSelect).toHaveBeenCalledWith('d-welcome');
  });

  it('filters by the search box', () => {
    render(<DocTree docs={docs} selectedId={null} onSelect={() => {}} onCreate={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText('Buscar…'), { target: { value: 'rider' } });
    expect(screen.getByText('Plantilla de rider técnico')).toBeInTheDocument();
    expect(screen.queryByText('Bienvenido a Documentos')).not.toBeInTheDocument();
  });
});
