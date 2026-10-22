import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  conversations: any[];
  currentMessages: any[];
  typingUsers: Record<string, boolean>;
  isLoading: boolean;
}

const initialState: ChatState = {
  conversations: [],
  currentMessages: [],
  typingUsers: {},
  isLoading: false,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<any[]>) => {
      state.conversations = action.payload;
    },
    setCurrentMessages: (state, action: PayloadAction<any[]>) => {
      state.currentMessages = action.payload;
    },
    appendMessage: (state, action: PayloadAction<any>) => {
      state.currentMessages.push(action.payload);
    },
    setUserTyping: (
      state,
      action: PayloadAction<{ userId: string; isTyping: boolean }>
    ) => {
      state.typingUsers[action.payload.userId] = action.payload.isTyping;
    },
  },
});

export const {
  setConversations,
  setCurrentMessages,
  appendMessage,
  setUserTyping,
} = chatSlice.actions;

export default chatSlice.reducer;
