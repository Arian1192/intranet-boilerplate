export interface HrSettings {
  ssEmployerPercent: number;
  workingDaysPerMonth: number;
  hoursPerMonth: number;
  freelanceVatPercent: number;
  freelanceIrpfPercent: number;
  contractEndNoticeDays: number[];
  probationEndNoticeDays: number[];
  salaryReviewNoticeDays: number[];
  notifyBirthdays: boolean;
}

export type DepartmentColor = 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'cyan' | 'pink' | 'amber';

export interface Department {
  id: string;
  name: string;
  color: DepartmentColor;
  active: boolean;
}

export const DEPARTMENT_COLORS: DepartmentColor[] = ['blue', 'green', 'orange', 'red', 'purple', 'cyan', 'pink', 'amber'];

const HR_SETTINGS: HrSettings = {
  ssEmployerPercent: 31.5,
  workingDaysPerMonth: 21,
  hoursPerMonth: 160,
  freelanceVatPercent: 21,
  freelanceIrpfPercent: 15,
  contractEndNoticeDays: [60, 30, 15],
  probationEndNoticeDays: [15, 7],
  salaryReviewNoticeDays: [30],
  notifyBirthdays: true,
};

const DEPARTMENTS: Department[] = [
  { id: 'dept-advancing', name: 'Advancing', color: 'blue', active: true },
  { id: 'dept-board', name: 'Board', color: 'amber', active: true },
  { id: 'dept-booking', name: 'Booking', color: 'blue', active: true },
  { id: 'dept-comercial', name: 'Comercial', color: 'orange', active: true },
  { id: 'dept-comunicacion', name: 'Comunicación & PR', color: 'purple', active: true },
  { id: 'dept-diseno', name: 'Diseño', color: 'green', active: true },
  { id: 'dept-logistica', name: 'Logística', color: 'blue', active: true },
  { id: 'dept-management', name: 'Management', color: 'blue', active: true },
  { id: 'dept-marketing', name: 'Marketing', color: 'pink', active: true },
  { id: 'dept-paidads', name: 'Paid Ads', color: 'amber', active: true },
  { id: 'dept-redaccion', name: 'Redacción', color: 'cyan', active: true },
  { id: 'dept-video', name: 'Vídeo', color: 'red', active: true },
];

export function hrSettings(): HrSettings {
  return {
    ...HR_SETTINGS,
    contractEndNoticeDays: [...HR_SETTINGS.contractEndNoticeDays],
    probationEndNoticeDays: [...HR_SETTINGS.probationEndNoticeDays],
    salaryReviewNoticeDays: [...HR_SETTINGS.salaryReviewNoticeDays],
  };
}

export function departments(): Department[] {
  return DEPARTMENTS.map((d) => ({ ...d }));
}
