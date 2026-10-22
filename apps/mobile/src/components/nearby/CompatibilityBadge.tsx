import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface CompatibilityBadgeProps {
  score: number;
}

export const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({ score }) => {
  const isHigh = score >= 75;
  const isMedium = score >= 50 && score < 75;

  const bg = isHigh ? '#E6FAF5' : isMedium ? '#EEF2FF' : '#F1F5F9';
  const text = isHigh ? Colors.success : isMedium ? Colors.primary : '#64748B';

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.icon}>✨</Text>
      <Text style={[styles.score, { color: text }]}>{score}% Match</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  icon: {
    fontSize: 12,
    marginRight: 4,
  },
  score: {
    fontSize: 12,
    fontWeight: '700',
  },
});
