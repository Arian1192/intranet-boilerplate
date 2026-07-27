import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TypographySlider } from './TypographySlider';

describe('TypographySlider', () => {
  it('muestra label, valor entero + unidad px, y help', () => {
    render(<TypographySlider label="Tamaño del texto" value={16} unit="px" min={10} max={24} step={1} help="16 px es el tamaño normal." onChange={() => {}} />);
    expect(screen.getByText('Tamaño del texto')).toBeInTheDocument();
    expect(screen.getByText('16 px')).toBeInTheDocument();
    expect(screen.getByText('16 px es el tamaño normal.')).toBeInTheDocument();
  });

  it('muestra valor decimal con coma y unidad x', () => {
    render(<TypographySlider label="Título 1" value={1.9} unit="x" min={1} max={3} step={0.05} onChange={() => {}} />);
    expect(screen.getByText('1,90 x')).toBeInTheDocument();
  });

  it('sin unidad: solo el número con coma', () => {
    render(<TypographySlider label="Interlineado" value={1.45} unit="" min={1} max={2} step={0.05} onChange={() => {}} />);
    expect(screen.getByText('1,45')).toBeInTheDocument();
  });

  it('mover el slider dispara onChange con el valor numérico', () => {
    const onChange = vi.fn();
    render(<TypographySlider label="Aire entre párrafos" value={4} unit="px" min={0} max={16} step={1} onChange={onChange} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '8' } });
    expect(onChange).toHaveBeenCalledWith(8);
  });

  it('sin help, no revienta y no pinta párrafo de ayuda', () => {
    const { container } = render(<TypographySlider label="Título 2" value={1.5} unit="x" min={1} max={3} step={0.05} onChange={() => {}} />);
    expect(container.querySelectorAll('p')).toHaveLength(0);
  });
});
