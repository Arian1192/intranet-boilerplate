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
import type { Repository } from '../types';

export class RestAdapter implements Repository {
  async login(_email: string, _password: string): Promise<UserSession> {
    throw new Error('RestAdapter not implemented in Fase 1');
  }

  async getCurrentUser(): Promise<User | null> {
    throw new Error('RestAdapter not implemented in Fase 1');
  }

  async logout(): Promise<void> {
    throw new Error('RestAdapter not implemented in Fase 1');
  }

  async getDashboard(): Promise<Dashboard> {
    throw new Error('RestAdapter not implemented in Fase 1');
  }

  async getBookingDashboard(): Promise<BookingDashboard> {
    throw new Error('RestAdapter not implemented in Fase 2');
  }

  async getShows(): Promise<Show[]> {
    throw new Error('RestAdapter not implemented in Fase 2');
  }

  async getLogistics(): Promise<LogisticsItem[]> {
    throw new Error('RestAdapter not implemented in Fase 2');
  }

  async getArtists(): Promise<Artist[]> {
    throw new Error('RestAdapter not implemented in Fase 2');
  }

  async getAnalytics(): Promise<AnalyticsSummary> {
    throw new Error('RestAdapter not implemented in Fase 2');
  }

  async getPrDashboard(): Promise<PrDashboard> {
    throw new Error('RestAdapter not implemented in Fase 3');
  }

  async getPrActions(): Promise<PrAction[]> {
    throw new Error('RestAdapter not implemented in Fase 3');
  }

  async getInventory(): Promise<InventoryItem[]> {
    throw new Error('RestAdapter not implemented in Fase 3');
  }

  async getDeliveries(): Promise<Delivery[]> {
    throw new Error('RestAdapter not implemented in Fase 3');
  }

  async getInfluencers(): Promise<Influencer[]> {
    throw new Error('RestAdapter not implemented in Fase 3');
  }

  async getSeedingReport(): Promise<SeedingReportRow[]> {
    throw new Error('RestAdapter not implemented in Fase 3');
  }

  async getPrAccounts(): Promise<PrAccount[]> {
    throw new Error('RestAdapter not implemented in Fase 3');
  }

  async getProductionEvents(): Promise<ProductionEvent[]> {
    throw new Error('RestAdapter not implemented in Fase 3');
  }
}
