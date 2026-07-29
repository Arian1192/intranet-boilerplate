export interface NavItem {
  label: string;
  href: string;
}

/** Nivel 1 — áreas del módulo ConceptOne (barra superior). */
export const CONCEPTONE_AREAS: NavItem[] = [
  { label: 'Bookings', href: '/conceptone' },
  { label: 'Management', href: '/management/estrategias' },
  { label: 'Calendario', href: '/calendario-c1' },
  { label: 'Contactos', href: '/contactos' },
];

/** Nivel 2 — secciones que sólo existen dentro del área Bookings. */
export const BOOKINGS_SECTIONS: NavItem[] = [
  { label: 'Dashboard', href: '/conceptone' },
  { label: 'Shows', href: '/shows' },
  { label: 'Ofertas', href: '/ofertas' },
  { label: 'Cobros', href: '/cobros' },
  { label: 'Gastos', href: '/gastos' },
  { label: 'Disponibilidad', href: '/disponibilidad' },
];

/** Área activa (nivel 1) para una ruta del módulo. */
export function activeArea(pathname: string): string | null {
  if (BOOKINGS_SECTIONS.some((section) => section.href === pathname)) return 'Bookings';
  if (pathname === '/management' || pathname.startsWith('/management/')) return 'Management';
  if (pathname === '/calendario-c1') return 'Calendario';
  if (pathname === '/contactos') return 'Contactos';
  return null;
}

/** Sección activa (nivel 2); null fuera del área Bookings. */
export function activeSection(pathname: string): string | null {
  return BOOKINGS_SECTIONS.find((section) => section.href === pathname)?.label ?? null;
}

/** La sub-nav de secciones sólo se muestra dentro de Bookings. */
export function showsSectionBar(pathname: string): boolean {
  return activeArea(pathname) === 'Bookings';
}
