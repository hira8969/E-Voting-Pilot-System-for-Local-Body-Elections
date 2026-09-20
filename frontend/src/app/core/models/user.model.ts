export type UserRole = 'VOTER' | 'ADMIN' | 'PARTY_REP' | 'OFFICER' | 'OBSERVER' | 'SUPER_ADMIN' | 'SYSTEM_ADMIN';

export interface User {
  id: number | string;
  fullName?: string;
  name?: string;
  email: string;
  phone?: string;
  mobileNumber?: string;
  epicNumber?: string;
  voterId?: string;
  constituency: string;
  role: UserRole;
  isVerified?: boolean;
  hasVoted?: boolean;
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | string;
  wardNumber?: string;
  pollingBoothId?: string;
  avatarUrl?: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface LoginRequest {
  emailOrEpic: string;
  password?: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  epicNumber: string;
  constituency: string;
  password?: string;
}

export interface OtpVerifyRequest {
  epicNumber: string;
  otp: string;
}
