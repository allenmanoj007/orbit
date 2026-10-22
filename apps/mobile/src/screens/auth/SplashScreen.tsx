import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from 'react-redux';
import { setCredentials, logout } from '../../store/slices/authSlice';
import { apiClient } from '../../services/api';
import { Colors } from '../../theme/colors';

export const SplashScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync('orbit_access_token');
        if (token) {
          const res = await apiClient.get('/auth/me');
          if (res.data?.data) {
            dispatch(setCredentials({ user: res.data.data, accessToken: token }));
            navigation.replace('Main');
            return;
          }
        }
      } catch (e) {
        dispatch(logout());
      }
      navigation.replace('Auth');
    };

    const timer = setTimeout(checkAuth, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#0F1222', '#1B1E38', '#2C2665']}
      style={styles.container}
    >
      <View style={styles.orbitRings}>
        <View style={[styles.ring, styles.ringOuter]} />
        <View style={[styles.ring, styles.ringMid]} />
        <View style={[styles.ring, styles.ringInner]}>
          <Text style={styles.centerPlanet}>🪐</Text>
        </View>
      </View>

      <Text style={styles.logoText}>Orbit</Text>
      <Text style={styles.tagline}>Find your people. Right here.</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitRings: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  ring: {
    position: 'absolute',
    borderRadius: 200,
    borderWidth: 1,
  },
  ringOuter: {
    width: 190,
    height: 190,
    borderColor: 'rgba(108, 99, 255, 0.2)',
  },
  ringMid: {
    width: 140,
    height: 140,
    borderColor: 'rgba(108, 99, 255, 0.4)',
  },
  ringInner: {
    width: 90,
    height: 90,
    borderColor: Colors.primary,
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPlanet: {
    fontSize: 40,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: '#A5B4FC',
    marginTop: 8,
    fontWeight: '500',
  },
});
