import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComentariosPanel } from './ComentariosPanel';

describe('ComentariosPanel', () => {
  it('estado vacío muestra el copy del live y el título', () => {
    render(<ComentariosPanel comentarios={[]} onEnviar={vi.fn()} />);
    expect(screen.getByText('Notas y comentarios')).toBeInTheDocument();
    expect(screen.getByText('Sin comentarios todavía.')).toBeInTheDocument();
  });

  it('enviar un comentario invoca onEnviar con el texto y limpia el input', () => {
    const onEnviar = vi.fn();
    render(<ComentariosPanel comentarios={[]} onEnviar={onEnviar} />);
    const ta = screen.getByPlaceholderText('Escribe un comentario…') as HTMLTextAreaElement;
    fireEvent.change(ta, { target: { value: 'Ojo con el aforo' } });
    fireEvent.click(screen.getByText('Enviar'));
    expect(onEnviar).toHaveBeenCalledWith('Ojo con el aforo');
    expect(ta.value).toBe('');
  });

  it('no envía texto vacío o solo espacios', () => {
    const onEnviar = vi.fn();
    render(<ComentariosPanel comentarios={[]} onEnviar={onEnviar} />);
    fireEvent.change(screen.getByPlaceholderText('Escribe un comentario…'), { target: { value: '   ' } });
    fireEvent.click(screen.getByText('Enviar'));
    expect(onEnviar).not.toHaveBeenCalled();
  });

  it('lista comentarios existentes (autor + texto)', () => {
    render(
      <ComentariosPanel
        comentarios={[{ id: 'c1', autor: 'Tú', texto: 'Revisar barras', fecha: '2026-07-24T10:00:00.000Z' }]}
        onEnviar={vi.fn()}
      />
    );
    expect(screen.getByText('Revisar barras')).toBeInTheDocument();
    expect(screen.getByText('Tú')).toBeInTheDocument();
    expect(screen.queryByText('Sin comentarios todavía.')).not.toBeInTheDocument();
  });
});
