import { useState } from 'react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { CURRENT_USER, type CreativePiece } from './data/seed';
import { filterPieces, deriveStats, type CreativosFilter } from './data/tablero';
import { PiezaStatCard } from './components/PiezaStatCard';
import { FilterChips } from './components/FilterChips';
import { PiecesKanban } from './components/PiecesKanban';
import { PiecesTable } from './components/PiecesTable';
import { NuevaPiezaDrawer } from './components/NuevaPiezaDrawer';
import { PiezasCalendar } from './components/PiezasCalendar';

/**
 * D5: los pills de "Asignar a" no filtran — son atajos de alta con el responsable ya puesto.
 * Los nombres completos salen del `title` del live (`live-2026-07-27-20-board-structure.json`).
 * "Maf" lo añadió el live entre el 27 y el 29 de julio, con `title` sin apellido — es el
 * nombre que el propio live pinta en la ficha (barrido del 29-jul, `40-creativos-asignar-a.json`).
 */
const ASSIGN_SHORTCUTS = [
  { name: 'Alba', fullName: 'Alba G' },
  { name: 'Carlos', fullName: 'Carlos Pego' },
  { name: 'Maf', fullName: 'Maf' },
];

/** D6: control segmentado a la izquierda de la fila de filtros. "Tablero" por defecto. */
const VIEWS = ['Tablero', 'Calendario'] as const;
type CreativosView = (typeof VIEWS)[number];

/**
 * Tablero de piezas compartido por `/creativos` y `/euphoric/piezas`.
 *
 * En el live son **la misma pantalla**: recon hizo un diff byte a byte del `main` de las dos rutas
 * (20 289 y 20 263 bytes) y, sustituyendo solo el H1 y solo la bajada por un marcador, los dos
 * documentos quedan idénticos — 20 198 bytes cada uno, cero hunks — más 7 recortes a 4× con el
 * mismo SHA-256. Por eso lo único parametrizado es el título, la bajada y los datos: cualquier
 * otra diferencia entre las dos vistas sería una deriva, no un requisito.
 */
export interface TableroPiezasShellProps {
  /** H1 de la vista. Es lo único que el live cambia entre las dos rutas, junto con la bajada. */
  titulo: string;
  bajada: string;
  piezas: CreativePiece[];
  /** Solo para fijar el mes inicial del calendario en los tests. Por defecto, hoy. */
  today?: Date;
}

export function TableroPiezasShell({ titulo, bajada, piezas, today }: TableroPiezasShellProps) {
  const [filter, setFilter] = useState<CreativosFilter>('Todas');
  const [view, setView] = useState<CreativosView>('Tablero');
  const [drawerAssignee, setDrawerAssignee] = useState<string | undefined>(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const stats = deriveStats(piezas);
  const visible = filterPieces(piezas, filter, CURRENT_USER);

  const openDrawer = (assignee?: string) => {
    setDrawerAssignee(assignee);
    setDrawerOpen(true);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">{titulo}</h1>
          <p className="text-sm text-slate-500">{bajada}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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

      {/*
        El `role`/`aria-label` venía del lado de euphoric y se conserva al converger: es invisible,
        no mueve un píxel de creativos y perderlo sería degradar la accesibilidad a cambio de nada.
      */}
      <div
        role="region"
        aria-label="Indicadores de creatividades"
        className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <PiezaStatCard value={stats.activas} label="Creatividades activas" />
        <PiezaStatCard value={stats.pendAprobar} label="Pend. aprobar" valueClassName="text-amber-600" />
        <PiezaStatCard value={stats.correcciones} label="En correcciones" valueClassName="text-rose-600" />
        <PiezaStatCard value={stats.atrasadas} label="Atrasadas" valueClassName="text-red-600" />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="mr-1 inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
            {VIEWS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium',
                  view === v ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <FilterChips active={filter} onChange={setFilter} />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400">Recursos:</span>
          <span className="text-xs text-slate-300">—</span>
          <button type="button" className="text-xs text-slate-400 hover:text-brand-600">
            Editar
          </button>
        </div>
      </div>

      {/* El live separa tablero y tabla con space-y-6, no con el 4 del resto de bloques. */}
      <div className="space-y-6">
        {view === 'Tablero' ? (
          <>
            <PiecesKanban pieces={visible} />
            <PiecesTable pieces={visible} />
          </>
        ) : (
          <PiezasCalendar pieces={visible} today={today ?? new Date()} />
        )}
      </div>

      <NuevaPiezaDrawer
        open={drawerOpen}
        assignee={drawerAssignee}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
