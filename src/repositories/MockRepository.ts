import type { Dashboard, User, UserSession } from '@/types';
import type { Repository } from './types';

export class MockRepository implements Repository {
  private latency = 300;

  private delay<T>(value: T): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(value), this.latency));
  }

  async login(email: string, password: string): Promise<UserSession> {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    return this.delay({
      user: {
        id: 'user-1',
        email,
        name: 'Test User',
        role: 'Admin',
      },
      accessToken: 'mock-token',
    });
  }

  async getCurrentUser(): Promise<User | null> {
    return this.delay({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'Admin',
    });
  }

  async logout(): Promise<void> {
    return this.delay(undefined);
  }

  async getDashboard(): Promise<Dashboard> {
    return this.delay({
      greeting: 'Hola, Test',
      birthdayNotice: 'El cumple de un compañero es en 3 días 🎂',
      weather: 'Madrid · 34° / 23°',
      modules: [
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
      ],
      news: [
        {
          id: 'news-1',
          author: 'Ana López',
          scope: 'Grupo',
          date: '06 jul 2026',
          title: 'Comida de verano, ganas de pasar un rato con todos vosotros! 🍻',
          scheduledFor: 'Programada 09 jul 2026',
          actionLabel: 'Confirmar asistencia',
          actionHref: '#',
        },
        {
          id: 'news-2',
          author: 'Ana López',
          scope: 'Grupo',
          date: '05 jul 2026',
          title: 'Teletrabajo hasta el 7 de julio incluido',
        },
      ],
      upcomingEvents: [
        {
          id: 'event-1',
          title: 'Festival Primavera Interna',
          date: '15 jul 2026',
          timeRange: '20:00–21:30',
          location: 'Sala Norte, Madrid',
          status: 'confirmed',
        },
        {
          id: 'event-2',
          title: 'Evento Corporativo Q3',
          date: '18 jul 2026',
          timeRange: '18:00–23:00',
          location: 'Terraza Este, Valencia',
          status: 'in-production',
        },
      ],
      reminders: [],
    });
  }
}
