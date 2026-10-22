import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { format } from 'date-fns';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

interface MessageBubbleProps {
  message: {
    id: string;
    content?: string;
    messageType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'VOICE' | 'SNAP';
    createdAt: string;
    senderId: string;
    mediaAttachments?: Array<{ s3Key: string; duration?: number; contentType: string }>;
    reactions?: Array<{ id: string; emoji: string; userId: string }>;
  };
  isMine: boolean;
  onReact?: (emoji: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMine,
  onReact,
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const formattedTime = message.createdAt
    ? format(new Date(message.createdAt), 'h:mm a')
    : '';

  const renderContent = () => {
    switch (message.messageType) {
      case 'IMAGE':
        return (
          <Image
            source={{
              uri:
                message.mediaAttachments?.[0]?.s3Key ||
                'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=500',
            }}
            style={styles.imageAttachment}
          />
        );

      case 'VOICE':
        return (
          <View style={styles.voiceContainer}>
            <TouchableOpacity
              onPress={() => setIsPlayingVoice(!isPlayingVoice)}
              style={[
                styles.voicePlayBtn,
                { backgroundColor: isMine ? '#FFFFFF' : Colors.primary },
              ]}
            >
              <Text style={{ color: isMine ? Colors.primary : '#FFFFFF', fontSize: 13 }}>
                {isPlayingVoice ? '⏸' : '▶'}
              </Text>
            </TouchableOpacity>

            {/* Simulated waveform bars */}
            <View style={styles.waveformContainer}>
              {[12, 22, 18, 30, 16, 26, 14, 20, 28, 15, 24, 18, 10].map(
                (height, index) => (
                  <View
                    key={index}
                    style={[
                      styles.waveBar,
                      {
                        height,
                        backgroundColor: isMine ? '#E0E7FF' : '#94A3B8',
                      },
                    ]}
                  />
                )
              )}
            </View>

            <Text
              style={[
                styles.voiceDuration,
                { color: isMine ? '#E0E7FF' : '#64748B' },
              ]}
            >
              0:14
            </Text>
          </View>
        );

      case 'SNAP':
        return (
          <View style={styles.snapBox}>
            <Text style={styles.snapIcon}>⚡</Text>
            <View>
              <Text style={[styles.snapTitle, { color: isMine ? '#FFFFFF' : '#1E293B' }]}>
                Temporary Snap
              </Text>
              <Text style={[styles.snapSub, { color: isMine ? '#E0E7FF' : '#64748B' }]}>
                Tap to view
              </Text>
            </View>
          </View>
        );

      case 'TEXT':
      default:
        return (
          <Text
            style={[
              styles.text,
              { color: isMine ? '#FFFFFF' : '#1E293B' },
            ]}
          >
            {message.content}
          </Text>
        );
    }
  };

  return (
    <View
      style={[
        styles.container,
        isMine ? styles.mineContainer : styles.otherContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isMine ? styles.mineBubble : styles.otherBubble,
        ]}
      >
        {renderContent()}

        <View style={styles.metaRow}>
          <Text
            style={[
              styles.timeText,
              { color: isMine ? 'rgba(255,255,255,0.7)' : '#94A3B8' },
            ]}
          >
            {formattedTime}
          </Text>
          {isMine ? (
            <Text style={styles.readReceipt}>✓✓</Text>
          ) : null}
        </View>
      </View>

      {/* Reactions Row */}
      {message.reactions && message.reactions.length > 0 ? (
        <View style={styles.reactionsRow}>
          {message.reactions.map((r, i) => (
            <View key={i} style={styles.reactionPill}>
              <Text style={styles.reactionEmoji}>{r.emoji}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '78%',
  },
  mineContainer: {
    alignSelf: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
  },
  mineBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timeText: {
    fontSize: 11,
    marginRight: 4,
  },
  readReceipt: {
    fontSize: 10,
    color: '#A5B4FC',
  },
  imageAttachment: {
    width: 220,
    height: 160,
    borderRadius: BorderRadius.md,
    resizeMode: 'cover',
  },
  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    minWidth: 180,
  },
  voicePlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 30,
    marginRight: 8,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
    marginHorizontal: 1.5,
  },
  voiceDuration: {
    fontSize: 12,
    fontWeight: '600',
  },
  snapBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  snapIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  snapTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  snapSub: {
    fontSize: 12,
  },
  reactionsRow: {
    flexDirection: 'row',
    marginTop: -6,
    marginLeft: 8,
  },
  reactionPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  reactionEmoji: {
    fontSize: 12,
  },
});
