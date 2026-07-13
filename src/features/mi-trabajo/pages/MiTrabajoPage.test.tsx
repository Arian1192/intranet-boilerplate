import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MiTrabajoPage } from './MiTrabajoPage';

// Aísla BlockNote para la integración (interacción real cubierta por Playwright).
vi.mock('@blocknote/react', () => ({ useCreateBlockNote: () => ({}) }));
vi.mock('@blocknote/mantine', () => ({ BlockNoteView: () => <div data-testid="bn-canvas" /> }));

describe('MiTrabajoPage', () => {
  it('renders the three columns: tree, editor toolbar, tasks', () => {
    render(<MiTrabajoPage />);
    expect(screen.getByText('Documentos')).toBeInTheDocument();       // izq
    expect(screen.getByRole('heading', { name: 'Tareas' })).toBeInTheDocument(); // der
    // editor abierto con el welcome por defecto
    expect(screen.getByDisplayValue('Bienvenido a Documentos')).toBeInTheDocument();
    expect(screen.getByTestId('bn-canvas')).toBeInTheDocument();
  });

  it('creates a new doc from a section "+" and selects it', () => {
    render(<MiTrabajoPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo en PRIVADOS' }));
    expect(screen.getByDisplayValue('Sin título')).toBeInTheDocument();
  });
});
