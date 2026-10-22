import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'accent' | 'success' | 'subtle';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'accent':
        return { bg: '#FFE4E9', text: Colors.accent };
      case 'success':
        return { bg: '#E6FAF5', text: Colors.success };
      case 'subtle':
        return { bg: '#F1F5F9', text: '#475569' };
      default:
        return { bg: '#EEF2FF', text: Colors.primary };
    }
  };

  const { bg, text } = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
