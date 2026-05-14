import { InventoryProvider } from '@/context/inventory-context';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import '../global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#2c3d4a',
    card: '#3d5161',
    text: '#e8eef4',
    border: '#5f778a',
    primary: '#41d9ec',
    notification: '#c4b4ff',
  },
};

export default function RootLayout() {
  return (
    <InventoryProvider>
      <ThemeProvider value={navigationTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </InventoryProvider>
  );
}
