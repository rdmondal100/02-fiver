import io from "socket.io-client";
import {
  addIncomingMessage,
  addNewMessageToConversation,
} from "./features/user/chatSlice";
import toast from "react-hot-toast";
import { BASE_URL } from './config/urls';

let socket = null;
let store = null;

export const initializeSocket = (reduxStore) => {
  store = reduxStore;

  if (!socket) {
    socket = io(BASE_URL, {
      withCredentials: true,
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      toast.error("Connection error. Trying to reconnect...");
    });

    socket.on("receiveMessage", (message) => {
      console.log("Received message:", message);
      if (store) {
        store.dispatch(addIncomingMessage(message));
      }
    });

    socket.on("messageSent", (message) => {
      console.log("Message sent confirmation:", message);
      if (store) {
        store.dispatch(addNewMessageToConversation(message));
      }
    });

    socket.on("messageError", (error) => {
      console.error("Message error:", error);
      toast.error("Failed to send message. Please try again.");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      toast.error("Disconnected from chat server");
    });

    socket.on("reconnect", () => {
      console.log("Socket reconnected");
      toast.success("Reconnected to chat server");
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    store = null;
  }
};
