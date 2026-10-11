import { RECENT_SEARCHES_KEY } from "@/constants/search";
import { SETUP_STATE_KEY } from "@/store/setup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import Constants from "expo-constants";

const CACHE_KEY = "elevra_query_cache";

export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: CACHE_KEY,
  throttleTime: 1000,
});

export const CACHE_BUSTER = Constants.expoConfig?.version ?? "1.0.0";

export const clearPersistedCache = async function () {
  try {
    await AsyncStorage.multiRemove([
      CACHE_KEY,
      RECENT_SEARCHES_KEY,
      SETUP_STATE_KEY,
    ]);
  } catch {
    // A failed wipe must not block sign-out.
  }
};
