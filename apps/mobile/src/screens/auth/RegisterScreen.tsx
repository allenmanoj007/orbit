import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { SafeScreen } from '../../components/common/SafeScreen';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { apiClient } from '../../services/api';
import { setCredentials } from '../../store/slices/authSlice';
import { Colors } from '../../theme/colors';

export const RegisterScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!displayName || !email || !password) {
      Alert.alert('Required Fields', 'Please fill out all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Password too short', 'Password must be at least 8 characters with letters and numbers');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/auth/register/email', {
        displayName,
        email,
        password,
      });

      const { accessToken, refreshToken, userId } = res.data.data;

      const userRes = await apiClient.get('/auth/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      dispatch(
        setCredentials({
          user: userRes.data.data,
          accessToken,
          refreshToken,
        })
      );

      // Advance to onboarding to set up interests & location
      navigation.replace('Onboarding');
    } catch (e: any) {
      Alert.alert(
        'Registration Failed',
        e.response?.data?.message || 'Could not complete registration'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Text style={styles.brandTitle}>Join Orbit</Text>
            <Text style={styles.subtitle}>
              Find friends, collaborators, and hobbies nearby.
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Your Name"
              placeholder="e.g. Alex Morgan"
              value={displayName}
              onChangeText={setDisplayName}
            />

            <Input
              label="Email Address"
              placeholder="alex@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Input
              label="Password"
              placeholder="At least 8 chars (letters & numbers)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              style={styles.btn}
            />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 6,
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  btn: {
    marginTop: 10,
    marginBottom: 20,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#64748B',
    fontSize: 14,
  },
  loginLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
