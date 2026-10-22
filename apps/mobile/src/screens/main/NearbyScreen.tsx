import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeScreen } from '../../components/common/SafeScreen';
import { NearbyUserCard } from '../../components/nearby/NearbyUserCard';
import { EmptyState } from '../../components/common/EmptyState';
import { apiClient } from '../../services/api';
import { LocationService } from '../../services/location.service';
import {
  setNearbyUsers,
  setNearbyLoading,
  updateUserConnectionStatus,
} from '../../store/slices/nearbySlice';
import { RootState } from '../../store';
import { Colors } from '../../theme/colors';

const FILTER_PILLS = ['All', 'Friends', 'Gaming', 'Creatives', 'Study', 'Fitness'];

export const NearbyScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state: RootState) => state.nearby);
  const [selectedPill, setSelectedPill] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [radiusKm, setRadiusKm] = useState(15);

  const fetchNearby = useCallback(async () => {
    try {
      dispatch(setNearbyLoading(true));
      await LocationService.syncLocationWithServer();

      const params: any = { radiusKm };
      if (selectedPill !== 'All') {
        params.lookingFor = selectedPill;
      }

      const res = await apiClient.get('/location/nearby', { params });
      if (res.data?.data?.users) {
        dispatch(setNearbyUsers(res.data.data.users));
      }
    } catch (e: any) {
      console.warn('Error fetching nearby:', e.message);
    } finally {
      dispatch(setNearbyLoading(false));
      setRefreshing(false);
    }
  }, [dispatch, radiusKm, selectedPill]);

  useEffect(() => {
    fetchNearby();
  }, [fetchNearby]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNearby();
  };

  const handleConnect = async (userId: string) => {
    try {
      dispatch(updateUserConnectionStatus({ userId, status: 'PENDING' }));
      await apiClient.post('/connections/request', { receiverId: userId });
    } catch (e) {
      console.warn('Connect failed:', e);
    }
  };

  return (
    <SafeScreen style={{ backgroundColor: '#FFFFFF' }}>
      <View style={styles.container}>
        {/* ─── Top Instagram App Bar ─── */}
        <View style={styles.appBar}>
          <Text style={styles.logoTitle}>Orbit</Text>

          <View style={styles.appBarActions}>
            {/* Radius Control Pill */}
            <TouchableOpacity
              onPress={() => {
                const next = radiusKm === 15 ? 30 : radiusKm === 30 ? 5 : 15;
                setRadiusKm(next);
              }}
              style={styles.radiusPill}
              activeOpacity={0.7}
            >
              <Text style={styles.radiusText}>📍 {radiusKm} km</Text>
            </TouchableOpacity>

            {/* Notifications */}
            <TouchableOpacity style={styles.iconBtn}>
              <Text style={styles.navIcon}>❤️</Text>
            </TouchableOpacity>

            {/* Direct Messages */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Chats')}
              style={styles.iconBtn}
            >
              <Text style={styles.navIcon}>✈️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Stories / Snaps Tray ─── */}
        <View style={styles.storiesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesList}>
            {/* Your Story */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Camera')}
              style={styles.storyItem}
              activeOpacity={0.8}
            >
              <View style={styles.addStoryWrapper}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }}
                  style={styles.addStoryImg}
                />
                <View style={styles.plusIconBadge}>
                  <Text style={styles.plusIcon}>+</Text>
                </View>
              </View>
              <Text style={styles.storyLabel}>Your story</Text>
            </TouchableOpacity>

            {/* Nearby user stories */}
            {users.slice(0, 6).map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => navigation.navigate('ViewProfile', { userId: item.id })}
                style={styles.storyItem}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={Colors.storyGradient}
                  style={styles.storyGradientRing}
                >
                  <View style={styles.storyImgInner}>
                    <Image
                      source={{
                        uri:
                          item.avatarUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
                      }}
                      style={styles.storyImg}
                    />
                  </View>
                </LinearGradient>
                <Text numberOfLines={1} style={styles.storyLabel}>
                  {item.username || item.displayName.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ─── Filter Pills ─── */}
        <View style={styles.filterBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
            {FILTER_PILLS.map((pill) => {
              const active = selectedPill === pill;
              return (
                <TouchableOpacity
                  key={pill}
                  onPress={() => setSelectedPill(pill)}
                  style={[styles.pillBtn, active && styles.pillBtnActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>
                    {pill}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ─── Feed ─── */}
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NearbyUserCard
              user={item}
              onConnect={() => handleConnect(item.id)}
              onPressProfile={() =>
                navigation.navigate('ViewProfile', { userId: item.id })
              }
              onDirectMessage={() =>
                navigation.navigate('ChatRoom', {
                  conversationId: `conv_${item.id}`,
                  targetUser: item,
                })
              }
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <EmptyState
              emoji="🛰️"
              title="No Profiles Nearby"
              description={`Expand your discovery radius beyond ${radiusKm} km to explore people around you.`}
              actionTitle="Expand to 30 km"
              onAction={() => setRadiusKm(30)}
            />
          }
        />
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  logoTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#262626',
    letterSpacing: -0.5,
  },
  appBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radiusPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginRight: 10,
  },
  radiusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  iconBtn: {
    marginLeft: 12,
  },
  navIcon: {
    fontSize: 20,
  },
  storiesSection: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 10,
  },
  storiesList: {
    paddingHorizontal: 12,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 68,
  },
  addStoryWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    position: 'relative',
    marginBottom: 4,
  },
  addStoryImg: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  plusIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    marginTop: -2,
  },
  storyGradientRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  storyImgInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',
    padding: 2,
  },
  storyImg: {
    width: '100%',
    height: '100%',
    borderRadius: 29,
  },
  storyLabel: {
    fontSize: 11,
    color: '#262626',
    textAlign: 'center',
  },
  filterBar: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F5F5F5',
  },
  filterList: {
    paddingHorizontal: 12,
  },
  pillBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  pillBtnActive: {
    backgroundColor: '#262626',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
});
