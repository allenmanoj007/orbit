export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Onboarding: undefined;
  Main: undefined;
  ChatRoom: {
    conversationId: string;
    targetUser: {
      id: string;
      displayName: string;
      avatarUrl?: string;
    };
  };
  Camera: undefined;
  ViewSnap: { snapId: string; url: string; content?: string };
  ViewProfile: { userId: string };
  EditProfile: undefined;
  PrivacySettings: undefined;
  ActiveCall: {
    callId: string;
    callType: 'AUDIO' | 'VIDEO';
    targetUser: { id: string; displayName: string; avatarUrl?: string };
    isCaller: boolean;
  };
};

export type MainTabParamList = {
  Nearby: undefined;
  Discover: undefined;
  SnapsTab: undefined;
  Chats: undefined;
  Profile: undefined;
};
