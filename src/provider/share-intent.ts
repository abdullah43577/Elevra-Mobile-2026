import { requireOptionalNativeModule } from "expo-modules-core";
import { ShareIntent } from "expo-share-intent";

// Native: an older dev client, or an OTA update onto an older store build, has no
// module, so the provider runs disabled there.
export const isShareIntentAvailable = requireOptionalNativeModule("ExpoShareIntentModule") !== null;

const URL_IN_TEXT = /https?:\/\/\S+/i;

export const shareIntentInput = function (intent: ShareIntent) {
  if (intent.webUrl) return intent.webUrl;

  const text = intent.text?.trim();
  if (!text) return null;

  const link = text.match(URL_IN_TEXT)?.[0];
  return link && text.length < 400 ? link : text;
};
