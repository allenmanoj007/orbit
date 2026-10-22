import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { Avatar } from '../common/Avatar';
import { Colors } from '../../theme/colors';

interface ConversationItemProps {
  conversation: {
    id: string;
    otherUser: {
      id: string;
      displayName: string;
      username: string;
      avatarUrl?: string;
      city?: string;
    } | null;
    lastMessage: {
      content?: string;
      messageType: string;
      createdAt: string;
    } | null;
    unreadCount?: number;
  };
  onPress: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onPress,
}) => {
  const { otherUser, lastMessage, unreadCount } = conversation;

  const formattedTime = lastMessage?.createdAt
    ? format(new Date(lastMessage.createdAt), 'h:mm a')
    : '';

  const getPreviewText = () => {
    if (!lastMessage) return 'Say hello! 👋';
    switch (lastMessage.messageType) {
      case 'IMAGE':
        return '📷 Photo';
      case 'VOICE':
        return '🎙️ Voice note';
      case 'SNAP':
        return '⚡ Snap';
      case 'VIDEO':
        return '🎥 Video';
      default:
        return lastMessage.content || '';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.container}
    >
      <Avatar
        url={otherUser?.avatarUrl}
        name={otherUser?.displayName}
        size={54}
        isOnline={true}
      />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text numberOfLines={1} style={styles.name}>
            {otherUser?.displayName || 'Orbit User'}
          </Text>
          <Text style={styles.time}>{formattedTime}</Text>
        </View>

        <View style={styles.bottomRow}>
          <Text numberOfLines={1} style={styles.preview}>
            {getPreviewText()}
          </Text>
          {unreadCount && unreadCount > 0 ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  content: {
    flex: 1,
    marginLeft: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: '#94A3B8',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preview: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
