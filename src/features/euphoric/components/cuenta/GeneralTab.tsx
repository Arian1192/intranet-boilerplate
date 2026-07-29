import { useState } from 'react';
import { Button, Input, Select, Textarea } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Account, PaymentStatus } from '../../data/types';

const PAYMENT_STATUSES: PaymentStatus[] = ['Al corriente', 'Pendiente', 'Retraso'];
const SERVICES = ['Redes sociales', 'Paid media', 'Contenido'];

function Chip({
  active,
  tone = 'neutral',
  onClick,
  children,
}: {
  active: boolean;
  tone?: 'neutral' | 'success';
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-sm font-medium transition-colors',
        active && tone === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
        active && tone === 'neutral' && 'border-slate-300 bg-white text-slate-800',
        !active && 'border-slate-200 bg-white text-slate-400 hover:text-slate-600'
      )}
    >
      {children}
    </button>
  );
}

function AssigneeSlot({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-full border border-dashed border-slate-300 text-slate-400">
        ＋
      </span>
      <span className="text-sm text-slate-400">{label}</span>
    </div>
  );
}

export function GeneralTab({ account }: { account: Account }) {
  const [payment, setPayment] = useState<PaymentStatus>(account.paymentStatus);
  const [services, setServices] = useState<string[]>(account.services);

  const toggleService = (service: string) =>
    setServices((current) =>
      current.includes(service) ? current.filter((item) => item !== service) : [...current, service]
    );

  return (
    <div className="space-y-5">
      <Input label="Nombre de la cuenta *" defaultValue={account.name} />

      <label className="flex items-center gap-2">
        <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
        <span className="text-sm text-slate-700">Cuenta interna del grupo (no es cliente externo)</span>
      </label>

      <div>
        <Input label="Cliente en el CRM" defaultValue={account.crmClient} placeholder="Buscar o crear cliente…" />
        <p className="mt-1.5 text-xs text-slate-500">
          Enlaza la cuenta con la ficha del cliente en el CRM del grupo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select label="Estado comercial" defaultValue={account.commercialStatus}>
          <option value="Lead">Lead</option>
          <option value="Activo">Activo</option>
          <option value="Finalizado">Finalizado</option>
        </Select>
        <Select label="Tier" defaultValue={account.tier}>
          <option value="—">—</option>
          <option value="Tier 1 · Gran cuenta">Tier 1 · Gran cuenta</option>
          <option value="Tier 2 · Estándar">Tier 2 · Estándar</option>
        </Select>
        <Select label="Sector" defaultValue={account.sector}>
          {['—', 'Hotel', 'Restaurante', 'Ocio nocturno', 'Festival', 'Retail', 'Inmobiliaria', 'Otro'].map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </Select>
        <Select label="Estado" defaultValue={account.status}>
          <option value="Activa">Activa</option>
          <option value="Pausada">Pausada</option>
          <option value="Baja">Baja</option>
        </Select>
        <Input label="Retainer mensual (€)" defaultValue={account.retainer ? String(account.retainer) : ''} />
        <Input label="Fecha de inicio" type="date" defaultValue={account.startDate} />
        <Input label="Horas mensuales contratadas" defaultValue={account.monthlyHours} placeholder="Opcional" />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          defaultChecked={account.contractSigned}
          className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
        <span className="text-sm text-slate-700">Contrato firmado</span>
      </label>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Estado de pago</p>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_STATUSES.map((status) => (
            <Chip key={status} tone="success" active={payment === status} onClick={() => setPayment(status)}>
              {status}
            </Chip>
          ))}
        </div>
        <Input placeholder="Nota (opcional)" aria-label="Nota del estado de pago" />
        <p className="text-xs text-slate-500">Manual por ahora; se automatizará al integrar Holded.</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Servicios</p>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((service) => (
            <Chip key={service} active={services.includes(service)} onClick={() => toggleService(service)}>
              {service}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-700">Responsable</p>
          <AssigneeSlot label="Sin asignar" />
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-700">Resp. de aprobar</p>
          <AssigneeSlot label="Sin asignar" />
          <p className="text-xs text-slate-500">Se autocompleta en las piezas de esta cuenta.</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">Contactos</p>
          <button type="button" className="text-sm text-slate-500 hover:text-slate-700">
            ＋ Añadir contacto
          </button>
        </div>
        <p className="text-sm text-slate-400">Sin contactos.</p>
      </div>

      <Textarea label="Notas" placeholder="Alcance, condiciones, observaciones…" />

      <div className="rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-semibold tracking-wide text-slate-400">ENLACE DE APROBACIÓN DEL CLIENTE</p>
        <p className="mt-1 text-xs text-slate-500">
          Comparte este enlace con el cliente para que apruebe o pida cambios en sus piezas y publicaciones, sin entrar
          a la intranet.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Input readOnly value={account.approvalLink} aria-label="Enlace de aprobación" />
          <Button variant="secondary">Copiar</Button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-semibold tracking-wide text-slate-400">PORTAL DE CLIENTE</p>
        <p className="mt-1 text-xs text-slate-500">
          Da acceso al cliente para ver su contenido, campañas, eventos, aprobar piezas, gestionar su branding y subir
          bases de datos. Verá solo lo de esta cuenta.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Input placeholder="email@cliente.com" aria-label="Email del cliente" />
          <Button variant="secondary">Invitar</Button>
        </div>
        <p className="mt-1.5 text-xs text-slate-500">
          Se le enviará un email para crear su contraseña. Requiere permiso de gestión de usuarios.
        </p>
      </div>

      <div className="flex justify-end">
        <Button>Guardar</Button>
      </div>
    </div>
  );
}
