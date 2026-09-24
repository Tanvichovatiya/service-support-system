

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedContact: null,
  curUser: null,

  messages: [],

  loadingMessages: false,
  sendingMessage: false,
};

const getId = (value) => {
  if (!value) return null;

  if (typeof value === "object") {
    return value._id || value.id || null;
  }

  return value;
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

      if (!newMessage) return;

      const newMessageId = getId(newMessage._id || newMessage.id);

      const exists = state.messages.some((message) => {
        const messageId = getId(
          message?._id || message?.id
        );

        return (
          messageId &&
          newMessageId &&
          messageId.toString() === newMessageId.toString()
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

    updateMessageReadStatus: (state, action) => {
      const { senderId, receiverId } =
        action.payload || {};


      state.messages = state.messages.map((message) => {
        const messageSenderId = getId(
          message?.senderId
        );

        const messageReceiverId = getId(message?.receiverId);

        const isSameConversation =
          messageSenderId?.toString() ===
            receiverId?.toString() &&
          messageReceiverId?.toString() ===
            senderId?.toString();

        if (isSameConversation) {
          return {
            ...message,
            isRead: true,
          };
        }

        return message;
      });
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
} = chatSlice.actions;

export default chatSlice.reducer;