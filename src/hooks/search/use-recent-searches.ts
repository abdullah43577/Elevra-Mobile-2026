import { MAX_RECENT_SEARCHES, RECENT_SEARCHES_KEY } from "@/constants/search";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const save = function (entries: string[]) {
  AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(entries)).catch(
    () => undefined,
  );
};

export const useRecentSearches = function () {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(RECENT_SEARCHES_KEY)
      .then((stored) => {
        if (!stored) return;

        const parsed: unknown = JSON.parse(stored);
        if (!Array.isArray(parsed)) return;

        setRecentSearches(
          parsed.filter((entry): entry is string => typeof entry === "string"),
        );
      })
      .catch(() => undefined);
  }, []);

  const rememberSearch = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    setRecentSearches((current) => {
      const next = [
        trimmed,
        ...current.filter(
          (entry) => entry.toLowerCase() !== trimmed.toLowerCase(),
        ),
      ].slice(0, MAX_RECENT_SEARCHES);

      save(next);

      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    AsyncStorage.removeItem(RECENT_SEARCHES_KEY).catch(() => undefined);
  }, []);

  return { recentSearches, rememberSearch, clearRecentSearches };
};
