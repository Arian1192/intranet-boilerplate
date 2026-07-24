import { SegmentedControl } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { ingresoTramo } from '../data/calculos-acuerdo';
import type { BaseCalculoAcuerdo, TramoAcuerdoConfig } from '../data/types';

interface Props {
  titulo: string;
  config: TramoAcuerdoConfig;
  bruto: number;
  ivaPct: number;
  onChange: (config: TramoAcuerdoConfig) => void;
}

const SOBRE_OPTIONS: { label: string; value: BaseCalculoAcuerdo }[] = [
  { label: 'Bruto', value: 'bruto' },
  { label: 'Neto', value: 'neto' },
];

export function AcuerdoTramoCard({ titulo, config, bruto, ivaPct, onChange }: Props) {
  const ingreso = ingresoTramo(config, bruto, ivaPct);
  const inputClass = 'h-9 w-full rounded-lg border border-slate-200 px-2 text-sm';

  return (
    <div className="grid grid-cols-2 gap-3 border-b border-slate-100 py-4 last:border-0 sm:grid-cols-5">
      <p className="col-span-2 self-center font-medium text-slate-800 sm:col-span-1">{titulo}</p>
      <label className="text-xs">
        <span className="mb-1 block uppercase text-slate-400">Nos llevamos %</span>
        <input
          type="number"
          value={config.nosLlevamosPct}
          onChange={(e) => onChange({ ...config, nosLlevamosPct: Number(e.target.value) })}
          className={inputClass}
        />
      </label>
      <div className="text-xs">
        <span className="mb-1 block uppercase text-slate-400">Sobre</span>
        <SegmentedControl options={SOBRE_OPTIONS} value={config.sobreBase} onChange={(sobreBase) => onChange({ ...config, sobreBase })} />
      </div>
      <label className="text-xs">
        <span className="mb-1 block uppercase text-slate-400">Deduc. fija €</span>
        <input
          type="number"
          value={config.deduccionFijaEur}
          onChange={(e) => onChange({ ...config, deduccionFijaEur: Number(e.target.value) })}
          className={inputClass}
        />
      </label>
      <label className="text-xs">
        <span className="mb-1 block uppercase text-slate-400">Deduc. %</span>
        <input
          type="number"
          value={config.deduccionPct}
          onChange={(e) => onChange({ ...config, deduccionPct: Number(e.target.value) })}
          className={inputClass}
        />
      </label>
      <div className="col-span-2 text-right text-xs sm:col-span-5">
        <span className="uppercase text-slate-400">Nuestro ingreso </span>
        <span className="font-semibold text-slate-900">{formatCurrency(ingreso)}</span>
      </div>
    </div>
  );
}
