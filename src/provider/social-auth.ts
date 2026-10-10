import { logError } from "@/utils/logger";
import { Platform } from "react-native";

/*
  Both SDKs are native modules, so — exactly like react-native-purchases in
  ./purchases.ts — they only exist in a dev client or store build compiled since
  they were added. Resolving them through require() inside a try/catch is what
  stops an older installed dev client from crashing on launch: the sign-in
  buttons report that the build cannot do it instead of taking the app down.

  Run `npm run build:dev` after pulling this.
*/
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

/*
  What the server needs. Only `idToken` is trusted there — the names are a hint,
  and they exist solely because Apple hands them over on the first authorization
  and never again.
*/
export interface SocialCredential {
  idToken: string;
  first_name?: string;
  last_name?: string;
}

/*
  A cancelled sheet is an ordinary outcome, not a failure. It resolves to null
  rather than throwing so no caller can mistake "changed their mind" for "that
  did not work" and raise an error toast — the same distinction purchases.ts
  draws for a dismissed purchase sheet.
*/
export type SocialResult = SocialCredential | null;

export class SocialAuthUnavailableError extends Error {}

let isGoogleConfigured = false;

const configureGoogle = function () {
  if (isGoogleConfigured) return true;
  if (!googleModule || !WEB_CLIENT_ID) return false;

  try {
    /*
      webClientId is required on every platform, including Android. The native
      SDK signs the user in against the platform client but mints the idToken
      for the web ("server") client, and that is the audience our API verifies.
      Leave it out and signIn() succeeds with idToken null.
    */
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
  // iOS only. expo-apple-authentication has no Android implementation at all,
  // and Apple's Android path is a web flow against a Services ID that this app
  // does not set up.
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
    // Android only; a no-op on iOS. Without it, a device with an outdated or
    // missing Play Services fails deep inside the SDK with nothing useful.
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

    /*
      fullName is populated on the very first authorization for this Apple ID
      and is null on every one after it — Apple treats the name as something the
      app was told once and is expected to have stored. Revoking access in iOS
      Settings is the only way to see it again, which makes "the name is blank
      on a returning user" look like a bug when it is the documented behaviour.
    */
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

/*
  Clears the cached Google account so the next person to sign in on this device
  gets the account chooser rather than being silently signed straight back into
  the previous user's account. The Apple SDK holds no equivalent local session.
*/
export const forgetSocialSession = async function () {
  if (!googleModule || !isGoogleConfigured) return;

  try {
    await googleModule.GoogleSignin.signOut();
  } catch (error) {
    logError(error);
  }
};
