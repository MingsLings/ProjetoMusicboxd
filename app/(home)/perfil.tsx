import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../constants/theme';
import { Button } from '../../components/Button';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useTheme } from '../../contexts/ThemeContext';

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const { colors, isLight, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  const handleLogout = () => {
    setLogoutError('');
    setLogoutDialogVisible(true);
  };

  const confirmLogout = async () => {
    setLoading(true);
    setLogoutError('');
    try {
      await logout();
      setLogoutDialogVisible(false);
    } catch (error) {
      console.error('Erro ao sair da conta:', error);
      setLogoutError('Não foi possível sair da conta. Verifique a conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Perfil</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="account-circle" size={80} color={theme.colors.primary} />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.displayName || 'Usuário'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações da Conta</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <MaterialIcons name="email" size={24} color={theme.colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <MaterialIcons name="account-box" size={24} color={theme.colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValue}>{user?.displayName || 'Não informado'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <MaterialIcons name="verified" size={24} color={theme.colors.success} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>E-mail Verificado</Text>
              <Text style={styles.infoValue}>
                {user?.emailVerified ? 'Sim' : 'Não verificado'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências</Text>

        <TouchableOpacity style={styles.preferenceRow}>
          <View style={styles.preferenceLeft}>
            <MaterialIcons name="notifications" size={24} color={theme.colors.primary} />
            <Text style={styles.preferenceText}>Notificações</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.preferenceRow} onPress={toggleTheme}>
          <View style={styles.preferenceLeft}>
            <MaterialIcons name={isLight ? 'light-mode' : 'dark-mode'} size={24} color={theme.colors.primary} />
            <Text style={styles.preferenceText}>Tema</Text>
          </View>
          <Text style={styles.preferenceValue}>{isLight ? 'Claro' : 'Escuro'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.preferenceRow}>
          <View style={styles.preferenceLeft}>
            <MaterialIcons name="language" size={24} color={theme.colors.primary} />
            <Text style={styles.preferenceText}>Idioma</Text>
          </View>
          <Text style={styles.preferenceValue}>Português</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre</Text>

        <TouchableOpacity style={styles.aboutRow}>
          <MaterialIcons name="help" size={24} color={theme.colors.primary} />
          <Text style={styles.aboutText}>Ajuda e Suporte</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.aboutRow}>
          <MaterialIcons name="description" size={24} color={theme.colors.primary} />
          <Text style={styles.aboutText}>Termos de Serviço</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.aboutRow}>
          <MaterialIcons name="privacy-tip" size={24} color={theme.colors.primary} />
          <Text style={styles.aboutText}>Política de Privacidade</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.aboutRow}>
          <MaterialIcons name="info" size={24} color={theme.colors.primary} />
          <Text style={styles.aboutText}>Versão 1.0.0</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutSection}>
        <Button
          title={loading ? 'Saindo...' : 'Sair da Conta'}
          onPress={handleLogout}
          disabled={loading}
        />
      </View>
    </ScrollView>
    <ConfirmDialog
      visible={logoutDialogVisible}
      title="Sair da conta?"
      message="Você precisará entrar novamente para acessar seu diário musical."
      confirmLabel="Sair"
      danger
      loading={loading}
      errorMessage={logoutError}
      onCancel={() => {
        if (!loading) setLogoutDialogVisible(false);
      }}
      onConfirm={confirmLogout}
    />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.lg,
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  avatarContainer: {
    marginBottom: theme.spacing.md,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  section: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
    fontWeight: '500',
  },
  preferenceRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceText: {
    fontSize: 15,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
    fontWeight: '500',
  },
  preferenceValue: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  aboutRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
  },
  aboutText: {
    fontSize: 15,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
    fontWeight: '500',
  },
  logoutSection: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xl,
  },
});
