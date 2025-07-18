import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  markProductAsSold,
  updateProduct,
} from "../controllers/productController.js";
import { protectRoute, restrictToRoles } from "../middlewares/protectRoute.js";
import upload from "../middlewares/uploadImage.js";
const router = express.Router();

router.post(
  "/",
  protectRoute,
  restrictToRoles("seller"),
  upload.array("images", 5),
  createProduct
);
router.get("/", protectRoute, getAllProducts);
router.get("/:id", protectRoute, getProductById);
router.put("/:id", protectRoute, restrictToRoles("seller"), updateProduct);
router.delete("/:id", protectRoute, restrictToRoles("seller"), deleteProduct);
router.patch(
  "/:id/sold",
  protectRoute,
  restrictToRoles("seller"),
  markProductAsSold
);

export default router;
