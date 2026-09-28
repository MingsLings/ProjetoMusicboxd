import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeColors, theme } from '../constants/theme';
import { registrarAudicao } from '../services/musicDiary';

interface MusicLogModalProps {
  visible: boolean;
  onClose: () => void;
  initialTitle?: string;
  initialArtist?: string;
}

export function MusicLogModal({ visible, onClose, initialTitle = '', initialArtist = '' }: MusicLogModalProps) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [title, setTitle] = useState(initialTitle);
  const [artist, setArtist] = useState(initialArtist);
  const [rating, setRating] = useState(0);
  const [listenedAt, setListenedAt] = useState(new Date());
  const [review, setReview] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) return;
    setTitle(initialTitle);
    setArtist(initialArtist);
    setRating(0);
    setListenedAt(new Date());
    setReview('');
    setError('');
  }, [visible, initialTitle, initialArtist]);

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setListenedAt(selectedDate);
  };

  const handleSave = async () => {
    if (!title.trim() || !artist.trim()) {
      setError('Informe o nome da música e o artista.');
      return;
    }
    if (!rating) {
      setError('Selecione uma nota de 1 a 5 estrelas.');
      return;
    }
    if (!user) {
      setError('Entre na sua conta para salvar uma audição.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await registrarAudicao({
        userId: user.uid,
        title,
        artist,
        rating,
        listenedAt,
        review,
      });
      onClose();
    } catch (saveError) {
      console.error('Erro ao registrar audição:', saveError);
      setError('Não foi possível salvar. Verifique a conexão e tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>DIÁRIO MUSICAL</Text>
              <Text style={styles.heading}>Registrar audição</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Fechar" onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={22} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Música</Text>
            <TextInput
              accessibilityLabel="Nome da música"
              style={styles.input}
              placeholder="Nome da música"
              placeholderTextColor={colors.placeholder}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />

            <Text style={styles.label}>Artista</Text>
            <TextInput
              accessibilityLabel="Artista"
              style={styles.input}
              placeholder="Nome do artista"
              placeholderTextColor={colors.placeholder}
              value={artist}
              onChangeText={setArtist}
              maxLength={100}
            />

            <Text style={styles.label}>Sua nota</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((value) => (
                <Pressable
                  key={value}
                  accessibilityRole="button"
                  accessibilityLabel={`${value} ${value === 1 ? 'estrela' : 'estrelas'}`}
                  onPress={() => setRating(value)}
                  style={styles.starButton}
                >
                  <MaterialIcons name={value <= rating ? 'star' : 'star-border'} size={36} color={value <= rating ? '#F5B942' : colors.textSecondary} />
                </Pressable>
              ))}
              <Text style={styles.ratingValue}>{rating ? `${rating}/5` : '—/5'}</Text>
            </View>

            <Text style={styles.label}>Data em que ouviu</Text>
            <Pressable style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <MaterialIcons name="calendar-today" size={19} color={colors.primary} />
              <Text style={styles.dateText}>{listenedAt.toLocaleDateString('pt-BR')}</Text>
              <MaterialIcons name="expand-more" size={20} color={colors.textSecondary} />
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={listenedAt}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={handleDateChange}
              />
            )}

            <Text style={styles.label}>Comentário (opcional)</Text>
            <TextInput
              accessibilityLabel="Comentário sobre a música"
              style={[styles.input, styles.reviewInput]}
              placeholder="O que achou dessa música?"
              placeholderTextColor={colors.placeholder}
              value={review}
              onChangeText={setReview}
              multiline
              maxLength={500}
            />

            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          </ScrollView>

          <Pressable
            accessibilityRole="button"
            onPress={handleSave}
            disabled={saving}
            style={[styles.saveButton, saving && styles.disabledButton]}
          >
            {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.saveText}>Salvar no diário</Text>}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.68)',
      justifyContent: 'flex-end',
    },
    sheet: {
      maxHeight: '92%',
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 24,
    },
    header: {
      minHeight: 76,
      paddingHorizontal: 22,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    eyebrow: {
      color: colors.primary,
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 1.2,
    },
    heading: {
      color: colors.text,
      fontSize: 21,
      fontWeight: '800',
      marginTop: 3,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: {
      paddingHorizontal: 22,
      paddingTop: 8,
      paddingBottom: 20,
    },
    label: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '700',
      marginTop: 17,
      marginBottom: 8,
    },
    input: {
      minHeight: 48,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 13,
      color: colors.inputText,
      backgroundColor: colors.surface,
      fontSize: 15,
    },
    ratingRow: {
      minHeight: 46,
      flexDirection: 'row',
      alignItems: 'center',
    },
    starButton: {
      width: 42,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ratingValue: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '700',
      marginLeft: 8,
    },
    dateButton: {
      minHeight: 48,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 13,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    dateText: {
      color: colors.text,
      fontSize: 14,
      flex: 1,
    },
    reviewInput: {
      minHeight: 86,
      paddingTop: 12,
      textAlignVertical: 'top',
    },
    error: {
      color: colors.error,
      fontSize: 13,
      marginTop: 12,
    },
    saveButton: {
      minHeight: 50,
      marginHorizontal: 22,
      marginTop: 6,
      borderRadius: 8,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '800',
    },
    disabledButton: {
      opacity: 0.65,
    },
  });
}
