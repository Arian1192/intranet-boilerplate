import { Bell } from 'lucide-react';
import { Link, NavLink } from 'react-router';
import { APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { UserMenu } from './UserMenu';
import type { User } from '@/types';

export interface ModuleHeader {
  name: string;
  href?: string;
  tabs?: { label: string; href: string }[];
  actionLabel?: string;
}

export interface TopNavProps {
  user: User;
  notificationCount?: number;
  module?: ModuleHeader;
}

export function TopNav({ user, notificationCount = 0, module }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1248px] items-center justify-between px-4 xl:px-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
              {APP_NAME.charAt(0)}
            </div>
            <span className="text-lg font-medium text-slate-900">{APP_NAME}</span>
          </div>

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
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    )
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {module?.actionLabel && (
            <button
              type="button"
              className="hidden h-9 items-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white shadow-md shadow-brand-600/20 hover:bg-brand-700 md:inline-flex"
            >
              {module.actionLabel}
            </button>
          )}
          <button
            type="button"
            className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                {notificationCount}
              </span>
            )}
          </button>
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
