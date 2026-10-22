import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeScreen } from '../../components/common/SafeScreen';
import { Avatar } from '../../components/common/Avatar';
import { Chip } from '../../components/common/Chip';
import { Button } from '../../components/common/Button';
import { CompatibilityBadge } from '../../components/nearby/CompatibilityBadge';
import { apiClient } from '../../services/api';
import { Colors } from '../../theme/colors';

export const ViewProfileScreen = ({ route, navigation }: any) => {
  const { userId } = route.params;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get(`/profiles/${userId}`);
        if (res.data?.data) {
          setProfile(res.data.data);
        }
      } catch (e: any) {
        Alert.alert('Error', 'Could not load profile');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleConnect = async () => {
    try {
      await apiClient.post('/connections/request', { receiverId: userId });
      Alert.alert('Request Sent', 'Your connection request has been sent!');
    } catch (e: any) {
      Alert.alert('Note', e.response?.data?.message || 'Could not send request');
    }
  };

  const handleBlockReport = () => {
    Alert.alert('Safety Options', 'What would you like to do?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Report Profile',
        onPress: () => {
          apiClient.post(`/users/${userId}/report`, { reason: 'INAPPROPRIATE_CONTENT' });
          Alert.alert('Reported', 'Thank you for keeping Orbit safe. Our moderators will review this.');
        },
      },
      {
        text: 'Block User',
        style: 'destructive',
        onPress: () => {
          apiClient.post(`/users/${userId}/block`);
          Alert.alert('Blocked', 'This user can no longer discover you or contact you.');
          navigation.goBack();
        },
      },
    ]);
  };

  if (loading || !profile) {
    return <SafeScreen><View style={styles.center}><Text>Loading profile...</Text></View></SafeScreen>;
  }

  return (
    <SafeScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.navBack}>‹ Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBlockReport}>
            <Text style={styles.navMenu}>•••</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.avatarSection}>
          <Avatar
            url={profile.avatarUrl}
            name={profile.displayName}
            size={100}
            isOnline={true}
          />
          <Text style={styles.name}>{profile.displayName}</Text>
          <Text style={styles.username}>@{profile.username}</Text>
          {profile.profession ? (
            <Text style={styles.profession}>{profile.profession}</Text>
          ) : null}

          {profile.compatibility ? (
            <View style={styles.matchBadgeRow}>
              <CompatibilityBadge score={profile.compatibility.score} />
              <Text style={styles.matchExplanation}>
                {profile.compatibility.explanation}
              </Text>
            </View>
          ) : null}

          {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.chipsRow}>
            {profile.interests?.map((i: any) => (
              <Chip
                key={i.interest?.id || i.id}
                label={i.interest?.name || i.name}
                emoji={i.interest?.emoji || i.emoji}
                selected={true}
                onPress={() => {}}
              />
            ))}
          </View>
        </View>

        {/* Looking For */}
        {profile.lookingFor?.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Looking For</Text>
            <View style={styles.chipsRow}>
              {profile.lookingFor.map((tag: string, idx: number) => (
                <View key={idx} style={styles.lookingPill}>
                  <Text style={styles.lookingText}>✨ {tag}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Connect Action */}
        <View style={styles.actionRow}>
          <Button
            title="Connect"
            onPress={handleConnect}
            style={{ flex: 1, marginRight: 10 }}
          />
          <Button
            title="Message"
            variant="outline"
            onPress={() =>
              navigation.navigate('ChatRoom', {
                conversationId: `conv_${userId}`,
                targetUser: profile,
              })
            }
            style={{ flex: 1 }}
          />
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  navBack: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '700',
  },
  navMenu: {
    fontSize: 20,
    color: '#64748B',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
  },
  username: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  profession: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 10,
  },
  matchBadgeRow: {
    alignItems: 'center',
    marginVertical: 8,
  },
  matchExplanation: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 280,
  },
  bio: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 300,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  lookingPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  lookingText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 32,
  },
});
