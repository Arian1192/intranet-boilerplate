import { useState } from 'react';
import { Button } from '@/components/ui';
import type { NewsItem } from '@/types';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

export interface NewsCardProps {
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded((v) => !v);

  return (
    <li className="overflow-hidden rounded-xl border border-news-border bg-news-card px-4 py-3">
      <div className="mb-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        <span
          aria-hidden
          className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-slate-200 text-[10px] font-medium text-slate-600"
        >
          {item.author.charAt(0)}
        </span>
        <span className="font-medium text-slate-600">{item.author}</span>
        <ArrowRight className="h-3 w-3 text-slate-400" />
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">{item.scope}</span>
        <span>·</span>
        <span className="text-slate-400">{item.date}</span>
        {item.scheduledFor && (
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-700">
            {item.scheduledFor}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          className="min-w-0 flex-1 truncate text-left text-base font-medium text-slate-800"
        >
          {item.title}
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          className="shrink-0 text-slate-300 hover:text-slate-500"
          aria-label={expanded ? 'Colapsar' : 'Expandir'}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && item.content && (
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.content}</p>
      )}
      {expanded && (
        <div className="mt-4 flex items-center justify-between">
          <div>
            {item.actionLabel && (
              <Button variant="primary" size="sm">
                {item.actionLabel}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <button type="button" className="hover:text-slate-600">
              Editar
            </button>
            <button type="button" className="hover:text-slate-600">
              Eliminar
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
