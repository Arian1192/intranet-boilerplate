import { useState } from 'react';
import { Button } from '@/components/ui';
import type { NewsItem } from '@/types';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

export interface NewsCardProps {
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-news-border bg-news-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
          {item.author.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-normal text-slate-700">{item.author}</span>
            <ArrowRight className="h-3 w-3" />
            <span>{item.scope}</span>
            <span>·</span>
            <span>{item.date}</span>
            {item.scheduledFor && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-700">
                {item.scheduledFor}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-800">{item.title}</p>
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
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-slate-300 hover:text-slate-500"
          aria-label={expanded ? 'Colapsar' : 'Expandir'}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
