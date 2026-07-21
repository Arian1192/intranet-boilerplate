import { Avatar } from '@/components/ui';
import type { User } from '@/types';

export interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <button
      type="button"
      className="hidden items-center gap-3 rounded-lg px-2 py-1 hover:bg-slate-100 md:flex"
      aria-label={`Menú de usuario: ${user.name}`}
    >
      <div className="text-right">
        <p className="text-sm font-medium text-slate-900">{user.name}</p>
        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
      </div>
      <Avatar fallback={user.name} size="md" src={user.avatar} className="bg-slate-800" />
    </button>
  );
}
