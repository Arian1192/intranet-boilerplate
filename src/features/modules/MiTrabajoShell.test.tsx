import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { MiTrabajoShell } from './MiTrabajoShell';

vi.mock('@blocknote/react', () => ({ useCreateBlockNote: () => ({}) }));
vi.mock('@blocknote/mantine', () => ({ BlockNoteView: () => <div /> }));

describe('MiTrabajoShell', () => {
  it('renders the tab switcher inside the app layout, landing on Pendientes', () => {
    render(<MemoryRouter><MiTrabajoShell /></MemoryRouter>);
    // El live ya no aterriza en el editor: /mi-trabajo abre Pendientes.
    expect(screen.getByRole('tablist', { name: 'Secciones de Mi trabajo' })).toBeInTheDocument();
    expect(screen.getByText('No te toca nada ahora mismo')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Tareas' })).not.toBeInTheDocument();
  });
});
