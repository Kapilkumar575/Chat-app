import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./MessageSkeletion";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessages(selectedUser._id);
    subscribeToMessages();

    // Listen for typing events
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.on("typing", () => setIsTyping(true));
      socket.on("stopTyping", () => setIsTyping(false));
    }

    return () => {
      unsubscribeFromMessages();
      if (socket) {
        socket.off("typing");
        socket.off("stopTyping");
      }
    };
  }, [selectedUser?._id]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const showDateSeparator = (curr, prev) => {
    if (!prev) return true;

    const currDate = new Date(curr.createdAt).toDateString();
    const prevDate = new Date(prev.createdAt).toDateString();

    return currDate !== prevDate;
  };

  const getDayLabel = (timestamp) => {
    const msgDate = new Date(timestamp);
    const today = new Date();

    if (msgDate.toDateString() === today.toDateString()) return "Today";
    if (
      msgDate.toDateString() ===
      new Date(today.setDate(today.getDate() - 1)).toDateString()
    )
      return "Yesterday";

    return msgDate.toDateString();
  };

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-base-100 to-base-200">

      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-bg">
        {messages.map((message, index) => (
          <div key={message._id}>

            {/* DATE SEPARATOR */}
            {showDateSeparator(message, messages[index - 1]) && (
              <div className="text-center text-xs text-gray-400 my-3">
                {getDayLabel(message.createdAt)}
              </div>
            )}

            <div
              className={`chat ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              } animate-fadeIn`}
              ref={index === messages.length - 1 ? messageEndRef : null}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic ||
                          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        : selectedUser.profilePic ||
                          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                  />
                </div>
              </div>

              <div className="chat-header">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <div className="chat-bubble flex flex-col shadow-sm">
                {/* Image Attachment */}
                {message.image && (
                  <img
                    src={message.image}
                    alt=""
                    className="rounded-md mb-2 max-w-[250px]"
                  />
                )}

                {/* Text */}
                {message.text && <p>{message.text}</p>}

                {/* SEEN / DELIVERED */}
                {message.senderId === authUser._id && (
                  <div className="text-[10px] opacity-60 flex justify-end mt-1">
                    ✓✓ Seen
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="chat chat-start">
            <div className="chat-bubble bg-base-300 flex gap-1">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}

      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
