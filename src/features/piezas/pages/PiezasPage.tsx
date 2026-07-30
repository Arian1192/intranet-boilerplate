import { TableroPiezasShell } from '../TableroPiezasShell';
import { piezasEuphoric } from '../data/seed-euphoric';

/** `/euphoric/piezas`. Mismo tablero que `/creativos`: solo cambian el título y la bajada. */
export function PiezasPage({ today }: { today?: Date } = {}) {
  return (
    <TableroPiezasShell
      titulo="Creatividades"
      bajada="Content creation: seguimiento de artes por estado de producción."
      piezas={piezasEuphoric}
      today={today}
    />
  );
}
