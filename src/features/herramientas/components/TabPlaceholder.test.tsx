import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TabPlaceholder } from './TabPlaceholder';

describe('TabPlaceholder', () => {
  it('shows which phase will build this view', () => {
    render(<TabPlaceholder fase="B" />);
    expect(screen.getByText('Esta vista se construye en la Fase B.')).toBeInTheDocument();
  });
});
