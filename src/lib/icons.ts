import {
  BarChart3,
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
  mixmag: Sparkles,
  tagmag: Sparkles,
  creativos: Palette,
  cruda: Shirt,
  crm: Target,
  personal: Users,
  herramientas: BarChart3,
  configuracion: Settings,
};

export type { LucideIcon };
