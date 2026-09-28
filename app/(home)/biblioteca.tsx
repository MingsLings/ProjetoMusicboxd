import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { MusicLogModal } from '../../components/MusicLogModal';
import { ThemeColors } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { MusicCatalogItem } from '../../types';

const CATALOG: MusicCatalogItem[] = [
  { id: '1', title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354, genre: 'Rock' },
  { id: '2', title: 'Blinding Lights', artist: 'The Weeknd', duration: 200, genre: 'Synthwave' },
  { id: '3', title: 'Levitating', artist: 'Dua Lipa', duration: 203, genre: 'Pop' },
  { id: '4', title: 'Shape of You', artist: 'Ed Sheeran', duration: 235, genre: 'Pop' },
  { id: '5', title: 'Stairway to Heaven', artist: 'Led Zeppelin', duration: 482, genre: 'Rock' },
  { id: '6', title: 'Hotel California', artist: 'Eagles', duration: 391, genre: 'Rock' },
  { id: '7', title: 'Midnight City', artist: 'M83', duration: 244, genre: 'Synthpop' },
  { id: '8', title: 'Take Me Out', artist: 'Franz Ferdinand', duration: 267, genre: 'Rock' },
];

export default function DiscoverScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [search, setSearch] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<MusicCatalogItem | null>(null);
  const filteredTracks = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    if (!normalizedSearch) return CATALOG;
    return CATALOG.filter((track) =>
      `${track.title} ${track.artist} ${track.genre}`.toLocaleLowerCase().includes(normalizedSearch),
    );
  }, [search]);

  const renderTrack = ({ item }: { item: MusicCatalogItem }) => (
    <View style={styles.trackRow}>
      <View style={[styles.trackIcon, { backgroundColor: colorForGenre(item.genre) }]}>
        <MaterialIcons name="graphic-eq" size={22} color="#FFFFFF" />
      </View>
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>
        <Text style={styles.genre}>{item.genre} · {formatDuration(item.duration)}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Registrar ${item.title} de ${item.artist}`}
        style={styles.logButton}
        onPress={() => setSelectedTrack(item)}
      >
        <MaterialIcons name="add" size={21} color={colors.primary} />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.kicker}>ENCONTRE SUA PRÓXIMA FAIXA</Text>
        <Text style={styles.title}>Descobrir</Text>
        <Text style={styles.subtitle}>Escolha uma música e registre como foi ouvir.</Text>
      </View>

      <View style={styles.searchBox}>
        <MaterialIcons name="search" size={21} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Música, artista ou gênero"
          placeholderTextColor={colors.placeholder}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Limpar busca" onPress={() => setSearch('')}>
            <MaterialIcons name="close" size={19} color={colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.listHeading}>
        <Text style={styles.listTitle}>Sugestões</Text>
        <Text style={styles.trackCount}>{filteredTracks.length} faixas</Text>
      </View>

      <FlatList
        data={filteredTracks}
        renderItem={renderTrack}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={(
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={32} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Nenhuma faixa encontrada.</Text>
          </View>
        )}
      />

      <MusicLogModal
        visible={selectedTrack !== null}
        onClose={() => setSelectedTrack(null)}
        initialTitle={selectedTrack?.title}
        initialArtist={selectedTrack?.artist}
      />
    </View>
  );
}

function formatDuration(duration: number) {
  return `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')}`;
}

function colorForGenre(genre: string) {
  const colors: Record<string, string> = {
    Rock: '#C85852',
    Pop: '#358C82',
    Synthwave: '#3F78A5',
    Synthpop: '#B56A49',
  };
  return colors[genre] ?? '#567B61';
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    heading: {
      paddingHorizontal: 22,
      paddingTop: 22,
      paddingBottom: 17,
    },
    kicker: {
      color: colors.primary,
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 1.2,
    },
    title: {
      color: colors.text,
      fontSize: 33,
      fontWeight: '900',
      marginTop: 4,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 4,
    },
    searchBox: {
      minHeight: 48,
      marginHorizontal: 22,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.surface,
    },
    searchInput: {
      flex: 1,
      minWidth: 0,
      color: colors.inputText,
      fontSize: 14,
      paddingVertical: 10,
    },
    listHeading: {
      paddingHorizontal: 22,
      paddingTop: 24,
      paddingBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    listTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '800',
    },
    trackCount: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    list: {
      paddingHorizontal: 22,
      paddingBottom: 24,
    },
    trackRow: {
      minHeight: 78,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      gap: 12,
    },
    trackIcon: {
      width: 48,
      height: 48,
      borderRadius: 7,
      alignItems: 'center',
      justifyContent: 'center',
    },
    trackInfo: {
      flex: 1,
      minWidth: 0,
    },
    trackTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '800',
    },
    artist: {
      color: colors.textSecondary,
      fontSize: 12,
      marginTop: 2,
    },
    genre: {
      color: colors.primary,
      fontSize: 10,
      fontWeight: '700',
      marginTop: 5,
    },
    logButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderColor: colors.border,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
    },
    emptyState: {
      minHeight: 180,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
  });
}
