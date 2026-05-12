import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import { axiosInstance } from "../lib/axios";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,

    subscribeToTyping,
    unsubscribeFromTyping,

    subscribeToSeen,
    unsubscribeFromSeen,
  } = useChatStore();

  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser) return;

    const loadMessages = async () => {
      await getMessages(selectedUser._id);

      // ✅ mark messages seen
      await axiosInstance.put(`/messages/seen/${selectedUser._id}`);
    };

    loadMessages();

    // ✅ chat-specific listeners only
    subscribeToTyping?.();
    subscribeToSeen();

    return () => {
      unsubscribeFromTyping?.();
      unsubscribeFromSeen();
    };
  }, [selectedUser]);

  // ✅ auto scroll
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (!selectedUser) return null;

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col h-full bg-base-100">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-base-100">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {

          const isMyMessage =
            String(message.senderId) === String(authUser._id);

          return (
            <div
              key={message._id}
              className={`chat ${
                isMyMessage ? "chat-end" : "chat-start"
              }`}
            >
              {/* Avatar */}
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isMyMessage
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile"
                  />
                </div>
              </div>

              {/* Time */}
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              {/* Message Bubble */}
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    className="sm:max-w-[200px] rounded-md mb-2"
                    alt="attachment"
                  />
                )}

                {message.text && <p>{message.text}</p>}

                {/* Status */}
                {isMyMessage && (
                  <span className="text-xs mt-1 text-right">
                    {message.status === "sent" && "✓"}

                    {message.status === "delivered" && "✓✓"}

                    {message.status === "seen" && (
                      <span className="text-blue-500">
                        ✓✓
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* ✅ proper scroll anchor */}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;