import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { DataProvider } from '@/contexts/DataContext';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <DataProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" options={{ title: 'NetMob' }} />
          <Stack.Screen name="transport_map" options={{ title: 'Transport Mode' }} />
          <Stack.Screen name="purpose_map" options={{ title: 'Visit Purposes' }} />
          <Stack.Screen name="finish" options={{ title: 'Complete' }} />
        </Stack>
      </DataProvider>
    </ThemeProvider>
  );
}
