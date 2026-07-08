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
              className="group block rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600">
                {Icon && <Icon className="h-5 w-5" />}
              </div>
              <h3 className="mb-1 font-semibold text-slate-900">{module.name}</h3>
              <p className="text-sm leading-relaxed text-slate-500">
                {module.shortDescription}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
