import {
  AlertTriangle,
  Bell,
  Calendar,
  CalendarCheck,
  ClipboardCheck,
  Contact,
  Euro,
  FileText,
  HelpCircle,
  Home,
  LayoutGrid,
  LineChart,
  Megaphone,
  Moon,
  Pencil,
  PieChart,
  ReceiptText,
  Scale,
  Send,
  Settings,
  Star,
  Target,
  UserCheck,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface RailItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface RailGroup {
  /** Rótulo tal cual está en el DOM del live; el `uppercase` lo pone el CSS. */
  caption: string;
  items: RailItem[];
}

/**
 * Los tres grupos del rail, en el orden del live (2026-09-09).
 *
 * Los iconos están calcados de `conceptone.png`, donde se ven uno a uno, con su
 * equivalente de lucide. Dos avisos:
 *
 * - `Ofertas` y `Campañas` comparten el megáfono. Es así en el live.
 * - Los tres de «Más» **no** están calcados: el rail recorta su lista al alto
 *   del viewport (`.apx-side-scroll`) y ese grupo cae bajo el pliegue, así que
 *   no hay captura de sus iconos. Son elección nuestra hasta que alguien los
 *   vea.
 * - `Cobros` es un € dentro de un círculo; lucide 0.400 no trae ese glifo
 *   (`CircleEuro` no existe), así que va el € a secas antes que un `$`.
 */
export const RAIL_GROUPS: RailGroup[] = [
  {
    caption: 'Bookings',
    items: [
      { label: 'Dashboard', href: '/conceptone', icon: LayoutGrid },
      { label: 'Shows', href: '/shows', icon: Star },
      { label: 'Tours', href: '/tours', icon: Send },
      { label: 'Ofertas', href: '/ofertas', icon: Megaphone },
      { label: 'Cobros', href: '/cobros', icon: Euro },
      { label: 'Gastos', href: '/gastos', icon: ReceiptText },
      { label: 'Liquidaciones', href: '/liquidaciones', icon: Scale },
      { label: 'Disponibilidad', href: '/disponibilidad', icon: UserCheck },
      { label: 'Calendario', href: '/calendario-c1', icon: Calendar },
      { label: 'Contactos', href: '/contactos', icon: Contact },
    ],
  },
  {
    caption: 'Management',
    items: [
      { label: 'Roster', href: '/management/roster', icon: UserCheck },
      { label: 'Insights', href: '/management/insights', icon: LineChart },
      { label: 'Estrategias', href: '/management/estrategias', icon: Target },
      { label: 'Contratos', href: '/management/contratos', icon: FileText },
      { label: 'Activaciones', href: '/management/activaciones', icon: CalendarCheck },
      { label: 'Campañas', href: '/management/campanas', icon: Megaphone },
      { label: 'Content', href: '/management/content', icon: Pencil },
      { label: 'Incidencias', href: '/management/incidentes', icon: AlertTriangle },
    ],
  },
  {
    // Ojo al homónimo: este «Roster» (/artistas, el roster de la agencia) no es
    // el de Management (/management/roster, la selección para Songstats). En el
    // live se llaman igual; no se corrige.
    caption: 'Más',
    items: [
      { label: 'Roster', href: '/artistas', icon: Users },
      { label: 'Análisis', href: '/reporte', icon: PieChart },
      { label: 'Ajustes', href: '/conceptone/ajustes', icon: Settings },
    ],
  },
];

/**
 * El pie del rail: seis elementos de cuatro naturalezas distintas (dos enlaces,
 * dos botones, el envoltorio de la campana y el perfil). Calcado de `foot.html`,
 * incluido el orden.
 */
export type RailFootItem =
  | { kind: 'link'; label: string; href: string; icon: LucideIcon }
  | { kind: 'action'; label: string; action: 'tema' | 'ayuda'; icon: LucideIcon }
  | { kind: 'notificaciones'; label: string; icon: LucideIcon }
  | { kind: 'perfil'; href: string };

export const RAIL_FOOT: RailFootItem[] = [
  { kind: 'link', label: 'Black Moose', href: '/', icon: Home },
  { kind: 'link', label: 'Pendientes', href: '/conceptone/pendientes', icon: ClipboardCheck },
  { kind: 'action', label: 'Modo noche', action: 'tema', icon: Moon },
  { kind: 'action', label: 'Ayuda', action: 'ayuda', icon: HelpCircle },
  { kind: 'notificaciones', label: 'Notificaciones', icon: Bell },
  { kind: 'perfil', href: '/perfil' },
];

/**
 * Ítem activo del rail: coincidencia exacta y también las subrutas, para que
 * `/management/incidentes/analitica` mantenga «Incidencias» encendida.
 *
 * `/conceptone` es la excepción: es exacto, porque si no se quedaría encendido
 * también en `/conceptone/pendientes` y `/conceptone/ajustes`, que son otros dos
 * ítems del rail.
 */
export function esItemActivo(pathname: string, href: string): boolean {
  if (href === '/conceptone') return pathname === '/conceptone';
  return pathname === href || pathname.startsWith(`${href}/`);
}
