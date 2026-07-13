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

  it('shows pending tasks by default and done tasks under "Ver hechas"', () => {
    const doc = docs[0];
    const tasks = [
      { id: 't1', docId: doc.id, text: 'Pendiente A', done: false, owner: 'AC', scope: 'mias' as const },
      { id: 't2', docId: doc.id, text: 'Hecha B', done: true, owner: 'AC', scope: 'mias' as const },
    ];
    render(<TasksPanel doc={doc} tasks={tasks} />);
    expect(screen.getByText('Pendiente A')).toBeInTheDocument();
    expect(screen.queryByText('Hecha B')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ver hechas' }));
    expect(screen.getByText('Hecha B')).toBeInTheDocument();
    expect(screen.queryByText('Pendiente A')).not.toBeInTheDocument();
  });
});
