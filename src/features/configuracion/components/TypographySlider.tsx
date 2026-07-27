export interface TypographySliderProps {
  label: string;
  value: number;
  unit: 'px' | 'x' | '';
  min: number;
  max: number;
  step: number;
  help?: string;
  onChange: (value: number) => void;
}

function formatValue(value: number, unit: 'px' | 'x' | ''): string {
  if (unit === 'px') return `${Math.round(value)} px`;
  const decimal = value.toFixed(2).replace('.', ',');
  return unit === 'x' ? `${decimal} x` : decimal;
}

export function TypographySlider({ label, value, unit, min, max, step, help, onChange }: TypographySliderProps) {
  return (
    <div className="py-3">
      <div className="flex items-center justify-between text-sm">
        <label className="font-medium text-slate-700">{label}</label>
        <span className="text-slate-500">{formatValue(value, unit)}</span>
      </div>
      <input
        type="range"
        role="slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-slate-700"
      />
      {help && <p className="mt-1 text-xs text-slate-400">{help}</p>}
    </div>
  );
}
