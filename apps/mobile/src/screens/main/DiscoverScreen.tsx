import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { SafeScreen } from '../../components/common/SafeScreen';
import { RootState } from '../../store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_ITEM_SIZE = (SCREEN_WIDTH - 4) / 3;

export const DiscoverScreen = ({ navigation }: any) => {
  const [search, setSearch] = useState('');
  const { users } = useSelector((state: RootState) => state.nearby);

  const sampleExploreItems = [
    { id: '1', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500', user: 'sarah_creative', type: 'reel', views: '2.4k', match: '95%' },
    { id: '2', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500', user: 'maya_flow', type: 'snap', match: '91%' },
    { id: '3', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', user: 'alex_r', type: 'photo', match: '88%' },
    { id: '4', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500', user: 'liam_beats', type: 'reel', views: '1.8k', match: '84%' },
    { id: '5', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500', user: 'elena_art', type: 'snap', match: '89%' },
    { id: '6', img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500', user: 'david_code', type: 'photo', match: '82%' },
  ];

  return (
    <SafeScreen style={{ backgroundColor: '#FFFFFF' }}>
      <View style={styles.container}>
        {/* Instagram Search Bar */}
        <View style={styles.searchHeader}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search people, passions, hobbies..."
              placeholderTextColor="#8E8E8E"
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* 3-Column Explore Grid */}
        <ScrollView contentContainerStyle={styles.gridContainer}>
          <View style={styles.grid}>
            {sampleExploreItems.map((item, index) => {
              const isLarge = index === 0 || index === 7;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  style={[
                    styles.gridItem,
                    isLarge && styles.largeGridItem,
                  ]}
                  onPress={() => {
                    if (users[0]) {
                      navigation.navigate('ViewProfile', { userId: users[0].id });
                    }
                  }}
                >
                  <Image source={{ uri: item.img }} style={styles.gridImg} />

                  {/* High Match Pill */}
                  <View style={styles.matchPill}>
                    <Text style={styles.matchText}>{item.match}</Text>
                  </View>

                  {/* Type Badge (Reel / Snap) */}
                  {item.type === 'reel' ? (
                    <View style={styles.reelBadge}>
                      <Text style={styles.reelIcon}>▶ {item.views}</Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
    color: '#8E8E8E',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#262626',
  },
  gridContainer: {
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    padding: 1,
    position: 'relative',
  },
  largeGridItem: {
    width: GRID_ITEM_SIZE * 2,
    height: GRID_ITEM_SIZE * 2,
  },
  gridImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  matchPill: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  matchText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
  },
  reelBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  reelIcon: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});
