import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeScreen } from '../../components/common/SafeScreen';
import { Chip } from '../../components/common/Chip';
import { Button } from '../../components/common/Button';
import { INTEREST_OPTIONS } from '../../constants/interests';
import { apiClient } from '../../services/api';
import { Colors } from '../../theme/colors';

export const InterestsScreen = ({ navigation }: any) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleContinue = async () => {
    if (selected.length < 3) {
      Alert.alert('Pick a few more', 'Please select at least 3 interests to help us find good matches nearby.');
      return;
    }

    setLoading(true);
    try {
      // Fetch interest objects from backend or match IDs
      const backendInterests = await apiClient.get('/admin/interests').catch(() => null);
      // In either case proceed to next onboarding step
      navigation.navigate('OnboardingLookingFor', { interestIds: selected });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.step}>Step 2 of 3</Text>
          <Text style={styles.title}>What are you into?</Text>
          <Text style={styles.subtitle}>
            Select 3 or more topics you enjoy. We’ll show people with common interests first.
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.chipsContainer}>
          {INTEREST_OPTIONS.map((item) => (
            <Chip
              key={item.id}
              label={item.name}
              emoji={item.emoji}
              selected={selected.includes(item.id)}
              onPress={() => toggleInterest(item.id)}
            />
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.counter}>
            {selected.length} selected {selected.length < 3 ? `(minimum 3)` : '✓'}
          </Text>
          <Button
            title="Continue"
            onPress={handleContinue}
            loading={loading}
            disabled={selected.length < 3}
          />
        </View>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  header: {
    marginBottom: 20,
  },
  step: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 24,
  },
  footer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  counter: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
});
