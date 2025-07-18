import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
const router = express.Router();

router.get("/", protectRoute, getWishlist);
router.post("/:id", protectRoute, addToWishlist);
router.delete("/:id", protectRoute, removeFromWishlist);

export default router;
