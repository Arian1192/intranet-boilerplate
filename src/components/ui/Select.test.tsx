import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Select } from './Select';
import { Textarea } from './Textarea';

describe('Select', () => {
  it('renders a labelled select with its options', () => {
    render(
      <Select label="Tipo" defaultValue="evento">
        <option value="prensa">Nota de prensa</option>
        <option value="evento">Evento</option>
      </Select>
    );
    expect(screen.getByText('Tipo')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('evento');
  });
});

describe('Textarea', () => {
  it('renders a labelled textarea', () => {
    render(<Textarea label="Notas" placeholder="Escribe..." />);
    expect(screen.getByText('Notas')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Escribe...')).toBeInTheDocument();
  });
});
