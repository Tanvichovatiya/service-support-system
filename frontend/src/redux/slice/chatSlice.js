import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedContact: null,
  curUser: null,

  messages: [],

  
  unreadTotal: 0,

  
  unreadCounts: {},

  loadingMessages: false,
  sendingMessage: false,
};

const chatSlice = createSlice({
  name: "chat",

  initialState,

  reducers: {
    setSelectedContact: (state, action) => {
      state.selectedContact = action.payload;
    },

    clearSelectedContact: (state) => {
      state.selectedContact = null;
      state.messages = [];
      state.curUser = null;
    },

    setMessages: (state, action) => {
      state.messages = action.payload || [];
    },

    addMessage: (state, action) => {
      const newMessage = action.payload;

      const newMessageId =
        newMessage?._id || newMessage?.id;

      const exists = state.messages.some((message) => {
        const messageId =
          message?._id || message?.id;

        return (
          messageId &&
          newMessageId &&
          messageId.toString() ===
            newMessageId.toString()
        );
      });

      if (!exists) {
        state.messages.push(newMessage);
      }
    },

    setLoadingMessages: (state, action) => {
      state.loadingMessages = action.payload;
    },

    setSendingMessage: (state, action) => {
      state.sendingMessage = action.payload;
    },

    setCurUser: (state, action) => {
      state.curUser = action.payload;
    },

  
    setUnreadMessages: (state, action) => {
      const data = action.payload || {};

      state.unreadTotal = data.totalUnread || 0;

      state.unreadCounts = {};

      (data.unreadCounts || []).forEach((item) => {
        const senderId =
          item.senderId?.toString();

        if (senderId) {
          state.unreadCounts[senderId] =
            item.unreadCount || 0;
        }
      });
    },

   
    incrementUnread: (state, action) => {
      const senderId =
        action.payload?.toString();

      if (!senderId) return;

      state.unreadCounts[senderId] =
        (state.unreadCounts[senderId] || 0) + 1;

      state.unreadTotal += 1;
    },

  
    clearUnread: (state, action) => {
    
      const senderId =
        action.payload?.toString();

      if (!senderId) return;
        console.log("sender:",senderId);
      const count =state.unreadCounts[senderId] || 0;

      state.unreadTotal = Math.max(
        0,
        state.unreadTotal - count
      );

      delete state.unreadCounts[senderId];
    },

    
    clearAllUnread: (state) => {
      state.unreadTotal = 0;
      state.unreadCounts = {};
    },

    updateMessageReadStatus: (state, action) => {
      const { senderId, receiverId } =
        action.payload || {};

      if (!senderId || !receiverId) {
        return;
      }

      state.messages = state.messages.map(
        (message) => {
          const messageSenderId =
            message?.senderId?._id ||
            message?.senderId?.id ||
            message?.senderId;

          const messageReceiverId =
            message?.receiverId?._id ||
            message?.receiverId?.id ||
            message?.receiverId;

          const isSameMessageConversation =
            messageSenderId?.toString() ===
              receiverId?.toString() &&
            messageReceiverId?.toString() ===
              senderId?.toString();

          if (isSameMessageConversation) {
            return {
              ...message,
              isRead: true,
            };
          }

          return message;
        }
      );
    },

    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  setSelectedContact,
  clearSelectedContact,
  setMessages,
  addMessage,
  setLoadingMessages,
  setSendingMessage,
  updateMessageReadStatus,
  clearMessages,
  setCurUser,

  setUnreadMessages,
  incrementUnread,
  clearUnread,
  clearAllUnread,
} = chatSlice.actions;

export default chatSlice.reducer;