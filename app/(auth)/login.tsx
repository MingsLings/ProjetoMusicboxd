import { Link, router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Button } from '../../components/Button';
import { theme } from '../../constants/theme';
import { getAuthErrorMessage, useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <MaterialIcons name="music-note" size={72} color={theme.colors.primary} />
        <Text style={styles.title}>Musicboxd</Text>
        <Text style={styles.subtitle}>Guarde o que ouviu. Dê sua nota. Volte quando quiser.</Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor={theme.colors.placeholder} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} placeholder="Sua senha" placeholderTextColor={theme.colors.placeholder} value={password} onChangeText={setPassword} secureTextEntry />

        {error && <Text style={styles.error}>{error}</Text>}
        <Button title={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />
        {loading && <ActivityIndicator style={styles.loader} color={theme.colors.primaryLight} />}

        <View style={styles.row}>
          <Text style={styles.helperText}>Não tem conta?</Text>
          <Link href="/(auth)/cadastro" style={styles.link}>Cadastre-se</Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.primary,
    marginTop: 10,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    color: theme.colors.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: '#2A2A2A',
    color: theme.colors.inputText,
  },
  row: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helperText: {
    color: theme.colors.textSecondary,
  },
  link: {
    color: theme.colors.primaryLight,
    fontWeight: '700',
  },
  error: {
    color: theme.colors.error,
    alignSelf: 'stretch',
    marginBottom: 12,
  },
  loader: {
    marginTop: 10,
  },
});
