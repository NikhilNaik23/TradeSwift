import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function getChatRoomId(userId1, userId2, productId) {
  return [String(userId1), String(userId2)].sort().join("_") + "_" + productId;
}

const ChatBox = ({ currentUser, receiverId, productId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    if (!currentUser || !receiverId || !productId) return;

    socket.current = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });
    const roomId = getChatRoomId(currentUser._id, receiverId, productId);

    socket.current.on("connect", () => {
      socket.current.emit("joinRoom", { roomId });
      console.log("[Socket] Joined room:", roomId);
    });

    socket.current.on("receiveMessage", (msg) => {
      console.log("[Socket] receiveMessage", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [currentUser, receiverId, productId]);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/messages/user?receiver=${receiverId}&product=${productId}`
        );
        setMessages(res.data.chats);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [receiverId, productId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      const res = await api.post("/messages", {
        receiver: receiverId,
        product: productId,
        message: input,
      });

      setInput("");
      const roomId = getChatRoomId(currentUser._id, receiverId, productId);
      socket.current.emit("sendMessage", {
        message: res.data.chat.message,
        receiver: receiverId,
        product: productId,
      });
    } catch (e) {
      toast.error("Send failed");
    }
  };

  const isCurrentUser = (sender) =>
    String(sender?._id || sender) === String(currentUser._id);

  return (
    <div className="w-full max-w-xl mx-auto p-4 bg-white rounded-2xl shadow-xl flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto space-y-2 flex flex-col">
        {loading ? (
          <p className="text-center text-gray-500 mt-4">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-4">No messages yet</p>
        ) : (
          messages.map((msg, i) => (
            <motion.div
              key={msg._id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex"
              style={{
                justifyContent: isCurrentUser(msg.sender)
                  ? "flex-end"
                  : "flex-start",
              }}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg text-sm break-words ${
                  isCurrentUser(msg.sender)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.message}
                <br />
                <small className="text-xs text-gray-300 mt-1 block text-right">
                  {msg.createdAt &&
                    new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </small>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef}></div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex mt-4"
      >
        <input
          ref={inputRef}
          type="text"
          className="flex-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className={`ml-2 px-4 py-2 rounded-xl text-white ${
            input.trim()
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-300 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
