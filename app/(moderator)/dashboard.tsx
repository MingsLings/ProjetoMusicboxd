import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';

export default function ModeratorDashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard do moderador</Text>
      <View style={styles.cardRow}>
        <View style={styles.card}><Text style={styles.cardValue}>12</Text><Text style={styles.cardLabel}>Recebidas</Text></View>
        <View style={styles.card}><Text style={styles.cardValue}>5</Text><Text style={styles.cardLabel}>Em análise</Text></View>
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
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardValue: {
    fontSize: 30,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  cardLabel: {
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
});
