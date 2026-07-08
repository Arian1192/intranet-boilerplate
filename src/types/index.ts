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
  category: 'business' | 'internal';
}

export interface NewsItem {
  id: string;
  author: string;
  scope: string;
  date: string;
  title: string;
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

export interface Show {
  id: string;
  name: string;
  client: string;
  date: string;
  status: ShowStatus;
  amount: number;
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
export interface PrAction {
  id: string;
  title: string;
  account: string;
  type: string;
  amount: number;
  status: ActionStatus;
  date: string;
}

export type DeliveryTag = 'internal-use' | 'mrw-shipment' | 'delivered' | 'published';
export interface Delivery {
  id: string;
  date: string;
  account: string;
  tags: DeliveryTag[];
  recipient: string;
  itemsSummary: string;
  amount: number;
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
}

export interface SeedingReportRow {
  date: string;
  influencer: string;
  pieces: number;
  productCost: number;
  shippingCost: number;
  publicationStatus: string;
}

export type AccountStatus = 'active' | 'paused' | 'inactive';
export interface PrAccount {
  id: string;
  name: string;
  status: AccountStatus;
  manager: string;
  crmClient: string;
  contact: string;
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
