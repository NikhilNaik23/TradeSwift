import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import api from "../../utils/axios";
import toast from "react-hot-toast";

const ChatBox = ({ currentUser, receiverId, productId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get(
        `/messages/user?receiver=${receiverId}&product=${productId}`
      );
      setMessages(res.data.chats);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch messages");
    }
  };

  const markMessagesRead = async () => {
    try {
      await api.put("/messages/mark-read", {
        userId: currentUser._id,
        senderId: receiverId,
        productId,
      });
    } catch (error) {
      console.error("Failed to mark messages as read", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const res = await api.post("/messages", {
        receiver: receiverId,
        product: productId,
        message: input.trim(),
      });
      setMessages((prev) => [...prev, res.data.chat]);
      setInput("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    }
  };

  useEffect(() => {
    fetchMessages();
    markMessagesRead();
  }, [receiverId, productId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🧠 Helper to handle both object and string sender
  const isCurrentUser = (sender) => {
    if (!sender) return false;
    return typeof sender === "string"
      ? sender === currentUser._id
      : sender._id === currentUser._id;
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 bg-white rounded-2xl shadow-xl flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-blue-300 flex flex-col">
        {messages.map((msg, i) => (
          <motion.div
            key={msg._id}
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
              className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
                isCurrentUser(msg.sender)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.message}
            </div>
          </motion.div>
        ))}
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
          type="text"
          className="flex-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
