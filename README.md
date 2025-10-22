# NetMob - GPS Trajectory Validation App 🗺️

NetMob is a React Native Expo application for validating and editing GPS trajectory and visit data. Users can review and correct transport modes (bus, car, walk, bicycle) for trip segments and purposes (HOME, WORK, LEISURE, PURCHASE, OTHER) for visit locations.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Backend Configuration](#backend-configuration)
- [Application Flow](#application-flow)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)

## ✨ Features

- **Interactive Map Visualization**: View GPS trajectories and visit points on Google Maps
- **Transport Mode Classification**: Validate and correct transport modes (bus, car, bicycle, walk)
- **Visit Purpose Tagging**: Assign purposes to visit locations (HOME, WORK, LEISURE, PURCHASE, OTHER)
- **Real-time Updates**: Changes are reflected immediately in the UI
- **Data Submission**: Submit validated data back to the server

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Expo CLI** (optional, will be installed with dependencies)
- **Google Maps API Key** - [Get one here](https://developers.google.com/maps/documentation/javascript/get-api-key)
- **Backend Server** - The app requires a running backend API (see [Backend Configuration](#backend-configuration))

### For Running on Devices/Emulators:

- **Android**: Android Studio with Android SDK (for emulator)
- **iOS**: Xcode (macOS only, for iOS Simulator)
- **Physical Device**: Expo Go app ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

## 🚀 Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd netmob
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Configure Environment Variables

Copy the example environment file and configure it:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit the \`.env\` file with your configuration:

\`\`\`env
# Google Maps API Key (REQUIRED)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Backend API URL (configure based on your setup)
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.83:8000
\`\`\`

**Important**: Replace \`your_google_maps_api_key_here\` with your actual Google Maps API key.

### 4. Configure Backend URL

Choose the appropriate API base URL based on your setup:

| Setup Type | URL | Notes |
|------------|-----|-------|
| **Physical Device** | \`http://YOUR_LOCAL_IP:8000\` | Find your IP: \`ipconfig\` (Windows) or \`ifconfig\` (Mac/Linux) |
| **Android Emulator** | \`http://10.0.2.2:8000\` | Special alias for host machine |
| **iOS Simulator** | \`http://localhost:8000\` | Standard localhost |

## �� Running the Application

### Start the Development Server

\`\`\`bash
npx expo start
\`\`\`

This will start the Metro bundler and display a QR code in your terminal.

### Run on Different Platforms

From the Metro bundler menu, you can:

- Press \`a\` - Run on Android emulator/device
- Press \`i\` - Run on iOS simulator (macOS only)
- Press \`w\` - Run in web browser (limited functionality)

Or use these commands directly:

\`\`\`bash
# Android
npm run android

# iOS (macOS only)
npm run ios

# Web
npm run web
\`\`\`

### Run on Physical Device

1. Install **Expo Go** app on your device
2. Scan the QR code from the Metro bundler
3. Ensure your device is on the same network as your development machine

**Important**: After changing \`.env\` values, restart the Expo dev server (Ctrl+C, then \`npx expo start\` again).

## 🔗 Backend Configuration

### Backend Requirements

The app expects a REST API with the following endpoints:

#### \`GET /\` - Health Check
Returns server status.

#### \`GET /trajectories/\` - Fetch Data
Returns trajectory and visit data in JSON format.

#### \`PUT /trajectories/\` - Update Data
Accepts updated visit data with validated transport modes and purposes.

### API Response Format

See the example API response structure in the copilot instructions or backend documentation.

### Starting the Backend

Ensure your backend server is running and accessible at the URL configured in \`.env\`:

\`\`\`bash
# Example (adjust based on your backend implementation):
cd backend
python manage.py runserver 0.0.0.0:8000
\`\`\`

The app will perform a health check on startup and warn if the server is unreachable.

## 📱 Application Flow

The app follows a linear validation workflow:

1. **Home Screen** (\`index.tsx\`)
   - App loads trajectory and visit data from API
   - Displays loading state and error handling
   - User taps "Start Validation" to begin

2. **Transport Mode Map** (\`transport_map.tsx\`)
   - Shows trajectories as colored polylines with markers at the midpoint
   - Marker title shows: \`DD/MM HH:MM → HH:MM - MODE\`
   - Two-step selection: tap trajectory → tap transport mode button
   - Available modes: Bus, Car, Bicycle, Walk
   - Changes are saved in local state
   - User taps "Continue" to proceed

3. **Purpose Map** (\`purpose_map.tsx\`)
   - Shows visit locations as colored markers
   - Marker title shows: \`DD/MM HH:MM → HH:MM - PURPOSE\`
   - Two-step selection: tap visit marker → tap purpose button
   - Available purposes: HOME, WORK, LEISURE, PURCHASE, OTHER
   - Changes are saved in local state
   - User taps "Continue" to proceed

4. **Finish Screen** (\`finish.tsx\`)
   - User reviews completion
   - Taps "Submit Data" to send updates to backend
   - Success/error feedback displayed
   - Option to return to home screen

### Two-Step Selection Pattern

Both map screens use the same interaction pattern:
1. Tap an item (trajectory/visit marker) - it becomes selected
2. Tap a mode/purpose button - the change is applied
3. Both selections are cleared, ready for next change

## 🔐 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| \`EXPO_PUBLIC_GOOGLE_MAPS_API_KEY\` | Yes | Google Maps API key for map rendering | \`AIzaSy...\` |
| \`EXPO_PUBLIC_API_BASE_URL\` | Yes | Backend API base URL | \`http://192.168.1.83:8000\` |

**Note**: All environment variables must be prefixed with \`EXPO_PUBLIC_\` to be accessible in the app.

## 🐛 Troubleshooting

### Map Not Displaying

- **Verify Google Maps API Key**: Ensure it's correctly set in \`.env\`
- **Enable Required APIs**: In Google Cloud Console, enable "Maps SDK for Android" and "Maps SDK for iOS"
- **Restart Dev Server**: Changes to \`.env\` require a restart (\`npx expo start -c\` to clear cache)

### Cannot Connect to Backend

- **Check Network**: Ensure device/emulator and backend are on the same network
- **Verify URL**: Check \`EXPO_PUBLIC_API_BASE_URL\` matches your backend address
  - For physical device: Must use your machine's local IP (not \`localhost\`)
  - For Android emulator: Use \`http://10.0.2.2:8000\`
  - For iOS simulator: Use \`http://localhost:8000\`
- **Check Firewall**: Ensure no firewall is blocking the connection
- **Backend Running**: Verify backend server is actually running and accessible
- **Check Console**: Look for API base URL in logs on app startup

### App Crashes on Start

- **Clear Cache**: Run \`npx expo start -c\` to clear the Metro bundler cache
- **Reinstall Dependencies**: Delete \`node_modules\` and run \`npm install\` again
- **Check Logs**: Look for error messages in the Metro bundler output
- **Android Build**: Delete \`android/build\` folder and rebuild

### Data Not Loading

- **Check API Response**: Verify backend returns data in the expected format
- **Network Timeout**: Default timeout is 5 seconds (adjust \`TIMEOUT_MS\` in \`utils/apiService.ts\` if needed)
- **Check Console Logs**: API responses are logged - check for errors
- **Empty Data**: App handles empty arrays gracefully - check if backend has data for the user

## 📁 Project Structure

\`\`\`
netmob/
├── app/                      # Screens (file-based routing)
│   ├── index.tsx            # Home screen
│   ├── transport_map.tsx    # Transport mode validation
│   ├── purpose_map.tsx      # Visit purpose validation
│   ├── finish.tsx           # Completion & submission
│   └── _layout.tsx          # Navigation layout with DataProvider
├── components/              # Reusable components
│   ├── BaseMap.tsx         # Base map component
│   ├── TransportMap.tsx    # Transport validation map
│   └── PurposeMap.tsx      # Purpose validation map
├── contexts/               # React Context providers
│   └── DataContext.tsx     # Global state management
├── hooks/                  # Custom React hooks
│   └── useTransportData.tsx # Data fetching & state
├── utils/                  # Utility functions
│   ├── apiService.ts       # API client
│   └── dataSubmission.ts   # Data submission logic
├── data/                   # Configuration data
│   ├── transport_sample.ts # Transport mode definitions
│   └── purpose_sample.ts   # Purpose definitions
├── assets/                 # Static assets
│   ├── icons/             # Transport & purpose icons
│   └── images/            # App images
├── .env                    # Environment variables (not in git)
├── .env.example           # Environment template
├── app.json               # Expo configuration
├── package.json           # Dependencies
└── README.md              # This file
\`\`\`

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Google Maps API](https://developers.google.com/maps/documentation)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

(Add license information here)

---

**Built with ❤️ using Expo and React Native**
