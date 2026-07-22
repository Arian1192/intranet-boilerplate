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
