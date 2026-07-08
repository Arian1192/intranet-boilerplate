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
              className="group grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="row-span-2 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600">
                {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
              </div>
              <h3 className="self-start font-semibold text-slate-900">{module.name}</h3>
              <p className="col-span-2 text-sm leading-relaxed text-slate-500">
                {module.shortDescription}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
