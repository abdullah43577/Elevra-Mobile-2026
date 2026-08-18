export type SubscriptionTier = "FREE" | "PRO";

/*
  Mirrors the server's SubscriptionState. Note what is *not* here: no product id,
  no store, no receipt. The client never reports what it bought — it asks the
  server to go and look, and this is what comes back.
*/
export interface SubscriptionState {
  tier: SubscriptionTier;
  isActive: boolean;
  /** ISO string, or null for a non-expiring grant. */
  expiresAt: string | null;
  lastSyncedAt: string | null;
  /** False when the server served its stored copy rather than a fresh pull. */
  isFresh: boolean;
}
