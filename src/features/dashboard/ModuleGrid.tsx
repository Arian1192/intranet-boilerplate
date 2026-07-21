import { MODULE_ICONS } from '@/lib/icons';
import type { Module } from '@/types';
import { Link } from 'react-router';

export interface ModuleGridProps {
  modules: Module[];
  title: string;
}

const DEFAULT_ACCENT = '#64748B';

/** Convert a #rrggbb hex color to an rgba() string at the given alpha. */
export function tint(hex: string, alpha: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function ModuleGrid({ modules, title }: ModuleGridProps) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2">
        {modules.map((module) => {
          const Icon = MODULE_ICONS[module.id];
          return (
            <Link
              key={module.id}
              to={`/${module.slug}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-md"
                style={{ backgroundColor: tint(module.accent ?? DEFAULT_ACCENT, 0.08) }}
              >
                {Icon && (
                  <Icon className="shrink-0 text-slate-500" width={20} height={20} strokeWidth={1.75} aria-hidden="true" />
                )}
              </span>
              {module.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
