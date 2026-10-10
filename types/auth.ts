export type AuthProvider = "PASSWORD" | "GOOGLE" | "APPLE";
export type SocialProvider = Exclude<AuthProvider, "PASSWORD">;
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type AccountStatus = "ACTIVE" | "DEACTIVATED";
export type Theme = "SYSTEM" | "LIGHT" | "DARK";
export type SubscriptionTier = "FREE" | "PRO";

export interface UserSettings {
  id: string;
  userId: string;
  theme: Theme;
  notifications: boolean;
  subscriptionTier: SubscriptionTier;
}

export interface Profession {
  id: string;
  name: string;
  category: string | null;
}

/*
  The server trusts `idToken` and nothing else in this payload. The names are
  forwarded only because Apple discloses them on the first authorization and
  never again, so if the client drops them they are gone for good.
*/
export interface SocialAuthRequest {
  idToken: string;
  first_name?: string;
  last_name?: string;
  deviceToken?: string;
  deviceType?: string;
}

/** Both /auth/signin and the social routes answer with this shape. */
export interface AuthSession {
  user: User;
  token: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
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
  appleId: string | null;
  failedLoginAttempts: number;
  isLocked: boolean;
  lastLogin: Date;
  account_status: AccountStatus;
  has_onboarded: boolean;
  deviceToken: string | null;
  deviceType: string | null;
  isGuest: boolean;
  createdAt: Date;
  updatedAt: Date;
  professionId: string | null;
  profession: Profession | null;
  settings: UserSettings | null;
}
