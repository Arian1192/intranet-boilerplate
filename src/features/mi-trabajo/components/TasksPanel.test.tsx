import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TasksPanel } from './TasksPanel';
import { docs } from '../data/seed';

describe('TasksPanel', () => {
  it('renders the "de este documento" card and the tabs', () => {
    render(<TasksPanel doc={docs[0]} tasks={[]} />);
    expect(screen.getByRole('heading', { name: 'Tareas' })).toBeInTheDocument();
    expect(screen.getByText('DE ESTE DOCUMENTO')).toBeInTheDocument();
    ['Mías', 'Creadas', 'Todas', 'Ver hechas'].forEach((t) =>
      expect(screen.getByText(t)).toBeInTheDocument()
    );
  });

  it('shows the empty state and the add input', () => {
    render(<TasksPanel doc={docs[0]} tasks={[]} />);
    expect(screen.getByText('Nada pendiente. 🎉')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tarea de este documento…')).toBeInTheDocument();
  });

  it('switches the active tab on click', () => {
    render(<TasksPanel doc={docs[0]} tasks={[]} />);
    const todas = screen.getByRole('button', { name: 'Todas' });
    fireEvent.click(todas);
    expect(todas).toHaveAttribute('aria-pressed', 'true');
  });
});
