import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url"; 
dotenv.config();

import connectDB from "./config/db.js";
import apis from "./apis/apis.js";
import Chat from "./models/chatModel.js";
import User from "./models/userModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
apis(app);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

// Utility: always sort user IDs for consistent room
function getChatRoomId(userId1, userId2, productId) {
  return [String(userId1), String(userId2)].sort().join("_") + "_" + productId;
}

// --- SOCKET.IO SETUP ---
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// SOCKET.IO AUTH
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];
    if (!token) return next(new Error("No token"));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.user_id) return next(new Error("Bad token"));
    const user = await User.findById(decoded.user_id).select("-password");
    if (!user) return next(new Error("No user"));
    socket.user = user;
    next();
  } catch (e) {
    return next(new Error("Auth failed"));
  }
});

// SOCKET.IO CONNECTION
io.on("connection", (socket) => {
  console.log(`✅ Connected: ${socket.user.name} (${socket.id})`);

  // Always re-join room after connect/reconnect
  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    // Log all sockets in this room for debugging:
    console.log("Members in room:", Array.from(io.sockets.adapter.rooms.get(roomId) || []));
  });

  // Message Handling
  socket.on("sendMessage", async ({ message, receiver, product }) => {
    try {
      const sender = socket.user._id.toString();
      const roomId = getChatRoomId(sender, receiver, product);

      const newMessage = await Chat.create({
        sender,
        receiver,
        product,
        message,
      });

      await newMessage.populate("sender", "name");
      await newMessage.populate("receiver", "name");

      io.to(roomId).emit("receiveMessage", newMessage);
      console.log(`[SEND] To room ${roomId}:`, newMessage.message);
    } catch (e) {
      socket.emit("error", { message: "Send failed" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`🚫 Disconnected: ${socket.user.name} (${socket.id})`);
  });
});



server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
