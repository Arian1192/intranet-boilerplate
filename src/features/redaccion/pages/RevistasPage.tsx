import { useOutletContext } from 'react-router';
import { Plus } from 'lucide-react';
import { EditionCard } from '../components/EditionCard';
import type { Magazine } from '../data/types';

export function RevistasPage() {
  const magazine = useOutletContext<Magazine>();
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: magazine.accent }} aria-hidden="true" />
          <span className="text-base font-semibold text-slate-800">{magazine.spaceName}</span>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg bg-[#44444C] px-4 py-2 text-sm font-medium text-white hover:bg-[#3a3a41]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Edición
        </button>
      </div>

      {magazine.editions.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {magazine.editions.map((edition) => (
            <EditionCard key={edition.id} edition={edition} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-400">
          Ninguna edición todavía.
        </div>
      )}
    </div>
  );
}
