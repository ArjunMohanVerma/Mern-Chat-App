import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isTyping: false,
  unreadCounts: {}, // { userId: number }

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, messages } = get();

      // ✅ If chat is open → show message
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        set({
          messages: [...messages, newMessage],
        });
        axiosInstance.put(`/messages/seen/${newMessage.senderId}`);
      }
      // ✅ Otherwise → increase unread
      else {
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [newMessage.senderId]:
              (state.unreadCounts[newMessage.senderId] || 0) + 1,
          },
        }));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  subscribeToTyping: () => {
    const socket = useAuthStore.getState().socket;
    const { selectedUser } = get();

    if (!socket || !selectedUser) return;

    // ✅ prevent duplicate listeners
    socket.off("typing");
    socket.off("stopTyping");

    socket.on("typing", ({ senderId }) => {
      if (senderId === selectedUser._id) {
        set({ isTyping: true });
      }
    });

    socket.on("stopTyping", ({ senderId }) => {
      if (senderId === selectedUser._id) {
        set({ isTyping: false });
      }
    });
  },

  unsubscribeFromTyping: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("typing");
    socket.off("stopTyping");
  },

subscribeToSeen: () => {
  const socket = useAuthStore.getState().socket;
  const authUser = useAuthStore.getState().authUser;

  if (!socket || !authUser) return;

  socket.off("messagesSeen");

  socket.on("messagesSeen", ({ senderId }) => {
    const updatedMessages = get().messages.map((msg) => {
      // ✅ only update MY sent messages
      if (
        msg.senderId === authUser._id &&
        msg.receiverId === senderId
      ) {
        return {
          ...msg,
          status: "seen",
        };
      }

      return msg;
    });

    set({ messages: updatedMessages });
  });
},
  unsubscribeFromSeen: () => {
    const socket = useAuthStore.getState().socket;

    if (!socket) return;

    socket.off("messagesSeen");
  },

  setSelectedUser: (selectedUser) =>
    set((state) => ({
      selectedUser,
      isTyping: false,
      messages: [],

      // ✅ SAFE handling when null
      unreadCounts: selectedUser
        ? {
            ...state.unreadCounts,
            [selectedUser._id]: 0,
          }
        : state.unreadCounts,
    })),

}));
