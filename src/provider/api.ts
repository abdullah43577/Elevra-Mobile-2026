import * as SecureStore from "expo-secure-store";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuth } from "@/zustand/Auth";

interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

const handleGetNewToken = async () => {
  try {
    const currentToken = await SecureStore.getItemAsync("access_token");

    if (!currentToken) return null;

    // Create a fresh axios instance without interceptors for refresh calls
    const refreshApi = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL,
      timeout: CONFIG.REQUESTS.TIMEOUT,
    });

    const { data } = await refreshApi.get<RefreshResponse>(
      "/auth/refresh-token",
      {
        headers: {
          at: currentToken,
        },
      },
    );

    console.log(data, "TOKEN REFRESH DATA RESPONSE");

    const accessTokenExpiration = Date.now() + 15 * 60 * 1000; //15 mins
    await SecureStore.setItemAsync(
      "access_token_expiration",
      accessTokenExpiration.toString(),
    );

    await SecureStore.setItemAsync("access_token", data.data.accessToken);

    return data.data.accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

const getToken = async function () {
  try {
    const token = await SecureStore.getItemAsync("access_token");
    const expirationTime = await SecureStore.getItemAsync(
      "access_token_expiration",
    );

    if (!token || !expirationTime) return null;

    const now = Date.now();
    const expiresAt = parseInt(expirationTime);

    // Check if token has already expired
    const hasExpired = now > expiresAt;
    if (hasExpired) return null;

    // Check if 13 minutes have passed (i.e less than 2 minutes left)
    const isExpiringSoon = expiresAt - now <= 2 * 60 * 1000; // 2 mins in ms
    console.log(isExpiringSoon, "is expiring soon");

    if (isExpiringSoon) {
      const newToken = await handleGetNewToken();
      console.log("token refreshed...");
      return newToken;
    }

    // Return the original token if it's still valid and not expiring soon
    return token;
  } catch (error) {
    throw error;
  }
};

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
  _retry?: boolean;
}

const CONFIG = {
  REQUESTS: {
    TIMEOUT: 60000, //* 1 minute
    RETRIES: 3,
  },
} as const;

// Create axios instance
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: CONFIG.REQUESTS.TIMEOUT,
  withCredentials: false,
});

//* Request interceptors
api.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    try {
      if (config.skipAuth) return config;

      const token = await getToken();
      if (token) {
        config.headers.at = `${token}`;
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
      const { logout, authenticatedUserType, isAuthenticated } =
        useAuth.getState();
      // If user is not a guest, log them out
      if (authenticatedUserType !== "guest") {
        logout();
      }
    }

    return Promise.reject(error);
  },
);

export default api;
