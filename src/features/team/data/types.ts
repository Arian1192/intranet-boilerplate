export interface Person {
  id: string;
  name: string;
  positions: string[];
  primaryPosition?: string;
  department?: string;
  email?: string;
  phone?: string;
  managerId?: string;
  photoUrl?: string;
  avatarColor: string;
}

export type AbsenceType = 'vacaciones' | 'teletrabajo' | 'baja' | 'ausencia';

export interface Absence {
  id: string;
  personId: string;
  type: AbsenceType;
  startDate: string;
  endDate: string;
  approved: boolean;
}

export type CompanyId = 'conceptone' | 'cruda' | 'etra' | 'euphoric' | 'mixmag' | 'tagmag';

export interface Company {
  id: CompanyId;
  name: string;
  colorHex: string;
  monthlyCost: number;
}

export interface Ficha {
  id: string;
  personId: string;
  companyIds: CompanyId[];
  employmentType: 'contratado' | 'freelance';
  monthlyCost?: number;
  hasAccount: boolean;
  active: boolean;
  birthDate?: string;
  dni?: string;
  ssNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  vacationDaysPerYear?: number;
  probationEndDate?: string;
  ssPercent?: number;
  notes?: string;
}
