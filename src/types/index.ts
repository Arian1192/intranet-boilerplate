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
