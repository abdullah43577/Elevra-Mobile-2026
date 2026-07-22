import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_TOKEN_EXPIRATION_KEY = "access_token_expiration";

const ACCESS_TOKEN_TTL_MS = 30 * 60 * 1000;

export const tokenStorage = {
  async setTokens(accessToken: string, refreshToken: string) {
    const expiresAt = Date.now() + ACCESS_TOKEN_TTL_MS;
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
      SecureStore.setItemAsync(
        ACCESS_TOKEN_EXPIRATION_KEY,
        expiresAt.toString(),
      ),
    ]);
  },

  async setAccessToken(accessToken: string) {
    const expiresAt = Date.now() + ACCESS_TOKEN_TTL_MS;
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(
        ACCESS_TOKEN_EXPIRATION_KEY,
        expiresAt.toString(),
      ),
    ]);
  },

  async getAccessToken() {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken() {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async getAccessTokenExpiration() {
    const value = await SecureStore.getItemAsync(ACCESS_TOKEN_EXPIRATION_KEY);
    return value ? parseInt(value, 10) : null;
  },

  async clearTokens() {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(ACCESS_TOKEN_EXPIRATION_KEY),
    ]);
  },
};
