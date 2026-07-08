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

  // Comunicación & PR
  getPrDashboard(): Promise<PrDashboard>;
  getPrActions(): Promise<PrAction[]>;
  getInventory(): Promise<InventoryItem[]>;
  getDeliveries(): Promise<Delivery[]>;
  getInfluencers(): Promise<Influencer[]>;
  getSeedingReport(): Promise<SeedingReportRow[]>;
  getPrAccounts(): Promise<PrAccount[]>;

  // Producción
  getProductionEvents(): Promise<ProductionEvent[]>;
}
