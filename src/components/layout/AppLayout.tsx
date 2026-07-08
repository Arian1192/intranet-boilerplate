import { TopNav } from './TopNav';
import type { User } from '@/types';

export interface AppLayoutProps {
  user: User;
  children: React.ReactNode;
}

export function AppLayout({ user, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav user={user} notificationCount={7} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
