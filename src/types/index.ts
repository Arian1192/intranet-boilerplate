export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface UserSession {
  user: User;
  accessToken: string;
}

export interface Module {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  icon: string;
  category: 'workspace' | 'management' | 'tools';
  /** Hex accent color for the icon chip background (rendered at 8% alpha). */
  accent?: string;
}

export interface NewsItem {
  id: string;
  author: string;
  scope: string;
  date: string;
  title: string;
  content?: string;
  scheduledFor?: string;
  actionLabel?: string;
  actionHref?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  timeRange: string;
  location: string;
  status: 'confirmed' | 'in-production' | 'tentative';
}

export interface Reminder {
  id: string;
  title: string;
}

export interface Dashboard {
  greeting: string;
  birthdayNotice?: string;
  festivoNotice?: string;
  weather: string;
  modules: Module[];
  news: NewsItem[];
  upcomingEvents: Event[];
  reminders: Reminder[];
}

export type ShowStatus =
  | 'tentative'
  | 'offer'
  | 'confirmed'
  | 'contract'
  | 'pending-payment'
  | 'pending-settlement'
  | 'done';

export interface Kpi {
  id: string;
  label: string;
  amount: number;
  count: number;
  status: ShowStatus;
}

export interface ShowSummary {
  id: string;
  title: string;
  date: string;
  daysLeft: number;
  badges: string[];
}

export interface BookingDashboard {
  kpis: Kpi[];
  advancing: ShowSummary[];
  logistics: ShowSummary[];
  upcomingShows: ShowSummary[];
}

export type DealType = 'All In' | 'Landed' | '+++';
export type PaymentStatus =
  | 'No abonado'
  | 'Parcialmente abonado'
  | 'Pendiente liquidar'
  | 'Liquidado'
  | 'Incidencia';
export type ArtStatus = 'Arte no subido' | 'Arte pendiente' | 'Arte subido';
export type ShowFase =
  | 'tentative'
  | 'confirmed'
  | 'contract'
  | 'pagos'
  | 'liquidacion'
  | 'liquidado'
  | 'cancelado';

export interface Show {
  id: string;
  code: string;
  date: string | null;
  artist: string;
  event: string;
  venue: string | null;
  country: string | null;
  etapa: ShowStatus;
  fase: ShowFase;
  dealType: DealType;
  fee: number;
  bf: number;
  mf: number;
  paymentStatus: PaymentStatus;
  artStatus: ArtStatus;
  exception: boolean;
}

export interface LogisticsItem {
  id: string;
  title: string;
  tasks: { id: string; label: string; done: boolean }[];
}

export interface Artist {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
}

export interface AnalyticsSummary {
  stats: { label: string; value: string; change?: string }[];
}

// Comunicación & PR
export type ActionStatus = 'planned' | 'in-progress' | 'done' | 'cancelled';
export type BudgetLineStatus = 'proposed' | 'pending-payment' | 'paid';
export interface ActionBudgetLine {
  id: string;
  description: string;
  amount: number;
  status: BudgetLineStatus;
}
export interface PrAction {
  id: string;
  title: string;
  account: string;
  type: string;
  amount: number;
  status: ActionStatus;
  date: string;
  responsible?: string;
  commissionPct?: number;
  includedInFee?: boolean;
  budgetLines?: ActionBudgetLine[];
}

export type DeliveryMethod = 'mrw' | 'hand' | 'internal';
export type DeliveryStatus = 'prepared' | 'shipped' | 'delivered';
export interface Delivery {
  id: string;
  date: string;
  account: string;
  method: DeliveryMethod;
  status: DeliveryStatus;
  published: boolean;
  recipient: string;
  itemsSummary: string;
  piecesCount: number;
  cost: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  variant: string;
  ref: string;
  quantity: number;
}

export interface Influencer {
  id: string;
  name: string;
  initials: string;
  instagramFollowers?: number;
  tiktokFollowers?: number;
  email?: string;
}

export interface SeedingReportRow {
  date: string;
  influencer: string;
  pieces: number;
  productCost: number;
  shippingCost: number;
  publicationStatus: string;
  reach: number | null;
}

export interface AccountObligation {
  id: string;
  label: string;
  cadence: string;
  period: string;
  done: number;
  target: number;
}
export interface CoverageItem {
  id: string;
  date: string;
  title: string;
  outlet: string;
  channel: string;
  value: number;
}
export interface AccountBillingMonth {
  id: string;
  label: string;
  retainer: number;
  commissions: number | null;
  others: number;
}
export type AccountStatus = 'active' | 'paused' | 'inactive';
export interface PrAccount {
  id: string;
  name: string;
  status: AccountStatus;
  manager: string;
  crmClient: string;
  contact: string;
  signupDate?: string;
  email?: string;
  phone?: string;
  notes?: string;
  obligations: AccountObligation[];
  coverage: CoverageItem[];
  billing: {
    defaultRetainer: number;
    defaultCommissionPct: number;
    months: AccountBillingMonth[];
  };
}

export interface ActivityItem {
  id: string;
  date: string;
  title: string;
  meta?: string;
  badge?: string;
}

export interface PrDashboard {
  activeAccounts: number;
  totalAccounts: number;
  billingThisMonth: number;
  upcomingActions: ActivityItem[];
  recentCoverage: ActivityItem[];
}

// Producción
export type EventStatus = 'idea' | 'confirmed' | 'in-production' | 'in-progress' | 'closed';
export interface ProductionEvent {
  id: string;
  title: string;
  icon: string;
  date: string;
  isoDate: string;
  time: string;
  venue: string;
  businessLines: string[];
  manager?: string;
  isHome: boolean;
  role?: 'promoter';
  status: EventStatus;
}
