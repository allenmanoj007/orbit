import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface DistanceBadgeProps {
  distance: string;
}

export const DistanceBadge: React.FC<DistanceBadgeProps> = ({ distance }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.pin}>📍</Text>
      <Text style={styles.text}>{distance}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  pin: {
    fontSize: 11,
    marginRight: 4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
