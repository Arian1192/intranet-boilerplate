import type {
  AnalyticsSummary,
  Artist,
  BookingDashboard,
  Dashboard,
  LogisticsItem,
  Show,
  User,
  UserSession,
} from '@/types';
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

  async getBookingDashboard(): Promise<BookingDashboard> {
    return this.delay({
      kpis: [
        { id: '1', label: 'TENTATIVE', amount: 0, count: 0, status: 'tentative' },
        { id: '2', label: 'OFERTA', amount: 0, count: 0, status: 'offer' },
        { id: '3', label: 'CONFIRMADO', amount: 7000, count: 4, status: 'confirmed' },
        { id: '4', label: 'CONTRATO', amount: 0, count: 0, status: 'contract' },
        { id: '5', label: 'PENDIENTE PAGO', amount: 800, count: 1, status: 'pending-payment' },
        { id: '6', label: 'PENDIENTE LIQUIDAR', amount: 0, count: 0, status: 'pending-settlement' },
        { id: '7', label: 'CELEBRADO', amount: 0, count: 0, status: 'done' },
      ],
      advancing: [
        {
          id: 'a1',
          title: 'Evento Primavera @ Sala Norte',
          date: '18 jul 2026',
          daysLeft: 10,
          badges: ['Contrato sin firmar', 'Depósito pendiente', 'Falta firmante'],
        },
        {
          id: 'a2',
          title: 'Proyecto Q3 @ Espacio Central',
          date: '25 jul 2026',
          daysLeft: 17,
          badges: ['Contrato sin firmar', 'Depósito pendiente', 'Falta firmante'],
        },
        {
          id: 'a3',
          title: 'Campaña Verano @ Terraza Este',
          date: '04 sept 2026',
          daysLeft: 58,
          badges: ['Contrato sin firmar', 'Falta firmante'],
        },
      ],
      logistics: [
        {
          id: 'l1',
          title: 'Evento Primavera @ Sala Norte',
          date: '18 jul 2026',
          daysLeft: 10,
          badges: ['Pendiente logística', 'Sin set times', 'Gastos sin cerrar'],
        },
        {
          id: 'l2',
          title: 'Proyecto Q3 @ Espacio Central',
          date: '25 jul 2026',
          daysLeft: 17,
          badges: ['Pendiente logística', 'Sin set times', 'Gastos sin cerrar'],
        },
        {
          id: 'l3',
          title: 'Campaña Verano @ Terraza Este',
          date: '04 sept 2026',
          daysLeft: 58,
          badges: ['Pendiente logística', 'Sin set times'],
        },
      ],
      upcomingShows: [
        {
          id: 'u1',
          title: 'Evento Primavera @ Sala Norte',
          date: '18 jul 2026',
          daysLeft: 10,
          badges: ['Confirmado', 'No abonado'],
        },
        {
          id: 'u2',
          title: 'Proyecto Q3 @ Espacio Central',
          date: '25 jul 2026',
          daysLeft: 17,
          badges: ['Confirmado', 'No abonado'],
        },
        {
          id: 'u3',
          title: 'Campaña Verano @ Terraza Este',
          date: '04 sept 2026',
          daysLeft: 58,
          badges: ['Confirmado', 'No abonado'],
        },
      ],
    });
  }

  async getShows(): Promise<Show[]> {
    return this.delay([
      { id: 's1', name: 'Evento Primavera', client: 'Cliente A', date: '15 jul 2026', status: 'confirmed', amount: 3500 },
      { id: 's2', name: 'Proyecto Q3', client: 'Cliente B', date: '18 jul 2026', status: 'pending-payment', amount: 800 },
      { id: 's3', name: 'Campaña Verano', client: 'Cliente C', date: '25 jul 2026', status: 'confirmed', amount: 2200 },
      { id: 's4', name: 'Lanzamiento Producto', client: 'Cliente D', date: '04 sept 2026', status: 'contract', amount: 1500 },
    ]);
  }

  async getLogistics(): Promise<LogisticsItem[]> {
    return this.delay([
      {
        id: 'log1',
        title: 'Evento Primavera',
        tasks: [
          { id: 't1', label: 'Confirmar itinerario', done: false },
          { id: 't2', label: 'Reservar vuelos', done: false },
          { id: 't3', label: 'Definir horarios', done: true },
        ],
      },
      {
        id: 'log2',
        title: 'Proyecto Q3',
        tasks: [
          { id: 't4', label: 'Confirmar itinerario', done: false },
          { id: 't5', label: 'Reservar alojamiento', done: false },
        ],
      },
    ]);
  }

  async getArtists(): Promise<Artist[]> {
    return this.delay([
      { id: 'ar1', name: 'Ana López', role: 'Directora', email: 'ana@example.com' },
      { id: 'ar2', name: 'Carlos Ruiz', role: 'Productor', email: 'carlos@example.com' },
      { id: 'ar3', name: 'María García', role: 'Técnica', email: 'maria@example.com' },
      { id: 'ar4', name: 'Laura Martín', role: 'Manager', email: 'laura@example.com' },
    ]);
  }

  async getAnalytics(): Promise<AnalyticsSummary> {
    return this.delay({
      stats: [
        { label: 'Items este mes', value: '12', change: '+20%' },
        { label: 'Ingresos', value: '18.400 €', change: '+8%' },
        { label: 'Pendientes', value: '3', change: '-1' },
        { label: 'Confirmados', value: '7', change: '+2' },
      ],
    });
  }
}
