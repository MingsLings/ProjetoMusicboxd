import { Redirect, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, type ReactNode } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { theme } from '../constants/theme';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <WebSafeArea />
      <ThemeProvider>
        <AuthProvider>
          <RouteGuard />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function WebSafeArea() {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const style = document.createElement('style');
    style.textContent = '#root { padding-top: env(safe-area-inset-top); }';
    document.head.appendChild(style);

    return () => style.remove();
  }, []);

  return null;
}

function SafeAreaShell({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {children}
    </SafeAreaView>
  );
}

function RouteGuard() {
  const { user, loading } = useAuth();
  const { colors, isLight } = useTheme();
  const segments = useSegments();
  const inAuth = segments[0] === '(auth)';

  if (loading) {
    return <SafeAreaShell><View style={[styles.loading, { backgroundColor: colors.background }]}><ActivityIndicator size="large" color={colors.primary} /></View></SafeAreaShell>;
  }

  if (!user && !inAuth) return <Redirect href="/(auth)/login" />;
  if (user && inAuth) return <Redirect href="/(home)" />;

  return (
    <SafeAreaShell>
      <StatusBar style={isLight ? 'dark' : 'light'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
    </SafeAreaShell>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
