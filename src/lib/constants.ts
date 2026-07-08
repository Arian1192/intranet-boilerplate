export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Intranet';
export const APP_SHORT_NAME = import.meta.env.VITE_APP_SHORT_NAME || 'Intranet';

export const MODULES = [
  {
    id: 'conceptone',
    slug: 'conceptone',
    name: 'Booking & Management',
    shortDescription: 'Gestiona shows y su calculadora, liquidaciones, fichas de artistas, logística y reportes.',
    icon: 'Headphones',
    category: 'business',
  },
  {
    id: 'etra',
    slug: 'etra',
    name: 'Comunicación & PR',
    shortDescription: 'Lleva las cuentas de PR, las acciones del equipo y el seeding a influencers.',
    icon: 'Megaphone',
    category: 'business',
  },
  {
    id: 'produccion',
    slug: 'produccion',
    name: 'Producción',
    shortDescription: 'Base de datos de eventos y producciones: calendario, tareas, responsables y presupuesto.',
    icon: 'Calendar',
    category: 'business',
  },
  {
    id: 'cruda',
    slug: 'cruda',
    name: 'CRUDA',
    shortDescription: 'Catálogo, pedidos y control de stock de ropa y merch, con analítica.',
    icon: 'Shirt',
    category: 'business',
  },
  {
    id: 'crm',
    slug: 'crm',
    name: 'CRM',
    shortDescription: 'Base de clientes y contactos, pipeline de oportunidades, KPIs comerciales.',
    icon: 'Target',
    category: 'internal',
  },
  {
    id: 'personal',
    slug: 'personal',
    name: 'Team',
    shortDescription: 'Personas del grupo, condiciones y RRHH, vacaciones y gestión de usuarios.',
    icon: 'Users',
    category: 'internal',
  },
  {
    id: 'configuracion',
    slug: 'configuracion',
    name: 'Configuración',
    shortDescription: 'Plantillas de correo y ajustes generales de la intranet.',
    icon: 'Settings',
    category: 'internal',
  },
] as const;
