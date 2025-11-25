export interface AccountModel {
  id: string;
  fullname: string;
  phoneNumber: string;
  email?: string;
  joinedDate: string;
  isActive: boolean;
  roleName: AccountRole;
  gender?: boolean;
  address?: string;
  dateOfBirth?: string;
  totalPoints: number;
  totalSpin: number;
}

export interface BasicAccountModel {
  fullname: string;
  phoneNumber: string;
  email?: string;
  gender?: boolean;
  dateOfBirth?: string;
}

export const AccountRoles = {
  User: "User",
  Manager: "Manager",
} as const;

export type AccountRole = keyof typeof AccountRoles;
