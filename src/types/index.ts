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
