import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { BarChart2 } from 'lucide-react';
import { test, expect } from 'vitest';
import { TopNav } from './TopNav';
import type { User } from '@/types';

const user: User = { id: '1', email: 't@e.com', name: 'Test', role: 'Admin' };

function renderNav(module?: Parameters<typeof TopNav>[0]['module']) {
  return render(
    <MemoryRouter>
      <TopNav user={user} module={module} />
    </MemoryRouter>
  );
}

test('renders iconAction link when provided', () => {
  renderNav({ name: 'Euphoric Media', iconAction: { icon: BarChart2, href: '/euphoric/analitica', label: 'Analítica' } });
  const link = screen.getByRole('link', { name: 'Analítica' });
  expect(link).toHaveAttribute('href', '/euphoric/analitica');
});

test('omits iconAction link when not provided', () => {
  renderNav({ name: 'ConceptOne' });
  expect(screen.queryByRole('link', { name: 'Analítica' })).toBeNull();
});
