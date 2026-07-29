import { Button, Input, Select } from '@/components/ui';
import type { Account } from '../../data/types';

const CHANNELS = ['Instagram', 'Facebook', 'Google', 'TikTok', 'YouTube', 'LinkedIn', 'X / Twitter', 'Otro'];
const FORMATS = ['Reel', 'Post', 'Story', 'Carrusel', 'Vídeo', 'Otro'];
const TYPES = ['Estático', 'Vídeo', 'Otro'];
const DEPARTMENTS = ['Diseño', 'Vídeo', 'Marketing'];

function offsetLabel(prefix: string, days: number) {
  return `${prefix} · D${days > 0 ? '+' : '-'}${Math.abs(days)}`;
}

function AssignSlot({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-full border border-dashed border-slate-300 text-slate-400">
        ＋
      </span>
      {label && <span className="text-sm text-slate-400">{label}</span>}
    </div>
  );
}

export function AutomatizacionesTab({ account }: { account: Account }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">
        Al crear un evento de esta cuenta se generan solas las publicaciones y creatividades de abajo.
      </p>
      <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
        Al crear un evento de esta cuenta se generarán solas las publicaciones y creatividades de abajo. La
        fecha/deadline de cada una es relativa a la fecha del evento (offset en días; negativo = antes, p.ej. D-3). En
        los títulos y nombres puedes usar las variables <code>{'{evento}'}</code>, <code>{'{ciudad}'}</code> y{' '}
        <code>{'{fecha}'}</code>.
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Plantillas de publicación</h3>
          <Button variant="secondary" size="sm">
            + Añadir publicación
          </Button>
        </div>
        {account.publicationTemplates.length === 0 ? (
          <p className="text-sm text-slate-400">Sin plantillas de publicación.</p>
        ) : (
          account.publicationTemplates.map((template) => (
            <div key={template.id} className="space-y-4 rounded-xl border border-slate-200 p-4">
              <Input label="Título" defaultValue={template.title} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <Input label={offsetLabel('Offset (días)', template.offsetDays)} defaultValue={String(template.offsetDays)} />
                <Input label="Hora (opc.)" type="time" defaultValue={template.time} />
                <Select label="Canal" defaultValue={template.channel}>
                  {CHANNELS.map((channel) => (
                    <option key={channel} value={channel}>
                      {channel}
                    </option>
                  ))}
                </Select>
                <Select label="Formato" defaultValue={template.format}>
                  {FORMATS.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-slate-700">Responsables</p>
                <AssignSlot label="" />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked={template.active}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-slate-700">Activa</span>
                </label>
                <button type="button" className="text-sm text-slate-500 hover:text-slate-700">
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Plantillas de creatividad</h3>
          <Button variant="secondary" size="sm">
            + Añadir creatividad
          </Button>
        </div>
        {account.creativeTemplates.length === 0 ? (
          <p className="text-sm text-slate-400">Sin plantillas de creatividad.</p>
        ) : (
          account.creativeTemplates.map((template) => (
            <div key={template.id} className="space-y-4 rounded-xl border border-slate-200 p-4">
              <Input label="Nombre" defaultValue={template.name} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Select label="Tipo" defaultValue={template.type}>
                  {TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
                <Select label="Departamento" defaultValue={template.department}>
                  {DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </Select>
                <Input
                  label={offsetLabel('Deadline (días)', template.deadlineOffsetDays)}
                  defaultValue={String(template.deadlineOffsetDays)}
                />
              </div>
              <Select label="Publicación enlazada" defaultValue={template.linkedPublication}>
                {account.publicationTemplates.map((publication) => (
                  <option key={publication.id} value={publication.title}>
                    {publication.title}
                  </option>
                ))}
              </Select>
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-slate-700">Responsable</p>
                <AssignSlot label="Asignar" />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked={template.active}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm text-slate-700">Activa</span>
                </label>
                <button type="button" className="text-sm text-slate-500 hover:text-slate-700">
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
