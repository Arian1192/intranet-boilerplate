import { useState } from 'react';
import { UserRound, X } from 'lucide-react';
import { Modal, Input, Select, Textarea, Button } from '@/components/ui';
import type { Influencer } from '@/types';

interface SocialRow {
  network: 'Instagram' | 'TikTok';
  url: string;
  followers: string;
}

function initialSocials(influencer?: Influencer): SocialRow[] {
  if (!influencer) return [{ network: 'Instagram', url: '', followers: '' }];
  const rows: SocialRow[] = [];
  if (influencer.instagramFollowers !== undefined) {
    rows.push({ network: 'Instagram', url: '', followers: String(influencer.instagramFollowers) });
  }
  if (influencer.tiktokFollowers !== undefined) {
    rows.push({ network: 'TikTok', url: '', followers: String(influencer.tiktokFollowers) });
  }
  return rows.length > 0 ? rows : [{ network: 'Instagram', url: '', followers: '' }];
}

export function InfluencerFormModal({
  open,
  onClose,
  influencer,
}: {
  open: boolean;
  onClose: () => void;
  influencer?: Influencer;
}) {
  const [socials, setSocials] = useState<SocialRow[]>(() => initialSocials(influencer));

  return (
    <Modal open={open} onClose={onClose} title={influencer ? 'Editar influencer' : 'Nuevo influencer'}>
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50">
              <UserRound className="h-7 w-7 text-slate-300" />
              <span className="absolute inset-x-0 bottom-0 bg-slate-800/60 py-0.5 text-center text-[10px] text-white">
                Hacer foto
              </span>
            </div>
            <span className="text-xs text-slate-400">Foto</span>
          </div>
          <div className="flex-1">
            <Input label="Nombre *" defaultValue={influencer?.name} autoFocus className="focus:ring-brand-500" />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700">Redes sociales</p>
          <p className="mb-2 text-xs text-slate-400">
            Los seguidores se actualizan a mano; se guarda la fecha automáticamente.
          </p>
          <div className="space-y-2">
            {socials.map((row, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select defaultValue={row.network} className="w-32">
                  <option>Instagram</option>
                  <option>TikTok</option>
                </Select>
                <Input placeholder="@handle o URL" defaultValue={row.url} className="flex-1" />
                <Input placeholder="Seguid." defaultValue={row.followers} className="w-24" />
                {socials.length > 1 && (
                  <button
                    type="button"
                    aria-label="Eliminar red"
                    onClick={() => setSocials((rows) => rows.filter((_, i) => i !== index))}
                    className="text-slate-300 hover:text-slate-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSocials((rows) => [...rows, { network: 'Instagram', url: '', followers: '' }])}
            className="mt-2 text-sm text-brand-600 hover:text-brand-700"
          >
            + Añadir red
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input label="Talla ropa" placeholder="S/M/L..." />
          <Input label="Talla gorra" placeholder="7⅜ / M-L..." />
          <Input label="Talla calzado" placeholder="43..." />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Email" defaultValue={influencer?.email} />
          <Input label="Teléfono" />
        </div>

        <Input label="Dirección de envío" />
        <Textarea label="Notas" className="min-h-[60px]" />

        <div className="flex gap-3">
          <Button>Guardar</Button>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </Modal>
  );
}
