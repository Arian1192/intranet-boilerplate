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
