// components/ChatModal.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdClose } from "react-icons/md";
import { FaRegSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { getKey } from "../utils/localStorage";
import { ChatMessage } from "../types/message";

interface ChatModalProps {
  show: boolean;
  onClose: () => void;
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (msg: string) => void;
  sendMessage: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({
  show,
  onClose,
  chatMessages,
  chatInput,
  setChatInput,
  sendMessage,
}) => {
  if (!show) return null;

  const userData = getKey("user");
  const userId = userData._id;
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData: any) => {
    setChatInput(chatInput + emojiData.emoji);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="fixed top-16 right-6 w-96 max-h-[80vh] bg-white rounded-xl shadow-xl z-50 p-6 border border-gray-300 flex flex-col"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-indigo-700">Chat</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <MdClose size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 border-t border-b py-3">
        {chatMessages.length ? (
          chatMessages.map((msg, i) => {
            const isCurrentUser = msg.userId === userId;

            return (
              <div key={i} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] text-sm text-gray-800 px-3 py-2 rounded-lg shadow-sm ${
                    isCurrentUser
                      ? "bg-gradient-to-br from-teal-100 to-lime-100"
                      : "bg-gradient-to-br from-yellow-100 to-orange-100"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1 gap-4">
                    <span className="font-semibold text-gray-700">{msg.username}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div>{msg.message}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-400 text-sm">No messages yet</div>
        )}
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-28 right-6 z-50">
          <EmojiPicker onEmojiClick={onEmojiClick} theme="light" />
        </div>
      )}

      <div className="flex gap-2 items-center">
        <button
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="text-xl text-gray-600 hover:text-gray-800"
          title="Emoji"
        >
          <FaRegSmile />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </div>
    </motion.div>
  );
};

export default ChatModal;
