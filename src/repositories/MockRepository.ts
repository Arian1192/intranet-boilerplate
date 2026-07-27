import { MODULES } from '@/lib/constants';
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
      festivoNotice: 'Faltan 25 días para el próximo festivo (L’Assumpció) 🎉',
      weather: '☁️ Barcelona · 31° / 25°',
      modules: MODULES,
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
        { id: '1', label: 'TENTATIVE', amount: 5679.48, count: 7, status: 'tentative' },
        { id: '2', label: 'CONFIRMADO', amount: 10200, count: 8, status: 'confirmed' },
        { id: '3', label: 'CONTRATO', amount: 0, count: 0, status: 'contract' },
        { id: '4', label: 'PENDIENTE COBRO', amount: 0, count: 0, status: 'pending-payment' },
        { id: '5', label: 'PENDIENTE LIQUIDAR', amount: 1850, count: 3, status: 'pending-settlement' },
        { id: '6', label: 'LIQUIDADO', amount: 3500, count: 2, status: 'done' },
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
      { id: 's12', code: 'C1-2026-012', date: '18 jul 2026', artist: 'Abdon', event: 'FUNDAYS', venue: 'Bassment', country: 'España', etapa: 'tentative', fase: 'tentative', dealType: 'All In', fee: 0, bf: 0, mf: 0, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
      { id: 's06', code: 'C1-2026-006', date: '18 jul 2026', artist: 'Los Canarios', event: 'FUEGO', venue: 'Edén Ibiza', country: 'España', etapa: 'confirmed', fase: 'confirmed', dealType: 'Landed', fee: 3000, bf: 600, mf: 449.58, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: true },
      { id: 's15', code: 'C1-2026-015', date: '21 jul 2026', artist: 'Test Artist', event: 'SIGHT', venue: 'Ku Barcelona', country: 'España', etapa: 'confirmed', fase: 'confirmed', dealType: 'All In', fee: 0, bf: 0, mf: 0, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
      { id: 's14', code: 'C1-2026-014', date: '25 jul 2026', artist: 'Florentia', event: 'Summer Opening Festival', venue: 'Paseo de Santiago, Torreperogil', country: 'España', etapa: 'done', fase: 'liquidado', dealType: 'Landed', fee: 1000, bf: 200, mf: 0, paymentStatus: 'Liquidado', artStatus: 'Arte pendiente', exception: false },
      { id: 's19', code: 'C1-2026-019', date: '26 jul 2026', artist: 'Pau Guilera', event: 'the next', venue: 'Marina Beach Club', country: 'España', etapa: 'confirmed', fase: 'confirmed', dealType: 'Landed', fee: 700, bf: 140, mf: 0, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
      { id: 's21', code: 'C1-2026-021', date: '26 jul 2026', artist: 'Abdon', event: 'SIGHT', venue: 'Ku Barcelona', country: 'España', etapa: 'confirmed', fase: 'confirmed', dealType: 'All In', fee: 1000, bf: 200, mf: 200, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
      { id: 's18', code: 'C1-2026-018', date: '01 ago 2026', artist: 'Milan', event: 'Casa del Mar', venue: 'Casa del Mar', country: 'USA', etapa: 'tentative', fase: 'tentative', dealType: 'All In', fee: 350.56, bf: 70.11, mf: 0, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
      { id: 's20', code: 'C1-2026-020', date: '01 ago 2026', artist: 'Los Canarios', event: 'Solart Fest', venue: 'Hangar 37', country: 'España', etapa: 'confirmed', fase: 'confirmed', dealType: '+++', fee: 2000, bf: 400, mf: 400, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
      { id: 's05', code: 'C1-2026-005', date: '04 sept 2026', artist: 'Brenda Serna', event: 'Alcazar de San Juan', venue: null, country: null, etapa: 'done', fase: 'liquidado', dealType: 'All In', fee: 2500, bf: 500, mf: 0, paymentStatus: 'Parcialmente abonado', artStatus: 'Arte no subido', exception: false },
      { id: 's13', code: 'C1-2026-013', date: '18 sept 2026', artist: 'Sergio Saffe', event: 'el Tebo', venue: 'el Tebo', country: 'Chile', etapa: 'tentative', fase: 'tentative', dealType: 'All In', fee: 875, bf: 175, mf: 0, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
      { id: 's16', code: 'C1-2026-016', date: '25 sept 2026', artist: 'Marian Ariss', event: 'Kevin de Vries Cordoba', venue: 'La Fábrica', country: 'Argentina', etapa: 'tentative', fase: 'tentative', dealType: 'All In', fee: 1226.96, bf: 245.39, mf: 0, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
      { id: 's17', code: 'C1-2026-017', date: '26 sept 2026', artist: 'Marian Ariss', event: 'Kevin de Vries Buenos Aires', venue: 'Mandarine Park', country: 'Argentina', etapa: 'tentative', fase: 'tentative', dealType: 'All In', fee: 1226.96, bf: 245.39, mf: 0, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
      { id: 's11', code: 'C1-2026-011', date: '26 sept 2026', artist: 'ART NO LOGIA', event: 'Jiwa', venue: 'Boho Beer Garden', country: 'Reino Unido', etapa: 'confirmed', fase: 'confirmed', dealType: 'All In', fee: 1800, bf: 360, mf: 272, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
      { id: 's07', code: 'C1-2026-007', date: null, artist: 'Andrea Castells', event: 'Sephora Opening', venue: null, country: null, etapa: 'tentative', fase: 'tentative', dealType: 'All In', fee: 2000, bf: 400, mf: 0, paymentStatus: 'No abonado', artStatus: 'Arte no subido', exception: false },
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
