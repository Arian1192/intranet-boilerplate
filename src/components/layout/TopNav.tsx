import { Bell } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { UserMenu } from './UserMenu';
import { ModuleSelector } from './ModuleSelector';
import type { User } from '@/types';

export interface TopNavProps {
  user: User;
  notificationCount?: number;
}

export function TopNav({ user, notificationCount = 0 }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
            {APP_NAME.charAt(0)}
          </div>
          <span className="text-lg font-semibold text-slate-900">{APP_NAME}</span>
          <div className="hidden md:block">
            <ModuleSelector />
          </div>
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
