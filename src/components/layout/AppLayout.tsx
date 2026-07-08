import { TopNav } from './TopNav';
import type { ModuleHeader } from './TopNav';
import type { User } from '@/types';

export interface AppLayoutProps {
  user: User;
  children: React.ReactNode;
  module?: ModuleHeader;
}

export function AppLayout({ user, children, module }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav user={user} notificationCount={7} module={module} />
      <main className="mx-auto max-w-[1248px] px-4 py-7 xl:px-0">{children}</main>
    </div>
  );
}
