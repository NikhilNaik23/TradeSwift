import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrdersAsSellers,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protectRoute, restrictToRoles } from "../middlewares/protectRoute.js";
const router = express.Router();

router.post("/", protectRoute, restrictToRoles("buyer"), createOrder);
router.get("/my", protectRoute, restrictToRoles("buyer"), getMyOrders);
router.get("/sold", protectRoute, restrictToRoles("seller"), getOrdersAsSellers);
router.get(
  "/:id",
  protectRoute,
  restrictToRoles("buyer", "seller"),
  getOrderById
);
router.put(
  "/:id/status",
  protectRoute,
  restrictToRoles("seller"),
  updateOrderStatus
);

export default router;
