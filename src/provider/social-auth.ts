import { logError } from "@/utils/logger";
import { Platform } from "react-native";

// Native modules, resolved via require() in try/catch so a dev client built
// before they were added degrades instead of crashing on launch.
type GoogleSigninModule =
  typeof import("@react-native-google-signin/google-signin");
type AppleAuthModule = typeof import("expo-apple-authentication");

let googleModule: GoogleSigninModule | null = null;
let appleModule: AppleAuthModule | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  googleModule = require("@react-native-google-signin/google-signin");
} catch {
  googleModule = null;
}

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  appleModule = require("expo-apple-authentication");
} catch {
  appleModule = null;
}

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

export interface SocialCredential {
  idToken: string;
  first_name?: string;
  last_name?: string;
}

export type SocialResult = SocialCredential | null;

export class SocialAuthUnavailableError extends Error {}

let isGoogleConfigured = false;

const configureGoogle = function () {
  if (isGoogleConfigured) return true;
  if (!googleModule || !WEB_CLIENT_ID) return false;

  try {
    // Required on Android too: the idToken is minted for the web client, and
    // without it signIn() succeeds with a null idToken.
    googleModule.GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      ...(IOS_CLIENT_ID && { iosClientId: IOS_CLIENT_ID }),
    });
    isGoogleConfigured = true;
    return true;
  } catch (error) {
    logError(error);
    return false;
  }
};

export const isGoogleAuthAvailable = function () {
  return !!googleModule && !!WEB_CLIENT_ID;
};

export const isAppleAuthAvailable = async function () {
  // expo-apple-authentication has no Android implementation.
  if (Platform.OS !== "ios" || !appleModule) return false;

  try {
    return await appleModule.isAvailableAsync();
  } catch (error) {
    logError(error);
    return false;
  }
};

export const signInWithGoogle = async function (): Promise<SocialResult> {
  if (!configureGoogle() || !googleModule) {
    throw new SocialAuthUnavailableError(
      "Google sign-in is not available on this build.",
    );
  }

  const { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } =
    googleModule;

  try {
    // Android only. Without it, outdated Play Services fails opaquely inside the SDK.
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const response = await GoogleSignin.signIn();

    if (!isSuccessResponse(response)) return null;

    const { idToken, user } = response.data;

    if (!idToken) {
      throw new Error(
        "Google did not return an ID token. Check that the web client id is configured.",
      );
    }

    return {
      idToken,
      ...(user.givenName && { first_name: user.givenName }),
      ...(user.familyName && { last_name: user.familyName }),
    };
  } catch (error) {
    if (
      isErrorWithCode(error) &&
      (error.code === statusCodes.SIGN_IN_CANCELLED ||
        error.code === statusCodes.IN_PROGRESS)
    ) {
      return null;
    }

    throw error;
  }
};

export const signInWithApple = async function (): Promise<SocialResult> {
  if (!appleModule) {
    throw new SocialAuthUnavailableError(
      "Apple sign-in is not available on this build.",
    );
  }

  try {
    const credential = await appleModule.signInAsync({
      requestedScopes: [
        appleModule.AppleAuthenticationScope.FULL_NAME,
        appleModule.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      throw new Error("Apple did not return an identity token.");
    }

    // Apple sends fullName only on the first authorization for an Apple ID;
    // null on a returning user is documented behaviour, not a bug.
    return {
      idToken: credential.identityToken,
      ...(credential.fullName?.givenName && {
        first_name: credential.fullName.givenName,
      }),
      ...(credential.fullName?.familyName && {
        last_name: credential.fullName.familyName,
      }),
    };
  } catch (error) {
    if ((error as { code?: string })?.code === "ERR_REQUEST_CANCELED")
      return null;

    throw error;
  }
};

export const forgetSocialSession = async function () {
  if (!googleModule || !isGoogleConfigured) return;

  try {
    await googleModule.GoogleSignin.signOut();
  } catch (error) {
    logError(error);
  }
};
