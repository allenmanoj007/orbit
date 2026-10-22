import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeScreen } from '../../components/common/SafeScreen';
import { apiClient } from '../../services/api';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_ITEM_SIZE = (SCREEN_WIDTH - 2) / 3;

export const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [profile, setProfile] = useState<any>(user?.profile || null);
  const [activeTab, setActiveTab] = useState<'grid' | 'snaps' | 'saved'>('grid');

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await apiClient.get('/profiles/me');
        if (res.data?.data) {
          setProfile(res.data.data);
        }
      } catch (e: any) {
        console.warn('Profile fetch failed:', e.message);
      }
    };
    fetchMe();
  }, []);

  const sampleGridPosts = [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500',
  ];

  return (
    <SafeScreen style={{ backgroundColor: '#FFFFFF' }}>
      <ScrollView style={styles.container}>
        {/* Instagram Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.usernameGroup}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.headerUsername}>
              {profile?.username || 'orbit_user'}
            </Text>
            <Text style={styles.arrowDown}>▾</Text>
          </View>

          <View style={styles.topBarRight}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Camera')}
              style={styles.topIcon}
            >
              <Text style={{ fontSize: 20 }}>➕</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('PrivacySettings')}
              style={styles.topIcon}
            >
              <Text style={{ fontSize: 20 }}>☰</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarRow}>
            {/* Avatar */}
            <View style={styles.avatarWrapper}>
              <Image
                source={{
                  uri:
                    profile?.avatarUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
                }}
                style={styles.avatarImg}
              />
              <View style={styles.avatarPlusBadge}>
                <Text style={styles.plusIcon}>+</Text>
              </View>
            </View>

            {/* Stats Counters */}
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>18</Text>
                <Text style={styles.statLabel}>Snaps</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>342</Text>
                <Text style={styles.statLabel}>Connections</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>48</Text>
                <Text style={styles.statLabel}>Nearby</Text>
              </View>
            </View>
          </View>

          {/* Bio Details */}
          <View style={styles.bioSection}>
            <Text style={styles.displayName}>{profile?.displayName || 'Alex Morgan'}</Text>
            {profile?.profession ? (
              <Text style={styles.professionText}>{profile.profession}</Text>
            ) : null}
            <Text style={styles.bioText}>
              {profile?.bio ||
                'Product Designer & coffee explorer ☕ Connecting with creatives, gaming squads & runners nearby.'}
            </Text>
            <Text style={styles.linkText}>🔗 orbit.app/{profile?.username || 'alex_m'}</Text>
          </View>

          {/* Action Buttons Row */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.editBtn} activeOpacity={0.8}>
              <Text style={styles.btnText}>Edit profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editBtn} activeOpacity={0.8}>
              <Text style={styles.btnText}>Share profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('PrivacySettings')}
              style={styles.settingsIconBtn}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 14 }}>🛡️</Text>
            </TouchableOpacity>
          </View>

          {/* Story Highlights */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.highlightsTray}
          >
            {[
              { title: 'Trips', emoji: '✈️' },
              { title: 'Cafes', emoji: '☕' },
              { title: 'Design', emoji: '🎨' },
              { title: 'Gaming', emoji: '🎮' },
              { title: 'New', emoji: '➕' },
            ].map((hl, idx) => (
              <View key={idx} style={styles.highlightItem}>
                <View style={styles.highlightCircle}>
                  <Text style={{ fontSize: 20 }}>{hl.emoji}</Text>
                </View>
                <Text style={styles.highlightLabel}>{hl.title}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Tab Switcher (Grid, Snaps, Saved) */}
        <View style={styles.tabsBar}>
          <TouchableOpacity
            onPress={() => setActiveTab('grid')}
            style={[styles.tabBtn, activeTab === 'grid' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabIcon, activeTab === 'grid' && styles.tabIconActive]}>
              ▦
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('snaps')}
            style={[styles.tabBtn, activeTab === 'snaps' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabIcon, activeTab === 'snaps' && styles.tabIconActive]}>
              ⚡
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('saved')}
            style={[styles.tabBtn, activeTab === 'saved' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabIcon, activeTab === 'saved' && styles.tabIconActive]}>
              🔖
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3-Column Profile Media Grid */}
        <View style={styles.mediaGrid}>
          {sampleGridPosts.map((url, i) => (
            <View key={i} style={styles.gridMediaItem}>
              <Image source={{ uri: url }} style={styles.gridMediaImg} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  usernameGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  headerUsername: {
    fontSize: 18,
    fontWeight: '800',
    color: '#262626',
  },
  arrowDown: {
    fontSize: 12,
    marginLeft: 4,
    color: '#737373',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topIcon: {
    marginLeft: 16,
  },
  profileHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 82,
    height: 82,
    borderRadius: 41,
    position: 'relative',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 41,
  },
  avatarPlusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    marginTop: -2,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 16,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: '#262626',
  },
  statLabel: {
    fontSize: 12,
    color: '#262626',
    marginTop: 2,
  },
  bioSection: {
    marginTop: 10,
  },
  displayName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#262626',
  },
  professionText: {
    fontSize: 13,
    color: '#737373',
    marginTop: 1,
  },
  bioText: {
    fontSize: 13,
    color: '#262626',
    lineHeight: 18,
    marginTop: 3,
  },
  linkText: {
    fontSize: 13,
    color: '#00376B',
    fontWeight: '600',
    marginTop: 3,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 8,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#262626',
  },
  settingsIconBtn: {
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightsTray: {
    paddingVertical: 16,
    gap: 16,
  },
  highlightItem: {
    alignItems: 'center',
  },
  highlightCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#DBDBDB',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  highlightLabel: {
    fontSize: 11,
    color: '#262626',
  },
  tabsBar: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#DBDBDB',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: '#262626',
  },
  tabIcon: {
    fontSize: 20,
    color: '#8E8E8E',
  },
  tabIconActive: {
    color: '#262626',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridMediaItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    padding: 0.5,
  },
  gridMediaImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
