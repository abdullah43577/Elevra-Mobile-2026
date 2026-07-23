export type AuthProvider = "PASSWORD" | "GOOGLE" | "APPLE";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type AccountStatus = "ACTIVE" | "DEACTIVATED";
export type Theme = "SYSTEM" | "LIGHT" | "DARK";

export interface UserSettings {
  id: string;
  userId: string;
  theme: Theme;
  notifications: boolean;
  subscriptionTier: string;
}

export interface Profession {
  id: string;
  name: string;
  category: string | null;
}

export interface User {
  email: string;
  id: string;
  first_name: string | null;
  last_name: string | null;
  authProvider: AuthProvider;
  profile_pic: string | null;
  gender: Gender | null;
  has_validated_email: boolean;
  googleId: string | null;
  failedLoginAttempts: number;
  isLocked: boolean;
  lastLogin: Date;
  account_status: AccountStatus;
  has_onboarded: boolean;
  isGuest: boolean;
  createdAt: Date;
  updatedAt: Date;
  professionId: string | null;
  profession: Profession | null;
  settings: UserSettings | null;
}
