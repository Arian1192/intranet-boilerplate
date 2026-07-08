import { Bell } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { UserMenu } from './UserMenu';
import type { User } from '@/types';

export interface ModuleHeader {
  name: string;
  tabs?: string[];
  activeTab?: string;
}

export interface TopNavProps {
  user: User;
  notificationCount?: number;
  module?: ModuleHeader;
}

export function TopNav({ user, notificationCount = 0, module }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
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
              <span className="mr-3 text-sm font-semibold text-slate-900">{module.name}</span>
              {module.tabs?.map((tab) => {
                const isActive = tab === (module.activeTab || module.tabs?.[0]);
                return (
                  <button
                    key={tab}
                    type="button"
                    className={`rounded-lg px-3 py-2 text-sm font-normal transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
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
