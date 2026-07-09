import { MODULE_ICONS } from '@/lib/icons';
import type { Module } from '@/types';
import { Link } from 'react-router';

export interface ModuleGridProps {
  modules: Module[];
  title: string;
}

const DEFAULT_ACCENT = '#64748B';

/** Convert a #rrggbb hex color to an rgba() string at the given alpha. */
function tint(hex: string, alpha: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function ModuleGrid({ modules, title }: ModuleGridProps) {
  return (
    <section>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = MODULE_ICONS[module.id];
          return (
            <Link key={module.id} to={`/${module.slug}`} className="block">
              <div className="flex h-full items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-lg"
                  style={{ backgroundColor: tint(module.accent ?? DEFAULT_ACCENT, 0.08) }}
                >
                  {Icon && (
                    <Icon
                      className="h-5 w-5 shrink-0 text-slate-500"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  )}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-semibold text-slate-800">{module.name}</span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                    {module.shortDescription}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
