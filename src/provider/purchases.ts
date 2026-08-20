import { logError } from "@/utils/logger";
import type {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";

/*
  react-native-purchases is a native module, so it only exists in a dev client or
  a store build that has been compiled since it was added. Every call goes
  through here and every one of them degrades to a no-op when the native side is
  missing.

  That is not defensiveness for its own sake: without it, adding this dependency
  bricks the currently-installed dev client on launch until someone runs a new
  build. The paywall would rather say "not available on this build" than take the
  whole app down with it.
*/
let Purchases: typeof import("react-native-purchases").default | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Purchases = require("react-native-purchases").default;
} catch {
  Purchases = null;
}

const API_KEY = process.env.EXPO_PUBLIC_REVENUE_CAT;

let isConfigured = false;

export const configurePurchases = function () {
  if (isConfigured) return true;
  if (!Purchases || !API_KEY) return false;

  // Test Store keys only work in Debug/dev-client builds. In preview and
  // production (release-type) builds, RevenueCat's native SDK hard-crashes
  // on Purchases.configure() rather than throwing a catchable JS error — so
  // this has to be blocked before configure() is ever called, not caught
  // after the fact.
  if (!__DEV__ && API_KEY.startsWith("test_")) {
    return false;
  }

  try {
    /*
      Configured anonymously. The user is not authenticated yet at launch, and
      identifying them is a separate call once they are — see identifyPurchaser.
    */
    Purchases.configure({ apiKey: API_KEY });
    isConfigured = true;
    return true;
  } catch (error) {
    logError(error);
    return false;
  }
};

export const isPurchasesAvailable = function () {
  return !!Purchases && !!API_KEY;
};

/*
  Ties the RevenueCat customer to our own user id, which is what makes the
  server's pull work at all: it looks the customer up by that id. Without this
  every purchase would land on an anonymous customer the API could not find.
*/
export const identifyPurchaser = async function (userId: string) {
  if (!configurePurchases() || !Purchases) return;

  try {
    await Purchases.logIn(userId);
  } catch (error) {
    logError(error);
  }
};

export const forgetPurchaser = async function () {
  if (!Purchases || !isConfigured) return;

  try {
    await Purchases.logOut();
  } catch (error) {
    // Logging out of an already-anonymous customer throws; nothing to recover.
    logError(error);
  }
};

export const getCurrentOffering =
  async function (): Promise<PurchasesOffering | null> {
    if (!configurePurchases() || !Purchases) return null;

    const offerings = await Purchases.getOfferings();

    return offerings.current ?? null;
  };

export const purchasePackage = async function (
  pack: PurchasesPackage,
): Promise<{ customerInfo: CustomerInfo; cancelled: boolean }> {
  if (!configurePurchases() || !Purchases) {
    throw new Error("Purchases are not available on this build");
  }

  try {
    const { customerInfo } = await Purchases.purchasePackage(pack);
    return { customerInfo, cancelled: false };
  } catch (error) {
    /*
      A cancelled purchase arrives as a thrown error with userCancelled set.
      It is an ordinary outcome, not a failure, and must not raise an error
      toast — the user just closed the sheet.
    */
    if ((error as { userCancelled?: boolean })?.userCancelled) {
      return { customerInfo: null as unknown as CustomerInfo, cancelled: true };
    }

    throw error;
  }
};

export const restorePurchases = async function (): Promise<CustomerInfo> {
  if (!configurePurchases() || !Purchases) {
    throw new Error("Purchases are not available on this build");
  }

  return Purchases.restorePurchases();
};
