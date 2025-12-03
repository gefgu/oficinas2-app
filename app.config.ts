import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "netmob",
  slug: "netmob",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/app_icon.png",
  scheme: "netmob",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    config: {
      googleMapsApiKey: "AIzaSyD7gxh22AfWgrnTdCdZgPXUbWptXkJpU5o",
    },
    bundleIdentifier: "com.anonymous.netmob"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true,
    config: {
      googleMaps: {
        apiKey: "AIzaSyD7gxh22AfWgrnTdCdZgPXUbWptXkJpU5o",
      }
    },
    permissions: [
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION",
      "INTERNET"
    ],
    package: "com.anonymous.netmob"
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash-icon.png",
        "imageWidth": 200,
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      }
    ],
    [
      "expo-location",
      {
        "locationAlwaysAndWhenInUsePermission": "Allow NetMob to use your location."
      }
    ],
    [
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: true
        }
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    router: {},
    eas: {
      projectId: "7c1f0ccd-9a99-46c7-8277-9144e246d42d"
    },
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.1.83:8000"
  }
});
