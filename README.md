# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Configure environment

   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and update:
   # - EXPO_PUBLIC_GOOGLE_MAPS_API_KEY with your Google Maps API key
   # - EXPO_PUBLIC_API_BASE_URL with your backend server URL
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
   npx expo start
   ```

## Backend Configuration

This app requires a backend server running. Update the `EXPO_PUBLIC_API_BASE_URL` in your `.env` file:

- **Physical Device**: Use your machine's IP address (e.g., `http://192.168.1.83:8000`)
  - Find your IP: Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- **Android Emulator**: Use `http://10.0.2.2:8000`
- **iOS Simulator**: Use `http://localhost:8000`

**Important**: Restart the Expo dev server after changing `.env` values.

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
