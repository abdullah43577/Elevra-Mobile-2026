import { requireOptionalNativeModule } from "expo-modules-core";
import { ShareIntent } from "expo-share-intent";

/*
  expo-share-intent is native. A dev client built before it was added — or a
  store build receiving this JavaScript as an over-the-air update — has no
  module, so the provider runs disabled there rather than calling into nothing.
  The share sheet entry only exists on Android for now (app.config.js).
*/
export const isShareIntentAvailable = requireOptionalNativeModule("ExpoShareIntentModule") !== null;

const URL_IN_TEXT = /https?:\/\/\S+/i;

/*
  What to hand the job import. Browsers share a bare url; job apps often share
  "Check out this job at Acme: https://…", where the link is the useful part and
  the words around it are not a posting. Anything longer is treated as the
  posting text itself.
*/
export const shareIntentInput = function (intent: ShareIntent) {
  if (intent.webUrl) return intent.webUrl;

  const text = intent.text?.trim();
  if (!text) return null;

  const link = text.match(URL_IN_TEXT)?.[0];
  return link && text.length < 400 ? link : text;
};
