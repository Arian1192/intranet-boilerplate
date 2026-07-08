import {
  Calendar,
  Headphones,
  Megaphone,
  Settings,
  Shirt,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react';

export const MODULE_ICONS: Record<string, LucideIcon> = {
  conceptone: Headphones,
  etra: Megaphone,
  produccion: Calendar,
  cruda: Shirt,
  crm: Target,
  personal: Users,
  configuracion: Settings,
};

export type { LucideIcon };
