export type View =
  | 'overview'
  | 'residents'
  | 'notifications'
  | 'statistics'
  | 'services'
  | 'expenses'
  | 'shifts'
  | 'complains';

export type ResidentRecord = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: string;
  temporaryStatus: boolean;
  apartment?: { name?: string };
};

export const residentRoles = [
  { value: 'resident', label: 'Cư dân' },
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'police', label: 'Công an' },
  { value: 'guard', label: 'Bảo vệ' },
  { value: 'accountant', label: 'Kế toán' },
];

