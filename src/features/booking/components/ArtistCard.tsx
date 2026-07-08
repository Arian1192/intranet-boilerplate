import { Avatar, Card } from '@/components/ui';
import type { Artist } from '@/types';

export interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <Avatar fallback={artist.name} size="lg" src={artist.avatar} />
      <div className="min-w-0">
        <p className="font-medium text-slate-900">{artist.name}</p>
        <p className="text-xs text-slate-500">{artist.role}</p>
        <p className="truncate text-xs text-slate-400">{artist.email}</p>
      </div>
    </Card>
  );
}
