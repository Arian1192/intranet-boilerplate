import { TableroPiezasShell } from '../TableroPiezasShell';
import { pieces } from '../data/seed';

/** `/creativos`. Mismo tablero que `/euphoric/piezas`: solo cambian el título y la bajada. */
export function CreativosPage({ today }: { today?: Date } = {}) {
  return (
    <TableroPiezasShell
      titulo="Creativos"
      bajada="Tablero de creatividades del equipo de diseño: Euphoric, clientes del CRM y empresas internas."
      piezas={pieces}
      today={today}
    />
  );
}
