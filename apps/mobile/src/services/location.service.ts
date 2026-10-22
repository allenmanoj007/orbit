import * as Location from 'expo-location';
import { apiClient } from './api';

export class LocationService {
  static async requestPermissions(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  static async getCurrentLocation() {
    const isGranted = await this.requestPermissions();
    if (!isGranted) return null;

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      accuracy: loc.coords.accuracy || undefined,
    };
  }

  static async syncLocationWithServer(): Promise<boolean> {
    try {
      const coords = await this.getCurrentLocation();
      if (!coords) return false;

      await apiClient.post('/location/update', coords);
      return true;
    } catch (e) {
      console.warn('Failed to sync location with server:', e);
      return false;
    }
  }
}
