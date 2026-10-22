import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

interface ChipProps {
  label: string;
  emoji?: string;
  selected?: boolean;
  onPress: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  emoji,
  selected = false,
  onPress,
}) => {
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={[
        styles.chip,
        selected ? styles.selectedChip : styles.unselectedChip,
      ]}
    >
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
      <Text
        style={[
          styles.label,
          selected ? styles.selectedLabel : styles.unselectedLabel,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1.5,
  },
  unselectedChip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  selectedChip: {
    backgroundColor: '#EEF2FF',
    borderColor: Colors.primary,
  },
  emoji: {
    fontSize: 16,
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  unselectedLabel: {
    color: '#334155',
  },
  selectedLabel: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
