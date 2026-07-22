import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TeamGroup } from './TeamGroup';
import { piecesFor, statusesForTeam, countByStatus, groupByTeam } from '../data/contenidos';

function renderGroup(team: 'redes' | 'web' | 'revista', pieces = piecesFor('mixmag')) {
  const grouped = groupByTeam(pieces)[team];
  const statuses = statusesForTeam('mixmag', team);
  return render(
    <TeamGroup
      team={team}
      teamLabel={team.toUpperCase()}
      teamChip="bg-violet-100 text-violet-700"
      count={grouped.length}
      statuses={statuses}
      counts={countByStatus(grouped, statuses)}
      pieces={grouped}
    />
  );
}

describe('TeamGroup', () => {
  it('REVISTA muestra la caja MAQUETACIÓN y sus 2 piezas', () => {
    renderGroup('revista');
    expect(screen.getByText('MAQUETACIÓN')).toBeInTheDocument();
    expect(screen.getByText('Artículo Soho Farmhouse Ibiza')).toBeInTheDocument();
    expect(screen.getByText('Campaña Test 1 · Publirreportaje')).toBeInTheDocument();
  });

  it('REDES no muestra MAQUETACIÓN', () => {
    renderGroup('redes');
    expect(screen.queryByText('MAQUETACIÓN')).toBeNull();
  });

  it('muestra empty-state cuando el equipo no tiene piezas', () => {
    render(
      <TeamGroup
        team="redes"
        teamLabel="REDES"
        teamChip="bg-violet-100 text-violet-700"
        count={0}
        statuses={statusesForTeam('tagmag', 'redes')}
        counts={{}}
        pieces={[]}
      />
    );
    expect(screen.getByText('Nada pendiente en este canal.')).toBeInTheDocument();
  });
});
