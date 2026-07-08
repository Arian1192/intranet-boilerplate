import { MODULE_ICONS } from '@/lib/icons';
import type { Module } from '@/types';
import { Link } from 'react-router';

export interface ModuleGridProps {
  modules: Module[];
  title: string;
}

export function ModuleGrid({ modules, title }: ModuleGridProps) {
  return (
    <section>
      <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = MODULE_ICONS[module.id];
          return (
            <Link
              key={module.id}
              to={`/${module.slug}`}
              className="group block h-full rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                {Icon && <Icon className="h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />}
                <span className="font-semibold text-slate-800">{module.name}</span>
              </div>
              <p className="mt-1 text-sm leading-snug text-slate-500">{module.shortDescription}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
