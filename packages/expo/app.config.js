/** @type {import("@expo/config-types/build/ExpoConfig").ExpoConfig} */
const EXPO_CONFIG = {
  name: "expo-vite-webview",
  extra: {
    DEV_WEB_VIEW_PORT: "18182",
  },
};

module.exports = {
  expo: EXPO_CONFIG,
};
