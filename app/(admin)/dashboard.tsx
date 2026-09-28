import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';

export default function AdminDashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard administrativo</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>Usuários, categorias, relatórios e configurações do sistema.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: 18,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardText: {
    color: theme.colors.textSecondary,
  },
});
