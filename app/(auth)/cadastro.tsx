import { Link } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Button } from '../../components/Button';
import { theme } from '../../constants/theme';
import { getAuthErrorMessage, useAuth } from '../../contexts/AuthContext';

export default function CadastroScreen() {
  const { signUp } = useAuth();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password) {
      setError('Preencha nome, e-mail e senha.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signUp(name, email, password);
    } catch (signupError) {
      setError(getAuthErrorMessage(signupError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <MaterialIcons name="library-music" size={68} color={theme.colors.primary} />
        <Text style={styles.title}>Criar conta</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} placeholder="Seu nome" placeholderTextColor={theme.colors.placeholder} value={name} onChangeText={setName} />

        <Text style={styles.label}>E-mail</Text>
        <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor={theme.colors.placeholder} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} placeholder="Sua senha" placeholderTextColor={theme.colors.placeholder} value={password} onChangeText={setPassword} secureTextEntry />

        {error && <Text style={styles.error}>{error}</Text>}
        <Button title={loading ? 'Cadastrando...' : 'Cadastrar'} onPress={handleSignUp} disabled={loading} />
        {loading && <ActivityIndicator style={styles.loader} color={theme.colors.primaryLight} />}

        <View style={styles.row}>
          <Text style={styles.helperText}>Já possui conta?</Text>
          <Link href="/(auth)/login" style={styles.link}>Entrar</Link>
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
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: theme.colors.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    backgroundColor: '#2A2A2A',
    color: theme.colors.inputText,
  },
  row: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
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
    marginBottom: 12,
  },
  loader: {
    marginTop: 10,
  },
});
