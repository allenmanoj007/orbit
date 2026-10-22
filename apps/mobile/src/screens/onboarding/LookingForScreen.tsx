import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeScreen } from '../../components/common/SafeScreen';
import { Button } from '../../components/common/Button';
import { LOOKING_FOR_OPTIONS } from '../../constants/lookingFor';
import { apiClient } from '../../services/api';
import { Colors } from '../../theme/colors';

export const LookingForScreen = ({ navigation, route }: any) => {
  const [selected, setSelected] = useState<string[]>(['New Friends']);
  const [loading, setLoading] = useState(false);

  const toggleOption = (title: string) => {
    if (selected.includes(title)) {
      if (selected.length === 1) return; // Keep at least one
      setSelected(selected.filter((item) => item !== title));
    } else {
      setSelected([...selected, title]);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await apiClient.patch('/profiles/me', {
        lookingFor: selected,
      });
      navigation.replace('Main');
    } catch (e: any) {
      // Even if network fails, proceed to main
      navigation.replace('Main');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.step}>Step 3 of 3</Text>
          <Text style={styles.title}>I’m looking for...</Text>
          <Text style={styles.subtitle}>
            Choose what connections you want to make. You can select multiple!
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.list}>
          {LOOKING_FOR_OPTIONS.map((item) => {
            const isSelected = selected.includes(item.title);
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleOption(item.title)}
                activeOpacity={0.8}
                style={[
                  styles.card,
                  isSelected ? styles.selectedCard : styles.unselectedCard,
                ]}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.cardTitle,
                      isSelected && { color: Colors.primary },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                </View>
                <Text style={[styles.check, isSelected && styles.checkSelected]}>
                  {isSelected ? '✓' : '○'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Enter Orbit"
            onPress={handleFinish}
            loading={loading}
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
  list: {
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  unselectedCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  selectedCard: {
    backgroundColor: '#F5F3FF',
    borderColor: Colors.primary,
  },
  emoji: {
    fontSize: 26,
    marginRight: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  check: {
    fontSize: 18,
    color: '#CBD5E1',
    marginLeft: 12,
  },
  checkSelected: {
    color: Colors.primary,
    fontWeight: '800',
  },
  footer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
});
