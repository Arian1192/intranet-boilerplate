import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { MiTrabajoShell } from './MiTrabajoShell';

vi.mock('@blocknote/react', () => ({ useCreateBlockNote: () => ({}) }));
vi.mock('@blocknote/mantine', () => ({ BlockNoteView: () => <div /> }));

describe('MiTrabajoShell', () => {
  it('renders the page inside the app layout', () => {
    render(<MemoryRouter><MiTrabajoShell /></MemoryRouter>);
    expect(screen.getByText('Documentos')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tareas' })).toBeInTheDocument();
  });
});
