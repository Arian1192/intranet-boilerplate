import { useState } from 'react';
import { Card } from '@/components/ui';

export function VariableChips({ label, initial }: { label: string; initial: string[] }) {
  const [values, setValues] = useState<string[]>(initial);
  const [draft, setDraft] = useState('');

  const add = () => {
    const v = draft.trim();
    if (v && !values.includes(v)) setValues([...values, v]);
    setDraft('');
  };

  return (
    <Card className="p-4">
      <p className="mb-3 text-sm font-medium text-slate-700">{label}</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-sm text-slate-600">
            {v}
            <button type="button" aria-label={`Quitar ${v}`} onClick={() => setValues(values.filter((x) => x !== v))}
              className="text-slate-400 hover:text-red-500">✕</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Añadir…"
          className="h-9 flex-1 rounded-lg border border-slate-200 px-3 text-sm" />
        <button type="button" aria-label="+" onClick={add}
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">+</button>
      </div>
    </Card>
  );
}
