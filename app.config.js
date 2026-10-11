// The google-signin plugin throws when this is missing, so its entry is added
// conditionally rather than with an empty string.
const googleIosUrlScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME;

module.exports = ({ config }) => ({
  expo: {
    name: "Elevra",
    slug: "Elevra",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "elevra",
    // Not "light": forcing it makes iOS report a light scheme unconditionally,
    // so the SYSTEM theme can never resolve to dark.
    userInterfaceStyle: "automatic",
    ios: {
      icon: "./assets/images/icon.png",
      bundleIdentifier: "com.reactmode.elevra",
      // Without the entitlement the native sheet fails with an opaque "unknown" error.
      usesAppleSignIn: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#5B47E8",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.INTERNET",
      ],
      package: "com.reactmode.elevra",
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
      bundler: "metro",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#FAFAFB",
          image: "./assets/images/splashscreen.png",
          resizeMode: "contain",
          imageWidth: 200,
          dark: {
            backgroundColor: "#0F0F12",
            image: "./assets/images/splashscreen-dark.png",
            resizeMode: "contain",
            imageWidth: 200,
          },
        },
      ],
      "expo-secure-store",
      "expo-image",
      [
        "expo-image-picker",
        {
          photosPermission:
            "Allow Elevra to access your photos to set a profile picture.",
        },
      ],
      [
        "expo-audio",
        {
          microphonePermission: "Allow Elevra to access your microphone.",
          enableBackgroundPlayback: true,
          enableBackgroundRecording: false,
        },
      ],
      [
        "expo-file-system",
        {
          supportsOpeningDocumentsInPlace: true,
          enableFileSharing: true,
        },
      ],
      [
        "expo-document-picker",
        {
          iCloudContainerEnvironment: "Production",
        },
      ],
      "expo-notifications",
      "expo-apple-authentication",
      // iOS is off: its share extension needs an App Group (paid Apple account), and
      // google-signin rewrites CFBundleURLSchemes — read the expo-share-intent README first.
      [
        "expo-share-intent",
        {
          disableIOS: true,
          androidIntentFilters: ["text/*"],
        },
      ],
      ...(googleIosUrlScheme
        ? [
            [
              "@react-native-google-signin/google-signin",
              { iosUrlScheme: googleIosUrlScheme },
            ],
          ]
        : []),
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "bd75c9a6-0dd8-45b0-a9d7-754d8c639699",
      },
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: "https://u.expo.dev/bd75c9a6-0dd8-45b0-a9d7-754d8c639699",
    },
  },
});
