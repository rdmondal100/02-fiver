import axiosInstance from "@/config/axiosConfig";
import { getSocket } from "@/utils/socket";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Fetch chat users list
export const fetchChatUserList = createAsyncThunk(
  "chat/fetchChatUserList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/users/search`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching users");
    }
  }
);

// Search users
export const searchUsers = createAsyncThunk(
  "chat/searchUsers",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/users/search`, {
        params: { q: searchTerm },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error searching users");
    }
  }
);

// Fetch conversation between two users
export const fetchConversationHistory = createAsyncThunk(
  "chat/fetchConversationHistory",
  async ({ userId1, userId2 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/chat/conversation/${userId1}/${userId2}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching conversation"
      );
    }
  }
);

// Create a new message
export const createNewMessage = createAsyncThunk(
  "chat/createNewMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/chat/send`, messageData, {
        headers: {
          ...(messageData instanceof FormData
            ? {}
            : { "Content-Type": "application/json" }),
        },
      });

      // Emit the message through socket if available
      const socket = getSocket();
      if (socket) {
        socket.emit("sendMessage", {
          ...response.data,
          receiverId: messageData.get
            ? messageData.get("receiverId")
            : messageData.receiverId,
          senderId: messageData.get
            ? messageData.get("senderId")
            : messageData.senderId,
        });
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error sending message");
    }
  }
);

// Fetch all chats for current user
export const fetchAllChats = createAsyncThunk(
  "chat/fetchAllChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching chats");
    }
  }
);

export const fetchAllChatsSilent = createAsyncThunk(
  "chat/fetchAllChatsSilent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching chats");
    }
  }
);

export const selectTotalUnreadCount = (state) =>
  state.chat.chatList.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);


// ========================== Chat Slice ==========================

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    users: [], // List of chat users
    filteredUsers: [],
    chatList: [], // List of chats with other users
    conversation: [], // Conversation history between two users
    selectedUser: null, // The currently selected chat user
    status: "idle", // Loading status for async actions
    error: null, // Error state for handling errors
  },
  reducers: {
    // Select a user to chat with
    selectChatUser: (state, action) => {
      state.selectedUser = action.payload;
      state.conversation = []; // Reset conversation when a new user is selected

      // Join socket room when selecting a user
      if (action.payload?._id) {
        const socket = getSocket();
        if (socket) {
          socket.emit("join", action.payload._id);
        }
      }
    },

    // Update the last login time of the selected user
    updateSelectedUserLastLogin: (state, action) => {
      const newLastLogin = action.payload;
      if (state.selectedUser) {
        state.selectedUser.lastLoggedIn = newLastLogin;
      }
    },

    // reset the selected user
    resetSelectedUser: (state) => {
      state.selectedUser = null;
      state.conversation = []; // Reset conversation when a new user is selected
    },

    // Add new message to the conversation
    addNewMessageToConversation: (state, action) => {
      const message = action.payload;
      console.log(message, "new Message Added")
      // Check if the message already exists (more robust duplicate detection)
      const messageExists = state.conversation.some(
        (m) =>
          m._id === message._id ||
          (m.content === message.content &&
            m.senderId === message.senderId &&
            Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 1000)
      );

      if (!messageExists) {
        state.conversation.push(message);
        // Sort messages by timestamp
        state.conversation.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        // Update the chat list with the latest message
        const chatIndex = state.chatList.findIndex(
          (chat) =>
            chat.participants.includes(message.senderId) &&
            chat.participants.includes(message.receiverId)
        );

        if (chatIndex !== -1) {
          state.chatList[chatIndex].lastMessage = message;
          state.chatList[chatIndex].updatedAt = message.timestamp;
        }
      }
    },
    // Add incoming message to the chat
    addIncomingMessage: (state, action) => {
      const message = action.payload;
      console.log(message, "added incoming message")
      // Check if this is a message in the current conversation
      const isCurrentConversation =
        state.selectedUser?._id === message.senderId ||
        state.selectedUser?._id === message.receiverId;

      if (isCurrentConversation) {
        // Check if the message already exists in the conversation (more robust duplicate detection)
        const messageExists = state.conversation.some(
          (m) =>
            m._id === message._id ||
            (m.content === message.content &&
              m.senderId === message.senderId &&
              Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 1000)
        );

        if (!messageExists) {
          state.conversation.push(message);
          // Sort messages by timestamp
          state.conversation.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          // Update the chat list with the latest message
          const chatIndex = state.chatList.findIndex(
            (chat) =>
              chat.participants.includes(message.senderId) &&
              chat.participants.includes(message.receiverId)
          );

          if (chatIndex !== -1) {
            state.chatList[chatIndex].lastMessage = message;
            state.chatList[chatIndex].updatedAt = message.timestamp;
          }
        }
      }
    },
    clearChatState: (state) => {
      state.users = [];
      state.filteredUsers = [];
      state.conversation = [];
      state.selectedUser = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch chat users
      .addCase(fetchChatUserList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchChatUserList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
        state.filteredUsers = action.payload;
      })
      .addCase(fetchChatUserList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Search users
      .addCase(searchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.filteredUsers = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch conversation history between users
      .addCase(fetchConversationHistory.pending, (state, action) => {
        if (!action.meta.arg.silent) {
          state.status = "loading";
        }
      })
      .addCase(fetchConversationHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversation = action.payload;
      })
      .addCase(fetchConversationHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch all chats
      .addCase(fetchAllChats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllChatsSilent.fulfilled, (state, action) => {
        state.chatList = action.payload;
      })
      .addCase(fetchAllChats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.chatList = action.payload;

        // Update users list with the latest chat information
        state.users = state.users.map((user) => {
          const userChat = action.payload.find((chat) =>
            chat.participants.includes(user._id)
          );
          return {
            ...user,
            hasChat: !!userChat,
          };
        });
      })
      .addCase(fetchAllChats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Create new message
      .addCase(createNewMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        const message = action.payload;

        // Update chat list with new message
        const chatIndex = state.chatList.findIndex(
          (chat) =>
            chat.participants.includes(message.senderId) &&
            chat.participants.includes(message.receiverId)
        );

        if (chatIndex !== -1) {
          state.chatList[chatIndex].lastMessage = message;
        }

        // Also update conversation if this is the current chat
        if (
          state.selectedUser &&
          (state.selectedUser._id === message.senderId ||
            state.selectedUser._id === message.receiverId)
        ) {
          // Check if message already exists to prevent duplicates
          const messageExists = state.conversation.some(
            (m) =>
              m._id === message._id ||
              (m.content === message.content &&
                m.senderId === message.senderId &&
                Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 1000)
          );

          if (!messageExists) {
            state.conversation.push(message);
            // Sort messages by timestamp
            state.conversation.sort(
              (a, b) =>
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
          }
        }
      });
  },
});

export const {
  selectChatUser,
  addNewMessageToConversation,
  addIncomingMessage,
  clearChatState,
  updateSelectedUserLastLogin,
  resetSelectedUser
} = chatSlice.actions;

export default chatSlice.reducer;
