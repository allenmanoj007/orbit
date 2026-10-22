import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface NearbyUserCardProps {
  user: {
    id: string;
    displayName: string;
    username: string;
    avatarUrl?: string;
    profession?: string;
    age?: number;
    bio?: string;
    distanceFormatted: string;
    compatibilityScore: number;
    commonInterests: string[];
    interests: Array<{ id: string; name: string; emoji: string }>;
    lookingFor?: string[];
    connectionStatus?: string;
  };
  onConnect: () => void;
  onPressProfile?: () => void;
  onDirectMessage?: () => void;
}

export const NearbyUserCard: React.FC<NearbyUserCardProps> = ({
  user,
  onConnect,
  onPressProfile,
  onDirectMessage,
}) => {
  const [isLiked, setIsLiked] = useState(user.connectionStatus === 'ACCEPTED');
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLiked(!isLiked);
    if (!isLiked) onConnect();
  };

  return (
    <View style={styles.card}>
      {/* ─── Instagram-Grade Header ─── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onPressProfile}
          style={styles.headerLeft}
          activeOpacity={0.8}
        >
          {/* Gradient Story Ring */}
          <LinearGradient
            colors={Colors.storyGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarRing}
          >
            <View style={styles.avatarInner}>
              <Image
                source={{
                  uri:
                    user.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
                }}
                style={styles.avatarImg}
              />
            </View>
          </LinearGradient>

          <View style={styles.userMeta}>
            <View style={styles.usernameRow}>
              <Text style={styles.username}>@{user.username}</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedCheck}>✓</Text>
              </View>
              {user.age ? <Text style={styles.age}>· {user.age}</Text> : null}
            </View>
            <Text style={styles.locationTag}>
              📍 Near you · {user.distanceFormatted}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Options Dots */}
        <TouchableOpacity style={styles.moreBtn} activeOpacity={0.6}>
          <Text style={styles.moreIcon}>•••</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Main Media Image Container ─── */}
      <TouchableOpacity
        activeOpacity={0.98}
        onPress={onPressProfile}
        style={styles.imageContainer}
      >
        <Image
          source={{
            uri:
              user.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
          }}
          style={styles.mainImage}
        />

        {/* Subtle Compatibility Floating Pill */}
        {user.compatibilityScore > 0 ? (
          <View style={styles.compatPill}>
            <Text style={styles.compatIcon}>✨</Text>
            <Text style={styles.compatScore}>{user.compatibilityScore}% Match</Text>
          </View>
        ) : null}
      </TouchableOpacity>

      {/* ─── Instagram Action Row ─── */}
      <View style={styles.actionRow}>
        <View style={styles.actionLeft}>
          {/* Connect / Heart */}
          <TouchableOpacity
            onPress={handleLike}
            style={styles.actionBtn}
            activeOpacity={0.7}
          >
            <Text style={[styles.actionIcon, isLiked && { color: Colors.accent }]}>
              {isLiked ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>

          {/* Direct Message / Paperplane */}
          <TouchableOpacity
            onPress={onDirectMessage}
            style={styles.actionBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>✈️</Text>
          </TouchableOpacity>

          {/* Quick Snap reply */}
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>⚡</Text>
          </TouchableOpacity>
        </View>

        {/* Bookmark / Save */}
        <TouchableOpacity
          onPress={() => setIsSaved(!isSaved)}
          style={styles.actionBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>{isSaved ? '🔖' : '🏷️'}</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Caption, Tags & Intentions ─── */}
      <View style={styles.detailsContainer}>
        {/* Connection status line */}
        <Text style={styles.likesCount}>
          {isLiked
            ? '✓ Connected with you'
            : `Compatible with your interests and hobbies`}
        </Text>

        {/* Caption */}
        <Text style={styles.captionText}>
          <Text style={styles.captionUsername}>@{user.username} </Text>
          {user.profession ? (
            <Text style={styles.captionProfession}>[{user.profession}] </Text>
          ) : null}
          {user.bio}
        </Text>

        {/* Common Interests Callout */}
        {user.commonInterests && user.commonInterests.length > 0 ? (
          <View style={styles.commonTagBox}>
            <Text style={styles.commonTagText}>
              ✨ <Text style={styles.commonBold}>Common Interests:</Text>{' '}
              {user.commonInterests.join(', ')}
            </Text>
          </View>
        ) : null}

        {/* Looking For Pills */}
        {user.lookingFor && user.lookingFor.length > 0 ? (
          <View style={styles.lookingForRow}>
            <Text style={styles.lookingForLabel}>Looking for: </Text>
            {user.lookingFor.map((item, idx) => (
              <View key={idx} style={styles.tagPill}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Timestamp */}
        <Text style={styles.timeAgo}>Active nearby · Orbit Geolocation</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    padding: 1.5,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    resizeMode: 'cover',
  },
  userMeta: {
    marginLeft: 10,
    flex: 1,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 13,
    fontWeight: '700',
    color: '#262626',
  },
  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  verifiedCheck: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  age: {
    fontSize: 12,
    color: '#8E8E8E',
    marginLeft: 4,
  },
  locationTag: {
    fontSize: 11,
    color: '#737373',
    marginTop: 1,
  },
  moreBtn: {
    padding: 4,
  },
  moreIcon: {
    color: '#262626',
    fontSize: 16,
    letterSpacing: 1,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.1,
    backgroundColor: '#FAFAFA',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  compatPill: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backdropFilter: 'blur(8px)',
  },
  compatIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  compatScore: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    marginRight: 16,
    padding: 2,
  },
  actionIcon: {
    fontSize: 22,
  },
  detailsContainer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  likesCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#262626',
    marginBottom: 4,
  },
  captionText: {
    fontSize: 13,
    color: '#262626',
    lineHeight: 18,
    marginBottom: 6,
  },
  captionUsername: {
    fontWeight: '700',
  },
  captionProfession: {
    color: Colors.primary,
    fontWeight: '600',
  },
  commonTagBox: {
    backgroundColor: '#F8F7FF',
    borderWidth: 1,
    borderColor: '#ECE9FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 4,
  },
  commonTagText: {
    fontSize: 12,
    color: '#4B44CC',
    lineHeight: 16,
  },
  commonBold: {
    fontWeight: '700',
  },
  lookingForRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 6,
  },
  lookingForLabel: {
    fontSize: 11,
    color: '#737373',
    fontWeight: '500',
  },
  tagPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 4,
    marginVertical: 2,
  },
  tagText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '600',
  },
  timeAgo: {
    fontSize: 10,
    color: '#A8A8A8',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginTop: 4,
  },
});
