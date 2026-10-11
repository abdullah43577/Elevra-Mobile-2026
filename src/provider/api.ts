import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "./endpoints";
import { getBaseUrl } from "./client";
import { tokenStorage } from "./token-storage";
import { router } from "expo-router";
import { queryClient } from "@/utils/queryClient";
import { clearPersistedCache } from "./query-persister";
import { APIResponse } from "../../types/response";

const CONFIG = {
  REQUESTS: {
    TIMEOUT: 60000,
    RETRIES: 3,
  },
} as const;

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
  _retry?: boolean;
}

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: CONFIG.REQUESTS.TIMEOUT,
  withCredentials: false,
});

// Shared so concurrent requests on an expiring token reuse one refresh call.
let globalRetryCount = 0;
let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

const handleSessionExpired = async () => {
  await tokenStorage.clearTokens();

  // clear() only empties memory; the persisted copy would rehydrate on next launch.
  queryClient.clear();
  await clearPersistedCache();

  router.replace("/(auth)/sign-in");
};

const handleGetNewToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) return null;

    const refreshApi = axios.create({
      baseURL: getBaseUrl(),
      timeout: CONFIG.REQUESTS.TIMEOUT,
    });

    const { data } = await refreshApi.post<
      APIResponse<{
        accessToken: string;
        refreshToken: string;
      }>
    >(API_ENDPOINTS.auth.refreshToken, {
      refreshToken,
    });

    await tokenStorage.setTokens(data.data.accessToken, data.data.refreshToken);

    return data.data.accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

const refreshAccessToken = async (): Promise<string | null> => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => resolve(token));
    });
  }

  if (globalRetryCount >= CONFIG.REQUESTS.RETRIES) {
    await handleSessionExpired();
    onRefreshed(null);
    return null;
  }

  isRefreshing = true;
  globalRetryCount++;

  try {
    const newToken = await handleGetNewToken();
    if (!newToken) {
      await handleSessionExpired();
      onRefreshed(null);
      return null;
    }

    globalRetryCount = 0;
    onRefreshed(newToken);
    return newToken;
  } catch (error) {
    await handleSessionExpired();
    onRefreshed(null);
    return null;
  } finally {
    isRefreshing = false;
  }
};

const getToken = async function () {
  try {
    const token = await tokenStorage.getAccessToken();
    const expiresAt = await tokenStorage.getAccessTokenExpiration();

    if (!token || !expiresAt) return null;

    const now = Date.now();
    const hasExpired = now > expiresAt;
    if (hasExpired) return null;

    const isExpiringSoon = expiresAt - now <= 2 * 60 * 1000;

    if (isExpiringSoon) {
      return await refreshAccessToken();
    }

    return token;
  } catch (error) {
    throw error;
  }
};

api.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    try {
      if (config.skipAuth) return config;

      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default api;
