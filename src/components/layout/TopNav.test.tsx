import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { BarChart2, Users } from 'lucide-react';
import { test, expect, it } from 'vitest';
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

test('renders iconActions links in order when provided', () => {
  renderNav({
    name: 'Euphoric Media',
    iconActions: [
      { icon: Users, href: '/euphoric/artistas', label: 'Artistas' },
      { icon: BarChart2, href: '/euphoric/analitica', label: 'Analítica' },
    ],
  });
  const links = screen.getAllByRole('link', { name: /Artistas|Analítica/ });
  expect(links.map((link) => link.getAttribute('aria-label'))).toEqual(['Artistas', 'Analítica']);
  expect(screen.getByRole('link', { name: 'Artistas' })).toHaveAttribute('href', '/euphoric/artistas');
  expect(screen.getByRole('link', { name: 'Analítica' })).toHaveAttribute('href', '/euphoric/analitica');
});

test('omits iconActions links when not provided', () => {
  renderNav({ name: 'ConceptOne' });
  expect(screen.queryByRole('link', { name: 'Analítica' })).toBeNull();
  expect(screen.queryByRole('link', { name: 'Artistas' })).toBeNull();
});

it('muestra el dropdown Espacios y el badge 9+ sin acentos brand', () => {
  const { container } = render(
    <MemoryRouter>
      <TopNav user={{ id: '1', email: 'a@b.c', name: 'Test', role: 'Admin' }} notificationCount={12} />
    </MemoryRouter>
  );
  expect(screen.getByRole('button', { name: /Espacios/ })).toBeInTheDocument();
  expect(screen.getByText('9+')).toBeInTheDocument();
  expect(container.innerHTML).not.toMatch(/brand-/);
});
