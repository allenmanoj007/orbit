import { Platform } from 'react-native';

// In Android emulator 10.0.2.2 points to host localhost; for iOS simulator localhost works
export const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000/api/v1',
  ios: 'http://localhost:3000/api/v1',
  default: 'http://localhost:3000/api/v1',
});

export const SOCKET_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
  default: 'http://localhost:3000',
});
