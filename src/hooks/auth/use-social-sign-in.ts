import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { API_ENDPOINTS } from "@/provider/endpoints";
import {
  isAppleAuthAvailable,
  isGoogleAuthAvailable,
  signInWithApple,
  signInWithGoogle,
  SocialAuthUnavailableError,
} from "@/provider/social-auth";
import { tokenStorage } from "@/provider/token-storage";
import { useAuthStore } from "@/store/auth";
import { logError } from "@/utils/logger";
import { showToast } from "@/utils/show-toast";
import type {
  AuthSession,
  SocialAuthRequest,
  SocialProvider,
} from "../../../types/auth";
import type { APIResponse } from "../../../types/response";
import { useHandleErrors } from "../use-handle-errors";
import { useSubmitData } from "../use-submit-data";

type ExchangePayload = SocialAuthRequest & { provider: SocialProvider };

export const useSocialSignIn = function () {
  const { setAuthenticated, expoPushToken } = useAuthStore();
  const handleErrors = useHandleErrors();

  const [pendingProvider, setPendingProvider] = useState<SocialProvider | null>(
    null,
  );
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);

  useEffect(() => {
    let active = true;

    isAppleAuthAvailable().then((available) => {
      if (active) setIsAppleAvailable(available);
    });

    return () => {
      active = false;
    };
  }, []);

  const { mutate: exchange } = useSubmitData<
    ExchangePayload,
    APIResponse<AuthSession>
  >({
    url: (data) =>
      data.provider === "GOOGLE"
        ? API_ENDPOINTS.auth.google
        : API_ENDPOINTS.auth.apple,
    method: "post",
    skipAuth: true,
    getBody: ({ provider: _provider, ...body }) => body,
    onSuccessMessage: "Login Successful",
    onSuccess: async (data) => {
      await tokenStorage.setTokens(
        data.data.token.tokens.accessToken,
        data.data.token.tokens.refreshToken,
      );

      setAuthenticated(true);
    },
    onError: (error) => {
      setPendingProvider(null);
      handleErrors(error);
    },
  });

  const start = async function (provider: SocialProvider) {
    if (pendingProvider) return;

    setPendingProvider(provider);

    try {
      const credential =
        provider === "GOOGLE"
          ? await signInWithGoogle()
          : await signInWithApple();

      // null means the user dismissed the sheet: not an error.
      if (!credential) {
        setPendingProvider(null);
        return;
      }

      exchange({
        provider,
        ...credential,
        ...(expoPushToken && { deviceToken: expoPushToken }),
        deviceType: Platform.OS,
      });
    } catch (error) {
      setPendingProvider(null);
      logError(error);

      showToast(
        "error",
        error instanceof SocialAuthUnavailableError
          ? error.message
          : `We couldn't sign you in with ${provider === "GOOGLE" ? "Google" : "Apple"}. Please try again.`,
      );
    }
  };

  return {
    continueWithGoogle: () => start("GOOGLE"),
    continueWithApple: () => start("APPLE"),
    pendingProvider,
    isGoogleAvailable: isGoogleAuthAvailable(),
    isAppleAvailable,
  };
};
