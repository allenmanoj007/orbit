import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeScreen } from '../../components/common/SafeScreen';
import { ConversationItem } from '../../components/chat/ConversationItem';
import { EmptyState } from '../../components/common/EmptyState';
import { apiClient } from '../../services/api';
import { setConversations } from '../../store/slices/chatSlice';
import { RootState } from '../../store';
import { Colors } from '../../theme/colors';

export const ChatsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { conversations } = useSelector((state: RootState) => state.chat);
  const [stories, setStories] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  useEffect(() => {
    const loadChatData = async () => {
      try {
        const [convRes, storiesRes, requestsRes] = await Promise.all([
          apiClient.get('/chat/conversations'),
          apiClient.get('/stories/feed').catch(() => ({ data: { data: [] } })),
          apiClient.get('/connections/pending').catch(() => ({ data: { data: [] } })),
        ]);

        if (convRes.data?.data) {
          dispatch(setConversations(convRes.data.data));
        }
        if (storiesRes.data?.data) {
          setStories(storiesRes.data.data);
        }
        if (requestsRes.data?.data) {
          setPendingRequests(requestsRes.data.data);
        }
      } catch (e: any) {
        console.warn('Error loading chats:', e.message);
      }
    };

    loadChatData();
  }, [dispatch]);

  return (
    <SafeScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Camera')}
            style={styles.snapBtn}
          >
            <Text style={{ fontSize: 18 }}>⚡</Text>
          </TouchableOpacity>
        </View>

        {/* Stories Horizontal Tray */}
        <View style={styles.storiesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* Create your story */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Camera')}
              style={styles.storyItem}
            >
              <View style={styles.addStoryRing}>
                <Text style={styles.addStoryPlus}>+</Text>
              </View>
              <Text style={styles.storyName}>Your story</Text>
            </TouchableOpacity>

            {/* Friends' stories */}
            {stories.map((item, index) => (
              <TouchableOpacity key={index} style={styles.storyItem}>
                <View
                  style={[
                    styles.storyRing,
                    item.hasUnviewed && styles.storyRingActive,
                  ]}
                >
                  <Image
                    source={{
                      uri:
                        item.user.avatarUrl ||
                        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
                    }}
                    style={styles.storyAvatar}
                  />
                </View>
                <Text numberOfLines={1} style={styles.storyName}>
                  {item.user.displayName.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Pending Requests Banner */}
        {pendingRequests.length > 0 ? (
          <TouchableOpacity
            style={styles.pendingBanner}
            activeOpacity={0.85}
          >
            <Text style={styles.pendingIcon}>🔔</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.pendingTitle}>
                {pendingRequests.length} Connection Request{pendingRequests.length > 1 ? 's' : ''}
              </Text>
              <Text style={styles.pendingSub}>People nearby want to meet you</Text>
            </View>
            <Text style={styles.pendingArrow}>→</Text>
          </TouchableOpacity>
        ) : null}

        {/* Conversation List */}
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationItem
              conversation={item}
              onPress={() =>
                navigation.navigate('ChatRoom', {
                  conversationId: item.id,
                  targetUser: item.otherUser,
                })
              }
            />
          )}
          ListEmptyComponent={
            <EmptyState
              emoji="💬"
              title="No chats yet"
              description="Connect with interesting people on the Nearby tab to start chatting!"
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
  },
  snapBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storiesContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingLeft: 16,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 64,
  },
  addStoryRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  addStoryPlus: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: '700',
  },
  storyRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    padding: 2,
    marginBottom: 4,
  },
  storyRingActive: {
    borderWidth: 2.5,
    borderColor: Colors.primary,
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  storyName: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  pendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 12,
    borderRadius: 14,
  },
  pendingIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  pendingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  pendingSub: {
    fontSize: 12,
    color: '#64748B',
  },
  pendingArrow: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '700',
  },
});
