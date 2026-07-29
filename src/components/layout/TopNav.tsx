import { Bell, Briefcase } from 'lucide-react';
import { Link, NavLink } from 'react-router';
import { APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { UserMenu } from './UserMenu';
import { EspaciosDropdown } from './EspaciosDropdown';
import type { User } from '@/types';
import type { LucideIcon } from 'lucide-react';

export interface ModuleNavItem {
  label: string;
  href: string;
}

/**
 * Navegación de dos niveles: áreas del módulo en la barra superior y secciones
 * en una segunda barra. El estado activo lo decide quien la usa (el shell del
 * módulo), porque un área puede estar activa en rutas distintas a su href.
 */
export interface ModuleNav {
  areas: ModuleNavItem[];
  activeArea?: string | null;
  sections?: ModuleNavItem[];
  activeSection?: string | null;
}

export interface ModuleHeader {
  name: string;
  href?: string;
  tabs?: { label: string; href: string }[];
  nav?: ModuleNav;
  actionLabel?: string;
  iconActions?: { icon: LucideIcon; href: string; label: string }[];
}

export interface TopNavProps {
  user: User;
  notificationCount?: number;
  module?: ModuleHeader;
}

export function TopNav({ user, notificationCount = 0, module }: TopNavProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-white">
              {APP_NAME.charAt(0)}
            </div>
            <span className="text-lg font-semibold text-slate-900">{APP_NAME}</span>
          </Link>
          <span className="hidden items-center gap-2 sm:flex">
            <span className="text-slate-300">/</span>
            <EspaciosDropdown />
          </span>

          {module && (
            <nav className="hidden items-center gap-1 md:flex" aria-label={`Pestañas de ${module.name}`}>
              <span className="mr-2 text-sm font-semibold text-slate-400">/</span>
              {module.href ? (
                <Link to={module.href} className="mr-3 text-sm font-semibold text-slate-900 hover:text-slate-700">
                  {module.name}
                </Link>
              ) : (
                <span className="mr-3 text-sm font-semibold text-slate-900">{module.name}</span>
              )}
              {module.tabs?.map((tab) => (
                <NavLink
                  key={tab.href}
                  to={tab.href}
                  end={tab.href === '/conceptone' || tab.href === module.href}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-100'
                    )
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
              {module.nav?.areas.map((area) => {
                const isActive = module.nav?.activeArea === area.label;
                return (
                  <Link
                    key={area.href}
                    to={area.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                      isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100'
                    )}
                  >
                    {area.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div className="ml-auto flex items-center gap-3">
          {module?.actionLabel && (
            <button
              type="button"
              className="hidden h-9 items-center rounded-lg bg-slate-800 px-4 text-sm font-semibold text-white hover:bg-slate-900 md:inline-flex"
            >
              {module.actionLabel}
            </button>
          )}
          {module?.iconActions?.map((iconAction) => (
            <NavLink
              key={iconAction.href}
              to={iconAction.href}
              aria-label={iconAction.label}
              className={({ isActive }) =>
                cn(
                  'grid h-9 w-9 place-items-center rounded-lg transition-colors',
                  isActive ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-100'
                )
              }
            >
              <iconAction.icon className="h-5 w-5" />
            </NavLink>
          ))}
          <Link
            to="/mi-trabajo"
            aria-label="Mi trabajo"
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <Briefcase className="h-5 w-5" />
          </Link>
          <button
            type="button"
            className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
          <UserMenu user={user} />
        </div>
      </div>

      {module?.nav?.sections && (
        <div className="border-t border-slate-200">
          <nav
            className="mx-auto flex h-11 max-w-7xl items-center gap-1 px-4"
            aria-label={`Secciones de ${module.name}`}
          >
            {module.nav.sections.map((section) => {
              const isActive = module.nav?.activeSection === section.label;
              return (
                <Link
                  key={section.href}
                  to={section.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#44444C] text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  {section.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
