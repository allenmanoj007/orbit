import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeScreen } from '../../components/common/SafeScreen';
import { apiClient } from '../../services/api';
import { Colors } from '../../theme/colors';

export const PrivacySettingsScreen = ({ navigation }: any) => {
  const [discoveryEnabled, setDiscoveryEnabled] = useState(true);
  const [distanceDisplay, setDistanceDisplay] = useState<'EXACT' | 'RANGE' | 'HIDDEN'>('EXACT');
  const [nearbyVisibility, setNearbyVisibility] = useState<'EVERYONE' | 'CONNECTIONS' | 'NOBODY'>('EVERYONE');
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showReadReceipts, setShowReadReceipts] = useState(true);

  const saveSettings = async (updates: any) => {
    try {
      await apiClient.patch('/profiles/me/privacy', updates);
    } catch (e) {
      console.warn('Privacy update failed:', e);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Orbit Account?',
      'This will permanently delete your profile, connections, messages, and snaps. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Permanently Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete('/users/me');
              navigation.replace('Auth');
            } catch (e) {
              Alert.alert('Error', 'Could not delete account at this time.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.navBack}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy & Safety</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Location & Discovery Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>LOCATION & DISCOVERY</Text>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text style={styles.rowTitle}>Nearby Discovery</Text>
              <Text style={styles.rowDesc}>
                Allow people nearby to discover your profile in their feed
              </Text>
            </View>
            <Switch
              value={discoveryEnabled}
              onValueChange={(val) => {
                setDiscoveryEnabled(val);
                saveSettings({ discoveryEnabled: val });
              }}
              trackColor={{ false: '#CBD5E1', true: Colors.primary }}
            />
          </View>

          <Text style={styles.subHeader}>Distance Display Format</Text>
          {(['EXACT', 'RANGE', 'HIDDEN'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => {
                setDistanceDisplay(mode);
                saveSettings({ distanceDisplay: mode });
              }}
              style={styles.radioRow}
            >
              <View>
                <Text style={styles.radioTitle}>
                  {mode === 'EXACT'
                    ? 'Approximate distance (e.g. 1.2 km away)'
                    : mode === 'RANGE'
                    ? 'Distance bracket (e.g. 1 - 2 km)'
                    : 'Hidden (shows only "Nearby")'}
                </Text>
              </View>
              <Text style={[styles.radioDot, distanceDisplay === mode && styles.radioActive]}>
                {distanceDisplay === mode ? '●' : '○'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Visibility & Interaction */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>INTERACTION RULES</Text>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text style={styles.rowTitle}>Online Status</Text>
              <Text style={styles.rowDesc}>
                Show active green indicator when you are using Orbit
              </Text>
            </View>
            <Switch
              value={showOnlineStatus}
              onValueChange={(val) => {
                setShowOnlineStatus(val);
                saveSettings({ showOnlineStatus: val });
              }}
              trackColor={{ false: '#CBD5E1', true: Colors.primary }}
            />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text style={styles.rowTitle}>Read Receipts</Text>
              <Text style={styles.rowDesc}>
                Show checkmarks when messages are read
              </Text>
            </View>
            <Switch
              value={showReadReceipts}
              onValueChange={(val) => {
                setShowReadReceipts(val);
                saveSettings({ showReadReceipts: val });
              }}
              trackColor={{ false: '#CBD5E1', true: Colors.primary }}
            />
          </View>
        </View>

        {/* Dangerous Zone */}
        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <Text style={[styles.sectionHeader, { color: Colors.error }]}>
            DANGER ZONE
          </Text>

          <TouchableOpacity
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>Delete Orbit Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  navBack: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  section: {
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  subHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  rowDesc: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 18,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radioTitle: {
    fontSize: 14,
    color: '#334155',
  },
  radioDot: {
    fontSize: 18,
    color: '#94A3B8',
  },
  radioActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteText: {
    color: Colors.error,
    fontWeight: '700',
    fontSize: 15,
  },
});
