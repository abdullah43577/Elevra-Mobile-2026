export type SubscriptionTier = "FREE" | "PRO";

export interface SubscriptionState {
  tier: SubscriptionTier;
  isActive: boolean;
  // null for a non-expiring grant.
  expiresAt: string | null;
  lastSyncedAt: string | null;
  isFresh: boolean;
}
