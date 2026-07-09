import { ModuleShell } from './ModuleShell';

export function CreativosShell() {
  return (
    <ModuleShell
      title="Creativos"
      description="Equipo de diseño: tablero de piezas (estáticos, animados, vídeo) para Euphoric, clientes del CRM y empresas internas."
      tabs={['Tablero', 'Piezas', 'Clientes']}
    />
  );
}
