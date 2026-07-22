import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "./endpoints";
import { getBaseUrl } from "./client";
import { tokenStorage } from "./token-storage";
import { APIResponse } from "../../types/response";

const CONFIG = {
  REQUESTS: {
    TIMEOUT: 60000,
    RETRIES: 3,
  },
} as const;

const handleGetNewToken = async () => {
  try {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) return null;

    const refreshApi = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL,
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
    await tokenStorage.clearTokens();
    throw error;
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
      const newToken = await handleGetNewToken();
      return newToken;
    }

    return token;
  } catch (error) {
    throw error;
  }
};

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
  _retry?: boolean;
}

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: CONFIG.REQUESTS.TIMEOUT,
  withCredentials: false,
});

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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await tokenStorage.clearTokens();
      // TODO: trigger global logout / redirect to sign-in once auth store is wired
    }

    return Promise.reject(error);
  },
);

export default api;
