import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface AvatarProps {
  url?: string | null;
  name?: string;
  size?: number;
  isOnline?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  url,
  name,
  size = 48,
  isOnline,
}) => {
  const getInitials = (str?: string) => {
    if (!str) return 'O';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return str.slice(0, 2).toUpperCase();
  };

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {url ? (
        <Image
          source={{ uri: url }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            { width: size, height: size, borderRadius: size / 2, backgroundColor: Colors.primaryLight },
          ]}
        >
          <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
            {getInitials(name)}
          </Text>
        </View>
      )}

      {isOnline !== undefined ? (
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: isOnline ? Colors.success : Colors.light.textMuted,
              width: Math.max(10, size * 0.25),
              height: Math.max(10, size * 0.25),
              borderRadius: Math.max(5, (size * 0.25) / 2),
            },
          ]}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
