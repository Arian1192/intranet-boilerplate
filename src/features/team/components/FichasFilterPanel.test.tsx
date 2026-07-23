import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FichasFilterPanel } from './FichasFilterPanel';

describe('FichasFilterPanel', () => {
  it('calls onCompany and onType', async () => {
    const onCompany = vi.fn();
    const onType = vi.fn();
    render(<FichasFilterPanel companyId="todas" onCompany={onCompany} type="todos" onType={onType} />);
    const [companySelect, typeSelect] = screen.getAllByRole('combobox');
    await userEvent.selectOptions(companySelect, 'conceptone');
    expect(onCompany).toHaveBeenCalledWith('conceptone');
    await userEvent.selectOptions(typeSelect, 'contratado');
    expect(onType).toHaveBeenCalledWith('contratado');
  });

  it('new person button is inert', () => {
    render(<FichasFilterPanel companyId="todas" onCompany={() => {}} type="todos" onType={() => {}} />);
    expect(screen.getByRole('button', { name: /Nueva persona/ })).toHaveAttribute('type', 'button');
  });
});
