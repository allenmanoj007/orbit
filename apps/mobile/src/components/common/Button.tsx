import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.lg,
      paddingHorizontal: size === 'sm' ? 12 : size === 'lg' ? 24 : 18,
      paddingVertical: size === 'sm' ? 8 : size === 'lg' ? 16 : 12,
      opacity: disabled ? 0.6 : 1,
    };

    if (variant === 'secondary') {
      base.backgroundColor = '#EEF2FF';
    } else if (variant === 'outline') {
      base.borderWidth = 1.5;
      base.borderColor = Colors.primary;
      base.backgroundColor = 'transparent';
    } else if (variant === 'ghost') {
      base.backgroundColor = 'transparent';
    } else if (variant === 'danger') {
      base.backgroundColor = Colors.error;
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontWeight: '600',
      fontSize: size === 'sm' ? 13 : size === 'lg' ? 17 : 15,
    };

    if (variant === 'primary' || variant === 'danger') {
      base.color = '#FFFFFF';
    } else if (variant === 'secondary') {
      base.color = Colors.primary;
    } else if (variant === 'outline') {
      base.color = Colors.primary;
    } else if (variant === 'ghost') {
      base.color = Colors.primary;
    }

    return base;
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={style}
      >
        <LinearGradient
          colors={[Colors.primary, '#857DFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[getContainerStyle(), styles.gradientShadow]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              {icon}
              <Text style={[getTextStyle(), textStyle, icon ? { marginLeft: 8 } : null]}>
                {title}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'danger' ? '#FFFFFF' : Colors.primary} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyle(), textStyle, icon ? { marginLeft: 8 } : null]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradientShadow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
});
