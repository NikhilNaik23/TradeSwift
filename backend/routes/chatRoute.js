import express from "express";
import {
  getMessagesByProduct,
  getMessagesWithUser,
  getSellerInbox,
  markRead,
  sendMessage,
} from "../controllers/chatController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
const router = express.Router();

router.post("/", protectRoute, sendMessage);
router.get("/user", protectRoute, getMessagesWithUser);
router.get("/inbox", protectRoute, getSellerInbox);
router.put('/mark-read', protectRoute,markRead);
router.get("/product/:id", protectRoute, getMessagesByProduct);



export default router;
