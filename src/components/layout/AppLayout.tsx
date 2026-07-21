import { TopNav } from './TopNav';
import { HelpPanel } from './HelpPanel';
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
      <TopNav user={user} notificationCount={12} module={module} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">{children}</main>
      <HelpPanel />
    </div>
  );
}
