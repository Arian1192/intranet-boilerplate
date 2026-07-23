import type { ReactNode } from 'react';

export interface ConfigPageHeaderProps {
  title: string;
  subtitle: ReactNode;
}

export function ConfigPageHeader({ title, subtitle }: ConfigPageHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}
