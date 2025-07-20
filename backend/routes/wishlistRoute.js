import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearCart
} from "../controllers/wishlistController.js";
const router = express.Router();

router.get("/", protectRoute, getWishlist);
router.post("/:id", protectRoute, addToWishlist);
router.delete("/:id", protectRoute, removeFromWishlist);
router.delete("/", protectRoute, clearCart);
export default router;
