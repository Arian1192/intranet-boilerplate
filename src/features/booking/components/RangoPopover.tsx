import { desdeOpciones, hastaOpciones, type DesdeValue, type HastaValue, type Rango } from '../data/rango';

export interface RangoPopoverProps {
  abierto: boolean;
  rango: Rango;
  onChange: (rango: Rango) => void;
  onClose: () => void;
}

function Campo({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        {children}
      </select>
    </div>
  );
}

export function RangoPopover({ abierto, rango, onChange, onClose }: RangoPopoverProps) {
  if (!abierto) return null;

  return (
    <>
      <div role="presentation" onClick={onClose} className="fixed inset-0 z-40" />
      <div
        role="dialog"
        aria-label="Rango temporal"
        className="absolute z-50 mt-2 w-72 space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
      >
        <Campo id="rango-desde" label="Desde" value={rango.desde} onChange={(v) => onChange({ ...rango, desde: v as DesdeValue })}>
          {desdeOpciones.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Campo>
        <Campo id="rango-hasta" label="Hasta" value={rango.hasta} onChange={(v) => onChange({ ...rango, hasta: v as HastaValue })}>
          {hastaOpciones.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Campo>
      </div>
    </>
  );
}
