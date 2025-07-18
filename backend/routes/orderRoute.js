import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrdersAsSellers,
} from "../controllers/orderController.js";
import { protectRoute, restrictToRoles } from "../middlewares/protectRoute.js";
const router = express.Router();

router.post("/", protectRoute, restrictToRoles("buyer"), createOrder);
router.get("/my", protectRoute, restrictToRoles("buyer"), getMyOrders);
router.get("/sold", protectRoute, restrictToRoles("buyer"), getOrdersAsSellers);
router.get(
  "/:id",
  protectRoute,
  restrictToRoles("buyer", "seller"),
  getOrderById
);

export default router;
