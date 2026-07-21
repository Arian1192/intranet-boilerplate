import { useState } from 'react';
import type { NewsItem } from '@/types';
import { NewsCard } from './NewsCard';
import { NewsForm } from './NewsForm';

export interface NewsFeedProps {
  items: NewsItem[];
}

export function NewsFeed({ items }: NewsFeedProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Novedades
        </h2>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-sm font-medium text-slate-500 hover:bg-slate-200 hover:text-slate-700"
          aria-label="Añadir novedad"
        >
          +
        </button>
      </div>
      {showForm && (
        <div className="mb-3">
          <NewsForm onClose={() => setShowForm(false)} />
        </div>
      )}
      <ul className="space-y-2">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
