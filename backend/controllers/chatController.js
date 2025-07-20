import Chat from "../models/chatModel.js";
import mongoose from "mongoose";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

const objectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const sendMessage = async (req, res) => {
  try {
    const sender = req.user._id;
    const { receiver, product } = req.body;
    const { message } = req.body;

    if (!objectId(receiver) || !objectId(product)) {
      return res
        .status(400)
        .json({ message: "Invalid receiver or product ID" });
    }

    if (!message || message.trim() === "") {
      return res
        .status(400)
        .json({ message: "Message content cannot be empty" });
    }

    const newMessage = await Chat.create({
      sender,
      receiver,
      product,
      message,
    });

    res
      .status(201)
      .json({ message: "Message sent successfully", chat: newMessage });
  } catch (error) {
    console.error("sendMessage Controller Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessagesWithUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { receiver, product } = req.query;

    if (!objectId(receiver) || !objectId(product)) {
      return res
        .status(400)
        .json({ message: "Invalid receiver or product ID" });
    }

    const messages = await Chat.find({
      product,
      $or: [
        { sender: userId, receiver },
        { sender: receiver, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name")
      .populate("receiver", "name");

    res.status(200).json({ message: "Messages retrieved", chats: messages });
  } catch (error) {
    console.error("getMessagesWithUser Controller Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessagesByProduct = async (req, res) => {
  try {
    const { id: product } = req.params;

    if (!objectId(product)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const messages = await Chat.find({ product })
      .sort({ createdAt: 1 })
      .populate("sender", "name")
      .populate("receiver", "name");

    res
      .status(200)
      .json({ message: "Messages fetched successfully", chat: messages });
  } catch (error) {
    console.error("getMessagesByProduct Controller Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSellerInbox = async (req, res) => {
  try {
    console.log(req.user._id);
    const sellerId = req.user._id;
    const chats = await Chat.aggregate([
      { $match: { receiver: sellerId } },
      {
        $group: {
          _id: { buyer: "$sender", product: "$product" },
          lastMessage: { $last: "$message" },
          lastAt: { $last: "$createdAt" },
        },
      },
      { $sort: { lastAt: -1 } },
    ]);

    for (let c of chats) {
      c.buyer = await User.findById(c._id.buyer).select("name email role");

      c.product = await Product.findById(c._id.product).select("title images");
    }

    res.status(200).json({ inbox: chats });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const markRead = async (req, res) => {
  const { userId, senderId, productId } = req.body;

  try {
    await Chat.updateMany(
      {
        receiver: userId,
        sender: senderId,
        product: productId,
        isRead: false,
      },
      { isRead: true }
    );

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update messages' });
  }
}