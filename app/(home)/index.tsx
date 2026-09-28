import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { MusicLogModal } from '../../components/MusicLogModal';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeColors } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { excluirRegistroMusical, observarDiarioMusical } from '../../services/musicDiary';
import { MusicLog } from '../../types';

export default function MusicDiaryScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [logs, setLogs] = useState<MusicLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<MusicLog | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = observarDiarioMusical(
      user.uid,
      (nextLogs) => {
        setLogs(nextLogs);
        setLoading(false);
        setLoadError(false);
      },
      (error) => {
        console.error('Erro ao carregar diário musical:', error);
        setLoading(false);
        setLoadError(true);
      },
    );
    return unsubscribe;
  }, [user]);

  const averageRating = useMemo(() => {
    if (!logs.length) return '—';
    return (logs.reduce((total, log) => total + log.rating, 0) / logs.length).toFixed(1);
  }, [logs]);

  const requestDelete = (log: MusicLog) => {
    if (!user) return;
    setDeleteError('');
    setPendingDelete(log);
  };

  const confirmDelete = async () => {
    if (!user || !pendingDelete) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await excluirRegistroMusical(pendingDelete.id, user.uid);
      setPendingDelete(null);
    } catch (error) {
      console.error('Erro ao remover registro:', error);
      const code = (error as { code?: string })?.code;
      setDeleteError(code === 'permission-denied'
        ? 'O Firestore bloqueou a exclusão. Confira as regras da coleção musicLogs.'
        : 'Não foi possível remover este registro. Tente novamente.');
    } finally {
      setDeleting(false);
    }
  };

  const renderLog = ({ item }: { item: MusicLog }) => (
    <View style={styles.logRow}>
      <View style={styles.albumMark}>
        <MaterialIcons name="music-note" size={25} color={colors.primary} />
      </View>
      <View style={styles.logContent}>
        <View style={styles.logHeading}>
          <View style={styles.trackIdentity}>
            <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.artistName} numberOfLines={1}>{item.artist}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remover ${item.title} do diário`}
            onPress={() => requestDelete(item)}
            hitSlop={8}
            style={styles.removeButton}
          >
            <MaterialIcons name="delete-outline" size={20} color={colors.error} />
          </Pressable>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <MaterialIcons key={star} name={star <= item.rating ? 'star' : 'star-border'} size={16} color={star <= item.rating ? '#F5B942' : colors.border} />
            ))}
          </View>
          <Text style={styles.dateText}>{item.listenedAt.toLocaleDateString('pt-BR')}</Text>
        </View>
        {item.review ? <Text style={styles.reviewText}>{item.review}</Text> : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.headingBlock}>
          <Text style={styles.kicker}>SEU ARQUIVO SONORO</Text>
          <Text style={styles.title}>Diário</Text>
          <Text style={styles.subtitle}>Cada faixa ouvida, guardada aqui.</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Registrar música ouvida"
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
        >
          <MaterialIcons name="add" size={26} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{logs.length}</Text>
          <Text style={styles.summaryLabel}>FAIXAS</Text>
        </View>
        <View style={styles.summaryRule} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{averageRating}</Text>
          <Text style={styles.summaryLabel}>NOTA MÉDIA</Text>
        </View>
        <View style={styles.summaryRule} />
        <View style={styles.summaryItem}>
          <MaterialIcons name="headphones" size={23} color={colors.primary} />
          <Text style={styles.summaryLabel}>OUVIR</Text>
        </View>
      </View>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Ouvidas recentemente</Text>
        {logs.length > 0 ? <Text style={styles.count}>{logs.length}</Text> : null}
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : loadError ? (
        <View style={styles.centerState}>
          <MaterialIcons name="wifi-off" size={34} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>Não foi possível carregar</Text>
          <Text style={styles.emptyCopy}>Confira sua conexão e tente novamente.</Text>
        </View>
      ) : logs.length === 0 ? (
        <View style={styles.centerState}>
          <View style={styles.emptyIcon}>
            <MaterialIcons name="graphic-eq" size={34} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Seu diário começa com uma música</Text>
          <Text style={styles.emptyCopy}>Registre uma faixa que você ouviu, dê uma nota e guarde a lembrança.</Text>
          <Pressable onPress={() => setModalVisible(true)} style={styles.emptyAction}>
            <Text style={styles.emptyActionText}>Registrar primeira audição</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={logs}
          renderItem={renderLog}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <MusicLogModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      <ConfirmDialog
        visible={pendingDelete !== null}
        title="Remover do diário?"
        message={pendingDelete ? `A avaliação de “${pendingDelete.title}” será excluída.` : ''}
        confirmLabel="Remover"
        danger
        loading={deleting}
        errorMessage={deleteError}
        onCancel={() => {
          if (!deleting) setPendingDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    topBar: {
      paddingHorizontal: 22,
      paddingTop: 22,
      paddingBottom: 21,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headingBlock: {
      flex: 1,
      paddingRight: 14,
    },
    kicker: {
      color: colors.primary,
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 1.3,
    },
    title: {
      color: colors.text,
      fontSize: 35,
      fontWeight: '900',
      marginTop: 3,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 3,
    },
    addButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    summary: {
      minHeight: 86,
      marginHorizontal: 22,
      marginTop: 1,
      marginBottom: 25,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    summaryItem: {
      minWidth: 64,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
    },
    summaryValue: {
      color: colors.text,
      fontSize: 21,
      fontWeight: '800',
    },
    summaryLabel: {
      color: colors.textSecondary,
      fontSize: 9,
      fontWeight: '800',
      letterSpacing: 0.6,
      marginTop: 3,
    },
    summaryRule: {
      width: 1,
      height: 36,
      backgroundColor: colors.border,
    },
    sectionHeading: {
      marginHorizontal: 22,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '800',
    },
    count: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '700',
    },
    centerState: {
      flex: 1,
      paddingHorizontal: 36,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 54,
    },
    emptyIcon: {
      width: 66,
      height: 66,
      borderRadius: 33,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 17,
    },
    emptyTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '800',
      textAlign: 'center',
      marginTop: 14,
    },
    emptyCopy: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 19,
      textAlign: 'center',
      marginTop: 7,
    },
    emptyAction: {
      minHeight: 44,
      paddingHorizontal: 18,
      marginTop: 20,
      borderRadius: 8,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyActionText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
    },
    listContent: {
      paddingHorizontal: 22,
      paddingBottom: 26,
    },
    logRow: {
      flexDirection: 'row',
      paddingVertical: 15,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      gap: 13,
    },
    albumMark: {
      width: 50,
      height: 50,
      borderRadius: 7,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logContent: {
      flex: 1,
      minWidth: 0,
    },
    logHeading: {
      minHeight: 39,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 8,
    },
    trackIdentity: {
      flex: 1,
    },
    trackTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '800',
    },
    artistName: {
      color: colors.textSecondary,
      fontSize: 12,
      marginTop: 2,
    },
    removeButton: {
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    stars: {
      flexDirection: 'row',
      gap: 1,
    },
    dateText: {
      color: colors.textSecondary,
      fontSize: 11,
    },
    reviewText: {
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 18,
      marginTop: 8,
    },
  });
}
