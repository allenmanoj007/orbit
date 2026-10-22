import React from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../hooks/useTheme';

interface SafeScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const SafeScreen: React.FC<SafeScreenProps> = ({ children, style }) => {
  const { theme, isDark } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }, style]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
