module.exports = ({ config }) => ({
  expo: {
    name: "Elevra",
    slug: "Elevra",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "elevra",
    // "automatic", not "light" — with light forced, iOS reports a light color
    // scheme unconditionally and the SYSTEM theme preference can never resolve
    // to dark. Requires a native rebuild to take effect in the dev client.
    userInterfaceStyle: "automatic",
    ios: {
      icon: "./assets/images/icon.png",
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
          // The app reads light, so a near-black splash flashed dark before a
          // white app on every cold start. Each scheme gets its own mark: the
          // light-mode indigo does not lift off the dark canvas.
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
