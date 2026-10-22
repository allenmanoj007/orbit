import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeScreen } from '../../components/common/SafeScreen';
import { Button } from '../../components/common/Button';
import { LocationService } from '../../services/location.service';
import { Colors } from '../../theme/colors';

export const LocationPermissionScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);

  const handleAllowLocation = async () => {
    setLoading(true);
    try {
      await LocationService.syncLocationWithServer();
    } catch (e) {
      console.warn('Location sync failed:', e);
    } finally {
      setLoading(false);
      navigation.navigate('OnboardingInterests');
    }
  };

  const handleSkip = () => {
    navigation.navigate('OnboardingInterests');
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <View style={styles.illustrationWrapper}>
          <Text style={styles.radarIcon}>📡</Text>
          <View style={styles.pulseRing} />
        </View>

        <Text style={styles.title}>Find people around you</Text>
        <Text style={styles.body}>
          Orbit uses approximate distance to help you discover friends, study
          buddies, and gaming partners in your area.
        </Text>

        <View style={styles.privacyBox}>
          <Text style={styles.privacyShield}>🛡️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.privacyTitle}>Your privacy comes first</Text>
            <Text style={styles.privacyDesc}>
              We never show your exact street address or live pinpoint. Only
              approximate distances like “1.2 km away”. You can toggle discovery
              off anytime.
            </Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <Button
            title="Allow Location Access"
            onPress={handleAllowLocation}
            loading={loading}
            style={styles.allowButton}
          />

          <Button
            title="Maybe Later"
            variant="ghost"
            onPress={handleSkip}
          />
        </View>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  radarIcon: {
    fontSize: 52,
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  privacyBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  privacyShield: {
    fontSize: 24,
    marginRight: 12,
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  privacyDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  buttons: {
    width: '100%',
  },
  allowButton: {
    marginBottom: 12,
  },
});
