import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MiEspacioPage } from './MiEspacioPage';

// Mismo aislamiento de BlockNote que usa MiTrabajoPage.test.tsx.
vi.mock('@blocknote/react', () => ({ useCreateBlockNote: () => ({}) }));
vi.mock('@blocknote/mantine', () => ({ BlockNoteView: () => <div data-testid="bn-canvas" /> }));

const irADocumentos = () => {
  const tablist = screen.getByRole('tablist', { name: 'Secciones de Mi trabajo' });
  fireEvent.click(within(tablist).getByRole('tab', { name: 'Documentos' }));
};

describe('Pestaña Documentos — monta la Fase 7 sin tocarla', () => {
  it('no monta el editor hasta que se abre la pestaña', () => {
    render(<MiEspacioPage usuario="Test" />);
    expect(screen.queryByTestId('bn-canvas')).not.toBeInTheDocument();
    irADocumentos();
    expect(screen.getByTestId('bn-canvas')).toBeInTheDocument();
  });

  it('trae las tres columnas: árbol, editor y panel de Tareas', () => {
    render(<MiEspacioPage usuario="Test" />);
    irADocumentos();
    expect(screen.getByRole('heading', { name: 'Tareas' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bienvenido a Documentos')).toBeInTheDocument();
  });

  it('conserva las secciones del árbol del live', () => {
    render(<MiEspacioPage usuario="Test" />);
    irADocumentos();
    for (const seccion of ['PRIVADOS', 'COMPARTIDOS', 'TODO EL EQUIPO']) {
      expect(screen.getByText(seccion)).toBeInTheDocument();
    }
  });

  it('el alta de documento desde una sección sigue funcionando igual', () => {
    render(<MiEspacioPage usuario="Test" />);
    irADocumentos();
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo en PRIVADOS' }));
    expect(screen.getByDisplayValue('Sin título')).toBeInTheDocument();
  });

  it('el conmutador sigue visible dentro de la pestaña', () => {
    render(<MiEspacioPage usuario="Test" />);
    irADocumentos();
    const tablist = screen.getByRole('tablist', { name: 'Secciones de Mi trabajo' });
    expect(within(tablist).getByRole('tab', { name: 'Documentos' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    // y el saludo de cabecera no desaparece
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Test$/);
  });

  it('volver a Pendientes desmonta el editor y recupera el inbox-zero', () => {
    render(<MiEspacioPage usuario="Test" />);
    irADocumentos();
    const tablist = screen.getByRole('tablist', { name: 'Secciones de Mi trabajo' });
    fireEvent.click(within(tablist).getByRole('tab', { name: 'Pendientes' }));
    expect(screen.queryByTestId('bn-canvas')).not.toBeInTheDocument();
    expect(screen.getByText('No te toca nada ahora mismo')).toBeInTheDocument();
  });
});
