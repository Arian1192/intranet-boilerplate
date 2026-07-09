import { Button, Input } from '@/components/ui';

export interface ArtistaFormProps {
  onSave?: () => void;
}

const SOCIAL_LINKS = [
  'Instagram',
  'Facebook',
  'TikTok',
  'Spotify',
  'Resident Advisor',
  'SoundCloud',
  'YouTube',
] as const;

export function ArtistaForm({ onSave }: ArtistaFormProps) {
  return (
    <div className="space-y-5">
      <Input label="Nombre *" placeholder="Nombre del artista" />

      <Input label="Email de contacto" placeholder="Para mandar flyers a aprobar" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Enlace press kit" placeholder="https://..." />
        <Input label="Foto (URL)" placeholder="https://..." />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Redes (URL)</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SOCIAL_LINKS.map((network) => (
            <Input key={network} label={network} placeholder={network} />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => onSave?.()}>Guardar</Button>
      </div>
    </div>
  );
}
