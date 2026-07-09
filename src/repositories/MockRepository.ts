import type {
  AnalyticsSummary,
  Artist,
  BookingDashboard,
  Dashboard,
  Delivery,
  Influencer,
  InventoryItem,
  LogisticsItem,
  PrAccount,
  PrAction,
  PrDashboard,
  ProductionEvent,
  SeedingReportRow,
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
          name: 'ConceptOne',
          shortDescription: 'Gestiona shows y su calculadora, liquidaciones, fichas de artistas, logística y reportes.',
          icon: 'Headphones',
          category: 'business',
          accent: '#773C9F',
        },
        {
          id: 'etra',
          slug: 'etra',
          name: 'Etra',
          shortDescription: 'Lleva las cuentas de PR, las acciones del equipo y el seeding a influencers (inventario, entregas y reporte).',
          icon: 'Megaphone',
          category: 'business',
          accent: '#2563EB',
        },
        {
          id: 'produccion',
          slug: 'produccion',
          name: 'Producción',
          shortDescription: 'Base de datos de eventos y producciones (vídeo y foto): calendario, tareas, responsables y presupuesto de costes.',
          icon: 'Clapperboard',
          category: 'business',
          accent: '#BE123C',
        },
        {
          id: 'euphoric',
          slug: 'euphoric',
          name: 'Euphoric Media',
          shortDescription: 'Euphoric Media: cuentas de marketing, campañas (RRSS, paid, contenido) y calendario de publicaciones.',
          icon: 'Sparkles',
          category: 'business',
          accent: '#DB2777',
        },
        {
          id: 'creativos',
          slug: 'creativos',
          name: 'Creativos',
          shortDescription: 'Equipo de diseño: tablero de piezas (estáticos, animados, vídeo) para Euphoric, clientes del CRM y empresas internas.',
          icon: 'Palette',
          category: 'business',
          accent: '#7C3AED',
        },
        {
          id: 'cruda',
          slug: 'cruda',
          name: 'CRUDA',
          shortDescription: 'Catálogo, pedidos y control de stock de ropa y merch, con analítica y portal de reposiciones para clientes.',
          icon: 'Shirt',
          category: 'business',
          accent: '#171717',
        },
        {
          id: 'crm',
          slug: 'crm',
          name: 'CRM',
          shortDescription: 'Base de clientes y contactos, pipeline de oportunidades, KPIs comerciales.',
          icon: 'Target',
          category: 'internal',
          accent: '#64748B',
        },
        {
          id: 'personal',
          slug: 'personal',
          name: 'Team',
          shortDescription: 'Personas del grupo, condiciones y RRHH, vacaciones y gestión de usuarios.',
          icon: 'Users',
          category: 'internal',
          accent: '#64748B',
        },
        {
          id: 'configuracion',
          slug: 'configuracion',
          name: 'Configuración',
          shortDescription: 'Plantillas de correo y ajustes generales de la intranet.',
          icon: 'Settings',
          category: 'internal',
          accent: '#64748B',
        },
      ],
      news: [
        {
          id: 'news-1',
          author: 'Ana López',
          scope: 'Grupo',
          date: '06 jul 2026',
          title: 'Comida de verano, ganas de pasar un rato con todos vosotros! 🍻',
          content:
            'Nos vemos el viernes para la comida de verano del equipo. Habrá barra libre y sorpresas. Confirma tu asistencia para reservar sitio.',
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
          content:
            'Debido a la instalación de las nuevas máquinas de aire acondicionado establecemos teletrabajo hasta el 7 de julio inclusive. Estad atentos a próximas novedades.',
        },
      ],
      upcomingEvents: [
        {
          id: 'event-1',
          title: 'Mixmag Intimate Sessions: BLOND:ISH',
          date: '15 jul 2026',
          timeRange: '20:00–21:30',
          location: 'Soho Farmhouse, Ibiza',
          status: 'confirmed',
        },
        {
          id: 'event-2',
          title: 'Please Quiet x SIGHT',
          date: '18 jul 2026',
          timeRange: '18:00–23:00',
          location: 'Cósmico - SLS Barcelona, Barcelona',
          status: 'in-production',
        },
      ],
      reminders: [],
    });
  }

  async getBookingDashboard(): Promise<BookingDashboard> {
    return this.delay({
      kpis: [
        { id: '1', label: 'TENTATIVE', amount: 2000, count: 1, status: 'tentative' },
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
          title: 'Los Canarios @ FUEGO',
          date: '18 jul 2026',
          daysLeft: 9,
          badges: ['Contrato sin firmar', 'Depósito pendiente', 'Falta firmante'],
        },
        {
          id: 'a2',
          title: 'Bizza @ Paradise - Bunker',
          date: '25 jul 2026',
          daysLeft: 16,
          badges: ['Contrato sin firmar', 'Depósito pendiente', 'Falta firmante'],
        },
        {
          id: 'a3',
          title: 'Brenda Serna @ Alcazar de San Juan',
          date: '04 sept 2026',
          daysLeft: 57,
          badges: ['Contrato sin firmar', 'Falta firmante'],
        },
      ],
      logistics: [
        {
          id: 'l1',
          title: 'Los Canarios @ FUEGO',
          date: '18 jul 2026',
          daysLeft: 9,
          badges: ['Pendiente logística', 'Sin set times', 'Gastos sin cerrar'],
        },
        {
          id: 'l2',
          title: 'Bizza @ Paradise - Bunker',
          date: '25 jul 2026',
          daysLeft: 16,
          badges: ['Pendiente logística', 'Sin set times', 'Gastos sin cerrar'],
        },
        {
          id: 'l3',
          title: 'Brenda Serna @ Alcazar de San Juan',
          date: '04 sept 2026',
          daysLeft: 57,
          badges: ['Pendiente logística', 'Sin set times'],
        },
      ],
      upcomingShows: [
        {
          id: 'u1',
          title: 'Los Canarios @ FUEGO',
          date: '18 jul 2026',
          daysLeft: 9,
          badges: ['Confirmado', 'No abonado'],
        },
        {
          id: 'u2',
          title: 'Bizza @ Paradise - Bunker',
          date: '25 jul 2026',
          daysLeft: 16,
          badges: ['Confirmado', 'No abonado'],
        },
        {
          id: 'u3',
          title: 'Brenda Serna @ Alcazar de San Juan',
          date: '04 sept 2026',
          daysLeft: 57,
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

  async getPrDashboard(): Promise<PrDashboard> {
    return this.delay({
      activeAccounts: 2,
      totalAccounts: 2,
      billingThisMonth: 0,
      upcomingActions: [
        {
          id: 'pa1',
          date: '16 jul 2026',
          title: 'Acción de prensa Cliente A',
          meta: 'Cliente A · Evento',
          badge: 'En curso',
        },
      ],
      recentCoverage: [
        {
          id: 'rc1',
          date: '08 jul 2026',
          title: 'Mención en medios',
          meta: 'Cliente A · Prensa Digital',
        },
      ],
    });
  }

  async getPrActions(): Promise<PrAction[]> {
    return this.delay([
      {
        id: 'act1',
        title: 'Acción de prensa Cliente A',
        account: 'Cliente A',
        type: 'Evento',
        amount: 10000,
        status: 'in-progress',
        date: '16 jul 2026',
        responsible: 'Sin asignar',
        commissionPct: 20,
        includedInFee: true,
        budgetLines: [
          { id: 'bl1', description: 'Foto / Vídeo (Ana)', amount: 400, status: 'paid' },
          { id: 'bl2', description: 'Staff', amount: 140, status: 'pending-payment' },
          { id: 'bl3', description: 'Talent', amount: 1500, status: 'pending-payment' },
          { id: 'bl4', description: 'Talent', amount: 1500, status: 'proposed' },
        ],
      },
    ]);
  }

  async getInventory(): Promise<InventoryItem[]> {
    return this.delay([
      { id: 'inv1', name: 'Gorra Edición Limitada', variant: '8 · Rojo', ref: 'REF-0001', quantity: 6 },
      { id: 'inv2', name: 'Camiseta Colección', variant: 'M · Negro', ref: 'REF-0002', quantity: 12 },
    ]);
  }

  async getDeliveries(): Promise<Delivery[]> {
    return this.delay([
      {
        id: 'del1',
        date: '07 jul 2026',
        account: 'Cliente A',
        method: 'internal',
        status: 'delivered',
        published: false,
        recipient: 'Ana López',
        itemsSummary: '1× Gorra Edición Limitada · 8',
        piecesCount: 1,
        cost: 0,
      },
      {
        id: 'del2',
        date: '07 jul 2026',
        account: 'Cliente A',
        method: 'mrw',
        status: 'delivered',
        published: true,
        recipient: 'Carlos Ruiz',
        itemsSummary: '2× Gorra Edición Limitada · 8',
        piecesCount: 2,
        cost: 0,
      },
      {
        id: 'del3',
        date: '06 jul 2026',
        account: 'Cliente A',
        method: 'mrw',
        status: 'delivered',
        published: true,
        recipient: 'Carlos Ruiz',
        itemsSummary: '1× Gorra Edición Limitada · 8',
        piecesCount: 1,
        cost: 0,
      },
    ]);
  }

  async getInfluencers(): Promise<Influencer[]> {
    return this.delay([
      {
        id: 'inf1',
        name: 'Carlos Ruiz',
        initials: 'CR',
        instagramFollowers: 245000,
        tiktokFollowers: 26200,
        email: 'carlos.ruiz@example.com',
      },
      { id: 'inf2', name: 'María García', initials: 'MG', instagramFollowers: 335000 },
    ]);
  }

  async getSeedingReport(): Promise<SeedingReportRow[]> {
    return this.delay([
      { date: '07 jul 2026', influencer: 'Carlos Ruiz', pieces: 2, productCost: 0, shippingCost: 0, publicationStatus: 'Publicado', reach: null },
      { date: '06 jul 2026', influencer: 'Carlos Ruiz', pieces: 1, productCost: 0, shippingCost: 0, publicationStatus: 'Publicado', reach: null },
    ]);
  }

  async getPrAccounts(): Promise<PrAccount[]> {
    return this.delay([
      {
        id: 'acc1',
        name: 'Cliente A',
        status: 'active',
        manager: 'Ana López',
        crmClient: 'Cliente A',
        contact: 'Jack Contacto',
        signupDate: '01 ene 2026',
        email: 'contacto@cliente-a.example.com',
        phone: '+34 600 000 001',
        obligations: [
          { id: 'ob1', label: 'Notas de prensa', cadence: 'Mensual', period: '2026-07', done: 0, target: 4 },
        ],
        coverage: [
          { id: 'cov1', date: '08 jul 2026', title: 'Mención en medios', outlet: 'Prensa Digital', channel: 'Online', value: 1000 },
        ],
        billing: {
          defaultRetainer: 5500,
          defaultCommissionPct: 20,
          months: [
            { id: 'm7', label: 'Jul 2026', retainer: 5500, commissions: 2000, others: 0 },
            { id: 'm6', label: 'Jun 2026', retainer: 5500, commissions: null, others: 0 },
            { id: 'm5', label: 'May 2026', retainer: 5500, commissions: null, others: 0 },
            { id: 'm4', label: 'Abr 2026', retainer: 5500, commissions: null, others: 0 },
            { id: 'm3', label: 'Mar 2026', retainer: 5500, commissions: null, others: 0 },
            { id: 'm2', label: 'Feb 2026', retainer: 5500, commissions: null, others: 0 },
            { id: 'm1', label: 'Ene 2026', retainer: 5500, commissions: null, others: 0 },
          ],
        },
      },
      {
        id: 'acc2',
        name: 'Cliente B',
        status: 'active',
        manager: 'Carlos Ruiz',
        crmClient: 'Cliente B',
        contact: 'Laura Contacto',
        obligations: [],
        coverage: [],
        billing: { defaultRetainer: 0, defaultCommissionPct: 20, months: [] },
      },
    ]);
  }

  async getProductionEvents(): Promise<ProductionEvent[]> {
    return this.delay([
      {
        id: 'ev1',
        title: 'Evento Primavera',
        icon: '🎫',
        date: '15 jul 2026',
        isoDate: '2026-07-15',
        time: '20:00–21:30',
        venue: 'Sala Norte, Madrid',
        businessLines: ['Línea A'],
        manager: 'Ana López',
        isHome: true,
        status: 'confirmed',
      },
      {
        id: 'ev2',
        title: 'Proyecto Q3',
        icon: '🎫',
        date: '18 jul 2026',
        isoDate: '2026-07-18',
        time: '18:00–23:00',
        venue: 'Espacio Central, Valencia',
        businessLines: ['Línea B', 'Línea A'],
        manager: 'Carlos Ruiz',
        isHome: true,
        role: 'promoter',
        status: 'in-production',
      },
    ]);
  }
}
