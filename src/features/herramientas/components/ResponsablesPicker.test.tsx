import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResponsablesPicker } from './ResponsablesPicker';
import { personasDisponibles, buscarPersonas } from '../data/personas';

describe('personas (evidencia del live)', () => {
  it('siembra la lista exacta del desplegable del live, en orden', () => {
    expect(personasDisponibles.map((p) => p.nombre)).toEqual([
      'Alba Gelabert', 'Alberto Egea', 'Aldo Messina', 'Alex González', 'Carlos Pego',
      'Fran Hinojosa Veredas', 'Israel Cuenca', 'Jack Howell', 'Jassi Gonzalez Montes',
      'Joe Coe', 'Juan (Staff Level Test)', 'Oscar Buch', 'Patricia Pareja Casalí',
      'Sadkiel', 'test', 'Tony Carrerira', 'Yenifer Bernardo',
    ]);
  });
  it('Jack Howell y Tony Carrerira usan los ids del seed (para marcarse asignados)', () => {
    expect(personasDisponibles.find((p) => p.nombre === 'Jack Howell')?.id).toBe('resp-jack');
    expect(personasDisponibles.find((p) => p.nombre === 'Tony Carrerira')?.id).toBe('resp-tony');
  });
  it('buscarPersonas filtra por nombre (case-insensitive)', () => {
    expect(buscarPersonas('alba').map((p) => p.nombre)).toEqual(['Alba Gelabert']);
    expect(buscarPersonas('').length).toBe(personasDisponibles.length);
  });
});

describe('ResponsablesPicker', () => {
  const asignados = [{ id: 'resp-jack', nombre: 'Jack', iniciales: 'JH' }];

  it('lista personas, filtra por buscador y añade al hacer clic en una libre', () => {
    const onAdd = vi.fn();
    render(<ResponsablesPicker asignados={asignados} onAdd={onAdd} onClose={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText('Buscar persona…'), { target: { value: 'Alba' } });
    fireEvent.click(screen.getByText('Alba Gelabert'));
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ nombre: 'Alba Gelabert' }));
  });

  it('marca los ya asignados y no los vuelve a añadir', () => {
    const onAdd = vi.fn();
    render(<ResponsablesPicker asignados={asignados} onAdd={onAdd} onClose={vi.fn()} />);
    // Jack Howell (id resp-jack) está asignado → muestra ✓ y no dispara onAdd
    const jack = screen.getByText('Jack Howell').closest('button')!;
    expect(jack).toHaveTextContent('✓');
    fireEvent.click(jack);
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('Escape cierra el picker', () => {
    const onClose = vi.fn();
    render(<ResponsablesPicker asignados={asignados} onAdd={vi.fn()} onClose={onClose} />);
    fireEvent.keyDown(screen.getByPlaceholderText('Buscar persona…'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
