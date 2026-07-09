import { useState } from 'react';
import { Avatar, Badge, Button, Input, MasterDetailList } from '@/components/ui';
import { ArtistaForm } from '../components/ArtistaForm';
import { artists } from '../data/seed';

export function ArtistasPage() {
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);

  const filtered = artists.filter((artist) => artist.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Artistas</h1>
          <p className="text-slate-500">
            Base compartida con ConceptOne. Crea aquí los artistas externos para tus line-ups y flyers.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>+ Nuevo artista</Button>
      </div>

      <MasterDetailList
        items={filtered}
        emptyState="Elige un artista o crea uno nuevo."
        detailOverride={creating ? <ArtistaForm onSave={() => setCreating(false)} /> : undefined}
        listTop={
          <Input
            placeholder="Buscar artista…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        }
        renderRow={(artist) => (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar fallback={artist.name} size="sm" className="bg-brand-100 text-brand-700" />
              <p className="font-medium text-slate-900">{artist.name}</p>
            </div>
            <Badge variant={artist.kind === 'Agencia' ? 'fuchsia' : 'neutral'}>{artist.kind}</Badge>
          </div>
        )}
        renderDetail={(artist) => (
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{artist.name}</h2>
            <p className="text-sm text-slate-500">{artist.kind}</p>
          </div>
        )}
      />
    </div>
  );
}
