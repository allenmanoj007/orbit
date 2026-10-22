import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { SafeScreen } from '../../components/common/SafeScreen';
import { Avatar } from '../../components/common/Avatar';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { ChatInput } from '../../components/chat/ChatInput';
import { apiClient } from '../../services/api';
import { socketService } from '../../services/socket.service';
import { RootState } from '../../store';
import { Colors } from '../../theme/colors';

export const ChatScreen = ({ route, navigation }: any) => {
  const { conversationId, targetUser } = route.params;
  const { user } = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // 1. Fetch past messages
    const fetchHistory = async () => {
      try {
        const res = await apiClient.get(
          `/chat/conversations/${conversationId}/messages`
        );
        if (res.data?.data) {
          setMessages(res.data.data);
        }
      } catch (e: any) {
        console.warn('Failed to load message history:', e.message);
      }
    };
    fetchHistory();

    // 2. Connect to real-time socket room
    let socket: any = null;
    socketService.connect().then((s) => {
      socket = s;
      socketService.joinConversation(conversationId);

      socket.on('chat:message_received', (msg: any) => {
        setMessages((prev) => [...prev, msg]);
      });

      socket.on('chat:typing', (data: any) => {
        if (data.userId !== user?.id) {
          setIsTyping(data.isTyping);
        }
      });
    });

    return () => {
      if (socket) {
        socketService.leaveConversation(conversationId);
        socket.off('chat:message_received');
        socket.off('chat:typing');
      }
    };
  }, [conversationId, user?.id]);

  const handleSendMessage = async (text: string) => {
    try {
      const res = await apiClient.post('/chat/messages', {
        conversationId,
        content: text,
        messageType: 'TEXT',
      });

      const newMsg = res.data.data;
      setMessages((prev) => [...prev, newMsg]);

      // Broadcast over socket
      const socket = socketService.getSocket();
      socket?.emit('chat:message_sent', {
        conversationId,
        message: newMsg,
      });

      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (e: any) {
      Alert.alert('Send Error', 'Failed to deliver message');
    }
  };

  const handleSendVoice = async () => {
    // Simulate audio upload and voice message record
    try {
      const res = await apiClient.post('/chat/messages', {
        conversationId,
        content: 'Voice note (0:14)',
        messageType: 'VOICE',
      });
      const newMsg = res.data.data;
      setMessages((prev) => [...prev, newMsg]);
    } catch (e) {
      console.warn('Voice send failed:', e);
    }
  };

  const handleCall = (callType: 'AUDIO' | 'VIDEO') => {
    navigation.navigate('ActiveCall', {
      callId: `call_${Date.now()}`,
      callType,
      targetUser,
      isCaller: true,
    });
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ViewProfile', { userId: targetUser?.id })
            }
            style={styles.headerUser}
            activeOpacity={0.8}
          >
            <Avatar
              url={targetUser?.avatarUrl}
              name={targetUser?.displayName}
              size={38}
              isOnline={true}
            />
            <View style={{ marginLeft: 10 }}>
              <Text numberOfLines={1} style={styles.headerName}>
                {targetUser?.displayName || 'Chat'}
              </Text>
              <Text style={styles.headerStatus}>
                {isTyping ? 'typing...' : 'Online'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Audio & Video Calling Buttons */}
          <View style={styles.callButtons}>
            <TouchableOpacity
              onPress={() => handleCall('AUDIO')}
              style={styles.callBtn}
            >
              <Text style={{ fontSize: 18 }}>📞</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleCall('VIDEO')}
              style={styles.callBtn}
            >
              <Text style={{ fontSize: 18 }}>📹</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Message Stream */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isMine={item.senderId === user?.id}
            />
          )}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Real-time Input Controls */}
        <ChatInput
          onSendText={handleSendMessage}
          onSendVoice={handleSendVoice}
          onOpenSnapCamera={() => navigation.navigate('Camera')}
          onTyping={(typing) => socketService.emitTyping(conversationId, typing)}
        />
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 32,
    color: Colors.primary,
    fontWeight: '300',
  },
  headerUser: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerStatus: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '600',
  },
  callButtons: {
    flexDirection: 'row',
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
