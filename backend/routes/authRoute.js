import express from "express";
import {
  deactivateAccount,
  getUserProfile,
  loginUser,
  registerUser,
  switchRole,
  updateUserProfile,
} from "../controllers/authController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protectRoute, getUserProfile);
router.put("/update-me", protectRoute, updateUserProfile);
router.patch("/deactivate", protectRoute, deactivateAccount);
router.patch("/switch-role", protectRoute, switchRole);

export default router;
