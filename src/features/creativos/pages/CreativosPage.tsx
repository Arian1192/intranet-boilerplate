import { useState } from 'react';
import { Button } from '@/components/ui';
import { pieces as allPieces, CURRENT_USER } from '../data/seed';
import { filterPieces, deriveStats, type CreativosFilter } from '../data/creativos';
import { CreativosStatCard } from '../components/CreativosStatCard';
import { FilterChips } from '../components/FilterChips';
import { PiecesKanban } from '../components/PiecesKanban';
import { PiecesTable } from '../components/PiecesTable';
import { NuevaPiezaDrawer } from '../components/NuevaPiezaDrawer';

export function CreativosPage() {
  const [filter, setFilter] = useState<CreativosFilter>('Todas');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const stats = deriveStats(allPieces);
  const visible = filterPieces(allPieces, filter, CURRENT_USER);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Creativos</h1>
          <p className="text-sm text-slate-500">
            Tablero de piezas del equipo de diseño: Euphoric, clientes del CRM y empresas internas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Asignar a:</span>
          {['Alba', 'Carlos'].map((name) => (
            <button
              key={name}
              type="button"
              className="rounded-full border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-brand-400 hover:text-brand-600"
            >
              + {name}
            </button>
          ))}
          <Button variant="primary" size="sm" onClick={() => setDrawerOpen(true)}>
            + Nueva pieza
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <CreativosStatCard value={stats.activas} label="Piezas activas" />
        <CreativosStatCard value={stats.pendAprobar} label="Pend. aprobar" valueClassName="text-amber-600" />
        <CreativosStatCard value={stats.correcciones} label="En correcciones" valueClassName="text-rose-600" />
        <CreativosStatCard value={stats.atrasadas} label="Atrasadas" valueClassName="text-rose-600" />
      </div>

      <div className="flex items-center justify-between">
        <FilterChips active={filter} onChange={setFilter} />
        <span className="text-xs text-slate-400">
          Recursos: — <span className="text-brand-600 hover:underline">Editar</span>
        </span>
      </div>

      <PiecesKanban pieces={visible} />
      <PiecesTable pieces={visible} />

      <NuevaPiezaDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
