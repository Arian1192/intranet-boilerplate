import { useState } from 'react';
import { Button } from '@/components/ui';
import { pieces as allPieces, CURRENT_USER } from '../data/seed';
import { filterPieces, deriveStats, type CreativosFilter } from '../data/creativos';
import { CreativosStatCard } from '../components/CreativosStatCard';
import { FilterChips } from '../components/FilterChips';
import { PiecesKanban } from '../components/PiecesKanban';
import { PiecesTable } from '../components/PiecesTable';
import { NuevaPiezaDrawer } from '../components/NuevaPiezaDrawer';

/**
 * D5: los pills de "Asignar a" no filtran — son atajos de alta con el responsable ya puesto.
 * Los nombres completos salen del `title` del live (`live-2026-07-27-20-board-structure.json`).
 */
const ASSIGN_SHORTCUTS = [
  { name: 'Alba', fullName: 'Alba Gelabert' },
  { name: 'Carlos', fullName: 'Carlos Pego' },
];

export function CreativosPage() {
  const [filter, setFilter] = useState<CreativosFilter>('Todas');
  const [drawerAssignee, setDrawerAssignee] = useState<string | undefined>(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const stats = deriveStats(allPieces);
  const visible = filterPieces(allPieces, filter, CURRENT_USER);

  const openDrawer = (assignee?: string) => {
    setDrawerAssignee(assignee);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Creativos</h1>
          <p className="text-sm text-slate-500">
            Tablero de creatividades del equipo de diseño: Euphoric, clientes del CRM y empresas internas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400">Asignar a:</span>
            {ASSIGN_SHORTCUTS.map(({ name, fullName }) => (
              <button
                key={name}
                type="button"
                title={`Nueva creatividad para ${fullName}`}
                onClick={() => openDrawer(name)}
                className="rounded-full border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-brand-400 hover:text-brand-600"
              >
                + {name}
              </button>
            ))}
          </div>
          <Button variant="primary" size="sm" onClick={() => openDrawer()}>
            + Nueva creatividad
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <CreativosStatCard value={stats.activas} label="Creatividades activas" />
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

      <NuevaPiezaDrawer
        open={drawerOpen}
        assignee={drawerAssignee}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
