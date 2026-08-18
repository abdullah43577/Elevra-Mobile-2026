import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import Constants from "expo-constants";

const CACHE_KEY = "elevra_query_cache";

export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: CACHE_KEY,
  // Writes are batched; the cache changes far more often than it needs saving.
  throttleTime: 1000,
});

/*
  Bumping the app version discards the old cache rather than rehydrating data
  shaped for a previous release.
*/
export const CACHE_BUSTER = Constants.expoConfig?.version ?? "1.0.0";

/*
  The persisted cache is per-device, not per-account. Signing out has to wipe it
  or the next person to sign in on this device sees the previous user's notes,
  applications, and profile until the first refetch lands.
*/
export const clearPersistedCache = async function () {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
  } catch {
    // A failed wipe must not block sign-out.
  }
};
