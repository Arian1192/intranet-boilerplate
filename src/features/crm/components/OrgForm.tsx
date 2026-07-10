import { useState } from 'react';
import { Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { GROUP_COMPANIES } from '../data/seed';

const COUNTRIES = ['España', 'Portugal', 'Francia', 'Italia', 'Alemania', 'Reino Unido', 'Países Bajos', 'Bélgica', 'Andorra'];

export interface OrgFormProps {
  onClose: () => void;
}

export function OrgForm({ onClose }: OrgFormProps) {
  const [worksWith, setWorksWith] = useState<string[]>([]);
  const [fiscalOpen, setFiscalOpen] = useState(false);
  const toggle = (c: string) =>
    setWorksWith((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  return (
    <Card className="border-slate-200 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Nombre / Razón social *</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">Nombre comercial</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">NIF</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">Identificación VAT</label>
          <input className="input" />
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="radio" name="kind" defaultChecked className="accent-brand-600" /> Empresa
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="radio" name="kind" className="accent-brand-600" /> Persona
          </label>
          <span className="h-5 w-px bg-slate-200" />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" defaultChecked className="accent-brand-600" /> Cliente
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="accent-brand-600" /> Proveedor
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="accent-brand-600" /> Lead
          </label>
        </div>

        <div>
          <label className="label">Email</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">Website</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">Teléfono</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">Móvil</label>
          <input className="input" />
        </div>

        <div className="sm:col-span-2">
          <label className="label">Buscar dirección en Google</label>
          <input className="input" placeholder="Escribe la dirección y elige un resultado…" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Dirección</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">Población</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">Código postal</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">Provincia</label>
          <input className="input" />
        </div>
        <div>
          <label className="label">País</label>
          <select className="select" defaultValue="España">
            {COUNTRIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="label">Trabaja con (empresas del grupo)</label>
          <div className="flex flex-wrap gap-2">
            {GROUP_COMPANIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggle(c)}
                className={cn(
                  'rounded-full border px-3 py-1 text-sm transition-colors',
                  worksWith.includes(c)
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-500 hover:border-brand-400',
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-500">Marca todas las empresas del grupo que dan servicio a este cliente.</p>
        </div>

        <div>
          <label className="label">Responsable</label>
          <button type="button" className="inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm text-slate-400 hover:bg-slate-100">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-dashed border-slate-300 text-slate-400">＋</span>
            <span>Asignar</span>
          </button>
        </div>
        <div>
          <label className="label">Referencia interna</label>
          <input className="input" />
        </div>

        <div className="sm:col-span-2">
          <label className="label">Notas</label>
          <textarea className="input min-h-[80px]" />
        </div>

        <div className="sm:col-span-2">
          <button
            type="button"
            onClick={() => setFiscalOpen((v) => !v)}
            className="text-sm font-medium text-slate-600 hover:text-slate-800"
          >
            {fiscalOpen ? '▾' : '▸'} Datos fiscales / facturación
          </button>
          {fiscalOpen && (
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">IBAN</label>
                <input className="input" />
              </div>
              <div>
                <label className="label">Condiciones de pago</label>
                <input className="input" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <Button variant="primary" onClick={onClose}>Guardar</Button>
        <Button variant="secondary" className="border-slate-300" onClick={onClose}>Cancelar</Button>
      </div>
    </Card>
  );
}
