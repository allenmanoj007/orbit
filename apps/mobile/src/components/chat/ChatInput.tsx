import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

interface ChatInputProps {
  onSendText: (text: string) => void;
  onSendVoice?: () => void;
  onPickMedia?: () => void;
  onOpenSnapCamera?: () => void;
  onTyping?: (isTyping: boolean) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendText,
  onSendVoice,
  onPickMedia,
  onOpenSnapCamera,
  onTyping,
}) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleTextChange = (val: string) => {
    setText(val);
    if (onTyping) {
      onTyping(val.length > 0);
    }
  };

  const handleSend = () => {
    if (!text.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSendText(text.trim());
    setText('');
    if (onTyping) onTyping(false);
  };

  const handleVoiceRecordToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isRecording) {
      setIsRecording(false);
      onSendVoice?.();
    } else {
      setIsRecording(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Quick Camera Snap Button */}
      <TouchableOpacity
        onPress={onOpenSnapCamera}
        style={styles.iconButton}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>📸</Text>
      </TouchableOpacity>

      {/* Media Attach Button */}
      <TouchableOpacity
        onPress={onPickMedia}
        style={styles.iconButton}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>📎</Text>
      </TouchableOpacity>

      {/* Input Field / Recording Indicator */}
      <View style={styles.inputContainer}>
        {isRecording ? (
          <View style={styles.recordingBar}>
            <View style={styles.recordDot} />
            <Text style={styles.recordingText}>Recording voice note... 0:04</Text>
          </View>
        ) : (
          <TextInput
            value={text}
            onChangeText={handleTextChange}
            placeholder="Type a message..."
            placeholderTextColor="#94A3B8"
            style={styles.textInput}
            multiline
            maxLength={1000}
          />
        )}
      </View>

      {/* Dynamic Action: Send or Voice Record */}
      {text.trim().length > 0 ? (
        <TouchableOpacity
          onPress={handleSend}
          style={styles.sendButton}
          activeOpacity={0.8}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={handleVoiceRecordToggle}
          style={[styles.micButton, isRecording && styles.micButtonActive]}
          activeOpacity={0.8}
        >
          <Text style={styles.micIcon}>{isRecording ? '⏹' : '🎙️'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  icon: {
    fontSize: 20,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 40,
    maxHeight: 100,
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  textInput: {
    fontSize: 15,
    color: '#1E293B',
    maxHeight: 90,
  },
  recordingBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.error,
    marginRight: 8,
  },
  recordingText: {
    fontSize: 13,
    color: Colors.error,
    fontWeight: '600',
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  sendIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 2,
  },
  micButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  micButtonActive: {
    backgroundColor: '#FEE2E2',
  },
  micIcon: {
    fontSize: 18,
  },
});
