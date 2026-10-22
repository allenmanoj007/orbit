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

export const LoginScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Required', 'Please enter your email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login/email', { email, password });
      const { accessToken, refreshToken, userId } = res.data.data;

      // Fetch profile
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

      navigation.replace('Main');
    } catch (e: any) {
      Alert.alert(
        'Login Failed',
        e.response?.data?.message || 'Invalid email or password'
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
            <Text style={styles.brandTitle}>Orbit</Text>
            <Text style={styles.subtitle}>Welcome back! Discover who’s around you.</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="alex@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.signInButton}
            />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>New to Orbit? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signupLink}>Create an account</Text>
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
    marginBottom: 36,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 6,
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  signInButton: {
    marginTop: 8,
    marginBottom: 20,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  footerText: {
    color: '#64748B',
    fontSize: 14,
  },
  signupLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
