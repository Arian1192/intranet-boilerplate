export interface MagazineEdition {
  id: string;
  number: number;
  title: string;
  monthLabel: string;
  status: string;
  readyCount: number;
  totalCount: number;
  percent: number;
}

export interface Magazine {
  id: 'mixmag' | 'tagmag';
  name: string;
  spaceName: string;
  region: string;
  hasMagazine: boolean;
  accent: string;
  basePath: string;
  resumen: {
    llevasTu: number;
    atrasados: number;
    pendientes: number;
    enCurso: number;
    revistaAbierta?: string;
  };
  editions: MagazineEdition[];
}
