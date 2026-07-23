import { Link, NavLink } from 'react-router';
import { sidebarSections } from '../data/sidebar';

export function ConfiguracionSidebar() {
  const sections = sidebarSections();
  return (
    <aside className="w-56 shrink-0">
      <nav className="space-y-6">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{section.label}</p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <Link to={item.href} className="block rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
                      {item.label}
                    </Link>
                  ) : (
                    <NavLink
                      to={item.href}
                      end={item.href === '/configuracion'}
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-1.5 text-sm ${
                          isActive ? 'bg-slate-100 font-semibold text-slate-800' : 'text-slate-600 hover:bg-slate-50'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
