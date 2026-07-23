import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContractTemplateRow } from './ContractTemplateRow';
import { contractTemplates } from '../data/contratos';

describe('ContractTemplateRow', () => {
  it('muestra nombre, chip de idioma y descripción', () => {
    render(<ContractTemplateRow template={contractTemplates()[0]} />);
    expect(screen.getByText('Contrato estándar (ES)')).toBeInTheDocument();
    expect(screen.getByText('ES')).toBeInTheDocument();
    expect(screen.getByText('Plantilla base de actuación en español.')).toBeInTheDocument();
  });

  it('Editar y ✕ son inertes (type=button)', () => {
    render(<ContractTemplateRow template={contractTemplates()[1]} />);
    expect(screen.getByRole('button', { name: 'Editar' })).toHaveAttribute('type', 'button');
    expect(screen.getByRole('button', { name: /Eliminar/ })).toHaveAttribute('type', 'button');
  });
});
