import {
  Clapperboard,
  Headphones,
  Megaphone,
  Palette,
  Settings,
  Shirt,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react';

export const MODULE_ICONS: Record<string, LucideIcon> = {
  conceptone: Headphones,
  etra: Megaphone,
  produccion: Clapperboard,
  euphoric: Sparkles,
  creativos: Palette,
  cruda: Shirt,
  crm: Target,
  personal: Users,
  configuracion: Settings,
};

export type { LucideIcon };
