import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getAllProductsOfSeller,
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
router.get("/", getAllProducts);
router.get("/seller-products", protectRoute, restrictToRoles("seller"), getAllProductsOfSeller);
router.get("/:id", getProductById);
router.put("/:id", protectRoute, restrictToRoles("seller"), updateProduct);
router.delete("/:id", protectRoute, restrictToRoles("seller"), deleteProduct);
router.patch(
  "/:id/sold",
  protectRoute,
  restrictToRoles("seller"),
  markProductAsSold
);

export default router;
