import { Input, Select, Textarea, Button } from '@/components/ui';

export function AccountForm({ onCancel }: { onCancel: () => void }) {
  return (
    <div>
      <h2 className="mb-5 text-lg font-semibold text-slate-800">Nueva cuenta</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nombre (marca) *" />
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Cliente del CRM</span>
            <button type="button" className="text-xs text-brand-600 hover:text-brand-700">
              Abrir CRM ↗
            </button>
          </div>
          <Input placeholder="Buscar o crear cliente..." />
          <p className="mt-1 text-xs text-slate-400">
            Busca el cliente del CRM. Si no existe, escríbelo y créalo al momento.
          </p>
        </div>
        <Input label="Responsable" />
        <Select label="Estado" defaultValue="Activa">
          <option>Activa</option>
          <option>Pausada</option>
          <option>Baja</option>
        </Select>
        <Input label="Fecha de alta" type="date" />
        <Input label="Contacto" />
        <Input label="Email de contacto" />
        <Input label="Teléfono de contacto" />
        <div className="md:col-span-2">
          <Textarea label="Notas" />
        </div>
      </div>
      <div className="mt-5 flex gap-3">
        <Button onClick={onCancel}>Guardar</Button>
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </div>
  );
}
