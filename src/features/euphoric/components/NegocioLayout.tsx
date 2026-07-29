import { NavLink, Outlet } from 'react-router';
import { cn } from '@/lib/utils';

const views = [
  { label: 'Dirección', href: '/euphoric/negocio', end: true },
  { label: 'Pipeline', href: '/euphoric/negocio/pipeline' },
  { label: 'Presupuestos', href: '/euphoric/negocio/presupuestos' },
  { label: 'Analítica', href: '/euphoric/negocio/analitica' },
  { label: 'Tiempos', href: '/euphoric/negocio/tiempos' },
];

export function NegocioLayout() {
  return (
    <div className="space-y-6">
      <nav aria-label="Vistas de Negocio" className="flex items-center gap-1 border-b border-slate-200 pb-3">
        {views.map((view) => (
          <NavLink
            key={view.href}
            to={view.href}
            end={view.end}
            className={({ isActive }) =>
              cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                isActive ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
              )
            }
          >
            {view.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
