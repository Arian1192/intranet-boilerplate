import { Card, Button } from '@/components/ui';
import type { NewsItem } from '@/types';
import { ArrowRight, ChevronDown } from 'lucide-react';

export interface NewsFeedProps {
  items: NewsItem[];
}

export function NewsFeed({ items }: NewsFeedProps) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Novedades
        </h2>
        <button
          type="button"
          className="grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-sm font-medium text-slate-500 hover:bg-brand-50 hover:text-brand-600"
          aria-label="Añadir novedad"
        >
          +
        </button>
      </div>
      <Card className="divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-4">
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
              <p className="text-sm font-normal text-slate-800">{item.title}</p>
            </div>
            <div className="flex items-center gap-2">
              {item.actionLabel && (
                <Button variant="primary" size="sm">
                  {item.actionLabel}
                </Button>
              )}
              <button
                type="button"
                className="text-slate-300 hover:text-slate-500"
                aria-label="Expandir"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </Card>
    </section>
  );
}
