import { useState } from 'react';
import { Card, Input, Select } from '@/components/ui';
import { ConfigPageHeader } from '../components/ConfigPageHeader';
import { HolidayRow } from '../components/HolidayRow';
import { holidays, groupByYear, filterHolidays, type Holiday, type HolidayScope } from '../data/festivos';

export function FestivosPage() {
  const [list, setList] = useState<Holiday[]>(holidays());
  const [includePast, setIncludePast] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [scope, setScope] = useState<HolidayScope>('espana');

  const visible = filterHolidays(list, { includePast });
  const groups = groupByYear(visible);

  const addHoliday = () => {
    if (!date || !name.trim()) return;
    setList((cur) => [...cur, { id: `hol-local-${Date.now()}`, date, name: name.trim(), scope }]);
    setDate('');
    setName('');
  };

  const removeHoliday = (id: string) => setList((cur) => cur.filter((holiday) => holiday.id !== id));

  return (
    <div className="space-y-4">
      <ConfigPageHeader
        title="Festivos"
        subtitle={
          <>
            Calendario de festivos (base Barcelona: España, Catalunya y locales).{' '}
            <strong className="font-semibold text-slate-700">Se descuentan de las vacaciones del equipo</strong>, todos,
            sea cual sea su ámbito. También se usa en el saludo de la home.
          </>
        }
      />

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_2fr_1fr_auto] sm:items-end">
          <div>
            <label htmlFor="holiday-date" className="block text-sm text-slate-600">Fecha</label>
            <input
              id="holiday-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
            />
          </div>
          <Input label="Nombre" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. La Mercè" />
          <Select label="Ámbito" value={scope} onChange={(event) => setScope(event.target.value as HolidayScope)}>
            <option value="espana">España</option>
            <option value="catalunya">Catalunya</option>
            <option value="barcelona">Barcelona</option>
          </Select>
          <button
            type="button"
            onClick={addHoliday}
            className="h-10 rounded-lg bg-[#44444C] px-4 text-sm font-medium text-white hover:bg-slate-800"
          >
            Añadir
          </button>
        </div>
      </Card>

      <Card className="p-0">
        <button
          type="button"
          onClick={() => setImportOpen((open) => !open)}
          aria-expanded={importOpen}
          className="flex w-full items-center gap-2 px-5 py-3 text-left text-sm font-medium text-slate-600"
        >
          <span className={`inline-block transition-transform ${importOpen ? 'rotate-90' : ''}`}>▸</span>
          Importar un año entero (pegar lista)
        </button>
        {importOpen && <div data-testid="import-accordion-body" className="border-t border-slate-100" />}
      </Card>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={includePast}
          onChange={(event) => setIncludePast(event.target.checked)}
          aria-label="Ver también los festivos pasados"
        />
        Ver también los festivos pasados
      </label>

      {groups.map((group) => (
        <div key={group.year}>
          <h3 className="mb-2 text-sm font-semibold text-slate-500">{group.year}</h3>
          <Card className="p-0">
            {group.items.map((holiday) => (
              <HolidayRow key={holiday.id} holiday={holiday} onRemove={() => removeHoliday(holiday.id)} />
            ))}
          </Card>
        </div>
      ))}
    </div>
  );
}
