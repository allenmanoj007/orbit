import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  containerStyle,
  style,
  ...props
}) => {
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.surfaceSubtle,
            borderColor: error ? Colors.error : theme.border,
          },
        ]}
      >
        {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
        <TextInput
          placeholderTextColor={theme.textMuted}
          style={[styles.input, { color: theme.text }, style]}
          {...props}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 14,
    height: 52,
  },
  iconContainer: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
