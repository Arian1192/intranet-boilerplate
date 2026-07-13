import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DocEditor } from './DocEditor';
import { docs } from '../data/seed';

vi.mock('@blocknote/react', () => ({ useCreateBlockNote: () => ({}) }));
vi.mock('@blocknote/mantine', () => ({ BlockNoteView: () => null }));

describe('DocEditor toolbar', () => {
  it('renders the title input with the doc title', () => {
    render(<DocEditor doc={docs[0]} onTitleChange={() => {}} onVisibilityChange={() => {}} />);
    expect(screen.getByDisplayValue('Bienvenido a Documentos')).toBeInTheDocument();
  });

  it('renders the visibility select with the three live options', () => {
    render(<DocEditor doc={docs[0]} onTitleChange={() => {}} onVisibilityChange={() => {}} />);
    const select = screen.getByLabelText('Visibilidad') as HTMLSelectElement;
    expect([...select.options].map((o) => o.textContent)).toEqual(['Privado', 'Compartido', 'Todo el equipo']);
  });

  it('renders the Asistente button', () => {
    render(<DocEditor doc={docs[0]} onTitleChange={() => {}} onVisibilityChange={() => {}} />);
    expect(screen.getByRole('button', { name: /Asistente/ })).toBeInTheDocument();
  });

  it('calls onTitleChange when the title is edited', () => {
    const onTitleChange = vi.fn();
    render(<DocEditor doc={docs[0]} onTitleChange={onTitleChange} onVisibilityChange={() => {}} />);
    fireEvent.change(screen.getByDisplayValue('Bienvenido a Documentos'), { target: { value: 'Hola' } });
    expect(onTitleChange).toHaveBeenCalledWith('d-welcome', 'Hola');
  });
});
