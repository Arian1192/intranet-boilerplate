import { Check } from 'lucide-react';

export function InboxZero() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center">
      <Check className="mx-auto h-6 w-6 text-slate-400" aria-hidden="true" />
      <p className="mt-3 text-sm font-medium text-slate-700">No te toca nada ahora mismo</p>
      <p className="mt-1 text-xs text-slate-400">
        Ni alertas, ni creatividades, ni aprobaciones. Está todo al día.
      </p>
    </div>
  );
}
