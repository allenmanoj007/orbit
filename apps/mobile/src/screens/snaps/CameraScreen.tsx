import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors } from '../../theme/colors';

const FILTERS = ['Normal', 'Warm', 'Vintage', 'Cinematic', 'B&W', 'Glow'];

export const CameraScreen = ({ navigation }: any) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [selectedFilter, setSelectedFilter] = useState('Normal');
  const [captured, setCaptured] = useState(false);

  if (!permission) {
    return <View style={styles.darkContainer} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required to capture snaps and stories.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.grantBtn}
        >
          <Text style={styles.grantText}>Grant Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = () => {
    setCaptured(true);
  };

  const handleSendToNearby = () => {
    Alert.alert(
      'Post as Nearby Snap? 📍',
      'This snap will be visible to people within 2 km of you for 24 hours. Your exact location will remain private.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Post to Nearby',
          onPress: () => {
            Alert.alert('Posted!', 'Your nearby snap is now live.');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleAddToStory = () => {
    Alert.alert('Story Updated', 'Your snap was added to your 24h story.');
    navigation.goBack();
  };

  return (
    <View style={styles.darkContainer}>
      <CameraView style={styles.camera} facing={facing}>
        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.circleBtn}
          >
            <Text style={styles.btnIcon}>✕</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
            style={styles.circleBtn}
          >
            <Text style={styles.btnIcon}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Filter overlay indicator */}
        {selectedFilter !== 'Normal' ? (
          <View style={styles.filterTag}>
            <Text style={styles.filterTagText}>✨ {selectedFilter}</Text>
          </View>
        ) : null}

        {/* Bottom Bar: Filters & Shutter */}
        <View style={styles.bottomControls}>
          {/* Filters List */}
          <View style={styles.filterRow}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setSelectedFilter(f)}
                style={[
                  styles.filterPill,
                  selectedFilter === f && styles.filterPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === f && styles.filterTextActive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Shutter Button or Send Options */}
          {!captured ? (
            <TouchableOpacity
              onPress={handleCapture}
              style={styles.shutterOuter}
              activeOpacity={0.8}
            >
              <View style={styles.shutterInner} />
            </TouchableOpacity>
          ) : (
            <View style={styles.sendActions}>
              <TouchableOpacity
                onPress={handleAddToStory}
                style={[styles.actionPill, { backgroundColor: '#334155' }]}
              >
                <Text style={styles.actionText}>+ My Story</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSendToNearby}
                style={[styles.actionPill, { backgroundColor: Colors.primary }]}
              >
                <Text style={styles.actionText}>📍 Nearby Snap</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  darkContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#0D0F1D',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  grantBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  grantText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  filterTag: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterTagText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  bottomControls: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    marginHorizontal: 4,
  },
  filterPillActive: {
    backgroundColor: '#FFFFFF',
  },
  filterText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#000000',
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  sendActions: {
    flexDirection: 'row',
  },
  actionPill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginHorizontal: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
