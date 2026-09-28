import React from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemeColors } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  loading?: boolean;
  errorMessage?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  danger = false,
  loading = false,
  errorMessage = '',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors, danger);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {errorMessage ? <Text accessibilityRole="alert" style={styles.error}>{errorMessage}</Text> : null}
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              disabled={loading}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onConfirm}
              disabled={loading}
              style={[styles.confirmButton, loading && styles.disabled]}
            >
              {loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.confirmText}>{confirmLabel}</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(colors: ThemeColors, danger: boolean) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      padding: 24,
      backgroundColor: 'rgba(0, 0, 0, 0.62)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dialog: {
      width: '100%',
      maxWidth: 380,
      padding: 22,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      backgroundColor: colors.surface,
    },
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '800',
    },
    message: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
      marginTop: 9,
    },
    error: {
      color: colors.error,
      fontSize: 13,
      lineHeight: 18,
      marginTop: 12,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 22,
    },
    cancelButton: {
      minWidth: 92,
      minHeight: 42,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 14,
      borderRadius: 7,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    cancelText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '700',
    },
    confirmButton: {
      minWidth: 112,
      minHeight: 42,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 14,
      borderRadius: 7,
      backgroundColor: danger ? colors.error : colors.primary,
    },
    confirmText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
    },
    disabled: {
      opacity: 0.65,
    },
  });
}
