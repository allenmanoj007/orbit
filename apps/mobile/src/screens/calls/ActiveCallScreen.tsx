import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from '../../components/common/Avatar';
import { Colors } from '../../theme/colors';

export const ActiveCallScreen = ({ route, navigation }: any) => {
  const { callId, callType, targetUser, isCaller } = route.params;
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(callType === 'VIDEO');
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [status, setStatus] = useState(isCaller ? 'Calling...' : 'Connected');

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleEndCall = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={['#0F1222', '#1B1E38', '#0F1222']}
      style={styles.container}
    >
      <View style={styles.topInfo}>
        <Text style={styles.callTypeTitle}>
          {callType === 'VIDEO' ? 'Orbit Video Call' : 'Orbit Audio Call'}
        </Text>
        <Text style={styles.duration}>
          {status === 'Connected' ? formatTimer(callDuration) : status}
        </Text>
      </View>

      <View style={styles.userCenter}>
        <Avatar
          url={targetUser?.avatarUrl}
          name={targetUser?.displayName}
          size={120}
        />
        <Text style={styles.userName}>{targetUser?.displayName || 'User'}</Text>
        <Text style={styles.subText}>🔒 End-to-End Encrypted via WebRTC</Text>
      </View>

      {/* Calling Controls */}
      <View style={styles.controlsBar}>
        <TouchableOpacity
          onPress={() => setIsMuted(!isMuted)}
          style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
        >
          <Text style={styles.controlIcon}>{isMuted ? '🔇' : '🎙️'}</Text>
          <Text style={styles.controlLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        {callType === 'VIDEO' ? (
          <TouchableOpacity
            onPress={() => setIsVideoOn(!isVideoOn)}
            style={[styles.controlBtn, !isVideoOn && styles.controlBtnActive]}
          >
            <Text style={styles.controlIcon}>{isVideoOn ? '📹' : '🚫'}</Text>
            <Text style={styles.controlLabel}>Camera</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setIsSpeaker(!isSpeaker)}
            style={[styles.controlBtn, isSpeaker && styles.controlBtnActive]}
          >
            <Text style={styles.controlIcon}>{isSpeaker ? '🔊' : '🔈'}</Text>
            <Text style={styles.controlLabel}>Speaker</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleEndCall}
          style={styles.endCallBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.endCallIcon}>☎</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  topInfo: {
    alignItems: 'center',
  },
  callTypeTitle: {
    color: '#A5B4FC',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  duration: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 6,
  },
  userCenter: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 20,
  },
  subText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
  },
  controlsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  controlBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  controlIcon: {
    fontSize: 22,
  },
  controlLabel: {
    color: '#CBD5E1',
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
  endCallBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  endCallIcon: {
    color: '#FFFFFF',
    fontSize: 28,
    transform: [{ rotate: '135deg' }],
  },
});
