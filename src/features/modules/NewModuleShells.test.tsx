import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { MixmagShell } from './MixmagShell';
import { TagmagShell } from './TagmagShell';
import { HerramientasShell } from './HerramientasShell';

describe('Nuevos shells stub', () => {
  it.each([
    [MixmagShell, 'Mixmag'],
    [TagmagShell, 'TAGMAG'],
    [HerramientasShell, 'Herramientas'],
  ])('%s renderiza su título', (Shell, title) => {
    render(<MemoryRouter><Shell /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
  });
});
