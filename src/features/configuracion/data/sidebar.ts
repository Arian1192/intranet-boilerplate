export interface SidebarItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    label: 'SISTEMA',
    items: [
      { label: 'Uso y coste', href: '/configuracion/uso' },
      { label: 'Incidencias', href: '/configuracion/incidencias' },
      { label: 'Cuentas (auditoría)', href: '/personal', external: true },
    ],
  },
  {
    label: 'MI TRABAJO',
    items: [{ label: 'Documentos (tipografía)', href: '/configuracion/documentos' }],
  },
  {
    label: 'COMUNICACIÓN',
    items: [
      { label: 'Plantillas de correo', href: '/configuracion' },
      { label: 'Notificaciones', href: '/configuracion/notificaciones' },
    ],
  },
  {
    label: 'CONCEPTONE · BOOKING',
    items: [
      { label: 'Comisiones de bookers', href: '/configuracion/comisiones' },
      { label: 'Control de comisiones', href: '/configuracion/comisiones-pagos' },
      { label: 'Contratos', href: '/configuracion/contratos' },
    ],
  },
  {
    label: 'PRODUCCIÓN',
    items: [{ label: 'Alertas de eventos', href: '/configuracion/alertas' }],
  },
  {
    label: 'EQUIPO',
    items: [
      { label: 'RRHH (coste y avisos)', href: '/configuracion/rrhh' },
      { label: 'Festivos', href: '/configuracion/festivos' },
    ],
  },
];

export function sidebarSections(): SidebarSection[] {
  return SIDEBAR_SECTIONS.map((s) => ({ ...s, items: s.items.map((i) => ({ ...i })) }));
}
