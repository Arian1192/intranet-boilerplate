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

export interface Repository {
  login(email: string, password: string): Promise<UserSession>;
  getCurrentUser(): Promise<User | null>;
  logout(): Promise<void>;
  getDashboard(): Promise<Dashboard>;

  getBookingDashboard(): Promise<BookingDashboard>;
  getShows(): Promise<Show[]>;
  getLogistics(): Promise<LogisticsItem[]>;
  getArtists(): Promise<Artist[]>;
  getAnalytics(): Promise<AnalyticsSummary>;
}
