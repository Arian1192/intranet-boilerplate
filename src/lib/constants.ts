import type { Module } from '@/types';

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Intranet';
export const APP_SHORT_NAME = import.meta.env.VITE_APP_SHORT_NAME || 'Intranet';

export const MODULES: Module[] = [
  { id: 'conceptone', slug: 'conceptone', name: 'ConceptOne', icon: 'Headphones', category: 'workspace', accent: '#773C9F',
    shortDescription: 'Gestiona shows y su calculadora, liquidaciones, fichas de artistas, logística y reportes.' },
  { id: 'etra', slug: 'etra', name: 'Etra', icon: 'Megaphone', category: 'workspace', accent: '#2563EB',
    shortDescription: 'Cuentas de PR, acciones del equipo y seeding a influencers.' },
  { id: 'produccion', slug: 'produccion', name: 'Producción', icon: 'Clapperboard', category: 'workspace', accent: '#BE123C',
    shortDescription: 'Base de datos de eventos y producciones: calendario, tareas, responsables y presupuesto.' },
  { id: 'euphoric', slug: 'euphoric', name: 'Euphoric Media', icon: 'Sparkles', category: 'workspace', accent: '#DB2777',
    shortDescription: 'Marketing del grupo: cuentas, campañas y calendario de contenido.' },
  { id: 'mixmag', slug: 'mixmag', name: 'Mixmag', icon: 'Sparkles', category: 'workspace', accent: '#E11D48',
    shortDescription: 'Redacción Mixmag: contenidos, campañas y revistas.' },
  { id: 'tagmag', slug: 'tagmag', name: 'TAGMAG', icon: 'Sparkles', category: 'workspace', accent: '#0EA5E9',
    shortDescription: 'Redacción TAGMAG: contenidos, campañas y revistas.' },
  { id: 'creativos', slug: 'creativos', name: 'Creativos', icon: 'Palette', category: 'workspace', accent: '#7C3AED',
    shortDescription: 'Tablero de piezas del equipo de diseño.' },
  { id: 'cruda', slug: 'cruda', name: 'CRUDA', icon: 'Shirt', category: 'workspace', accent: '#171717',
    shortDescription: 'Catálogo, pedidos y control de stock de ropa y merch.' },
  { id: 'crm', slug: 'crm', name: 'CRM', icon: 'Target', category: 'management', accent: '#0D9488',
    shortDescription: 'Clientes y contactos, pipeline de oportunidades, KPIs comerciales.' },
  { id: 'personal', slug: 'personal', name: 'Team', icon: 'Users', category: 'management', accent: '#0F172A',
    shortDescription: 'Quién es quién, contacto y organigrama del equipo.' },
  { id: 'herramientas', slug: 'herramientas', name: 'Herramientas', icon: 'BarChart3', category: 'tools', accent: '#16834D',
    shortDescription: 'Utilidades transversales del grupo: proyecciones y P&L de eventos.' },
  { id: 'configuracion', slug: 'configuracion', name: 'Configuración', icon: 'Settings', category: 'tools', accent: '#475569',
    shortDescription: 'Plantillas de correo, notificaciones y ajustes generales.' },
];
