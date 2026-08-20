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

/*
  One hook for both providers rather than one per provider. The two differ only
  in which native sheet opens and which url the token goes to; everything after
  that — storing tokens, flipping the session, the cancelled-sheet rule — is
  identical, and duplicating it is how the two would drift.
*/
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
    // Resolved from the payload so a single mutation serves both routes — the
    // function form of `url`, same as useDuplicateResume.
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
    // Overridden only to release the spinner; the shared handler still shapes
    // the message, including the offline case.
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

      /*
        null means the user dismissed the sheet. Not an error, and not worth a
        toast — they know what they just did.
      */
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
