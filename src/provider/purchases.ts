import { logError } from "@/utils/logger";
import type {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";

// Native module: every call degrades to a no-op when it is missing, so a dev
// client built before it was added does not crash on launch.
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

  // A Test Store key hard-crashes RevenueCat natively on configure() in release
  // builds, so it must be blocked before configure(), not caught after.
  if (!__DEV__ && API_KEY.startsWith("test_")) {
    return false;
  }

  try {
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

// The server finds the RevenueCat customer by our user id; a purchase on an
// anonymous customer would be invisible to it.
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
    // A dismissed sheet throws with userCancelled set; that is not an error.
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
