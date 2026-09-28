export interface ThemeColors {
  primary: string;
  primaryLight: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  inputText: string;
  placeholder: string;
}

export const darkColors: ThemeColors = {
  primary: '#1DB954',
  primaryLight: '#1ed760',
  background: '#0F0F0F',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  border: '#282828',
  success: '#1DB954',
  warning: '#F59E0B',
  error: '#D32F2F',
  info: '#1976D2',
  inputText: '#FFFFFF',
  placeholder: '#727272',
};

export const lightColors: ThemeColors = {
  primary: '#11823B',
  primaryLight: '#1DB954',
  background: '#F5F7F6',
  surface: '#FFFFFF',
  text: '#172033',
  textSecondary: '#667085',
  border: '#D8E0DB',
  success: '#11823B',
  warning: '#B26A00',
  error: '#C62828',
  info: '#1667A8',
  inputText: '#172033',
  placeholder: '#98A2B3',
};

export const theme = {
  colors: darkColors,
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    screenTop: 24,
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 999,
  },
};
