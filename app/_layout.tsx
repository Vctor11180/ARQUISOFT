import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router'; // 👈 PASO 1: Importa Stack desde expo-router
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import 'react-native-reanimated';
import i18n from '../lib/i18n'; // Importar configuración de i18n

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  // 👇 PASO 2: Ya no necesitas <NavigationContainer> ni createStackNavigator
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* PASO 3: Usa el componente <Stack> directamente.
          Este componente detectará automáticamente las pantallas 
          que tienes en tu directorio /app.
        */}
        <Stack screenOptions={{ headerShown: false }}>
          {/* No necesitas definir <Stack.Screen> aquí. 
            Expo Router lo hace por ti basándose en tus archivos.
            Tu pantalla "(tabs)" será manejada por su propio layout
            en app/(tabs)/_layout.tsx
          */}
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </I18nextProvider>
  );
}